// app/reviews/[slug]/page.jsx

// Core Next.js imports
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Sanity & Helper imports
import { client } from '@/lib/sanity.client'; // Adjust path if needed
import { urlFor } from '@/lib/image';       // Adjust path if needed
import { PortableText } from '@portabletext/react'; // If using Portable Text for comments

// Import the Client Component responsible for loading the map
import ReviewMapLoader from '@/components/ReviewMapLoader'; // Adjust path if needed

// Fetch data for a single review
async function getReview(slug) {
  // Ensure you fetch all necessary fields, including restaurant coordinates
  const query = `*[_type == "review" && slug.current == $slug][0] {
    _id,
    title,
    dateVisited,
    publishedAt,
    comments, // Fetch raw comments data (text or portable text blocks)
    ratingFood,
    ratingService,
    ratingAmbiance,
    ratingValue,
    overallRating,
    reviewImages[]{ // Array of images
      asset->{..., '_key': _key} // Fetch image asset details, keep _key for React lists
    },
    restaurant->{ // Fetch linked restaurant details
      _id,
      name,
      location,
      cuisine,
      mainImage,
      coordinates // <-- Make sure coordinates are fetched!
    }
  }`;
  const review = await client.fetch(query, { slug });
  return review;
}

// Generate static paths for all reviews at build time (optional but good for SSG)
export async function generateStaticParams() {
  const query = `*[_type == "review" && defined(slug.current)][].slug.current`;
  const slugs = await client.fetch(query);
  // Ensure slugs is an array before mapping
  if (!Array.isArray(slugs)) {
    console.warn("Failed to fetch slugs for generateStaticParams or result was not an array.");
    return [];
  }
  return slugs.map((slug) => ({ slug }));
}

// --- Optional Helper Component for Ratings ---
function RatingDisplay({ label, value, max = 5 }) {
  if (value === null || value === undefined) return null;
  return (
    <div className="flex justify-between items-center mb-1">
      <span className="text-gray-700">{label}:</span>
      <span className="font-semibold text-lg text-blue-600">{value} / {max}</span>
      {/* Optional: Render stars
      <span className="ml-2">{ '⭐'.repeat(value) }{ '☆'.repeat(max - value) }</span> */}
    </div>
  );
}
// --- End Helper Component ---


// --- The Main Page Component (Server Component) ---
export default async function ReviewPage({ params }) {
  const { slug } = params;
  const review = await getReview(slug);

  // If no review is found for the slug, show 404
  if (!review) {
    notFound();
  }

  // Prepare data for rendering
  const restaurantImageUrl = review.restaurant?.mainImage ? urlFor(review.restaurant.mainImage).width(800).url() : null;
  const restaurantCoords = review.restaurant?.coordinates; // Get coordinates for the map loader

  // Define Portable Text components if using rich text for comments
  const portableTextComponents = {
     // Define custom components for blocks, marks, etc., if needed
     // types: { image: ({value}) => <img src={urlFor(value).url()} /> }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-3xl mx-auto bg-white p-6 md:p-10 rounded-lg shadow-xl">

        {/* Restaurant Info Header */}
        <div className="mb-8 border-b pb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">
            {review.restaurant?.name || 'Restaurant Review'}
          </h1>
          <p className="text-lg text-gray-600 mb-1">
            {review.restaurant?.location} {review.restaurant?.cuisine ? `(${review.restaurant.cuisine})` : ''}
          </p>
          <p className="text-sm text-gray-500">
            Reviewed on: {new Date(review.publishedAt).toLocaleDateString()} | Visited: {review.dateVisited ? new Date(review.dateVisited).toLocaleDateString() : 'N/A'}
          </p>
           {restaurantImageUrl && (
              <div className="mt-4 relative w-full h-64 md:h-80 rounded overflow-hidden">
                 <Image
                    src={restaurantImageUrl}
                    alt={`Main image for ${review.restaurant.name}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    priority // Prioritize image on detail page
                    sizes="(max-width: 768px) 100vw, 800px"
                 />
             </div>
           )}
        </div>

         {/* Review Title (Optional) */}
         {review.title && (
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{review.title}</h2>
         )}


        {/* Ratings Section */}
        <div className="mb-8 p-4 border rounded-md bg-gray-50">
          <h3 className="text-xl font-semibold mb-3 text-indigo-600">My Ratings:</h3>
          <RatingDisplay label="Food" value={review.ratingFood} />
          <RatingDisplay label="Service" value={review.ratingService} />
          <RatingDisplay label="Ambiance" value={review.ratingAmbiance} />
          <RatingDisplay label="Value" value={review.ratingValue} />
          <hr className="my-3"/>
          <RatingDisplay label="Overall" value={review.overallRating} />
        </div>

        {/* Comments Section */}
        <div className="mb-8 prose prose-lg max-w-none"> {/* Use Tailwind Typography plugin for styling */}
          <h3 className="text-xl font-semibold mb-3 text-gray-800">My Thoughts:</h3>
          {typeof review.comments === 'string' ? (
              // Handle simple text field
               <p className="text-gray-700 whitespace-pre-line">{review.comments}</p>
          ) : (
              // Handle Portable Text (rich text) - ensure 'comments' is the correct field name
              review.comments && <PortableText value={review.comments} components={portableTextComponents} />
          )}
        </div>

         {/* Review Images Section */}
         {review.reviewImages && review.reviewImages.length > 0 && (
           <div className="mb-8">
             <h3 className="text-xl font-semibold mb-4 text-gray-800">Photos from My Visit:</h3>
             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               {review.reviewImages.map((image) => {
                  const imgUrl = image?.asset?._ref ? urlFor(image).width(300).height(300).fit('crop').url() : null;
                  if (!imgUrl) return null;
                 return (
                   <div key={image._key || image.asset._ref} className="relative aspect-square rounded overflow-hidden shadow">
                       <Image
                         src={imgUrl}
                         alt="Review image"
                         fill
                         style={{ objectFit: 'cover' }}
                         sizes="(max-width: 768px) 50vw, 33vw"
                       />
                   </div>
                 );
               })}
             </div>
           </div>
         )}

        {/* --- MAP SECTION --- */}
         <div className="mt-8 mb-8">
           <h3 className="text-xl font-semibold mb-3 text-indigo-600">Location:</h3>
           {/* Render the Client Component Wrapper, passing necessary props */}
           <ReviewMapLoader
             coordinates={restaurantCoords}
             popupText={review.restaurant?.name}
           />
         </div>
        {/* --- END MAP SECTION --- */}


        {/* Back Link */}
        <div className="mt-10 text-center">
            <Link href="/" className="text-blue-600 hover:underline">
                ← Back to all reviews
            </Link>
        </div>

      </article>
    </div>
  );
}
// --- End Main Page Component ---

// Optional: Revalidate the page periodically (ISR)
export const revalidate = 3600; // Revalidate every hour (adjust as needed)