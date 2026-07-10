import DashboardLayout from "@/components/dashboard/DashboardLayout";
import KPICard from "@/components/dashboard/KPICard";
import { LineChart, BarChart } from "@/components/dashboard/Charts";
import { Home, List, Database, Users, Building2, Download, Settings, BarChart as ChartIcon, CheckCircle, Clock, FileText, PenTool, LayoutTemplate, Briefcase, Calendar, Layers, QrCode } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: <Home size={20} /> },
  { label: "Project Management", href: "/admin/pm", icon: <Calendar size={20} /> },
  { label: "Inventory", href: "/admin/inventory", icon: <Layers size={20} /> },
  { label: "Approvals", href: "/admin/approvals", icon: <CheckCircle size={20} /> },
  { label: "Properties", href: "/admin/properties", icon: <Building2 size={20} /> },
  { label: "Add Property", href: "/admin/property-entry", icon: <List size={20} /> },
  { label: "CRM & Leads", href: "/admin/crm", icon: <Users size={20} /> },
  { label: "Website CMS", href: "/admin/cms", icon: <LayoutTemplate size={20} /> },
  { label: "Blogs & News", href: "/admin/cms/blogs", icon: <PenTool size={20} /> },
  { label: "Team & Careers", href: "/admin/cms/team", icon: <Briefcase size={20} /> },
  { label: "Master Data", href: "/admin/master-data", icon: <Database size={20} /> },
  { label: "Reports", href: "/admin/reports", icon: <ChartIcon size={20} /> },
  { label: "Documents", href: "/admin/documents", icon: <FileText size={20} /> },
  { label: "QR Generator", href: "/admin/qr", icon: <QrCode size={20} /> },
  { label: "System Health", href: "/admin/system", icon: <Database size={20} /> },
  { label: "Settings", href: "/admin/settings", icon: <Settings size={20} /> },
];

const mockGrowthData: any[] = [];

export default async function AdminDashboard() {
  const totalProperties = await prisma.property.count();
  const publishedProperties = await prisma.property.count({ where: { status: "Approved" } });
  const ongoingProjects = await prisma.project.count({ where: { status: "Active" } });
  const newEnquiries = await prisma.lead.count({ where: { status: "New" } });
  const siteVisits = await prisma.siteVisit.count();

  return (
    <DashboardLayout role="ADMIN" links={sidebarLinks}>
      <h1 className="section-title text-primary mb-6" style={{ fontSize: "1.75rem" }}>Super Admin Dashboard</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <KPICard title="Website Visitors" value="0" icon={<Users size={24} />} color="#3b82f6" />
        <KPICard title="Total Properties" value={totalProperties} icon={<Building2 size={24} />} color="#8b5cf6" />
        <KPICard title="Published Properties" value={publishedProperties} icon={<CheckCircle size={24} />} color="#16a34a" />
        <KPICard title="Ongoing Projects" value={ongoingProjects} icon={<Database size={24} />} color="#eab308" />
        <KPICard title="New Enquiries" value={newEnquiries} icon={<Clock size={24} />} color="#f97316" />
        <KPICard title="Site Visits" value={siteVisits} icon={<Home size={24} />} color="#06b6d4" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
        <div className="card" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>Platform Growth</h2>
          <LineChart 
            data={mockGrowthData} 
            xKey="month" 
            series={[
              { key: 'users', name: 'Users', color: '#3b82f6' },
              { key: 'properties', name: 'Properties', color: '#8b5cf6' }
            ]} 
          />
        </div>

        <div className="card" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem" }}>CMS Quick Shortcuts</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Link href="/admin/cms" className="btn btn-outline" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem", justifyContent: "flex-start" }}>
              <LayoutTemplate size={18} /> Manage Homepage
            </Link>
            <Link href="/admin/cms/blogs" className="btn btn-outline" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem", justifyContent: "flex-start" }}>
              <PenTool size={18} /> Write Blog Post
            </Link>
            <Link href="/admin/cms/team" className="btn btn-outline" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem", justifyContent: "flex-start" }}>
              <Briefcase size={18} /> Manage Team
            </Link>
            <Link href="/admin/settings" className="btn btn-outline" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "1rem", justifyContent: "flex-start" }}>
              <Settings size={18} /> SEO Settings
            </Link>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: "1.5rem" }}>
         <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Latest System Activities</h2>
         <div style={{ width: "100%", overflowX: "auto" }}>
           <table style={{ width: "100%", borderCollapse: "collapse" }}>
             <thead>
               <tr style={{ borderBottom: "2px solid var(--border)", textAlign: "left" }}>
                 <th style={{ padding: "1rem", color: "#64748b" }}>Time</th>
                 <th style={{ padding: "1rem", color: "#64748b" }}>Action</th>
                 <th style={{ padding: "1rem", color: "#64748b" }}>User/Role</th>
                 <th style={{ padding: "1rem", color: "#64748b" }}>Status</th>
               </tr>
             </thead>
             <tbody>
               {[]}
             </tbody>
           </table>
         </div>
      </div>
    </DashboardLayout>
  );
}
