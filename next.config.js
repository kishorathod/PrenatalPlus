/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Temporarily ignore TypeScript errors during build
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['uploadthing.com', 'utfs.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
}

module.exports = nextConfig


