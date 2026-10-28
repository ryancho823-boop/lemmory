"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { FORMULA_BY_ID } from "@/lib/bank";
import { RecallCard } from "@/components/review/RecallCard";
import { ApplyCard } from "@/components/review/ApplyCard";
import { Button, Segmented } from "@lemmory/ui/ui";

type Mode = "apply" | "recall";

// AM-GM: one short box to recall, then a classic contest problem where spotting it is the skill.
const FORMULA = "amgm";
const PROBLEM = FORMULA_BY_ID[FORMULA].problems[0];
const OPTIONS = ["vieta-quadratic", "amgm", "sfft", "arithmetic-series"];

/**
 * The real review cards, embedded so visitors can try them without opening the demo: one formula
 * from start to finish, recalled first, then used on a problem.
 */
export function TryIt() {
  const [mode, setMode] = useState<Mode>("recall");
  const [run, setRun] = useState(0);
  const [result, setResult] = useState<boolean | null>(null);

  const reset = (m: Mode = mode) => {
    setMode(m);
    setResult(null);
    setRun((r) => r + 1);
  };

  return (
    <div className="rounded-lg border-2 border-ink bg-white shadow-[6px_6px_0_var(--color-ink)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink px-5 py-3">
        <Segmented
          value={mode}
          onChange={(m) => reset(m)}
          options={[
            { value: "recall", label: "1. Recall" },
            { value: "apply", label: "2. Application" },
          ]}
        />
      </div>
      <div className="p-6">
        {result !== null ? (
          <div className="py-10 text-center">
            <CheckCircle2 size={44} className="mx-auto text-good" />
            <p className="mt-3 text-xl font-extrabold">{result ? "That's the whole card: recalled, then used." : "That one's done. You'll get it next time."}</p>
            <p className="mt-1 text-ink/55">In the app, FSRS now picks the day it comes back.</p>
            <Button variant="outline" className="mt-6" onClick={() => reset()}>
              <RotateCcw size={15} /> Try again
            </Button>
          </div>
        ) : mode === "apply" ? (
          <ApplyCard key={run} problem={PROBLEM} options={OPTIONS} onDone={(ok) => setResult(ok)} />
        ) : (
          // Recall leads into step 2, the way a card graduates in the app.
          <RecallCard key={run} formula={FORMULA_BY_ID[FORMULA]} autoFocus={run > 0} onDone={() => reset("apply")} />
        )}
      </div>
    </div>
  );
}
