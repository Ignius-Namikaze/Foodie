// lib/image.js
import imageUrlBuilder from '@sanity/image-url';
import { client } from './sanity.client'; // Adjust path if needed

const builder = imageUrlBuilder(client);

export function urlFor(source) {
  if (!source?.asset?._ref) {
    // Return a placeholder or null if the image source is invalid
    console.warn("Invalid image source passed to urlFor:", source);
    return null; // Or return '/placeholder-image.png';
  }
  return builder.image(source);
}