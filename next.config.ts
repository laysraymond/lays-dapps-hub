import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  allowedDevOrigins: ["*.replit.dev", "*.repl.co", "*.sisko.replit.dev", "*.pike.replit.dev"],
  experimental: {
    serverActions: {
      allowedOrigins: ["*.replit.dev", "*.repl.co", "*.sisko.replit.dev"],
    },
  },
};

export default nextConfig;
