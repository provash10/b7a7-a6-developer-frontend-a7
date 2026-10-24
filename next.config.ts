import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: "/provider",
        destination: "/recruiter",
        permanent: false,
      },
      {
        source: "/provider/earnings",
        destination: "/recruiter/earnings",
        permanent: false,
      },
      {
        source: "/provider/profile",
        destination: "/recruiter/profile",
        permanent: false,
      },
      {
        source: "/about",
        destination: "/about-us",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
