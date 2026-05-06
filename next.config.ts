import type { NextConfig } from "next";

const SYSTEM_URL = process.env.NEXT_PUBLIC_SYSTEM_URL ?? "https://system.miraireach.marketing";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/login",
        destination: SYSTEM_URL,
        permanent: false,
      },
      {
        source: "/lp/localreach",
        destination: "/localreach",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "fastly.picsum.photos",
      },
      {
        protocol: "https",
        hostname: "api.qrserver.com",
      },
    ],
  },
};

export default nextConfig;
