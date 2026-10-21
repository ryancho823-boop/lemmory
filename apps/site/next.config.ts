import type { NextConfig } from "next";
import { securityHeaders } from "@lemmory/core/headers";

const nextConfig: NextConfig = {
  headers: async () => [{ source: "/:path*", headers: securityHeaders() }],
  /* config options here */
  cacheComponents: true,
  // The page used to be "For academies".
  redirects: async () => [{ source: "/academies", destination: "/users", permanent: true }],
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
