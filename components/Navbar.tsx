"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Building2 } from "lucide-react";
import styles from "./Navbar.module.css";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Buy Properties", href: "/buy-properties" },
  { name: "Sell Properties", href: "/sell-properties" },
  { name: "Company Properties", href: "/company-properties" },
  { name: "Projects", href: "/projects" },
  { name: "Running Constructions", href: "/running-constructions" },
  { name: "About Us", href: "/about-us" },
  { name: "Contact Us", href: "/contact-us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isSolidPage = pathname.includes('/admin') || pathname.includes('/register');

  return (
    <header className={`${styles.header} ${scrolled || isSolidPage ? styles.scrolled : ""}`}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          <Building2 size={32} />
          <span>NOAH INFRA PROJECTS</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className={styles.desktopNav}>
          <ul className={styles.navLinks}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.navLink} ${
                    pathname === link.href ? styles.active : ""
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className={styles.mobileMenuBtn}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className={styles.mobileNav}>
          <ul className={styles.mobileNavLinks}>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`${styles.mobileNavLink} ${
                    pathname === link.href ? styles.active : ""
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
