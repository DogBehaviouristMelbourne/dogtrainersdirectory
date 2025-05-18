import React, { useEffect, useRef } from 'react';
import { GOOGLE_MAPS_API_KEY } from '../firebase';
import '../styles/MapLocation.css';

// This component renders a Google Map showing a location based on suburb
export default function MapLocation({ suburb }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  
  useEffect(() => {
    // Load the Google Maps script
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        initMap(); // Script already loaded
        return;
      }
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
      
      return () => {
        // Clean up script if component unmounts before script loads
        document.head.removeChild(script);
      };
    };
    
    // Initialize the map
    const initMap = () => {
      if (!mapRef.current || !suburb) return;
      
      const geocoder = new window.google.maps.Geocoder();
      
      // Geocode the suburb to get coordinates (add "Melbourne, VIC, Australia" for more accurate results)
      geocoder.geocode(
        { address: `${suburb}, Melbourne, VIC, Australia` },
        (results, status) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            
            // Create the map
            const mapOptions = {
              center: location,
              zoom: 14,
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false,
              styles: [
                {
                  featureType: "poi",
                  elementType: "labels",
                  stylers: [{ visibility: "off" }]
                }
              ]
            };
            
            const map = new window.google.maps.Map(mapRef.current, mapOptions);
            mapInstanceRef.current = map;
            
            // Create a marker for the location
            new window.google.maps.Marker({
              map,
              position: location,
              title: suburb,
              animation: window.google.maps.Animation.DROP
            });
            
            // Create a circle to show service area (approximate)
            new window.google.maps.Circle({
              map,
              center: location,
              radius: 2000, // 2km radius
              strokeColor: '#00695c',
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: '#00695c',
              fillOpacity: 0.1
            });
          } else {
            console.error("Geocode failed:", status);
          }
        }
      );
    };
    
    loadGoogleMapsScript();
    
    return () => {
      // Clean up map instance if it exists
      if (mapInstanceRef.current) {
        // No explicit cleanup needed for Google Maps in React
        mapInstanceRef.current = null;
      }
    };
  }, [suburb]);
  
  if (!suburb) {
    return null;
  }
  
  return (
    <div className="map-container">
      <div ref={mapRef} className="google-map"></div>
      <div className="map-footer">
        <span className="map-location">
          <span className="map-icon">📍</span> {suburb}, Melbourne
        </span>
        <a 
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            `${suburb}, Melbourne, VIC, Australia`
          )}`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="directions-link"
        >
          Get Directions →
        </a>
      </div>
    </div>
  );
}