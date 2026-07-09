import { prisma } from "@/lib/prisma";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";
import { Layers, Plus, Filter, Search } from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: <Layers size={20} /> },
  { label: "Project Management", href: "/admin/pm", icon: <Layers size={20} /> },
  { label: "Inventory", href: "/admin/inventory", icon: <Layers size={20} /> },
];

export const revalidate = 0;

export default async function InventoryCMS() {
  const properties = await prisma.property.findMany({
    include: { project: true, buyer: true },
    orderBy: { createdAt: 'desc' }
  });

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'Available': return { bg: '#dcfce7', text: '#16a34a' };
      case 'Reserved': return { bg: '#fef3c7', text: '#d97706' };
      case 'Sold': return { bg: '#f1f5f9', text: '#475569' };
      case 'Blocked': return { bg: '#fee2e2', text: '#ef4444' };
      case 'Under Documentation': return { bg: '#dbeafe', text: '#2563eb' };
      default: return { bg: '#f1f5f9', text: '#475569' };
    }
  };

  return (
    <DashboardLayout role="ADMIN" links={sidebarLinks}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="section-title text-primary" style={{ fontSize: "1.75rem", margin: 0, display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Layers size={28} /> Master Inventory Management
        </h1>
        <button className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Plus size={18} /> Add Unit/Plot
        </button>
      </div>

      <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem", display: "flex", gap: "1rem", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input type="text" className="form-input" placeholder="Search by Plot No, Block, Project..." style={{ paddingLeft: "3rem" }} />
        </div>
        <select className="form-input" style={{ width: "200px" }}>
          <option value="">All Projects</option>
        </select>
        <select className="form-input" style={{ width: "150px" }}>
          <option value="">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Reserved">Reserved</option>
          <option value="Sold">Sold</option>
        </select>
        <button className="btn btn-outline" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Filter size={18} /> Filter
        </button>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Unit / Plot Details</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Project & Location</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Specifications</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Status</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Customer</th>
            </tr>
          </thead>
          <tbody>
            {properties.length > 0 ? properties.map((prop) => {
              const statusColor = getStatusColor(prop.currentStatus);
              return (
                <tr key={prop.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }} className="hover:bg-slate-50">
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: "bold", fontSize: "1rem", color: "var(--primary)" }}>{prop.propertyId || 'Unit-X'}</div>
                    <div style={{ color: "#64748b", fontSize: "0.875rem" }}>Block: {prop.block || 'N/A'}</div>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: "bold" }}>{prop.project?.title || 'Standalone'}</div>
                    <div style={{ color: "#64748b", fontSize: "0.875rem" }}>{prop.locality || 'Unknown'}</div>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", fontSize: "0.875rem" }}>
                      <span>{prop.plotSize || prop.squareFeet + ' sqft'}</span>
                      <span style={{ color: "#64748b" }}>{prop.facing} Facing</span>
                    </div>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ 
                      padding: "0.25rem 0.75rem", 
                      background: statusColor.bg, 
                      color: statusColor.text, 
                      borderRadius: "999px", 
                      fontSize: "0.875rem",
                      fontWeight: "bold"
                    }}>
                      {prop.currentStatus || 'Available'}
                    </span>
                  </td>
                  <td style={{ padding: "1rem" }}>
                    {prop.buyer ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--primary)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: "bold" }}>
                          {prop.buyer.name.charAt(0)}
                        </div>
                        <span style={{ fontSize: "0.875rem", fontWeight: "bold" }}>{prop.buyer.name}</span>
                      </div>
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: "0.875rem" }}>-</span>
                    )}
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={5} style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                  <Layers size={48} style={{ margin: "0 auto 1rem auto", opacity: 0.2 }} />
                  <p>No inventory units found.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}
