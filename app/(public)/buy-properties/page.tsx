"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UserCircle, Briefcase, HardHat, Building2 } from "lucide-react";
import styles from "./page.module.css";

const categories = [
  {
    title: "Purchaser",
    icon: <UserCircle size={48} />,
    description: "Looking to buy a dream home or invest in premium properties.",
    href: "/buy-properties/purchaser"
  },
  {
    title: "Agent",
    icon: <Briefcase size={48} />,
    description: "Real estate professionals looking to partner with NOAH INFRA PROJECTS.",
    href: "/buy-properties/agent"
  },
  {
    title: "Builder",
    icon: <HardHat size={48} />,
    description: "Construction companies interested in collaborative projects.",
    href: "/buy-properties/builder"
  },
  {
    title: "Corporate",
    icon: <Building2 size={48} />,
    description: "Businesses seeking commercial spaces and bulk investments.",
    href: "/buy-properties/corporate"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function BuyPropertiesPage() {
  return (
    <div className={styles.pageWrapper}>
      <div className={`container ${styles.contentContainer}`}>
        <div className="text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-title"
          >
            Select Your Category
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="section-subtitle"
          >
            Please select your role to proceed with the registration and view tailored property options.
          </motion.p>
        </div>

        <motion.div 
          className={styles.gridContainer}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category) => (
            <motion.div key={category.title} variants={itemVariants}>
              <Link href={category.href} className={styles.categoryCard}>
                <div className={styles.iconWrapper}>
                  {category.icon}
                </div>
                <h3 className={styles.cardTitle}>{category.title}</h3>
                <p className={styles.cardDescription}>{category.description}</p>
                <div className={styles.cardAction}>
                  Select <span className={styles.arrow}>→</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
