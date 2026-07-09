"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
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
        {success ? (
          <div style={{ textAlign: "center" }}>
            <MailCheck size={48} color="var(--primary)" style={{ margin: "0 auto", marginBottom: "1rem" }} />
            <h2 className="section-title mb-4">Check your email</h2>
            <p className="text-muted mb-6">If an account exists with {email}, we have sent a password reset link.</p>
            <Link href="/login" className="btn btn-outline">Return to Login</Link>
          </div>
        ) : (
          <>
            <h1 className="section-title text-center mb-4">Forgot Password</h1>
            <p className="text-center text-muted mb-6">Enter your email address and we'll send you a link to reset your password.</p>
            
            {error && (
              <div style={{ background: "#fee2e2", color: "#dc2626", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
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
              <button type="submit" className="btn btn-primary w-full" style={{ width: "100%", marginTop: "1.5rem" }} disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
            
            <div className="text-center mt-6">
              <Link href="/login" style={{ color: "var(--primary)", fontWeight: "500" }}>Back to Login</Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
