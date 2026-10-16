import Link from "next/link";
import { ArrowRight, CheckCircle2, Flame, Users } from "lucide-react";
import { FORMULA_BY_ID, TOPIC_COLOR } from "@lemmory/core/formulas";
import { streak, streakBonus, weakest } from "@lemmory/core/analytics";
import { isNew } from "@lemmory/core/srs";
import { InfoTip } from "@lemmory/ui/InfoTip";
import { Leaderboard } from "@lemmory/ui/Leaderboard";
import { Button, Meter, Panel, PanelHeader, pct } from "@lemmory/ui/ui";
import { getView } from "@/lib/session";

export default async function StudentHome() {
  const v = await getView();
  const me = { id: v.me.id, name: v.me.name, isYou: true, ...v.record };
  const s = streak(v.record.doneDays, v.today);
  const fresh = v.queue.filter((id) => isNew(v.record.cards[id])).length;
  const weak = weakest(me, v.today, 5);
  // Finishing today continues the streak (or starts one), so the bonus is for streak + 1.
  const bonus = streakBonus(v.doneToday ? s : s + 1);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-[32px] font-extrabold">Hi, {v.me.name.split(" ")[0]}</h1>
        {v.klass?.contest && <p className="text-ink/75">{v.klass.contest}</p>}
      </div>

      {!v.klass && (
        <Panel className="flex flex-wrap items-center gap-4 p-5">
          <Users className="text-ink/40" />
          <p className="min-w-0 flex-1">You&apos;re not in a class. Join one with the code from your teacher to get assigned formulas.</p>
          <Button href="/class" size="sm">
            Join a class
          </Button>
        </Panel>
      )}

      {!v.canReview && (
        <Panel className="border-2 border-lemon p-6">
          <p className="text-xl font-extrabold">Your class&apos;s free trial has ended</p>
          <p className="mt-1 text-ink/75">Ask your teacher to pick a plan. Your cards and progress are saved and will be here when it&apos;s back.</p>
        </Panel>
      )}

      {/* Do your cards */}
      {v.canReview && (
      <section className="rounded-2xl border border-lemon bg-lemon-soft p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          {v.doneToday ? (
            <div className="flex items-center gap-4">
              <CheckCircle2 size={44} className="text-good" />
              <div>
                <p className="text-2xl font-extrabold">{v.nothingDue ? "Nothing due today" : "You're done for today"}</p>
                <p className="text-ink/75">{s}-day streak</p>
              </div>
            </div>
          ) : (
            <div>
              <p className="flex items-center gap-1 text-4xl font-extrabold">
                {v.queue.length} cards today
                <InfoTip title="Today's cards" align="left">
                  About {Math.max(2, Math.round(v.queue.length * 0.5))} minutes, {fresh} of them new.
                </InfoTip>
              </p>
              {v.klass && (
                <p className="mt-1.5 flex items-center gap-1 text-ink/75">
                  <Flame size={16} className="text-lemon-deep" /> +{bonus} streak bonus
                </p>
              )}
            </div>
          )}
          {!v.doneToday && (
            <Button href="/review" size="lg">
              {v.completedToday ? "Continue" : "Start"} <ArrowRight size={18} />
            </Button>
          )}
        </div>
      </section>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Panel>
          <PanelHeader
            title="Focus on these"
            info="Formulas you get right on the first try less than 70% of the time. The percent is how likely you are to remember each one today."
            action={
              <Link href="/stats" className="text-sm font-semibold text-ink/50 hover:text-ink">
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
                  <Link href={`/bank/${f.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-canvas">
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
        {v.klass && <Leaderboard rows={v.leaderboard} gameAge={v.gameAge} compact />}
      </div>
    </div>
  );
}
