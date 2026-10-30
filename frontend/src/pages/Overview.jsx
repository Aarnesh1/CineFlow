import { ArrowDownRight, ArrowUpRight, CalendarDays, CircleDashed, Clapperboard, Clock3, FolderPlus, Plus, Sparkles, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";

const metrics = [
  { label: "Active projects", value: "—", note: "Projects will appear here", icon: Clapperboard },
  { label: "Upcoming shoot days", value: "—", note: "Your schedule at a glance", icon: CalendarDays },
  { label: "Estimated budget", value: "—", note: "Across your productions", icon: WalletCards },
  { label: "Pending tasks", value: "—", note: "Keep your team moving", icon: CircleDashed },
];

export default function Overview() {
  return (
    <div className="page-content">
      <section className="welcome-row">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" /> YOUR CREATIVE COMMAND CENTER</div>
          <h1>Make every frame <span>count.</span></h1>
          <p className="page-description">Your productions, people, and plans — all moving in sync.</p>
        </div>
        <Link to="/projects" className="button button-primary"><Plus size={17} /> Create project</Link>
      </section>

      <section className="metric-grid" aria-label="Production overview">
        {metrics.map(({ label, value, note, icon: Icon }, index) => (
          <article className="metric-card" key={label}>
            <div className="metric-card-top"><span className="metric-icon"><Icon size={18} /></span><span className="metric-index">0{index + 1}</span></div>
            <p className="metric-label">{label}</p>
            <div className="metric-value-row"><strong>{value}</strong></div>
            <p className="metric-note">{note}</p>
          </article>
        ))}
      </section>

      <section className="dashboard-main-grid">
        <article className="panel projects-panel">
          <div className="panel-heading">
            <div><span className="panel-kicker">YOUR WORKSPACE</span><h2>Recent projects</h2></div>
            <Link to="/projects" className="text-link">View all <ArrowUpRight size={15} /></Link>
          </div>
          <div className="empty-projects">
            <div className="empty-art">
              <div className="film-frame film-frame--back"><span /><span /><span /></div>
              <div className="film-frame film-frame--front"><Clapperboard size={31} /></div>
              <div className="empty-spark empty-spark--one">✳</div><div className="empty-spark empty-spark--two">✦</div>
            </div>
            <h3>Your next story starts here.</h3>
            <p>Create a project to bring your screenplay, crew, schedule, and production plan into one workspace.</p>
            <Link to="/projects" className="button button-secondary"><FolderPlus size={16} /> Create your first project</Link>
          </div>
        </article>

        <article className="panel planner-panel">
          <div className="planner-glow" />
          <div className="planner-label"><span className="planner-label-icon"><Sparkles size={15} /></span> CINEFLOW INTELLIGENCE <span className="beta-pill">COMING SOON</span></div>
          <div className="planner-illustration"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="planner-core"><Sparkles size={28} /></div><span className="orbit-node orbit-node-one" /><span className="orbit-node orbit-node-two" /><span className="orbit-node orbit-node-three" /></div>
          <h2>Meet your AI<br /><span>Production Planner.</span></h2>
          <p>Turn your screenplay into a smarter production plan. Analyze scenes, surface constraints, and explore shooting schedules.</p>
          <Link to="/planner" className="button button-planner">Explore the planner <ArrowDownRight size={16} /></Link>
          <div className="planner-footnote"><Clock3 size={13} /> AI integration will be implemented in a later phase</div>
        </article>
      </section>

      <section className="bottom-grid">
        <article className="panel timeline-panel">
          <div className="panel-heading"><div><span className="panel-kicker">UP NEXT</span><h2>Production timeline</h2></div><CalendarDays size={18} className="heading-muted-icon" /></div>
          <div className="timeline-empty"><div className="timeline-icon"><CalendarDays size={20} /></div><div><strong>No shoot days scheduled</strong><p>Your upcoming production days will show up here.</p></div></div>
        </article>
        <article className="panel quickstart-panel">
          <div className="panel-heading"><div><span className="panel-kicker">GET STARTED</span><h2>Your first steps</h2></div><span className="step-count">01 / 04</span></div>
          <div className="quickstep"><span className="quickstep-number quickstep-number--active">01</span><div><strong>Create a film project</strong><p>Set up your production workspace.</p></div><span className="quickstep-status">Start here</span></div>
          <div className="quickstep"><span className="quickstep-number">02</span><div><strong>Add your screenplay</strong><p>Bring your story into CineFlow.</p></div></div>
          <div className="quickstep"><span className="quickstep-number">03</span><div><strong>Build your breakdown</strong><p>Organize scenes and requirements.</p></div></div>
          <div className="quickstep"><span className="quickstep-number">04</span><div><strong>Plan your production</strong><p>Prepare your schedule and team.</p></div></div>
        </article>
      </section>
      <footer className="page-footer"><span><span className="footer-mark">●</span> CINEFLOW <span className="footer-divider">/</span> FROM SCRIPT TO SCREEN</span><span>Phase 1 · Foundation</span></footer>
    </div>
  );
}
