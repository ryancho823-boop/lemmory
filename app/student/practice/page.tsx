"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";
import { FORMULA_BY_ID, TOPICS, TOPIC_COLOR, type Problem, type Topic } from "@/lib/formulas";
import { useStore } from "@/lib/store";
import { setupApply, shuffle } from "@/lib/practice";
import { isNew } from "@/lib/srs";
import { RecallCard } from "@/components/review/RecallCard";
import { ApplyCard } from "@/components/review/ApplyCard";
import { Button, PageHeader, Panel, Skeleton, cx } from "@/components/ui";

interface Run {
  queue: string[];
  total: number;
  attempt: number;
  firstTries: Record<string, boolean>;
  apply: { problem: Problem; options: string[] } | null;
}

/**
 * Cram mode for the days before a contest: every card in the deck, back to back.
 * Nothing here is recorded, so it doesn't change the schedule, the stats, or points.
 */
export default function PracticePage() {
  const { ready, state } = useStore();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [run, setRun] = useState<Run | null>(null);
  if (!ready) return <Skeleton className="h-96" />;

  const deck = Object.values(state.cards).filter((c) => !isNew(c));
  const chosen = deck.filter((c) => topics.length === 0 || topics.includes(FORMULA_BY_ID[c.formulaId].topic));
  const deckIds = Object.keys(state.cards);

  const prep = (id: string) =>
    state.cards[id]?.stage === "apply" ? setupApply(FORMULA_BY_ID[id], undefined, deckIds) : null;

  const start = () => {
    const queue = shuffle(chosen.map((c) => c.formulaId));
    if (queue.length) setRun({ queue, total: queue.length, attempt: 0, firstTries: {}, apply: prep(queue[0]) });
  };

  const done = (correct: boolean) => {
    if (!run) return;
    const id = run.queue[0];
    const firstTries = id in run.firstTries ? run.firstTries : { ...run.firstTries, [id]: correct };
    const rest = run.queue.slice(1);
    const queue = correct ? rest : [...rest, id];
    setRun({ ...run, queue, firstTries, attempt: run.attempt + 1, apply: queue.length ? prep(queue[0]) : null });
  };

  // ── Finished ──
  if (run && !run.queue.length) {
    const tries = Object.values(run.firstTries);
    const right = tries.filter(Boolean).length;
    return (
      <Panel className="rise mx-auto max-w-lg p-8 text-center">
        <CheckCircle2 size={48} className="mx-auto text-good" />
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight">Practice complete</h1>
        <p className="mt-1 text-ink/60">
          {right} of {tries.length} right on the first try. Nothing was saved to your deck or points.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button variant="outline" onClick={() => setRun(null)}>
            Practice again
          </Button>
          <Button href="/student">Home</Button>
        </div>
      </Panel>
    );
  }

  // ── In session ──
  if (run) {
    const completed = run.total - new Set(run.queue).size;
    return (
      <div className="mx-auto max-w-3xl">
        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-bold text-white">Practice · not saved</span>
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink/8">
            <div className="h-full rounded-full bg-ink/70 transition-all duration-500" style={{ width: `${(completed / run.total) * 100}%` }} />
          </div>
          <span className="text-sm font-bold tabular-nums text-ink/50">
            {completed}/{run.total}
          </span>
          <button onClick={() => setRun(null)} className="text-sm font-semibold text-ink/45 hover:text-ink">
            End
          </button>
        </div>
        <Panel key={run.attempt} className="rise p-6 sm:p-9">
          {run.apply ? <ApplyCard {...run.apply} onDone={done} /> : <RecallCard formula={FORMULA_BY_ID[run.queue[0]]} onDone={done} />}
        </Panel>
      </div>
    );
  }

  // ── Start ──
  const toggle = (t: Topic) => setTopics((ts) => (ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]));
  const deckTopics = TOPICS.filter((t) => deck.some((c) => FORMULA_BY_ID[c.formulaId].topic === t));
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Practice all" info="Run through your whole deck right before a contest to sharpen short-term memory." />
      <Panel className="p-6 sm:p-8">
        <div className="flex items-start gap-3 rounded-2xl bg-canvas p-4 text-sm text-ink/70">
          <Zap size={18} className="mt-0.5 shrink-0 text-lemon-deep" />
          <p>
            Practice doesn&apos;t count: it won&apos;t change when cards come back, your stats, your streak, or your points. Keep
            doing your daily cards as usual.
          </p>
        </div>
        <p className="mt-6 text-sm font-bold">Topics</p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Chip active={topics.length === 0} onClick={() => setTopics([])}>
            Everything
          </Chip>
          {deckTopics.map((t) => (
            <Chip key={t} active={topics.includes(t)} onClick={() => toggle(t)} color={TOPIC_COLOR[t]}>
              {t}
            </Chip>
          ))}
        </div>
        <Button size="lg" className="mt-8 w-full" onClick={start} disabled={!chosen.length}>
          Practice {chosen.length} cards <ArrowRight size={18} />
        </Button>
      </Panel>
    </div>
  );
}

function Chip({ active, onClick, color, children }: { active: boolean; onClick: () => void; color?: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors",
        active ? "border-ink bg-ink text-white" : "border-line bg-white text-ink/70 hover:border-ink/30",
      )}
    >
      {color && <span className="size-2 rounded-full" style={{ background: color }} />}
      {children}
    </button>
  );
}
