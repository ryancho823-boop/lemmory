// Bar chart for 0..1 values. Magnitude uses the sequential blue; only a bar that stands out
// (well below `flagBelow`) turns red. Bars show a tooltip on hover.

import { type DayStatus, dayStatus } from "@lemmory/core/analytics";
import type { StudentRecord } from "@lemmory/core/records";
import { pct } from "./ui";

/** Under this many tries, a bar shows the count, not a percentage. */
const FEW_TRIES = 5;

/** Horizontal bars for a 0..1 value with a label on the left and the value on the right. */
export function BarList({
  rows,
  flagBelow,
  unit,
}: {
  rows: { key: string; label: React.ReactNode; value: number | null; hint?: string; href?: string; n?: number }[];
  /**
   * Bars under this value are red; the rest stay neutral. Pass LOW_ACCURACY, the cutoff every page uses.
   */
  flagBelow?: number;
  /** A word after each value, so "73%" says what it counts ("73% right"). */
  unit?: string;
}) {
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => {
        const v = r.value ?? 0;
        // A few tries are shown as a count, in a neutral color: they aren't enough to judge by.
        const few = r.n !== undefined && r.n < FEW_TRIES;
        const flagged = !few && flagBelow !== undefined && r.value !== null && v < flagBelow;
        const color = flagged ? "var(--color-bad)" : "var(--color-seq-400)";
        return (
          <li key={r.key} className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 sm:grid-cols-[minmax(120px,200px)_1fr_auto]">
            <div className="truncate text-sm">{r.label}</div>
            <div className={`text-right text-sm font-semibold tabular-nums sm:order-last ${flagged ? "text-bad" : ""}`}>
              {few ? `${Math.round(v * r.n!)} of ${r.n}` : pct(r.value)}
              {unit && r.value !== null && <span className="font-normal"> {unit}</span>}
            </div>
            <div className="relative col-span-2 h-2.5 bg-ink/6 sm:col-span-1" title={r.hint}>
              <div className="h-full transition-[width] duration-500" style={{ width: `${v * 100}%`, background: few ? "rgb(15 17 33 / 0.2)" : color }} />
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
  few: { bg: "#fbe9a9", label: "1–5 cards left" },
  some: { bg: "var(--color-warn)", label: "6–14 left" },
  many: { bg: "var(--color-bad)", label: "15+ left" },
  today: { bg: "transparent", label: "Today" },
  none: { bg: "rgb(15 17 33 / 0.06)", label: "No cards that day" },
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
    if (st === "few" || st === "some" || st === "many") return `${fmt(d)}: ${m} ${m === 1 ? "card" : "cards"} left undone`;
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
        {(["done", "few", "some", "many", "none"] as const).map((k) => (
          <li key={k} className="flex items-center gap-1.5">
            <span className="size-3 rounded-[4px]" style={{ background: STATUS_STYLE[k].bg }} />
            {STATUS_STYLE[k].label}
          </li>
        ))}
      </ul>
    </div>
  );
}
