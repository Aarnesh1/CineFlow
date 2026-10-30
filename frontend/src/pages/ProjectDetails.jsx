
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import CharactersPanel from "../components/CharactersPanel";
import CharacterRelationshipsPanel from "../components/CharacterRelationshipsPanel";
import {
  getScenes,
  createScene,
  updateScene,
  deleteScene,
} from "../services/screenplayService";
import "../styles/projects.css";
import "../styles/workspace.css";

const workspaceTabs = [
  { id: "overview", label: "Overview", icon: "◈" },
  { id: "screenplay", label: "Screenplay", icon: "▤" },
  { id: "characters", label: "Characters", icon: "♙" },
  { id: "production", label: "Production", icon: "🎬" },
  { id: "documents", label: "Documents", icon: "▧" },
];

const emptyForm = { title: "", content: "" };

function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [scenes, setScenes] = useState([]);
  const [scenesLoading, setScenesLoading] = useState(false);
  const [sceneError, setSceneError] = useState("");
  const [sceneMessage, setSceneMessage] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [editingSceneId, setEditingSceneId] = useState(null);
  const [savingScene, setSavingScene] = useState(false);

  // Load project details.
  useEffect(() => {
    let active = true;

    async function loadProject() {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(`/projects/${id}`);

        if (active) setProject(response.data);
      } catch (err) {
        if (active) {
          setError(
            err.response?.data?.message ||
              "Could not load project details."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProject();

    return () => {
      active = false;
    };
  }, [id]);

  // Load screenplay scenes from the backend.
  const loadScenes = useCallback(async () => {
    try {
      setScenesLoading(true);
      setSceneError("");

      const data = await getScenes(id);
      setScenes(Array.isArray(data) ? data : []);
    } catch (err) {
      setSceneError(
        err.response?.data?.message ||
          "Could not load screenplay scenes."
      );
    } finally {
      setScenesLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (activeTab === "screenplay") {
      loadScenes();
    }
  }, [activeTab, loadScenes]);

  function resetSceneForm() {
    setForm(emptyForm);
    setEditingSceneId(null);
  }

  function handleFormChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleEditScene(scene) {
    setEditingSceneId(scene.id);
    setForm({
      title: scene.title || "",
      content: scene.content || "",
    });

    setSceneError("");
    setSceneMessage("");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSaveScene(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      setSceneError("Please enter a scene title.");
      return;
    }

    try {
      setSavingScene(true);
      setSceneError("");
      setSceneMessage("");

      const payload = {
        title: form.title.trim(),
        content: form.content,
      };

      if (editingSceneId) {
        await updateScene(id, editingSceneId, payload);
        setSceneMessage("Scene updated successfully.");
      } else {
        await createScene(id, payload);
        setSceneMessage("Scene created successfully.");
      }

      resetSceneForm();
      await loadScenes();
    } catch (err) {
      setSceneError(
        err.response?.data?.message ||
          "Could not save the scene. Please try again."
      );
    } finally {
      setSavingScene(false);
    }
  }

  async function handleDeleteScene(scene) {
    const confirmed = window.confirm(
      `Delete "${scene.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setSceneError("");
      setSceneMessage("");

      await deleteScene(id, scene.id);

      if (editingSceneId === scene.id) {
        resetSceneForm();
      }

      setSceneMessage("Scene deleted successfully.");
      await loadScenes();
    } catch (err) {
      setSceneError(
        err.response?.data?.message ||
          "Could not delete the scene."
      );
    }
  }

  if (loading) {
    return (
      <main className="workspace-page">
        <div className="projects-state">
          <div className="projects-loader" />
          <p>Loading your workspace...</p>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="workspace-page">
        <button
          type="button"
          className="secondary-button"
          onClick={() => navigate("/projects")}
        >
          ← Back to Projects
        </button>

        <p className="projects-error">
          {error || "Project not found."}
        </p>
      </main>
    );
  }

  const status = (project.status || "PLANNING")
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <main className="workspace-page">
      <button
        type="button"
        className="workspace-back"
        onClick={() => navigate("/projects")}
      >
        ← All Projects
      </button>

      <header className="workspace-header">
        <div className="workspace-heading">
          <div className="workspace-clapper">🎬</div>

          <div>
            <p className="projects-eyebrow">CINEFLOW WORKSPACE</p>
            <h1>{project.title}</h1>

            <p className="workspace-subtitle">
              {project.genre || "Film Project"}
              {project.language ? ` · ${project.language}` : ""}
            </p>
          </div>
        </div>

        <span
          className={`project-status status-${(
            project.status || "PLANNING"
          ).toLowerCase()}`}
        >
          {status}
        </span>
      </header>

      <nav
        className="workspace-tabs"
        aria-label="Project workspace"
      >
        {workspaceTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`workspace-tab ${
              activeTab === tab.id ? "active" : ""
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>

      <section className="workspace-content">
        {/* PROJECT OVERVIEW */}
        {activeTab === "overview" && (
          <div className="workspace-panel">
            <p className="projects-eyebrow">PROJECT OVERVIEW</p>
            <h2>Your creative journey starts here.</h2>

            <p className="workspace-description">
              {project.description ||
                "Add a description to capture the vision for your film."}
            </p>

            <div className="workspace-stats">
              <article className="workspace-stat">
                <span>Genre</span>
                <strong>{project.genre || "Not set"}</strong>
              </article>

              <article className="workspace-stat">
                <span>Language</span>
                <strong>{project.language || "Not set"}</strong>
              </article>

              <article className="workspace-stat">
                <span>Status</span>
                <strong>{status}</strong>
              </article>
            </div>

            <h3 className="workspace-section-title">
              Your workspace
            </h3>

            <div className="workspace-module-grid">
              <button
                type="button"
                className="workspace-module"
                onClick={() => setActiveTab("screenplay")}
              >
                <span className="workspace-module-icon">▤</span>
                <strong>Screenplay</strong>
                <span>Develop scenes and dialogue</span>
                <span className="workspace-module-link">
                  Open module →
                </span>
              </button>

              <button
                type="button"
                className="workspace-module"
                onClick={() => setActiveTab("characters")}
              >
                <span className="workspace-module-icon">♙</span>
                <strong>Characters</strong>
                <span>Build your story's characters</span>
                <span className="workspace-module-link">
                  Open module →
                </span>
              </button>

              <button
                type="button"
                className="workspace-module"
                onClick={() => setActiveTab("production")}
              >
                <span className="workspace-module-icon">🎬</span>
                <strong>Production</strong>
                <span>Plan your film production</span>
                <span className="workspace-module-link">
                  Open module →
                </span>
              </button>
            </div>
          </div>
        )}

        {/* SCREENPLAY */}
        {activeTab === "screenplay" && (
          <div className="workspace-panel screenplay-panel">
            <p className="projects-eyebrow">WRITING ROOM</p>
            <h2>Screenplay</h2>

            <p className="workspace-description">
              Write your story one scene at a time. Your scenes are
              saved to this project.
            </p>

            <div className="screenplay-summary">
              <div>
                <span className="screenplay-summary-label">
                  TOTAL SCENES
                </span>
                <strong>{scenes.length}</strong>
              </div>

              <div>
                <span className="screenplay-summary-label">
                  CURRENT MODE
                </span>
                <strong>
                  {editingSceneId ? "Editing scene" : "Writing"}
                </strong>
              </div>
            </div>

            {sceneError && (
              <div
                className="screenplay-alert error"
                role="alert"
              >
                {sceneError}
              </div>
            )}

            {sceneMessage && (
              <div
                className="screenplay-alert success"
                role="status"
              >
                {sceneMessage}
              </div>
            )}

            <div className="screenplay-layout">
              <div className="screenplay-editor">
                <div className="screenplay-editor-heading">
                  <div>
                    <p className="projects-eyebrow">
                      {editingSceneId ? "EDIT SCENE" : "NEW SCENE"}
                    </p>

                    <h3>
                      {editingSceneId
                        ? "Refine your scene"
                        : "Create a scene"}
                    </h3>
                  </div>

                  {editingSceneId && (
                    <button
                      type="button"
                      className="screenplay-text-button"
                      onClick={resetSceneForm}
                    >
                      Cancel edit
                    </button>
                  )}
                </div>

                <form onSubmit={handleSaveScene}>
                  <label
                    className="screenplay-label"
                    htmlFor="scene-title"
                  >
                    Scene title
                  </label>

                  <input
                    id="scene-title"
                    name="title"
                    type="text"
                    className="screenplay-input"
                    placeholder="e.g. INT. BABU'S HOUSE - NIGHT"
                    value={form.title}
                    onChange={handleFormChange}
                    maxLength={200}
                    required
                  />

                  <label
                    className="screenplay-label"
                    htmlFor="scene-content"
                  >
                    Scene content
                  </label>

                  <textarea
                    id="scene-content"
                    name="content"
                    className="screenplay-textarea"
                    placeholder={
                      "Write action, dialogue, and scene directions here...\n\nBABU\nWhere were you all this time?"
                    }
                    value={form.content}
                    onChange={handleFormChange}
                    rows={14}
                  />

                  <div className="screenplay-editor-footer">
                    <span>
                      {form.content.length} characters
                    </span>

                    <button
                      type="submit"
                      className="screenplay-primary-button"
                      disabled={savingScene}
                    >
                      {savingScene
                        ? "Saving..."
                        : editingSceneId
                          ? "Save changes"
                          : "+ Save scene"}
                    </button>
                  </div>
                </form>
              </div>

              <aside className="screenplay-scene-list">
                <div className="screenplay-list-heading">
                  <div>
                    <p className="projects-eyebrow">YOUR STORY</p>
                    <h3>Scene list</h3>
                  </div>

                  <span className="screenplay-count">
                    {scenes.length}
                  </span>
                </div>

                {scenesLoading ? (
                  <div className="screenplay-list-state">
                    <div className="projects-loader" />
                    <p>Loading scenes...</p>
                  </div>
                ) : scenes.length === 0 ? (
                  <div className="screenplay-list-state">
                    <span className="screenplay-empty-icon">▤</span>
                    <h4>No scenes yet</h4>
                    <p>
                      Create your first scene using the editor.
                    </p>
                  </div>
                ) : (
                  <div className="screenplay-scenes">
                    {scenes.map((scene) => (
                      <article
                        className={`screenplay-scene-card ${
                          editingSceneId === scene.id
                            ? "selected"
                            : ""
                        }`}
                        key={scene.id}
                      >
                        <button
                          type="button"
                          className="screenplay-scene-open"
                          onClick={() => handleEditScene(scene)}
                        >
                          <span className="screenplay-scene-number">
                            {String(scene.sceneNumber).padStart(2, "0")}
                          </span>

                          <span className="screenplay-scene-info">
                            <strong>{scene.title}</strong>

                            <span>
                              {scene.content?.trim()
                                ? `${scene.content.trim().slice(0, 85)}${
                                    scene.content.trim().length > 85
                                      ? "..."
                                      : ""
                                  }`
                                : "No content yet"}
                            </span>
                          </span>
                        </button>

                        <button
                          type="button"
                          className="screenplay-delete-button"
                          aria-label={`Delete ${scene.title}`}
                          title="Delete scene"
                          onClick={() => handleDeleteScene(scene)}
                        >
                          ×
                        </button>
                      </article>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  className="screenplay-add-button"
                  onClick={resetSceneForm}
                >
                  + New scene
                </button>
              </aside>
            </div>
          </div>
        )}

        {/* CHARACTERS AND RELATIONSHIPS */}
        {activeTab === "characters" && (
          <div className="workspace-panel">
            <p className="projects-eyebrow">
              CHARACTER DEVELOPMENT
            </p>

            <h2>Characters &amp; Relationships</h2>

            <p className="workspace-description">
              Build your cast, develop character profiles, and define
              the relationships, conflicts, and connections that drive
              your story.
            </p>

            <CharactersPanel projectId={id} />

            <div
              style={{
                margin: "36px 0",
                borderTop: "1px solid #303030",
              }}
            />

            <CharacterRelationshipsPanel projectId={id} />
          </div>
        )}

        {/* PRODUCTION */}
        {activeTab === "production" && (
          <div className="workspace-panel">
            <p className="projects-eyebrow">FILM PRODUCTION</p>
            <h2>Production Planning</h2>

            <p className="workspace-description">
              Organize shooting schedules, locations, scenes,
              and production tasks.
            </p>

            <div className="workspace-empty">
              <span>🎬</span>
              <h3>Plan your production</h3>
              <p>
                Production schedules and task tracking will
                be added in a later step.
              </p>
            </div>
          </div>
        )}

        {/* DOCUMENTS */}
        {activeTab === "documents" && (
          <div className="workspace-panel">
            <p className="projects-eyebrow">PROJECT FILES</p>
            <h2>Documents</h2>

            <p className="workspace-description">
              Keep your project documents and reference materials
              organized.
            </p>

            <div className="workspace-empty">
              <span>▧</span>
              <h3>Your project library</h3>
              <p>
                Document uploads and file management will be
                added in a later step.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default ProjectDetails;
