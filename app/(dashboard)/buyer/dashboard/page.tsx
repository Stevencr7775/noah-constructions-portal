"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import KPICard from "@/components/dashboard/KPICard";
import { Home, Heart, History, Scale, Calendar, MessageSquare, Bell, User, Key } from "lucide-react";
import Link from "next/link";

const sidebarLinks = [
  { label: "Dashboard", href: "/buyer/dashboard", icon: <Home size={20} /> },
  { label: "My Purchases", href: "/buyer/purchases", icon: <Key size={20} /> },
  { label: "My Favorites", href: "/buyer/favorites", icon: <Heart size={20} /> },
  { label: "Compare", href: "/compare", icon: <Scale size={20} /> },
  { label: "Site Visits", href: "/buyer/calendar", icon: <Calendar size={20} /> },
  { label: "Recently Viewed", href: "/buyer/history", icon: <History size={20} /> },
  { label: "Messages", href: "/buyer/messages", icon: <MessageSquare size={20} /> },
  { label: "Notifications", href: "/buyer/notifications", icon: <Bell size={20} /> },
  { label: "Profile", href: "/buyer/profile", icon: <User size={20} /> },
];

export default function BuyerDashboard() {
  return (
    <DashboardLayout role="BUYER" links={sidebarLinks}>
      <h1 className="section-title text-primary mb-6" style={{ fontSize: "1.75rem" }}>Buyer Dashboard</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <KPICard title="Saved Properties" value="12" icon={<Heart size={24} />} color="#ec4899" />
        <KPICard title="Recently Viewed" value="45" icon={<History size={24} />} color="#8b5cf6" />
        <KPICard title="Booked Visits" value="3" icon={<Calendar size={24} />} color="#f59e0b" />
        <KPICard title="Unread Messages" value="2" icon={<MessageSquare size={24} />} color="#3b82f6" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          <div className="card" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Key size={20} color="var(--primary)" /> My Purchased Properties
            </h2>
            <div style={{ padding: "2rem", textAlign: "center", background: "#f8fafc", borderRadius: "12px", border: "1px dashed var(--border)" }}>
               <p className="text-muted">You have no purchased properties yet.</p>
               <Link href="/projects" className="btn btn-outline mt-4" style={{ display: "inline-block" }}>Explore Projects</Link>
            </div>
          </div>

          <div className="card" style={{ padding: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Recommended for You</h2>
            <div style={{ padding: "2rem", textAlign: "center", background: "#f8fafc", borderRadius: "12px" }}>
               <p className="text-muted">Start searching to get personalized recommendations based on your activity.</p>
               <Link href="/search" className="btn btn-primary mt-4" style={{ display: "inline-block" }}>Search Properties</Link>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Quick Actions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <Link href="/search" className="btn btn-outline w-full" style={{ justifyContent: "flex-start" }}>Browse New Projects</Link>
            <Link href="/compare" className="btn btn-outline w-full" style={{ justifyContent: "flex-start" }}>Compare Saved Items</Link>
            <Link href="/buyer/profile" className="btn btn-outline w-full" style={{ justifyContent: "flex-start" }}>Update Profile Details</Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
