"use client";

import { useRef } from "react";
import type { Outcome, Prompt } from "@lemmory/core/grading";
import { ApplyCard } from "@lemmory/ui/review/ApplyCard";
import { RecallCard } from "@lemmory/ui/review/RecallCard";
import { checkPick, checkRecall, checkSolve } from "../actions";

/** One review card, graded on the server. Practice mode isn't recorded. */
export function CardView({
  prompt,
  mode,
  onOutcome,
  onDone,
}: {
  prompt: Prompt;
  mode: "review" | "practice";
  onOutcome?: (o: Outcome) => void;
  onDone: (correct: boolean) => void;
}) {
  // Practice isn't saved, so the browser remembers that the free typo retry was used.
  const typoUsed = useRef(false);

  if (prompt.kind === "recall")
    return (
      <RecallCard
        prompt={prompt}
        onDone={onDone}
        onCheck={async (inputs) => {
          const r = await checkRecall(prompt.formulaId, inputs, mode, typoUsed.current);
          if (r.result.status === "typo") typoUsed.current = true;
          if (r.outcome) onOutcome?.(r.outcome);
          return r.result;
        }}
      />
    );
  return (
    <ApplyCard
      prompt={prompt}
      onDone={onDone}
      onPick={async (picked) => {
        const r = await checkPick(prompt.formulaId, prompt.problemId, picked, mode);
        if (r.outcome) onOutcome?.(r.outcome);
        return r.result;
      }}
      onSolve={async (picked, answer) => {
        const r = await checkSolve(prompt.formulaId, prompt.problemId, picked, answer, mode);
        if (r.outcome) onOutcome?.(r.outcome);
        return r.result;
      }}
    />
  );
}
