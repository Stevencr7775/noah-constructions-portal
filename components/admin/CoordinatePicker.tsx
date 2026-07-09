"use client";

import { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { MapPin } from "lucide-react";

const containerStyle = {
  width: '100%',
  height: '350px',
  borderRadius: '8px'
};

const defaultCenter = {
  lat: 17.3850,
  lng: 78.4867
};

export interface CoordinatePickerProps {
  initialLat?: number | null;
  initialLng?: number | null;
  onChange: (lat: number, lng: number) => void;
}

export default function CoordinatePicker({ initialLat, initialLng, onChange }: CoordinatePickerProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerPos, setMarkerPos] = useState({ 
    lat: initialLat || defaultCenter.lat, 
    lng: initialLng || defaultCenter.lng 
  });

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMarkerPos({ lat, lng });
      onChange(lat, lng);
    }
  };

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div style={{ height: "350px", background: "#f8fafc", borderRadius: "8px", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p className="text-muted">Google Maps API Key missing for Coordinate Picker.</p>
      </div>
    );
  }

  if (!isLoaded) return <div style={{ height: "350px", background: "#f1f5f9", borderRadius: "8px" }}>Loading Map...</div>;

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: "1rem", left: "1rem", zIndex: 10, background: "white", padding: "0.5rem 1rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <MapPin size={16} className="text-primary" /> 
        <span style={{ fontSize: "0.875rem", fontWeight: "bold" }}>
          {markerPos.lat.toFixed(6)}, {markerPos.lng.toFixed(6)}
        </span>
      </div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPos}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
        }}
      >
        <Marker 
          position={markerPos} 
          draggable={true}
          onDragEnd={handleMapClick}
        />
      </GoogleMap>
      <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.75rem", color: "#64748b" }}>
        Click on the map or drag the marker to set the exact property location.
      </p>
    </div>
  );
}
