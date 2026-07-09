import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import KPICard from "@/components/dashboard/KPICard";
import { Calendar, Building2, CheckCircle, Clock, Search, List, Activity, Users } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function PMDashboard() {
  const [
    totalProjects,
    activeProjects,
    completedProjects,
    totalProperties,
    availableProperties,
    soldProperties
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "Under Construction" } }),
    prisma.project.count({ where: { status: "Completed" } }),
    prisma.property.count(),
    prisma.property.count({ where: { currentStatus: "Available" } }),
    prisma.property.count({ where: { currentStatus: "Sold" } })
  ]);

  const recentProjects = await prisma.project.findMany({
    take: 5,
    orderBy: { updatedAt: 'desc' }
  });

  // Re-define sidebar to match the layout
  const sidebarLinks = [
    { label: "Dashboard", href: "/admin", icon: <Building2 size={20} /> },
    { label: "Project Management", href: "/admin/pm", icon: <Calendar size={20} /> },
    { label: "Inventory", href: "/admin/inventory", icon: <List size={20} /> },
    { label: "Settings", href: "/admin/settings", icon: <CheckCircle size={20} /> },
  ];

  return (
    <DashboardLayout role="ADMIN" links={sidebarLinks}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="section-title text-primary" style={{ fontSize: "1.75rem", margin: 0, display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Calendar size={28} /> Executive Project Dashboard
        </h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/admin/projects/new" className="btn btn-primary">
            + New Project
          </Link>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <KPICard title="Total Projects" value={totalProjects.toString()} icon={<Building2 size={24} />} color="#3b82f6" />
        <KPICard title="Active Construction" value={activeProjects.toString()} icon={<Activity size={24} />} color="#f59e0b" />
        <KPICard title="Completed Projects" value={completedProjects.toString()} icon={<CheckCircle size={24} />} color="#10b981" />
        <KPICard title="Total Inventory" value={totalProperties.toString()} icon={<List size={24} />} color="#6366f1" />
        <KPICard title="Available Units" value={availableProperties.toString()} icon={<Search size={24} />} color="#06b6d4" />
        <KPICard title="Sold Units" value={soldProperties.toString()} icon={<Users size={24} />} color="#8b5cf6" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "2rem" }}>
        {/* Active Projects List */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: 0 }}>Recent Projects</h2>
            <Link href="/admin/projects" style={{ color: "var(--primary)", fontWeight: "bold", fontSize: "0.875rem" }}>View All</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {recentProjects.length > 0 ? recentProjects.map(project => (
              <div key={project.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid var(--border)" }}>
                <div>
                  <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem" }}>{project.title} {project.projectCode && <span style={{ color: "#64748b", fontSize: "0.875rem" }}>({project.projectCode})</span>}</h3>
                  <div style={{ color: "#64748b", fontSize: "0.875rem", display: "flex", gap: "1rem" }}>
                    <span>{project.projectType || 'Uncategorized'}</span>
                    <span>•</span>
                    <span>Progress: {project.progress}%</span>
                  </div>
                </div>
                <span style={{ 
                  padding: "0.25rem 0.75rem", 
                  background: project.status === 'Completed' ? '#dcfce7' : project.status === 'Active' ? '#dbeafe' : '#fef3c7', 
                  color: project.status === 'Completed' ? '#16a34a' : project.status === 'Active' ? '#2563eb' : '#d97706', 
                  borderRadius: "999px", 
                  fontSize: "0.75rem",
                  fontWeight: "bold"
                }}>
                  {project.status}
                </span>
              </div>
            )) : (
              <p style={{ color: "#64748b", textAlign: "center", padding: "2rem" }}>No projects found.</p>
            )}
          </div>
        </div>

        {/* Analytics Snapshot */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h2 style={{ fontSize: "1.25rem", margin: "0 0 1rem 0" }}>Company Analytics</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: "bold", color: "#475569" }}>Inventory Sold</span>
                <span style={{ fontWeight: "bold", color: "var(--primary)" }}>
                  {totalProperties > 0 ? Math.round((soldProperties / totalProperties) * 100) : 0}%
                </span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{ width: `\${totalProperties > 0 ? (soldProperties / totalProperties) * 100 : 0}%`, height: "100%", background: "var(--primary)" }}></div>
              </div>
            </div>
            
            <div style={{ padding: "1rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "0.25rem" }}>Most Enquired Project</div>
              <div style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#0f172a" }}>N/A</div>
            </div>

            <div style={{ padding: "1rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "0.25rem" }}>Average Construction Progress</div>
              <div style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#0f172a" }}>N/A</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
