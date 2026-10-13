"use client";

import { useState } from "react";
import type { LeaderRow } from "@lemmory/core/analytics";
import { InfoTip } from "./InfoTip";
import { Avatar, Panel, Segmented, cx } from "./ui";

type Range = "game" | "all";

/** How many places get the yellow border. */
const TOP = 5;

/** Built from rows computed on the server, so students never receive classmates' review history. */
export function Leaderboard({ rows: raw, compact = false }: { rows: LeaderRow[]; gameAge?: number; compact?: boolean }) {
  const [range, setRange] = useState<Range>("game");
  const rows = raw
    .map((r) => ({ ...r, xp: range === "game" ? r.game : r.total, label: r.you ? "You" : r.name }))
    .sort((a, b) => b.xp - a.xp || a.name.localeCompare(b.name))
    .map((r, i) => ({ ...r, rank: i + 1 }));
  const me = rows.find((r) => r.you);
  const top = rows.slice(0, TOP);
  // The compact card shows the top 5 plus your own row if you're further down.
  const rest = compact ? (me && me.rank > TOP ? [me] : []) : rows.slice(TOP);

  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 pt-5">
        <h2 className="flex items-center gap-1 text-[17px] font-semibold">
          Leaderboard
          <InfoTip title="How scoring works" align="left">
            <b className="text-ink">10 points per assigned card</b>, however many tries it takes. Finish the day&apos;s review for a{" "}
            <b className="text-ink">streak bonus</b>: +5 per day of your streak, up to +100. Cards you add yourself don&apos;t earn
            points. Your teacher can start a new game anytime; streaks carry over.
          </InfoTip>
        </h2>
        {!compact && (
          <Segmented value={range} onChange={setRange} options={[{ value: "game", label: "This game" }, { value: "all", label: "All time" }]} />
        )}
      </div>

      {rows.length === 0 ? (
        <p className="px-5 py-8">No students yet.</p>
      ) : (
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
      )}
    </Panel>
  );
}

function Row({ r }: { r: LeaderRow & { xp: number; label: string; rank: number } }) {
  return (
    <li className={cx("flex items-center gap-3 px-3 py-2.5", r.you && "font-semibold")}>
      <span className="w-6 text-right tabular-nums">{r.rank}</span>
      <Avatar name={r.name} you={r.you} size={28} />
      <span className="min-w-0 flex-1 truncate">{r.label}</span>
      <span className="tabular-nums">{r.xp} pts</span>
    </li>
  );
}
