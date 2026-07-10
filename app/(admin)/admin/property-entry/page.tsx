"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, CheckCircle2, Trash2 } from "lucide-react";
import styles from "./page.module.css";
import Autocomplete from "@/components/ui/Autocomplete";
import MultiSelect from "@/components/ui/MultiSelect";

const purposes = ["Sale", "Development", "Joint Development", "Ratio Development"];
const facings = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];
const roadSizes = ["20 Feet", "30 Feet", "33 Feet", "40 Feet", "50 Feet", "60 Feet", "80 Feet", "100 Feet", "120 Feet"];
const statuses = ["Available", "Booked", "Sold", "Under Negotiation", "Development", "Hidden"];
const masterAmenities = [
  { id: "am1", name: "Electricity" }, { id: "am2", name: "Water Connection" },
  { id: "am3", name: "Compound Wall" }, { id: "am4", name: "Corner Plot" },
  { id: "am5", name: "Ready to Register" }, { id: "am6", name: "Loan Facility" },
  { id: "am7", name: "Park Facing" }, { id: "am8", name: "Lake View" },
  { id: "am9", name: "Highway Facing" }
];

export default function PropertyEntry() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
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
        }
      } catch (error) {
        console.error("Failed to fetch master data", error);
      }
    };
    fetchMasterData();
  }, []);

  // Basic Info
  const [purpose, setPurpose] = useState(purposes[0]);
  const [category, setCategory] = useState("");
  const [developmentRatio, setDevelopmentRatio] = useState("");
  
  // Location
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [googleMapsUrl, setGoogleMapsUrl] = useState("");

  // Details
  const [plotSize, setPlotSize] = useState("");
  const [facing, setFacing] = useState("");
  const [roadSize, setRoadSize] = useState("");
  const [selectedLayouts, setSelectedLayouts] = useState<string[]>([]);
  
  // Price
  const [totalPrice, setTotalPrice] = useState("");
  const [pricePerSqYard, setPricePerSqYard] = useState("");
  const [isNegotiable, setIsNegotiable] = useState(false);

  // Description & Status
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(statuses[0]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Owner/Agent
  const [ownerType, setOwnerType] = useState("Owner");
  const [contactInfo, setContactInfo] = useState({
    name: "", mobile: "", email: "", address: "", agency: "", reraNumber: ""
  });

  // Media
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Upload Files
      const uploadedMedia = [];
      let uploadFailed = false;
      for (const file of files) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', 'gvpaydqy');
          
          const uploadRes = await fetch('https://api.cloudinary.com/v1_1/eyt7q3en/auto/upload', { 
            method: 'POST', 
            body: formData 
          });
          
          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            // Cloudinary returns secure_url and resource_type (image/video/raw)
            uploadedMedia.push({ url: uploadData.secure_url, type: uploadData.resource_type });
          } else { 
            uploadFailed = true; 
            console.error("Cloudinary upload failed with status:", uploadRes.status);
          }
        } catch (e) {
          console.error("File upload error", e);
          uploadFailed = true;
        }
      }

      // 2. Prepare Payload
      const payload = {
        purpose,
        category: propertyCategories.find(c => c.id === category)?.name || category,
        state: selectedState,
        city: selectedCity,
        district: selectedDistrict,
        locality: selectedLocality,
        plotSize: plotSize,
        facing,
        roadSize,
        totalPrice,
        pricePerSqYard,
        isNegotiable,
        description,
        status,
        isFeatured,
        googleMapsUrl,
        developmentRatio: ['Joint Development', 'Ratio Development'].includes(purpose) ? developmentRatio : null,
        layoutApprovals: selectedLayouts.map(id => layouts.find(l => l.id === id)?.name),
        amenities: selectedAmenities.map(id => masterAmenities.find(a => a.id === id)?.name),
        ownerType,
        ownerDetails: ownerType === 'Owner' ? contactInfo : null,
        agentDetails: ownerType === 'Agent' ? contactInfo : null,
        mediaFiles: uploadedMedia
      };

      // 3. Submit Property
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setIsSubmitted(true);
        if (uploadFailed) {
          alert("Property saved successfully! However, some media uploads failed.");
        }
      } else {
        alert("Error saving property: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={styles.pageWrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className={styles.formCard} style={{ textAlign: 'center' }}>
          <CheckCircle2 size={64} className="text-success mx-auto mb-4" />
          <h2 className="section-title">Property Added Successfully</h2>
          <p className="text-muted mb-6">The property is now live in the database.</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>Add Another Property</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.formCard}>
          <div className={styles.header}>
            <h1 className={styles.title}>Property Entry System</h1>
            <p className="text-muted">Enter property details into the centralized database.</p>
          </div>

          <form onSubmit={handleSubmit}>
            
            {/* Basic Info */}
            <h3 className={styles.sectionHeading}>Basic Information</h3>
            <div className={styles.grid}>
              <div className="form-group">
                <label className="form-label">Property Purpose</label>
                <select className="form-select" value={purpose} onChange={e => setPurpose(e.target.value)}>
                  {purposes.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Property Category</label>
                <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="">Select Category</option>
                  {propertyCategories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              {['Joint Development', 'Ratio Development'].includes(purpose) && (
                <div className="form-group">
                  <label className="form-label">Development Ratio (Owner : Builder)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 60:40 or 50:50"
                    value={developmentRatio}
                    onChange={e => setDevelopmentRatio(e.target.value)}
                  />
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Enter as Owner share : Builder share (e.g. 60:40)
                  </p>
                </div>
              )}
            </div>

            {/* Location */}
            <h3 className={styles.sectionHeading}>Location Details</h3>
            <div className={styles.grid}>

              {/* Hidden datalists for suggestions */}
              <datalist id="states-list">
                {states.map((s: any) => <option key={s.id} value={s.name} />)}
              </datalist>
              <datalist id="cities-list">
                {cities.map((c: any) => <option key={c.id} value={c.name} />)}
              </datalist>
              <datalist id="districts-list">
                {districts.map((d: any) => <option key={d.id} value={d.name} />)}
              </datalist>
              <datalist id="localities-list">
                {localities.map((l: any) => <option key={l.id} value={l.name} />)}
              </datalist>

              <div className="form-group">
                <label className="form-label">State</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Telangana"
                  list="states-list"
                  value={selectedState}
                  onChange={e => setSelectedState(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Hyderabad"
                  list="cities-list"
                  value={selectedCity}
                  onChange={e => setSelectedCity(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">District</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Medchal-Malkajgiri"
                  list="districts-list"
                  value={selectedDistrict}
                  onChange={e => setSelectedDistrict(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Locality / Area</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Banjara Hills, Chegunta"
                  list="localities-list"
                  value={selectedLocality}
                  onChange={e => setSelectedLocality(e.target.value)}
                />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">📍 Google Maps Link</label>
                <input
                  type="url"
                  className="form-input"
                  placeholder="Paste Google Maps link e.g. https://maps.app.goo.gl/..."
                  value={googleMapsUrl}
                  onChange={e => setGoogleMapsUrl(e.target.value)}
                />
              </div>
            </div>

            {/* Details */}
            <h3 className={styles.sectionHeading}>Property Attributes</h3>
            <div className={styles.grid}>

              {/* Datalists for attribute suggestions */}
              <datalist id="plot-sizes-list">
                {plotSizes.map((s: any) => <option key={s.id} value={s.name} />)}
              </datalist>
              <datalist id="facings-list">
                {facings.map(f => <option key={f} value={f} />)}
              </datalist>
              <datalist id="road-sizes-list">
                {roadSizes.map(r => <option key={r} value={r} />)}
              </datalist>

              <div className="form-group">
                <label className="form-label">Plot Size</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 200 Sq.Yd, 1000-2000 Sq.Ft."
                  list="plot-sizes-list"
                  value={plotSize}
                  onChange={e => setPlotSize(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Facing</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. East, North-East"
                  list="facings-list"
                  value={facing}
                  onChange={e => setFacing(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Road Size</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. 30 Feet, 40 Feet"
                  list="road-sizes-list"
                  value={roadSize}
                  onChange={e => setRoadSize(e.target.value)}
                />
              </div>
              <div className={`form-group ${styles.fullWidth}`}>
                <MultiSelect 
                  label="Layout Approval"
                  options={layouts} 
                  selectedValues={selectedLayouts} 
                  onChange={setSelectedLayouts}
                  columns={3}
                />
              </div>
            </div>

            {/* Price */}
            <h3 className={styles.sectionHeading}>Pricing</h3>
            <div className={styles.grid}>
              <div className="form-group">
                <label className="form-label">Total Price</label>
                <input type="text" className="form-input" placeholder="e.g. ₹45 Lakhs, 45,00,000, 1.2 Cr" value={totalPrice} onChange={e => setTotalPrice(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Price Per Sq.Yard (Optional)</label>
                <input type="text" className="form-input" placeholder="e.g. ₹5,000 per Sq.Yd" value={pricePerSqYard} onChange={e => setPricePerSqYard(e.target.value)} />
              </div>
              <div className="form-group">
                <label className={styles.radioLabel}>
                  <input type="checkbox" checked={isNegotiable} onChange={e => setIsNegotiable(e.target.checked)} />
                  Price is Negotiable
                </label>
              </div>
            </div>

            {/* Owner/Agent Details */}
            <h3 className={styles.sectionHeading}>Contact Details</h3>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}>
                <input type="radio" name="ownerType" value="Owner" checked={ownerType === "Owner"} onChange={() => setOwnerType("Owner")} /> Owner
              </label>
              <label className={styles.radioLabel}>
                <input type="radio" name="ownerType" value="Agent" checked={ownerType === "Agent"} onChange={() => setOwnerType("Agent")} /> Agent
              </label>
            </div>
            <div className={styles.grid} style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">{ownerType} Name</label>
                <input type="text" className="form-input" value={contactInfo.name} onChange={e => setContactInfo({...contactInfo, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input type="tel" className="form-input" value={contactInfo.mobile} onChange={e => setContactInfo({...contactInfo, mobile: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Email (Optional)</label>
                <input type="email" className="form-input" value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} />
              </div>
              {ownerType === "Owner" ? (
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-input" value={contactInfo.address} onChange={e => setContactInfo({...contactInfo, address: e.target.value})} />
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">Agency Name</label>
                    <input type="text" className="form-input" value={contactInfo.agency} onChange={e => setContactInfo({...contactInfo, agency: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">RERA Number (Optional)</label>
                    <input type="text" className="form-input" value={contactInfo.reraNumber} onChange={e => setContactInfo({...contactInfo, reraNumber: e.target.value})} />
                  </div>
                </>
              )}
            </div>



            {/* Media Upload */}
            <h3 className={styles.sectionHeading}>Media Uploads</h3>
            <div className={styles.uploadArea} onClick={() => fileInputRef.current?.click()}>
              <UploadCloud size={48} className={styles.uploadIcon} />
              <p>Click or drag to upload Images, Videos, or Documents</p>
              <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>JPG, PNG, WEBP, MP4, PDF</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                multiple 
                accept="image/*,video/mp4,application/pdf"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </div>
            {files.length > 0 && (
              <div className={styles.fileList}>
                {files.map((file, idx) => (
                  <div key={idx} className={styles.fileItem}>
                    <span>{file.name}</span>
                    <Trash2 size={16} className="text-error cursor-pointer" onClick={() => removeFile(idx)} style={{ cursor: 'pointer', color: 'red' }} />
                  </div>
                ))}
              </div>
            )}



            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
              {loading ? 'Saving to Database...' : 'Save Property'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
