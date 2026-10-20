"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FORMULA_BY_ID, TOPIC_COLOR } from "@/lib/bank";
import { useStore } from "@/lib/store";
import { CONTEST, contestLabel, YOU } from "@/lib/sim";
import { streak, streakBonus, weakest } from "@/lib/analytics";
import { isNew } from "@lemmory/core/srs";
import { InfoTip } from "@lemmory/ui/InfoTip";
import { Leaderboard } from "@/components/Leaderboard";
import { Button, Meter, Panel, PanelHeader, Skeleton, pct } from "@lemmory/ui/ui";

export default function StudentHome() {
  const { ready, you, today, doneToday, nothingDue, buildQueue, state } = useStore();
  if (!ready) return <Skeleton className="h-96" />;

  const s = streak(you.doneDays, today);
  const queue = doneToday ? [] : buildQueue();
  const fresh = queue.filter((id) => isNew(state.cards[id])).length;
  const weak = weakest(you, today, 5);
  // Finishing today continues the streak (or starts one), so the bonus is for streak + 1.
  const bonus = streakBonus(doneToday ? s : s + 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-[32px] font-extrabold">Hi, {YOU.name.split(" ")[0]}</h1>
        <p className="text-ink/75">{ready ? contestLabel(today) : CONTEST}</p>
      </div>

      {/* Do your cards */}
      <section className="rounded-2xl border border-lemon bg-lemon-soft p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          {doneToday ? (
            <div className="flex items-center gap-4">
              <CheckCircle2 size={44} className="text-good" />
              <div>
                <p className="text-2xl font-extrabold">{nothingDue ? "Nothing due today" : "You're done for today"}</p>
                <p className="text-ink/75">{s}-day streak</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="flex items-center gap-1 text-4xl font-extrabold">
                {queue.length} {queue.length === 1 ? "card" : "cards"} today
                <InfoTip title="Today's cards" align="left">
                  About {Math.max(2, Math.round(queue.length * 0.5))} minutes, {fresh} of them new.
                </InfoTip>
              </p>
              <p className="mt-1.5 flex items-center gap-1 text-ink/75">
                +{bonus} streak bonus
              </p>
            </div>
          )}
          {!doneToday && (
            <Button href="/student/review" size="lg">
              Start <ArrowRight size={18} />
            </Button>
          )}
        </div>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Panel>
          <PanelHeader
            title="Focus on these"
            info="Formulas you get right on the first try less than 70% of the time. The percent is how likely you are to remember each one today."
            action={
              <Link href="/student/stats" className="text-sm font-semibold text-ink/50 hover:text-ink">
                My stats
              </Link>
            }
          />
          <ul className="mt-3 divide-y divide-line">
            {weak.length === 0 && <li className="px-5 py-6">Nothing under 70%. Nice work.</li>}
            {weak.map((w) => {
              const f = FORMULA_BY_ID[w.formulaId];
              return (
                <li key={w.formulaId}>
                  <Link href={`/student/bank/${f.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-canvas">
                    <span className="size-2 shrink-0 rounded-full" style={{ background: TOPIC_COLOR[f.topic] }} />
                    <span className="min-w-0 flex-1 truncate font-semibold" title={f.topic}>
                      {f.name}
                    </span>
                    <Meter value={w.retention} className="hidden w-20 xl:block" />
                    <span className="w-10 text-right tabular-nums">{pct(w.retention)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Panel>
        <Leaderboard compact />
      </div>
    </div>
  );
}
