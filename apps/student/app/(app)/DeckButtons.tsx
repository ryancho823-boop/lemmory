"use client";

import { useEffect, useState, useTransition } from "react";
import { Check, Plus, X } from "lucide-react";
import { Button } from "@lemmory/ui/ui";
import { addCard, removeCard } from "../actions";

/** Add a formula to your own deck, or show that it's already there. */
/** Two taps to remove: the first asks, and the question goes away by itself. */
function useSure() {
  const [sure, setSure] = useState(false);
  useEffect(() => {
    if (!sure) return;
    const t = setTimeout(() => setSure(false), 4000);
    return () => clearTimeout(t);
  }, [sure]);
  return [sure, setSure] as const;
}

export function DeckButton({ formulaId, inDeck, source, size = "sm" }: { formulaId: string; inDeck: boolean; source?: "teacher" | "self"; size?: "sm" | "md" }) {
  const [pending, start] = useTransition();
  const [sure, setSure] = useSure();
  if (inDeck)
    return (
      <button
        disabled={pending}
        onClick={() => {
          if (source !== "self") return;
          if (sure) start(() => removeCard(formulaId));
          else setSure(true);
        }}
        title={source === "teacher" ? "Assigned by your teacher" : "In your deck. Tap to remove."}
        className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold disabled:opacity-50 ${sure ? "text-bad" : "text-good"} ${source === "self" ? "hover:bg-bad/8 hover:text-bad" : "cursor-default"}`}
      >
        {sure ? null : <Check size={14} strokeWidth={3} />}
        {sure ? "Remove and lose its progress?" : source === "teacher" ? "Assigned" : "In deck"}
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
  const [sure, setSure] = useSure();
  return (
    <button
      disabled={pending}
      onClick={() => (sure ? start(() => removeCard(formulaId)) : setSure(true))}
      aria-label={sure ? `Confirm removing ${name}` : `Remove ${name}`}
      className={sure ? "text-sm font-semibold text-bad disabled:opacity-50" : "text-ink/25 hover:text-bad disabled:opacity-50"}
    >
      {sure ? "Remove?" : <X size={15} />}
    </button>
  );
}
