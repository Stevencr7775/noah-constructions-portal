"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Building, Briefcase, Building2, CheckCircle2, ChevronRight, Upload, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RegisterPropertyPage() {
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<any>({
    // Seller base fields
    seller_name: '',
    seller_mobile: '',
    seller_email: '',
    seller_password: '',
    seller_confirmPassword: '',
    seller_address: '',
    seller_city: '',
    seller_state: 'Telangana',

    // Agent fields
    seller_agency: '',
    seller_reraNumber: '',
    seller_experience: '',

    // Builder / Corporate fields
    seller_companyName: '',
    seller_regNumber: '',
    seller_website: '',
    seller_contactPerson: '',
    seller_designation: '',
    seller_companySize: '',
    seller_businessReq: '',

    // Property base fields
    prop_purpose: 'Sale',
    prop_category: [],
    prop_state: 'Telangana',
    prop_city: 'Hyderabad',
    prop_district: '',
    prop_locality: '',
    prop_plotSize: '',
    prop_facing: '',
    prop_layout: [],
    prop_roadWidth: '',
    prop_totalPrice: '',
    prop_pricePerSqYard: '',
    prop_negotiable: 'false',
    prop_description: '',
    prop_amenities: [],
    prop_lat: '',
    prop_lng: '',
  });

  const [files, setFiles] = useState<File[]>([]);

  const handleInputChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      const isArrayField = ['prop_category', 'prop_layout', 'prop_amenities'].includes(name);
      if (isArrayField) {
        setFormData((prev: any) => {
          const currentArr = prev[name] as string[];
          if (checked) {
            return { ...prev, [name]: [...currentArr, value] };
          } else {
            return { ...prev, [name]: currentArr.filter(item => item !== value) };
          }
        });
      } else {
        setFormData({ ...formData, [name]: checked });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e: any) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole);
    setStep(2);
  };

  const validateSeller = () => {
    if (formData.seller_password !== formData.seller_confirmPassword) {
      alert("Passwords do not match!");
      return false;
    }
    // Simple checks can be added here
    return true;
  };

  const submitForm = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = new FormData();
    submitData.append('seller_type', role);
    
    Object.keys(formData).forEach(key => {
      if (Array.isArray(formData[key])) {
        formData[key].forEach((val: string) => submitData.append(key, val));
      } else {
        submitData.append(key, formData[key]);
      }
    });

    files.forEach(file => {
      submitData.append('media', file);
    });

    try {
      const res = await fetch('/api/register-property', {
        method: 'POST',
        body: submitData
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSuccessId(data.propertyId);
        setStep(4);
      } else {
        alert(data.error || 'Failed to submit property');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Role Selection
  if (step === 1) {
    return (
      <div className="container section-padding" style={{ maxWidth: '800px', margin: '0 auto', paddingTop: '120px' }}>
        <h1 className="section-title text-center">Select Your Profile</h1>
        <p className="text-center text-muted mb-8">Tell us who you are so we can tailor the registration process.</p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-6 text-center cursor-pointer" onClick={() => handleRoleSelect('OWNER')} style={{ cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid var(--border)' }}>
            <User size={48} className="mx-auto mb-4" style={{ margin: '0 auto', color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Individual Owner</h3>
            <p className="text-sm text-muted">I want to sell my own property.</p>
          </div>
          <div className="card p-6 text-center cursor-pointer" onClick={() => handleRoleSelect('AGENT')} style={{ cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid var(--border)' }}>
            <Briefcase size={48} className="mx-auto mb-4" style={{ margin: '0 auto', color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Real Estate Agent</h3>
            <p className="text-sm text-muted">I represent sellers and buyers.</p>
          </div>
          <div className="card p-6 text-center cursor-pointer" onClick={() => handleRoleSelect('BUILDER')} style={{ cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid var(--border)' }}>
            <Building size={48} className="mx-auto mb-4" style={{ margin: '0 auto', color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Builder / Developer</h3>
            <p className="text-sm text-muted">I represent a construction company.</p>
          </div>
          <div className="card p-6 text-center cursor-pointer" onClick={() => handleRoleSelect('CORPORATE')} style={{ cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid var(--border)' }}>
            <Building2 size={48} className="mx-auto mb-4" style={{ margin: '0 auto', color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>Corporate Entity</h3>
            <p className="text-sm text-muted">I represent an institutional seller.</p>
          </div>
        </div>
      </div>
    );
  }

  // Success Screen
  if (step === 4) {
    return (
      <div className="container section-padding text-center" style={{ paddingTop: '120px' }}>
        <CheckCircle2 size={80} className="mx-auto mb-6" style={{ margin: '0 auto', color: 'var(--success)' }} />
        <h1 className="section-title">Property Submitted Successfully!</h1>
        <p className="text-lg text-muted mb-4">Your Property ID is: <strong>{successId}</strong></p>
        <p className="mb-8">Your listing has been received and is pending approval by our team.</p>
        <button className="btn btn-primary" onClick={() => router.push('/sell-properties')}>Return to Selling</button>
      </div>
    );
  }

  return (
    <div className="container section-padding" style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '120px' }}>
      
      {/* Progress Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '3rem', gap: '1rem' }}>
        <div style={{ padding: '0.5rem 1rem', background: step === 2 ? 'var(--primary)' : 'var(--surface)', color: step === 2 ? 'white' : 'var(--text-muted)', borderRadius: '20px', fontWeight: 'bold', border: '1px solid var(--border)' }}>
          1. Seller Details
        </div>
        <ChevronRight className="text-muted" />
        <div style={{ padding: '0.5rem 1rem', background: step === 3 ? 'var(--primary)' : 'var(--surface)', color: step === 3 ? 'white' : 'var(--text-muted)', borderRadius: '20px', fontWeight: 'bold', border: '1px solid var(--border)' }}>
          2. Property Details
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <form onSubmit={step === 2 ? (e) => { e.preventDefault(); if(validateSeller()) setStep(3); } : submitForm}>
          
          {/* STEP 2: SELLER DETAILS */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="section-title" style={{ fontSize: '1.8rem' }}>{role} Registration</h2>
              <div className="grid grid-cols-2 gap-4">
                
                {/* Common Fields */}
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" name="seller_name" className="form-input" value={formData.seller_name} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Mobile Number</label>
                  <input type="tel" name="seller_mobile" className="form-input" value={formData.seller_mobile} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input type="email" name="seller_email" className="form-input" required value={formData.seller_email} onChange={handleInputChange} />
                </div>

                {/* Agent Fields */}
                {role === 'AGENT' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Agency Name</label>
                      <input type="text" name="seller_agency" className="form-input" value={formData.seller_agency} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">RERA Registration Number</label>
                      <input type="text" name="seller_reraNumber" className="form-input" value={formData.seller_reraNumber} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Years of Experience</label>
                      <input type="number" name="seller_experience" className="form-input" value={formData.seller_experience} onChange={handleInputChange} />
                    </div>
                  </>
                )}

                {/* Builder Fields */}
                {role === 'BUILDER' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Company Name</label>
                      <input type="text" name="seller_companyName" className="form-input" value={formData.seller_companyName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Registration Number</label>
                      <input type="text" name="seller_regNumber" className="form-input" value={formData.seller_regNumber} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Contact Person</label>
                      <input type="text" name="seller_contactPerson" className="form-input" value={formData.seller_contactPerson} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Website</label>
                      <input type="url" name="seller_website" className="form-input" value={formData.seller_website} onChange={handleInputChange} />
                    </div>
                  </>
                )}

                {/* Corporate Fields */}
                {role === 'CORPORATE' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Company Name</label>
                      <input type="text" name="seller_companyName" className="form-input" value={formData.seller_companyName} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Contact Person</label>
                      <input type="text" name="seller_contactPerson" className="form-input" value={formData.seller_contactPerson} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Designation</label>
                      <input type="text" name="seller_designation" className="form-input" value={formData.seller_designation} onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Company Size</label>
                      <input type="text" name="seller_companySize" className="form-input" value={formData.seller_companySize} onChange={handleInputChange} />
                    </div>
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="form-label">Business Requirement</label>
                      <textarea name="seller_businessReq" className="form-input" rows={2} value={formData.seller_businessReq} onChange={handleInputChange}></textarea>
                    </div>
                  </>
                )}

                {/* Location & Password */}
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Office / Residential Address</label>
                  <input type="text" name="seller_address" className="form-input" value={formData.seller_address} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input type="text" name="seller_city" className="form-input" value={formData.seller_city} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <select name="seller_state" className="form-input" value={formData.seller_state} onChange={handleInputChange}>
                    <option value="Telangana">Telangana</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input type="password" name="seller_password" className="form-input" required value={formData.seller_password} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <input type="password" name="seller_confirmPassword" className="form-input" required value={formData.seller_confirmPassword} onChange={handleInputChange} />
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
                <button type="submit" className="btn btn-primary">Continue to Property Details <ChevronRight size={18} /></button>
              </div>
            </div>
          )}


          {/* STEP 3: PROPERTY DETAILS */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="section-title" style={{ fontSize: '1.8rem' }}>Property Registration</h2>
              
              {/* Basic Details */}
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Basic Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Property Purpose</label>
                  <select name="prop_purpose" className="form-input" value={formData.prop_purpose} onChange={handleInputChange}>
                    <option value="Sale">Sale</option>
                    <option value="Development">Development</option>
                    <option value="Joint Development">Joint Development</option>
                    <option value="Ratio Development">Ratio Development</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Property Category</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
                    {['Residential', 'Commercial', 'Farm Land', 'Agricultural Land', 'Development'].map(cat => (
                      <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" name="prop_category" value={cat} checked={formData.prop_category.includes(cat)} onChange={handleInputChange} /> {cat}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location Details */}
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Location Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">State</label>
                  <select name="prop_state" className="form-input" value={formData.prop_state} onChange={handleInputChange}>
                    <option value="Telangana">Telangana</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input type="text" name="prop_city" className="form-input" value={formData.prop_city} onChange={handleInputChange} placeholder="e.g. Hyderabad" />
                </div>
                <div className="form-group">
                  <label className="form-label">District</label>
                  <select name="prop_district" className="form-input" value={formData.prop_district} onChange={handleInputChange}>
                    <option value="">Select District</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Medchal-Malkajgiri">Medchal–Malkajgiri</option>
                    <option value="Rangareddy">Rangareddy</option>
                    <option value="Sangareddy">Sangareddy</option>
                    <option value="Vikarabad">Vikarabad</option>
                    <option value="Yadadri Bhuvanagiri">Yadadri Bhuvanagiri</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Locality</label>
                  <input type="text" name="prop_locality" className="form-input" placeholder="Type locality (e.g. Banjara Hills)" value={formData.prop_locality} onChange={handleInputChange} />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Latitude</label>
                  <input type="number" step="any" name="prop_lat" className="form-input" placeholder="e.g. 17.3850" value={formData.prop_lat} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Longitude</label>
                  <input type="number" step="any" name="prop_lng" className="form-input" placeholder="e.g. 78.4867" value={formData.prop_lng} onChange={handleInputChange} />
                </div>
              </div>

              {/* Property Specs */}
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Property Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Plot Size</label>
                  <select name="prop_plotSize" className="form-input" value={formData.prop_plotSize} onChange={handleInputChange}>
                    <option value="">Select Size</option>
                    <option value="Below 500 Sq.Ft.">Below 500 Sq.Ft.</option>
                    <option value="500-1000 Sq.Ft.">500–1000 Sq.Ft.</option>
                    <option value="1000-2000 Sq.Ft.">1000–2000 Sq.Ft.</option>
                    <option value="2000-4000 Sq.Ft.">2000–4000 Sq.Ft.</option>
                    <option value="Above 4000 Sq.Ft.">Above 4000 Sq.Ft.</option>
                    <option value="1-10 Acres">1–10 Acres</option>
                    <option value="10-100 Acres">10–100 Acres</option>
                    <option value="100-500 Acres">100–500 Acres</option>
                    <option value="500-1000 Acres">500–1000 Acres</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Facing</label>
                  <select name="prop_facing" className="form-input" value={formData.prop_facing} onChange={handleInputChange}>
                    <option value="">Select Facing</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="North-East">North-East</option>
                    <option value="North-West">North-West</option>
                    <option value="South-East">South-East</option>
                    <option value="South-West">South-West</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Road Width</label>
                  <select name="prop_roadWidth" className="form-input" value={formData.prop_roadWidth} onChange={handleInputChange}>
                    <option value="">Select Road Width</option>
                    <option value="20 Feet">20 Feet</option>
                    <option value="30 Feet">30 Feet</option>
                    <option value="33 Feet">33 Feet</option>
                    <option value="40 Feet">40 Feet</option>
                    <option value="50 Feet">50 Feet</option>
                    <option value="60 Feet">60 Feet</option>
                    <option value="80 Feet">80 Feet</option>
                    <option value="100 Feet">100 Feet</option>
                    <option value="120 Feet">120 Feet</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Layout Approval</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.5rem' }}>
                    {['HMDA', 'DTCP', 'GHMC', 'Municipal', 'Panchayat', 'Open Layout', 'Gated Community', 'Venture Layout'].map(layout => (
                      <label key={layout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input type="checkbox" name="prop_layout" value={layout} checked={formData.prop_layout.includes(layout)} onChange={handleInputChange} /> {layout}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Pricing Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Total Price (₹)</label>
                  <input type="number" name="prop_totalPrice" className="form-input" value={formData.prop_totalPrice} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Price Per Square Yard (₹)</label>
                  <input type="number" name="prop_pricePerSqYard" className="form-input" value={formData.prop_pricePerSqYard} onChange={handleInputChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Negotiable</label>
                  <select name="prop_negotiable" className="form-input" value={formData.prop_negotiable} onChange={handleInputChange}>
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
              </div>

              {/* Description & Amenities */}
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Additional Information</h3>
              <div className="form-group">
                <label className="form-label">Property Description</label>
                <textarea name="prop_description" rows={4} className="form-input" placeholder="Describe the property, highlights, and nearby landmarks..." value={formData.prop_description} onChange={handleInputChange}></textarea>
              </div>
              <div className="form-group">
                <label className="form-label">Amenities</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                  {['Electricity', 'Water Connection', 'Compound Wall', 'Corner Plot', 'Ready to Register', 'Loan Available', 'Highway Facing', 'Park Facing', 'Lake View'].map(amenity => (
                    <label key={amenity} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" name="prop_amenities" value={amenity} checked={formData.prop_amenities.includes(amenity)} onChange={handleInputChange} /> {amenity}
                    </label>
                  ))}
                </div>
              </div>

              {/* Media Upload */}
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginTop: '2rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>Media Upload</h3>
              <div className="form-group">
                <div style={{ border: '2px dashed var(--border)', padding: '2rem', borderRadius: '8px', textAlign: 'center', background: 'var(--background)' }}>
                  <Upload size={32} className="mx-auto mb-2 text-muted" style={{ margin: '0 auto' }} />
                  <p className="mb-4">Upload Images, Videos, or Documents (JPG, PNG, WEBP, MP4, PDF)</p>
                  <input type="file" multiple accept="image/*,video/mp4,application/pdf" onChange={handleFileChange} className="form-input" style={{ maxWidth: '300px', margin: '0 auto' }} />
                  {files.length > 0 && (
                    <p className="mt-4 text-success font-bold">{files.length} file(s) selected.</p>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>Back to Seller Details</button>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Property'}
                </button>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
