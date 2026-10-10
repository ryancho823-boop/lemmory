"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { FORMULA_BY_ID, type Problem } from "@/lib/formulas";
import { gradeNumber } from "@/lib/grade";
import { MathInput } from "@/components/MathInput";
import { Rich, Tex } from "@/components/Tex";
import { Button, StageTag, cx } from "@/components/ui";
import { Feedback } from "./RecallCard";

interface Props {
  problem: Problem;
  options: string[];
  onDone: (correct: boolean, confusedWith?: string[]) => void;
}

/** Stage 2: recognize which formula(s) the problem needs, then solve it. */
export function ApplyCard({ problem, options, onDone }: Props) {
  const [picked, setPicked] = useState<string[]>([]);
  const [pickRight, setPickRight] = useState<boolean | null>(null);
  const [answer, setAnswer] = useState("");
  const [solveRight, setSolveRight] = useState<boolean | null>(null);
  const wrongPicks = picked.filter((id) => !problem.uses.includes(id));

  const toggle = (id: string) =>
    pickRight === null && setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const checkPick = () => {
    if (!picked.length) return;
    const want = new Set(problem.uses);
    setPickRight(picked.length === want.size && picked.every((id) => want.has(id)));
  };
  const checkSolve = (value = answer) => {
    if (solveRight !== null) return onDone(!!pickRight && solveRight, wrongPicks.length ? wrongPicks : undefined);
    if (value.trim()) setSolveRight(gradeNumber(problem.answer, value));
  };

  return (
    <div>
      <StageTag stage="apply" />
      <p className="mt-4 text-lg leading-relaxed">
        <Rich text={problem.text} />
      </p>

      <div className="mt-7 flex items-center gap-2">
        <Step n={1} done={pickRight !== null} />
        <h3 className="font-bold">Which formula{problem.uses.length > 1 ? "s" : ""} does this need?</h3>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {options.map((id) => {
          const f = FORMULA_BY_ID[id];
          const on = picked.includes(id);
          const needed = problem.uses.includes(id);
          const tone =
            pickRight === null
              ? on
                ? "border-ink bg-ink text-white"
                : "border-line bg-white hover:border-ink/40"
              : needed
                ? "border-good bg-good/6"
                : on
                  ? "border-bad bg-bad/5"
                  : "border-line bg-white opacity-50";
          return (
            <button
              key={id}
              onClick={() => toggle(id)}
              aria-pressed={on}
              className={cx("rounded-2xl border-2 px-4 py-3 text-left transition-all", tone)}
            >
              <span className="flex items-center justify-between gap-2 font-semibold">
                {f.name}
                {pickRight !== null && needed && <Check size={16} strokeWidth={3} className="text-good" />}
              </span>
              {pickRight !== null && (needed || on) && (
                <span className="mt-1 block overflow-x-auto text-[13px] text-ink/70">
                  <Tex math={f.statement} />
                </span>
              )}
            </button>
          );
        })}
      </div>
      {pickRight === null ? (
        <Button size="lg" className="mt-4" onClick={checkPick} disabled={!picked.length}>
          Check
        </Button>
      ) : (
        <p className={cx("rise mt-3 text-sm", pickRight ? "text-good" : "text-bad")}>
          <b>{pickRight ? "Right tool." : "Not quite."}</b>{" "}
          <span className="text-ink/60">
            <Rich text={FORMULA_BY_ID[problem.uses[0]].whenToUse} />
          </span>
        </p>
      )}

      {pickRight !== null && (
        <div className="rise">
          <div className="mt-8 flex items-center gap-2">
            <Step n={2} done={solveRight !== null} />
            <h3 className="font-bold">Now solve it.</h3>
          </div>
          <div className="mt-3 max-w-sm">
            <MathInput
              autoFocus
              tools={false}
              disabled={solveRight !== null}
              state={solveRight === null ? "idle" : solveRight ? "right" : "wrong"}
              onChange={setAnswer}
              onEnter={(v) => checkSolve(v)}
            />
          </div>
          {solveRight !== null && (
            <Feedback right={solveRight} title={solveRight ? "Correct" : "Not quite"}>
              {!solveRight && (
                <span className="block">
                  Answer: <Tex math={problem.answer} />
                </span>
              )}
              <span className="block">
                <Rich text={problem.solution} />
              </span>
            </Feedback>
          )}
          <Button size="lg" className="mt-4" onClick={() => checkSolve()} disabled={!answer.trim() && solveRight === null}>
            {solveRight === null ? "Check" : "Continue"}
          </Button>
        </div>
      )}
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
