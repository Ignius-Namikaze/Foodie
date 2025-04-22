// components/ReviewList.jsx
'use client'; // <-- Must be a client component for state and interaction

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { urlFor } from '@/lib/image'; // Adjust path if needed

export default function ReviewList({ initialReviews = [] }) { // Accept reviews as a prop
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReviews = useMemo(() => {
    if (!searchTerm) {
      return initialReviews; // Return all if search is empty
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return initialReviews.filter(review => {
      const titleMatch = review.title?.toLowerCase().includes(lowerCaseSearchTerm);
      const restaurantNameMatch = review.restaurantName?.toLowerCase().includes(lowerCaseSearchTerm);
      // Add more fields to search if needed (e.g., cuisine, location)
      // const cuisineMatch = review.restaurant?.cuisine?.toLowerCase().includes(lowerCaseSearchTerm);
      return titleMatch || restaurantNameMatch;
    });
  }, [searchTerm, initialReviews]); // Recalculate when search or initial data changes

  return (
    <div>
      {/* --- Search Input --- */}
      <div className="mb-8 max-w-md mx-auto">
        <input
          type="search"
          placeholder="Search reviews by title or restaurant..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* --- End Search Input --- */}

      {/* --- Review Grid --- */}
      {filteredReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredReviews.map((review) => {
            const imageUrl = review.restaurantImage ? urlFor(review.restaurantImage)?.width(400).height(300).url() : null;
            const averageRating = review.overallRating ?? 'N/A';

            return (
              <Link href={`/reviews/${review.slug.current}`} key={review._id} className="block group border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                 <div className="relative w-full h-48">
                   {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={`Image for ${review.restaurantName}`}
                        fill
                        style={{ objectFit: 'cover' }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={false}
                      />
                   ) : (
                     <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">No Image</div>
                   )}
                 </div>
                 <div className="p-4">
                   <h2 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                     {review.title ? review.title : `Review: ${review.restaurantName}`}
                   </h2>
                   <p className="text-gray-600 mb-1 text-sm">
                     Restaurant: {review.restaurantName}
                   </p>
                    <p className="text-gray-500 text-xs mb-3">
                      Published: {new Date(review.publishedAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">Overall: {averageRating}/5 ⭐</span>
                    </div>
                 </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10">
          {searchTerm ? 'No reviews match your search.' : 'No reviews published yet. Go add some in Sanity Studio!'}
        </p>
      )}
      {/* --- End Review Grid --- */}
    </div>
  );
}