import Link from "next/link";
import { ArrowRight, CheckCircle2, Users } from "lucide-react";
import { FORMULA_BY_ID, TOPIC_COLOR } from "@lemmory/core/formulas";
import { streak, streakBonus, weakest } from "@lemmory/core/analytics";
import { isNew } from "@lemmory/core/srs";
import { InfoTip } from "@lemmory/ui/InfoTip";
import { Leaderboard } from "@lemmory/ui/Leaderboard";
import { Button, Meter, Panel, PanelHeader, pct } from "@lemmory/ui/ui";
import { getUnlockedView } from "@/lib/session";
import { StarterDeck } from "./StarterDeck";

export default async function StudentHome() {
  const v = await getUnlockedView();
  const me = { id: v.me.id, name: v.me.name, isYou: true, ...v.record };
  const s = streak(v.record.doneDays, v.today);
  const fresh = v.queue.filter((id) => isNew(v.record.cards[id])).length;
  const weak = weakest(me, v.today, 5);
  // Finishing today continues the streak (or starts one), so the bonus is for streak + 1.
  const bonus = streakBonus(v.doneToday ? s : s + 1);
  const emptyDeck = Object.keys(v.record.cards).length === 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-[32px] font-extrabold">Hi, {v.me.name.split(" ")[0]}</h1>
        {v.klass?.contest && <p className="text-ink/75">{v.klass.contest}</p>}
      </div>

      {!v.klass && emptyDeck && <StarterDeck />}
      {!v.klass && !emptyDeck && (
        <Panel className="flex flex-wrap items-center gap-4 p-5">
          <Users className="text-ink/40" />
          <p className="min-w-0 flex-1">You&apos;re on the individual plan. If your teacher gives you a class code, you can join their class too.</p>
          <Button href="/class" size="sm">
            Join a class
          </Button>
        </Panel>
      )}

      {/* Nothing to review until there's a deck: the starter deck picker above comes first. */}
      {!(emptyDeck && !v.klass) && <Today v={v} s={s} bonus={bonus} fresh={fresh} weak={weak} />}
    </div>
  );
}

function Today({ v, s, bonus, fresh, weak }: { v: Awaited<ReturnType<typeof getUnlockedView>>; s: number; bonus: number; fresh: number; weak: ReturnType<typeof weakest> }) {
  return (
    <>
      {/* Do your cards */}
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
                {v.queue.length} {v.queue.length === 1 ? "card" : "cards"} today
                <InfoTip title="Today's cards" align="left">
                  About {Math.max(2, Math.round(v.queue.length * 0.5))} minutes, {fresh} of them new.
                </InfoTip>
              </p>
              {v.klass && (
                <p className="mt-1.5 flex items-center gap-1 text-ink/75">
                  {s > 0 ? `Finish to keep your ${s}-day streak: +${bonus} bonus points` : `Finish to start a streak: +${bonus} bonus points`}
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

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Panel>
          <PanelHeader
            title="Focus on these"
            info="Formulas you get right on the first try less than 70% of the time, lowest first. The same numbers as Needs work on My stats."
            action={
              <Link href="/stats" className="text-sm font-semibold text-ink/50 hover:text-ink">
                My stats
              </Link>
            }
          />
          <ul className="mt-3 divide-y divide-line">
            {weak.length === 0 && (
              <li className="px-5 py-6">{v.record.log.length ? "Nothing under 70%. Nice work." : "Do your first review to see what needs work."}</li>
            )}
            {weak.map((w) => {
              const f = FORMULA_BY_ID[w.formulaId];
              return (
                <li key={w.formulaId}>
                  <Link href={`/bank/${f.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-canvas">
                    <span className="size-2 shrink-0 rounded-full" style={{ background: TOPIC_COLOR[f.topic] }} />
                    <span className="min-w-0 flex-1 truncate font-semibold" title={f.topic}>
                      {f.name}
                    </span>
                    <Meter value={w.accuracy} className="hidden w-20 xl:block" />
                    <span className="shrink-0 text-right tabular-nums">
                      {pct(w.accuracy)} <span className="text-ink/70">right</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Panel>
        {v.klass && <Leaderboard rows={v.leaderboard} gameAge={v.gameAge} compact />}
      </div>
    </>
  );
}
