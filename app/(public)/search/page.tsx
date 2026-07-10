"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Filter, MapPin, Grid, Heart } from "lucide-react";
import GlobalSearch from "@/components/GlobalSearch";
import PropertyMap from "@/components/PropertyMap";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  
  // Filters state
  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    type: searchParams.get('type') || '',
    purpose: searchParams.get('purpose') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    facing: searchParams.get('facing') || '',
    sort: searchParams.get('sort') || 'price_asc'
  });

  useEffect(() => {
    fetchResults();
  }, [searchParams]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams(searchParams.toString());
      const res = await fetch(`/api/properties/search?${qs.toString()}`);
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

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const qs = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) qs.set(k, v);
    });
    router.push(`/search?${qs.toString()}`);
  };

  const toggleFavorite = async (e: React.MouseEvent, propertyId: string) => {
    e.preventDefault();
    try {
      await fetch('/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId })
      });
      alert('Favorites toggled! Check Buyer Dashboard.');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container section-padding" style={{ paddingTop: "120px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <GlobalSearch />
        
        <div style={{ display: "flex", gap: "1rem" }}>
          <select className="form-input" value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)} style={{ width: "auto" }}>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="area_desc">Largest Area</option>
            <option value="views_desc">Most Viewed</option>
          </select>
          <div style={{ display: "flex", background: "#f1f5f9", borderRadius: "8px", padding: "0.25rem" }}>
            <button onClick={() => setViewMode('list')} style={{ padding: "0.5rem 1rem", borderRadius: "6px", border: "none", background: viewMode === 'list' ? "white" : "transparent", boxShadow: viewMode === 'list' ? "0 2px 4px rgba(0,0,0,0.1)" : "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Grid size={16} /> List
            </button>
            <button onClick={() => setViewMode('map')} style={{ padding: "0.5rem 1rem", borderRadius: "6px", border: "none", background: viewMode === 'map' ? "white" : "transparent", boxShadow: viewMode === 'map' ? "0 2px 4px rgba(0,0,0,0.1)" : "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <MapPin size={16} /> Map
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "2rem" }}>
        {/* Sidebar Filters */}
        <div className="card" style={{ padding: "1.5rem", height: "fit-content", position: "sticky", top: "100px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <Filter size={20} />
            <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", margin: 0 }}>Filters</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="form-label">Property Type</label>
              <select className="form-input" value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)}>
                <option value="">Any Type</option>
                <option value="Residential Plot">Residential Plot</option>
                <option value="Commercial Plot">Commercial Plot</option>
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
              </select>
            </div>
            
            <div>
              <label className="form-label">Purpose</label>
              <select className="form-input" value={filters.purpose} onChange={(e) => handleFilterChange('purpose', e.target.value)}>
                <option value="">Any Purpose</option>
                <option value="Sale">Sale</option>
                <option value="Resale">Resale</option>
                <option value="Rent">Rent</option>
              </select>
            </div>

            <div>
              <label className="form-label">Budget (₹)</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input type="number" className="form-input" placeholder="Min" value={filters.minPrice} onChange={(e) => handleFilterChange('minPrice', e.target.value)} />
                <input type="number" className="form-input" placeholder="Max" value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="form-label">Facing</label>
              <select className="form-input" value={filters.facing} onChange={(e) => handleFilterChange('facing', e.target.value)}>
                <option value="">Any Facing</option>
                <option value="East">East</option>
                <option value="West">West</option>
                <option value="North">North</option>
                <option value="South">South</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div>
          {loading ? (
            <div style={{ padding: "4rem", textAlign: "center" }}>Loading properties...</div>
          ) : viewMode === 'map' ? (
            <div style={{ height: "600px", borderRadius: "16px", overflow: "hidden" }}>
              <PropertyMap properties={properties} />
            </div>
          ) : properties.length === 0 ? (
            <div className="card" style={{ padding: "4rem", textAlign: "center" }}>
              <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>No properties found</h3>
              <p className="text-muted">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
              {properties.map((prop) => (
                <div key={prop.id} className="card" style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
                  <div style={{ 
                    height: "200px", 
                    background: `url(${prop.media?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}) center/cover`,
                    position: "relative"
                  }}>
                    <button onClick={(e) => toggleFavorite(e, prop.id)} style={{ position: "absolute", top: "1rem", right: "1rem", background: "white", border: "none", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                      <Heart size={18} color="#dc2626" />
                    </button>
                    {prop.isFeatured && (
                      <span style={{ position: "absolute", top: "1rem", left: "1rem", background: "var(--primary)", color: "white", padding: "0.25rem 0.5rem", borderRadius: "4px", fontSize: "0.75rem", fontWeight: "bold" }}>
                        Featured
                      </span>
                    )}
                  </div>
                  <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                      <h4 style={{ fontWeight: "bold", fontSize: "1.125rem", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {prop.title || prop.propertyId}
                      </h4>
                    </div>
                    <p className="text-muted" style={{ fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.25rem", marginBottom: "1rem" }}>
                      <MapPin size={14} /> {prop.locality}, {prop.city}
                    </p>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary)", marginTop: "auto", marginBottom: "1rem" }}>
                      ₹{prop.totalPrice?.toLocaleString('en-IN') || 'Request Price'}
                      {prop.pricePerSqYard && <span style={{ fontSize: '1rem', color: 'var(--text-muted)', marginLeft: '0.5rem', fontWeight: 'normal' }}> (₹{Number(prop.pricePerSqYard).toLocaleString('en-IN')}/sq.yd)</span>}
                    </h3>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <Link href={`/properties/${prop.id}`} className="btn btn-outline" style={{ flex: 1, textAlign: "center", padding: "0.5rem" }}>View</Link>
                      <button className="btn btn-primary" style={{ flex: 1, padding: "0.5rem" }}>Contact</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ paddingTop: "120px", textAlign: "center" }}>Loading search...</div>}>
      <SearchContent />
    </Suspense>
  );
}
