// app/page.jsx
import { client } from '@/lib/sanity.client'; // Adjust path if needed
import ReviewList from '@/components/ReviewList'; // Import the new client component

// Fetch data on the server during build time (or request time with revalidation)
async function getReviews() {
  const query = `*[_type == "review" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    publishedAt,
    "restaurantName": restaurant->name,
    "restaurantSlug": restaurant->slug.current,
    "restaurantImage": restaurant->mainImage,
    ratingFood,
    ratingService,
    ratingAmbiance,
    ratingValue,
    overallRating
    // Include any other fields needed for searching or display
  }`;
  const reviews = await client.fetch(query);
  return reviews;
}

// Keep this as an async Server Component
export default async function HomePage() {
  const reviews = await getReviews(); // Fetch data on the server

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">My Food Reviews</h1>

      {/* Render the Client Component, passing fetched reviews as props */}
      <ReviewList initialReviews={reviews} />

    </div>
  );
}

export const revalidate = 3600; // Revalidate every hour