import { prisma } from "@/lib/prisma";
import { Download, TrendingUp, Users, Building, FileText, Activity } from "lucide-react";

export const revalidate = 60;

export default async function ReportsDashboardPage() {
  // Aggregate Stats
  const totalProperties = await prisma.property.count();
  const totalLeads = await prisma.lead.count();
  const totalSiteVisits = await prisma.siteVisit.count();
  const totalDocuments = await prisma.document.count();

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", margin: "0 0 0.5rem 0", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <TrendingUp className="text-primary" size={28} />
            Reports & Analytics
          </h1>
          <p className="text-muted" style={{ margin: 0 }}>Export data and view aggregate business performance.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
        <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ padding: "1rem", background: "#eff6ff", color: "var(--primary)", borderRadius: "12px" }}><Building size={24} /></div>
          <div>
            <p className="text-muted" style={{ margin: "0 0 0.25rem 0", fontSize: "0.875rem" }}>Total Properties</p>
            <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>{totalProperties}</h3>
          </div>
        </div>
        <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ padding: "1rem", background: "#fef3c7", color: "#d97706", borderRadius: "12px" }}><Users size={24} /></div>
          <div>
            <p className="text-muted" style={{ margin: "0 0 0.25rem 0", fontSize: "0.875rem" }}>Total Leads</p>
            <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>{totalLeads}</h3>
          </div>
        </div>
        <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ padding: "1rem", background: "#ecfdf5", color: "#059669", borderRadius: "12px" }}><Activity size={24} /></div>
          <div>
            <p className="text-muted" style={{ margin: "0 0 0.25rem 0", fontSize: "0.875rem" }}>Site Visits</p>
            <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>{totalSiteVisits}</h3>
          </div>
        </div>
        <div className="card" style={{ padding: "1.5rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ padding: "1rem", background: "#f3e8ff", color: "#9333ea", borderRadius: "12px" }}><FileText size={24} /></div>
          <div>
            <p className="text-muted" style={{ margin: "0 0 0.25rem 0", fontSize: "0.875rem" }}>Documents</p>
            <h3 style={{ margin: 0, fontSize: "1.5rem", fontWeight: "bold" }}>{totalDocuments}</h3>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: "1.25rem", margin: "0 0 1rem 0" }}>Export Data Engine</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        
        {/* Properties Report */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.125rem", margin: "0 0 0.5rem 0" }}>Property Master Report</h3>
          <p className="text-muted" style={{ margin: "0 0 1.5rem 0", fontSize: "0.875rem" }}>Download a complete Excel report of all properties including location, price, and status.</p>
          <a href="/api/export/reports?type=properties" target="_blank" className="btn btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <Download size={18} /> Export Properties (XLSX)
          </a>
        </div>

        {/* Leads Report */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.125rem", margin: "0 0 0.5rem 0" }}>CRM Leads Report</h3>
          <p className="text-muted" style={{ margin: "0 0 1.5rem 0", fontSize: "0.875rem" }}>Download lead data including contact details, pipeline status, and enquiry context.</p>
          <a href="/api/export/reports?type=leads" target="_blank" className="btn btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <Download size={18} /> Export Leads (XLSX)
          </a>
        </div>

        {/* Site Visits Report */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.125rem", margin: "0 0 0.5rem 0" }}>Site Visits Report</h3>
          <p className="text-muted" style={{ margin: "0 0 1.5rem 0", fontSize: "0.875rem" }}>Download a log of all scheduled and completed site visits.</p>
          <a href="/api/export/reports?type=sitevisits" target="_blank" className="btn btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <Download size={18} /> Export Site Visits (XLSX)
          </a>
        </div>

      </div>
    </div>
  );
}
