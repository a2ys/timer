import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/shared/:shareId",
        destination: "/shared/[shareId]",
      },
    ];
  },
};

export default nextConfig;
