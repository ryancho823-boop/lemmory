"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import { FORMULA_BY_ID, NOTES } from "@/lib/bank";
import { useStore } from "@/lib/store";
import { formulaAcrossClass } from "@lemmory/core/analytics";
import { isMastered } from "@lemmory/core/srs";
import { Tex } from "@lemmory/ui/Tex";
import { FormulaDetail } from "@lemmory/ui/FormulaDetail";
import { Button, LevelTag, Meter, Panel, PanelHeader, Skeleton, StageSteps, StatStrip, TopicTag, pct } from "@lemmory/ui/ui";

export function TeacherFormula({ id }: { id: string }) {
  const { ready, students, state, today, assign } = useStore();
  const f = FORMULA_BY_ID[id];
  if (!ready) return <Skeleton className="h-96" />;
  const assignment = state.assignments.find((a) => a.formulaId === id);
  const back = (
    <Link href="/teacher/formulas" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/45 hover:text-ink">
      <ArrowLeft size={15} /> Formula analytics
    </Link>
  );

  if (!assignment)
    return (
      <div>
        {back}
        <FormulaDetail
          f={f}
          note={NOTES[f.id]}
          actions={
            <Button onClick={() => assign(id)}>
              <Plus size={15} strokeWidth={3} /> Assign to week {state.currentWeek}
            </Button>
          }
          aside={<Panel className="p-5 text-sm text-ink/60">Not assigned yet. Once it is, class analytics show up here.</Panel>}
        />
      </div>
    );

  const c = formulaAcrossClass(students, id, today);
  const rows = [...c.rows].sort((a, b) => (a.retention ?? 2) - (b.retention ?? 2));

  return (
    <div className="space-y-6">
      <div>
        {back}
        <div className="flex flex-wrap items-center gap-3">
          <TopicTag topic={f.topic} />
          <LevelTag level={f.level} />
          <span className="text-xs font-semibold text-ink/45">Assigned week {assignment.week}</span>
        </div>
        <h1 className="mt-2 text-[28px] font-extrabold tracking-tight">{f.name}</h1>
        <div className="math-scroll mt-2 text-ink/75">
          <Tex math={f.statement} />
        </div>
      </div>

      <StatStrip
        items={[
          { label: "Right on first try", value: pct(c.accuracy), hint: "Whole class, last 14 days." },
          { label: "Recall mode", value: pct(c.recall), hint: "Typing the formula from memory." },
          { label: "Application mode", value: pct(c.apply), hint: "Picking it for a problem, then solving." },
          { label: "In application", value: `${c.inApply}/${c.rows.length}`, hint: `${c.mastered} have mastered it.` },
        ]}
      />

      <div className="grid items-start gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Panel>
          <PanelHeader title="Students" info="Sorted by lowest predicted recall first." />
          <ul className="mt-3 divide-y divide-line">
            {rows.map((r) => (
              <li key={r.student.id}>
                <Link href={`/teacher/students/${r.student.id}`} className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-2.5 hover:bg-canvas sm:grid-cols-[1fr_100px_90px_120px]">
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="truncate text-sm font-semibold">{r.student.isYou ? `${r.student.name} (demo)` : r.student.name}</span>
                  </span>
                  <span>
                    <StageSteps stage={r.card.stage} mastered={isMastered(r.card)} />
                  </span>
                  <span className="text-xs text-ink/50">{r.n ? `${pct(r.accuracy)} of ${r.n}` : "No reviews"}</span>
                  {r.retention === null ? (
                    <span className="text-xs text-ink/45">Just promoted</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Meter value={r.retention} className="w-16" />
                      <span className="text-xs tabular-nums text-ink/60">{pct(r.retention)}</span>
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-6">
          <Panel>
            <PanelHeader title="Confused with" info="Formulas students wrongly picked instead of this one in application mode." />
            <ul className="px-5 pb-4 pt-2">
              {c.confusions.length === 0 && <li className="py-2 text-sm text-ink/50">No mix-ups yet.</li>}
              {c.confusions.slice(0, 5).map((x) => (
                <li key={x.picked} className="flex items-center gap-2 py-2 text-sm">
                  <ArrowRight size={14} className="text-ink/30" />
                  <Link href={`/teacher/formulas/${x.picked}`} className="truncate font-semibold hover:underline">
                    {FORMULA_BY_ID[x.picked].name}
                  </Link>
                  <span className="ml-auto text-sm font-bold tabular-nums">{x.count}×</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
