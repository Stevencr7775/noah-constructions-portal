"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, TrendingUp, Users, Award, Building } from "lucide-react";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

function FeaturedProperties() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/properties?isFeatured=true')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProperties(data.data.slice(0, 3)); // Show top 3
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading featured properties...</p>;
  if (properties.length === 0) return <p>No featured properties available at the moment.</p>;

  return (
    <>
      {properties.map((prop, index) => (
        <motion.div 
          key={prop.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="card"
        >
          <div className={styles.cardImageWrapper}>
            <img 
              src={prop.media && prop.media.length > 0 ? prop.media[0].url : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
              alt={prop.category} 
              className={styles.cardImage} 
            />
            <div className={styles.cardBadge}>{prop.status}</div>
          </div>
          <div className={styles.cardContent}>
            <h3 className={styles.cardTitle}>{prop.propertyId} - {prop.purpose}</h3>
            <p className={styles.cardLocation}>{prop.locality}, {prop.city}</p>
            <div className={styles.cardPrice}>₹{prop.totalPrice.toLocaleString('en-IN')}</div>
            <div className={styles.cardFeatures}>
              <span>{prop.category}</span>
              <span>{prop.facing} Facing</span>
              <span>{prop.plotSize}</span>
            </div>
            <Link href="/company-properties" className={styles.cardLink}>View Details <ArrowRight size={16} /></Link>
          </div>
        </motion.div>
      ))}
    </>
  );
}

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.h1 variants={fadeInUp} className={styles.heroTitle}>
              Building Your Dreams, <br />
              <span className={styles.heroHighlight}>Securing Your Future.</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className={styles.heroSubtitle}>
              Premium residential and commercial properties designed for modern living and unmatched business success.
            </motion.p>
            <motion.div variants={fadeInUp} className={styles.heroButtons}>
              <Link href="/buy-properties" className="btn btn-primary">
                Buy Property <ArrowRight size={20} />
              </Link>
              <Link href="/sell-properties" className="btn btn-secondary">
                Sell Property
              </Link>
              <Link href="/projects" className="btn btn-outline" style={{ color: 'white', borderColor: 'white' }}>
                View Projects
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className={`section-padding ${styles.introSection}`}>
        <div className={`container grid grid-cols-2 gap-8 items-center ${styles.introGrid}`}>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className={styles.introImage}
          >
            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Modern Building" className={styles.roundedImage} />
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className={styles.introText}
          >
            <motion.h2 variants={fadeInUp} className="section-title">Excellence in Every Detail</motion.h2>
            <motion.p variants={fadeInUp} className={styles.textBody}>
              For over two decades, NOAH INFRA PROJECTS has been at the forefront of innovative architecture and robust construction. We don&apos;t just build structures; we create thriving communities and world-class business hubs.
            </motion.p>
            <motion.ul variants={staggerContainer} className={styles.featureList}>
              <motion.li variants={fadeInUp}><CheckCircle2 className={styles.checkIcon} /> Sustainable Building Practices</motion.li>
              <motion.li variants={fadeInUp}><CheckCircle2 className={styles.checkIcon} /> Award-winning Architecture</motion.li>
              <motion.li variants={fadeInUp}><CheckCircle2 className={styles.checkIcon} /> Premium Locations</motion.li>
            </motion.ul>
            <motion.div variants={fadeInUp} style={{ marginTop: '2rem' }}>
              <Link href="/about-us" className="btn btn-outline">Discover Our Story</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Latest Highlight Project */}
      <section className={`section-padding ${styles.bgDark}`} style={{ backgroundColor: '#1a365d', color: 'white' }}>
        <div className={`container grid grid-cols-2 gap-8 items-center ${styles.introGrid}`}>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className={styles.introText}
          >
            <motion.div variants={fadeInUp} style={{ color: 'var(--secondary)', fontWeight: 'bold', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
              Latest Exclusive Project
            </motion.div>
            <motion.h2 variants={fadeInUp} className="section-title text-white">Park View Apartments</motion.h2>
            <motion.p variants={fadeInUp} className={styles.textBody} style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              Stop searching, start living. Welcome to Park View Apartments – where elegance meets comfort. Nestled in the heart of Chegunta, this premium residential community offers a perfect blend of modern convenience, superior craftsmanship, and serene living.
            </motion.p>
            <motion.ul variants={staggerContainer} className={styles.featureList} style={{ color: 'white' }}>
              <motion.li variants={fadeInUp} style={{ color: 'white' }}><CheckCircle2 className={styles.checkIcon} style={{ color: 'var(--secondary)' }} /> Exclusive 25 Ultra-Luxury Residences (1150 & 1030 SQFT)</motion.li>
              <motion.li variants={fadeInUp} style={{ color: 'white' }}><CheckCircle2 className={styles.checkIcon} style={{ color: 'var(--secondary)' }} /> Premium Amenities: Fitness Centre, Yoga Park, Retail & Dining</motion.li>
              <motion.li variants={fadeInUp} style={{ color: 'white' }}><CheckCircle2 className={styles.checkIcon} style={{ color: 'var(--secondary)' }} /> Strategic Location: Opp. Chegunta Bus Stop</motion.li>
            </motion.ul>
            <motion.div variants={fadeInUp} style={{ marginTop: '2rem' }}>
              <Link href="/projects" className="btn btn-secondary">Explore Park View</Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className={styles.introImage}
          >
            <img src="/park-view.png" alt="Park View Apartments" className={styles.roundedImage} style={{ border: '4px solid var(--secondary)' }} />
          </motion.div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className={`section-padding ${styles.bgLight}`}>
        <div className="container">
          <div className="text-center">
            <h2 className="section-title">Featured Properties</h2>
            <p className="section-subtitle">Explore our exclusive selection of premium properties available right now.</p>
          </div>
          
          <div className="grid grid-cols-1 md-grid-cols-3 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <FeaturedProperties />
          </div>
          
          <div className="text-center" style={{ marginTop: '3rem' }}>
            <Link href="/company-properties" className="btn btn-primary">View All Properties</Link>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className={`section-padding ${styles.ctaSection}`}>
        <div className="container text-center">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className={styles.ctaTitle}>
            Ready to find your dream property?
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className={styles.ctaSubtitle}>
            Get in touch with our expert agents today.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <Link href="/contact-us" className="btn btn-secondary">Contact Us Now</Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
