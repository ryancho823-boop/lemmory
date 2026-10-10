"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FORMULA_BY_ID } from "@/lib/formulas";
import { useStore } from "@/lib/store";
import { accuracy } from "@/lib/analytics";
import { isMastered, isNew } from "@/lib/srs";
import { FormulaDetail } from "@/components/FormulaDetail";
import { DeckButton } from "@/components/DeckButton";
import { Panel, StageTag, pct, relDay } from "@/components/ui";

export function StudentFormula({ id }: { id: string }) {
  const { ready, state, you, today } = useStore();
  const f = FORMULA_BY_ID[id];
  const card = state.cards[id];
  const log = you.log.filter((l) => l.formulaId === id);

  return (
    <div>
      <Link href="/student/bank" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/45 hover:text-ink">
        <ArrowLeft size={15} /> Formula bank
      </Link>
      <FormulaDetail
        f={f}
        actions={<DeckButton formulaId={id} size="md" />}
        aside={
          ready &&
          (card ? (
            <Panel className="p-5">
              <h2 className="text-sm font-bold">Your progress</h2>
              <div className="mt-3 flex items-center gap-2">
                <StageTag stage={card.stage} mastered={isMastered(card)} />
                <span className="text-xs text-ink/50">{card.source === "teacher" ? "Assigned by your teacher" : "Added by you"}</span>
              </div>
              <dl className="mt-4 space-y-3 text-sm">
                <Row label="First-try accuracy">{log.length ? `${pct(accuracy(log))} of ${log.length}` : "–"}</Row>
                <Row label="Next review">{isNew(card) ? "Today" : relDay(Math.max(card.memory.due, today), today)}</Row>
                <Row label="Memory stability">{isNew(card) ? "–" : `${card.memory.stability.toFixed(1)} days`}</Row>
              </dl>
            </Panel>
          ) : (
            <Panel className="p-5 text-sm text-ink/60">Add this to your deck and it&apos;ll show up in your daily review.</Panel>
          ))
        }
      />
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-ink/50">{label}</dt>
      <dd className="font-semibold">{children}</dd>
    </div>
  );
}
