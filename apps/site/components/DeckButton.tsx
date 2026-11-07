"use client";

import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "@lemmory/ui/ui";

export function DeckButton({ formulaId, size = "sm" }: { formulaId: string; size?: "sm" | "md" }) {
  const { ready, state, addToDeck, removeFromDeck } = useStore();
  const card = state.cards[formulaId];
  // Two taps to remove: the first asks, and the question goes away by itself.
  const [sure, setSure] = useState(false);
  useEffect(() => {
    if (!sure) return;
    const t = setTimeout(() => setSure(false), 4000);
    return () => clearTimeout(t);
  }, [sure]);
  if (!ready) return <span className="inline-block h-8 w-20" />;
  if (card)
    return (
      <button
        onClick={() => {
          if (card.source !== "self") return;
          if (sure) removeFromDeck(formulaId);
          else setSure(true);
        }}
        title={card.source === "teacher" ? "Assigned by your teacher" : "In your deck. Click to remove."}
        className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold ${sure ? "text-bad" : "text-good"} ${card.source === "self" ? "hover:bg-bad/8 hover:text-bad" : "cursor-default"}`}
      >
        {!sure && <Check size={14} strokeWidth={3} />}
        {sure ? "Remove and lose its progress?" : card.source === "teacher" ? "Assigned" : "In deck"}
      </button>
    );
  return (
    <Button size={size} variant={size === "md" ? "outline" : "ghost"} onClick={() => addToDeck(formulaId)}>
      <Plus size={14} strokeWidth={3} /> Add
    </Button>
  );
}
