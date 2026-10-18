"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Frame, SideHeading } from "@lemmory/ui/Shell";
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

  const other: Role = role === "student" ? "teacher" : "student";
  const control = "block underline disabled:pointer-events-none disabled:no-underline disabled:opacity-40";

  return (
    <Frame
      home={`/${role}`}
      tag="Demo"
      nav={items.map((it) => ({
        href: it.href,
        label: it.label,
        active: isActive(it.href, it.exact),
        due: it.href === "/student" && ready && !doneToday,
      }))}
      below={
        <>
          <SideHeading>Demo</SideHeading>
          <div className="space-y-1 px-4 py-2.5 text-[15px] text-ink">
            <p>
              {role === "student" ? (
                <>
                  Signed in as <b>{YOU.name}</b>
                  {ready && `, ${s}-day streak`}
                </>
              ) : (
                <>
                  Signed in as <b>Ms. Chen</b>
                </>
              )}
            </p>
            <Link href={`/${other}`} className="block underline">
              Switch to the {other} view
            </Link>
            <p className="pt-2 font-bold">{ready ? fmtDay(today) : "\u00a0"}</p>
            {state.dayOffset > 0 && <p>{`${state.dayOffset} day${state.dayOffset === 1 ? "" : "s"} ahead of today`}</p>}
            <button onClick={nextDay} disabled={atLimit} className={control}>
              Skip to tomorrow
            </button>
            {atLimit && (
              <p className="text-sm">
                The demo runs {DEMO_MAX_DAYS} days ahead.{" "}
                <a href={SIGNUP_URL} className="font-semibold underline">
                  Start a pilot
                </a>{" "}
                to use it with a real class.
              </p>
            )}
            <button onClick={() => confirm("Reset all demo data?") && reset()} className={control}>
              Reset demo
            </button>
          </div>
        </>
      }
      mobileExtra={
        <>
          <Link href={`/${other}`} className="underline capitalize">
            {other} view
          </Link>
          <button onClick={nextDay} disabled={atLimit} className="underline disabled:opacity-40">
            Next day
          </button>
        </>
      }
    >
      {children}
    </Frame>
  );
}
