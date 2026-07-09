"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { LayoutTemplate, Save, Image as ImageIcon, Type, Layout } from "lucide-react";

// Reuse the same sidebar links
const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: <LayoutTemplate size={20} /> },
  { label: "Settings", href: "/admin/settings", icon: <LayoutTemplate size={20} /> },
];

export default function HomepageCMS() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings?group=Homepage')
      .then(res => res.json())
      .then(data => {
        if (!data.error) setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (keysToSave: string[]) => {
    setSaving(true);
    try {
      const payload = keysToSave.reduce((acc, key) => {
        if (settings[key] !== undefined) acc[key] = settings[key];
        return acc;
      }, {} as Record<string, string>);

      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ group: 'Homepage', settings: payload })
      });
      
      const data = await res.json();
      if (data.success) {
        alert("Homepage settings saved successfully!");
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
        <LayoutTemplate size={28} /> Homepage Content Management
      </h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
        
        {/* Hero Banner Section */}
        <div className="card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ImageIcon size={20} color="var(--primary)" /> Hero Banner
            </h2>
            <button 
              className="btn btn-primary" 
              onClick={() => handleSave(['heroHeadline', 'heroSubheading', 'heroVideoUrl', 'heroImageUrl', 'heroCtaText', 'heroCtaLink'])}
              disabled={saving}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem" }}
            >
              <Save size={16} /> Save Hero Section
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Headline (H1)</label>
              <input type="text" className="form-input" value={settings.heroHeadline || ''} onChange={e => handleChange('heroHeadline', e.target.value)} placeholder="e.g., Find Your Dream Home" />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Sub Heading</label>
              <textarea className="form-input" rows={2} value={settings.heroSubheading || ''} onChange={e => handleChange('heroSubheading', e.target.value)} placeholder="e.g., We build trust, not just homes..."></textarea>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Hero Image URL (Fallback)</label>
              <input type="url" className="form-input" value={settings.heroImageUrl || ''} onChange={e => handleChange('heroImageUrl', e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Hero Video URL (Background)</label>
              <input type="url" className="form-input" value={settings.heroVideoUrl || ''} onChange={e => handleChange('heroVideoUrl', e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>CTA Button Text</label>
              <input type="text" className="form-input" value={settings.heroCtaText || ''} onChange={e => handleChange('heroCtaText', e.target.value)} placeholder="e.g., Explore Projects" />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>CTA Button Link</label>
              <input type="text" className="form-input" value={settings.heroCtaLink || ''} onChange={e => handleChange('heroCtaLink', e.target.value)} placeholder="e.g., /projects" />
            </div>
          </div>
        </div>

        {/* Announcement Bar */}
        <div className="card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Type size={20} color="var(--primary)" /> Scrolling Announcement
            </h2>
            <button 
              className="btn btn-primary" 
              onClick={() => handleSave(['announcementText', 'announcementLink', 'announcementEnabled'])}
              disabled={saving}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem" }}
            >
              <Save size={16} /> Save Announcement
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
            <div>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", cursor: "pointer" }}>
                <input 
                  type="checkbox" 
                  checked={settings.announcementEnabled === 'true'} 
                  onChange={e => handleChange('announcementEnabled', e.target.checked ? 'true' : 'false')} 
                  style={{ width: "1.25rem", height: "1.25rem", cursor: "pointer" }}
                />
                <span style={{ fontWeight: "bold" }}>Enable Announcement Bar</span>
              </label>
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Announcement Text</label>
              <input type="text" className="form-input" value={settings.announcementText || ''} onChange={e => handleChange('announcementText', e.target.value)} placeholder="e.g., Pre-Launch Offer! 20% Off on Noah Heights" />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Action Link (Optional)</label>
              <input type="text" className="form-input" value={settings.announcementLink || ''} onChange={e => handleChange('announcementLink', e.target.value)} placeholder="e.g., /projects/noah-heights" />
            </div>
          </div>
        </div>

        {/* Layout Sections */}
        <div className="card" style={{ padding: "2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: 0, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Layout size={20} color="var(--primary)" /> Section Toggles
            </h2>
            <button 
              className="btn btn-primary" 
              onClick={() => handleSave(['showFeaturedProjects', 'showFeaturedProperties', 'showStatistics', 'showTestimonials'])}
              disabled={saving}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem" }}
            >
              <Save size={16} /> Save Layout Toggles
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input type="checkbox" checked={settings.showFeaturedProjects !== 'false'} onChange={e => handleChange('showFeaturedProjects', e.target.checked ? 'true' : 'false')} style={{ width: "1.25rem", height: "1.25rem", cursor: "pointer" }} />
              <span style={{ fontWeight: "bold" }}>Show Featured Projects Section</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input type="checkbox" checked={settings.showFeaturedProperties !== 'false'} onChange={e => handleChange('showFeaturedProperties', e.target.checked ? 'true' : 'false')} style={{ width: "1.25rem", height: "1.25rem", cursor: "pointer" }} />
              <span style={{ fontWeight: "bold" }}>Show Featured Properties Section</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input type="checkbox" checked={settings.showStatistics !== 'false'} onChange={e => handleChange('showStatistics', e.target.checked ? 'true' : 'false')} style={{ width: "1.25rem", height: "1.25rem", cursor: "pointer" }} />
              <span style={{ fontWeight: "bold" }}>Show Company Statistics Section</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input type="checkbox" checked={settings.showTestimonials !== 'false'} onChange={e => handleChange('showTestimonials', e.target.checked ? 'true' : 'false')} style={{ width: "1.25rem", height: "1.25rem", cursor: "pointer" }} />
              <span style={{ fontWeight: "bold" }}>Show Testimonials Section</span>
            </label>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
