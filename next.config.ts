import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    // @base-ui is deep-imported from many UI primitives; this trims unused submodules.
    // lucide-react is already optimized by default in Next.js.
    optimizePackageImports: ["@base-ui/react"],
  },
};

export default nextConfig;
