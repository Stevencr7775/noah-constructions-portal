"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import styles from "../form.module.css";
import Autocomplete from "@/components/ui/Autocomplete";
import MultiSelect from "@/components/ui/MultiSelect";

export default function PurchaserRegistration() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Master Data State
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [states, setStates] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [cities, setCities] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [districts, setDistricts] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [localities, setLocalities] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [layouts, setLayouts] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [propertyCategories, setPropertyCategories] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [plotSizes, setPlotSizes] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [additionalPreferences, setAdditionalPreferences] = useState<any[]>([]);

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const res = await fetch("/api/master-data");
        const json = await res.json();
        if (json.success) {
          setStates(json.data.states || []);
          setCities(json.data.cities || []);
          setDistricts(json.data.districts || []);
          setLocalities(json.data.localities || []);
          setLayouts(json.data.layoutApprovals || []);
          setPropertyCategories(json.data.propertyCategories || []);
          setPlotSizes(json.data.plotSizes || []);
          setAdditionalPreferences(json.data.additionalPreferences || []);
        }
      } catch (error) {
        console.error("Failed to fetch master data", error);
      }
    };
    fetchMasterData();
  }, []);

  // Form State - Personal
  const [personal, setPersonal] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: ""
  });

  // Form State - Property Preferences
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [plotSize, setPlotSize] = useState("");
  
  // Location cascading state
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");

  const [selectedLayouts, setSelectedLayouts] = useState<string[]>([]);
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [selectedAdditional, setSelectedAdditional] = useState<string[]>([]);

  // Derived state for dropdowns based on cascades
  const filteredCities = useMemo(() => cities.filter(c => c.stateId === selectedState), [cities, selectedState]);
  const filteredDistricts = useMemo(() => districts.filter(d => d.cityId === selectedCity), [districts, selectedCity]);
  const filteredLocalities = useMemo(() => localities.filter(l => l.districtId === selectedDistrict || selectedDistrict === ""), [localities, selectedDistrict]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate password match
    if (personal.password !== personal.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setIsSubmitted(true);
  };

  const handlePersonalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonal({ ...personal, [e.target.name]: e.target.value });
  };

  // Helper to get names for summary
  const getNames = (ids: string[], source: { id: string; name: string }[]) => ids.map(id => source.find(s => s.id === id)?.name).filter(Boolean).join(", ");
  const getName = (id: string, source: { id: string; name: string }[]) => source.find(s => s.id === id)?.name || "Not specified";

  return (
    <div className={styles.pageWrapper}>
      <div className="container">
        <motion.div 
          className={styles.formContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {isSubmitted ? (
            <motion.div 
              className={styles.successMessage}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <CheckCircle2 size={64} className={styles.successIcon} />
              <h2 className={styles.successTitle}>Registration Successful</h2>
              <p className={styles.successText}>Our team will contact you shortly.</p>
            </motion.div>
          ) : (
            <>
              <div className={styles.formHeader}>
                <h1 className={styles.formTitle}>Purchaser Registration</h1>
                <p className={styles.formSubtitle}>Join NOAH INFRA PROJECTS to find your dream property.</p>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Personal Details Section */}
                <h2 className={styles.sectionHeading}>Personal Details</h2>
                <div className={styles.formGrid}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" name="fullName" value={personal.fullName} onChange={handlePersonalChange} className="form-input" required placeholder="John Doe" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" name="email" value={personal.email} onChange={handlePersonalChange} className="form-input" required placeholder="john@example.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <input type="tel" name="mobile" value={personal.mobile} onChange={handlePersonalChange} className="form-input" required placeholder="+1 (555) 000-0000" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input type="password" name="password" value={personal.password} onChange={handlePersonalChange} className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password</label>
                    <input type="password" name="confirmPassword" value={personal.confirmPassword} onChange={handlePersonalChange} className="form-input" required />
                  </div>
                </div>

                <div className={styles.sectionDivider}></div>

                {/* Property Preference Section */}
                <h2 className={styles.sectionHeading}>Property Preferences</h2>
                <div className={styles.formGrid}>
                  
                  {/* Category */}
                  <div className={`form-group ${styles.fullWidth}`}>
                    <MultiSelect 
                      label="Property Category (Select Multiple)"
                      options={propertyCategories} 
                      selectedValues={selectedCategories} 
                      onChange={setSelectedCategories} 
                    />
                  </div>

                  {/* Plot Size */}
                  <div className="form-group">
                    <label className="form-label">Plot Size</label>
                    <select className="form-select" value={plotSize} onChange={(e) => setPlotSize(e.target.value)} required>
                      <option value="">Select Plot Size</option>
                      {plotSizes.map(size => (
                        <option key={size.id} value={size.id}>{size.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Empty div for grid alignment if needed */}
                  <div className={`form-group ${styles.hiddenMobile}`}></div>

                  {/* Location Filters */}
                  <div className="form-group">
                    <label className="form-label">State</label>
                    <select className="form-select" value={selectedState} onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedCity(""); setSelectedDistrict(""); setSelectedLocality("");
                    }} required>
                      <option value="">Select State</option>
                      {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">City</label>
                    <select className="form-select" value={selectedCity} onChange={(e) => {
                      setSelectedCity(e.target.value);
                      setSelectedDistrict(""); setSelectedLocality("");
                    }} required>
                      <option value="">Select City</option>
                      {filteredCities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">District</label>
                    <select className="form-select" value={selectedDistrict} onChange={(e) => {
                      setSelectedDistrict(e.target.value);
                      setSelectedLocality("");
                    }} required>
                      <option value="">Select District</option>
                      {filteredDistricts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>

                  <div className="form-group">
                    <Autocomplete 
                      label="Locality"
                      options={filteredLocalities}
                      value={selectedLocality}
                      onChange={setSelectedLocality}
                      placeholder="Search locality (A-Z)"
                    />
                  </div>

                  {/* Layout/Approval Type */}
                  <div className={`form-group ${styles.fullWidth}`}>
                    <MultiSelect 
                      label="Layout / Approval Type (Select Multiple)"
                      options={layouts} 
                      selectedValues={selectedLayouts} 
                      onChange={setSelectedLayouts}
                      columns={3}
                    />
                  </div>

                  {/* Budget */}
                  <div className="form-group">
                    <label className="form-label">Minimum Budget (₹)</label>
                    <input type="number" className="form-input" min="0" placeholder="e.g. 5000000" value={budgetMin} onChange={e => setBudgetMin(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Maximum Budget (₹)</label>
                    <input type="number" className="form-input" min="0" placeholder="e.g. 15000000" value={budgetMax} onChange={e => setBudgetMax(e.target.value)} required />
                  </div>

                  {/* Additional Preferences */}
                  <div className={`form-group ${styles.fullWidth}`}>
                    <MultiSelect 
                      label="Additional Preferences"
                      options={additionalPreferences} 
                      selectedValues={selectedAdditional} 
                      onChange={setSelectedAdditional}
                      columns={3}
                    />
                  </div>

                  <div className={`form-group ${styles.fullWidth}`}>
                    <label className="flex items-center" style={{ gap: '0.5rem', cursor: 'pointer' }}>
                      <input type="checkbox" required className="form-checkbox" />
                      <span>I agree to the Terms and Conditions and Privacy Policy.</span>
                    </label>
                  </div>
                </div>

                {/* Preference Summary Box */}
                <div className={styles.summaryBox}>
                  <h3 className={styles.summaryTitle}>Search Preference Summary</h3>
                  <div className={styles.summaryGrid}>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Category:</span>
                      <span className={styles.summaryValue}>{selectedCategories.length > 0 ? getNames(selectedCategories, propertyCategories) : "None selected"}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Plot Size:</span>
                      <span className={styles.summaryValue}>{getName(plotSize, plotSizes)}</span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Location:</span>
                      <span className={styles.summaryValue}>
                        {getName(selectedLocality, localities)}, {getName(selectedDistrict, districts)}, {getName(selectedCity, cities)}
                      </span>
                    </div>
                    <div className={styles.summaryItem}>
                      <span className={styles.summaryLabel}>Budget:</span>
                      <span className={styles.summaryValue}>
                        {budgetMin ? `₹${Number(budgetMin).toLocaleString('en-IN')}` : "0"} - {budgetMax ? `₹${Number(budgetMax).toLocaleString('en-IN')}` : "Any"}
                      </span>
                    </div>
                    <div className={styles.summaryItem} style={{ gridColumn: '1 / -1' }}>
                      <span className={styles.summaryLabel}>Layout Approvals:</span>
                      <span className={styles.summaryValue}>{selectedLayouts.length > 0 ? getNames(selectedLayouts, layouts) : "None selected"}</span>
                    </div>
                    <div className={styles.summaryItem} style={{ gridColumn: '1 / -1' }}>
                      <span className={styles.summaryLabel}>Additional Preferences:</span>
                      <span className={styles.summaryValue}>{selectedAdditional.length > 0 ? getNames(selectedAdditional, additionalPreferences) : "None"}</span>
                    </div>
                  </div>
                </div>

                <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>Register</button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
