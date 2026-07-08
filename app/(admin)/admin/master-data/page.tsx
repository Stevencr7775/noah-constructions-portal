"use client";

import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";

type MasterItem = { id: string; name: string; stateId?: string; cityId?: string; districtId?: string };

export default function MasterDataAdmin() {
  const [data, setData] = useState<Record<string, MasterItem[]>>({});
  const [loading, setLoading] = useState(true);

  // Forms State
  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");
  const [cityStateId, setCityStateId] = useState("");
  
  const [districtName, setDistrictName] = useState("");
  const [districtCityId, setDistrictCityId] = useState("");
  
  const [localityName, setLocalityName] = useState("");
  const [localityDistrictId, setLocalityDistrictId] = useState("");
  
  const [categoryName, setCategoryName] = useState("");
  const [plotSizeName, setPlotSizeName] = useState("");
  const [layoutName, setLayoutName] = useState("");
  const [preferenceName, setPreferenceName] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/master-data");
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (type: string, payload: any) => {
    try {
      const res = await fetch("/api/master-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...payload })
      });
      if (res.ok) {
        alert("Added successfully!");
        fetchData();
        // Clear fields
        if (type === 'state') setStateName("");
        if (type === 'city') setCityName("");
        if (type === 'district') setDistrictName("");
        if (type === 'locality') setLocalityName("");
        if (type === 'propertyCategory') setCategoryName("");
        if (type === 'plotSize') setPlotSizeName("");
        if (type === 'layoutApproval') setLayoutName("");
        if (type === 'additionalPreference') setPreferenceName("");
      } else {
        const error = await res.json();
        alert(`Failed: ${error.error}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error saving data");
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading Master Data...</div>;

  return (
    <div style={{ padding: '4rem 2rem', backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 className="section-title text-primary" style={{ marginBottom: '1rem' }}>Master Data Management</h1>
        <p className="text-muted" style={{ marginBottom: '3rem' }}>Add new entries to the database dropdowns. This replaces the old mock data.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* Location Data */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Location Hierarchy</h3>
            
            <div style={{ marginBottom: '2rem' }}>
              <label className="form-label">Add State</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" className="form-input" value={stateName} onChange={(e) => setStateName(e.target.value)} placeholder="e.g. Telangana" />
                <button className="btn btn-primary" onClick={() => handleSubmit('state', { name: stateName })}><PlusCircle size={20} /></button>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label className="form-label">Add City</label>
              <select className="form-input" style={{ marginBottom: '0.5rem' }} value={cityStateId} onChange={(e) => setCityStateId(e.target.value)}>
                <option value="">Select State...</option>
                {data.states?.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" className="form-input" value={cityName} onChange={(e) => setCityName(e.target.value)} placeholder="e.g. Hyderabad" />
                <button className="btn btn-primary" onClick={() => handleSubmit('city', { name: cityName, stateId: cityStateId })}><PlusCircle size={20} /></button>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label className="form-label">Add District</label>
              <select className="form-input" style={{ marginBottom: '0.5rem' }} value={districtCityId} onChange={(e) => setDistrictCityId(e.target.value)}>
                <option value="">Select City...</option>
                {data.cities?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" className="form-input" value={districtName} onChange={(e) => setDistrictName(e.target.value)} placeholder="e.g. Rangareddy" />
                <button className="btn btn-primary" onClick={() => handleSubmit('district', { name: districtName, cityId: districtCityId })}><PlusCircle size={20} /></button>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label className="form-label">Add Locality</label>
              <select className="form-input" style={{ marginBottom: '0.5rem' }} value={localityDistrictId} onChange={(e) => setLocalityDistrictId(e.target.value)}>
                <option value="">Select District...</option>
                {data.districts?.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" className="form-input" value={localityName} onChange={(e) => setLocalityName(e.target.value)} placeholder="e.g. Banjara Hills" />
                <button className="btn btn-primary" onClick={() => handleSubmit('locality', { name: localityName, districtId: localityDistrictId })}><PlusCircle size={20} /></button>
              </div>
            </div>

          </div>

          {/* Property Metadata */}
          <div className="card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}>Property Properties</h3>

            <div style={{ marginBottom: '2rem' }}>
              <label className="form-label">Add Category</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" className="form-input" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="e.g. Residential" />
                <button className="btn btn-primary" onClick={() => handleSubmit('propertyCategory', { name: categoryName })}><PlusCircle size={20} /></button>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label className="form-label">Add Plot Size Range</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" className="form-input" value={plotSizeName} onChange={(e) => setPlotSizeName(e.target.value)} placeholder="e.g. 500-1000 Sq. Ft." />
                <button className="btn btn-primary" onClick={() => handleSubmit('plotSize', { name: plotSizeName })}><PlusCircle size={20} /></button>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label className="form-label">Add Layout Approval</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" className="form-input" value={layoutName} onChange={(e) => setLayoutName(e.target.value)} placeholder="e.g. HMDA Approved" />
                <button className="btn btn-primary" onClick={() => handleSubmit('layoutApproval', { name: layoutName })}><PlusCircle size={20} /></button>
              </div>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label className="form-label">Add Additional Preference</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" className="form-input" value={preferenceName} onChange={(e) => setPreferenceName(e.target.value)} placeholder="e.g. Corner Plot" />
                <button className="btn btn-primary" onClick={() => handleSubmit('additionalPreference', { name: preferenceName })}><PlusCircle size={20} /></button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
