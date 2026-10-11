import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['192.168.0.176', '10.132.109.230', '192.168.1.3', '192.168.*.*'],
};

export default nextConfig;
