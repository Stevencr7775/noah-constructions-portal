import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";
import { Building2, ArrowLeft, Image as ImageIcon, CheckCircle, UploadCloud, Flag, Calendar, Trash2 } from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: <Building2 size={20} /> },
  { label: "Project Management", href: "/admin/pm", icon: <Calendar size={20} /> },
  { label: "Projects", href: "/admin/projects", icon: <Building2 size={20} /> },
];

export default async function ProjectMediaPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { milestones: { orderBy: { percentage: 'asc' } } }
  });

  if (!project) return <div>Project not found</div>;

  return (
    <DashboardLayout role="ADMIN" links={sidebarLinks}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href={`/admin/projects/\${project.id}`} className="btn btn-outline" style={{ padding: "0.5rem" }}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className="section-title text-primary" style={{ fontSize: "1.75rem", margin: 0 }}>
            {project.title} - Planning & Progress
          </h1>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
        {/* Master Plan & Layouts */}
        <div className="card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ImageIcon size={20} color="var(--primary)" /> Master Plan & Renderings
            </h2>
            <button className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <UploadCloud size={18} /> Upload New
            </button>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
            {['Master Layout', 'Floor Plan - Type A', 'Elevation Render'].map((plan, i) => (
              <div key={i} style={{ border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
                <div style={{ height: "150px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ImageIcon size={48} color="#cbd5e1" />
                </div>
                <div style={{ padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: "bold" }}>{plan}</span>
                  <button style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones & Progress Timeline */}
        <div className="card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Flag size={20} color="var(--primary)" /> Construction Milestones
            </h2>
            <button className="btn btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              + Add Milestone
            </button>
          </div>

          <div style={{ border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden" }}>
            {project.milestones.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
                    <th style={{ padding: "1rem" }}>Milestone</th>
                    <th style={{ padding: "1rem" }}>Target %</th>
                    <th style={{ padding: "1rem" }}>Date</th>
                    <th style={{ padding: "1rem" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {project.milestones.map(m => (
                    <tr key={m.id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "1rem", fontWeight: "bold" }}>{m.name}</td>
                      <td style={{ padding: "1rem" }}>{m.percentage}%</td>
                      <td style={{ padding: "1rem" }}>{m.date ? m.date.toLocaleDateString() : 'TBA'}</td>
                      <td style={{ padding: "1rem" }}>
                        <span style={{ padding: "0.25rem 0.5rem", background: m.status === 'Completed' ? '#dcfce7' : '#fef3c7', color: m.status === 'Completed' ? '#16a34a' : '#d97706', borderRadius: "999px", fontSize: "0.75rem", fontWeight: "bold" }}>
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                <Flag size={48} style={{ margin: "0 auto 1rem auto", opacity: 0.2 }} />
                <p>No milestones tracked for this project.</p>
                <button className="btn btn-outline" style={{ marginTop: "1rem" }}>Load Default Template (e.g. Excavation, Foundation, etc.)</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
