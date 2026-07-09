"use client";

import { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import Link from "next/link";
import { MapPin, Building2, CheckCircle, Clock } from "lucide-react";

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 17.3850,
  lng: 78.4867
};

export default function ProjectMapView({ projects }: { projects: any[] }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    if (projects.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      projects.forEach(p => bounds.extend({ lat: p.latitude, lng: p.longitude }));
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
      }
    } else {
      map.setCenter(defaultCenter);
      map.setZoom(11);
    }
    setMap(map);
  }, [projects]);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  if (loadError) return <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>Error loading maps</div>;
  if (!isLoaded) return <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading map...</div>;

  const filteredProjects = filterStatus === "All" ? projects : projects.filter(p => p.status === filterStatus);

  const getMarkerIcon = (status: string) => {
    switch (status) {
      case 'Ongoing':
      case 'Active':
        return 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png';
      case 'Completed':
        return 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
      case 'Upcoming':
        return 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png';
      default:
        return 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Floating Filter Controls */}
      <div style={{ position: "absolute", top: "1.5rem", left: "1.5rem", zIndex: 10, background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", width: "320px" }}>
        <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Building2 size={20} className="text-primary" /> Project Map
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <button 
            onClick={() => setFilterStatus("All")}
            className={`btn ${filterStatus === "All" ? "btn-primary" : "btn-outline"}`}
            style={{ width: "100%", textAlign: "left", justifyContent: "space-between", display: "flex" }}
          >
            All Projects <span>{projects.length}</span>
          </button>
          <button 
            onClick={() => setFilterStatus("Active")}
            className={`btn ${filterStatus === "Active" ? "btn-primary" : "btn-outline"}`}
            style={{ width: "100%", textAlign: "left", justifyContent: "flex-start", display: "flex", alignItems: "center", gap: "0.5rem", borderColor: filterStatus !== "Active" ? "#f97316" : "", color: filterStatus !== "Active" ? "#f97316" : "" }}
          >
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f97316" }}></div> Ongoing
          </button>
          <button 
            onClick={() => setFilterStatus("Completed")}
            className={`btn ${filterStatus === "Completed" ? "btn-primary" : "btn-outline"}`}
            style={{ width: "100%", textAlign: "left", justifyContent: "flex-start", display: "flex", alignItems: "center", gap: "0.5rem", borderColor: filterStatus !== "Completed" ? "#22c55e" : "", color: filterStatus !== "Completed" ? "#22c55e" : "" }}
          >
            <CheckCircle size={14} /> Completed
          </button>
          <button 
            onClick={() => setFilterStatus("Upcoming")}
            className={`btn ${filterStatus === "Upcoming" ? "btn-primary" : "btn-outline"}`}
            style={{ width: "100%", textAlign: "left", justifyContent: "flex-start", display: "flex", alignItems: "center", gap: "0.5rem", borderColor: filterStatus !== "Upcoming" ? "#a855f7" : "", color: filterStatus !== "Upcoming" ? "#a855f7" : "" }}
          >
            <Clock size={14} /> Upcoming
          </button>
        </div>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={11}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        }}
      >
        {filteredProjects.map((p) => (
          <Marker
            key={p.id}
            position={{ lat: p.latitude, lng: p.longitude }}
            onClick={() => setSelectedProject(p)}
            icon={{ url: getMarkerIcon(p.status) }}
          />
        ))}

        {selectedProject && (
          <InfoWindow
            position={{ lat: selectedProject.latitude, lng: selectedProject.longitude }}
            onCloseClick={() => setSelectedProject(null)}
          >
            <div style={{ maxWidth: "250px", padding: "0.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                 <span style={{ fontSize: "0.75rem", background: "var(--primary)", color: "white", padding: "0.125rem 0.5rem", borderRadius: "999px" }}>
                   {selectedProject.status}
                 </span>
                 {selectedProject.progress > 0 && <span style={{ fontSize: "0.75rem", fontWeight: "bold" }}>{selectedProject.progress}% Done</span>}
              </div>
              <h4 style={{ margin: "0 0 0.25rem 0", fontWeight: "bold", fontSize: "1.125rem" }}>{selectedProject.title}</h4>
              <p className="text-muted" style={{ margin: "0 0 0.5rem 0", fontSize: "0.75rem" }}>By {selectedProject.builderName}</p>
              
              <p className="text-muted" style={{ margin: "0 0 1rem 0", fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                 <MapPin size={14} /> {selectedProject.locality}, {selectedProject.city}
              </p>
              
              <Link href={`/projects/${selectedProject.id}`} className="btn btn-primary" style={{ display: "block", textAlign: "center", padding: "0.5rem", fontSize: "0.875rem", width: "100%" }}>
                View Project
              </Link>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
