import MessagesView from "@/components/dashboard/MessagesView";
import { Home, Users, Calendar, MessageSquare, Bell, User, Briefcase } from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/agent/dashboard", icon: <Home size={20} /> },
  { label: "Assigned Properties", href: "/agent/properties", icon: <Briefcase size={20} /> },
  { label: "Assigned Leads", href: "/agent/leads", icon: <Users size={20} /> },
  { label: "Site Visits", href: "/agent/calendar", icon: <Calendar size={20} /> },
  { label: "Messages", href: "/agent/messages", icon: <MessageSquare size={20} /> },
  { label: "Notifications", href: "/agent/notifications", icon: <Bell size={20} /> },
  { label: "Profile", href: "/agent/profile", icon: <User size={20} /> },
];

export default function AgentMessagesPage() {
  return <MessagesView role="AGENT" sidebarLinks={sidebarLinks} />;
}
