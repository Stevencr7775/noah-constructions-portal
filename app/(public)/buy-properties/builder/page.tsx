"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import styles from "../form.module.css";

export default function BuilderRegistration() {
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
              <p className={styles.successText}>Thank you for registering. Our partnership team will contact you to discuss collaborative opportunities.</p>
            </motion.div>
          ) : (
            <>
              <div className={styles.formHeader}>
                <h1 className={styles.formTitle}>Builder Registration</h1>
                <p className={styles.formSubtitle}>Collaborate with NOAH INFRA PROJECTS on upcoming large-scale projects.</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input type="text" className="form-input" required placeholder="BuildRight Constructors" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Builder Name (Contact Person)</label>
                    <input type="text" className="form-input" required placeholder="Michael Chang" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Registration Number</label>
                    <input type="text" className="form-input" required placeholder="REG-9876543" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Website</label>
                    <input type="url" className="form-input" placeholder="https://www.buildright.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" required placeholder="contact@buildright.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <input type="tel" className="form-input" required placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className={`form-group ${styles.fullWidth}`}>
                    <label className="form-label">Office Address</label>
                    <input type="text" className="form-input" required placeholder="456 Industrial Blvd" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input type="text" className="form-input" required placeholder="Chicago" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <input type="text" className="form-input" required placeholder="IL" />
                  </div>
                  <div className={`form-group ${styles.fullWidth}`}>
                    <label className="form-label">Current Projects (Optional)</label>
                    <textarea className="form-textarea" rows={3} placeholder="Describe any major ongoing projects..."></textarea>
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
                <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>Register as Builder</button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
