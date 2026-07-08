"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar, CheckCircle2, ArrowRight, Building } from "lucide-react";
import styles from "./page.module.css";
import Link from "next/link";

const projects = [
  {
    id: 99,
    name: "Park View Apartments",
    location: "Opp. Chegunta Bus Stop, Chegunta",
    status: "Selling Fast",
    completionDate: "Ready to Move",
    description: "Exclusive 25 ultra-luxury residences featuring 1150 & 1030 SQFT layouts. A perfect blend of modern convenience, superior craftsmanship, and serene living.",
    amenities: ["Fitness Centre", "Yoga Park", "Retail & Dining", "Kid's Play Area"],
    image: "/park-view.png",
    category: "residential"
  },
  {
    id: 1,
    name: "Parsonage Construction",
    location: "Bhavani Nagar, ECIL, Hyderabad",
    status: "Completed",
    completionDate: "Past Project",
    description: "Parsonage construction for DGLC. Estimated Cost: 70 Lakhs.",
    amenities: ["Construction"],
    category: "commercial"
  },
  {
    id: 2,
    name: "Residential Project (Jaganadham)",
    location: "Dammaiguda",
    status: "Completed",
    completionDate: "Past Project",
    description: "Residential project for Finolex Pvt Ltd Engineer. Estimated Cost: 60 Lakhs.",
    amenities: ["Construction"],
    category: "residential"
  },
  {
    id: 3,
    name: "Residential Project (Christina)",
    location: "Dammaiguda",
    status: "Completed",
    completionDate: "Past Project",
    description: "Residential Project for DELL employee. Estimated Cost: 42 Lakhs.",
    amenities: ["Construction"],
    category: "residential"
  },
  {
    id: 4,
    name: "Residential Project (Rajsekhar)",
    location: "Dammaiguda",
    status: "Completed",
    completionDate: "Past Project",
    description: "Residential Project for Pvt Firm Engineer. Estimated Cost: 28 Lakhs.",
    amenities: ["Construction"],
    category: "residential"
  },
  {
    id: 5,
    name: "Residential Apartment (Partha Sarathy)",
    location: "Dammaiguda",
    status: "Completed",
    completionDate: "Past Project",
    description: "Residential Apartment construction. Estimated Cost: 90 Lakhs.",
    amenities: ["Apartment"],
    category: "residential"
  },
  {
    id: 6,
    name: "Residential Group Housing",
    location: "Bandlaguda",
    status: "Completed",
    completionDate: "Past Project",
    description: "Residential Group housing for NCL employees. Estimated Cost: 1.2 Crores.",
    amenities: ["Group Housing"],
    category: "residential"
  },
  {
    id: 7,
    name: "Residential Project (Subba Lakshmi / Abdul Sammad)",
    location: "Venkatramana colony, Nagole",
    status: "Completed",
    completionDate: "Past Project",
    description: "Residential Project. Estimated Cost: 80 Lakhs.",
    amenities: ["Construction"],
    category: "residential"
  },
  {
    id: 8,
    name: "Residential Project (Satya babu)",
    location: "LB Nagar",
    status: "Completed",
    completionDate: "Past Project",
    description: "Residential Project for Commissioner. Estimated Cost: 75 Lakhs.",
    amenities: ["Construction"],
    category: "residential"
  },
  {
    id: 9,
    name: "Residential Apartment (Srinivas)",
    location: "Hyderabad",
    status: "Completed",
    completionDate: "Past Project",
    description: "Residential Apartment construction for SBI personnel. Estimated Cost: 1.4 Crores.",
    amenities: ["Apartment"],
    category: "residential"
  },
  {
    id: 10,
    name: "Residential Building (Kandar)",
    location: "Kenya",
    status: "Completed",
    completionDate: "Past Project",
    description: "Residential Building construction. Estimated Cost: 1.2 Crores.",
    amenities: ["Construction"],
    category: "residential"
  },
  {
    id: 11,
    name: "Residential Building Renovation",
    location: "Hyderabad",
    status: "Completed",
    completionDate: "Past Project",
    description: "Renovation and extension for Suresh (Satyam). Estimated Cost: 40 Lakhs.",
    amenities: ["Renovation"],
    category: "residential"
  },
  {
    id: 12,
    name: "Residential Building (Senthil)",
    location: "Alwal",
    status: "Completed",
    completionDate: "Past Project",
    description: "Residential Building construction for Aurobindo personnel. Estimated Cost: 80 Lakhs.",
    amenities: ["Construction"],
    category: "residential"
  },
  {
    id: 13,
    name: "Residential Building (Suresh babu)",
    location: "Alwal",
    status: "Completed",
    completionDate: "Past Project",
    description: "Residential Building construction. Estimated Cost: 60 Lakhs.",
    amenities: ["Construction"],
    category: "residential"
  },
  {
    id: 14,
    name: "Commercial Building & Interiors",
    location: "Jubilee Hills, Hyderabad",
    status: "Completed",
    completionDate: "Past Project",
    description: "Commercial Building Renovation and Interiors for MNRAO (CEO - Medisys). Estimated Cost: 1.8 Crores.",
    amenities: ["Interiors", "Renovation"],
    category: "commercial"
  },
  {
    id: 15,
    name: "Commercial Studio Construction",
    location: "Jubilee Hills",
    status: "Completed",
    completionDate: "Past Project",
    description: "Commercial Building Studio construction for Lakshman Rao. Estimated Cost: 1.2 Crores.",
    amenities: ["Studio", "Construction"],
    category: "commercial"
  },
  {
    id: 16,
    name: "Residential Apartment (Uday)",
    location: "Kondapur",
    status: "Under Construction",
    completionDate: "Ongoing",
    description: "Residential Apartment construction. Estimated Cost: 1.4 Crores.",
    amenities: ["Apartment"],
    category: "residential"
  },
  {
    id: 17,
    name: "Residential Apartment (Ravindar)",
    location: "Kondapur",
    status: "Under Construction",
    completionDate: "Ongoing",
    description: "Residential Apartment construction. Estimated Cost: 1.2 Crores.",
    amenities: ["Apartment"],
    category: "residential"
  },
  {
    id: 18,
    name: "Residential Apartment (Murthy)",
    location: "Kondapur",
    status: "Under Construction",
    completionDate: "Ongoing",
    description: "Residential Apartment construction. Estimated Cost: 1.4 Crores.",
    amenities: ["Apartment"],
    category: "residential"
  },
  {
    id: 19,
    name: "Residential Bungalow",
    location: "Kollur",
    status: "Under Construction",
    completionDate: "Ongoing",
    description: "Residential Bungalow construction for Ratnakar. Estimated Cost: 1.8 Crores.",
    amenities: ["Bungalow"],
    category: "residential"
  },
  {
    id: 20,
    name: "Residential Apartment (Gopal Reddy)",
    location: "Gandhinagar",
    status: "Completed",
    completionDate: "Past Project",
    description: "Residential Apartment construction. Estimated Cost: 1.2 Crores.",
    amenities: ["Apartment"],
    category: "residential"
  },
  {
    id: 21,
    name: "Subhamasthu Infra - Commercial Hotel",
    location: "Yadagirigutta",
    status: "Turn Key Consultation",
    completionDate: "Sep 2025",
    description: "Construction of Commercial 3-star Hotel Suite Rooms (150,000 sft). Estimated Cost: 30 Crores.",
    amenities: ["Hotel", "Turn Key"],
    category: "commercial"
  },
  {
    id: 22,
    name: "Subhamasthu Infra - Residential Apartments",
    location: "Jangoan",
    status: "Turn Key Consultation",
    completionDate: "Dec 2025",
    description: "Construction of Residential Apartments (70 Flats, 84,000 sft). Estimated Cost: 24 Crores.",
    amenities: ["Apartments", "Turn Key"],
    category: "residential"
  }
];

