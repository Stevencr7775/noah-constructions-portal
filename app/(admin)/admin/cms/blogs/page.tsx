import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";
import { PenTool, Plus, Edit, Trash2 } from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: <PenTool size={20} /> },
  { label: "Settings", href: "/admin/settings", icon: <PenTool size={20} /> },
];

export const revalidate = 0; // Don't cache admin list

export default async function BlogCMS() {
  const blogs = await prisma.blogPost.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <DashboardLayout role="ADMIN" links={sidebarLinks}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="section-title text-primary" style={{ fontSize: "1.75rem", margin: 0, display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <PenTool size={28} /> Blog Management
        </h1>
        <button className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Plus size={18} /> New Post
        </button>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Title</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Category</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Status</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Date</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.length > 0 ? blogs.map((blog) => (
              <tr key={blog.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }} className="hover:bg-slate-50">
                <td style={{ padding: "1rem", fontWeight: "bold" }}>{blog.title}</td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ padding: "0.25rem 0.75rem", background: "#f1f5f9", color: "#475569", borderRadius: "999px", fontSize: "0.875rem" }}>
                    {blog.category?.name || 'Uncategorized'}
                  </span>
                </td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ 
                    padding: "0.25rem 0.75rem", 
                    background: blog.status === 'Published' ? '#dcfce7' : '#fef3c7', 
                    color: blog.status === 'Published' ? '#16a34a' : '#d97706', 
                    borderRadius: "999px", 
                    fontSize: "0.875rem",
                    fontWeight: "bold"
                  }}>
                    {blog.status}
                  </span>
                </td>
                <td style={{ padding: "1rem", color: "#64748b", fontSize: "0.875rem" }}>
                  {blog.createdAt.toLocaleDateString()}
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
                  <PenTool size={48} style={{ margin: "0 auto 1rem auto", opacity: 0.2 }} />
                  <p>No blog posts found. Create one to get started.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
