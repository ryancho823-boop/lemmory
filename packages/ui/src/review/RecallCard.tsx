"use client";

import { useRef, useState, useTransition } from "react";
import { Check, X } from "lucide-react";
import type { RecallPrompt, RecallResult } from "@lemmory/core/check";
import { MathInput, type MathInputHandle } from "../MathInput";
import { Rich, Tex } from "../Tex";
import { Button, StageTag, TopicTag } from "../ui";
import { Figure } from "../Figure";
import { useEnter } from "./useEnter";

type Graded = Extract<RecallResult, { status: "graded" }>;

interface Props {
  prompt: RecallPrompt;
  /** Grades on the server. May come back with a typo hint instead of a grade. */
  onCheck: (inputs: string[]) => Promise<RecallResult>;
  onDone: (correct: boolean) => void;
  /** Off where the card sits mid-page (the homepage demo), so loading the page doesn't scroll to it. */
  autoFocus?: boolean;
}

export function RecallCard({ prompt, onCheck, onDone, autoFocus = true }: Props) {
  const [values, setValues] = useState<string[]>(() => prompt.blanks.map(() => ""));
  const [graded, setGraded] = useState<Graded | null>(null);
  // Boxes that look one letter off. The server allows one free retry per card to fix a slip.
  const [typos, setTypos] = useState<boolean[] | null>(null);
  const [error, setError] = useState(false);
  const [pending, start] = useTransition();
  // The toolbar stays under the last-focused box so the layout never jumps mid-click.
  const [active, setActive] = useState(0);
  const inputs = useRef<(MathInputHandle | null)[]>([]);
  const results = graded?.results ?? null;
  const allRight = results?.every(Boolean) ?? false;

  const check = (latest = values) => {
    if (graded) return onDone(allRight);
    if (pending) return;
    start(async () => {
      try {
        const r = await onCheck(latest);
        setError(false);
        if (r.status === "typo") {
          setTypos(r.typos);
          inputs.current[r.typos.indexOf(true)]?.focus();
        } else {
          setTypos(null);
          setGraded(r);
        }
      } catch {
        setError(true);
      }
    });
  };

  useEnter(!!graded, () => onDone(allRight));

  return (
    <div>
      <div className="flex items-center gap-3">
        <StageTag stage="recall" />
        <TopicTag topic={prompt.topic} />
      </div>
      <h2 className="mt-4 text-[26px] font-extrabold leading-tight tracking-tight">{prompt.name}</h2>
      <p className="mt-1.5 text-ink/60">
        <Rich text={prompt.setup} />
      </p>
      {prompt.figure && <Figure figure={prompt.figure} className="mt-4 h-auto w-full max-w-[260px]" />}

      <div className="mt-7 space-y-4">
        {prompt.blanks.map((b, i) => (
          <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
            <div className="shrink-0 pt-3 text-lg sm:min-w-40 sm:text-right">
              <Tex math={b.lhs} />
            </div>
            <div className="flex-1">
              <MathInput
                ref={(h) => {
                  inputs.current[i] = h;
                }}
                autoFocus={autoFocus && i === 0}
                disabled={!!results}
                tools={!results && active === i}
                onFocus={() => setActive(i)}
                state={results ? (results[i] ? "right" : "wrong") : typos?.[i] ? "typo" : "idle"}
                onChange={(v) => setValues((vs) => vs.map((x, j) => (j === i ? v : x)))}
                onEnter={(v) =>
                  i < prompt.blanks.length - 1 && !results
                    ? inputs.current[i + 1]?.focus()
                    : check(values.map((x, j) => (j === i ? v : x)))
                }
              />
              {!results && typos?.[i] && (
                <p role="status" className="mt-1.5 text-sm font-semibold text-lemon-deep">
                  Close. One letter looks off, so fix the typo and check again.
                </p>
              )}
              {graded && !graded.results[i] && (
                <p className="mt-1.5 text-sm text-ink/70">
                  Answer: <Tex math={graded.answers[i]} />
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {graded && (
        <Feedback right={allRight} title={allRight ? "Correct" : "Here's the formula"}>
          {allRight ? (
            <span className="block">Any equivalent form counts.</span>
          ) : (
            <span className="math-scroll block">
              <Tex math={`\\displaystyle ${graded.statement}`} />
            </span>
          )}
          {graded.after && (
            <span className="block">
              <Rich text={graded.after} display />
            </span>
          )}
        </Feedback>
      )}
      {error && <p className="mt-4 text-sm font-semibold text-bad">Couldn&apos;t reach the server. Check your connection and try again.</p>}

      <div className="mt-7 flex flex-wrap items-center gap-2">
        <Button size="lg" onClick={() => check()} disabled={pending}>
          {graded ? "Continue" : pending ? "Checking…" : "Check"}
        </Button>
        {!graded && (
          <Button variant="ghost" size="lg" disabled={pending} onClick={() => check(prompt.blanks.map(() => ""))}>
            I don&apos;t remember
          </Button>
        )}
        <span className="ml-auto hidden text-xs text-ink/35 sm:block">Press Enter</span>
      </div>
    </div>
  );
}

export function Feedback({ right, title, children }: { right: boolean; title: string; children: React.ReactNode }) {
  return (
    // Full-size text: right after an answer is when the formula and solution are worth reading.
    <div role="status" className={`rise mt-6 flex gap-3 rounded-lg p-5 text-[17px] leading-relaxed ${right ? "bg-good/8" : "bg-bad/6"}`}>
      <span className={`grid size-6 shrink-0 place-items-center rounded-full text-white ${right ? "bg-good" : "bg-bad"}`}>
        {right ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
      </span>
      <div className="min-w-0">
        <p className="font-bold">{title}</p>
        <div className="mt-1 space-y-2">{children}</div>
      </div>
    </div>
  );
}
