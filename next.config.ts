import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // In production, this runs on app.shelvian.co subdomain
  // The marketing site (shelvian.co) is a separate deployment
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
