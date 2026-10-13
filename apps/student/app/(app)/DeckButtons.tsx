"use client";

import { useTransition } from "react";
import { Check, Plus, X } from "lucide-react";
import { Button } from "@lemmory/ui/ui";
import { addCard, removeCard } from "../actions";

/** Add a formula to your own deck, or show that it's already there. */
export function DeckButton({ formulaId, inDeck, source, size = "sm" }: { formulaId: string; inDeck: boolean; source?: "teacher" | "self"; size?: "sm" | "md" }) {
  const [pending, start] = useTransition();
  if (inDeck)
    return (
      <button
        disabled={pending}
        onClick={() => source === "self" && start(() => removeCard(formulaId))}
        title={source === "teacher" ? "Assigned by your teacher" : "In your deck. Click to remove."}
        className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold text-good disabled:opacity-50 ${source === "self" ? "hover:bg-bad/8 hover:text-bad" : "cursor-default"}`}
      >
        <Check size={14} strokeWidth={3} />
        {source === "teacher" ? "Assigned" : "In deck"}
      </button>
    );
  return (
    <Button size={size} variant={size === "md" ? "outline" : "ghost"} disabled={pending} onClick={() => start(() => addCard(formulaId))}>
      <Plus size={14} strokeWidth={3} /> Add
    </Button>
  );
}

export function RemoveButton({ formulaId, name }: { formulaId: string; name: string }) {
  const [pending, start] = useTransition();
  return (
    <button disabled={pending} onClick={() => start(() => removeCard(formulaId))} aria-label={`Remove ${name}`} className="text-ink/25 hover:text-bad disabled:opacity-50">
      <X size={15} />
    </button>
  );
}
