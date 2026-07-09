"use client";

import { useState, useCallback, useMemo } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import Link from "next/link";
import { MapPin } from "lucide-react";

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Default center: Hyderabad, India
const defaultCenter = {
  lat: 17.3850,
  lng: 78.4867
};

export default function PropertyMap({ properties }: { properties: any[] }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    if (properties.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      properties.forEach(prop => {
        if (prop.latitude && prop.longitude) {
          bounds.extend({ lat: prop.latitude, lng: prop.longitude });
        }
      });
      // Only fit bounds if we have valid coordinates
      if (!bounds.isEmpty()) {
        map.fitBounds(bounds);
      } else {
        map.setCenter(defaultCenter);
        map.setZoom(11);
      }
    } else {
      map.setCenter(defaultCenter);
      map.setZoom(11);
    }
    setMap(map);
  }, [properties]);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  if (loadError) {
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#fee2e2", color: "#dc2626", flexDirection: "column", gap: "1rem" }}>
        <p>Error loading Google Maps</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f1f5f9" }}>
        Loading map...
      </div>
    );
  }

  // If no API key is provided, show a helpful message instead of a broken map
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
     return (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#e2e8f0", flexDirection: "column", gap: "1rem" }}>
        <p style={{ color: "#64748b", fontWeight: "bold" }}>Google Maps Integration Ready</p>
        <p style={{ color: "#64748b", fontSize: "0.875rem", maxWidth: "400px", textAlign: "center" }}>
          To view the live map, add <code>NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here</code> to your <code>.env</code> file and restart the development server.
        </p>
      </div>
    );
  }

  return (
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
      {properties.map((prop) => (
        prop.latitude && prop.longitude ? (
          <Marker
            key={prop.id}
            position={{ lat: prop.latitude, lng: prop.longitude }}
            onClick={() => setSelectedProperty(prop)}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }}
          />
        ) : null
      ))}

      {selectedProperty && selectedProperty.latitude && selectedProperty.longitude && (
        <InfoWindow
          position={{ lat: selectedProperty.latitude, lng: selectedProperty.longitude }}
          onCloseClick={() => setSelectedProperty(null)}
        >
          <div style={{ maxWidth: "250px", padding: "0.5rem" }}>
             <div style={{ 
                height: "100px", 
                background: `url(${selectedProperty.media?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}) center/cover`,
                borderRadius: "8px",
                marginBottom: "0.5rem"
              }} />
            <h4 style={{ margin: "0 0 0.25rem 0", fontWeight: "bold", fontSize: "1rem" }}>{selectedProperty.title || selectedProperty.propertyId}</h4>
            <p className="text-muted" style={{ margin: "0 0 0.5rem 0", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
               <MapPin size={12} /> {selectedProperty.locality}, {selectedProperty.city}
            </p>
            <p style={{ margin: "0 0 0.5rem 0", fontWeight: "bold", color: "var(--primary)" }}>₹{selectedProperty.totalPrice?.toLocaleString('en-IN') || 'Price on request'}</p>
            <Link href={`/properties/${selectedProperty.id}`} target="_blank" className="btn btn-outline" style={{ display: "block", textAlign: "center", padding: "0.25rem 0.5rem", fontSize: "0.875rem" }}>
              View Details
            </Link>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}
