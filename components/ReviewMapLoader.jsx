// components/ReviewMapLoader.jsx
'use client'; // <-- Make this a Client Component

import dynamic from 'next/dynamic';
import { useMemo } from 'react'; // useMemo is optional but good practice if props change often

// --- Move the dynamic import here ---
const RestaurantMap = dynamic(() => import('@/components/RestaurantMap'), {
  ssr: false, // Now allowed because this is a Client Component
  loading: () => <p>Loading map...</p>
});

// This component receives the coordinates as props
export default function ReviewMapLoader({ coordinates, popupText }) {
  // useMemo prevents re-rendering the map unnecessarily if parent component re-renders
  // but coordinates haven't actually changed.
  const map = useMemo(() => {
    if (!coordinates?.lat || !coordinates?.lng) {
         return <p>Location coordinates not available.</p>; // Handle missing coords
    }
    return (
        <RestaurantMap
            lat={coordinates.lat}
            lng={coordinates.lng}
            popupText={popupText}
        />
    );
   }, [coordinates, popupText]); // Dependency array

  return (
     <div>
        {map}
     </div>
  )

}