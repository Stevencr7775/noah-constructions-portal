"use client";

import { motion } from "framer-motion";
import { Target, Lightbulb, Heart, Award, CheckCircle2 } from "lucide-react";
import styles from "./page.module.css";

const values = [
  { icon: <Target size={32} />, title: "Precision", desc: "Exacting standards in every project." },
  { icon: <Lightbulb size={32} />, title: "Innovation", desc: "Embracing the future of construction." },
  { icon: <Heart size={32} />, title: "Integrity", desc: "Honest, transparent partnerships." }
];

const services = [
  "Residential Buildings",
  "Multistoried Apartments",
  "Commercial Complexes",
  "Educational Institutions",
  "Renovation & Extension of Buildings",
  "Interior Works",
  "Landscaping",
  "Architectural Designs & Drawings",
  "Layout Infrastructures",
  "Building Permissions & Approvals",
  "Land Valuations, Surveys, Title Deeds & Legal Opinions",
  "Real Estate Activity",
  "Promotion of Ventures",
  "Project Consultancy Management Services",
  "Villa Constructions",
  "Construction of Factory Sheds",
  "Periphery Compound Walls of Layouts"
];

const executionSteps = [
  "Identification",
  "Verification",
  "Legalisation",
  "Acquisition",
  "Project Scope",
  "Market Analyses",
  "Project Plan",
  "Project Management Plan",
  "Licensing & Approval",
  "Fund Allocation",
  "Allocation of the Project",
  "Advertisement & Marketing",
  "Support & Integration",
  "Legalisation of Allocation",
  "Allotment",
  "Possession"
];

const turnKeyServices = [
  "Designs, Schematic Drawings, Structural Drawings",
  "Recruitment of Staff - Engineers, Supervisors, Purchase Officer, Accountant, Housekeeping, Security, Installation of CCTV cameras",
  "Purchase of Materials like cement, sand, metal, steel and all other materials required for construction",
  "Organising Labour for centering works, civil masonry works, carpenters, painters, electricians, plumbers, tile layers, NMR labourers, man power required for contractual works",
  "Execution of the Project as per designs and drawings approved mutually with the concern",
  "Materials Purchase is according to the specification agreed"
];

const turnKeyExclusions = [
  "Compound Wall, Gates, Lifts, Generators, UPS, Cable, Gas, Copper Conduit for AC, Solar Fencing, Solar Water units on terrace, Bore, Motor, Electricity Panel, Municipal Permission, Electricity Bills during construction, Water Supply during construction"
];

const turnKeyFee = "Flat rate on total slab area is agreed mutually and payment schedule is given as per stage wise. 5% of GST is charged on total quote given.";

const consultationServices = [
  "Recruitment of Staff - Engineers, Supervisors, Purchase Officer, Accountant, Housekeeping, Security, Installation of CCTV cameras",
  "Indent of materials like cement, sand, metal, steel and all other materials required for construction will be given/purchased. Payments of vendors to be settled by owner",
  "Quality Checking, Quantity Checking, Cost Approval, Inward and Outward of materials will be recorded",
  "Organising Labour for centering works, civil masonry works, carpenters, painters, electricians, plumbers, tile layers, NMR labourers, man power required for contractual works",
  "Payments to labourers, contractors will be paid by owner. Bills will be raised on weekly basis",
  "Execution of the Project as per designs and drawings approved mutually with the concern",
  "All materials like sanitary, CP fittings, tiles, flooring, electrical or any other related will be purchased by the owner",
  "Water, Electricity, should be supplied to workers by the owner"
];

const consultationExclusions = [
  "Design and Drawings fee is charged"
];

const consultationFee = "There will be consultation charges of -----------% on the total cost of materials and labour expenditure incurred during the month and bill will be raised on monthly basis.";

const leadership = [
  { name: "Mr. K. John", role: "Proprietor (MBA, PGDCA)" },
  { name: "Mr. Devadas Komarapu", role: "Consultant Engineer (B.Tech)" },
  { name: "Mr. Rajesh.K", role: "Consultant Engineer (B.Tech, MIE)" }
];

