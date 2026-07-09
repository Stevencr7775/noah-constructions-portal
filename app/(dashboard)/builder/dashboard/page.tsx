"use client";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import KPICard from "@/components/dashboard/KPICard";
import { PieChart, LineChart } from "@/components/dashboard/Charts";
import { Home, Building2, Calendar, FileText, Bell, User, CheckCircle, IndianRupee } from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/builder/dashboard", icon: <Home size={20} /> },
  { label: "Company Projects", href: "/builder/projects", icon: <Building2 size={20} /> },
  { label: "Property Inventory", href: "/builder/inventory", icon: <CheckCircle size={20} /> },
  { label: "Customer Documents", href: "/builder/documents", icon: <FileText size={20} /> },
  { label: "Bookings", href: "/builder/bookings", icon: <Calendar size={20} /> },
  { label: "Notifications", href: "/builder/notifications", icon: <Bell size={20} /> },
  { label: "Profile", href: "/builder/profile", icon: <User size={20} /> },
];

const revenueData = [
  { month: 'Jan', revenue: 15000000 },
  { month: 'Feb', revenue: 22000000 },
  { month: 'Mar', revenue: 18000000 },
  { month: 'Apr', revenue: 35000000 },
];

const projectStatusData = [
  { name: 'Active', value: 4 },
  { name: 'Completed', value: 12 },
  { name: 'Upcoming', value: 2 },
];
const pieColors = ['#3b82f6', '#16a34a', '#eab308'];

export default function BuilderDashboard() {
  return (
    <DashboardLayout role="BUILDER" links={sidebarLinks}>
      <h1 className="section-title text-primary mb-6" style={{ fontSize: "1.75rem" }}>Builder Dashboard</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <KPICard title="Total Projects" value="18" icon={<Building2 size={24} />} color="#3b82f6" />
        <KPICard title="Total Bookings" value="156" icon={<CheckCircle size={24} />} color="#16a34a" trend={8.4} trendLabel="vs last month" />
        <KPICard title="Pending Documents" value="12" icon={<FileText size={24} />} color="#eab308" />
        <KPICard title="Revenue (Q2)" value="₹3.5Cr" icon={<IndianRupee size={24} />} color="#ec4899" trend={15.0} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        <div className="card" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Revenue Trend</h2>
          <LineChart 
            data={revenueData} 
            xKey="month" 
            series={[
              { key: 'revenue', name: 'Revenue (₹)', color: '#ec4899' }
            ]} 
          />
        </div>

        <div className="card" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Project Status</h2>
          <PieChart data={projectStatusData} colors={pieColors} height={250} />
        </div>
      </div>
      
      <div className="card mt-8" style={{ padding: "1.5rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Active Projects Construction Progress</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
               <span style={{ fontWeight: "bold" }}>Noah Towers (Banjara Hills)</span>
               <span className="text-muted">75%</span>
             </div>
             <div style={{ width: "100%", height: "8px", background: "#e2e8f0", borderRadius: "4px" }}>
               <div style={{ width: "75%", height: "100%", background: "#3b82f6", borderRadius: "4px" }}></div>
             </div>
          </div>
          <div>
             <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
               <span style={{ fontWeight: "bold" }}>Sunrise Villas (Gachibowli)</span>
               <span className="text-muted">40%</span>
             </div>
             <div style={{ width: "100%", height: "8px", background: "#e2e8f0", borderRadius: "4px" }}>
               <div style={{ width: "40%", height: "100%", background: "#3b82f6", borderRadius: "4px" }}></div>
             </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
