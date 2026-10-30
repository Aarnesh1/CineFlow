import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

export default function Dashboard() {
  const {
    user,
    fetchCurrentUser,
    logout,
  } = useAuth();

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadProfile() {
      try {
        await fetchCurrentUser();
      } catch (err) {
        if (!active) return;

        const status = err.response?.status;

        if (status === 401 || status === 403) {
          logout();
          navigate("/login", { replace: true });
          return;
        }

        setError(
          err.response?.data?.message ||
          "Could not load your profile. Check that the backend is running."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProfile();

    return () => {
      active = false;
    };
  }, []);

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  if (loading) {
    return <main className="dashboard-page">Loading your workspace...</main>;
  }

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <a href="/dashboard" className="dashboard-brand">
          CINE<span>FLOW</span>
        </a>

        <button
          type="button"
          className="dashboard-logout"
          onClick={handleLogout}
        >
          Log out
        </button>
      </header>

      <section className="dashboard-content">
        <p className="dashboard-eyebrow">YOUR CREATIVE WORKSPACE</p>
        <h1>Welcome to CineFlow.</h1>
        <p className="dashboard-description">
          Your next story starts here. Your account is connected to the backend.
        </p>

        {error && <p className="dashboard-error">{error}</p>}

        <div className="dashboard-panel">
          <p className="dashboard-panel-label">ACCOUNT</p>
          <h2>{user?.name || user?.fullName || user?.email || "Signed-in user"}</h2>
          <p className="dashboard-email">{user?.email || "Profile loaded"}</p>
          <span className="dashboard-status">AUTHENTICATED</span>
        </div>

        <p className="dashboard-next">
          Next up: building your production projects and AI production planner.
        </p>
      </section>
    </main>
  );
}