export default function AboutUs() {
  return (
    <div className={styles.pageWrapper}>
      {/* Hero Header */}
      <div className={styles.header}>
        <div className="container text-center">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="section-title text-white">
            About NOAH INFRA PROJECTS
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="section-subtitle text-white">
            Building legacies, one project at a time.
          </motion.p>
        </div>
      </div>

      {/* History & Vision */}
      <section className="section-padding">
        <div className="container grid grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="section-title">Our Story</h2>
            <p className={styles.textBlock}>
              The promoter of the company started the construction work in 2005 as a proprietor concern in the name of NOAH CONSTRUCTIONS and successfully executed a number of projects for individuals and reputed corporate companies. The company has vastly executed projects in Secunderabad and Hyderabad, covering various residential and commercial projects across all parts of the city.
            </p>
            <p className={styles.textBlock}>
              The process of growth into qualitative and customized construction continues with more and more experienced personnel in the construction industry, delivering high-quality commitments with timely execution. M/s. Noah Constructions has made progressive and steady expansion over the last 15 years and undertaken various projects with utmost customer satisfaction, quality checks, and well-handled professional and technical expertise.
            </p>
            <p className={styles.textBlock}>
              The company involves a large number of Engineers, Technicians, Skilled, and Unskilled labor for the successful implementation of projects. It is empaneled with Architects, Engineers, Contractors, and an advisory board committee for smooth functioning and skilled technical expertise to meet Civil Engineering standards. It continuously maintains the coordination of Vendors, Suppliers, Materials, Labour contractors, and all machinery related to construction.
            </p>
            <p className={styles.textBlock} style={{ fontStyle: 'italic', fontWeight: 600, color: 'var(--primary)' }}>
              Our philosophy: &quot;What we Build Today Builds us Tomorrow&quot; helps us remain sustainable in the market. Delivering a Quality product within time gears us in our business.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className={styles.visionBox}>
              <h3 className={styles.visionTitle}><Target className="inline mr-2" /> Our Mission</h3>
              <p>To deliver exceptional real estate projects that exceed client expectations through innovation, quality, and sustainable practices.</p>
            </div>
            <div className={styles.visionBox}>
              <h3 className={styles.visionTitle}><Lightbulb className="inline mr-2" /> Our Vision</h3>
              <p>To be the world&apos;s most trusted and innovative real estate developer, setting global benchmarks in design and sustainability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className={`section-padding ${styles.bgDark}`}>
        <div className="container">
          <h2 className="section-title text-center text-white">Our Expertise & Services</h2>
          <p className="section-subtitle text-center" style={{ color: 'rgba(255,255,255,0.8)' }}>
            The Company is well equipped to render a wide range of services:
          </p>
          <div className="mt-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {services.map((service, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 10 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: idx * 0.05 }} 
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  padding: '1rem 1.25rem', 
                  borderRadius: 'var(--radius-lg)', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem',
                  transition: 'background 0.3s ease'
                }}
              >
                <CheckCircle2 size={20} style={{ flexShrink: 0, color: 'var(--secondary)' }} />
                <span style={{ fontSize: '1rem', fontWeight: 500 }}>{service}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Execution */}
      <section className="section-padding">
        <div className="container">
          <h2 className="section-title text-center">Project Execution Lifecycle</h2>
          <p className="section-subtitle text-center">
            A systematic and transparent approach from conceptualization to possession.
          </p>
          <div className="grid grid-cols-2 md-grid-cols-4 gap-6 mt-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {executionSteps.map((step, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: idx * 0.05 }} 
                style={{
                  background: 'var(--surface)',
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-sm)',
                  borderLeft: '4px solid var(--secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--border)' }}>
                  {(idx + 1).toString().padStart(2, '0')}
                </div>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: 0 }}>
                  {step}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizational Chart */}
      <section className={`section-padding ${styles.bgLight}`}>
        <div className="container">
          <h2 className="section-title text-center">Organizational Chart</h2>
          <div className="mt-8 text-center" style={{ overflowX: 'auto', paddingBottom: '2rem' }}>
            <div style={{ padding: '1rem', background: 'var(--primary)', color: 'white', borderRadius: '8px', display: 'inline-block', minWidth: '200px', fontWeight: 'bold' }}>BOARD MEMBER</div>
            
            <div style={{ height: '30px', width: '3px', background: 'var(--primary)', margin: '0 auto' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', minWidth: '800px' }}>
              <div style={{ flex: 1, minWidth: '250px' }}>
                <div style={{ padding: '1rem', background: 'var(--secondary)', color: 'var(--primary)', borderRadius: '8px', fontWeight: 'bold' }}>PROJECT MANAGER</div>
                <div style={{ padding: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border)', marginTop: '1rem' }}>Site Engineers</div>
                <div style={{ padding: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border)', marginTop: '0.5rem' }}>Labour Supervisors</div>
              </div>
              
              <div style={{ flex: 1, minWidth: '250px' }}>
                <div style={{ padding: '1rem', background: 'var(--secondary)', color: 'var(--primary)', borderRadius: '8px', fontWeight: 'bold' }}>PURCHASE MANAGER</div>
                <div style={{ padding: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border)', marginTop: '1rem' }}>Civil Supplies</div>
                <div style={{ padding: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border)', marginTop: '0.5rem' }}>Vendors</div>
              </div>

              <div style={{ flex: 1, minWidth: '250px' }}>
                <div style={{ padding: '1rem', background: 'var(--secondary)', color: 'var(--primary)', borderRadius: '8px', fontWeight: 'bold' }}>FINANCE MANAGER</div>
                <div style={{ padding: '0.5rem', background: 'var(--surface)', border: '1px solid var(--border)', marginTop: '1rem' }}>Accountant</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Models */}
      <section className="section-padding">
        <div className="container">
          <h2 className="section-title text-center">Service Models</h2>
          <div className="grid grid-cols-1 md-grid-cols-2 gap-8 mt-8">
            {/* Turn Key Projects Services */}
            <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', borderTop: '4px solid var(--primary)' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Turn Key Projects Services</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {turnKeyServices.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={20} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '4px' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#FEF2F2', borderRadius: '8px', borderLeft: '4px solid var(--error)' }}>
                <h4 style={{ color: 'var(--error)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Exclusions</h4>
                <p style={{ fontSize: '0.9rem' }}>{turnKeyExclusions[0]}</p>
              </div>
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#F0FDF4', borderRadius: '8px', borderLeft: '4px solid var(--success)' }}>
                <h4 style={{ color: 'var(--success)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Fee Structure</h4>
                <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{turnKeyFee}</p>
              </div>
            </div>

            {/* Contract of Consultation */}
            <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', borderTop: '4px solid var(--secondary)' }}>
              <h3 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '1.5rem' }}>Contract of Consultation</h3>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {consultationServices.map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={20} style={{ color: 'var(--secondary)', flexShrink: 0, marginTop: '4px' }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#FEF2F2', borderRadius: '8px', borderLeft: '4px solid var(--error)' }}>
                <h4 style={{ color: 'var(--error)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Exclusions</h4>
                <p style={{ fontSize: '0.9rem' }}>{consultationExclusions[0]}</p>
              </div>
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#F0FDF4', borderRadius: '8px', borderLeft: '4px solid var(--success)' }}>
                <h4 style={{ color: 'var(--success)', marginBottom: '0.5rem', fontWeight: 'bold' }}>Fee Structure</h4>
                <p style={{ fontSize: '0.9rem', fontWeight: 500 }}>{consultationFee}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className={`section-padding ${styles.bgLight}`}>
        <div className="container">
          <h2 className="section-title text-center">Core Values</h2>
          <div className="grid grid-cols-3 gap-6 mt-12">
            {values.map((value, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className={styles.valueCard}>
                <div className={styles.valueIcon}>{value.icon}</div>
                <h3 className={styles.valueTitle}>{value.title}</h3>
                <p className={styles.valueDesc}>{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="section-padding">
        <div className="container">
          <h2 className="section-title text-center">Board Members</h2>
          <div className="grid grid-cols-3 gap-6 mt-12">
            {leadership.map((leader, idx) => (
              <div key={idx} className={styles.leaderCard}>
                <div className={styles.leaderInfo}>
                  <h3 className={styles.leaderName}>{leader.name}</h3>
                  <p className={styles.leaderRole}>{leader.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
