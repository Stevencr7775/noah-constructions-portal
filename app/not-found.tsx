import Link from "next/link";
import { AlertTriangle, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "2rem" }}>
      <div className="card" style={{ maxWidth: "500px", width: "100%", padding: "3rem 2rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", padding: "1rem", background: "#fee2e2", borderRadius: "50%", marginBottom: "1.5rem" }}>
          <AlertTriangle size={48} color="#ef4444" />
        </div>
        <h1 style={{ fontSize: "2rem", margin: "0 0 1rem 0", color: "#0f172a" }}>Page Not Found</h1>
        <p style={{ color: "#64748b", margin: "0 0 2rem 0", lineHeight: "1.6" }}>
          The page you are looking for doesn't exist or has been moved. 
          Please check the URL or navigate back to the homepage.
        </p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <Link href="/" className="btn btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <Home size={18} /> Back to Homepage
          </Link>
          <Link href="/search" className="btn btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <Search size={18} /> Search Properties
          </Link>
        </div>
      </div>
    </div>
  );
}
