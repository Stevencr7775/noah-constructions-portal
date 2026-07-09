"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Send } from "lucide-react";

export default function NewPropertyWizard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    propertyType: "Residential Plot",
    purpose: "Sale",
    category: "Residential",
    ownershipType: "Freehold",
    pricePerSqYard: "",
    totalPrice: "",
    isNegotiable: false,
    description: "",
    state: "Telangana",
    city: "",
    district: "",
    locality: "",
    address: "",
    latitude: "",
    longitude: "",
    squareYards: "",
    facing: "East",
    roadSize: "",
    cornerPlot: false,
    boundaryWall: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      status: isDraft ? 'Draft' : 'Pending Review',
      totalPrice: formData.totalPrice ? parseFloat(formData.totalPrice) : null,
      pricePerSqYard: formData.pricePerSqYard ? parseFloat(formData.pricePerSqYard) : null,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      squareYards: formData.squareYards ? parseFloat(formData.squareYards) : null,
    };

    try {
      const res = await fetch("/api/properties/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      
      if (data.success) {
        router.push("/seller/properties");
      } else {
        alert("Error saving property: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container section-padding" style={{ paddingTop: "120px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 className="section-title text-primary mb-6">List New Property</h1>
      
      <form className="space-y-8" onSubmit={(e) => handleSubmit(e, false)}>
        {/* Basic Info */}
        <div className="card" style={{ padding: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>Basic Information</h2>
          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Property Title *</label>
              <input type="text" name="title" required className="form-input" value={formData.title} onChange={handleChange} placeholder="e.g. Premium Corner Plot in Jubilee Hills" />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Property Type</label>
                <select name="propertyType" className="form-input" value={formData.propertyType} onChange={handleChange}>
                  <option>Residential Plot</option>
                  <option>Commercial Plot</option>
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>Independent House</option>
                  <option>Agricultural Land</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Purpose</label>
                <select name="purpose" className="form-input" value={formData.purpose} onChange={handleChange}>
                  <option>Sale</option>
                  <option>Resale</option>
                  <option>Rent</option>
                  <option>Joint Venture</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Total Price (₹)</label>
                <input type="number" name="totalPrice" required className="form-input" value={formData.totalPrice} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Price per Sq.Yard</label>
                <input type="number" name="pricePerSqYard" className="form-input" value={formData.pricePerSqYard} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea name="description" className="form-input" rows={4} value={formData.description} onChange={handleChange} placeholder="Detailed description of the property..." />
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="card" style={{ padding: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>Location Details</h2>
          <div className="space-y-4">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">City *</label>
                <input type="text" name="city" required className="form-input" value={formData.city} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Locality *</label>
                <input type="text" name="locality" required className="form-input" value={formData.locality} onChange={handleChange} />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Complete Address</label>
              <input type="text" name="address" className="form-input" value={formData.address} onChange={handleChange} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Latitude</label>
                <input type="number" step="any" name="latitude" className="form-input" value={formData.latitude} onChange={handleChange} placeholder="17.3850" />
              </div>
              <div className="form-group">
                <label className="form-label">Longitude</label>
                <input type="number" step="any" name="longitude" className="form-input" value={formData.longitude} onChange={handleChange} placeholder="78.4867" />
              </div>
            </div>
          </div>
        </div>

        {/* Land Details */}
        <div className="card" style={{ padding: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>Property/Land Details</h2>
          <div className="space-y-4">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div className="form-group">
                <label className="form-label">Size (Sq. Yards)</label>
                <input type="number" name="squareYards" className="form-input" value={formData.squareYards} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Facing</label>
                <select name="facing" className="form-input" value={formData.facing} onChange={handleChange}>
                  <option>East</option>
                  <option>West</option>
                  <option>North</option>
                  <option>South</option>
                  <option>North-East</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "2rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input type="checkbox" name="cornerPlot" checked={formData.cornerPlot} onChange={handleChange} />
                Corner Plot
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input type="checkbox" name="boundaryWall" checked={formData.boundaryWall} onChange={handleChange} />
                Boundary Wall
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
          <button type="button" onClick={(e) => handleSubmit(e, true)} className="btn btn-outline" disabled={loading} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Save size={18} /> Save as Draft
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Send size={18} /> Submit for Approval
          </button>
        </div>
      </form>
    </div>
  );
}
