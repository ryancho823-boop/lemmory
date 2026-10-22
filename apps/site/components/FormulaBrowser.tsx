"use client";

// The real formula browser (packages/ui) over the demo's slice of the bank, with the rest
// of the bank listed by name as locked rows.
import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { FormulaBrowser as Browser } from "@lemmory/ui/FormulaBrowser";
import type { BankEntry } from "@lemmory/core/bank";
import { FORMULAS, LOCKED, TOTAL_FORMULAS, byDifficulty, difficultyTier } from "@/lib/bank";
import { useStore } from "@/lib/store";

const ENTRIES: BankEntry[] = [...FORMULAS].sort(byDifficulty).map((f) => ({
  id: f.id,
  name: f.name,
  topic: f.topic,
  level: f.level,
  statement: f.statement,
  whenToUse: f.whenToUse,
  tier: difficultyTier(f),
}));
const LOCKED_ENTRIES = [...LOCKED].sort(byDifficulty).map((f) => ({ ...f, tier: difficultyTier(f) }));

interface Props {
  role: "student" | "teacher";
  hrefFor: (f: BankEntry) => string;
  action?: (f: BankEntry) => React.ReactNode;
  /** Small note next to the name (e.g. "Week 2"). */
  meta?: (f: BankEntry) => React.ReactNode;
}

export function FormulaBrowser(props: Props) {
  const { state } = useStore();
  const assigned = useMemo(() => state.assignments.map((a) => a.formulaId), [state.assignments]);
  const deck = useMemo(() => Object.keys(state.cards), [state.cards]);
  return (
    <Browser
      {...props}
      formulas={ENTRIES}
      assigned={assigned}
      deck={deck}
      locked={LOCKED_ENTRIES}
      banner={
        <Link href="/pricing#pricing" className="mb-4 flex items-center gap-3 rounded-2xl border border-lemon/60 bg-lemon-soft px-4 py-3 text-sm hover:border-lemon-deep/50">
          <Lock size={16} className="shrink-0 text-lemon-deep" />
          <span className="min-w-0 flex-1 text-ink/75">
            <b className="text-ink">The demo includes {FORMULAS.length} of {TOTAL_FORMULAS} formulas.</b> The rest come with every plan.
          </span>
          <ArrowRight size={15} className="shrink-0 text-ink/40" />
        </Link>
      }
    />
  );
}
