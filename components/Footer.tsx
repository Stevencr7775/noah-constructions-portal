import Link from "next/link";
import { Building2, Mail, Phone, MapPin } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerGrid}`}>
        {/* Company Info */}
        <div className={styles.footerSection}>
          <Link href="/" className={styles.logo}>
            <Building2 size={32} />
            <span>NOAH INFRA PROJECTS</span>
          </Link>
          <p className={styles.description}>
            Leading developers of premium residential and commercial properties, committed to excellence and innovation in every project.
          </p>
          <div className={styles.socialLinks}>
            <a href="#" aria-label="Facebook">FB</a>
            <a href="#" aria-label="Twitter">TW</a>
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="LinkedIn">IN</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Quick Links</h3>
          <ul className={styles.footerLinks}>
            <li><Link href="/about-us">About Us</Link></li>
            <li><Link href="/projects">Our Projects</Link></li>
            <li><Link href="/buy-properties">Buy Property</Link></li>
            <li><Link href="/sell-properties">Sell Property</Link></li>
            <li><Link href="/running-constructions">Ongoing Constructions</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Resources</h3>
          <ul className={styles.footerLinks}>
            <li><Link href="#">Terms & Conditions</Link></li>
            <li><Link href="#">Privacy Policy</Link></li>
            <li><Link href="#">Careers</Link></li>
            <li><Link href="#">News & Updates</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className={styles.footerSection}>
          <h3 className={styles.footerTitle}>Contact Us</h3>
          <ul className={styles.contactInfo}>
            <li>
              <MapPin size={20} className={styles.contactIcon} />
              <span>Villa no 55, Ayodya villas, bahadurpally, Hyderabad -- 500043</span>
            </li>
            <li>
              <Phone size={20} className={styles.contactIcon} />
              <span>+91 7075614150 / +91 9550224335</span>
            </li>
            <li>
              <Mail size={20} className={styles.contactIcon} />
              <span>noahconstructionshyd1@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} NOAH INFRA PROJECTS Construction & Real Estate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
