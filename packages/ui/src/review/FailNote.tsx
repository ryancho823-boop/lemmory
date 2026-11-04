"use client";

/**
 * Shown when an answer didn't go through. The server's own reason isn't visible to the browser
 * (Next hides the message of a failed action), so this tells an offline browser apart from the
 * likeliest other cause and always offers a way out.
 */
export function FailNote({ onRetry }: { onRetry?: () => void }) {
  const offline = typeof navigator !== "undefined" && !navigator.onLine;
  return (
    <p role="alert" className="mt-4 text-sm font-semibold text-bad">
      {offline
        ? "You're offline. Check your connection, then try again."
        : "That didn't go through. Try again; if it keeps happening, reload the page. Your free trial or class may have ended: see Plan & classes."}{" "}
      <button type="button" onClick={onRetry ?? (() => window.location.reload())} className="underline">
        {onRetry ? "Try again" : "Reload"}
      </button>
    </p>
  );
}
