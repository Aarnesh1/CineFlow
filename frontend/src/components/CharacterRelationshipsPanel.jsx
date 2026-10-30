
import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import {
  getRelationships,
  createRelationship,
  updateRelationship,
  deleteRelationship,
} from "../services/relationshipService";
import CharacterRelationshipMap from "./CharacterRelationshipMap";
import "../styles/relationships.css";

const RELATIONSHIP_TYPES = [
  "Friend",
  "Family",
  "Romantic",
  "Rivals",
  "Enemies",
  "Mentor",
  "Colleague",
  "Other",
];

const EMPTY_FORM = {
  sourceCharacterId: "",
  targetCharacterId: "",
  relationshipType: "Friend",
  description: "",
};

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

export default function CharacterRelationshipsPanel({ projectId }) {
  const [characters, setCharacters] = useState([]);
  const [relationships, setRelationships] = useState([]);

  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const characterById = useMemo(
    () => new Map(characters.map((character) => [
      String(character.id),
      character,
    ])),
    [characters]
  );

  const loadData = useCallback(async () => {
    if (!projectId) {
      setError("A project ID is required to load relationships.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [characterResponse, relationshipResponse] =
        await Promise.all([
          api.get(`/projects/${projectId}/characters`),
          getRelationships(projectId),
        ]);

      const characterData = Array.isArray(characterResponse.data)
        ? characterResponse.data
        : [];

      const relationshipData = Array.isArray(relationshipResponse)
        ? relationshipResponse
        : [];

      setCharacters(characterData);
      setRelationships(relationshipData);
    } catch (err) {
      setError(
        getErrorMessage(err, "Failed to load characters and relationships.")
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleFormChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.sourceCharacterId || !form.targetCharacterId) {
      setError("Please select both characters.");
      return;
    }

    if (form.sourceCharacterId === form.targetCharacterId) {
      setError("A character cannot have a relationship with themselves.");
      return;
    }

    if (!form.relationshipType.trim()) {
      setError("Please select a relationship type.");
      return;
    }

    const payload = {
      sourceCharacterId: form.sourceCharacterId,
      targetCharacterId: form.targetCharacterId,
      relationshipType: form.relationshipType.trim(),
      description: form.description.trim(),
    };

    setSaving(true);

    try {
      if (editingId) {
        await updateRelationship(projectId, editingId, payload);
        setSuccess("Relationship updated successfully.");
      } else {
        await createRelationship(projectId, payload);
        setSuccess("Relationship added successfully.");
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(
        getErrorMessage(err, "Failed to save the relationship.")
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(relationship) {
    setEditingId(relationship.id);

    setForm({
      sourceCharacterId: String(relationship.sourceCharacterId),
      targetCharacterId: String(relationship.targetCharacterId),
      relationshipType: relationship.relationshipType || "Friend",
      description: relationship.description || "",
    });

    setError("");
    setSuccess("");

    document
      .getElementById("relationship-editor")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  async function handleDelete(relationship) {
    const source = characterById.get(
      String(relationship.sourceCharacterId)
    );
    const target = characterById.get(
      String(relationship.targetCharacterId)
    );

    const label = `${source?.name || "Character"} and ${
      target?.name || "Character"
    }`;

    if (!window.confirm(`Delete the relationship between ${label}?`)) {
      return;
    }

    setDeletingId(relationship.id);
    setError("");
    setSuccess("");

    try {
      await deleteRelationship(projectId, relationship.id);

      if (String(editingId) === String(relationship.id)) {
        resetForm();
      }

      setSuccess("Relationship deleted successfully.");
      await loadData();
    } catch (err) {
      setError(
        getErrorMessage(err, "Failed to delete the relationship.")
      );
    } finally {
      setDeletingId(null);
    }
  }

  function getCharacterName(characterId) {
    return (
      characterById.get(String(characterId))?.name ||
      "Unknown character"
    );
  }

  if (loading) {
    return (
      <section className="relationships-panel">
        <p className="relationships-status">
          Loading characters and relationships...
        </p>
      </section>
    );
  }

  return (
    <section className="relationships-panel">
      {/* Section heading */}
      <div className="relationships-section-heading">
        <div>
          <p className="projects-eyebrow">CHARACTER DEVELOPMENT</p>
          <h3>Character Relationships</h3>
          <p className="workspace-description">
            Connect your characters, define their dynamics, and explore
            how their relationships shape your story.
          </p>
        </div>

        <button
          type="button"
          className="relationship-clear-button"
          onClick={loadData}
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {/* Error and success messages */}
      {error && (
        <div className="relationships-message relationships-message-error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="relationships-message relationships-message-success" role="status">
          {success}
        </div>
      )}

      {/* Relationship creation and editing form */}
      <form
        id="relationship-editor"
        className="relationship-form"
        onSubmit={handleSubmit}
      >
        <div className="relationship-form-heading">
          <div>
            <h4>{editingId ? "Edit relationship" : "Add a relationship"}</h4>
            <p>
              Define the connection between two characters.
            </p>
          </div>
        </div>

        {characters.length < 2 && (
          <p className="relationships-status">
            Add at least two characters before creating a relationship.
          </p>
        )}

        <div className="relationship-form-grid">
          <div className="relationship-field">
            <label htmlFor="relationship-source">
              First character
            </label>

            <select
              id="relationship-source"
              name="sourceCharacterId"
              value={form.sourceCharacterId}
              onChange={handleFormChange}
              required
              disabled={saving || characters.length < 2}
            >
              <option value="">Select a character</option>

              {characters.map((character) => (
                <option key={character.id} value={character.id}>
                  {character.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relationship-field">
            <label htmlFor="relationship-type">
              Relationship type
            </label>

            <select
              id="relationship-type"
              name="relationshipType"
              value={form.relationshipType}
              onChange={handleFormChange}
              required
              disabled={saving}
            >
              {RELATIONSHIP_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="relationship-field">
            <label htmlFor="relationship-target">
              Second character
            </label>

            <select
              id="relationship-target"
              name="targetCharacterId"
              value={form.targetCharacterId}
              onChange={handleFormChange}
              required
              disabled={saving || characters.length < 2}
            >
              <option value="">Select a character</option>

              {characters.map((character) => (
                <option key={character.id} value={character.id}>
                  {character.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relationship-field relationship-description-field">
          <label htmlFor="relationship-description">
            Description
          </label>

          <textarea
            id="relationship-description"
            name="description"
            value={form.description}
            onChange={handleFormChange}
            placeholder="Describe their bond, conflict, history, or secrets..."
            rows={3}
            maxLength={10000}
            disabled={saving}
          />
        </div>

        <div className="relationship-form-actions">
          {editingId && (
            <button
              type="button"
              className="relationship-clear-button"
              onClick={resetForm}
              disabled={saving}
            >
              Cancel editing
            </button>
          )}

          <button
            type="submit"
            className="relationship-submit-button"
            disabled={saving || characters.length < 2}
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update relationship"
                : "Add relationship"}
          </button>
        </div>
      </form>

      {/* VISUAL MAP: intentionally rendered before the relationship list */}
      <CharacterRelationshipMap
        characters={characters}
        relationships={relationships}
      />

      {/* Relationship list */}
      <div className="relationship-list">
        <div className="relationship-list-heading">
          <div>
            <h4>Relationship List</h4>
            <p>
              {relationships.length}{" "}
              {relationships.length === 1
                ? "relationship"
                : "relationships"}{" "}
              in this project
            </p>
          </div>
        </div>

        {relationships.length === 0 ? (
          <div className="relationship-list-empty">
            <h4>No relationships yet</h4>
            <p>
              Create a relationship above to see it on the map and in
              this list.
            </p>
          </div>
        ) : (
          <div className="relationship-cards">
            {relationships.map((relationship) => (
              <article
                className="relationship-card"
                key={relationship.id}
              >
                <div className="relationship-card-header">
                  <span className="relationship-type-badge">
                    {relationship.relationshipType}
                  </span>

                  <div className="relationship-card-actions">
                    <button
                      type="button"
                      className="relationship-text-button"
                      onClick={() => handleEdit(relationship)}
                      disabled={saving || deletingId !== null}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className="relationship-text-button relationship-delete-button"
                      onClick={() => handleDelete(relationship)}
                      disabled={saving || deletingId !== null}
                    >
                      {String(deletingId) === String(relationship.id)
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </div>

                <div className="relationship-card-connection">
                  <span className="relationship-character-chip">
                    {getCharacterName(relationship.sourceCharacterId)}
                  </span>

                  <span
                    className="relationship-connection-arrow"
                    aria-label="connected to"
                  >
                    ↔
                  </span>

                  <span className="relationship-character-chip">
                    {getCharacterName(relationship.targetCharacterId)}
                  </span>
                </div>

                {relationship.description?.trim() && (
                  <p className="relationship-card-description">
                    {relationship.description}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
