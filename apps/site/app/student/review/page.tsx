"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, GraduationCap } from "lucide-react";
import { FORMULA_BY_ID, type Problem } from "@/lib/bank";
import { setupApply } from "@/lib/practice";
import { InfoTip } from "@/components/InfoTip";
import { useStore } from "@/lib/store";
import { CARD_POINTS, streak, streakBonus } from "@/lib/analytics";
import { isNew } from "@lemmory/core/srs";
import { Leaderboard } from "@/components/Leaderboard";
import { RecallCard } from "@/components/review/RecallCard";
import { ApplyCard } from "@/components/review/ApplyCard";
import { Button, Panel, Skeleton } from "@/components/ui";

interface Active {
  queue: string[];
  total: number;
  attempt: number;
  apply: { problem: Problem; options: string[] } | null;
  firstTries: Record<string, boolean>;
  toast: string | null;
}

export default function ReviewPage() {
  const { ready, state, you, today, doneToday, nothingDue, buildQueue, recordAttempt, finishSession, setLastProblem } = useStore();
  const [active, setActive] = useState<Active | null>(null);

  const prepare = (id: string) => {
    if (state.cards[id]?.stage !== "apply") return null;
    const a = setupApply(FORMULA_BY_ID[id], state.lastProblem[id], Object.keys(state.cards));
    setLastProblem(id, a.problem.id);
    return a;
  };

  const start = () => {
    const queue = buildQueue();
    if (!queue.length) return finishSession();
    setActive({ queue, total: queue.length, attempt: 0, apply: prepare(queue[0]), firstTries: {}, toast: null });
  };

  const done = (correct: boolean, confusedWith?: string[]) => {
    if (!active) return;
    const id = active.queue[0];
    const { promoted } = recordAttempt(id, correct, confusedWith);
    const firstTries = id in active.firstTries ? active.firstTries : { ...active.firstTries, [id]: correct };
    const rest = active.queue.slice(1);
    const queue = correct ? rest : [...rest, id];
    if (!queue.length) finishSession();
    setActive({
      ...active,
      queue,
      firstTries,
      attempt: active.attempt + 1,
      apply: queue.length ? prepare(queue[0]) : null,
      toast: promoted ? `${FORMULA_BY_ID[id].name} graduated to application mode.` : null,
    });
  };

  if (!ready) return <Skeleton className="mx-auto h-96 max-w-3xl" />;

  // ── Finished ──
  if (doneToday || (active && !active.queue.length)) {
    const finished = Object.keys(active?.firstTries ?? {});
    // Cards the student added themselves are extra practice: no points.
    const cards = finished.filter((id) => state.cards[id]?.source !== "self").length;
    const extra = finished.length - cards;
    const s = streak(you.doneDays, today);
    return (
      <div className="mx-auto grid max-w-5xl items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <Panel className="rise p-8 text-center">
          <CheckCircle2 size={52} className="mx-auto text-good" />
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight">{nothingDue ? "Nothing due today" : "Done for today"}</h1>
          <p className="mt-1 text-ink/60">
            {nothingDue ? "The scheduler will bring your cards back when you need them." : "See you tomorrow."}
          </p>
          {cards > 0 && (
            <div className="mx-auto mt-6 grid max-w-sm grid-cols-3 gap-2">
              <Mini label="Cards" value={`+${cards * CARD_POINTS}`} />
              <Mini label={`${s}-day streak`} value={`+${streakBonus(s)}`} />
              <Mini label="Points" value={cards * CARD_POINTS + streakBonus(s)} />
            </div>
          )}
          {extra > 0 && <p className="mt-3 text-xs text-ink/45">+{extra} extra cards from your own deck (no points)</p>}
          {active?.toast && <Toast text={active.toast} />}
          <div className="mt-7 flex justify-center gap-2">
            <Button href="/student/leaderboard" variant="outline">
              Leaderboard
            </Button>
            <Button href="/student">Home</Button>
          </div>
        </Panel>
        <Leaderboard compact />
      </div>
    );
  }

  // ── Start ──
  if (!active) {
    const queue = buildQueue();
    const fresh = queue.filter((id) => isNew(state.cards[id])).length;
    const apply = queue.filter((id) => state.cards[id].stage === "apply" && !isNew(state.cards[id])).length;
    return (
      <Panel className="mx-auto max-w-xl px-6 py-12 text-center">
        <p className="flex items-center justify-center gap-1 text-sm font-semibold text-ink/45">
          Daily review
          <InfoTip align="left">Missed cards come back until you get them right.</InfoTip>
        </p>
        <h1 className="mt-1 text-5xl font-extrabold tracking-tight">{queue.length} cards</h1>
        <div className="mt-6 flex justify-center gap-2 text-sm">
          <Chip n={queue.length - fresh - apply} label="recall" />
          <Chip n={apply} label="application" />
          <Chip n={fresh} label="new" />
        </div>
        <Button variant="lemon" size="lg" className="mt-8 w-full max-w-xs" onClick={start}>
          {queue.length ? "Start" : "Nothing due, mark done"} <ArrowRight size={18} />
        </Button>
      </Panel>
    );
  }

  // ── In session ──
  const id = active.queue[0];
  const completed = active.total - new Set(active.queue).size;
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center gap-3">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink/8">
          <div className="h-full rounded-full bg-lemon transition-all duration-500" style={{ width: `${(completed / active.total) * 100}%` }} />
        </div>
        <span className="text-sm font-bold tabular-nums text-ink/50">
          {completed}/{active.total}
        </span>
      </div>
      {active.toast && <Toast text={active.toast} />}
      <Panel key={active.attempt} className="rise mt-4 p-6 sm:p-9">
        {active.apply ? (
          <ApplyCard {...active.apply} onDone={done} />
        ) : (
          <RecallCard formula={FORMULA_BY_ID[id]} onDone={done} />
        )}
      </Panel>
    </div>
  );
}

function Chip({ n, label }: { n: number; label: string }) {
  return (
    <span className="rounded-full border border-line bg-white px-3 py-1.5 font-semibold">
      {n} <span className="font-medium text-ink/50">{label}</span>
    </span>
  );
}

function Mini({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-canvas p-3">
      <p className="text-xl font-extrabold tabular-nums">{value}</p>
      <p className="text-xs text-ink/50">{label}</p>
    </div>
  );
}

function Toast({ text }: { text: string }) {
  return (
    <p className="rise mt-4 flex items-center justify-center gap-2 rounded-xl bg-lemon-soft px-4 py-3 text-sm font-semibold">
      <GraduationCap size={18} /> {text}
    </p>
  );
}
