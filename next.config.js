/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Or based on your create-next-app choice
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

module.exports = nextConfig; // Ensure tailwind is configured elsewhere if needed or add plugin here too if not separate postcss config