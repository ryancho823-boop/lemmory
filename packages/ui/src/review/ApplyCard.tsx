"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import type { ApplyPrompt, PickResult, SolveResult } from "@lemmory/core/check";
import { MathInput } from "../MathInput";
import { Rich, Tex } from "../Tex";
import { Button, StageTag, cx } from "../ui";
import { Feedback } from "./RecallCard";
import { Figure } from "../Figure";
import { useEnter } from "./useEnter";

interface Props {
  prompt: ApplyPrompt;
  /** Step 1, checked on the server: did the student pick the right formula(s)? */
  onPick: (picked: string[]) => Promise<PickResult>;
  /** Step 2, checked and recorded on the server. */
  onSolve: (picked: string[], answer: string) => Promise<SolveResult>;
  onDone: (correct: boolean) => void;
}

/** Stage 2: recognize which formula(s) the problem needs, then solve it. */
export function ApplyCard({ prompt, onPick, onSolve, onDone }: Props) {
  const [picked, setPicked] = useState<string[]>([]);
  const [pick, setPick] = useState<PickResult | null>(null);
  const [answer, setAnswer] = useState("");
  const [solve, setSolve] = useState<SolveResult | null>(null);
  const [error, setError] = useState(false);
  const [pending, start] = useTransition();

  const run = (fn: () => Promise<void>) =>
    start(async () => {
      try {
        await fn();
        setError(false);
      } catch {
        setError(true);
      }
    });

  const toggle = (id: string) => !pick && setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const checkPick = () => {
    if (picked.length && !pending) run(async () => setPick(await onPick(picked)));
  };
  const checkSolve = (value = answer) => {
    if (solve) return onDone(solve.right);
    if (value.trim() && !pending) run(async () => setSolve(await onSolve(picked, value)));
  };
  // Enter checks the chosen formulas, then continues once the card is over.
  useEnter(!pick && picked.length > 0, checkPick);
  useEnter(!!pick && !pick.right, () => onDone(false));
  useEnter(!!solve, () => onDone(solve!.right));

  return (
    <div>
      <StageTag stage="apply" />
      <p className="mt-4 text-lg leading-relaxed">
        <Rich text={prompt.text} />
      </p>
      {prompt.figure && <Figure figure={prompt.figure} className="mt-4 h-auto w-full max-w-[260px]" />}

      <div className="mt-7 flex items-center gap-2">
        <Step n={1} done={!!pick} />
        <h3 className="font-bold">Which formula{prompt.needs > 1 ? "s" : ""} does this need?</h3>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {prompt.options.map((o) => {
          const on = picked.includes(o.id);
          const needed = !!pick?.uses.includes(o.id);
          const tone = !pick
            ? on
              ? "border-ink bg-ink text-white"
              : "border-line bg-white hover:border-ink/40"
            : needed
              ? "border-good bg-good/6"
              : on
                ? "border-bad bg-bad/5"
                : "border-line bg-white opacity-50";
          return (
            <button key={o.id} onClick={() => toggle(o.id)} aria-pressed={on} className={cx("rounded-2xl border-2 px-4 py-3 text-left transition-all", tone)}>
              <span className="flex items-center justify-between gap-2 font-semibold">
                {o.name}
                {pick && needed && <Check size={16} strokeWidth={3} className="text-good" />}
              </span>
              {pick?.statements[o.id] && (needed || on) && (
                <span className="math-scroll mt-1 block text-[17px]">
                  <Tex math={`\\displaystyle ${pick.statements[o.id]}`} />
                </span>
              )}
            </button>
          );
        })}
      </div>
      {!pick ? (
        <Button size="lg" className="mt-4" onClick={checkPick} disabled={!picked.length || pending}>
          {pending ? "Checking…" : "Check"}
        </Button>
      ) : (
        <p className="rise mt-4 text-[17px] leading-relaxed">
          <b className={pick.right ? "text-good" : "text-bad"}>{pick.right ? "Right tool." : "Not quite."}</b> <Rich text={pick.whenToUse} />
        </p>
      )}

      {/* The wrong formula ends the card: no solving, and the student moves on. */}
      {pick && !pick.right && (
        <Button size="lg" className="rise mt-4" onClick={() => onDone(false)}>
          Continue
        </Button>
      )}

      {pick?.right && (
        <div className="rise">
          <div className="mt-8 flex items-center gap-2">
            <Step n={2} done={!!solve} />
            <h3 className="font-bold">Now solve it.</h3>
          </div>
          <div className="mt-3 max-w-sm">
            <MathInput
              autoFocus
              tools={false}
              disabled={!!solve}
              state={!solve ? "idle" : solve.right ? "right" : "wrong"}
              onChange={setAnswer}
              onEnter={(v) => checkSolve(v)}
            />
          </div>
          {solve && (
            <Feedback right={solve.right} title={solve.right ? "Correct" : "Not quite"}>
              {/* Always stated: many solutions stop at the last step before the number. */}
              <span className="block">
                Answer: <Tex math={solve.answer} />
              </span>
              <span className="block">
                <Rich text={solve.solution} display />
              </span>
            </Feedback>
          )}
          <Button size="lg" className="mt-4" onClick={() => checkSolve()} disabled={(!answer.trim() && !solve) || pending}>
            {solve ? "Continue" : pending ? "Checking…" : "Check"}
          </Button>
        </div>
      )}
      {error && <p className="mt-4 text-sm font-semibold text-bad">Couldn&apos;t reach the server. Check your connection and try again.</p>}
    </div>
  );
}

function Step({ n, done }: { n: number; done: boolean }) {
  return (
    <span className={cx("grid size-6 place-items-center rounded-full text-xs font-bold", done ? "bg-ink text-white" : "bg-ink/8 text-ink/60")}>
      {done ? <Check size={13} strokeWidth={3} /> : n}
    </span>
  );
}
