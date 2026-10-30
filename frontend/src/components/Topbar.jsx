import { Bell, ChevronDown, Menu, Search } from "lucide-react";

export default function Topbar({ onMenuClick, apiStatus }) {
  return (
    <header className="topbar">
      <button className="icon-button mobile-menu-button" onClick={onMenuClick} aria-label="Open navigation"><Menu size={20} /></button>
      <div className="breadcrumbs"><span>Workspace</span><span className="crumb-slash">/</span><strong>Overview</strong></div>
      <div className="topbar-actions">
        <div className={`connection-status ${apiStatus === "connected" ? "connection-status--ok" : apiStatus === "error" ? "connection-status--error" : ""}`}>
          <span className="status-dot" /> <span>{apiStatus === "connected" ? "API connected" : apiStatus === "error" ? "API unavailable" : "Checking API"}</span>
        </div>
        <button className="search-trigger" aria-label="Search (coming soon)" title="Search will be added in a later phase"><Search size={17} /><span>Search</span><kbd>⌘ K</kbd></button>
        <button className="icon-button notification-button" aria-label="Notifications (coming soon)" title="Notifications will be added in a later phase"><Bell size={19} /><i /></button>
        <button className="project-switcher" title="Project selection will be added in a later phase"><span className="project-switcher-icon">CF</span><span>All projects</span><ChevronDown size={15} /></button>
      </div>
    </header>
  );
}
