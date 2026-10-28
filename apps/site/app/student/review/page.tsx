"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, GraduationCap } from "lucide-react";
import { BANK, FORMULA_BY_ID, type Problem } from "@/lib/bank";
import { setupApply } from "@lemmory/core/practice";
import { recordAttempt as dryRun } from "@lemmory/core/session";
import { useStore } from "@/lib/store";
import { CARD_POINTS, streak, streakBonus } from "@lemmory/core/analytics";
import { Leaderboard } from "@/components/Leaderboard";
import { RecallCard } from "@/components/review/RecallCard";
import { ApplyCard } from "@/components/review/ApplyCard";
import { Button, Panel, Skeleton } from "@lemmory/ui/ui";

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
  // Set when the card on screen graduates, so the note shows with that card (and goes with it).
  const [graduated, setGraduated] = useState<string | null>(null);

  const prepare = (id: string) => {
    if (state.cards[id]?.stage !== "apply") return null;
    const a = setupApply(BANK, FORMULA_BY_ID[id], state.lastProblem[id] ? [state.lastProblem[id]] : [], Object.keys(state.cards));
    setLastProblem(id, a.problem.id);
    return a;
  };

  const start = () => {
    const queue = buildQueue();
    if (!queue.length) return finishSession();
    setActive({ queue, total: queue.length, attempt: 0, apply: prepare(queue[0]), firstTries: {}, toast: null });
  };

  // Home already says how many cards are due, so the review opens on the first card (once).
  const opened = useRef(false);
  useEffect(() => {
    if (!ready || doneToday || opened.current) return;
    opened.current = true;
    start();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once the saved demo state has loaded
  }, [ready, doneToday]);

  const done = (correct: boolean, confusedWith?: string[]) => {
    if (!active) return;
    const id = active.queue[0];
    recordAttempt(id, correct, confusedWith);
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
      // Only the finish screen keeps the last card's note; otherwise it would sit over the next card.
      toast: queue.length ? null : graduated,
    });
    setGraduated(null);
  };

  // As soon as a card is graded: does this answer graduate it? (The same rule the store applies on Continue.)
  const graded = (correct: boolean) => {
    const id = active?.queue[0];
    const card = id ? state.cards[id] : undefined;
    if (card && dryRun(state.session, card, correct, today).done?.promoted) setGraduated(`${FORMULA_BY_ID[card.formulaId].name} graduated to application mode.`);
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

  // The first card is being set up.
  if (!active) return <Skeleton className="mx-auto h-96 max-w-3xl" />;

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
      {graduated && <Toast text={graduated} />}
      <Panel key={active.attempt} className="rise mt-4 p-6 sm:p-9">
        {active.apply ? (
          <ApplyCard {...active.apply} onDone={done} onGraded={graded} />
        ) : (
          <RecallCard formula={FORMULA_BY_ID[id]} onDone={done} onGraded={graded} />
        )}
      </Panel>
    </div>
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
