// Security headers for all three sites (each next.config.ts uses this).
//
// The content security policy is the one that matters most for a site with students on it: it
// stops a page from loading scripts from, or sending forms or data to, anywhere but Lemmory, and
// stops other sites from putting Lemmory in a frame. Next.js needs inline scripts and styles to
// work, so those are allowed; everything else is locked to the site's own address.

export function securityHeaders(dev = process.env.NODE_ENV !== "production") {
  const csp = [
    "default-src 'self'",
    // The dev server's hot reload needs eval and a websocket; production doesn't.
    `script-src 'self' 'unsafe-inline'${dev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src 'self'${dev ? " ws: wss:" : ""}`,
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");
  return [
    { key: "Content-Security-Policy", value: csp },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
    ...(dev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]),
  ];
}
