import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jobzshala-gcc-bucket.s3.ap-south-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
