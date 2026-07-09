import MessagesView from "@/components/dashboard/MessagesView";
import { Home, Heart, History, Scale, Calendar, MessageSquare, Bell, User } from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/buyer/dashboard", icon: <Home size={20} /> },
  { label: "My Favorites", href: "/buyer/favorites", icon: <Heart size={20} /> },
  { label: "Compare", href: "/compare", icon: <Scale size={20} /> },
  { label: "Site Visits", href: "/buyer/calendar", icon: <Calendar size={20} /> },
  { label: "Recently Viewed", href: "/buyer/history", icon: <History size={20} /> },
  { label: "Messages", href: "/buyer/messages", icon: <MessageSquare size={20} /> },
  { label: "Notifications", href: "/buyer/notifications", icon: <Bell size={20} /> },
  { label: "Profile", href: "/buyer/profile", icon: <User size={20} /> },
];

export default function BuyerMessagesPage() {
  return <MessagesView role="BUYER" sidebarLinks={sidebarLinks} />;
}
