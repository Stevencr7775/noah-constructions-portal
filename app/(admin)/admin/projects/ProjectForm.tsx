"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Building2, Save, ArrowLeft, Image as ImageIcon, MapPin, Map as MapIcon, Calendar, CheckSquare, AlignLeft, Calendar as CalendarIcon, Hash, Activity } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const sidebarLinks = [
  { label: "Dashboard", href: "/admin", icon: <Building2 size={20} /> },
  { label: "Project Management", href: "/admin/pm", icon: <Calendar size={20} /> },
  { label: "Projects", href: "/admin/projects", icon: <Building2 size={20} /> },
];

export default function ProjectForm({ project, isNew = false }: { project?: any, isNew?: boolean }) {
  const router = useRouter();
  const [formData, setFormData] = useState(project || {
    title: "",
    projectCode: "",
    projectType: "Residential",
    description: "",
    status: "Planning Stage",
    progress: 0,
    location: "",
    launchDate: "",
    expectedCompletion: "",
    projectManager: "",
    architect: "",
    contractor: "",
    reraNumber: ""
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Dummy save for now
    setTimeout(() => {
      alert("Project saved successfully!");
      setSaving(false);
      router.push("/admin/projects");
    }, 1000);
  };

  return (
    <DashboardLayout role="ADMIN" links={sidebarLinks}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/admin/projects" className="btn btn-outline" style={{ padding: "0.5rem" }}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className="section-title text-primary" style={{ fontSize: "1.75rem", margin: 0, display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Building2 size={28} /> {isNew ? "Create New Project" : "Edit Project"}
          </h1>
        </div>
        <button onClick={handleSave} className="btn btn-primary" disabled={saving} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Save size={18} /> {saving ? "Saving..." : "Save Project"}
        </button>
      </div>

      <form onSubmit={handleSave} style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        {/* Main Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div className="card" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <AlignLeft size={20} color="var(--primary)" /> General Information
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Project Title</label>
                <input required type="text" name="title" className="form-input" value={formData.title || ''} onChange={handleChange} placeholder="e.g., Noah Heights" />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Project Code</label>
                <input type="text" name="projectCode" className="form-input" value={formData.projectCode || ''} onChange={handleChange} placeholder="e.g., NH-2025" />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Project Type</label>
                <select name="projectType" className="form-input" value={formData.projectType || 'Residential'} onChange={handleChange}>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Mixed Use">Mixed Use</option>
                  <option value="Villa Community">Villa Community</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Layout">Layout</option>
                  <option value="Farm Land">Farm Land</option>
                  <option value="Industrial">Industrial</option>
                </select>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Description</label>
                <textarea name="description" className="form-input" rows={4} value={formData.description || ''} onChange={handleChange} placeholder="Project overview..."></textarea>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CheckSquare size={20} color="var(--primary)" /> Project Team & Operations
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Project Manager</label>
                <input type="text" name="projectManager" className="form-input" value={formData.projectManager || ''} onChange={handleChange} placeholder="Manager name" />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Architect</label>
                <input type="text" name="architect" className="form-input" value={formData.architect || ''} onChange={handleChange} placeholder="Architect name/firm" />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Contractor</label>
                <input type="text" name="contractor" className="form-input" value={formData.contractor || ''} onChange={handleChange} placeholder="Contractor name" />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>RERA Number</label>
                <input type="text" name="reraNumber" className="form-input" value={formData.reraNumber || ''} onChange={handleChange} placeholder="RERA/PR/..." />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div className="card" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Activity size={20} color="var(--primary)" /> Lifecycle Status
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Current Stage</label>
                <select name="status" className="form-input" value={formData.status || 'Planning Stage'} onChange={handleChange}>
                  <option value="Upcoming Project">Upcoming Project</option>
                  <option value="Planning Stage">Planning Stage</option>
                  <option value="Approval Stage">Approval Stage</option>
                  <option value="Under Construction">Under Construction</option>
                  <option value="Near Completion">Near Completion</option>
                  <option value="Completed">Completed</option>
                  <option value="Handed Over">Handed Over</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <div>
                <label style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontWeight: "bold" }}>
                  <span>Construction Progress</span>
                  <span style={{ color: "var(--primary)" }}>{formData.progress}%</span>
                </label>
                <input type="range" name="progress" min="0" max="100" className="form-input" style={{ padding: 0 }} value={formData.progress || 0} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: "2rem" }}>
            <h2 style={{ fontSize: "1.25rem", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CalendarIcon size={20} color="var(--primary)" /> Timeline & Location
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Location</label>
                <input type="text" name="location" className="form-input" value={formData.location || ''} onChange={handleChange} placeholder="e.g., Gachibowli, Hyderabad" />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Launch Date</label>
                <input type="date" name="launchDate" className="form-input" value={formData.launchDate ? new Date(formData.launchDate).toISOString().split('T')[0] : ''} onChange={handleChange} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: "bold" }}>Expected Completion</label>
                <input type="date" name="expectedCompletion" className="form-input" value={formData.expectedCompletion ? new Date(formData.expectedCompletion).toISOString().split('T')[0] : ''} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Master Plan Link */}
          {!isNew && (
            <div className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
              <MapIcon size={32} color="var(--primary)" style={{ margin: "0 auto 1rem auto" }} />
              <h3 style={{ fontSize: "1.125rem", margin: "0 0 0.5rem 0" }}>Master Plan & Gallery</h3>
              <p style={{ color: "#64748b", fontSize: "0.875rem", marginBottom: "1.5rem" }}>Manage layouts, 3D renders, and construction galleries.</p>
              <Link href={`/admin/projects/\${project.id}/media`} className="btn btn-outline" style={{ display: "inline-block", width: "100%" }}>
                Manage Media
              </Link>
            </div>
          )}
        </div>
      </form>
    </DashboardLayout>
  );
}
