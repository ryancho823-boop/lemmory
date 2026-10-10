"use client";

import { useRef, useState } from "react";
import { Check, X } from "lucide-react";
import type { Formula } from "@/lib/formulas";
import { gradeRecall } from "@/lib/grade";
import { MathInput, type MathInputHandle } from "@/components/MathInput";
import { Rich, Tex } from "@/components/Tex";
import { Button, StageTag, TopicTag } from "@/components/ui";

export function RecallCard({ formula, onDone }: { formula: Formula; onDone: (correct: boolean) => void }) {
  const [values, setValues] = useState<string[]>(() => formula.recall.map(() => ""));
  const [results, setResults] = useState<boolean[] | null>(null);
  // The toolbar stays under the last-focused box so the layout never jumps mid-click.
  const [active, setActive] = useState(0);
  const inputs = useRef<(MathInputHandle | null)[]>([]);
  const allRight = results?.every(Boolean) ?? false;

  const check = (latest = values) => {
    if (results) return onDone(allRight);
    setResults(formula.recall.map((b, i) => gradeRecall(b, latest[i])));
  };

  return (
    <div>
      <div className="flex items-center gap-3">
        <StageTag stage="recall" />
        <TopicTag topic={formula.topic} />
      </div>
      <h2 className="mt-4 text-[26px] font-extrabold leading-tight tracking-tight">{formula.name}</h2>
      <p className="mt-1.5 text-ink/60">
        <Rich text={formula.setup} />
      </p>

      <div className="mt-7 space-y-4">
        {formula.recall.map((b, i) => (
          <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
            <div className="shrink-0 pt-3 text-lg sm:min-w-40 sm:text-right">
              <Tex math={b.lhs} />
            </div>
            <div className="flex-1">
              <MathInput
                ref={(h) => {
                  inputs.current[i] = h;
                }}
                autoFocus={i === 0}
                disabled={!!results}
                tools={!results && active === i}
                onFocus={() => setActive(i)}
                state={results ? (results[i] ? "right" : "wrong") : "idle"}
                onChange={(v) => setValues((vs) => vs.map((x, j) => (j === i ? v : x)))}
                onEnter={(v) =>
                  i < formula.recall.length - 1 && !results
                    ? inputs.current[i + 1]?.focus()
                    : check(values.map((x, j) => (j === i ? v : x)))
                }
              />
              {results && !results[i] && (
                <p className="mt-1.5 text-sm text-ink/70">
                  Answer: <Tex math={b.answer} />
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {results && (
        <Feedback right={allRight} title={allRight ? "Correct" : "Here's the formula"}>
          {allRight ? (
            "Any equivalent form counts."
          ) : (
            <>
              <span className="block overflow-x-auto py-1">
                <Tex math={formula.statement} />
              </span>
              <span className="mt-1 block text-ink/60">It&apos;ll come back before today&apos;s session ends.</span>
            </>
          )}
        </Feedback>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-2">
        <Button size="lg" onClick={() => check()}>
          {results ? "Continue" : "Check"}
        </Button>
        {!results && (
          <Button variant="ghost" size="lg" onClick={() => setResults(formula.recall.map(() => false))}>
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
    <div role="status" className={`rise mt-6 flex gap-3 rounded-2xl p-4 text-sm leading-relaxed ${right ? "bg-good/8" : "bg-bad/6"}`}>
      <span className={`grid size-6 shrink-0 place-items-center rounded-full text-white ${right ? "bg-good" : "bg-bad"}`}>
        {right ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
      </span>
      <div className="min-w-0">
        <p className="font-bold">{title}</p>
        <div className="text-ink/75">{children}</div>
      </div>
    </div>
  );
}
