"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { QrCode, Download, Link as LinkIcon, Building2, MapPin, Layers } from "lucide-react";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: <Building2 size={20} /> },
  { label: "Project Management", href: "/admin/pm", icon: <Layers size={20} /> },
  { label: "QR Generator", href: "/admin/qr", icon: <QrCode size={20} /> },
];

export default function QRGenerator() {
  const [qrType, setQrType] = useState("project");
  const [dataId, setDataId] = useState("NH-2025");
  const [customUrl, setCustomUrl] = useState("");

  const getUrlToEncode = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://noahconstructions.com';
    if (qrType === 'custom') return customUrl || baseUrl;
    if (qrType === 'project') return `\${baseUrl}/projects/\${dataId}`;
    if (qrType === 'property') return `\${baseUrl}/properties/\${dataId}`;
    if (qrType === 'brochure') return `\${baseUrl}/brochures/\${dataId}.pdf`;
    return baseUrl;
  };

  const encodedUrl = encodeURIComponent(getUrlToEncode());
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=\${encodedUrl}&margin=10`;

  return (
    <DashboardLayout role="ADMIN" links={sidebarLinks}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="section-title text-primary" style={{ fontSize: "1.75rem", margin: 0, display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <QrCode size={28} /> Global QR Code Generator
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <div className="card" style={{ padding: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <LinkIcon size={20} color="var(--primary)" /> Generate Link
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Resource Type</label>
              <select className="form-input" value={qrType} onChange={(e) => setQrType(e.target.value)}>
                <option value="project">Construction Project Page</option>
                <option value="property">Inventory Unit / Plot Page</option>
                <option value="brochure">PDF Brochure Download</option>
                <option value="custom">Custom URL</option>
              </select>
            </div>

            {qrType !== 'custom' ? (
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Resource ID or Code</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={dataId} 
                  onChange={(e) => setDataId(e.target.value)} 
                  placeholder="e.g., NH-2025 or PROP-101" 
                />
                <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "0.5rem" }}>
                  Enter the Project Code or Property ID to generate a direct link.
                </p>
              </div>
            ) : (
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Full Custom URL</label>
                <input 
                  type="url" 
                  className="form-input" 
                  value={customUrl} 
                  onChange={(e) => setCustomUrl(e.target.value)} 
                  placeholder="https://..." 
                />
              </div>
            )}

            <div style={{ padding: "1rem", background: "#f1f5f9", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.875rem", wordBreak: "break-all" }}>
              <strong>Target URL:</strong><br/>
              <span style={{ color: "var(--primary)" }}>{getUrlToEncode()}</span>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: "2rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <h2 style={{ fontSize: "1.25rem", margin: "0 0 1.5rem 0", alignSelf: "flex-start" }}>Preview & Download</h2>
          
          <div style={{ 
            background: "white", 
            padding: "1rem", 
            borderRadius: "12px", 
            border: "1px solid var(--border)",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            marginBottom: "2rem"
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrImageUrl} alt="QR Code" style={{ width: "200px", height: "200px" }} />
          </div>

          <div style={{ display: "flex", gap: "1rem", width: "100%", justifyContent: "center" }}>
            <a 
              href={qrImageUrl} 
              download="noah-qr-code.png" 
              target="_blank" 
              rel="noreferrer"
              className="btn btn-primary" 
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 2rem" }}
            >
              <Download size={18} /> Download High-Res PNG
            </a>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
