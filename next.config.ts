import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    reactCompiler: true,
    staleTimes: {
      dynamic: 30,
    },
  },
};

export default nextConfig;
