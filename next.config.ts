import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Görsel optimizasyonu için izin verilen domainler
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
};

export default nextConfig;
