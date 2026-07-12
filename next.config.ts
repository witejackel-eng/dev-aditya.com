import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Remove X-Powered-By header for security */
  poweredByHeader: false,

  /** Enforce trailing slash consistency (no trailing slashes) */
  trailingSlash: false,

  /** Compression enabled (default in production, explicit for clarity) */
  compress: true,

  /** Image optimization configuration */
  images: {
    formats: ['image/avif', 'image/webp'],
    /** Allow Vercel and the canonical domain for image optimization */
    remotePatterns: [
      { protocol: 'https', hostname: 'dev-aditya-com.vercel.app' },
      { protocol: 'https', hostname: 'dev-aditya.com' },
    ],
  },

  /** Rewrites for llms.txt and feed.xml (App Router doesn't allow dots in dir names) */
  async rewrites() {
    return [
      { source: '/llms.txt', destination: '/api/llms-txt' },
      { source: '/feed.xml', destination: '/api/feed-xml' },
    ];
  },

  /** Security and caching headers */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          /** Prevent MIME-type sniffing */
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          /** Prevent clickjacking — allow same-origin framing only */
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          /** Enable browser XSS filtering */
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          /** Referrer policy for privacy */
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          /** Permissions policy — restrict features not needed */
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        /** Long-lived cache for static assets */
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        /** Cache fonts for a year */
        source: '/fonts/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;
