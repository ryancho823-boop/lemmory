"use client";

import { useTransition } from "react";
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
        info="Assigned formulas join every student's deck. Scheduling is automatic."
        // Only once this week has homework, so a new teacher can't skip an empty week by mistake.
        action={
          assignments.some((a) => a.week === currentWeek) && (
            <Button variant="outline" disabled={pending} onClick={() => start(() => nextWeekAction(classId))}>
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
            <button
              onClick={() => unassign(f.id)}
              disabled={pending}
              className="group inline-flex h-8 items-center gap-1.5 rounded-xl bg-good/10 px-3 text-sm font-semibold text-good hover:bg-bad/10 hover:text-bad"
            >
              <Check size={14} strokeWidth={3} className="group-hover:hidden" />
              <X size={14} strokeWidth={3} className="hidden group-hover:block" />
              <span className="group-hover:hidden">Assigned</span>
              <span className="hidden group-hover:inline">Unassign</span>
            </button>
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
