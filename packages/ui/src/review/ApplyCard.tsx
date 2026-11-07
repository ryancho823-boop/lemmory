"use client";

import { useEffect, useState, useTransition } from "react";
import { Check, X } from "lucide-react";
import type { ApplyPrompt, PickResult, SolveResult } from "@lemmory/core/check";
import { MathInput } from "../MathInput";
import { Rich, Tex } from "../Tex";
import { Button, StageTag, cx } from "../ui";
import { Feedback } from "./RecallCard";
import { Figure } from "../Figure";
import { FailNote } from "./FailNote";
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

  // 1 to 4 pick a formula, the way Enter checks one.
  useEffect(() => {
    if (pick) return;
    const onKey = (e: KeyboardEvent) => {
      const option = prompt.options[Number(e.key) - 1];
      if (!option || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      setPicked((p) => (p.includes(option.id) ? p.filter((x) => x !== option.id) : [...p, option.id]));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pick, prompt.options]);

  return (
    <div>
      <StageTag stage="apply" />
      <p className="mt-4 text-lg leading-relaxed">
        <Rich text={prompt.text} />
      </p>
      {prompt.figure && <Figure figure={prompt.figure} className="mt-4 h-auto w-full max-w-[320px]" />}

      <div className="mt-7 flex items-center gap-2">
        <Step n={1} result={pick?.right} />
        <h3 className="font-bold">Which formula{prompt.needs > 1 ? "s" : ""} does this need?</h3>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {prompt.options.map((o, i) => {
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
            <button key={o.id} type="button" onClick={() => toggle(o.id)} aria-pressed={on} className={cx("rounded-2xl border-2 px-4 py-3 text-left transition-all", tone)}>
              <span className="flex items-center justify-between gap-2 font-semibold">
                <span>
                  <kbd className={cx("mr-2 hidden font-sans text-xs font-medium sm:inline", on && !pick ? "text-white/60" : "text-ink/40")}>{i + 1}</kbd>
                  {o.name}
                </span>
                {pick && needed && <Check size={16} strokeWidth={3} className="text-good" />}
              </span>
              {pick?.statements[o.id] && (needed || on) && (
                <span className="math-scroll mt-1 block whitespace-nowrap text-[17px]">
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
            <Step n={2} result={solve?.right} />
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
      {error && <FailNote onRetry={() => setError(false)} />}
    </div>
  );
}

/** The step's number, then a check or a cross once it's answered. */
function Step({ n, result }: { n: number; result?: boolean }) {
  return (
    <span className={cx("grid size-6 place-items-center rounded-full text-xs font-bold", result === undefined ? "bg-ink/8 text-ink/60" : result ? "bg-good text-white" : "bg-bad text-white")}>
      {result === undefined ? n : result ? <Check size={13} strokeWidth={3} /> : <X size={13} strokeWidth={3} />}
    </span>
  );
}
