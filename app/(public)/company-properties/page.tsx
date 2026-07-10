"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Filter, ArrowRight } from "lucide-react";
import styles from "./page.module.css";
import Link from "next/link";


export default function CompanyProperties() {
  const [searchTerm, setSearchTerm] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [propertyCategories, setPropertyCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const res = await fetch("/api/master-data?type=propertyCategory");
        const json = await res.json();
        if (json.success) {
          setPropertyCategories(json.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchMasterData();
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        let query = "/api/properties?";
        if (categoryFilter) query += `category=${categoryFilter}&`;
        if (budgetFilter) {
          if (budgetFilter === "under50L") query += `maxBudget=5000000&`;
          if (budgetFilter === "50L-1Cr") query += `minBudget=5000000&maxBudget=10000000&`;
          if (budgetFilter === "over1Cr") query += `minBudget=10000000&`;
        }

        const res = await fetch(query);
        const data = await res.json();
        if (data.success) {
          setProperties(data.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [categoryFilter, budgetFilter]); // Re-fetch on filter change

  const filteredProperties = properties.filter(prop => 
    prop.propertyId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prop.locality.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prop.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.pageWrapper}>
      {/* Page Header */}
      <div className={styles.header}>
        <div className="container">
          <h1 className="section-title text-center" style={{ color: 'white', marginBottom: '1rem' }}>Our Properties</h1>
          <p className="section-subtitle text-center" style={{ color: 'rgba(255,255,255,0.8)' }}>Explore our diverse portfolio of residential and commercial spaces.</p>
          
          {/* Search Bar */}
          <div className={styles.searchBar}>
            <div className={styles.searchInputWrapper}>
              <Search className={styles.searchIcon} size={20} />
              <input 
                type="text" 
                placeholder="Search by ID, Locality, or Category..." 
                className={styles.searchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container section-padding">
        <div className={styles.layout}>
          {/* Filters Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.filterCard}>
              <div className="flex items-center gap-2 mb-4" style={{ marginBottom: '1.5rem' }}>
                <Filter size={20} className="text-primary" />
                <h3 className={styles.filterTitle}>Filters</h3>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Property Category</label>
                <select className="form-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                  <option value="">All Categories</option>
                  {propertyCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Budget</label>
                <select className="form-select" value={budgetFilter} onChange={e => setBudgetFilter(e.target.value)}>
                  <option value="">Any Budget</option>
                  <option value="under50L">Under ₹50 Lakhs</option>
                  <option value="50L-1Cr">₹50 Lakhs - ₹1 Crore</option>
                  <option value="over1Cr">Over ₹1 Crore</option>
                </select>
              </div>

            </div>
          </aside>

          {/* Properties Grid */}
          <div className={styles.propertiesGrid}>
            {loading ? (
              <p>Loading properties from database...</p>
            ) : filteredProperties.length === 0 ? (
              <p>No properties found matching your criteria.</p>
            ) : (
              filteredProperties.map((prop, index) => (
                <motion.div 
                  key={prop.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={styles.propertyCard}
                >
                  <div className={styles.cardImageWrapper}>
                    {/* Fallback image if no media uploaded */}
                    <img 
                      src={prop.media && prop.media.length > 0 ? prop.media[0].url : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                      alt={prop.category} 
                      className={styles.cardImage} 
                    />
                    <div className={styles.cardBadge}>{prop.status}</div>
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardType}>{prop.category}</span>
                      <span className={styles.cardPrice}>
                        ₹{prop.totalPrice.toLocaleString('en-IN')}
                        {prop.pricePerSqYard && <span style={{ fontSize: '0.75rem', fontWeight: 'normal', display: 'block' }}>₹{Number(prop.pricePerSqYard).toLocaleString('en-IN')} / Sq.Yd</span>}
                      </span>
                    </div>
                    <h3 className={styles.cardTitle}>{prop.propertyId} - {prop.purpose}</h3>
                    <div className={styles.cardLocation}>
                      <MapPin size={16} /> {prop.locality}, {prop.city}
                    </div>
                    <p className={styles.cardDesc}>
                      {prop.description.length > 100 ? prop.description.substring(0, 100) + '...' : prop.description}
                    </p>
                    <Link href="#" className={styles.cardBtn}>
                      View Details <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
