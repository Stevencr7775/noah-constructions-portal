"use client";

import { motion } from "framer-motion";
import { CheckCircle2, FileText, Phone, TrendingUp, ShieldCheck, DollarSign } from "lucide-react";
import styles from "./page.module.css";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

export default function SellProperties() {
  return (
    <div className={styles.pageWrapper}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={styles.heroTitle}
          >
            Sell Your Property With NOAH INFRA PROJECTS
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={styles.heroSubtitle}
          >
            Get the best market value for your property. Our experts handle everything from listing to closing.
          </motion.p>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={`section-padding ${styles.bgLight}`}>
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">Benefits of Listing With Us</h2>
            <p className="section-subtitle">Why thousands of property owners choose NOAH INFRA PROJECTS to sell their valuable assets.</p>
          </div>

          <motion.div 
            className="grid grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={fadeInUp} className="card p-6 text-center">
              <TrendingUp size={48} className={styles.benefitIcon} />
              <h3 className={styles.benefitTitle}>Maximum ROI</h3>
              <p className={styles.benefitText}>Our data-driven pricing strategies ensure you get the highest possible return on your investment.</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="card p-6 text-center">
              <ShieldCheck size={48} className={styles.benefitIcon} />
              <h3 className={styles.benefitTitle}>Secure Transactions</h3>
              <p className={styles.benefitText}>We handle all legalities and ensure a 100% secure transfer of property and funds.</p>
            </motion.div>
            <motion.div variants={fadeInUp} className="card p-6 text-center">
              <DollarSign size={48} className={styles.benefitIcon} />
              <h3 className={styles.benefitTitle}>Zero Hidden Fees</h3>
              <p className={styles.benefitText}>Transparent commission structures with absolutely no surprise charges at closing.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Process & Documents */}
      <section className="section-padding">
        <div className="container grid grid-cols-2 gap-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <h2 className="section-title">The Selling Process</h2>
            <div className={styles.processSteps}>
              <motion.div variants={fadeInUp} className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div>
                  <h4 className={styles.stepTitle}>Property Evaluation</h4>
                  <p className={styles.stepText}>Our experts visit your property for a comprehensive market analysis.</p>
                </div>
              </motion.div>
              <motion.div variants={fadeInUp} className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div>
                  <h4 className={styles.stepTitle}>Listing & Marketing</h4>
                  <p className={styles.stepText}>Professional photography and premium listings across our network.</p>
                </div>
              </motion.div>
              <motion.div variants={fadeInUp} className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div>
                  <h4 className={styles.stepTitle}>Negotiation & Closing</h4>
                  <p className={styles.stepText}>We negotiate the best price and handle all paperwork for a smooth closing.</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className={styles.documentsCard}
          >
            <h3 className={styles.cardTitle}><FileText className="inline mr-2" /> Required Documents</h3>
            <ul className={styles.docList}>
              <motion.li variants={fadeInUp}><CheckCircle2 className="text-success" /> Original Property Title Deed</motion.li>
              <motion.li variants={fadeInUp}><CheckCircle2 className="text-success" /> Valid Identity Proof (Passport/ID)</motion.li>
              <motion.li variants={fadeInUp}><CheckCircle2 className="text-success" /> NOC from Developer/Society</motion.li>
              <motion.li variants={fadeInUp}><CheckCircle2 className="text-success" /> Latest Tax Receipts</motion.li>
              <motion.li variants={fadeInUp}><CheckCircle2 className="text-success" /> Approved Floor Plans</motion.li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`section-padding ${styles.ctaSection}`}>
        <div className="container text-center">
          <h2 className="section-title text-white">Ready to Sell?</h2>
          <p className="section-subtitle text-white">Register your property today or contact our sales team for more information.</p>
          <div className={styles.ctaButtons}>
            <Link href="/sell-properties/register" className="btn btn-secondary">Register to Sell Property</Link>
            <Link href="/contact-us" className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>
              <Phone size={20} /> Contact Sales Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
