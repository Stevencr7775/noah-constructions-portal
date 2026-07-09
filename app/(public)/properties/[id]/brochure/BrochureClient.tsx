"use client";

import { useEffect } from "react";
import QRCode from "react-qr-code";
import { MapPin, Phone, Mail, User, Grid, Box, Ruler, CheckCircle } from "lucide-react";

export default function BrochureClient({ property, propertyUrl }: { property: any, propertyUrl: string }) {
  useEffect(() => {
    // Hide navbar and footer via a style tag because they are in the layout
    const style = document.createElement("style");
    style.innerHTML = `
      header, footer, nav, .navbar, .footer { display: none !important; }
      body { background: white !important; padding: 0 !important; margin: 0 !important; }
      @page { size: A4; margin: 0; }
      @media print {
        .print-btn { display: none !important; }
        .page-break { page-break-before: always; }
      }
    `;
    document.head.appendChild(style);

    // Auto trigger print dialog after 1s to allow images to load
    const timer = setTimeout(() => {
      window.print();
    }, 1000);

    return () => {
      document.head.removeChild(style);
      clearTimeout(timer);
    };
  }, []);

  const images = property.media.filter((m: any) => m.type === 'image');
  const mainImage = images.length > 0 ? images[0].url : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80";

  return (
    <div style={{ maxWidth: "210mm", minHeight: "297mm", margin: "0 auto", background: "white", color: "#0f172a", position: "relative" }}>
      {/* Floating Print Button for users who cancel auto-print */}
      <button 
        className="print-btn btn btn-primary" 
        style={{ position: "fixed", bottom: "2rem", right: "2rem", zIndex: 100, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
        onClick={() => window.print()}
      >
        Print / Save PDF
      </button>

      {/* PAGE 1: COVER */}
      <div style={{ padding: "40px", height: "100%", display: "flex", flexDirection: "column" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", borderBottom: "2px solid var(--primary)", paddingBottom: "20px" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: "900", margin: 0, color: "var(--primary)", letterSpacing: "-1px" }}>
              NOAH <span style={{ color: "#0f172a" }}>CONSTRUCTIONS</span>
            </h1>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "2px", fontWeight: "bold" }}>
              Premium Real Estate
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: "1rem", fontWeight: "bold" }}>Property ID: {property.propertyId}</p>
            <p style={{ margin: 0, color: "#64748b", fontSize: "0.875rem" }}>{new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* Title & Location */}
        <div style={{ marginBottom: "30px" }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
            <span style={{ background: "var(--primary)", color: "white", padding: "4px 12px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase" }}>
              {property.status}
            </span>
            <span style={{ background: "#f1f5f9", color: "#475569", padding: "4px 12px", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase" }}>
              {property.propertyType || property.category}
            </span>
          </div>
          <h2 style={{ fontSize: "2.5rem", margin: "0 0 10px 0", lineHeight: 1.1 }}>{property.title || property.propertyId}</h2>
          <p style={{ margin: 0, fontSize: "1.25rem", color: "#64748b", display: "flex", alignItems: "center", gap: "8px" }}>
            <MapPin size={20} /> {property.locality}, {property.city}, {property.state}
          </p>
        </div>

        {/* Hero Image */}
        <div style={{ width: "100%", height: "400px", background: `url(\${mainImage}) center/cover no-repeat`, borderRadius: "16px", marginBottom: "30px" }}></div>

        {/* Price & Specs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "40px" }}>
          <div style={{ background: "#f8fafc", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <p style={{ margin: "0 0 5px 0", color: "#64748b", fontSize: "0.875rem", textTransform: "uppercase", fontWeight: "bold" }}>Asking Price</p>
            <h3 style={{ margin: 0, fontSize: "2.5rem", color: "var(--primary)" }}>
              ₹{property.totalPrice?.toLocaleString('en-IN') || 'On Request'}
            </h3>
            {property.pricePerSqYard && (
              <p style={{ margin: "5px 0 0 0", color: "#64748b", fontSize: "1rem" }}>₹{property.pricePerSqYard.toLocaleString('en-IN')} / Sq.Yd</p>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", background: "#f8fafc", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            {property.squareYards && (
              <div>
                <p style={{ margin: "0 0 5px 0", color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "bold" }}>Area</p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", fontSize: "1.25rem" }}>
                  <Ruler size={18} color="var(--primary)" /> {property.squareYards} Sq.Yd
                </div>
              </div>
            )}
            {property.facing && (
              <div>
                <p style={{ margin: "0 0 5px 0", color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "bold" }}>Facing</p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", fontSize: "1.25rem" }}>
                  <Grid size={18} color="var(--primary)" /> {property.facing}
                </div>
              </div>
            )}
            {property.cornerPlot && (
              <div>
                <p style={{ margin: "0 0 5px 0", color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "bold" }}>Corner Plot</p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", fontSize: "1.25rem" }}>
                  <Box size={18} color="var(--primary)" /> Yes
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: "1.25rem", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px", marginBottom: "15px", textTransform: "uppercase", letterSpacing: "1px" }}>Overview</h4>
          <p style={{ lineHeight: 1.8, color: "#334155" }}>{property.description || "No description provided."}</p>
        </div>

        {/* Footer Contact & QR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "2px solid #e2e8f0", paddingTop: "20px", marginTop: "auto" }}>
          <div style={{ display: "flex", gap: "30px" }}>
            <div>
              <p style={{ margin: "0 0 5px 0", color: "#64748b", fontSize: "0.75rem", textTransform: "uppercase", fontWeight: "bold" }}>Contact Details</p>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", marginBottom: "4px" }}>
                <User size={14} color="var(--primary)" /> {property.seller?.name || property.seller?.companyName || 'Noah Sales Team'}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold", marginBottom: "4px" }}>
                <Phone size={14} color="var(--primary)" /> {property.seller?.mobile || '+91 98765 43210'}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "bold" }}>
                <Mail size={14} color="var(--primary)" /> {property.seller?.email || 'sales@noahconstructions.com'}
              </div>
            </div>
          </div>
          <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <div style={{ background: "white", padding: "8px", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
              <QRCode value={propertyUrl} size={80} />
            </div>
            <span style={{ fontSize: "0.625rem", color: "#64748b", fontWeight: "bold", textTransform: "uppercase" }}>Scan to View Online</span>
          </div>
        </div>
      </div>
      
      {/* Remove second page for now to keep it one solid A4 sheet, but in a real app you might have <div className="page-break" /> and print gallery images. */}

    </div>
  );
}
