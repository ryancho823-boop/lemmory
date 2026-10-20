"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Frame } from "@lemmory/ui/Shell";
import { useStore } from "@/lib/store";
import { YOU } from "@/lib/sim";
import { streak } from "@/lib/analytics";
import { DEMO_MAX_DAYS } from "@/lib/demo";
import { SIGNUP_URL } from "@/lib/links";
import { cx } from "@lemmory/ui/ui";

type Role = "student" | "teacher";

const NAV: Record<Role, { href: string; label: string; exact?: boolean }[]> = {
  student: [
    { href: "/student", label: "Home", exact: true },
    { href: "/student/deck", label: "My deck" },
    { href: "/student/practice", label: "Practice all" },
    { href: "/student/bank", label: "Formula bank" },
    { href: "/student/stats", label: "My stats" },
    { href: "/student/leaderboard", label: "Leaderboard" },
  ],
  teacher: [
    { href: "/teacher", label: "Overview", exact: true },
    { href: "/teacher/assign", label: "Assign formulas" },
    { href: "/teacher/formulas", label: "Formula analytics" },
    { href: "/teacher/students", label: "Students" },
    { href: "/teacher/leaderboard", label: "Leaderboard" },
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

  const small = "h-8 rounded-lg border border-line bg-white px-3 text-sm font-semibold text-ink/75 hover:border-ink/30 hover:text-ink disabled:pointer-events-none disabled:opacity-40";

  // Student | Teacher: both views share one simulated class.
  const switcher = (
    <div className="grid grid-cols-2 rounded-lg border border-line p-0.5 text-sm font-semibold">
      {(["student", "teacher"] as const).map((r) => (
        <Link
          key={r}
          href={`/${r}`}
          aria-current={r === role ? "page" : undefined}
          className={cx("rounded-md py-1.5 text-center capitalize transition-colors", r === role ? "bg-ink text-white" : "text-ink/60 hover:text-ink")}
        >
          {r}
        </Link>
      ))}
    </div>
  );

  return (
    <Frame
      home={`/${role}`}
      tag="Demo"
      above={switcher}
      nav={items.map((it) => ({
        href: it.href,
        label: it.label,
        active: isActive(it.href, it.exact),
        due: it.href === "/student" && ready && !doneToday,
      }))}
      below={
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-semibold">{role === "student" ? YOU.name : "Ms. Chen"}</p>
            <p className="text-ink/55">{role === "student" ? (ready ? `${s}-day streak` : "\u00a0") : "Teacher"}</p>
          </div>
          <div>
            <p className="text-ink/55">
              {ready ? fmtDay(today) : "\u00a0"}
              {state.dayOffset > 0 && ` (+${state.dayOffset})`}
            </p>
            <div className="mt-1.5 flex gap-2">
              <button onClick={nextDay} disabled={atLimit} className={small}>
                Next day
              </button>
              <button onClick={() => confirm("Reset all demo data?") && reset()} className={small}>
                Reset
              </button>
            </div>
            {atLimit && (
              <p className="mt-2 text-ink/60">
                The demo runs {DEMO_MAX_DAYS} days ahead.{" "}
                <a href={SIGNUP_URL} className="font-semibold text-ink underline">
                  Start a free trial
                </a>{" "}
                to use it with a real class.
              </p>
            )}
          </div>
        </div>
      }
      mobileExtra={
        <button onClick={nextDay} disabled={atLimit} className={small}>
          Next day
        </button>
      }
    >
      {children}
    </Frame>
  );
}
