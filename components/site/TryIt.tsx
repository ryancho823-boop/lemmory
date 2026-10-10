"use client";

import { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { FORMULA_BY_ID } from "@/lib/formulas";
import { RecallCard } from "@/components/review/RecallCard";
import { ApplyCard } from "@/components/review/ApplyCard";
import { Button, Segmented } from "@/components/ui";

type Mode = "apply" | "recall";

const PROBLEM = FORMULA_BY_ID["power-of-a-point"].problems[0];
const OPTIONS = ["stewart", "power-of-a-point", "ptolemy", "inscribed-angle"];

/** The real review cards, embedded so visitors can try them without opening the demo. */
export function TryIt() {
  const [mode, setMode] = useState<Mode>("apply");
  const [run, setRun] = useState(0);
  const [result, setResult] = useState<boolean | null>(null);

  const reset = (m: Mode = mode) => {
    setMode(m);
    setResult(null);
    setRun((r) => r + 1);
  };

  return (
    <div className="rounded-3xl border border-line bg-white shadow-[0_30px_70px_-40px_rgb(15_17_33/0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
        <Segmented
          value={mode}
          onChange={(m) => reset(m)}
          options={[
            { value: "apply", label: "Application" },
            { value: "recall", label: "Recall" },
          ]}
        />
        <span className="text-xs font-semibold text-ink/40">Live: this is the real card from the app</span>
      </div>
      <div className="p-6 sm:p-8">
        {result !== null ? (
          <div className="py-10 text-center">
            <CheckCircle2 size={44} className="mx-auto text-good" />
            <p className="mt-3 text-xl font-extrabold">{result ? "That's one card done." : "Card done. It would come back later today."}</p>
            <p className="mt-1 text-ink/55">In the app, FSRS now picks the day it comes back.</p>
            <Button variant="outline" className="mt-6" onClick={() => reset()}>
              <RotateCcw size={15} /> Try again
            </Button>
          </div>
        ) : mode === "apply" ? (
          <ApplyCard key={run} problem={PROBLEM} options={OPTIONS} onDone={(ok) => setResult(ok)} />
        ) : (
          <RecallCard key={run} formula={FORMULA_BY_ID["heron"]} onDone={(ok) => setResult(ok)} />
        )}
      </div>
    </div>
  );
}
