"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { Tex } from "@lemmory/ui/Tex";
import { cx } from "@lemmory/ui/ui";
import { ACCENT, ACCENT_CYCLE } from "@/lib/accents";

/** A small printed card, like the deck in the hero, each with its own color behind it. */
function Printed({ step, tilt, children }: { step: number; tilt: string; children: React.ReactNode }) {
  return (
    <div className={cx("flex h-48 flex-col justify-center rounded-lg border-2 border-ink bg-white p-5", tilt)} style={{ boxShadow: `6px 6px 0 ${ACCENT_CYCLE[step]}` }}>
      {children}
    </div>
  );
}

/** A glimpse of each step, drawn from the real screens. */
export function StepCard({ step }: { step: number }) {
  if (step === 0)
    return (
      <Printed step={0} tilt="-rotate-1">
        <ul className="divide-y divide-line">
          {["Vieta's Formulas", "Power of a Point"].map((name) => (
            <li key={name} className="flex items-center justify-between gap-3 py-2.5 font-semibold">
              {name}
              <span className="flex items-center gap-1 text-sm text-good">
                <Check size={14} strokeWidth={3} /> Assigned
              </span>
            </li>
          ))}
          <li className="flex items-center justify-between gap-3 py-2.5 font-semibold">
            Stars and Bars
            <span className="flex items-center gap-1 rounded bg-ink px-2 py-1 text-sm text-white">
              <Plus size={14} strokeWidth={3} /> Assign
            </span>
          </li>
        </ul>
      </Printed>
    );
  if (step === 1)
    return (
      <Printed step={1} tilt="rotate-[0.75deg]">
        <p className="text-sm font-semibold text-ink/60">Recall</p>
        <div className="mt-3 flex items-center gap-3 text-lg">
          <Tex math="r_1 + r_2 =" />
          <span className="flex-1 rounded-lg border-2 border-good bg-good/5 px-3 py-1.5">
            <Tex math="-\tfrac{b}{a}" />
          </span>
        </div>
        <p className="mt-3 flex items-center gap-1.5 font-semibold text-good">
          <Check size={16} strokeWidth={3} /> Correct
        </p>
      </Printed>
    );
  return (
    <Printed step={2} tilt="-rotate-[0.5deg]">
      <p className="font-semibold">Vieta&apos;s Formulas</p>
      <p className="mt-1 text-ink/70">Next review</p>
      <p className="mt-3 font-display text-4xl">in 14 days</p>
    </Printed>
  );
}

// When one formula comes back, from packages/core/src/srs.ts (FSRS defaults, 90% target). Each list
// is review() run on that pattern of answers: "r" recall, "p" problem, "x" the review that was missed.
// Recheck these if the scheduler's settings change.
const SCENARIOS = [
  {
    id: "right",
    label: "Always right",
    days: { 2: "r", 3: "p", 5: "p", 16: "p", 62: "p" },
    note: "5 reviews in 62 days. Problems start the day after recall sticks, and from there each gap is longer than the last.",
  },
  {
    id: "recall",
    label: "Miss the recall",
    days: { 2: "x", 3: "r", 5: "r", 11: "r", 12: "p", 14: "p", 25: "p", 71: "p" },
    note: "It stays a recall card and comes back the next day. Problems wait until day 12, once it sticks.",
  },
  {
    id: "problem",
    label: "Miss a problem",
    days: { 2: "r", 3: "p", 5: "x", 6: "p", 8: "p", 14: "p", 29: "p", 62: "p" },
    note: "It comes back the next day, then the gaps start small and grow again.",
  },
  {
    id: "twice",
    label: "Miss two in a row",
    days: { 2: "r", 3: "p", 5: "x", 6: "x", 7: "r", 9: "r", 10: "p", 12: "p", 23: "p", 69: "p" },
    note: "Two misses in a row mean the formula itself has faded, so it goes back to recall. Problems return on day 10.",
  },
] as const;

const KINDS = {
  r: { label: "Recall", color: ACCENT.purple },
  p: { label: "Problem", color: ACCENT.blue },
  x: { label: "Missed", color: ACCENT.rose },
};
const DAYS = 90;

/** Every day to scale, so the gaps between reviews are the picture. Pick what happens to see them change. */
export function ReviewCalendar() {
  const [id, setId] = useState<(typeof SCENARIOS)[number]["id"]>("right");
  const scenario = SCENARIOS.find((s) => s.id === id)!;
  const days: Record<number, keyof typeof KINDS> = scenario.days;
  return (
    <figure className="mt-8">
      <div className="flex flex-wrap gap-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={s.id === id}
            onClick={() => setId(s.id)}
            className={cx("rounded-lg border-2 border-ink px-3 py-1.5 text-sm font-semibold transition-colors", s.id === id ? "bg-ink text-white" : "bg-white hover:bg-lemon")}
          >
            {s.label}
          </button>
        ))}
      </div>
      <ol aria-label={`Reviews on days ${Object.keys(days).join(", ")} after the class`} className="mt-5 grid grid-cols-[repeat(10,minmax(0,1fr))] gap-1 sm:grid-cols-[repeat(18,minmax(0,1fr))] sm:gap-1.5">
        {Array.from({ length: DAYS }, (_, day) => {
          const kind = days[day];
          const color = day === 0 ? "var(--color-ink)" : kind && KINDS[kind].color;
          return (
            <li key={day} className={cx("flex aspect-square items-center justify-center rounded-[3px] text-sm font-bold text-white transition-colors duration-200", !color && "bg-ink/[0.08]")} style={color ? { background: color } : undefined}>
              {color ? day : null}
            </li>
          );
        })}
      </ol>
      <figcaption className="mt-4">
        <p aria-live="polite" className="text-lg font-semibold">
          {scenario.note}
        </p>
        <p className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
          {[{ label: "Learned in class", color: "var(--color-ink)" }, ...Object.values(KINDS)].map((k) => (
            <span key={k.label} className="flex items-center gap-2">
              <span className="size-3 rounded-[3px]" style={{ background: k.color }} />
              {k.label}
            </span>
          ))}
        </p>
      </figcaption>
    </figure>
  );
}
