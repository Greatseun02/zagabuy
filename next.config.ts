import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // eslint: {
  //   ignoreDuringBuilds: true,
  // },
  images: {
    remotePatterns: [
      new URL("https://zagabuy-qsa.s3.eu-north-1.amazonaws.com"),
    ],
  },
};

export default nextConfig;
