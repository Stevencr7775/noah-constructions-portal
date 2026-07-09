"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function RegisterBuyerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register-buyer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(data.error || "Failed to register");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section-padding" style={{ maxWidth: "600px", margin: "0 auto", paddingTop: "120px" }}>
      <motion.div 
        className="card" 
        style={{ padding: "2rem" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {success ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <CheckCircle2 size={64} color="var(--primary)" style={{ margin: "0 auto", marginBottom: "1rem" }} />
            <h2 className="section-title">Registration Successful!</h2>
            <p className="text-muted">Redirecting to login...</p>
          </div>
        ) : (
          <>
            <h1 className="section-title text-center mb-6">Register as Buyer</h1>
            <p className="text-center text-muted mb-6">Create an account to save favorite properties and track enquiries.</p>
            
            {error && (
              <div style={{ background: "#fee2e2", color: "#dc2626", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  className="form-input" 
                  required 
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  className="form-input" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input 
                  type="tel" 
                  name="mobile"
                  className="form-input" 
                  required 
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="+91 9999999999"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  name="password"
                  className="form-input" 
                  required 
                  minLength={6}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input 
                  type="password" 
                  name="confirmPassword"
                  className="form-input" 
                  required 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                />
              </div>
              <button type="submit" className="btn btn-primary w-full" style={{ width: "100%", marginTop: "1.5rem" }} disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
            
            <div className="text-center mt-6" style={{ marginTop: "1.5rem" }}>
              <p className="text-muted">
                Already have an account? <Link href="/login" style={{ color: "var(--primary)", fontWeight: "500" }}>Log In</Link>
              </p>
              <p className="text-muted mt-2" style={{ fontSize: "0.875rem" }}>
                Looking to sell? <Link href="/sell-properties/register" style={{ color: "var(--primary)" }}>Register as Seller</Link>
              </p>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
