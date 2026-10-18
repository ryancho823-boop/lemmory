"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { FORMULA_BY_ID } from "@/lib/bank";
import { RecallCard } from "@/components/review/RecallCard";
import { ApplyCard } from "@/components/review/ApplyCard";
import { Button, Segmented } from "@lemmory/ui/ui";

type Mode = "apply" | "recall";

const PROBLEM = FORMULA_BY_ID["power-of-a-point"].problems[0];
const OPTIONS = ["law-of-cosines", "power-of-a-point", "pythagorean", "inscribed-angle"];

/** The real review cards, embedded so visitors can try them without opening the demo. */
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
    <div className="rounded-lg border border-ink/15 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
        <Segmented
          value={mode}
          onChange={(m) => reset(m)}
          options={[
            { value: "recall", label: "1. Recall" },
            { value: "apply", label: "2. Application" },
          ]}
        />
        <span className="text-sm text-ink/60">The same card students see</span>
      </div>
      <div className="p-6 sm:p-8">
        {result !== null ? (
          <div className="py-10 text-center">
            <CheckCircle2 size={44} className="mx-auto text-good" />
            <p className="mt-3 text-xl font-extrabold">{result ? "That's one card done." : "That one's done. You'll get it next time."}</p>
            <p className="mt-1 text-ink/55">In the app, FSRS now picks the day it comes back.</p>
            <Button variant="outline" className="mt-6" onClick={() => reset()}>
              <RotateCcw size={15} /> Try again
            </Button>
          </div>
        ) : mode === "apply" ? (
          <ApplyCard key={run} problem={PROBLEM} options={OPTIONS} onDone={(ok) => setResult(ok)} />
        ) : (
          <RecallCard key={run} formula={FORMULA_BY_ID["heron"]} autoFocus={run > 0} onDone={(ok) => setResult(ok)} />
        )}
      </div>
    </div>
  );
}
