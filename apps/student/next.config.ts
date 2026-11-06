import type { NextConfig } from "next";
import { securityHeaders } from "@lemmory/core/headers";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // The content security policy comes from proxy.ts, with a fresh nonce per request.
  headers: async () => [{ source: "/:path*", headers: securityHeaders({ csp: false }) }],
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
