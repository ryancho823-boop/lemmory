import Link from "next/link";
import { Logo } from "./Shell";

/** The 404 page for every site: the logo, a plain sentence, and a way home. */
export function NotFoundPage({ home = "/", homeLabel = "Go home" }: { home?: string; homeLabel?: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas px-5 text-center">
      <Link href={home}>
        <Logo />
      </Link>
      <div>
        <h1 className="text-3xl font-extrabold">This page doesn&apos;t exist</h1>
        <p className="mt-2 text-ink/75">The link may be old, or the address may have a typo.</p>
      </div>
      <Link href={home} className="inline-flex h-11 items-center rounded-lg bg-ink px-5 font-semibold text-white hover:bg-ink/85">
        {homeLabel}
      </Link>
    </div>
  );
}
