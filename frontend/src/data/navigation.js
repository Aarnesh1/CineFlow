import {
  Activity, CalendarDays, Clapperboard, ClipboardList, FileText, Film,
  FolderKanban, Gauge, HardDrive, MapPin, Settings, Users, Wallet,
  Wrench, BrainCircuit
} from "lucide-react";

export const navigation = [
  { label: "Overview", path: "/", icon: Gauge, implemented: true },
  { label: "My Projects", path: "/projects", icon: FolderKanban },
  { label: "Screenplay Studio", path: "/screenplay", icon: FileText },
  { label: "Scene Breakdown", path: "/scenes", icon: Clapperboard },
  { label: "AI Production Planner", path: "/planner", icon: BrainCircuit, featured: true },
  { label: "Shooting Schedule", path: "/schedule", icon: CalendarDays },
  { label: "Locations & Cast", path: "/locations-cast", icon: MapPin },
  { label: "Crew & Equipment", path: "/crew-equipment", icon: Wrench },
  { label: "Budget & Expenses", path: "/budget", icon: Wallet },
  { label: "Production Reports", path: "/reports", icon: ClipboardList },
  { label: "AI Knowledge Base", path: "/knowledge-base", icon: HardDrive },
  { label: "Profile", path: "/profile", icon: Users, implemented: true },
];

export const workspaceNavigation = [
  { label: "Activity", path: "/activity", icon: Activity },
  { label: "Settings", path: "/settings", icon: Settings },
];
