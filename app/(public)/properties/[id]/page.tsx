import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MapPin, Tag, Grid, Box, Ruler, CheckCircle, Image as ImageIcon, Map as MapIcon, FileText, Download } from "lucide-react";
import Link from "next/link";
import EnquiryActionBar from "@/components/property/EnquiryActionBar";
import PropertyMap from "@/components/PropertyMap";
import NearbyPlaces from "@/components/property/NearbyPlaces";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: {
      media: true,
      seller: {
        select: {
          name: true,
          email: true,
          mobile: true,
          type: true,
          agency: true,
          companyName: true,
        }
      },
      documents: {
        where: { visibility: 'Public', status: 'Verified' }
      }
    }
  });

  if (!property) {
    notFound();
  }

  // Only allow viewing if published, or we can assume middleware/API protects it.
  // For public routes, we shouldn't show it if it's not Published, Sold, or Reserved, but we'll show it if it's found for now as requested for the testing phase.

  const images = property.media.filter(m => m.type === 'image');
  const fallbackImage = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80";
  const mainImage = images.length > 0 ? images[0].url : fallbackImage;

  return (
    <div className="container section-padding" style={{ paddingTop: "120px", paddingBottom: "120px" }}>
      {/* Header & Main Image */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "2rem", marginBottom: "3rem" }}>
        <div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
            <span style={{ background: "var(--primary)", color: "white", padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.875rem", fontWeight: "bold" }}>
              {property.status}
            </span>
            <span style={{ background: "#e2e8f0", color: "#475569", padding: "0.25rem 0.75rem", borderRadius: "999px", fontSize: "0.875rem" }}>
              {property.propertyType || property.category}
            </span>
          </div>
          <h1 className="section-title" style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>{property.title || property.propertyId}</h1>
          <p className="text-muted" style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.125rem" }}>
            <MapPin size={18} /> {property.locality}, {property.city}, {property.state}
          </p>
          <div style={{ marginTop: "1.5rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--primary)" }}>
              ₹{property.totalPrice?.toLocaleString('en-IN') || 'Price on request'}
            </h2>
            {property.pricePerSqYard && (
              <p className="text-muted">₹{property.pricePerSqYard.toLocaleString('en-IN')} per Sq.Yard</p>
            )}
          </div>
        </div>

        <div style={{ 
          width: "100%", 
          height: "500px", 
          borderRadius: "16px", 
          overflow: "hidden", 
          background: `url(${mainImage}) center/cover no-repeat`,
          position: "relative",
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)"
        }}>
          {images.length > 1 && (
            <div style={{ position: "absolute", bottom: "1rem", right: "1rem", background: "rgba(0,0,0,0.7)", color: "white", padding: "0.5rem 1rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ImageIcon size={16} /> +{images.length - 1} more
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "3rem" }}>
        {/* Left Column: Details */}
        <div className="space-y-8">
          <div className="card" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Overview</h3>
            <p className="text-muted" style={{ lineHeight: "1.8" }}>
              {property.description || 'No description provided.'}
            </p>
          </div>

          <div className="card" style={{ padding: "2rem" }}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Property Specifications</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {property.squareYards && (
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <div style={{ background: "#f1f5f9", padding: "0.75rem", borderRadius: "8px" }}><Ruler size={24} color="var(--primary)" /></div>
                  <div>
                    <p className="text-muted" style={{ fontSize: "0.875rem" }}>Area</p>
                    <p style={{ fontWeight: "bold" }}>{property.squareYards} Sq.Yards</p>
                  </div>
                </div>
              )}
              {property.facing && (
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <div style={{ background: "#f1f5f9", padding: "0.75rem", borderRadius: "8px" }}><Grid size={24} color="var(--primary)" /></div>
                  <div>
                    <p className="text-muted" style={{ fontSize: "0.875rem" }}>Facing</p>
                    <p style={{ fontWeight: "bold" }}>{property.facing}</p>
                  </div>
                </div>
              )}
              {property.cornerPlot && (
                <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                  <div style={{ background: "#f1f5f9", padding: "0.75rem", borderRadius: "8px" }}><Box size={24} color="var(--primary)" /></div>
                  <div>
                    <p className="text-muted" style={{ fontSize: "0.875rem" }}>Corner Plot</p>
                    <p style={{ fontWeight: "bold" }}>Yes</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Interactive Map & Nearby Places */}
          {property.latitude && property.longitude && (
            <>
              <div className="card" style={{ padding: "2rem" }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <MapIcon size={24} color="var(--primary)" /> Location Overview
                </h3>
                <div style={{ height: "400px", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)", marginBottom: "1.5rem" }}>
                  <PropertyMap properties={[property]} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <p className="text-muted" style={{ margin: 0 }}>{property.address || `${property.locality}, ${property.city}`}</p>
                   <a 
                     href={`https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`}
                     target="_blank"
                     rel="noreferrer"
                     className="btn btn-outline"
                   >
                     Open in Google Maps
                   </a>
                </div>
              </div>

              <NearbyPlaces lat={property.latitude} lng={property.longitude} />
            </>
          )}

          {/* Legal & Documents */}
          {property.documents.length > 0 && (
            <div className="card" style={{ padding: "2rem" }}>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <FileText size={24} color="var(--primary)" /> Legal & Documents
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {property.documents.map(doc => (
                  <a 
                    key={doc.id} 
                    href={doc.url} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", background: "#f8fafc", borderRadius: "8px", textDecoration: "none", color: "inherit", border: "1px solid var(--border)" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{ padding: "0.5rem", background: "#eff6ff", color: "var(--primary)", borderRadius: "8px" }}>
                        <FileText size={20} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: "bold", fontSize: "0.875rem" }}>{doc.name}</p>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>{doc.documentType}</p>
                      </div>
                    </div>
                    <Download size={16} className="text-muted" />
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Contact & Actions */}
        <div className="space-y-6">
          <Link href={`/properties/${property.id}/brochure`} target="_blank" className="btn btn-outline" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", width: "100%", padding: "1rem", fontSize: "1rem", borderColor: "var(--primary)", color: "var(--primary)", background: "#eff6ff" }}>
            <FileText size={20} /> Download PDF Brochure
          </Link>
          <EnquiryActionBar property={property} />
        </div>
      </div>
    </div>
  );
}
