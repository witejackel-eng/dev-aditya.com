import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/work/real-estate-atelier',
        destination: '/work/aarohan-legal',
        permanent: true,
      },
      {
        source: '/work/driftwear-ecommerce',
        destination: '/work/dust-signal',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
