import { NextConfig } from "next";
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // Any other Next.js configuration
  reactStrictMode: true,

};

export default withBundleAnalyzer(nextConfig);
