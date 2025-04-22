// components/RestaurantMap.jsx
'use client'; // <-- This component needs browser APIs, must be a Client Component

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Import L to fix potential marker icon issues

// Fix default icon issue with Webpack/Next.js
// You might need to copy marker-icon.png, marker-icon-2x.png, and marker-shadow.png
// from 'node_modules/leaflet/dist/images' to your 'public/images' folder
// and adjust the paths below accordingly if icons don't appear.
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


export default function RestaurantMap({ lat, lng, popupText }) {
  if (typeof window === 'undefined' || !lat || !lng) {
    // Don't render map on server or if coordinates are missing
    return null;
  }

  const position = [lat, lng];

  return (
    <MapContainer center={position} zoom={15} scrollWheelZoom={false} style={{ height: '400px', width: '100%', zIndex: 0 }}>
      <TileLayer
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        {popupText && (
           <Popup>
            {popupText}
           </Popup>
        )}
      </Marker>
    </MapContainer>
  );
}