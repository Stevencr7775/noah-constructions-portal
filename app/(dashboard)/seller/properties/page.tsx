"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Edit, Trash2, Eye, MapPin, Tag } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SellerProperties() {
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
        setProperties(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    try {
      await fetch(`/api/properties/manage?id=${id}`, { method: "DELETE" });
      fetchProperties();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return '#16a34a';
      case 'Pending Review': return '#ca8a04';
      case 'Draft': return '#64748b';
      case 'Rejected': return '#dc2626';
      case 'Sold': return '#0066cc';
      default: return '#64748b';
    }
  };

  return (
    <div className="container section-padding" style={{ paddingTop: "120px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 className="section-title text-primary" style={{ margin: 0 }}>My Properties</h1>
          <p className="text-muted">Manage your property listings</p>
        </div>
        <Link href="/seller/properties/new" className="btn btn-primary" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <PlusCircle size={16} /> Add Property
        </Link>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem" }}>Loading properties...</div>
      ) : properties.length === 0 ? (
        <div className="card" style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <h3 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>No properties found</h3>
          <p className="text-muted mb-4">You haven't listed any properties yet.</p>
          <Link href="/seller/properties/new" className="btn btn-primary">Create Your First Listing</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {properties.map((prop) => (
            <div key={prop.id} className="card" style={{ padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ flex: "1 1 300px" }}>
                <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "0.5rem" }}>
                  <h3 style={{ fontSize: "1.125rem", fontWeight: "bold" }}>{prop.title || prop.propertyId}</h3>
                  <span style={{ 
                    padding: "0.25rem 0.75rem", 
                    borderRadius: "999px", 
                    fontSize: "0.75rem", 
                    fontWeight: "bold",
                    backgroundColor: `${getStatusColor(prop.status)}15`,
                    color: getStatusColor(prop.status)
                  }}>
                    {prop.status}
                  </span>
                </div>
                <div style={{ display: "flex", gap: "1.5rem", color: "var(--text-muted)", fontSize: "0.875rem" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><MapPin size={14} /> {prop.locality}, {prop.city}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}><Tag size={14} /> {prop.propertyType || prop.category || 'N/A'}</span>
                  <span style={{ fontWeight: "bold", color: "var(--primary)" }}>
                    ₹{prop.totalPrice?.toLocaleString('en-IN') || 'Price on request'}
                    {prop.pricePerSqYard && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.25rem', fontWeight: 'normal' }}>(₹{Number(prop.pricePerSqYard).toLocaleString('en-IN')}/sq.yd)</span>}
                  </span>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Link href={`/properties/${prop.id}`} target="_blank" className="btn btn-outline" style={{ padding: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center" }} title="View Public Page">
                  <Eye size={18} />
                </Link>
                {/* Note: In a real app we'd have an edit page, skipping for brevity in this task */}
                <button onClick={() => handleDelete(prop.id)} className="btn btn-outline" style={{ padding: "0.5rem", color: "#dc2626", borderColor: "#fca5a5" }} title="Delete">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
