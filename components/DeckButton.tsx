"use client";

import { Check, Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import { Button } from "./ui";

export function DeckButton({ formulaId, size = "sm" }: { formulaId: string; size?: "sm" | "md" }) {
  const { ready, state, addToDeck, removeFromDeck } = useStore();
  const card = state.cards[formulaId];
  if (!ready) return <span className="inline-block h-8 w-20" />;
  if (card)
    return (
      <button
        onClick={() => card.source === "self" && removeFromDeck(formulaId)}
        title={card.source === "teacher" ? "Assigned by your teacher" : "In your deck. Click to remove."}
        className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold text-good ${card.source === "self" ? "hover:bg-bad/8 hover:text-bad" : "cursor-default"}`}
      >
        <Check size={14} strokeWidth={3} />
        {card.source === "teacher" ? "Assigned" : "In deck"}
      </button>
    );
  return (
    <Button size={size} variant={size === "md" ? "outline" : "ghost"} onClick={() => addToDeck(formulaId)}>
      <Plus size={14} strokeWidth={3} /> Add
    </Button>
  );
}
