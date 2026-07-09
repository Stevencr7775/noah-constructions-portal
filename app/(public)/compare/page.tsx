"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, X, MapPin } from "lucide-react";

function CompareContent() {
  const searchParams = useSearchParams();
  const ids = searchParams.get('ids')?.split(',') || [];
  
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length > 0) {
      fetchProperties();
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const promises = ids.map(id => fetch(`/api/properties/manage?id=${id}`).then(r => r.json()));
      const results = await Promise.all(promises);
      const validProps = results.filter(r => r.success).map(r => r.data);
      setProperties(validProps);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ paddingTop: "120px", textAlign: "center" }}>Loading properties for comparison...</div>;

  if (properties.length === 0) {
    return (
      <div className="container section-padding" style={{ paddingTop: "120px", textAlign: "center" }}>
        <h1 className="section-title">Compare Properties</h1>
        <p className="text-muted mb-6">No properties selected for comparison.</p>
        <Link href="/search" className="btn btn-primary">Go to Search</Link>
      </div>
    );
  }

  return (
    <div className="container section-padding" style={{ paddingTop: "120px" }}>
      <h1 className="section-title text-center mb-8">Compare Properties</h1>
      
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", minWidth: "800px", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ padding: "1rem", border: "1px solid var(--border)", background: "#f8fafc", width: "20%" }}>Features</th>
              {properties.map(p => (
                <th key={p.id} style={{ padding: "1rem", border: "1px solid var(--border)", width: `${80 / properties.length}%`, textAlign: "center" }}>
                  <div style={{ 
                    height: "150px", 
                    background: `url(${p.media?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}) center/cover`,
                    borderRadius: "8px",
                    marginBottom: "1rem"
                  }} />
                  <Link href={`/properties/${p.id}`} style={{ color: "var(--primary)" }}>{p.title || p.propertyId}</Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: "1rem", border: "1px solid var(--border)", fontWeight: "bold" }}>Price</td>
              {properties.map(p => (
                <td key={p.id} style={{ padding: "1rem", border: "1px solid var(--border)", textAlign: "center", fontWeight: "bold", color: "var(--primary)" }}>
                  ₹{p.totalPrice?.toLocaleString('en-IN') || 'N/A'}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: "1rem", border: "1px solid var(--border)", fontWeight: "bold" }}>Location</td>
              {properties.map(p => (
                <td key={p.id} style={{ padding: "1rem", border: "1px solid var(--border)", textAlign: "center" }}>
                  {p.locality}, {p.city}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: "1rem", border: "1px solid var(--border)", fontWeight: "bold" }}>Type</td>
              {properties.map(p => (
                <td key={p.id} style={{ padding: "1rem", border: "1px solid var(--border)", textAlign: "center" }}>
                  {p.propertyType || p.category || 'N/A'}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: "1rem", border: "1px solid var(--border)", fontWeight: "bold" }}>Area</td>
              {properties.map(p => (
                <td key={p.id} style={{ padding: "1rem", border: "1px solid var(--border)", textAlign: "center" }}>
                  {p.squareYards ? `${p.squareYards} Sq.Yds` : 'N/A'}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: "1rem", border: "1px solid var(--border)", fontWeight: "bold" }}>Facing</td>
              {properties.map(p => (
                <td key={p.id} style={{ padding: "1rem", border: "1px solid var(--border)", textAlign: "center" }}>
                  {p.facing || 'N/A'}
                </td>
              ))}
            </tr>
            <tr>
              <td style={{ padding: "1rem", border: "1px solid var(--border)", fontWeight: "bold" }}>Corner Plot</td>
              {properties.map(p => (
                <td key={p.id} style={{ padding: "1rem", border: "1px solid var(--border)", textAlign: "center" }}>
                  {p.cornerPlot ? <Check color="#16a34a" style={{ margin: "0 auto" }}/> : <X color="#dc2626" style={{ margin: "0 auto" }}/>}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: "120px", textAlign: "center" }}>Loading compare...</div>}>
      <CompareContent />
    </Suspense>
  );
}
