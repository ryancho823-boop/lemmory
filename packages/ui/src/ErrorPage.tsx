"use client";

import Link from "next/link";
import { Logo } from "./Shell";

/** What a crashed page shows instead of Next's bare "Application error": a plain sentence and two ways out. */
export function ErrorPage({ reset, home = "/" }: { reset: () => void; home?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas px-5 text-center">
      <Link href={home}>
        <Logo />
      </Link>
      <div>
        <h1 className="text-3xl font-extrabold">Something went wrong</h1>
        <p className="mt-2 max-w-sm text-ink/75">Nothing you did is lost. Try again, and if it keeps happening, come back in a few minutes.</p>
      </div>
      <div className="flex gap-3">
        <button onClick={reset} className="inline-flex h-11 items-center rounded-lg bg-ink px-5 font-semibold text-white hover:bg-ink/85">
          Try again
        </button>
        <Link href={home} className="inline-flex h-11 items-center rounded-lg border border-ink px-5 font-semibold hover:bg-ink/5">
          Go home
        </Link>
      </div>
    </div>
  );
}
