"use client";

// The real application card (packages/ui), graded in the browser against the demo's slice of the bank.
import { useRef } from "react";
import { checkPick, checkSolve, wrongPicks } from "@lemmory/core/check";
import { ApplyCard as Card } from "@lemmory/ui/review/ApplyCard";
import { FORMULA_BY_ID, type Problem } from "@/lib/bank";

interface Props {
  problem: Problem;
  options: string[];
  onDone: (correct: boolean, confusedWith?: string[]) => void;
}

export function ApplyCard({ problem, options, onDone }: Props) {
  // The formulas picked in step 1, so a mix-up can be recorded when the card finishes.
  const picked = useRef<string[]>([]);
  return (
    <Card
      prompt={{
        kind: "apply",
        formulaId: problem.uses[0],
        problemId: problem.id,
        text: problem.text,
        needs: problem.uses.length,
        options: options.map((id) => ({ id, name: FORMULA_BY_ID[id].name })),
        figure: problem.figure,
      }}
      onPick={async (ids) => {
        picked.current = ids;
        return checkPick(problem, ids, FORMULA_BY_ID);
      }}
      onSolve={async (_, answer) => checkSolve(problem, answer)}
      onDone={(correct) => {
        const wrong = wrongPicks(problem, picked.current);
        onDone(correct, wrong.length ? wrong : undefined);
      }}
    />
  );
}
