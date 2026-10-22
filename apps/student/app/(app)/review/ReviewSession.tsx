"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ArrowRight, CheckCircle2, GraduationCap } from "lucide-react";
import type { LeaderRow } from "@lemmory/core/analytics";
import type { Prompt } from "@lemmory/core/grading";
import { CARD_POINTS, streak, streakBonus } from "@lemmory/core/points";
import { Leaderboard } from "@lemmory/ui/Leaderboard";
import { Button, Panel, Skeleton } from "@lemmory/ui/ui";
import { getPrompt, markDone } from "../../actions";
import { CardView } from "../CardView";

interface CardInfo {
  source: "teacher" | "self";
  stage: "recall" | "apply";
  isNew: boolean;
}

interface Active {
  queue: string[];
  total: number;
  attempt: number;
  prompt: Prompt | null;
  firstTries: Record<string, boolean>;
  toast: string | null;
}

export function ReviewSession({
  queue: initial,
  cards,
  doneToday,
  nothingDue,
  inClass,
  streakDays,
  today,
  leaderboard,
  gameAge,
}: {
  queue: string[];
  cards: Record<string, CardInfo>;
  doneToday: boolean;
  nothingDue: boolean;
  inClass: boolean;
  streakDays: number[];
  today: number;
  leaderboard: LeaderRow[];
  gameAge: number;
}) {
  // Home already says how many cards are due, so the review opens on the first card.
  const [active, setActive] = useState<Active | null>(() =>
    initial.length && !doneToday ? { queue: initial, total: initial.length, attempt: 0, prompt: null, firstTries: {}, toast: null } : null,
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  // Set when a card graduates; shown once the student moves on.
  const promoted = useRef<string | null>(null);

  const load = (id: string) =>
    getPrompt(id, "review").then(
      (prompt) => setActive((a) => (a && a.queue[0] === id ? { ...a, prompt } : a)),
      () => setError("Couldn't load the next card. Reload the page to pick up where you left off."),
    );

  // Once, even when React runs effects twice in development: each load hands out a problem.
  const opened = useRef(false);
  useEffect(() => {
    if (opened.current || !active || active.prompt || active.attempt) return;
    opened.current = true;
    load(active.queue[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only for the first card
  }, []);

  const done = (correct: boolean) => {
    if (!active) return;
    const id = active.queue[0];
    const firstTries = id in active.firstTries ? active.firstTries : { ...active.firstTries, [id]: correct };
    const rest = active.queue.slice(1);
    const queue = correct ? rest : [...rest, id];
    setActive({ ...active, queue, firstTries, attempt: active.attempt + 1, prompt: null, toast: promoted.current });
    promoted.current = null;
    if (queue.length) load(queue[0]);
  };

  // ── Finished ──
  if (doneToday || (active && !active.queue.length)) {
    const finished = Object.keys(active?.firstTries ?? {});
    // Cards the student added themselves are extra practice: no points.
    const counted = finished.filter((id) => cards[id]?.source !== "self").length;
    const extra = finished.length - counted;
    const s = streak(doneToday ? streakDays : [...streakDays, today], today);
    return (
      <div className={`mx-auto grid max-w-5xl items-start gap-6 ${inClass ? "lg:grid-cols-[minmax(0,1fr)_340px]" : "max-w-xl"}`}>
        <Panel className="rise p-8 text-center">
          <CheckCircle2 size={52} className="mx-auto text-good" />
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight">{nothingDue ? "Nothing due today" : "Done for today"}</h1>
          <p className="mt-1 text-ink/60">{nothingDue ? "The scheduler will bring your cards back when you need them." : "See you tomorrow."}</p>
          {inClass && counted > 0 && (
            <div className="mx-auto mt-6 grid max-w-sm grid-cols-3 gap-2">
              <Mini label="Cards" value={`+${counted * CARD_POINTS}`} />
              <Mini label={`${s}-day streak`} value={`+${streakBonus(s)}`} />
              <Mini label="Points" value={counted * CARD_POINTS + streakBonus(s)} />
            </div>
          )}
          {extra > 0 && <p className="mt-3 text-xs text-ink/45">+{extra} extra cards from your own deck (no points)</p>}
          {active?.toast && <Toast text={active.toast} />}
          <div className="mt-7 flex justify-center gap-2">
            {inClass && (
              <Button href="/leaderboard" variant="outline">
                Leaderboard
              </Button>
            )}
            <Button href="/">Home</Button>
          </div>
        </Panel>
        {inClass && <Leaderboard rows={leaderboard} gameAge={gameAge} compact />}
      </div>
    );
  }

  // ── Nothing in the queue, but the day isn't marked done yet ──
  if (!active) {
    return (
      <Panel className="mx-auto max-w-xl px-6 py-12 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">No cards left today</h1>
        <Button variant="lemon" size="lg" className="mt-8 w-full max-w-xs" onClick={() => start(() => markDone())} disabled={pending}>
          Mark today done <ArrowRight size={18} />
        </Button>
      </Panel>
    );
  }

  // ── In session ──
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
      {error ? (
        <Panel className="mt-4 p-8 text-center text-sm font-semibold text-bad">{error}</Panel>
      ) : active.prompt ? (
        <Panel key={active.attempt} className="rise mt-4 p-6 sm:p-9">
          <CardView
            prompt={active.prompt}
            mode="review"
            onDone={done}
            onOutcome={(o) => {
              if (o.promoted) promoted.current = `${o.formulaName} graduated to application mode.`;
            }}
          />
        </Panel>
      ) : (
        <Skeleton className="mt-4 h-80" />
      )}
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
