import type { NextConfig } from "next";
import { securityHeaders } from "@lemmory/core/headers";

const nextConfig: NextConfig = {
  headers: async () => [{ source: "/:path*", headers: securityHeaders() }],
  /* config options here */
  cacheComponents: true,
  // The pricing page used to be "For academies", then "For users".
  redirects: async () => [
    { source: "/academies", destination: "/pricing", permanent: true },
    { source: "/users", destination: "/pricing", permanent: true },
    // The demo opens straight on the student side (it has a Student | Teacher switch).
    { source: "/demo", destination: "/student", permanent: false },
  ],
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
