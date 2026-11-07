"use client";

import { useEffect, useState, useTransition } from "react";
import { Check, Plus, X } from "lucide-react";
import type { BankEntry } from "@lemmory/core/bank";
import { FormulaBrowser } from "@lemmory/ui/FormulaBrowser";
import { Button, PageHeader } from "@lemmory/ui/ui";
import { assignAction, nextWeekAction, unassignAction } from "../../../../actions";

export function Assign({
  classId,
  formulas,
  assignments,
  currentWeek,
}: {
  classId: string;
  formulas: BankEntry[];
  assignments: { formulaId: string; week: number }[];
  currentWeek: number;
}) {
  const [pending, start] = useTransition();
  const weekOf = new Map(assignments.map((a) => [a.formulaId, a.week]));
  const assign = (id: string) => start(() => assignAction(classId, id));
  const unassign = (id: string) => start(() => unassignAction(classId, id));

  return (
    <div>
      <PageHeader
        title="Assign formulas"
        sub={`Now assigning for week ${currentWeek}`}
        info="Assigned formulas join every student's deck. Scheduling is automatic."
        // Only once this week has homework, so a new teacher can't skip an empty week by mistake.
        action={
          assignments.some((a) => a.week === currentWeek) && (
            <Button variant="outline" disabled={pending} onClick={() => confirm(`Start week ${currentWeek + 1}? New formulas you assign will go into it.`) && start(() => nextWeekAction(classId))}>
              Start week {currentWeek + 1}
            </Button>
          )
        }
      />

      <FormulaBrowser
        role="teacher"
        formulas={formulas}
        assigned={assignments.map((a) => a.formulaId)}
        hrefFor={(f) => `/c/${classId}/formulas/${f.id}`}
        meta={(f) => (weekOf.has(f.id) ? `Week ${weekOf.get(f.id)}` : "")}
        action={(f) =>
          weekOf.has(f.id) ? (
            <UnassignButton pending={pending} onUnassign={() => unassign(f.id)} />
          ) : (
            <Button size="sm" disabled={pending} onClick={() => assign(f.id)}>
              <Plus size={14} strokeWidth={3} /> Assign
            </Button>
          )
        }
      />
    </div>
  );
}

/** "Assigned", and two taps to take it back: a tap on a touch screen has no hover to warn first. */
function UnassignButton({ pending, onUnassign }: { pending: boolean; onUnassign: () => void }) {
  const [sure, setSure] = useState(false);
  useEffect(() => {
    if (!sure) return;
    const t = setTimeout(() => setSure(false), 4000);
    return () => clearTimeout(t);
  }, [sure]);
  return (
    <button
      onClick={() => (sure ? onUnassign() : setSure(true))}
      disabled={pending}
      className={`inline-flex h-8 items-center gap-1.5 rounded-xl px-3 text-sm font-semibold ${sure ? "bg-bad/10 text-bad" : "bg-good/10 text-good"}`}
    >
      {sure ? <X size={14} strokeWidth={3} /> : <Check size={14} strokeWidth={3} />}
      {sure ? "Unassign?" : "Assigned"}
    </button>
  );
}
