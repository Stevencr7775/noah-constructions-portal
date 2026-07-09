"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import KPICard from "@/components/dashboard/KPICard";
import { LineChart } from "@/components/dashboard/Charts";
import { Home, List, PlusCircle, Users, Calendar, MessageSquare, Bell, User, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

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

const mockChartData = [
  { month: 'Jan', views: 400, enquiries: 24 },
  { month: 'Feb', views: 800, enquiries: 45 },
  { month: 'Mar', views: 600, enquiries: 30 },
  { month: 'Apr', views: 1200, enquiries: 80 },
  { month: 'May', views: 1500, enquiries: 110 },
  { month: 'Jun', views: 2000, enquiries: 140 },
];

export default function SellerDashboard() {
  return (
    <DashboardLayout role="SELLER" links={sidebarLinks}>
      <h1 className="section-title text-primary mb-6" style={{ fontSize: "1.75rem" }}>Seller Dashboard</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <KPICard title="Total Properties" value="8" icon={<List size={24} />} color="#3b82f6" trend={12.5} trendLabel="vs last month" />
        <KPICard title="Published" value="5" icon={<CheckCircle size={24} />} color="#16a34a" />
        <KPICard title="Pending Approval" value="2" icon={<Clock size={24} />} color="#eab308" />
        <KPICard title="Total Leads" value="145" icon={<Users size={24} />} color="#8b5cf6" trend={34.1} trendLabel="vs last month" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        <div className="card" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Performance Overview</h2>
          <LineChart 
            data={mockChartData} 
            xKey="month" 
            series={[
              { key: 'views', name: 'Profile Views', color: '#3b82f6' },
              { key: 'enquiries', name: 'Enquiries', color: '#16a34a' }
            ]} 
          />
        </div>

        <div className="card" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Latest Enquiries</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
             {[1, 2, 3].map(i => (
               <div key={i} style={{ display: "flex", alignItems: "center", gap: "1rem", paddingBottom: "1rem", borderBottom: i !== 3 ? "1px solid var(--border)" : "none" }}>
                 <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "var(--primary)" }}>
                   U{i}
                 </div>
                 <div>
                   <p style={{ margin: 0, fontWeight: "bold" }}>New Lead #{100+i}</p>
                   <p className="text-muted" style={{ margin: 0, fontSize: "0.875rem" }}>Interested in "Villa at Jubilee Hills"</p>
                 </div>
               </div>
             ))}
             <Link href="/seller/leads" style={{ textAlign: "center", color: "var(--primary)", fontWeight: "bold", marginTop: "0.5rem" }}>View All Leads</Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
