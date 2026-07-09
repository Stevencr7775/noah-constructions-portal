"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function CorporateDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="container section-padding" style={{ paddingTop: "120px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="section-title">Corporate Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-outline" style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
      <div className="card" style={{ padding: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", marginBottom: "1rem" }}>Welcome to your Dashboard</h2>
        <p className="text-muted">From here you can manage company-owned listings.</p>
      </div>
    </div>
  );
}
