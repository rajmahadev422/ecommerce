import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'fakestoreapi.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
    ],
  },
  // Next.js 15: enable React compiler (stable in 15.x)
  reactStrictMode: true,
  // Turbopack is default dev bundler in Next.js 15 via `next dev --turbopack`
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

export default nextConfig
