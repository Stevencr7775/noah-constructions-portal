"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2 } from "lucide-react";
import styles from "./page.module.css";

export default function ContactUs() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div className="container text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="section-title text-white">
            Get In Touch
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="section-subtitle text-white">
            Have a question or want to discuss a project? We&apos;d love to hear from you.
          </motion.p>
        </div>
      </div>

      <div className="container section-padding">
        <div className={styles.contactLayout}>
          {/* Contact Information */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }} 
            className={styles.infoSection}
          >
            <h2 className={styles.sectionHeading}>Contact Information</h2>
            <p className={styles.infoText}>
              Reach out to our dedicated support team or visit us at our headquarters.
            </p>

            <div className={styles.infoList}>
              <div className={styles.infoItem}>
                <div className={styles.iconBox}><MapPin size={24} /></div>
                <div>
                  <h4 className={styles.infoLabel}>Head Office</h4>
                  <p className={styles.infoDetail}>Villa no 55, Ayodya villas, bahadurpally, Hyderabad -- 500043</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.iconBox}><Phone size={24} /></div>
                <div>
                  <h4 className={styles.infoLabel}>Phone Number</h4>
                  <p className={styles.infoDetail}>+91 7075614150<br/>+91 9550224335</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.iconBox}><Mail size={24} /></div>
                <div>
                  <h4 className={styles.infoLabel}>Email Address</h4>
                  <p className={styles.infoDetail}>noahconstructionshyd1@gmail.com</p>
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.iconBox}><Clock size={24} /></div>
                <div>
                  <h4 className={styles.infoLabel}>Working Hours</h4>
                  <p className={styles.infoDetail}>Mon - Fri: 9:00 AM - 6:00 PM<br/>Saturday: 10:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>

            <div className={styles.socialSection}>
              <h4 className={styles.infoLabel}>Follow Us</h4>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialBtn}>FB</a>
                <a href="#" className={styles.socialBtn}>TW</a>
                <a href="#" className={styles.socialBtn}>IG</a>
                <a href="#" className={styles.socialBtn}>IN</a>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }} 
            animate={{ opacity: 1, x: 0 }} 
            className={styles.formSection}
          >
            {isSubmitted ? (
              <div className={styles.successMessage}>
                <CheckCircle2 size={64} className="text-success mx-auto mb-4" style={{ margin: '0 auto 1rem', display: 'block' }} />
                <h3 className="section-title text-center" style={{ fontSize: '1.75rem' }}>Message Sent!</h3>
                <p className="text-center text-muted">Thank you for reaching out. We will get back to you within 24 hours.</p>
                <button onClick={() => setIsSubmitted(false)} className="btn btn-outline" style={{ marginTop: '2rem', width: '100%' }}>Send Another Message</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.contactForm}>
                <h2 className={styles.sectionHeading}>Send us a Message</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-input" required placeholder="John" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-input" required placeholder="Doe" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" className="form-input" required placeholder="john@example.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input type="tel" className="form-input" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Subject</label>
                    <input type="text" className="form-input" required placeholder="How can we help you?" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Message</label>
                    <textarea className="form-textarea" rows={5} required placeholder="Write your message here..."></textarea>
                  </div>
                </div>
                <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>
                  Send Message <Send size={18} />
                </button>
              </form>
            )}
          </motion.div>
        </div>

        {/* Map Placeholder */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className={styles.mapSection}
        >
          <div className={styles.mapPlaceholder}>
            <MapPin size={48} className={styles.mapIcon} />
            <p>Interactive Google Maps Integration</p>
            <span>Coordinates: 40.7128° N, 74.0060° W</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
