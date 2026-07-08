"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import styles from "../form.module.css";

export default function CorporateRegistration() {
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
              <p className={styles.successText}>Thank you for your corporate inquiry. Our B2B sales director will be in touch shortly.</p>
            </motion.div>
          ) : (
            <>
              <div className={styles.formHeader}>
                <h1 className={styles.formTitle}>Corporate Registration</h1>
                <p className={styles.formSubtitle}>Find the perfect commercial spaces and investment opportunities for your business.</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className={styles.formGrid}>
                  <div className="form-group">
                    <label className="form-label">Company Name</label>
                    <input type="text" className="form-input" required placeholder="TechCorp Global" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Person</label>
                    <input type="text" className="form-input" required placeholder="Sarah Jenkins" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Designation</label>
                    <input type="text" className="form-input" required placeholder="VP of Operations" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company Size</label>
                    <select className="form-select" required>
                      <option value="">Select Size</option>
                      <option value="1-50">1-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="500+">500+ employees</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-input" required placeholder="sarah@techcorp.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-input" required placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className={`form-group ${styles.fullWidth}`}>
                    <label className="form-label">Office Address</label>
                    <input type="text" className="form-input" required placeholder="789 Innovation Dr, Suite 100" />
                  </div>
                  <div className={`form-group ${styles.fullWidth}`}>
                    <label className="form-label">Business Requirement</label>
                    <textarea className="form-textarea" rows={3} required placeholder="We are looking for a 10,000 sqft office space in downtown..."></textarea>
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
                <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>Register Corporate Account</button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
