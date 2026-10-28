"use client";

import { Check, Plus, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { FormulaBrowser } from "@/components/FormulaBrowser";
import { Button, PageHeader, Skeleton } from "@lemmory/ui/ui";

export default function AssignPage() {
  const { ready, state, assign, unassign, startNextWeek } = useStore();
  if (!ready) return <Skeleton className="h-96" />;

  const assigned = new Map(state.assignments.map((a) => [a.formulaId, a.week]));

  return (
    <div>
      <PageHeader
        title="Assign formulas"
        info="Assigned formulas join every student's deck. Scheduling is automatic."
        // Only once this week has homework, so a new teacher can't skip an empty week by mistake.
        action={
          state.assignments.some((a) => a.week === state.currentWeek) && (
            <Button variant="outline" onClick={startNextWeek}>
              Start week {state.currentWeek + 1}
            </Button>
          )
        }
      />

      <FormulaBrowser
        role="teacher"
        hrefFor={(f) => `/teacher/formulas/${f.id}`}
        meta={(f) => (assigned.has(f.id) ? `Week ${assigned.get(f.id)}` : "")}
        action={(f) =>
          assigned.has(f.id) ? (
            <button
              onClick={() => unassign(f.id)}
              className="group inline-flex h-8 items-center gap-1.5 rounded-xl bg-good/10 px-3 text-sm font-semibold text-good hover:bg-bad/10 hover:text-bad"
            >
              <Check size={14} strokeWidth={3} className="group-hover:hidden" />
              <X size={14} strokeWidth={3} className="hidden group-hover:block" />
              <span className="group-hover:hidden">Assigned</span>
              <span className="hidden group-hover:inline">Unassign</span>
            </button>
          ) : (
            <Button size="sm" onClick={() => assign(f.id)}>
              <Plus size={14} strokeWidth={3} /> Assign
            </Button>
          )
        }
      />
    </div>
  );
}
