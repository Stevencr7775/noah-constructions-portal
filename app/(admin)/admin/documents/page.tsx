import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { FileText, Search, Filter, Download, Plus, Shield, ShieldAlert, FileSearch } from "lucide-react";

export default async function DownloadCenterPage({ searchParams }: { searchParams: { q?: string } }) {
  const query = searchParams.q || "";
  
  const documents = await prisma.document.findMany({
    where: query ? {
      OR: [
        { name: { contains: query } },
        { documentType: { contains: query } },
        { property: { title: { contains: query } } }
      ]
    } : undefined,
    include: {
      property: { select: { title: true, propertyId: true } },
      project: { select: { title: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <FileText className="text-primary" size={28} />
            Download Center
          </h1>
          <p className="text-muted" style={{ margin: 0 }}>Manage all property and project documents</p>
        </div>
        <button className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Plus size={18} /> Upload Document
        </button>
      </div>

      <div className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <form style={{ display: "flex", gap: "1rem" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input 
              type="text" 
              name="q"
              defaultValue={query}
              placeholder="Search documents by name, type, or property..." 
              className="form-input" 
              style={{ paddingLeft: "2.5rem" }}
            />
          </div>
          <button type="button" className="btn btn-outline" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Filter size={18} /> Filters
          </button>
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid var(--border)", textAlign: "left" }}>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Document</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Related To</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Type</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Visibility</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569" }}>Date</th>
              <th style={{ padding: "1rem", fontWeight: "600", color: "#475569", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.length > 0 ? documents.map((doc) => (
              <tr key={doc.id} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }} className="hover:bg-slate-50">
                <td style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ padding: "0.5rem", background: "#f1f5f9", borderRadius: "8px", color: "var(--primary)" }}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <p style={{ margin: 0, fontWeight: "bold" }}>{doc.name}</p>
                      <span className="text-muted" style={{ fontSize: "0.75rem" }}>v{doc.version}</span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "1rem" }}>
                  {doc.property ? (
                    <div>
                      <Link href={`/properties/${doc.property.propertyId}`} target="_blank" className="text-primary" style={{ fontWeight: "bold", display: "block" }}>
                        {doc.property.propertyId}
                      </Link>
                      <span className="text-muted" style={{ fontSize: "0.75rem" }}>{doc.property.title}</span>
                    </div>
                  ) : doc.project ? (
                    <span style={{ fontWeight: "bold" }}>Project: {doc.project.title}</span>
                  ) : (
                    <span className="text-muted">General</span>
                  )}
                </td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ padding: "0.25rem 0.75rem", background: "#eff6ff", color: "var(--primary)", borderRadius: "999px", fontSize: "0.875rem" }}>
                    {doc.documentType}
                  </span>
                </td>
                <td style={{ padding: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: doc.visibility === "Public" ? "#22c55e" : "#f59e0b", fontSize: "0.875rem", fontWeight: "bold" }}>
                    {doc.visibility === "Public" ? <Shield size={16} /> : <ShieldAlert size={16} />}
                    {doc.visibility}
                  </div>
                </td>
                <td style={{ padding: "1rem" }}>
                  <p style={{ margin: 0, fontSize: "0.875rem" }}>{doc.createdAt.toLocaleDateString()}</p>
                  <span className="text-muted" style={{ fontSize: "0.75rem" }}>by {doc.uploadedBy || 'Admin'}</span>
                </td>
                <td style={{ padding: "1rem", textAlign: "right" }}>
                  <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                    <a href={doc.url} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: "0.25rem 0.5rem" }} title="Preview">
                      <FileSearch size={16} />
                    </a>
                    <a href={doc.url} download className="btn btn-primary" style={{ padding: "0.25rem 0.5rem" }} title="Download">
                      <Download size={16} />
                    </a>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} style={{ padding: "3rem", textAlign: "center", color: "#64748b" }}>
                  <FileText size={48} style={{ margin: "0 auto 1rem auto", opacity: 0.2 }} />
                  <p>No documents found matching your criteria.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
