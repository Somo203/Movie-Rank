// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co', // Keep this if you use placehold.co for other purposes
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Removed 'image/png' and 'image/jpeg' as they are not valid here.
    // 'formats' is for output optimization formats.
    formats: ['image/webp', 'image/avif'],
  },
  /* other config options here */
};

export default nextConfig;
