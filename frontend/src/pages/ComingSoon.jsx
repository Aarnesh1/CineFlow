import { ArrowLeft, Clapperboard, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { navigation, workspaceNavigation } from "../data/navigation.js";

export default function ComingSoon() {
  const location = useLocation();
  const item = [...navigation, ...workspaceNavigation].find((entry) => entry.path === location.pathname);
  const title = item?.label || "Workspace";
  const Icon = item?.icon || Clapperboard;

  return (
    <div className="page-content feature-page">
      <Link to="/" className="back-link"><ArrowLeft size={15} /> Back to overview</Link>
      <div className="feature-hero">
        <div className="feature-icon"><Icon size={25} /></div>
        <span className="eyebrow"><span className="eyebrow-line" /> CINEFLOW WORKSPACE</span>
        <h1>{title}</h1>
        <p>This module is part of the CineFlow roadmap. We’ll implement its working UI, API, database model, and tests in the appropriate development phase.</p>
        <div className="planned-chip"><Sparkles size={14} /> Planned module · Not implemented yet</div>
        <Link to="/" className="button button-primary">Return to overview</Link>
      </div>
    </div>
  );
}
