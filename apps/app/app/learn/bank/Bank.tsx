"use client";

import type { BankEntry } from "@lemmory/core/bank";
import { FormulaBrowser } from "@lemmory/ui/FormulaBrowser";
import { DeckButton } from "../DeckButtons";

export function Bank({ formulas, assigned, sources }: { formulas: BankEntry[]; assigned: string[]; sources: Record<string, "teacher" | "self"> }) {
  return (
    <FormulaBrowser
      role="student"
      formulas={formulas}
      assigned={assigned}
      deck={Object.keys(sources)}
      hrefFor={(f) => `/learn/bank/${f.id}`}
      action={(f) => <DeckButton formulaId={f.id} inDeck={!!sources[f.id]} source={sources[f.id]} />}
    />
  );
}
