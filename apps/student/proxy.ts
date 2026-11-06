import { NextResponse, type NextRequest } from "next/server";
import { contentSecurityPolicy } from "@lemmory/core/headers";

/** A fresh script nonce for every page. Next.js reads it from this header and adds it to its own scripts. */
export function proxy(request: NextRequest) {
  const csp = contentSecurityPolicy(btoa(crypto.randomUUID()));
  const headers = new Headers(request.headers);
  headers.set("Content-Security-Policy", csp);
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

// Pages only: static files and link prefetches run no inline scripts.
export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image|health|icon|apple-icon|mathlive).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
