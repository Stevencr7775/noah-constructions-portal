"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminApprovals() {
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/properties/manage");
      const json = await res.json();
      if (json.success) {
        // Only show properties that need admin attention
        setProperties(json.data.filter((p: any) => p.status === 'Pending Review'));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    if (!confirm(`Are you sure you want to ${status.toLowerCase()} this property?`)) return;
    try {
      const res = await fetch("/api/properties/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (data.success) {
        fetchProperties();
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container section-padding" style={{ paddingTop: "120px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 className="section-title text-primary" style={{ margin: 0 }}>Approvals</h1>
          <p className="text-muted">Review properties pending publication</p>
        </div>
        <Link href="/admin/dashboard" className="btn btn-outline">Back to Dashboard</Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>Loading properties...</div>
      ) : properties.length === 0 ? (
        <div className="card" style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <CheckCircle size={48} color="#16a34a" style={{ margin: "0 auto", marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>All Caught Up!</h3>
          <p className="text-muted">There are no properties pending review.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {properties.map((prop) => (
            <div key={prop.id} className="card" style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", borderLeft: "4px solid #ca8a04" }}>
              <div style={{ flex: "1 1 300px" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "bold", marginBottom: "0.25rem" }}>{prop.title || prop.propertyId}</h3>
                <p className="text-muted" style={{ fontSize: "0.875rem", marginBottom: "0.5rem" }}>{prop.locality}, {prop.city} • Seller ID: {prop.sellerId}</p>
                <div style={{ display: "flex", gap: "1rem", fontSize: "0.875rem" }}>
                  <span style={{ fontWeight: "bold", color: "var(--primary)" }}>₹{prop.totalPrice?.toLocaleString('en-IN') || 'Price on request'}</span>
                  <span>{prop.propertyType || prop.category || 'N/A'}</span>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Link href={`/properties/${prop.id}`} target="_blank" className="btn btn-outline" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} title="Preview">
                  <Eye size={16} /> Preview
                </Link>
                <button onClick={() => handleStatusChange(prop.id, 'Approved')} className="btn btn-primary" style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "#16a34a", borderColor: "#16a34a" }}>
                  <CheckCircle size={16} /> Approve
                </button>
                <button onClick={() => handleStatusChange(prop.id, 'Rejected')} className="btn btn-outline" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#dc2626", borderColor: "#fca5a5" }}>
                  <XCircle size={16} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
