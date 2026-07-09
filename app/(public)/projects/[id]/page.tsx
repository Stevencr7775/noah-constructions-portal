import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar, CheckCircle, Activity, Building2, Download, ExternalLink } from "lucide-react";

export const revalidate = 60; // Cache for 60 seconds

export default async function PublicProjectPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      milestones: { orderBy: { percentage: 'asc' } },
      properties: { 
        where: { currentStatus: { in: ['Available', 'Reserved', 'Sold'] } },
        orderBy: { propertyId: 'asc' }
      }
    }
  });

  if (!project) notFound();

  // Aggregate inventory
  const totalUnits = project.properties.length;
  const availableUnits = project.properties.filter(p => p.currentStatus === 'Available').length;
  const soldUnits = project.properties.filter(p => p.currentStatus === 'Sold').length;

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", paddingBottom: "4rem" }}>
      {/* Hero Section */}
      <div style={{ backgroundColor: "var(--primary)", color: "white", padding: "4rem 2rem", position: "relative", overflow: "hidden" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "bold", color: "#93c5fd" }}>
            <span>{project.projectType}</span> • <span>{project.status}</span>
          </div>
          <h1 style={{ fontSize: "3rem", margin: "0 0 1rem 0", fontWeight: "800" }}>{project.title}</h1>
          <p style={{ fontSize: "1.25rem", margin: "0 0 2rem 0", maxWidth: "600px", color: "#e2e8f0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <MapPin size={20} /> {project.location || "Location TBA"}
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button className="btn btn-secondary" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Download size={18} /> Download Brochure
            </button>
            <Link href="#contact" className="btn btn-primary" style={{ backgroundColor: "white", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              Book Site Visit
            </Link>
          </div>
        </div>
        <div style={{ position: "absolute", top: 0, right: 0, bottom: 0, width: "50%", background: "linear-gradient(to right, transparent, rgba(0,0,0,0.5))", zIndex: 1 }}></div>
      </div>

      <div style={{ maxWidth: "1200px", margin: "-3rem auto 0", padding: "0 2rem", position: "relative", zIndex: 10 }}>
        
        {/* Quick Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
          <div className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#64748b", textTransform: "uppercase", fontWeight: "bold", marginBottom: "0.5rem" }}>Progress</div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "var(--primary)" }}>{project.progress}%</div>
          </div>
          <div className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#64748b", textTransform: "uppercase", fontWeight: "bold", marginBottom: "0.5rem" }}>Available Units</div>
            <div style={{ fontSize: "2rem", fontWeight: "800", color: "#0ea5e9" }}>{availableUnits} <span style={{ fontSize: "1rem", color: "#94a3b8", fontWeight: "normal" }}>/ {totalUnits || 'TBA'}</span></div>
          </div>
          <div className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#64748b", textTransform: "uppercase", fontWeight: "bold", marginBottom: "0.5rem" }}>Expected Completion</div>
            <div style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#0f172a", marginTop: "0.5rem" }}>
              {project.expectedCompletion ? project.expectedCompletion.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) : 'TBA'}
            </div>
          </div>
          <div className="card" style={{ padding: "1.5rem", textAlign: "center" }}>
            <div style={{ fontSize: "0.875rem", color: "#64748b", textTransform: "uppercase", fontWeight: "bold", marginBottom: "0.5rem" }}>RERA Registration</div>
            <div style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#0f172a", marginTop: "0.5rem" }}>
              {project.reraNumber || 'Pending'}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "3rem" }}>
          {/* Main Content Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            
            {/* Description */}
            <section>
              <h2 className="section-title">About The Project</h2>
              <div className="card" style={{ padding: "2rem", lineHeight: "1.8", color: "#475569" }}>
                {project.description ? (
                  <div dangerouslySetInnerHTML={{ __html: project.description.replace(/\\n/g, '<br/>') }} />
                ) : (
                  <p>Description coming soon.</p>
                )}
              </div>
            </section>

            {/* Construction Timeline */}
            <section>
              <h2 className="section-title">Construction Timeline</h2>
              <div className="card" style={{ padding: "2rem" }}>
                {project.milestones.length > 0 ? (
                  <div style={{ position: "relative" }}>
                    <div style={{ position: "absolute", left: "20px", top: "10px", bottom: "10px", width: "2px", background: "#e2e8f0" }}></div>
                    {project.milestones.map((milestone, idx) => {
                      const isCompleted = milestone.status === 'Completed';
                      const isCurrent = milestone.status === 'In Progress';
                      return (
                        <div key={milestone.id} style={{ display: "flex", gap: "1.5rem", marginBottom: idx === project.milestones.length - 1 ? 0 : "2rem", position: "relative", zIndex: 2 }}>
                          <div style={{ 
                            width: "42px", height: "42px", borderRadius: "50%", 
                            background: isCompleted ? "#10b981" : isCurrent ? "var(--primary)" : "#f1f5f9",
                            color: isCompleted || isCurrent ? "white" : "#94a3b8",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            border: `4px solid \${isCompleted ? '#d1fae5' : isCurrent ? '#dbeafe' : 'white'}`,
                            flexShrink: 0, transition: "all 0.3s"
                          }}>
                            {isCompleted ? <CheckCircle size={20} /> : <Activity size={20} />}
                          </div>
                          <div style={{ paddingTop: "0.5rem" }}>
                            <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.125rem", color: isCompleted || isCurrent ? "#0f172a" : "#64748b" }}>
                              {milestone.name} <span style={{ fontSize: "0.875rem", color: "var(--primary)", marginLeft: "0.5rem" }}>{milestone.percentage}%</span>
                            </h3>
                            <p style={{ margin: "0", color: "#64748b", fontSize: "0.875rem" }}>
                              {milestone.date ? milestone.date.toLocaleDateString() : 'Target Date TBA'}
                              {milestone.remarks && <span style={{ display: "block", marginTop: "0.25rem", fontStyle: "italic" }}>"{milestone.remarks}"</span>}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <p style={{ color: "#64748b" }}>Timeline mapping is currently underway.</p>
                )}
              </div>
            </section>

            {/* Visual Gallery */}
            <section>
              <h2 className="section-title">Visual Progress</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
                {/* Lazy loading placeholders for gallery */}
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="card" style={{ height: "200px", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.4) 50%, transparent 60%)", backgroundSize: "200% 100%", animation: "shimmer 2s infinite" }}></div>
                    <span style={{ color: "#94a3b8", position: "relative", zIndex: 2 }}>Loading media...</span>
                  </div>
                ))}
              </div>
              <style dangerouslySetInnerHTML={{ __html: `
                @keyframes shimmer {
                  0% { background-position: 200% 0; }
                  100% { background-position: -200% 0; }
                }
              `}} />
            </section>

          </div>

          {/* Sidebar Column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            
            {/* Live Inventory Overview */}
            <div className="card" style={{ padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", margin: "0 0 1.5rem 0", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Building2 size={20} color="var(--primary)" /> Live Inventory
              </h3>
              
              {project.properties.length > 0 ? (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  {project.properties.map(unit => {
                    const isAvailable = unit.currentStatus === 'Available';
                    const isReserved = unit.currentStatus === 'Reserved';
                    return (
                      <div key={unit.id} style={{ 
                        padding: "0.5rem", 
                        border: `1px solid \${isAvailable ? '#86efac' : isReserved ? '#fde047' : '#e2e8f0'}`, 
                        borderRadius: "6px", 
                        background: isAvailable ? '#f0fdf4' : isReserved ? '#fefce8' : '#f8fafc',
                        textAlign: "center"
                      }}>
                        <div style={{ fontWeight: "bold", fontSize: "0.875rem", color: isAvailable ? '#166534' : isReserved ? '#854d0e' : '#94a3b8' }}>
                          {unit.propertyId || 'Plot'}
                        </div>
                        <div style={{ fontSize: "0.65rem", color: isAvailable ? '#15803d' : isReserved ? '#a16207' : '#cbd5e1', textTransform: "uppercase", fontWeight: "bold" }}>
                          {unit.currentStatus}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p style={{ color: "#64748b", fontSize: "0.875rem" }}>Inventory data is currently being updated by the sales team.</p>
              )}
            </div>

            {/* Master Plan */}
            <div className="card" style={{ padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.25rem", margin: "0 0 1.5rem 0" }}>Master Plan</h3>
              <div style={{ width: "100%", height: "200px", background: "#f1f5f9", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                <span style={{ color: "#94a3b8" }}>Plan Document Preview</span>
              </div>
              <button className="btn btn-outline" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <ExternalLink size={16} /> View Full PDF Plan
              </button>
            </div>

            {/* Quick Contact / CRM */}
            <div className="card" style={{ padding: "1.5rem", background: "var(--primary)", color: "white" }}>
              <h3 style={{ fontSize: "1.25rem", margin: "0 0 1rem 0" }}>Interested?</h3>
              <p style={{ fontSize: "0.875rem", marginBottom: "1.5rem", opacity: 0.9 }}>Get in touch with our sales team for pricing and availability details.</p>
              <Link href="/contact-us" className="btn btn-secondary" style={{ width: "100%", textAlign: "center", display: "block" }}>
                Contact Sales Team
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
