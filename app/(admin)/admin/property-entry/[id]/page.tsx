"use client";

import { useState, useRef, useEffect } from "react";
import { UploadCloud, CheckCircle2, Trash2, ArrowLeft } from "lucide-react";
import styles from "../page.module.css";
import MultiSelect from "@/components/ui/MultiSelect";
import Link from "next/link";
import { useParams } from "next/navigation";

const purposes = ["Sale", "Development", "Joint Development", "Ratio Development"];
const facings = ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West"];
const roadSizes = ["20 Feet", "30 Feet", "33 Feet", "40 Feet", "50 Feet", "60 Feet", "80 Feet", "100 Feet", "120 Feet"];
const statuses = ["Available", "Booked", "Sold", "Under Negotiation", "Development", "Hidden", "Pending Approval"];
const masterAmenities = [
  { id: "am1", name: "Electricity" }, { id: "am2", name: "Water Connection" },
  { id: "am3", name: "Compound Wall" }, { id: "am4", name: "Corner Plot" },
  { id: "am5", name: "Ready to Register" }, { id: "am6", name: "Loan Facility" },
  { id: "am7", name: "Park Facing" }, { id: "am8", name: "Lake View" },
  { id: "am9", name: "Highway Facing" }
];

export default function PropertyEditor() {
  const params = useParams();
  const propertyId = params?.id as string;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Master Data
  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [localities, setLocalities] = useState<any[]>([]);
  const [layouts, setLayouts] = useState<any[]>([]);
  const [propertyCategories, setPropertyCategories] = useState<any[]>([]);
  const [plotSizes, setPlotSizes] = useState<any[]>([]);

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
  const [existingMedia, setExistingMedia] = useState<any[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Fetch master data and property in parallel
    Promise.all([
      fetch("/api/master-data").then(r => r.json()),
      fetch(`/api/admin/properties/${propertyId}`).then(r => r.json())
    ]).then(([masterJson, propJson]) => {
      if (masterJson.success) {
        setStates(masterJson.data.states || []);
        setCities(masterJson.data.cities || []);
        setDistricts(masterJson.data.districts || []);
        setLocalities(masterJson.data.localities || []);
        setLayouts(masterJson.data.layoutApprovals || []);
        setPropertyCategories(masterJson.data.propertyCategories || []);
        setPlotSizes(masterJson.data.plotSizes || []);
      }

      if (propJson.property) {
        const p = propJson.property;
        setPurpose(p.purpose || purposes[0]);
        setCategory(p.category || "");
        setDevelopmentRatio(p.developmentRatio || "");
        setSelectedState(p.state || "");
        setSelectedCity(p.city || "");
        setSelectedDistrict(p.district || "");
        setSelectedLocality(p.locality || "");
        setGoogleMapsUrl(p.googleMapsUrl || "");
        setPlotSize(p.plotSize || "");
        setFacing(p.facing || "");
        setRoadSize(p.roadSize || "");
        setTotalPrice(p.totalPrice ? String(p.totalPrice) : "");
        setPricePerSqYard(p.pricePerSqYard ? String(p.pricePerSqYard) : "");
        setIsNegotiable(p.isNegotiable || false);
        setDescription(p.description || "");
        setStatus(p.status || statuses[0]);
        setIsFeatured(p.isFeatured || false);
        setExistingMedia(p.media || []);

        // Parse JSON amenities/layouts
        try {
          const amenityNames: string[] = JSON.parse(p.amenities || "[]");
          setSelectedAmenities(
            amenityNames.map(name => masterAmenities.find(a => a.name === name)?.id || "").filter(Boolean)
          );
        } catch {}

        try {
          const layoutNames: string[] = JSON.parse(p.layoutApprovals || "[]");
          setSelectedLayouts(layoutNames); // store names directly since we use names in payload
        } catch {}

        // Contact
        if (p.seller) {
          setOwnerType(p.seller.type === "AGENT" ? "Agent" : "Owner");
          setContactInfo({
            name: p.seller.name || "",
            mobile: p.seller.mobile || "",
            email: p.seller.email || "",
            address: p.seller.address || "",
            agency: p.seller.agency || "",
            reraNumber: p.seller.reraNumber || "",
          });
        }
      }
    }).finally(() => setFetching(false));
  }, [propertyId]);

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
      // Upload new files
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

      const payload = {
        purpose,
        category,
        state: selectedState,
        city: selectedCity,
        district: selectedDistrict,
        locality: selectedLocality,
        plotSize,
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
        layoutApprovals: selectedLayouts,
        amenities: selectedAmenities.map(id => masterAmenities.find(a => a.id === id)?.name),
        ownerType,
        ownerDetails: ownerType === 'Owner' ? contactInfo : null,
        agentDetails: ownerType === 'Agent' ? contactInfo : null,
        mediaFiles: uploadedMedia
      };

      const res = await fetch(`/api/admin/properties/${propertyId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        if (uploadFailed) {
          alert("Property updated! However, some new media uploads failed.");
        } else {
          alert("Property updated successfully!");
        }
        router.push('/admin/properties');
      } else {
        alert("Error updating property: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Update failed.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className={styles.pageWrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading property data...</p>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className={styles.pageWrapper} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className={styles.formCard} style={{ textAlign: 'center' }}>
          <CheckCircle2 size={64} style={{ color: 'green', margin: '0 auto 1rem' }} />
          <h2 className="section-title">Property Updated Successfully</h2>
          <p className="text-muted" style={{ marginBottom: '1.5rem' }}>All changes have been saved to the database.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/admin/properties" className="btn btn-outline">← Back to Properties</Link>
            <button className="btn btn-primary" onClick={() => setIsSubmitted(false)}>Continue Editing</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.formCard}>
          <div className={styles.header}>
            <Link href="/admin/properties" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', marginBottom: '1rem', textDecoration: 'none', fontWeight: 500 }}>
              <ArrowLeft size={18} /> Back to Properties
            </Link>
            <h1 className={styles.title}>Edit Property</h1>
            <p className="text-muted">Update the property details below.</p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Basic Info */}
            <h3 className={styles.sectionHeading}>Basic Information</h3>
            <div className={styles.grid}>
              <div className="form-group">
                <label className="form-label">Property Purpose</label>
                <input type="text" className="form-input" list="purposes-list" value={purpose} onChange={e => setPurpose(e.target.value)} />
                <datalist id="purposes-list">{purposes.map(p => <option key={p} value={p} />)}</datalist>
              </div>
              <div className="form-group">
                <label className="form-label">Property Category</label>
                <input type="text" className="form-input" list="categories-list" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Residential, Commercial" />
                <datalist id="categories-list">{propertyCategories.map((c: any) => <option key={c.id} value={c.name} />)}</datalist>
              </div>
              {['Joint Development', 'Ratio Development'].includes(purpose) && (
                <div className="form-group">
                  <label className="form-label">Development Ratio (Owner : Builder)</label>
                  <input type="text" className="form-input" placeholder="e.g. 60:40 or 50:50" value={developmentRatio} onChange={e => setDevelopmentRatio(e.target.value)} />
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Enter as Owner share : Builder share</p>
                </div>
              )}
            </div>

            {/* Location */}
            <h3 className={styles.sectionHeading}>Location Details</h3>
            <div className={styles.grid}>
              <datalist id="states-list">{states.map((s: any) => <option key={s.id} value={s.name} />)}</datalist>
              <datalist id="cities-list">{cities.map((c: any) => <option key={c.id} value={c.name} />)}</datalist>
              <datalist id="districts-list">{districts.map((d: any) => <option key={d.id} value={d.name} />)}</datalist>
              <datalist id="localities-list">{localities.map((l: any) => <option key={l.id} value={l.name} />)}</datalist>

              <div className="form-group">
                <label className="form-label">State</label>
                <input type="text" className="form-input" list="states-list" placeholder="e.g. Telangana" value={selectedState} onChange={e => setSelectedState(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input type="text" className="form-input" list="cities-list" placeholder="e.g. Hyderabad" value={selectedCity} onChange={e => setSelectedCity(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">District</label>
                <input type="text" className="form-input" list="districts-list" placeholder="e.g. Medchal-Malkajgiri" value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Locality / Area</label>
                <input type="text" className="form-input" list="localities-list" placeholder="e.g. Banjara Hills" value={selectedLocality} onChange={e => setSelectedLocality(e.target.value)} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label">📍 Google Maps Link</label>
                <input type="url" className="form-input" placeholder="Paste Google Maps link" value={googleMapsUrl} onChange={e => setGoogleMapsUrl(e.target.value)} />
              </div>
            </div>

            {/* Property Attributes */}
            <h3 className={styles.sectionHeading}>Property Attributes</h3>
            <div className={styles.grid}>
              <datalist id="plot-sizes-list">{plotSizes.map((s: any) => <option key={s.id} value={s.name} />)}</datalist>
              <datalist id="facings-list">{facings.map(f => <option key={f} value={f} />)}</datalist>
              <datalist id="road-sizes-list">{roadSizes.map(r => <option key={r} value={r} />)}</datalist>

              <div className="form-group">
                <label className="form-label">Plot Size</label>
                <input type="text" className="form-input" list="plot-sizes-list" placeholder="e.g. 200 Sq.Yd" value={plotSize} onChange={e => setPlotSize(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Facing</label>
                <input type="text" className="form-input" list="facings-list" placeholder="e.g. East" value={facing} onChange={e => setFacing(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Road Size</label>
                <input type="text" className="form-input" list="road-sizes-list" placeholder="e.g. 30 Feet" value={roadSize} onChange={e => setRoadSize(e.target.value)} />
              </div>
              <div className={`form-group ${styles.fullWidth}`}>
                <MultiSelect label="Layout Approval" options={layouts} selectedValues={selectedLayouts} onChange={setSelectedLayouts} columns={3} />
              </div>
            </div>

            {/* Pricing */}
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

            {/* Status */}
            <h3 className={styles.sectionHeading}>Status & Visibility</h3>
            <div className={styles.grid}>
              <div className="form-group">
                <label className="form-label">Status</label>
                <input type="text" className="form-input" list="statuses-list" value={status} onChange={e => setStatus(e.target.value)} />
                <datalist id="statuses-list">{statuses.map(s => <option key={s} value={s} />)}</datalist>
              </div>
              <div className="form-group">
                <label className="form-label">Description / Notes</label>
                <textarea className="form-input" rows={3} placeholder="Any additional details..." value={description} onChange={e => setDescription(e.target.value)} style={{ resize: 'vertical' }} />
              </div>
              <div className="form-group">
                <label className={styles.radioLabel}>
                  <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} />
                  Featured Property (shown on homepage)
                </label>
              </div>
            </div>

            {/* Contact */}
            <h3 className={styles.sectionHeading}>Contact Details</h3>
            <div className={styles.radioGroup}>
              <label className={styles.radioLabel}><input type="radio" name="ownerType" value="Owner" checked={ownerType === "Owner"} onChange={() => setOwnerType("Owner")} /> Owner</label>
              <label className={styles.radioLabel}><input type="radio" name="ownerType" value="Agent" checked={ownerType === "Agent"} onChange={() => setOwnerType("Agent")} /> Agent</label>
            </div>
            <div className={styles.grid} style={{ marginTop: '1rem' }}>
              <div className="form-group">
                <label className="form-label">{ownerType} Name</label>
                <input type="text" className="form-input" value={contactInfo.name} onChange={e => setContactInfo({ ...contactInfo, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Mobile Number</label>
                <input type="tel" className="form-input" value={contactInfo.mobile} onChange={e => setContactInfo({ ...contactInfo, mobile: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Email (Optional)</label>
                <input type="email" className="form-input" value={contactInfo.email} onChange={e => setContactInfo({ ...contactInfo, email: e.target.value })} />
              </div>
              {ownerType === "Owner" ? (
                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input type="text" className="form-input" value={contactInfo.address} onChange={e => setContactInfo({ ...contactInfo, address: e.target.value })} />
                </div>
              ) : (
                <>
                  <div className="form-group">
                    <label className="form-label">Agency Name</label>
                    <input type="text" className="form-input" value={contactInfo.agency} onChange={e => setContactInfo({ ...contactInfo, agency: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">RERA Number (Optional)</label>
                    <input type="text" className="form-input" value={contactInfo.reraNumber} onChange={e => setContactInfo({ ...contactInfo, reraNumber: e.target.value })} />
                  </div>
                </>
              )}
            </div>

            {/* Existing Media */}
            {existingMedia.length > 0 && (
              <>
                <h3 className={styles.sectionHeading}>Existing Media</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                  {existingMedia.map((m: any, idx: number) => (
                    <div key={idx} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                      {m.type === 'IMAGE' ? (
                        <img src={m.url} alt="media" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', background: 'var(--surface)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {m.type}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* New Media Upload */}
            <h3 className={styles.sectionHeading}>Upload New Media</h3>
            <div className={styles.uploadArea} onClick={() => fileInputRef.current?.click()}>
              <UploadCloud size={48} className={styles.uploadIcon} />
              <p>Click or drag to upload new Images, Videos, or Documents</p>
              <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>JPG, PNG, WEBP, MP4, PDF</p>
              <input type="file" ref={fileInputRef} multiple accept="image/*,video/mp4,application/pdf" onChange={handleFileChange} style={{ display: 'none' }} />
            </div>
            {files.length > 0 && (
              <div className={styles.fileList}>
                {files.map((file, idx) => (
                  <div key={idx} className={styles.fileItem}>
                    <span>{file.name}</span>
                    <Trash2 size={16} onClick={() => removeFile(idx)} style={{ cursor: 'pointer', color: 'red' }} />
                  </div>
                ))}
              </div>
            )}

            <button type="submit" className={`btn btn-primary ${styles.submitBtn}`} disabled={loading}>
              {loading ? 'Saving Changes...' : '💾 Save Changes'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
