// Bar chart for 0..1 values. Magnitude uses the sequential blue; status colors only
// appear next to the printed value. Bars show a tooltip on hover.

import { type DayStatus, dayStatus } from "@lemmory/core/analytics";
import type { StudentRecord } from "@lemmory/core/records";
import { pct } from "./ui";

/** Horizontal bars for a 0..1 value with a label on the left and the value on the right. */
export function BarList({
  rows,
  tone = "seq",
}: {
  rows: { key: string; label: React.ReactNode; value: number | null; hint?: string; href?: string }[];
  /** "status" colors bars by good / warning / critical thresholds (value text is always shown). */
  tone?: "seq" | "status";
}) {
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => {
        const v = r.value ?? 0;
        const color =
          tone === "seq" ? "var(--color-seq-400)" : v >= 0.8 ? "var(--color-good)" : v >= 0.65 ? "var(--color-warn)" : "var(--color-bad)";
        return (
          <li key={r.key} className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 sm:grid-cols-[minmax(120px,200px)_1fr_auto]">
            <div className="truncate text-sm">{r.label}</div>
            <div className="text-right text-sm font-semibold tabular-nums sm:order-last">{pct(r.value)}</div>
            <div className="relative col-span-2 h-2.5 rounded-full bg-ink/6 sm:col-span-1" title={r.hint}>
              <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${Math.max(v * 100, 2)}%`, background: color }} />
              {r.hint && (
                <span className="pointer-events-none absolute -top-8 left-0 z-10 hidden whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-xs text-white group-hover:block">
                  {r.hint}
                </span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

const STATUS_STYLE: Record<DayStatus, { bg: string; label: string }> = {
  done: { bg: "var(--color-good)", label: "All done" },
  few: { bg: "#9fdc9f", label: "5 or fewer missed" },
  some: { bg: "var(--color-warn)", label: "6–14 missed" },
  many: { bg: "var(--color-bad)", label: "15+ missed" },
  today: { bg: "transparent", label: "Today" },
  none: { bg: "rgb(15 17 33 / 0.06)", label: "No cards yet" },
};
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const DAY_MS = 86_400_000;

/** One column per week, one row per weekday, colored by how many assigned cards were missed. */
export function WeekGrid({ student, today, weeks = 5 }: { student: StudentRecord; today: number; weeks?: number }) {
  const weekday = (d: number) => new Date(d * DAY_MS).getUTCDay();
  const start = today - weekday(today) - (weeks - 1) * 7;
  const fmt = (d: number) => new Date(d * DAY_MS).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  const tip = (d: number, st: DayStatus) => {
    const m = student.missed[d];
    if (st === "few" || st === "some" || st === "many") return `${fmt(d)}: ${m} missed`;
    return `${fmt(d)}: ${STATUS_STYLE[st].label}`;
  };

  return (
    <div>
      <div className="flex gap-1.5">
        <div className="flex flex-col gap-1.5 pr-1">
          {WEEKDAYS.map((w, i) => (
            <span key={i} className="grid size-6 place-items-center text-[10px] font-semibold text-ink/35">
              {w}
            </span>
          ))}
        </div>
        {Array.from({ length: weeks }, (_, w) => (
          <div key={w} className="flex flex-col gap-1.5">
            {Array.from({ length: 7 }, (_, i) => {
              const d = start + w * 7 + i;
              if (d > today) return <span key={i} className="size-6" />;
              const st = dayStatus(student, d, today);
              return (
                <span
                  key={i}
                  title={tip(d, st)}
                  className={`size-6 rounded-md ${st === "today" ? "border-2 border-dashed border-ink/30" : ""}`}
                  style={{ background: STATUS_STYLE[st].bg }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ink/55">
        {(["done", "few", "some", "many"] as const).map((k) => (
          <li key={k} className="flex items-center gap-1.5">
            <span className="size-3 rounded-[4px]" style={{ background: STATUS_STYLE[k].bg }} />
            {STATUS_STYLE[k].label}
          </li>
        ))}
      </ul>
    </div>
  );
}
