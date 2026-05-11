import type { NextConfig } from "next";
import path from "node:path";

const SYSTEM_URL = process.env.NEXT_PUBLIC_SYSTEM_URL ?? "https://system.miraireach.marketing";

const nextConfig: NextConfig = {
  /** Prefer this app root when a parent directory has another lockfile (avoids wrong tracing root). */
  outputFileTracingRoot: path.join(process.cwd()),
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
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
