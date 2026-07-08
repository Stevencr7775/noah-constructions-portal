"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, HardHat, Camera } from "lucide-react";
import styles from "./page.module.css";

type Construction = {
  id: number;
  name: string;
  location: string;
  progress: number;
  expectedCompletion: string;
  status: string;
  description: string;
  image?: string;
};

const constructions: Construction[] = [
  {
    id: 1,
    name: "Subhamasthu Infra - Commercial Hotel Suite Rooms",
    location: "Yadagirigutta, Bhongir Dist, Telangana",
    progress: 35,
    expectedCompletion: "Sep 2025",
    status: "Execution & Project Management",
    description: "Construction of Commercial Hotel Suite Rooms of 150 with 3 star accommodation tied with LEMON TREE HOTELS. Scope includes Turn Key Consultation, Designs and Drawings. Estimated Cost: 30 Crores."
  },
  {
    id: 2,
    name: "Subhamasthu Infra - Residential Apartments",
    location: "Jangaon, Telangana",
    progress: 25,
    expectedCompletion: "Dec 2025",
    status: "Execution & Project Management",
    description: "Construction of Residential Apartments with 70 Flats (84,000 sft Area) in 2 acres and Independent Housing Project of 20 units of Duplex Housing (40,000 sft). Estimated Cost: 24 Crores."
  }
];

export default function RunningConstructions() {
  return (
    <div className={styles.pageWrapper}>
      {/* Header */}
      <div className={styles.header}>
        <div className="container text-center">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <HardHat size={48} className={styles.headerIcon} />
            <h1 className="section-title text-white">Live Construction Updates</h1>
            <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.8)' }}>
              Track the progress of our ongoing developments. Transparency and quality at every step.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container section-padding">
        <div className={styles.timeline}>
          {constructions.map((project, index) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className={styles.projectCard}
            >
              <div className={styles.imageSection}>
                {project.image ? (
                  <img src={project.image} alt={project.name} className={styles.projectImage} />
                ) : (
                  <div className={styles.projectImage} style={{ backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                    <HardHat size={64} />
                  </div>
                )}
                <div className={styles.cameraIcon}>
                  <Camera size={20} /> Live Feed Archive
                </div>
              </div>
              
              <div className={styles.contentSection}>
                <h2 className={styles.projectTitle}>{project.name}</h2>
                
                <div className={styles.metaInfo}>
                  <span className={styles.metaItem}><MapPin size={18} /> {project.location}</span>
                  <span className={styles.metaItem}><Calendar size={18} /> Expected: {project.expectedCompletion}</span>
                </div>

                <div className={styles.progressContainer}>
                  <div className={styles.progressHeader}>
                    <span className={styles.progressLabel}>Overall Progress</span>
                    <span className={styles.progressPercent}>{project.progress}%</span>
                  </div>
                  <div className={styles.progressBarBg}>
                    <motion.div 
                      className={styles.progressBarFill}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${project.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                  </div>
                </div>

                <div className={styles.statusBox}>
                  <span className={styles.statusLabel}>Current Status:</span>
                  <span className={styles.statusText}>{project.status}</span>
                </div>

                <p className={styles.description}>{project.description}</p>
                

              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
