"use client";

import { useState, useEffect } from "react";
import { useJsApiLoader } from '@react-google-maps/api';
import { MapPin, Navigation, School, Hospital, ShoppingBag, Coffee, Train, Bus } from "lucide-react";

const PLACE_TYPES = [
  { type: 'school', label: 'Schools', icon: <School size={16} /> },
  { type: 'hospital', label: 'Hospitals', icon: <Hospital size={16} /> },
  { type: 'shopping_mall', label: 'Shopping', icon: <ShoppingBag size={16} /> },
  { type: 'restaurant', label: 'Restaurants', icon: <Coffee size={16} /> },
  { type: 'train_station', label: 'Transit', icon: <Train size={16} /> },
];

export default function NearbyPlaces({ lat, lng }: { lat: number, lng: number }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places', 'geometry']
  });

  const [activeTab, setActiveTab] = useState(PLACE_TYPES[0].type);
  const [places, setPlaces] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && lat && lng) {
      fetchPlaces(activeTab);
    }
  }, [isLoaded, lat, lng, activeTab]);

  const fetchPlaces = (type: string) => {
    setLoading(true);
    
    try {
      const location = new window.google.maps.LatLng(lat, lng);
      // We need a dummy element for PlacesService
      const map = new window.google.maps.Map(document.createElement('div'));
      const service = new window.google.maps.places.PlacesService(map);
      
      const request = {
        location: location,
        radius: 5000, // 5km
        type: type
      };

      service.nearbySearch(request, (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          // Calculate distance for each result
          const sortedResults = results.map(place => {
            let distance = 0;
            if (place.geometry?.location) {
              distance = window.google.maps.geometry.spherical.computeDistanceBetween(
                location, 
                place.geometry.location
              );
            }
            return { ...place, distance };
          }).sort((a, b) => a.distance - b.distance).slice(0, 5); // Take top 5 closest
          
          setPlaces(sortedResults);
        } else {
          setPlaces([]);
        }
        setLoading(false);
      });
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div style={{ padding: "2rem", background: "#f8fafc", borderRadius: "12px", textAlign: "center" }}>
        <p className="text-muted">Nearby Places requires a Google Maps API Key with Places API enabled.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: "2rem" }}>
      <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1.5rem" }}>Explore Neighbourhood</h3>
      
      <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "1rem", marginBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
        {PLACE_TYPES.map(tab => (
          <button 
            key={tab.type}
            onClick={() => setActiveTab(tab.type)}
            className={`btn ${activeTab === tab.type ? 'btn-primary' : 'btn-outline'}`}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap", padding: "0.5rem 1rem", fontSize: "0.875rem" }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>Loading places...</div>
      ) : places.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {places.map((place, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: "#f8fafc", borderRadius: "8px" }}>
              <div>
                <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "1rem" }}>{place.name}</h4>
                <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                  <MapPin size={12} /> {place.vicinity}
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                <span style={{ fontWeight: "bold", color: "var(--primary)", fontSize: "0.875rem" }}>
                  {(place.distance / 1000).toFixed(1)} km
                </span>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${place.geometry?.location?.lat()},${place.geometry?.location?.lng()}&origin=${lat},${lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary"
                  style={{ fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "0.25rem", textDecoration: "none" }}
                >
                  <Navigation size={12} /> Get Directions
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
          No {PLACE_TYPES.find(t => t.type === activeTab)?.label.toLowerCase()} found within 5km.
        </div>
      )}
    </div>
  );
}
