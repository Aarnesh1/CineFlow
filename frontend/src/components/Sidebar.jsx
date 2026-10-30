import { Clapperboard, ChevronLeft, ChevronRight, CircleHelp, Film } from "lucide-react";
import { NavLink } from "react-router-dom";
import { navigation, workspaceNavigation } from "../data/navigation.js";

export default function Sidebar({ collapsed, onToggle, mobileOpen, onNavigate }) {
  return (
    <>
      {mobileOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={onNavigate} />}
      <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""} ${mobileOpen ? "sidebar--mobile-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-mark"><Clapperboard size={22} strokeWidth={2.2} /></div>
          {!collapsed && <div className="brand-copy"><span className="brand-name">cineflow<span>.</span></span><span className="brand-caption">PRODUCTION OS</span></div>}
          <button className="sidebar-toggle" onClick={onToggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <div className="workspace-picker">
          <div className="workspace-icon"><Film size={17} /></div>
          {!collapsed && <div className="workspace-copy"><span>Workspace</span><strong>Independent Studio</strong></div>}
          {!collapsed && <span className="workspace-dot" />}
        </div>

        <nav className="nav-list" aria-label="Main navigation">
          {!collapsed && <p className="nav-section-label">WORKSPACE</p>}
          {navigation.map(({ label, path, icon: Icon, featured }) => (
            <NavLink key={path} to={path} end={path === "/"} title={collapsed ? label : undefined}
              onClick={onNavigate} className={({ isActive }) => `nav-link ${isActive ? "nav-link--active" : ""} ${featured ? "nav-link--featured" : ""}`}>
              <Icon size={18} strokeWidth={1.8} />
              {!collapsed && <span>{label}</span>}
              {!collapsed && featured && <span className="nav-ai-mark">AI</span>}
            </NavLink>
          ))}
          {!collapsed && <p className="nav-section-label nav-section-label--lower">MANAGE</p>}
          {workspaceNavigation.map(({ label, path, icon: Icon }) => (
            <NavLink key={path} to={path} title={collapsed ? label : undefined}
              onClick={onNavigate} className={({ isActive }) => `nav-link ${isActive ? "nav-link--active" : ""}`}>
              <Icon size={18} strokeWidth={1.8} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><CircleHelp size={17} /></div>
            {!collapsed && <div><strong>Need a hand?</strong><p>Your production, in sync.</p></div>}
          </div>
          <div className="user-profile">
            <div className="avatar">SA</div>
            {!collapsed && <div className="user-copy"><strong>Studio Admin</strong><span>Free workspace</span></div>}
            {!collapsed && <span className="user-menu-dots">···</span>}
          </div>
        </div>
      </aside>
    </>
  );
}
