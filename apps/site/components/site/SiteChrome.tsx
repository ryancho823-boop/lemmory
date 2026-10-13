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
    <header className="sticky top-0 z-30 border-b border-line/70 bg-white/85 backdrop-blur-md">
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
                "rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
                path === t.href ? "bg-ink text-white" : "text-ink/55 hover:bg-ink/5 hover:text-ink",
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
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-lemon px-4 text-sm font-bold text-ink shadow-[inset_0_-2px_0_rgb(0_0_0/0.12)] hover:brightness-105"
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
            className={cx("shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold", path === t.href ? "bg-ink text-white" : "text-ink/55")}
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
    <footer className="border-t border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-ink/45">
        <Logo />
        <p>Spaced-repetition practice for competition math. Not affiliated with the MAA or AoPS.</p>
      </div>
    </footer>
  );
}

export function PageIntro({ eyebrow, title, sub }: { eyebrow: string; title: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-lemon-deep">{eyebrow}</p>
      <h1 className="mt-3 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">{title}</h1>
      {sub && <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink/60">{sub}</p>}
    </div>
  );
}

export function DemoCTA({ title = "See it for yourself", sub = "Do a review as a student, then switch to the teacher view and watch your results show up." }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pb-24">
      <div className="relative overflow-hidden rounded-[28px] bg-lemon-soft px-6 py-14 text-center sm:px-12">
        <div className="pointer-events-none absolute -left-20 -top-24 size-72 rounded-full bg-lemon/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-10 size-72 rounded-full bg-lemon/40 blur-3xl" />
        <h2 className="relative text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h2>
        <p className="relative mx-auto mt-3 max-w-lg text-ink/60">{sub}</p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/student" className="inline-flex h-12 items-center gap-2 rounded-xl bg-ink px-6 font-bold text-white hover:bg-ink/85">
            Student demo <ArrowRight size={18} />
          </Link>
          <Link href="/teacher" className="inline-flex h-12 items-center gap-2 rounded-xl border border-ink/15 bg-white px-6 font-semibold hover:border-ink/30">
            Teacher demo <ArrowRight size={18} />
          </Link>
        </div>
        <p className="relative mt-6 text-ink/70">
          Ready for your own class?{" "}
          <a href={SIGNUP_URL} className="font-semibold text-ink underline">
            Sign up for a free pilot
          </a>
        </p>
      </div>
    </section>
  );
}
