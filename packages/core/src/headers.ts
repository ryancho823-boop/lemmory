// Security headers for all three sites (each next.config.ts uses this).
//
// The content security policy is the one that matters most for a site with students on it: it
// stops a page from loading scripts from, or sending forms or data to, anywhere but Lemmory, and
// stops other sites from putting Lemmory in a frame.
//
// With a `nonce`, only scripts carrying this request's nonce run, so a script injected into a page
// can't. The student and teacher apps do this (see proxy.ts in each). The main site is prerendered,
// which rules out a per-request nonce, so it allows inline scripts; it has no accounts or user text.
// Styles stay inline-friendly everywhere: KaTeX and MathLive set them on every formula.

export function contentSecurityPolicy(nonce?: string, dev = process.env.NODE_ENV !== "production") {
  return [
    "default-src 'self'",
    // The dev server's hot reload needs eval and a websocket; production doesn't.
    `script-src 'self' ${nonce ? `'nonce-${nonce}' 'strict-dynamic'` : "'unsafe-inline'"}${dev ? " 'unsafe-eval'" : ""}`,
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
}

/** `csp: false` for an app whose proxy sets the policy itself, with a nonce. */
export function securityHeaders({ csp = true, dev = process.env.NODE_ENV !== "production" } = {}) {
  return [
    ...(csp ? [{ key: "Content-Security-Policy", value: contentSecurityPolicy(undefined, dev) }] : []),
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
    ...(dev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" }]),
  ];
}
