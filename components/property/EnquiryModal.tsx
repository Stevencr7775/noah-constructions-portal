"use client";

import { useState } from "react";
import { X, CheckCircle } from "lucide-react";

export interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: any;
  type: "Callback" | "Site Visit" | "Contact";
}

export default function EnquiryModal({ isOpen, onClose, property, type }: EnquiryModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    preferredVisitDate: "",
    preferredVisitTime: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/crm/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          propertyId: property?.id,
          sellerId: property?.sellerId,
          contactMethod: type === "Callback" ? "Call" : type === "Site Visit" ? "Visit" : "Email",
          source: "Website",
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.5)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem"
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        width: "100%",
        maxWidth: "500px",
        padding: "2rem",
        position: "relative"
      }}>
        <button 
          onClick={onClose}
          style={{ position: "absolute", top: "1.5rem", right: "1.5rem", background: "none", border: "none", cursor: "pointer" }}
        >
          <X size={24} color="#64748b" />
        </button>

        {success ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <CheckCircle size={64} color="#16a34a" style={{ margin: "0 auto 1rem auto" }} />
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Enquiry Submitted!</h2>
            <p className="text-muted">Our team will get back to you shortly.</p>
          </div>
        ) : (
          <>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
              {type === "Site Visit" ? "Book a Site Visit" : type === "Callback" ? "Request a Callback" : "Contact Seller"}
            </h2>
            <p className="text-muted" style={{ marginBottom: "2rem" }}>
              {property?.title || "This Property"}
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "0.875rem" }}>Full Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "0.875rem" }}>Phone Number *</label>
                  <input 
                    type="tel" 
                    required
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "0.875rem" }}>Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)" }}
                  />
                </div>
              </div>

              {type === "Site Visit" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "0.875rem" }}>Preferred Date *</label>
                    <input 
                      type="date" 
                      required
                      value={formData.preferredVisitDate}
                      onChange={e => setFormData({...formData, preferredVisitDate: e.target.value})}
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "0.875rem" }}>Preferred Time *</label>
                    <input 
                      type="time" 
                      required
                      value={formData.preferredVisitTime}
                      onChange={e => setFormData({...formData, preferredVisitTime: e.target.value})}
                      style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)" }}
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold", fontSize: "0.875rem" }}>Message</label>
                <textarea 
                  rows={3}
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  placeholder="I am interested in this property..."
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "8px", border: "1px solid var(--border)", resize: "none" }}
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
                {loading ? "Submitting..." : "Submit Enquiry"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
