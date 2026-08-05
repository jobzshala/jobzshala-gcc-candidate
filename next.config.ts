import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Next 16 dev server blocks JS/HMR resources for any origin other than
  // localhost by default — testing this dev server from another device on
  // the LAN (via this machine's network IP) would otherwise load the HTML
  // shell but never hydrate, silently breaking every client interaction
  // (form submits fall back to native GET, onClick handlers never attach).
  allowedDevOrigins: ["192.168.1.6"],
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
