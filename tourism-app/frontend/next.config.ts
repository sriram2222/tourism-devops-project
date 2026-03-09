import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",   // ⭐ add this

  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "127.0.0.1" },
    ],
    unoptimized: true,
  },
};

export default nextConfig;