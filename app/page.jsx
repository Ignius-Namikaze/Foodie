// app/page.jsx
import Link from 'next/link';
import { client } from '@/lib/sanity.client'; // Adjust path if needed
import { urlFor } from '@/lib/image';       // Adjust path if needed
import Image from 'next/image';

// Fetch data on the server during build time (or request time with revalidation)
async function getReviews() {
  // GROQ query to fetch reviews, ordered by published date, and include related restaurant info
  const query = `*[_type == "review" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    "restaurantName": restaurant->name, // Get name from referenced restaurant
    "restaurantSlug": restaurant->slug.current, // Get slug from restaurant
    "restaurantImage": restaurant->mainImage, // Get main image from restaurant
    ratingFood,
    ratingService,
    ratingAmbiance,
    ratingValue,
    overallRating
  }`;
  const reviews = await client.fetch(query);
  return reviews;
}

// Make the component async to fetch data
export default async function HomePage() {
  const reviews = await getReviews();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">My Food Reviews</h1>

      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review) => {
            const imageUrl = review.restaurantImage ? urlFor(review.restaurantImage)?.width(400).height(300).url() : null;
            const averageRating = review.overallRating ?? 'N/A'; // Or calculate average if needed

            return (
              <Link href={`/reviews/${review.slug.current}`} key={review._id} className="block group border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                <div className="relative w-full h-48">
                  {imageUrl ? (
                     <Image
                       src={imageUrl}
                       alt={`Image for ${review.restaurantName}`}
                       fill // Use fill layout
                       style={{ objectFit: 'cover' }} // Cover the area
                       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Responsive sizes
                       priority={false} // Only prioritize above-the-fold images
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
        <p className="text-center text-gray-500">No reviews published yet. Go add some in Sanity Studio!</p>
      )}
    </div>
  );
}

// Optional: Revalidate the page periodically (e.g., every hour) or on-demand
export const revalidate = 3600; // Revalidate every hour