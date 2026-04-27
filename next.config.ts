import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: false, // ✅ AICI este corect
  images: {
    unoptimized: true,
  },
};

export default nextConfig;