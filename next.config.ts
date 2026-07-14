import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/work/real-estate-atelier',
        destination: '/work/aarohan-legal',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
