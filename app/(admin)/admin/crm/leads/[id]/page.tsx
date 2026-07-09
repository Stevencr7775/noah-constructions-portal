import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, Clock, Edit } from "lucide-react";

export default async function LeadDetailView({ params }: { params: { id: string } }) {
  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
    include: {
      property: true,
      followUps: {
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!lead) {
    return notFound();
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <Link href="/admin/crm" className="btn btn-outline" style={{ padding: "0.5rem" }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.75rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            Lead Details
            <span style={{ fontSize: "0.875rem", background: "#eff6ff", color: "var(--primary)", padding: "0.25rem 0.75rem", borderRadius: "999px" }}>
              {lead.enquiryId}
            </span>
          </h1>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Customer Info */}
          <div className="card" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: "0 0 1.5rem 0", display: "flex", justifyContent: "space-between" }}>
              Customer Profile
              <button className="text-primary" style={{ background: "none", border: "none", cursor: "pointer" }}><Edit size={16} /></button>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <span className="text-muted" style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.25rem" }}>Full Name</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "bold" }}>
                  <User size={16} color="#64748b" /> {lead.name || "N/A"}
                </div>
              </div>
              <div>
                <span className="text-muted" style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.25rem" }}>Phone</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "bold" }}>
                  <Phone size={16} color="#64748b" /> {lead.phone || "N/A"}
                </div>
              </div>
              <div>
                <span className="text-muted" style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.25rem" }}>Email</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "bold" }}>
                  <Mail size={16} color="#64748b" /> {lead.email || "N/A"}
                </div>
              </div>
              <div>
                <span className="text-muted" style={{ display: "block", fontSize: "0.875rem", marginBottom: "0.25rem" }}>Pref. Contact Method</span>
                <div style={{ fontWeight: "bold" }}>{lead.contactMethod || "Any"}</div>
              </div>
            </div>
          </div>

          {/* Enquiry Details */}
          <div className="card" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: "0 0 1.5rem 0" }}>Enquiry Context</h2>
            <div style={{ background: "#f8fafc", padding: "1.5rem", borderRadius: "12px", border: "1px solid var(--border)", marginBottom: "1.5rem" }}>
               <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", color: "#64748b" }}>Message Attached</h4>
               <p style={{ margin: 0 }}>{lead.message || "No message provided."}</p>
            </div>

            {lead.preferredVisitDate && (
               <div style={{ display: "flex", gap: "2rem", marginBottom: "1.5rem", padding: "1rem", background: "#fef3c7", borderRadius: "12px", color: "#92400e" }}>
                 <div>
                   <span style={{ display: "block", fontSize: "0.75rem", marginBottom: "0.25rem", fontWeight: "bold" }}>Requested Visit Date</span>
                   <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                     <Calendar size={16} /> {lead.preferredVisitDate}
                   </div>
                 </div>
                 <div>
                   <span style={{ display: "block", fontSize: "0.75rem", marginBottom: "0.25rem", fontWeight: "bold" }}>Requested Time</span>
                   <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                     <Clock size={16} /> {lead.preferredVisitTime || "Any time"}
                   </div>
                 </div>
               </div>
            )}
            
            {lead.property && (
              <div>
                <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem", color: "#64748b" }}>Interested Property</h4>
                <div style={{ display: "flex", gap: "1rem", padding: "1rem", border: "1px solid var(--border)", borderRadius: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <h5 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem" }}>{lead.property.title}</h5>
                    <p className="text-muted" style={{ margin: 0, fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <MapPin size={14} /> {lead.property.locality}, {lead.property.city}
                    </p>
                  </div>
                  <div style={{ fontWeight: "bold", color: "var(--primary)" }}>
                    ₹{lead.property.totalPrice?.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar / Status & Follow-ups */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          <div className="card" style={{ padding: "1.5rem" }}>
            <h3 style={{ fontSize: "1rem", margin: "0 0 1rem 0", color: "#64748b" }}>Current Status</h3>
            <div style={{ fontSize: "1.25rem", fontWeight: "bold", padding: "0.75rem", background: "#f1f5f9", borderRadius: "8px", textAlign: "center", marginBottom: "1rem" }}>
              {lead.status}
            </div>
            <p className="text-muted" style={{ fontSize: "0.75rem", textAlign: "center", margin: 0 }}>
              Created on {lead.createdAt.toLocaleDateString()}
            </p>
          </div>

          <div className="card" style={{ padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1rem", margin: 0 }}>Follow-ups & Notes</h3>
              <button className="btn btn-primary" style={{ padding: "0.25rem 0.75rem", fontSize: "0.875rem" }}>+ Add</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {lead.followUps.length > 0 ? lead.followUps.map(f => (
                <div key={f.id} style={{ padding: "1rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid var(--border)" }}>
                  <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.875rem" }}>{f.notes}</p>
                  <span className="text-muted" style={{ fontSize: "0.75rem" }}>{f.createdAt.toLocaleDateString()}</span>
                </div>
              )) : (
                <div style={{ textAlign: "center", padding: "1rem", color: "#94a3b8", fontSize: "0.875rem" }}>
                  No follow-ups recorded yet.
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
