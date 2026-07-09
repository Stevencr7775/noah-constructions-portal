"use client";

import { useState, useCallback, useMemo } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, MarkerClusterer } from '@react-google-maps/api';
import Link from "next/link";
import { MapPin, Search } from "lucide-react";

const containerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 17.3850,
  lng: 78.4867
};

export default function MapSearchView({ properties }: { properties: any[] }) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [searchRadius, setSearchRadius] = useState<number>(10000); // 10km default

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    if (properties.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      properties.forEach(prop => {
        if (prop.latitude && prop.longitude) {
          bounds.extend({ lat: prop.latitude, lng: prop.longitude });
        }
      });
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

  if (loadError) return <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>Error loading maps</div>;
  if (!isLoaded) return <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading map...</div>;

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", background: "#f8fafc" }}>
        <h2>Map Search requires API Key</h2>
        <p className="text-muted">Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in your .env file.</p>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Floating Search Controls */}
      <div style={{ position: "absolute", top: "1.5rem", left: "1.5rem", zIndex: 10, background: "white", padding: "1rem", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", width: "300px" }}>
        <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem" }}>Map Search</h3>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", fontSize: "0.75rem", marginBottom: "0.25rem", color: "#64748b" }}>Search Radius</label>
          <select 
            value={searchRadius} 
            onChange={e => setSearchRadius(Number(e.target.value))}
            style={{ width: "100%", padding: "0.5rem", borderRadius: "8px", border: "1px solid var(--border)" }}
          >
            <option value={5000}>5 km</option>
            <option value={10000}>10 km</option>
            <option value={20000}>20 km</option>
            <option value={50000}>50 km</option>
          </select>
        </div>
        <p style={{ fontSize: "0.75rem", color: "#64748b", margin: 0 }}>
           Showing {properties.length} properties on the map.
        </p>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={11}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        }}
      >
        <MarkerClusterer>
          {(clusterer) => (
            <>
              {properties.map((prop) => (
                prop.latitude && prop.longitude ? (
                  <Marker
                    key={prop.id}
                    position={{ lat: prop.latitude, lng: prop.longitude }}
                    onClick={() => setSelectedProperty(prop)}
                    clusterer={clusterer}
                  />
                ) : null
              ))}
            </>
          )}
        </MarkerClusterer>

        {selectedProperty && selectedProperty.latitude && selectedProperty.longitude && (
          <InfoWindow
            position={{ lat: selectedProperty.latitude, lng: selectedProperty.longitude }}
            onCloseClick={() => setSelectedProperty(null)}
          >
            <div style={{ maxWidth: "250px", padding: "0.5rem" }}>
               <div style={{ 
                  height: "120px", 
                  background: `url(${selectedProperty.media?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}) center/cover`,
                  borderRadius: "8px",
                  marginBottom: "0.5rem"
                }} />
              <h4 style={{ margin: "0 0 0.25rem 0", fontWeight: "bold", fontSize: "1rem" }}>{selectedProperty.title || selectedProperty.propertyId}</h4>
              <p className="text-muted" style={{ margin: "0 0 0.5rem 0", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                 <MapPin size={12} /> {selectedProperty.locality}, {selectedProperty.city}
              </p>
              <p style={{ margin: "0 0 0.5rem 0", fontWeight: "bold", color: "var(--primary)", fontSize: "1.125rem" }}>
                ₹{selectedProperty.totalPrice?.toLocaleString('en-IN') || 'Price on request'}
              </p>
              <Link href={`/properties/${selectedProperty.id}`} className="btn btn-primary" style={{ display: "block", textAlign: "center", padding: "0.25rem 0.5rem", fontSize: "0.875rem", width: "100%" }}>
                View Details
              </Link>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
