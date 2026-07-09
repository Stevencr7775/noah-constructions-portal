"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Invalid admin credentials");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)" }}>
      <motion.div 
        className="card" 
        style={{ padding: "2.5rem", width: "100%", maxWidth: "450px", borderTop: "4px solid var(--primary)" }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <div style={{ background: "rgba(0, 102, 204, 0.1)", padding: "1rem", borderRadius: "50%" }}>
            <ShieldAlert size={32} color="var(--primary)" />
          </div>
        </div>
        <h1 className="section-title text-center mb-6" style={{ fontSize: "1.5rem" }}>Admin Portal</h1>
        
        {error && (
          <div style={{ background: "#fee2e2", color: "#dc2626", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.875rem", textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Admin Email</label>
            <input 
              type="email" 
              className="form-input" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@noahconstructions.com"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secure password"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" style={{ width: "100%", marginTop: "2rem" }} disabled={loading}>
            {loading ? "Authenticating..." : "Access Dashboard"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
