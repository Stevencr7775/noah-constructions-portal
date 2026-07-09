"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        // Redirect based on role
        const role = data.role as string;
        if (role === "BUYER") router.push("/buyer/dashboard");
        else if (role === "OWNER" || role === "SELLER") router.push("/seller/dashboard");
        else if (role === "AGENT") router.push("/agent/dashboard");
        else if (role === "BUILDER") router.push("/builder/dashboard");
        else if (role === "CORPORATE") router.push("/corporate/dashboard");
        else router.push("/profile");
        
        router.refresh(); // Refresh to apply middleware session
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section-padding" style={{ maxWidth: "500px", margin: "0 auto", paddingTop: "120px" }}>
      <motion.div 
        className="card" 
        style={{ padding: "2rem" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="section-title text-center mb-6">Welcome Back</h1>
        {error && (
          <div style={{ background: "#fee2e2", color: "#dc2626", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-input" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label className="form-label mb-0">Password</label>
              <Link href="/forgot-password" style={{ fontSize: "0.875rem", color: "var(--primary)" }}>
                Forgot Password?
              </Link>
            </div>
            <input 
              type="password" 
              className="form-input" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" style={{ width: "100%", marginTop: "1rem" }} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        <div className="text-center mt-6" style={{ marginTop: "1.5rem" }}>
          <p className="text-muted">Don't have an account?</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginTop: "0.5rem" }}>
            <Link href="/register" className="btn btn-outline" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>Register as Buyer</Link>
            <Link href="/sell-properties/register" className="btn btn-outline" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>Register as Seller</Link>
          </div>
          <div style={{ marginTop: "2rem" }}>
            <Link href="/admin/login" className="text-muted" style={{ fontSize: "0.875rem", textDecoration: "underline" }}>
              Staff & Admin Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
