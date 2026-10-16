"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  FastForward,
  Flame,
  GraduationCap,
  Layers,
  LayoutDashboard,
  Library,
  type LucideIcon,
  RotateCcw,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { YOU } from "@/lib/sim";
import { streak } from "@/lib/analytics";
import { DEMO_MAX_DAYS } from "@/lib/demo";
import { SIGNUP_URL } from "@/lib/links";
import { Avatar, cx } from "../ui";

type Role = "student" | "teacher";

const NAV: Record<Role, { href: string; label: string; icon: LucideIcon; exact?: boolean }[]> = {
  student: [
    { href: "/student", label: "Home", icon: LayoutDashboard, exact: true },
    { href: "/student/deck", label: "My deck", icon: Layers },
    { href: "/student/practice", label: "Practice all", icon: Zap },
    { href: "/student/bank", label: "Formula bank", icon: Library },
    { href: "/student/stats", label: "My stats", icon: BarChart3 },
    { href: "/student/leaderboard", label: "Leaderboard", icon: Trophy },
  ],
  teacher: [
    { href: "/teacher", label: "Overview", icon: LayoutDashboard, exact: true },
    { href: "/teacher/assign", label: "Assign formulas", icon: BookOpen },
    { href: "/teacher/formulas", label: "Formula analytics", icon: BarChart3 },
    { href: "/teacher/students", label: "Students", icon: Users },
    { href: "/teacher/leaderboard", label: "Leaderboard", icon: Trophy },
  ],
};

// Day numbers count local calendar days since the epoch, so format them in UTC.
const fmtDay = (day: number) =>
  new Date(day * 86_400_000).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <span
      className="grid place-items-center rounded-md bg-lemon font-extrabold text-ink"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      Σ
    </span>
  );
}

export function Logo({ light }: { light?: boolean }) {
  return (
    <span className={cx("flex items-center gap-2.5 text-lg font-extrabold tracking-tight", light && "text-white")}>
      <LogoMark />
      Lemmory
    </span>
  );
}

export function AppShell({ role, children }: { role: Role; children: React.ReactNode }) {
  const path = usePathname();
  const { ready, you, today, doneToday, nextDay, reset, state } = useStore();
  const s = streak(you.doneDays, today);
  const items = NAV[role];
  const atLimit = state.dayOffset >= DEMO_MAX_DAYS;

  const isActive = (href: string, exact?: boolean) =>
    exact ? path === href || (href === "/student" && path === "/student/review") : path === href || path.startsWith(href + "/");

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[256px_minmax(0,1fr)]">
      {/* Sidebar */}
      <div className="hidden border-r border-line bg-white lg:block">
      <aside className="sticky top-0 flex h-screen flex-col px-4 py-5">
        <Link href="/" className="px-2">
          <Logo />
        </Link>

        <div className="mt-6 grid grid-cols-2 rounded-xl bg-ink/5 p-1 text-sm font-semibold">
          {(["student", "teacher"] as const).map((r) => (
            <Link
              key={r}
              href={`/${r}`}
              className={cx(
                "rounded-lg py-1.5 text-center capitalize transition-colors",
                r === role ? "bg-white text-ink shadow-sm" : "text-ink/50 hover:text-ink",
              )}
            >
              {r}
            </Link>
          ))}
        </div>

        <nav className="mt-6 space-y-0.5">
          {items.map((it) => {
            const active = isActive(it.href, it.exact);
            return (
              <Link
                key={it.href}
                href={it.href}
                className={cx(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                  active ? "bg-ink/[0.07] text-ink" : "text-ink/60 hover:bg-ink/5 hover:text-ink",
                )}
              >
                <it.icon size={18} strokeWidth={2.2} />
                {it.label}
                {it.href === "/student" && ready && !doneToday && (
                  <span className="ml-auto size-2 rounded-full bg-lemon-deep" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-3">
          <div className="rounded-xl border border-dashed border-ink/15 p-3">
            <p className="text-sm font-semibold">Demo controls</p>
            <p className="mt-1 text-xs text-ink/50">
              {ready ? fmtDay(today) : "\u00a0"}
              {state.dayOffset > 0 && ` · ${state.dayOffset} day${state.dayOffset === 1 ? "" : "s"} ahead`}
            </p>
            <div className="mt-2 grid gap-1">
              <button
                onClick={nextDay}
                disabled={atLimit}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm font-medium text-ink/70 hover:bg-ink/5 disabled:pointer-events-none disabled:opacity-40"
              >
                <FastForward size={15} /> Skip to tomorrow
              </button>
              {atLimit && (
                <p className="px-2 text-xs text-ink/50">
                  The demo runs {DEMO_MAX_DAYS} days ahead.{" "}
                  <a href={SIGNUP_URL} className="font-semibold text-ink underline">
                    Start a pilot
                  </a>{" "}
                  to use it with a real class.
                </p>
              )}
              <button
                onClick={() => confirm("Reset all demo data?") && reset()}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm font-medium text-ink/70 hover:bg-ink/5"
              >
                <RotateCcw size={15} /> Reset demo
              </button>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl px-2 py-1">
            {role === "student" ? (
              <>
                <Avatar name={YOU.name} you />
                <p className="min-w-0 flex-1 truncate text-sm font-semibold">{YOU.name}</p>
                {ready && (
                  <span className={cx("flex items-center gap-1 text-sm font-bold", s ? "text-ink" : "text-ink/35")}>
                    <Flame size={16} className={s ? "fill-lemon-deep text-lemon-deep" : ""} />
                    {s}
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="grid size-8 place-items-center rounded-full bg-ink text-white">
                  <GraduationCap size={16} />
                </span>
                <p className="min-w-0 truncate text-sm font-semibold">Ms. Chen</p>
              </>
            )}
          </div>
        </div>
      </aside>
      </div>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/">
            <Logo />
          </Link>
          <div className="ml-auto grid grid-cols-2 rounded-lg bg-ink/5 p-0.5 text-xs font-semibold">
            {(["student", "teacher"] as const).map((r) => (
              <Link key={r} href={`/${r}`} className={cx("rounded-md px-2.5 py-1 capitalize", r === role ? "bg-white shadow-sm" : "text-ink/50")}>
                {r}
              </Link>
            ))}
          </div>
          <button onClick={nextDay} disabled={atLimit} aria-label="Skip to tomorrow" className="rounded-lg p-1.5 text-ink/50 hover:bg-ink/5 disabled:opacity-30">
            <FastForward size={18} />
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={cx(
                "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold",
                isActive(it.href, it.exact) ? "bg-ink/[0.07] text-ink" : "text-ink/60",
              )}
            >
              <it.icon size={15} />
              {it.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 lg:py-10">{children}</main>
    </div>
  );
}
