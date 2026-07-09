"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In a real production app, log this error to an external service like Sentry
    console.error("Unhandled Runtime Error:", error);
  }, [error]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc", padding: "2rem" }}>
      <div className="card" style={{ maxWidth: "500px", width: "100%", padding: "3rem 2rem", textAlign: "center" }}>
        <div style={{ display: "inline-flex", padding: "1rem", background: "#fee2e2", borderRadius: "50%", marginBottom: "1.5rem" }}>
          <AlertOctagon size={48} color="#ef4444" />
        </div>
        <h1 style={{ fontSize: "2rem", margin: "0 0 1rem 0", color: "#0f172a" }}>Something went wrong!</h1>
        <p style={{ color: "#64748b", margin: "0 0 2rem 0", lineHeight: "1.6" }}>
          An unexpected server error occurred. Our technical team has been notified and is working to fix the issue.
        </p>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <button onClick={() => reset()} className="btn btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <RotateCcw size={18} /> Try Again
          </button>
          <Link href="/" className="btn btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
            <Home size={18} /> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
