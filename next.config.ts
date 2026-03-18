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
      {
        protocol: "https",
        hostname: "logo.ifetchly.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/signup/brand/complete", destination: "/brand/signup-complete", permanent: true },
      { source: "/onboarding/brand", destination: "/brand/onboarding", permanent: true },
    ];
  },
};

export default nextConfig;
