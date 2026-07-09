"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import KPICard from "@/components/dashboard/KPICard";
import { BarChart } from "@/components/dashboard/Charts";
import { Home, Users, Calendar, MessageSquare, Bell, User, CheckCircle, Briefcase, Phone } from "lucide-react";
import Link from "next/link";

const sidebarLinks = [
  { label: "Dashboard", href: "/agent/dashboard", icon: <Home size={20} /> },
  { label: "Assigned Properties", href: "/agent/properties", icon: <Briefcase size={20} /> },
  { label: "Assigned Leads", href: "/agent/leads", icon: <Users size={20} /> },
  { label: "Site Visits", href: "/agent/calendar", icon: <Calendar size={20} /> },
  { label: "Messages", href: "/agent/messages", icon: <MessageSquare size={20} /> },
  { label: "Notifications", href: "/agent/notifications", icon: <Bell size={20} /> },
  { label: "Profile", href: "/agent/profile", icon: <User size={20} /> },
];

const mockChartData = [
  { month: 'Jan', commission: 45000 },
  { month: 'Feb', commission: 52000 },
  { month: 'Mar', commission: 48000 },
  { month: 'Apr', commission: 70000 },
  { month: 'May', commission: 65000 },
  { month: 'Jun', commission: 90000 },
];

export default function AgentDashboard() {
  return (
    <DashboardLayout role="AGENT" links={sidebarLinks}>
      <h1 className="section-title text-primary mb-6" style={{ fontSize: "1.75rem" }}>Agent Dashboard</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <KPICard title="Active Leads" value="34" icon={<Users size={24} />} color="#3b82f6" trend={5.2} />
        <KPICard title="Site Visits" value="12" icon={<Calendar size={24} />} color="#8b5cf6" />
        <KPICard title="Closed Deals" value="8" icon={<CheckCircle size={24} />} color="#16a34a" trend={14.0} />
        <KPICard title="Total Commission" value="₹3.7L" icon={<Briefcase size={24} />} color="#f59e0b" trend={22.5} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        <div className="card" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Commission Overview</h2>
          <BarChart 
            data={mockChartData} 
            xKey="month" 
            series={[
              { key: 'commission', name: 'Commission (₹)', color: '#f59e0b' }
            ]} 
          />
        </div>

        <div className="card" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Recent Activities</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
             <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
               <div style={{ padding: "0.5rem", background: "#eff6ff", borderRadius: "50%", color: "#3b82f6" }}>
                 <Phone size={16} />
               </div>
               <div>
                 <p style={{ margin: 0, fontWeight: "bold", fontSize: "0.875rem" }}>Call with Client A</p>
                 <p className="text-muted" style={{ margin: 0, fontSize: "0.75rem" }}>2 hours ago</p>
               </div>
             </div>
             <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
               <div style={{ padding: "0.5rem", background: "#f0fdf4", borderRadius: "50%", color: "#16a34a" }}>
                 <CheckCircle size={16} />
               </div>
               <div>
                 <p style={{ margin: 0, fontWeight: "bold", fontSize: "0.875rem" }}>Deal Closed: PR1025</p>
                 <p className="text-muted" style={{ margin: 0, fontSize: "0.75rem" }}>Yesterday</p>
               </div>
             </div>
             <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
               <div style={{ padding: "0.5rem", background: "#fef3c7", borderRadius: "50%", color: "#f59e0b" }}>
                 <Calendar size={16} />
               </div>
               <div>
                 <p style={{ margin: 0, fontWeight: "bold", fontSize: "0.875rem" }}>Site Visit Scheduled</p>
                 <p className="text-muted" style={{ margin: 0, fontSize: "0.75rem" }}>Tomorrow, 10:00 AM</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