export default function ProjectsPage() {
  const [filter, setFilter] = useState("all");

  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.header}>
        <div className="container text-center">
          <h1 className="section-title text-white">Our Signature Projects</h1>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Discover our portfolio of iconic developments that define modern living and workspaces.
          </p>

          <div className={styles.filterTabs}>
            <button 
              className={`${styles.filterTab} ${filter === "all" ? styles.active : ""}`}
              onClick={() => setFilter("all")}
            >
              All Projects
            </button>
            <button 
              className={`${styles.filterTab} ${filter === "residential" ? styles.active : ""}`}
              onClick={() => setFilter("residential")}
            >
              Residential
            </button>
            <button 
              className={`${styles.filterTab} ${filter === "commercial" ? styles.active : ""}`}
              onClick={() => setFilter("commercial")}
            >
              Commercial
            </button>
          </div>
        </div>
      </div>

      <div className="container section-padding">
        <div className={styles.projectsGrid}>
          {filteredProjects.map((project, index) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={styles.projectCard}
            >
              <div className={styles.imageGallery}>
                {project.image ? (
                  <img src={project.image} alt={project.name} className={styles.mainImage} />
                ) : (
                  <div className={styles.mainImage} style={{ backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', height: '100%', width: '100%' }}>
                    <Building size={64} />
                  </div>
                )}
                <div className={styles.statusBadge} data-status={project.status}>
                  {project.status}
                </div>
              </div>
              
              <div className={styles.cardContent}>
                <h3 className={styles.projectTitle}>{project.name}</h3>
                
                <div className={styles.projectMeta}>
                  <div className={styles.metaItem}>
                    <MapPin size={16} /> {project.location}
                  </div>
                  <div className={styles.metaItem}>
                    <Calendar size={16} /> {project.completionDate}
                  </div>
                </div>

                <p className={styles.projectDesc}>{project.description}</p>

                <div className={styles.amenities}>
                  <h4 className={styles.amenitiesTitle}>Key Tags:</h4>
                  <ul className={styles.amenitiesList}>
                    {project.amenities.map(amenity => (
                      <li key={amenity}><CheckCircle2 size={16} className="text-success" /> {amenity}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
