"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !email) {
      setError("Invalid password reset link. Missing token or email.");
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !email) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
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
    <motion.div 
      className="card" 
      style={{ padding: "2rem" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {success ? (
        <div style={{ textAlign: "center" }}>
          <CheckCircle2 size={48} color="var(--primary)" style={{ margin: "0 auto", marginBottom: "1rem" }} />
          <h2 className="section-title mb-4">Password Reset Successfully</h2>
          <p className="text-muted mb-6">Redirecting to login...</p>
        </div>
      ) : (
        <>
          <h1 className="section-title text-center mb-4">Reset Password</h1>
          <p className="text-center text-muted mb-6">Create a new password for your account.</p>
          
          {error && (
            <div style={{ background: "#fee2e2", color: "#dc2626", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input 
                type="password" 
                className="form-input" 
                required 
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={!token || !email}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input 
                type="password" 
                className="form-input" 
                required 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                disabled={!token || !email}
              />
            </div>
            <button type="submit" className="btn btn-primary w-full" style={{ width: "100%", marginTop: "1.5rem" }} disabled={loading || !token || !email}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
          
          <div className="text-center mt-6">
            <Link href="/login" style={{ color: "var(--primary)", fontWeight: "500" }}>Back to Login</Link>
          </div>
        </>
      )}
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="container section-padding" style={{ maxWidth: "500px", margin: "0 auto", paddingTop: "120px" }}>
      <Suspense fallback={<div style={{ textAlign: "center" }}>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
