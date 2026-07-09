"use client";

import { useState } from "react";
import { MessageCircle, Phone, Calendar, Mail } from "lucide-react";
import EnquiryModal from "./EnquiryModal";

export default function EnquiryActionBar({ property }: { property: any }) {
  const [modalType, setModalType] = useState<"Callback" | "Site Visit" | "Contact" | null>(null);

  const handleWhatsApp = () => {
    const text = `Hi, I am interested in property ${property?.propertyId} - ${property?.title} located at ${property?.locality}. Could you provide more details?`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <>
      <div style={{
        background: "white",
        borderRadius: "12px",
        padding: "1.5rem",
        border: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        position: "sticky",
        top: "100px"
      }}>
        <h3 style={{ fontSize: "1.25rem", margin: 0, fontWeight: "bold" }}>Interested in this property?</h3>
        
        <button onClick={handleWhatsApp} className="btn" style={{ background: "#25D366", color: "white", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", border: "none" }}>
          <MessageCircle size={20} /> WhatsApp
        </button>
        
        <button onClick={() => setModalType("Callback")} className="btn btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          <Phone size={20} /> Request Callback
        </button>
        
        <button onClick={() => setModalType("Site Visit")} className="btn btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
          <Calendar size={20} /> Book Site Visit
        </button>

        <button onClick={() => setModalType("Contact")} className="btn btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", border: "none", color: "var(--primary)" }}>
          <Mail size={16} /> Send Email Enquiry
        </button>
      </div>

      <EnquiryModal 
        isOpen={modalType !== null} 
        onClose={() => setModalType(null)} 
        property={property} 
        type={modalType || "Contact"} 
      />
    </>
  );
}
