import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["http://192.168.1.4:3000"],
  devIndicators: false,
};

export default nextConfig;
