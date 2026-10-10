"use client";

import { useState } from "react";
import { Crown, Flame } from "lucide-react";
import { useStore } from "@/lib/store";
import { competitionPoints, summary } from "@/lib/analytics";
import { InfoTip } from "./InfoTip";
import { Avatar, Panel, Segmented, cx } from "./ui";

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

const PODIUM = [
  { place: 2, h: "h-20", ring: "#c7ccd6" },
  { place: 1, h: "h-28", ring: "#ffd43b" },
  { place: 3, h: "h-14", ring: "#e3b38d" },
];

export function Leaderboard({ compact = false, teacher = false }: { compact?: boolean; teacher?: boolean }) {
  const [range, setRange] = useState<Range>("week");
  const rows = useRows(range, teacher);
  const { state, today } = useStore();
  const age = today - state.competition.day;
  const me = rows.find((r) => r.you);
  const list = compact ? rows.slice(3, 6) : rows.slice(3);
  const showMe = !!me && compact && me.rank > 6;

  return (
    <Panel className="overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 pt-5">
        <div>
          <h2 className="flex items-center gap-1 text-[15px] font-bold tracking-tight">
            Leaderboard
            <InfoTip title="How scoring works" align="left">
              <b className="text-ink">10 points per assigned card</b>, however many tries it takes. Finish the day&apos;s review for a{" "}
              <b className="text-ink">streak bonus</b>: +5 per day of your streak, up to +100. Cards you add yourself don&apos;t earn
              points. Your teacher can start a new game anytime; streaks carry over.
            </InfoTip>
          </h2>
          <p className="text-sm text-ink/55">
            {me ? `You're #${me.rank} of ${rows.length}` : `${rows.length} students`}
            {range === "week" && ` · game started ${age === 0 ? "today" : age === 1 ? "yesterday" : `${age} days ago`}`}
          </p>
        </div>
        {!compact && (
          <Segmented value={range} onChange={setRange} options={[{ value: "week", label: "This game" }, { value: "all", label: "All time" }]} />
        )}
      </div>

      {/* Podium */}
      <div className="mt-4 grid grid-cols-3 items-end gap-2 bg-gradient-to-b from-white to-canvas px-5 pt-2">
        {PODIUM.map(({ place, h, ring }) => {
          const r = rows[place - 1];
          return (
            <div key={place} className="flex flex-col items-center">
              {place === 1 && <Crown size={18} className="mb-1 fill-lemon text-lemon-deep" />}
              <div className="rounded-full p-[3px]" style={{ background: ring }}>
                <Avatar name={r.fullName} you={r.you} size={place === 1 ? 48 : 40} />
              </div>
              <p className={cx("mt-1.5 max-w-full truncate text-xs font-bold", r.you && "text-lemon-deep")}>{r.name.split(" ")[0]}</p>
              <p className="text-[11px] font-semibold tabular-nums text-ink/50">{r.xp} pts</p>
              <div className={cx("mt-2 grid w-full place-items-center rounded-t-xl border border-b-0 border-line bg-white text-xl font-extrabold text-ink/25", h)}>
                {place}
              </div>
            </div>
          );
        })}
      </div>

      <ol className="divide-y divide-line border-t border-line">
        {[...list, ...(showMe && me ? [me] : [])].map((r) => (
          <li key={r.id} className={cx("flex items-center gap-3 px-5 py-2.5", r.you && "bg-lemon-soft")}>
            <span className="w-5 text-right text-sm font-bold tabular-nums text-ink/35">{r.rank}</span>
            <Avatar name={r.fullName} you={r.you} size={28} />
            <span className={cx("min-w-0 flex-1 truncate text-sm", r.you ? "font-bold" : "font-medium")}>{r.name}</span>
            <span className="flex w-10 items-center gap-0.5 text-xs font-semibold text-ink/45">
              <Flame size={12} />
              {r.streak}
            </span>
            <span className="w-16 text-right text-sm font-bold tabular-nums">{r.xp} pts</span>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
