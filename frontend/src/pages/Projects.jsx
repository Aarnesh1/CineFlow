
import { useEffect, useState } from "react";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projectService";
import "../styles/projects.css";
import { useNavigate } from "react-router-dom";

const emptyForm = {
  title: "",
  description: "",
  genre: "",
  language: "",
  status: "PLANNING",
};

function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ ...emptyForm });
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    try {
      setError("");
      setLoading(true);

      const data = await getProjects();
      setProjects(Array.isArray(data) ? data : data.content || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load projects. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  }

  function openCreateForm() {
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
    setShowForm(true);
  }

  function startEditing(project) {
    setEditingId(project.id);
    setForm({
      title: project.title || "",
      description: project.description || "",
      genre: project.genre || "",
      language: project.language || "",
      status: project.status || "PLANNING",
    });

    setError("");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyForm });
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setError("");
      setSaving(true);

      if (editingId) {
        await updateProject(editingId, form);
      } else {
        await createProject(form);
      }

      setShowForm(false);
      setEditingId(null);
      setForm({ ...emptyForm });

      await loadProjects();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          (editingId
            ? "Could not update project. Please try again."
            : "Could not create project. Please try again.")
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(project) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      await deleteProject(project.id);

      setProjects((previousProjects) =>
        previousProjects.filter((item) => item.id !== project.id)
      );

      if (editingId === project.id) {
        cancelForm();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not delete project. Please try again."
      );
    }
  }

  function formatStatus(status) {
    return (status || "PLANNING")
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (character) => character.toUpperCase());
  }

  return (
    <main className="projects-page">
      <header className="projects-header">
        <div>
          <p className="projects-eyebrow">YOUR CREATIVE WORKSPACE</p>
          <h1>My Projects</h1>
          <p className="projects-subtitle">
            Organize your stories, plan your productions, and bring your
            cinematic ideas to life.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={showForm ? cancelForm : openCreateForm}
        >
          {showForm ? "Cancel" : "+ New Project"}
        </button>
      </header>

      {error && (
        <div className="projects-error" role="alert">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {showForm && (
        <section className="project-form-card">
          <div className="project-form-header">
            <div>
              <p className="projects-eyebrow">
                {editingId ? "UPDATE YOUR WORK" : "START SOMETHING NEW"}
              </p>
              <h2>{editingId ? "Edit Project" : "Create a Project"}</h2>
            </div>
          </div>

          <form className="project-form" onSubmit={handleSubmit}>
            <div className="form-field">
              <label htmlFor="title">Project Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="Enter your project title"
                value={form.title}
                onChange={handleInputChange}
                maxLength={150}
                required
              />
            </div>

            <div className="form-field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your story or production..."
                value={form.description}
                onChange={handleInputChange}
                maxLength={2000}
                rows={4}
              />
            </div>

            <div className="project-form-grid">
              <div className="form-field">
                <label htmlFor="genre">Genre</label>
                <input
                  id="genre"
                  name="genre"
                  type="text"
                  placeholder="e.g. Thriller, Drama"
                  value={form.genre}
                  onChange={handleInputChange}
                  maxLength={80}
                />
              </div>

              <div className="form-field">
                <label htmlFor="language">Language</label>
                <input
                  id="language"
                  name="language"
                  type="text"
                  placeholder="e.g. Telugu, English"
                  value={form.language}
                  onChange={handleInputChange}
                  maxLength={80}
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="status">Production Status</label>
              <select
                id="status"
                name="status"
                value={form.status}
                onChange={handleInputChange}
              >
                <option value="PLANNING">Planning</option>
                <option value="IN_PRODUCTION">In Production</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div className="project-form-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={cancelForm}
                disabled={saving}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="primary-button"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Create Project"}
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="projects-content">
        <div className="projects-section-heading">
          <div>
            <h2>All Projects</h2>
            <p>
              {projects.length}{" "}
              {projects.length === 1 ? "project" : "projects"} in your
              workspace
            </p>
          </div>

          <button
            type="button"
            className="secondary-button"
            onClick={loadProjects}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="projects-state">
            <div className="projects-loader" />
            <p>Loading your projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="projects-empty">
            <div className="projects-empty-icon">🎬</div>
            <h3>No projects yet</h3>
            <p>
              Your next great story starts here. Create your first project
              to get started.
            </p>
            <button
              type="button"
              className="primary-button"
              onClick={openCreateForm}
            >
              + Create Your First Project
            </button>
          </div>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <article className="project-card" key={project.id}>
                <div className="project-card-top">
                  <span
                    className={`project-status status-${(
                      project.status || "PLANNING"
                    ).toLowerCase()}`}
                  >
                    {formatStatus(project.status)}
                  </span>

                  <span className="project-card-icon">🎬</span>
                </div>

              
                <h3
                  className="clickable-project-title"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  {project.title}
                </h3>


                <p className="project-description">
                  {project.description || "No description added yet."}
                </p>

                <div className="project-meta">
                  {project.genre && (
                    <span className="project-tag">{project.genre}</span>
                  )}
                  {project.language && (
                    <span className="project-tag">
                      {project.language}
                    </span>
                  )}
                </div>

                {project.createdAt && (
                  <p className="project-date">
                    Created{" "}
                    {new Date(project.createdAt).toLocaleDateString()}
                  </p>
                )}

                <div className="project-card-actions">
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => startEditing(project)}
                  >
                    Edit Project
                  </button>

                  <button
                    type="button"
                    className="danger-button"
                    onClick={() => handleDelete(project)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Projects;
