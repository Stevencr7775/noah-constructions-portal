import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { TrendingUp, Search, MapPin, Grid } from "lucide-react";

export const revalidate = 60; // Revalidate every minute

export default async function AdminAnalytics() {
  // Aggregate search analytics
  const rawAnalytics = await prisma.searchAnalytics.findMany();

  // Process data for charts/stats
  let totalSearches = 0;
  const keywords: Record<string, number> = {};
  const locations: Record<string, number> = {};
  const categories: Record<string, number> = {};

  rawAnalytics.forEach((hit: any) => {
    totalSearches += hit.hits;
    if (hit.keyword) {
      keywords[hit.keyword] = (keywords[hit.keyword] || 0) + hit.hits;
    }
    if (hit.location) {
      locations[hit.location] = (locations[hit.location] || 0) + hit.hits;
    }
    if (hit.category) {
      categories[hit.category] = (categories[hit.category] || 0) + hit.hits;
    }
  });

  const topKeywords = Object.entries(keywords).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topLocations = Object.entries(locations).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topCategories = Object.entries(categories).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="container section-padding" style={{ paddingTop: "120px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 className="section-title text-primary" style={{ margin: 0 }}>Search Analytics</h1>
          <p className="text-muted">Discover what users are searching for on Noah Constructions.</p>
        </div>
        <Link href="/admin/dashboard" className="btn btn-outline">Back to Dashboard</Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        <div className="card" style={{ padding: "2rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div style={{ background: "#eff6ff", padding: "1rem", borderRadius: "12px" }}>
            <TrendingUp size={32} color="#3b82f6" />
          </div>
          <div>
            <p className="text-muted" style={{ marginBottom: "0.25rem", fontWeight: "bold" }}>Total Search Queries</p>
            <h2 style={{ fontSize: "2.5rem", fontWeight: "bold", margin: 0 }}>{totalSearches}</h2>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
        {/* Keywords */}
        <div className="card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
            <Search size={24} color="var(--primary)" />
            <h3 style={{ fontSize: "1.25rem", margin: 0 }}>Top Keywords</h3>
          </div>
          <div className="space-y-4">
            {topKeywords.length > 0 ? topKeywords.map(([keyword, count], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "bold" }}>{keyword}</span>
                <span className="text-muted">{count as React.ReactNode} searches</span>
              </div>
            )) : <p className="text-muted">No keyword data yet.</p>}
          </div>
        </div>

        {/* Locations */}
        <div className="card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
            <MapPin size={24} color="var(--primary)" />
            <h3 style={{ fontSize: "1.25rem", margin: 0 }}>Top Locations</h3>
          </div>
          <div className="space-y-4">
            {topLocations.length > 0 ? topLocations.map(([loc, count], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "bold" }}>{loc}</span>
                <span className="text-muted">{count as React.ReactNode} searches</span>
              </div>
            )) : <p className="text-muted">No location data yet.</p>}
          </div>
        </div>

        {/* Categories */}
        <div className="card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
            <Grid size={24} color="var(--primary)" />
            <h3 style={{ fontSize: "1.25rem", margin: 0 }}>Top Categories</h3>
          </div>
          <div className="space-y-4">
            {topCategories.length > 0 ? topCategories.map(([cat, count], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "bold" }}>{cat}</span>
                <span className="text-muted">{count as React.ReactNode} searches</span>
              </div>
            )) : <p className="text-muted">No category data yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
