"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Skeleton form for profile
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="container section-padding" style={{ paddingTop: "120px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 className="section-title mb-6">My Profile</h1>
      <motion.div 
        className="card" 
        style={{ padding: "2rem" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {success && (
          <div style={{ background: "#dcfce7", color: "#166534", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", textAlign: "center" }}>
            Profile updated successfully!
          </div>
        )}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" placeholder="Your Name" />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="Your Email" disabled />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input type="tel" className="form-input" placeholder="Your Phone" />
          </div>
          
          <hr style={{ margin: "2rem 0", borderColor: "var(--border)" }} />
          <h2 style={{ fontSize: "1.125rem", marginBottom: "1rem" }}>Change Password</h2>
          
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" className="form-input" placeholder="Enter new password" />
          </div>
          
          <button type="submit" className="btn btn-primary w-full" style={{ width: "100%", marginTop: "2rem" }} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
