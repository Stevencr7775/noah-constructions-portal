import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Briefcase, Plus, Edit, Trash2 } from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: <Briefcase size={20} /> },
  { label: "Settings", href: "/admin/settings", icon: <Briefcase size={20} /> },
];

export const revalidate = 0;

export default async function TeamCMS() {
  const team = await prisma.teamMember.findMany({
    orderBy: { order: 'asc' }
  });

  return (
    <DashboardLayout role="ADMIN" links={sidebarLinks}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="section-title text-primary" style={{ fontSize: "1.75rem", margin: 0, display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Briefcase size={28} /> Team & Careers Management
        </h1>
        <button className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Plus size={18} /> Add Team Member
        </button>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Name</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Designation</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Experience</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {team.length > 0 ? team.map((member) => (
              <tr key={member.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }} className="hover:bg-slate-50">
                <td style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#e2e8f0", overflow: "hidden" }}>
                      {member.photoUrl ? (
                        <img src={member.photoUrl} alt={member.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>?</div>
                      )}
                    </div>
                    <span style={{ fontWeight: "bold" }}>{member.name}</span>
                  </div>
                </td>
                <td style={{ padding: "1rem", color: "#475569" }}>{member.designation}</td>
                <td style={{ padding: "1rem", color: "#475569" }}>{member.experience || 'N/A'}</td>
                <td style={{ padding: "1rem", textAlign: "right" }}>
                  <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                    <button className="btn btn-outline" style={{ padding: "0.25rem 0.5rem" }} title="Edit">
                      <Edit size={16} />
                    </button>
                    <button className="btn btn-outline" style={{ padding: "0.25rem 0.5rem", color: "#ef4444", borderColor: "#fca5a5" }} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={4} style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                  <Briefcase size={48} style={{ margin: "0 auto 1rem auto", opacity: 0.2 }} />
                  <p>No team members found. Add one to get started.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
