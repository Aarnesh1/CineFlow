
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

export default function Profile() {
  const { user, fetchCurrentUser, updateProfile, changePassword } = useAuth();

  const [displayName, setDisplayName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await fetchCurrentUser();
        setDisplayName(data.displayName ?? data.name ?? data.fullName ?? "");
        setEmail(data.email ?? "");
      } catch {
        setError("Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!displayName.trim()) {
      setError("Display name cannot be empty.");
      return;
    }

    setSaving(true);

    try {
      const data = await updateProfile(displayName);
      setDisplayName(data.displayName ?? data.name ?? displayName.trim());
      setEmail(data.email ?? email);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();
    setPasswordMessage("");
    setPasswordError("");

    if (newPassword.length < 8 || newPassword.length > 72) {
      setPasswordError("New password must be between 8 and 72 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setChangingPassword(true);

    try {
      await changePassword(currentPassword, newPassword);
      setPasswordMessage("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordError(
        err.response?.data?.detail ||
        err.response?.data?.message ||
        "Unable to change password. Check your current password."
      );
    } finally {
      setChangingPassword(false);
    }
  }

  if (loading) {
    return <div className="profile-page">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-heading">
          <div className="profile-avatar">
            {(displayName || email || "U").charAt(0).toUpperCase()}
          </div>
          <div>
            <h1>My Profile</h1>
            <p>Manage your CineFlow account details.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <label htmlFor="displayName">Display Name</label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            maxLength={120}
            required
          />

          <label htmlFor="email">Email Address</label>
          <input id="email" type="email" value={email} readOnly />

          {message && <p className="profile-success">{message}</p>}
          {error && <p className="profile-error">{error}</p>}

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <section className="password-section">
          <h2>Change Password</h2>
          <p>Choose a new password for your account.</p>

          <form onSubmit={handlePasswordSubmit} className="profile-form">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              type="password"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <label htmlFor="newPassword">New Password</label>
            <input
              id="newPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={72}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {passwordMessage && (
              <p className="profile-success">{passwordMessage}</p>
            )}
            {passwordError && (
              <p className="profile-error">{passwordError}</p>
            )}

            <button type="submit" disabled={changingPassword}>
              {changingPassword ? "Updating..." : "Change Password"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
