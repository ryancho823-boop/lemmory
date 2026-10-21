"use client";

// The demo's version of packages/ui/src/Leaderboard.tsx.
// It uses the demo's own data (lib/), so the full formula bank and the database never reach the demo.

import { useState } from "react";
import { useStore } from "@/lib/store";
import { competitionPoints, summary } from "@lemmory/core/analytics";
import { InfoTip } from "@lemmory/ui/InfoTip";
import { Panel, Segmented, cx } from "@lemmory/ui/ui";

type Range = "week" | "all";

function useRows(range: Range, teacher: boolean) {
  const { students, today, state } = useStore();
  const rows = students.map((s) => {
    const m = summary(s, today);
    const xp = range === "week" ? competitionPoints(s, state.competition, today) : m.xpTotal;
    return { id: s.id, name: s.isYou && !teacher ? "You" : s.name, fullName: s.name, you: s.isYou && !teacher, xp, streak: m.streak };
  });
  return [...rows].sort((a, b) => b.xp - a.xp).map((r, i) => ({ ...r, rank: i + 1 }));
}

/** How many places get the highlighted box. */
const TOP = 5;

export function Leaderboard({ compact = false, teacher = false }: { compact?: boolean; teacher?: boolean }) {
  const [range, setRange] = useState<Range>("week");
  const rows = useRows(range, teacher);
  const me = rows.find((r) => r.you);
  const top = rows.slice(0, TOP);
  // The compact card shows the top 5 plus your own row if you're further down.
  const rest = compact ? (me && me.rank > TOP ? [me] : []) : rows.slice(TOP);

  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-line bg-paper px-5 py-2.5">
        <h2 className="flex items-center gap-1 text-[16px] font-bold">
          Leaderboard
          <InfoTip title="How scoring works" align="left">
            <b className="text-ink">10 points per assigned card</b>, however many tries it takes. Finish the day&apos;s review for a{" "}
            <b className="text-ink">streak bonus</b>: +5 per day of your streak, up to +100. Cards you add yourself don&apos;t earn
            points. Your teacher can start a new game anytime; streaks carry over.
          </InfoTip>
        </h2>
        {!compact && (
          <Segmented value={range} onChange={setRange} options={[{ value: "week", label: "This game" }, { value: "all", label: "All time" }]} />
        )}
      </div>

      <div className="p-3">
        <ol className="overflow-hidden rounded-xl border-2 border-lemon">
          {top.map((r) => (
            <Row key={r.id} r={r} />
          ))}
        </ol>
        {rest.length > 0 && (
          <ol className="mt-2">
            {rest.map((r) => (
              <Row key={r.id} r={r} />
            ))}
          </ol>
        )}
      </div>
    </Panel>
  );
}

function Row({ r }: { r: ReturnType<typeof useRows>[number] }) {
  return (
    <li className={cx("flex items-center gap-3 px-3 py-2.5", r.you && "font-semibold")}>
      <span className="w-6 text-right tabular-nums">{r.rank}</span>
      <span className="min-w-0 flex-1 truncate">{r.name}</span>
      <span className="tabular-nums">{r.xp} pts</span>
    </li>
  );
}
