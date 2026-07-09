"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Settings, Save, Globe, Phone, Share2, Search } from "lucide-react";

// Reuse the same sidebar links
const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: <Settings size={20} /> }, // Simplified for snippet
  { label: "Settings", href: "/admin/settings", icon: <Settings size={20} /> },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (group: string, keysToSave: string[]) => {
    setSaving(true);
    try {
      const payload = keysToSave.reduce((acc, key) => {
        if (settings[key] !== undefined) acc[key] = settings[key];
        return acc;
      }, {} as Record<string, string>);

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group, settings: payload })
      });
      
      const data = await res.json();
      if (data.success) {
        alert("Settings saved successfully!");
      }
    } catch (err) {
      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <DashboardLayout role="ADMIN" links={sidebarLinks}><div style={{ padding: "2rem" }}>Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout role="ADMIN" links={sidebarLinks}>
      <h1 className="section-title text-primary mb-6" style={{ fontSize: "1.75rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Settings size={28} /> Global Website Settings
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
        
        {/* General Settings */}
        <div className="card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Globe size={20} color="var(--primary)" /> General Settings
            </h2>
            <button 
              className="btn btn-primary" 
              onClick={() => handleSave('General', ['companyName', 'contactEmail', 'supportEmail', 'officeHours'])}
              disabled={saving}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem" }}
            >
              <Save size={16} /> Save General
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Company Name</label>
              <input type="text" className="form-input" value={settings.companyName || ''} onChange={e => handleChange('companyName', e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Office Hours</label>
              <input type="text" className="form-input" value={settings.officeHours || ''} onChange={e => handleChange('officeHours', e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Sales Email</label>
              <input type="email" className="form-input" value={settings.contactEmail || ''} onChange={e => handleChange('contactEmail', e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Support Email</label>
              <input type="email" className="form-input" value={settings.supportEmail || ''} onChange={e => handleChange('supportEmail', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Contact & Location */}
        <div className="card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Phone size={20} color="var(--primary)" /> Contact Details
            </h2>
            <button 
              className="btn btn-primary" 
              onClick={() => handleSave('Contact', ['primaryPhone', 'whatsappNumber', 'headOfficeAddress'])}
              disabled={saving}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem" }}
            >
              <Save size={16} /> Save Contact
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Primary Phone</label>
              <input type="text" className="form-input" value={settings.primaryPhone || ''} onChange={e => handleChange('primaryPhone', e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>WhatsApp Number</label>
              <input type="text" className="form-input" value={settings.whatsappNumber || ''} onChange={e => handleChange('whatsappNumber', e.target.value)} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Head Office Address</label>
              <textarea className="form-input" rows={3} value={settings.headOfficeAddress || ''} onChange={e => handleChange('headOfficeAddress', e.target.value)}></textarea>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Share2 size={20} color="var(--primary)" /> Social Media Links
            </h2>
            <button 
              className="btn btn-primary" 
              onClick={() => handleSave('Social', ['facebookUrl', 'instagramUrl', 'linkedinUrl', 'youtubeUrl', 'twitterUrl'])}
              disabled={saving}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem" }}
            >
              <Save size={16} /> Save Socials
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Facebook URL</label>
              <input type="url" className="form-input" value={settings.facebookUrl || ''} onChange={e => handleChange('facebookUrl', e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Instagram URL</label>
              <input type="url" className="form-input" value={settings.instagramUrl || ''} onChange={e => handleChange('instagramUrl', e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>LinkedIn URL</label>
              <input type="url" className="form-input" value={settings.linkedinUrl || ''} onChange={e => handleChange('linkedinUrl', e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>YouTube URL</label>
              <input type="url" className="form-input" value={settings.youtubeUrl || ''} onChange={e => handleChange('youtubeUrl', e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Twitter / X URL</label>
              <input type="url" className="form-input" value={settings.twitterUrl || ''} onChange={e => handleChange('twitterUrl', e.target.value)} />
            </div>
          </div>
        </div>

        {/* SEO Defaults */}
        <div className="card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Search size={20} color="var(--primary)" /> Global SEO Defaults
            </h2>
            <button 
              className="btn btn-primary" 
              onClick={() => handleSave('SEO', ['seoMetaTitle', 'seoMetaDesc', 'seoKeywords'])}
              disabled={saving}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem" }}
            >
              <Save size={16} /> Save SEO
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Default Meta Title</label>
              <input type="text" className="form-input" value={settings.seoMetaTitle || ''} onChange={e => handleChange('seoMetaTitle', e.target.value)} />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Default Meta Description</label>
              <textarea className="form-input" rows={2} value={settings.seoMetaDesc || ''} onChange={e => handleChange('seoMetaDesc', e.target.value)}></textarea>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Keywords (comma separated)</label>
              <input type="text" className="form-input" value={settings.seoKeywords || ''} onChange={e => handleChange('seoKeywords', e.target.value)} />
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
