"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, Phone, Mail, Clock, Calendar, CheckCircle, ChevronRight, XCircle, Users } from "lucide-react";

// Kanban Columns
const PIPELINE_STAGES = ["New", "Contacted", "Interested", "Site Visit", "Negotiation", "Booked", "Closed Won", "Closed Lost"];

export default function CRMKanbanDashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/crm/leads');
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  const updateLeadStatus = async (id: string, newStatus: string) => {
    try {
      // Optimistic UI update
      setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
      
      await fetch('/api/crm/leads', {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus })
      });
    } catch (err) {
      console.error(err);
      fetchLeads(); // Revert on failure
    }
  };

  if (loading) {
    return <div style={{ padding: "4rem", textAlign: "center", color: "#64748b" }}>Loading CRM Data...</div>;
  }

  return (
    <div style={{ padding: "2rem", background: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 className="section-title text-primary" style={{ margin: 0 }}>CRM Pipeline</h1>
          <p className="text-muted">Manage all customer enquiries and track them through the sales funnel.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link href="/admin/dashboard" className="btn btn-outline">Back to Admin</Link>
          <button className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Users size={18} /> All Customers
          </button>
        </div>
      </div>

      <div style={{ 
        display: "flex", 
        gap: "1.5rem", 
        overflowX: "auto", 
        paddingBottom: "1rem",
        minHeight: "calc(100vh - 200px)"
      }}>
        {PIPELINE_STAGES.map(stage => {
          const stageLeads = leads.filter(l => l.status === stage);
          
          return (
            <div key={stage} style={{ 
              minWidth: "300px", 
              width: "300px", 
              background: "white", 
              borderRadius: "12px", 
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              flexShrink: 0
            }}>
              <div style={{ padding: "1rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f1f5f9", borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "bold", color: "#334155" }}>{stage}</h3>
                <span style={{ background: "#cbd5e1", color: "#334155", padding: "0.125rem 0.5rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: "bold" }}>
                  {stageLeads.length}
                </span>
              </div>
              
              <div style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "1rem", flex: 1, overflowY: "auto", background: "#f8fafc" }}>
                {stageLeads.map(lead => (
                  <div key={lead.id} className="card" style={{ padding: "1rem", border: "1px solid var(--border)", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", cursor: "pointer", position: "relative" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: "bold", background: "#eff6ff", padding: "0.125rem 0.5rem", borderRadius: "4px" }}>
                        {lead.enquiryId}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem", fontWeight: "bold" }}>{lead.name}</h4>
                    <p style={{ margin: "0 0 1rem 0", fontSize: "0.875rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <Phone size={12} /> {lead.phone}
                    </p>

                    <div style={{ fontSize: "0.75rem", color: "#475569", marginBottom: "1rem", borderTop: "1px solid #f1f5f9", paddingTop: "0.5rem" }}>
                       <strong>Property:</strong> {lead.property?.title || 'General Enquiry'}
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Link href={`/admin/crm/leads/${lead.id}`} style={{ fontSize: "0.75rem", color: "var(--primary)", fontWeight: "bold", textDecoration: "none" }}>
                        View Details
                      </Link>
                      
                      {/* Simple Quick Action to move to next stage */}
                      {stage !== "Closed Won" && stage !== "Closed Lost" && (
                        <select 
                          value={stage}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                          style={{ fontSize: "0.75rem", padding: "0.25rem", borderRadius: "4px", border: "1px solid var(--border)", background: "white" }}
                        >
                          {PIPELINE_STAGES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </div>
                ))}
                
                {stageLeads.length === 0 && (
                  <div style={{ textAlign: "center", padding: "2rem 0", color: "#cbd5e1", fontSize: "0.875rem", borderStyle: "dashed", borderWidth: "2px", borderColor: "#e2e8f0", borderRadius: "8px" }}>
                    Drop leads here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
