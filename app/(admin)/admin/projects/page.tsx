import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";
import { Building2, Plus, Edit, Trash2, Calendar, MapPin, Activity } from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: <Building2 size={20} /> },
  { label: "Project Management", href: "/admin/pm", icon: <Calendar size={20} /> },
  { label: "Projects", href: "/admin/projects", icon: <Building2 size={20} /> },
];

export const revalidate = 0;

export default async function ProjectsCMS() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <DashboardLayout role="ADMIN" links={sidebarLinks}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="section-title text-primary" style={{ fontSize: "1.75rem", margin: 0, display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Building2 size={28} /> Project Management Lifecycle
        </h1>
        <Link href="/admin/projects/new" className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Plus size={18} /> New Project
        </Link>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Project Code & Name</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Type</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Status & Progress</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Launch Date</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? projects.map((project) => (
              <tr key={project.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }} className="hover:bg-slate-50">
                <td style={{ padding: "1rem" }}>
                  <div style={{ fontWeight: "bold", fontSize: "1rem", color: "var(--primary)" }}>{project.title}</div>
                  <div style={{ color: "#64748b", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.25rem" }}>
                    <span style={{ background: "#e2e8f0", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>{project.projectCode || 'No Code'}</span>
                    <MapPin size={14} /> {project.location || 'Location TBA'}
                  </div>
                </td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ padding: "0.25rem 0.75rem", background: "#f1f5f9", color: "#475569", borderRadius: "999px", fontSize: "0.875rem", fontWeight: "bold" }}>
                    {project.projectType || 'Standard'}
                  </span>
                </td>
                <td style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <span style={{ 
                      padding: "0.25rem 0.75rem", 
                      background: project.status === 'Completed' ? '#dcfce7' : project.status === 'Archived' ? '#f1f5f9' : '#dbeafe', 
                      color: project.status === 'Completed' ? '#16a34a' : project.status === 'Archived' ? '#475569' : '#2563eb', 
                      borderRadius: "999px", 
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      display: "inline-block",
                      width: "fit-content"
                    }}>
                      {project.status}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.75rem", color: "#64748b" }}>
                      <Activity size={14} /> {project.progress}% Complete
                      <div style={{ flex: 1, height: "4px", background: "#e2e8f0", borderRadius: "999px", overflow: "hidden", minWidth: "60px" }}>
                        <div style={{ width: `\${project.progress}%`, height: "100%", background: project.progress === 100 ? '#10b981' : 'var(--primary)' }}></div>
                      </div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "1rem", color: "#64748b", fontSize: "0.875rem" }}>
                  {project.launchDate ? project.launchDate.toLocaleDateString() : 'TBA'}
                </td>
                <td style={{ padding: "1rem", textAlign: "right" }}>
                  <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                    <Link href={`/admin/projects/\${project.id}`} className="btn btn-outline" style={{ padding: "0.25rem 0.5rem" }} title="Edit">
                      <Edit size={16} />
                    </Link>
                    <button className="btn btn-outline" style={{ padding: "0.25rem 0.5rem", color: "#ef4444", borderColor: "#fca5a5" }} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                  <Building2 size={48} style={{ margin: "0 auto 1rem auto", opacity: 0.2 }} />
                  <p>No projects found. Create one to manage its lifecycle.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
