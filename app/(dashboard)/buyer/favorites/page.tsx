"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, MapPin, Trash2, ExternalLink } from "lucide-react";

export default function BuyerFavorites() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await fetch("/api/user/favorites");
      const json = await res.json();
      if (json.success) {
        setFavorites(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (propertyId: string) => {
    try {
      await fetch('/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId })
      });
      fetchFavorites();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container section-padding" style={{ paddingTop: "120px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="section-title text-primary" style={{ margin: 0 }}>My Favorites</h1>
        <Link href="/buyer/dashboard" className="btn btn-outline">Back to Dashboard</Link>
      </div>

      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center" }}>Loading favorites...</div>
      ) : favorites.length === 0 ? (
        <div className="card" style={{ padding: "4rem", textAlign: "center" }}>
          <Heart size={48} color="#94a3b8" style={{ margin: "0 auto", marginBottom: "1rem" }} />
          <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>No favorites yet</h3>
          <p className="text-muted mb-4">Start exploring properties and save the ones you love.</p>
          <Link href="/search" className="btn btn-primary">Search Properties</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
          {favorites.map((fav) => (
            <div key={fav.id} className="card" style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ 
                height: "200px", 
                background: `url(${fav.property.media?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}) center/cover`
              }} />
              <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                <h4 style={{ fontWeight: "bold", fontSize: "1.125rem", marginBottom: "0.25rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {fav.property.title || fav.property.propertyId}
                </h4>
                <p className="text-muted" style={{ fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.25rem", marginBottom: "1rem" }}>
                  <MapPin size={14} /> {fav.property.locality}, {fav.property.city}
                </p>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary)", marginTop: "auto", marginBottom: "1rem" }}>
                  ₹{fav.property.totalPrice?.toLocaleString('en-IN') || 'Price on request'}
                </h3>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Link href={`/properties/${fav.property.id}`} target="_blank" className="btn btn-outline" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <ExternalLink size={16} /> View
                  </Link>
                  <button onClick={() => handleRemove(fav.propertyId)} className="btn btn-outline" style={{ flex: 1, color: "#dc2626", borderColor: "#fca5a5", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                    <Trash2 size={16} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
