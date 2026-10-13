import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FORMULA_BY_ID } from "@lemmory/core/formulas";
import { formulaAcrossClass } from "@lemmory/core/analytics";
import { isMastered } from "@lemmory/core/srs";
import { FormulaDetail } from "@lemmory/ui/FormulaDetail";
import { Tex } from "@lemmory/ui/Tex";
import { Avatar, LevelTag, Meter, Panel, PanelHeader, StageSteps, StatStrip, TopicTag, pct } from "@lemmory/ui/ui";
import { getClass } from "@/lib/session";
import { AssignButton } from "../../AssignButton";

export async function generateMetadata({ params }: PageProps<"/c/[classId]/formulas/[formulaId]">) {
  const f = FORMULA_BY_ID[(await params).formulaId];
  return { title: f ? `${f.name} · Lemmory for teachers` : "Lemmory for teachers" };
}

export default async function TeacherFormula({ params }: PageProps<"/c/[classId]/formulas/[formulaId]">) {
  const { classId, formulaId } = await params;
  const f = FORMULA_BY_ID[formulaId];
  if (!f) notFound();
  const { klass, students, assignments, today } = await getClass(classId);
  const base = `/c/${classId}`;
  const assignment = assignments.find((a) => a.formulaId === formulaId);
  const back = (
    <Link href={`${base}/formulas`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/45 hover:text-ink">
      <ArrowLeft size={15} /> Formula analytics
    </Link>
  );

  if (!assignment)
    return (
      <div>
        {back}
        <FormulaDetail
          f={f}
          actions={<AssignButton classId={classId} formulaId={formulaId} week={klass.currentWeek} />}
          aside={<Panel className="p-5 text-sm text-ink/60">Not assigned yet. Once it is, class analytics show up here.</Panel>}
        />
      </div>
    );

  const c = formulaAcrossClass(students, formulaId, today);
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
        <div className="mt-2 overflow-x-auto text-ink/75">
          <Tex math={f.statement} />
        </div>
      </div>

      <StatStrip
        items={[
          { label: "Right on first try", value: pct(c.accuracy), hint: "Class, last 14 days" },
          { label: "Recall mode", value: pct(c.recall), hint: "Typing the formula" },
          { label: "Application mode", value: pct(c.apply), hint: "Spotting it in a problem" },
          { label: "In application", value: `${c.inApply}/${c.rows.length}`, hint: `${c.mastered} mastered` },
        ]}
      />

      <div className="grid items-start gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Panel>
          <PanelHeader title="Students" info="Sorted by lowest predicted recall first." />
          <ul className="mt-3 divide-y divide-line">
            {rows.length === 0 && <li className="px-5 py-4 text-sm text-ink/50">No students yet.</li>}
            {rows.map((r) => (
              <li key={r.student.id}>
                <Link
                  href={`${base}/students/${r.student.id}`}
                  className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1 px-5 py-2.5 hover:bg-canvas sm:grid-cols-[1fr_100px_90px_120px]"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <Avatar name={r.student.name} size={28} />
                    <span className="truncate text-sm font-semibold">{r.student.name}</span>
                  </span>
                  <span>
                    <StageSteps stage={r.card.stage} mastered={isMastered(r.card)} />
                  </span>
                  <span className="text-xs text-ink/50">{r.n ? `${pct(r.accuracy)} of ${r.n}` : "No reviews"}</span>
                  {r.retention === null ? (
                    <span className="text-xs text-ink/45">Not started</span>
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

        <Panel>
          <PanelHeader title="Confused with" info="Formulas students wrongly picked instead of this one in application mode." />
          <ul className="px-5 pb-4 pt-2">
            {c.confusions.length === 0 && <li className="py-2 text-sm text-ink/50">No mix-ups yet.</li>}
            {c.confusions.slice(0, 5).map((x) => (
              <li key={x.picked} className="flex items-center gap-2 py-2 text-sm">
                <ArrowRight size={14} className="text-ink/30" />
                <Link href={`${base}/formulas/${x.picked}`} className="truncate font-semibold hover:underline">
                  {FORMULA_BY_ID[x.picked].name}
                </Link>
                <span className="ml-auto rounded-full bg-ink/5 px-2 py-0.5 text-xs font-bold">{x.count}×</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
