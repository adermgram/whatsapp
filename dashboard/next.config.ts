import type { NextConfig } from "next";

// The API (NestJS) runs separately. The browser only ever talks to THIS server, which forwards /api/* to the
// API. That keeps everything on one origin, so the login cookie stays httpOnly + SameSite and needs no CORS.
const API_URL = process.env.API_URL ?? "http://localhost:3000";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${API_URL}/api/:path*` }];
  },
  experimental: {
    // Photos are uploaded one at a time (each is shrunk in the browser first), so they stay far below this.
    proxyClientMaxBodySize: "12mb",
  },
};

export default nextConfig;
