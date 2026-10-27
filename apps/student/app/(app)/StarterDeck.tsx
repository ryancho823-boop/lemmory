"use client";

import { useTransition } from "react";
import { STARTER_LEVELS } from "@lemmory/core/starter";
import { Button, Panel } from "@lemmory/ui/ui";
import { startDeck } from "../actions";

/** For a student on their own with an empty deck: pick a contest and start with its formulas. */
export function StarterDeck() {
  const [pending, start] = useTransition();
  return (
    <Panel className="p-6">
      <h2 className="text-xl font-extrabold">Which contest are you preparing for?</h2>
      <p className="mt-1">You&apos;ll get its formulas as flashcards, six new ones a day. You can add or remove any of them in the Formula bank.</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {STARTER_LEVELS.map((l) => (
          <Button key={l} variant="outline" disabled={pending} onClick={() => start(() => startDeck(l))}>
            {l}
          </Button>
        ))}
      </div>
    </Panel>
  );
}
