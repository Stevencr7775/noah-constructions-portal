"use client";

import { useState, useEffect } from "react";
import { Search, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length > 2) {
        fetchResults();
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const fetchResults = async () => {
    try {
      const res = await fetch(`/api/properties/search?q=${encodeURIComponent(query)}&limit=5`);
      const json = await res.json();
      if (json.success) {
        setResults(json.data);
        setShowDropdown(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: "600px" }}>
      <form onSubmit={handleSearch} style={{ display: "flex", position: "relative" }}>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if(results.length > 0) setShowDropdown(true) }}
          placeholder="Search properties, locations, builders..." 
          style={{
            width: "100%",
            padding: "1rem 1.5rem",
            paddingRight: "3rem",
            borderRadius: "999px",
            border: "1px solid var(--border)",
            outline: "none",
            fontSize: "1rem"
          }}
        />
        <button type="submit" style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--primary)" }}>
          <Search size={24} />
        </button>
      </form>

      {showDropdown && results.length > 0 && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          background: "white",
          borderRadius: "16px",
          marginTop: "0.5rem",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          zIndex: 50,
          overflow: "hidden"
        }}>
          {results.map((prop) => (
            <div 
              key={prop.id}
              onClick={() => {
                setShowDropdown(false);
                router.push(`/properties/${prop.id}`);
              }}
              style={{
                padding: "1rem 1.5rem",
                borderBottom: "1px solid var(--border)",
                cursor: "pointer",
                display: "flex",
                gap: "1rem",
                alignItems: "center"
              }}
              className="hover-bg-light"
            >
              <div style={{ width: "40px", height: "40px", borderRadius: "8px", background: "#f1f5f9", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MapPin size={20} color="var(--primary)" />
              </div>
              <div>
                <p style={{ fontWeight: "bold", fontSize: "0.875rem", margin: 0 }}>{prop.title || prop.propertyId}</p>
                <p className="text-muted" style={{ fontSize: "0.75rem", margin: 0 }}>{prop.locality}, {prop.city} • ₹{prop.totalPrice?.toLocaleString('en-IN')}</p>
              </div>
            </div>
          ))}
          <div 
            onClick={() => {
              setShowDropdown(false);
              router.push(`/search?q=${encodeURIComponent(query)}`);
            }}
            style={{ padding: "1rem", textAlign: "center", color: "var(--primary)", fontWeight: "bold", cursor: "pointer", background: "#f8fafc" }}
          >
            View all results
          </div>
        </div>
      )}
    </div>
  );
}
