import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { MessageSquare, Plus, Edit, Trash2, Star } from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: <MessageSquare size={20} /> },
  { label: "Settings", href: "/admin/settings", icon: <MessageSquare size={20} /> },
];

export const revalidate = 0;

export default async function TestimonialsCMS() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <DashboardLayout role="ADMIN" links={sidebarLinks}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="section-title text-primary" style={{ fontSize: "1.75rem", margin: 0, display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <MessageSquare size={28} /> Testimonials Management
        </h1>
        <button className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Plus size={18} /> Add Testimonial
        </button>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Customer</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Rating</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Status</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Featured</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.length > 0 ? testimonials.map((t) => (
              <tr key={t.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }} className="hover:bg-slate-50">
                <td style={{ padding: "1rem", fontWeight: "bold" }}>{t.customerName}</td>
                <td style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", color: "#eab308" }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < t.rating ? "currentColor" : "none"} />
                    ))}
                  </div>
                </td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ 
                    padding: "0.25rem 0.75rem", 
                    background: t.status === 'Approved' ? '#dcfce7' : '#fef3c7', 
                    color: t.status === 'Approved' ? '#16a34a' : '#d97706', 
                    borderRadius: "999px", 
                    fontSize: "0.875rem",
                    fontWeight: "bold"
                  }}>
                    {t.status}
                  </span>
                </td>
                <td style={{ padding: "1rem" }}>
                  {t.isFeatured ? (
                    <span style={{ padding: "0.25rem 0.75rem", background: "#eff6ff", color: "var(--primary)", borderRadius: "999px", fontSize: "0.875rem", fontWeight: "bold" }}>Featured</span>
                  ) : (
                    <span style={{ color: "#94a3b8" }}>-</span>
                  )}
                </td>
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
                <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                  <MessageSquare size={48} style={{ margin: "0 auto 1rem auto", opacity: 0.2 }} />
                  <p>No testimonials found. Add one to get started.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
