"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { History, MapPin, ExternalLink } from "lucide-react";

export default function BuyerHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/user/history");
      const json = await res.json();
      if (json.success) {
        setHistory(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section-padding" style={{ paddingTop: "120px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="section-title text-primary" style={{ margin: 0 }}>Recently Viewed</h1>
        <Link href="/buyer/dashboard" className="btn btn-outline">Back to Dashboard</Link>
      </div>

      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center" }}>Loading history...</div>
      ) : history.length === 0 ? (
        <div className="card" style={{ padding: "4rem", textAlign: "center" }}>
          <History size={48} color="#94a3b8" style={{ margin: "0 auto", marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>No history yet</h3>
          <p className="text-muted mb-4">Properties you view will appear here.</p>
          <Link href="/search" className="btn btn-primary">Search Properties</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {history.map((item) => (
            <div key={item.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ 
                height: "150px", 
                background: `url(${item.property.media?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}) center/cover`
              }} />
              <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <h4 style={{ fontWeight: "bold", fontSize: "1rem", marginBottom: "0.25rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.property.title || item.property.propertyId}
                </h4>
                <p className="text-muted" style={{ fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.25rem", marginBottom: "1rem" }}>
                  <MapPin size={12} /> {item.property.locality}, {item.property.city}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                   <p className="text-muted" style={{ fontSize: "0.75rem" }}>
                     Viewed: {new Date(item.viewedAt).toLocaleDateString()}
                   </p>
                   <Link href={`/properties/${item.property.id}`} target="_blank" className="btn btn-outline" style={{ padding: "0.25rem 0.75rem", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                     <ExternalLink size={14} /> View
                   </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
