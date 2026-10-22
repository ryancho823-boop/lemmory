"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/shell/AppShell";
import { cx } from "@lemmory/ui/ui";
import { CONTACT_EMAIL } from "@/lib/links";

// `also` lists other pages that belong under a tab (Plan details sits under Pricing).
const TABS = [
  { href: "/", label: "Overview", also: [] as string[] },
  { href: "/pricing", label: "Pricing", also: ["/plans"] },
];
const isCurrent = (t: (typeof TABS)[number], path: string) => path === t.href || t.also.includes(path);

export function SiteHeader() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3.5">
        <Link href="/">
          <Logo />
        </Link>
        <nav className="hidden flex-1 justify-center gap-1 md:flex">
          {TABS.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className={cx(
                "px-3 py-1.5 text-[15px] font-semibold underline-offset-[6px] transition-colors",
                isCurrent(t, path) ? "text-ink underline decoration-lemon-deep decoration-2" : "text-ink/60 hover:text-ink",
              )}
            >
              {t.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link href="/demo" className="hidden h-10 items-center rounded-xl border border-line bg-white px-4 text-sm font-semibold hover:border-ink/30 sm:inline-flex">
            Live demo
          </Link>
          {/* One way in: the login page sends people without an account to sign up. */}
          <Link
            href="/login"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-lemon px-4 text-sm font-bold text-ink hover:brightness-105"
          >
            Log in <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-4 pb-2.5 md:hidden">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={cx("shrink-0 px-3 py-1.5 text-sm font-semibold underline-offset-[6px]", isCurrent(t, path) ? "underline decoration-lemon-deep decoration-2" : "text-ink/60")}
          >
            {t.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-ink/60">
        <Logo />
        <div className="sm:text-right">
          <p>Spaced-repetition practice for competition math. Not affiliated with the MAA or AoPS.</p>
          <p className="mt-1 flex flex-wrap gap-x-4 sm:justify-end">
            {FOOTER_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="font-semibold text-ink hover:underline">
                {l.label}
              </Link>
            ))}
          </p>
          <p className="mt-1">
            Questions? Email{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-ink underline underline-offset-2">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
