"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/shell/AppShell";
import { cx } from "@/components/ui";
import { SIGNUP_URL } from "@/lib/links";

const TABS = [
  { href: "/", label: "Overview" },
  { href: "/users", label: "For users" },
];

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
                path === t.href ? "text-ink underline decoration-lemon-deep decoration-2" : "text-ink/60 hover:text-ink",
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
            className={cx("shrink-0 px-3 py-1.5 text-sm font-semibold underline-offset-[6px]", path === t.href ? "underline decoration-lemon-deep decoration-2" : "text-ink/60")}
          >
            {t.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-ink/60">
        <Logo />
        <p>Spaced-repetition practice for competition math. Not affiliated with the MAA or AoPS.</p>
      </div>
    </footer>
  );
}

export function PageIntro({ title, sub }: { title: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">{title}</h1>
      {sub && <p className="mt-5 max-w-2xl text-lg leading-relaxed">{sub}</p>}
    </div>
  );
}

export function DemoCTA({ title = "See it for yourself", sub = "Do a review as a student, then switch to the teacher view and watch your results show up." }) {
  return (
    <section className="bg-lemon-soft">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-8 px-5 py-20">
        <div className="max-w-xl">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-3 text-lg text-ink/80">{sub}</p>
          <p className="mt-4 text-ink/80">
            Ready for your own class?{" "}
            <a href={SIGNUP_URL} className="font-semibold text-ink underline underline-offset-2">
              Start a free pilot
            </a>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/student" className="inline-flex h-12 items-center gap-2 rounded-lg bg-ink px-6 font-bold text-white hover:bg-ink/85">
            Student demo <ArrowRight size={18} />
          </Link>
          <Link href="/teacher" className="inline-flex h-12 items-center gap-2 rounded-lg border border-ink/20 bg-white px-6 font-semibold hover:border-ink/40">
            Teacher demo <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
