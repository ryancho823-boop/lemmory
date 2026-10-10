"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Flame } from "lucide-react";
import { FORMULA_BY_ID, TOPIC_COLOR } from "@/lib/formulas";
import { useStore } from "@/lib/store";
import { CONTEST, contestLabel, YOU } from "@/lib/sim";
import { streak, streakBonus, weakest } from "@/lib/analytics";
import { isNew } from "@/lib/srs";
import { Leaderboard } from "@/components/Leaderboard";
import { Button, Meter, Panel, PanelHeader, Skeleton, pct } from "@/components/ui";

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
      <div>
        <p className="text-sm font-semibold text-ink/45">{ready ? contestLabel(today) : CONTEST}</p>
        <h1 className="text-[28px] font-extrabold tracking-tight">Hi, {YOU.name.split(" ")[0]}</h1>
      </div>

      {/* Do your cards */}
      <section className="relative overflow-hidden rounded-3xl border border-lemon/60 bg-lemon-soft p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 size-64 rounded-full bg-lemon/50 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-6">
          {doneToday ? (
            <div className="flex items-center gap-4">
              <CheckCircle2 size={44} className="text-good" />
              <div>
                <p className="text-2xl font-extrabold tracking-tight">{nothingDue ? "Nothing due today" : "You're done for today"}</p>
                <p className="text-ink/60">
                  {nothingDue
                    ? `Your cards will come back when you need them. ${s}-day streak.`
                    : `${s}-day streak. Come back tomorrow to keep it going.`}
                </p>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm font-bold text-lemon-deep">Do your cards</p>
              <p className="mt-1 text-4xl font-extrabold tracking-tight">{queue.length} cards today</p>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-ink/60">
                <span>About {Math.max(2, Math.round(queue.length * 0.5))} min</span>
                <span>·</span>
                <span>{fresh} new</span>
                <span>·</span>
                <span className="flex items-center gap-1 font-semibold text-ink/75">
                  <Flame size={15} className="text-lemon-deep" /> +{bonus} streak bonus
                </span>
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

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
        <Panel>
          <PanelHeader
            title="Focus on these"
            info="Formulas you get right on the first try less than 70% of the time."
            action={
              <Link href="/student/stats" className="text-sm font-semibold text-ink/50 hover:text-ink">
                My stats
              </Link>
            }
          />
          <ul className="mt-3 divide-y divide-line">
            {weak.length === 0 && <li className="px-5 py-6 text-sm text-ink/50">Nothing under 70%. Nice work.</li>}
            {weak.map((w) => {
              const f = FORMULA_BY_ID[w.formulaId];
              return (
                <li key={w.formulaId}>
                  <Link href={`/student/bank/${f.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-canvas">
                    <span className="size-2 shrink-0 rounded-full" style={{ background: TOPIC_COLOR[f.topic] }} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{f.name}</span>
                      <span className="text-xs text-ink/50">{f.topic}</span>
                    </span>
                    <span className="w-24 text-right">
                      <Meter value={w.retention} />
                      <span className="mt-1 block text-[11px] text-ink/50">{pct(w.retention)} recall</span>
                    </span>
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
