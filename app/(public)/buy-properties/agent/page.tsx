"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import styles from "../form.module.css";

export default function AgentRegistration() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className="container">
        <motion.div 
          className={styles.formContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {isSubmitted ? (
            <motion.div 
              className={styles.successMessage}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <CheckCircle2 size={64} className={styles.successIcon} />
              <h2 className={styles.successTitle}>Registration Successful</h2>
              <p className={styles.successText}>Welcome to the NOAH INFRA PROJECTS Agent Network. We will review your application and contact you soon.</p>
            </motion.div>
          ) : (
            <>
              <div className={styles.formHeader}>
                <h1 className={styles.formTitle}>Agent Registration</h1>
                <p className={styles.formSubtitle}>Partner with us to offer premium properties to your clients.</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-input" required placeholder="Jane Smith" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Agency Name</label>
                    <input type="text" className="form-input" required placeholder="Smith Realty" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">RERA Registration Number (Optional)</label>
                    <input type="text" className="form-input" placeholder="RERA-123456" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <input type="tel" className="form-input" required placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" required placeholder="jane@smithrealty.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Years of Experience</label>
                    <input type="number" className="form-input" required min="0" placeholder="5" />
                  </div>
                  <div className={`form-group ${styles.fullWidth}`}>
                    <label className="form-label">Office Address</label>
                    <input type="text" className="form-input" required placeholder="123 Main St, Suite 400" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input type="text" className="form-input" required placeholder="Los Angeles" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input type="text" className="form-input" required placeholder="CA" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input type="password" className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input type="password" className="form-input" required />
                  </div>
                  <div className={`form-group ${styles.fullWidth}`}>
                    <label className="flex items-center" style={{ gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="checkbox" required className="form-checkbox" />
                      <span>I agree to the Terms and Conditions and Privacy Policy.</span>
                    </label>
                  </div>
                </div>
                <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>Register as Agent</button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
