"use client";

import { Check, Plus, X } from "lucide-react";
import { FORMULA_BY_ID, TOPIC_COLOR } from "@/lib/formulas";
import { useStore } from "@/lib/store";
import { FormulaBrowser } from "@/components/FormulaBrowser";
import { Button, PageHeader, Panel, Skeleton } from "@/components/ui";

export default function AssignPage() {
  const { ready, state, assign, unassign, startNextWeek } = useStore();
  if (!ready) return <Skeleton className="h-96" />;

  const assigned = new Map(state.assignments.map((a) => [a.formulaId, a.week]));
  const thisWeek = state.assignments.filter((a) => a.week === state.currentWeek);
  const weeks = [...new Set(state.assignments.map((a) => a.week))].filter((w) => w !== state.currentWeek).sort((a, b) => b - a);

  return (
    <div>
      <PageHeader
        title="Assign formulas"
        info="Assigned formulas join every student's deck. Scheduling is automatic."
        action={
          <Button variant="outline" onClick={startNextWeek}>
            Start week {state.currentWeek + 1}
          </Button>
        }
      />

      <Panel className="mb-6 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[15px] font-bold">Week {state.currentWeek}</h2>
          <span className="text-sm text-ink/50">{thisWeek.length} formulas</span>
        </div>
        <ul className="mt-3 flex flex-wrap gap-2">
          {thisWeek.length === 0 && <li className="text-sm text-ink/50">Nothing yet. Pick formulas below.</li>}
          {thisWeek.map((a) => (
            <li key={a.formulaId} className="flex items-center gap-2 rounded-full border border-line bg-canvas py-1.5 pl-3 pr-1.5 text-sm font-semibold">
              <span className="size-2 rounded-full" style={{ background: TOPIC_COLOR[FORMULA_BY_ID[a.formulaId].topic] }} />
              {FORMULA_BY_ID[a.formulaId].name}
              <button onClick={() => unassign(a.formulaId)} aria-label="Unassign" className="rounded-full p-1 text-ink/35 hover:bg-white hover:text-bad">
                <X size={13} strokeWidth={3} />
              </button>
            </li>
          ))}
        </ul>
        {weeks.length > 0 && (
          <div className="mt-4 space-y-1 border-t border-line pt-3 text-sm text-ink/55">
            {weeks.map((w) => (
              <p key={w}>
                <span className="font-semibold text-ink/75">Week {w}:</span>{" "}
                {state.assignments.filter((a) => a.week === w).map((a) => FORMULA_BY_ID[a.formulaId].name).join(", ")}
              </p>
            ))}
          </div>
        )}
      </Panel>

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
