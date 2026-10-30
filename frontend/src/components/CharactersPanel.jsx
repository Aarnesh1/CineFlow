
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getCharacters,
  createCharacter,
  updateCharacter,
  deleteCharacter,
} from "../services/characterService";
import "../styles/characters.css";

const emptyForm = {
  name: "",
  characterRole: "Supporting",
  description: "",
  personality: "",
  backstory: "",
};

const roles = [
  "Protagonist",
  "Antagonist",
  "Supporting",
  "Cameo",
  "Other",
];

function CharactersPanel({ projectId }) {
  const [characters, setCharacters] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadCharacters = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCharacters(projectId);
      setCharacters(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load characters."
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  const filteredCharacters = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return characters;

    return characters.filter((character) =>
      [
        character.name,
        character.characterRole,
        character.description,
        character.personality,
        character.backstory,
      ]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [characters, search]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function handleEdit(character) {
    setEditingId(character.id);
    setForm({
      name: character.name || "",
      characterRole: character.characterRole || "Supporting",
      description: character.description || "",
      personality: character.personality || "",
      backstory: character.backstory || "",
    });

    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Please enter a character name.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      characterRole: form.characterRole,
      description: form.description.trim(),
      personality: form.personality.trim(),
      backstory: form.backstory.trim(),
    };

    try {
      setSaving(true);
      setError("");
      setMessage("");

      if (editingId) {
        await updateCharacter(projectId, editingId, payload);
        setMessage("Character updated successfully.");
      } else {
        await createCharacter(projectId, payload);
        setMessage("Character created successfully.");
      }

      resetForm();
      await loadCharacters();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not save the character. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(character) {
    const confirmed = window.confirm(
      `Delete "${character.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(character.id);
      setError("");
      setMessage("");

      await deleteCharacter(projectId, character.id);

      if (editingId === character.id) {
        resetForm();
      }

      setMessage("Character deleted successfully.");
      await loadCharacters();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not delete the character."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="characters-panel">
      <div className="characters-heading">
        <div>
          <p className="projects-eyebrow">CHARACTER DEVELOPMENT</p>
          <h2>Characters</h2>
          <p className="workspace-description">
            Build memorable characters with clear roles, personalities,
            and backstories.
          </p>
        </div>

        <div className="characters-total">
          <span>TOTAL CAST</span>
          <strong>{characters.length}</strong>
        </div>
      </div>

      {error && (
        <div className="characters-alert error" role="alert">
          {error}
        </div>
      )}

      {message && (
        <div className="characters-alert success" role="status">
          {message}
        </div>
      )}

      <div className="characters-layout">
        <section className="character-editor">
          <div className="character-editor-heading">
            <div>
              <p className="projects-eyebrow">
                {editingId ? "EDIT PROFILE" : "NEW PROFILE"}
              </p>
              <h3>
                {editingId ? "Refine your character" : "Create a character"}
              </h3>
            </div>

            {editingId && (
              <button
                type="button"
                className="character-text-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <label className="character-label" htmlFor="character-name">
              Character name *
            </label>
            <input
              id="character-name"
              className="character-input"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Babu"
              maxLength={150}
              required
            />

            <label className="character-label" htmlFor="character-role">
              Character role
            </label>
            <select
              id="character-role"
              className="character-input"
              name="characterRole"
              value={form.characterRole}
              onChange={handleChange}
              required
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <label className="character-label" htmlFor="character-description">
              Description
            </label>
            <textarea
              id="character-description"
              className="character-textarea"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Age, appearance, occupation, and other details..."
              maxLength={10000}
              rows={3}
            />

            <label className="character-label" htmlFor="character-personality">
              Personality and motivations
            </label>
            <textarea
              id="character-personality"
              className="character-textarea"
              name="personality"
              value={form.personality}
              onChange={handleChange}
              placeholder="What does this character want? What are their strengths and flaws?"
              maxLength={10000}
              rows={3}
            />

            <label className="character-label" htmlFor="character-backstory">
              Backstory
            </label>
            <textarea
              id="character-backstory"
              className="character-textarea"
              name="backstory"
              value={form.backstory}
              onChange={handleChange}
              placeholder="Describe the experiences that shaped this character..."
              maxLength={20000}
              rows={4}
            />

            <button
              type="submit"
              className="character-primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save changes"
                  : "+ Create character"}
            </button>
          </form>
        </section>

        <section className="character-list">
          <div className="character-list-heading">
            <div>
              <p className="projects-eyebrow">YOUR CAST</p>
              <h3>Character profiles</h3>
            </div>
            <span className="character-count">{characters.length}</span>
          </div>

          <input
            className="character-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search names, roles, or details..."
            aria-label="Search characters"
          />

          {loading ? (
            <div className="character-list-state">
              <div className="projects-loader" />
              <p>Loading characters...</p>
            </div>
          ) : filteredCharacters.length === 0 ? (
            <div className="character-list-state">
              <span className="character-empty-icon">♙</span>
              <h4>
                {search ? "No matching characters" : "Your cast starts here"}
              </h4>
              <p>
                {search
                  ? "Try another search term."
                  : "Create your first character using the form."}
              </p>
            </div>
          ) : (
            <div className="character-cards">
              {filteredCharacters.map((character) => (
                <article
                  className={`character-card ${
                    editingId === character.id ? "selected" : ""
                  }`}
                  key={character.id}
                >
                  <div className="character-card-top">
                    <div className="character-avatar" aria-hidden="true">
                      {character.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="character-card-title">
                      <h4>{character.name}</h4>
                      <span className="character-role">
                        {character.characterRole}
                      </span>
                    </div>
                  </div>

                  {character.description && (
                    <p className="character-card-description">
                      {character.description}
                    </p>
                  )}

                  {character.personality && (
                    <div className="character-detail">
                      <strong>Personality</strong>
                      <p>{character.personality}</p>
                    </div>
                  )}

                  {character.backstory && (
                    <div className="character-detail">
                      <strong>Backstory</strong>
                      <p>{character.backstory}</p>
                    </div>
                  )}

                  <div className="character-card-actions">
                    <button
                      type="button"
                      className="character-text-button"
                      onClick={() => handleEdit(character)}
                    >
                      Edit profile
                    </button>

                    <button
                      type="button"
                      className="character-delete-button"
                      disabled={deletingId === character.id}
                      onClick={() => handleDelete(character)}
                    >
                      {deletingId === character.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default CharactersPanel;
