"use client";

// The real recall card (packages/ui), graded in the browser against the demo's slice of the bank.
import { useRef } from "react";
import { checkRecall, recallPrompt } from "@lemmory/core/check";
import { RecallCard as Card } from "@lemmory/ui/review/RecallCard";
import type { Formula } from "@/lib/bank";

/** `autoFocus` is off where the card sits mid-page (the homepage), so loading the page doesn't scroll to it. */
/** `onGraded` runs as soon as the answer is graded (before Continue), with whether it was right. */
export function RecallCard({
  formula,
  onDone,
  onGraded,
  autoFocus = true,
}: {
  formula: Formula;
  onDone: (correct: boolean) => void;
  onGraded?: (correct: boolean) => void;
  autoFocus?: boolean;
}) {
  // Like the app: one free retry per card to fix a one-letter slip.
  const typoOffered = useRef(false);
  return (
    <Card
      prompt={recallPrompt(formula)}
      autoFocus={autoFocus}
      onCheck={async (inputs) => {
        const result = checkRecall(formula, inputs, !typoOffered.current);
        if (result.status === "typo") typoOffered.current = true;
        else onGraded?.(result.results.every(Boolean));
        return result;
      }}
      onDone={onDone}
    />
  );
}
