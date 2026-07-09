import MessagesView from "@/components/dashboard/MessagesView";
import { Home, List, PlusCircle, Users, Calendar, MessageSquare, Bell, User } from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/seller/dashboard", icon: <Home size={20} /> },
  { label: "My Properties", href: "/seller/properties", icon: <List size={20} /> },
  { label: "Add Property", href: "/seller/properties/new", icon: <PlusCircle size={20} /> },
  { label: "Leads", href: "/seller/leads", icon: <Users size={20} /> },
  { label: "Site Visits", href: "/seller/calendar", icon: <Calendar size={20} /> },
  { label: "Messages", href: "/seller/messages", icon: <MessageSquare size={20} /> },
  { label: "Notifications", href: "/seller/notifications", icon: <Bell size={20} /> },
  { label: "Profile", href: "/seller/profile", icon: <User size={20} /> },
];

export default function SellerMessagesPage() {
  return <MessagesView role="SELLER" sidebarLinks={sidebarLinks} />;
}
