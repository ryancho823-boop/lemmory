import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FORMULA_BY_ID, TOPIC_COLOR } from "@lemmory/core/formulas";
import { classFormulaHealth, needsAttention, summary } from "@lemmory/core/analytics";
import { BarList } from "@lemmory/ui/charts";
import { Avatar, Button, PageHeader, Panel, PanelHeader } from "@lemmory/ui/ui";
import { getClass, studentUrl } from "@/lib/session";
import { JoinCode } from "./JoinCode";

export default async function Overview({ params }: PageProps<"/c/[classId]">) {
  const { classId } = await params;
  const { klass, today, students, assignments } = await getClass(classId);
  const base = `/c/${classId}`;

  const done = students.filter((s) => summary(s, today).doneToday).length;
  const health = classFormulaHealth(
    students,
    assignments.map((a) => a.formulaId),
    today,
  ).filter((h) => h.n > 0);
  const attention = needsAttention(students, today);
  const thisWeek = assignments.filter((a) => a.week === klass.currentWeek);

  return (
    <div className="space-y-6">
      <PageHeader
        title={klass.name}
        sub={
          students.length > 0 && (
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-good" />
              {done} of {students.length} students finished today&apos;s review
            </span>
          )
        }
        action={<Button href={`${base}/assign`}>Assign formulas</Button>}
      />

      {students.length < 3 && (
        <Panel className="p-5">
          <h2 className="text-[15px] font-bold">{students.length ? "Invite the rest of your class" : "Invite your students"}</h2>
          <p className="mb-4 mt-0.5">They sign up with a username and password. No email needed.</p>
          <JoinCode code={klass.joinCode} url={studentUrl} />
        </Panel>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Panel>
          <PanelHeader
            title="What the class is forgetting"
            info="Right on first try, last 14 days. Reteach the red ones."
            action={
              <Link href={`${base}/formulas`} className="text-sm font-semibold text-ink/50 hover:text-ink">
                All
              </Link>
            }
          />
          <div className="px-5 pb-5 pt-4">
            {health.length === 0 ? (
              <p className="text-sm text-ink/50">
                {assignments.length ? "Shows up once students start reviewing." : "Assign some formulas to get started."}
              </p>
            ) : (
              <BarList
                tone="status"
                rows={health.slice(0, 8).map((h) => ({
                  key: h.formulaId,
                  label: (
                    <Link href={`${base}/formulas/${h.formulaId}`} className="flex items-center gap-2 hover:underline">
                      <span className="size-2 shrink-0 rounded-full" style={{ background: TOPIC_COLOR[FORMULA_BY_ID[h.formulaId].topic] }} />
                      <span className="truncate">{FORMULA_BY_ID[h.formulaId].name}</span>
                    </Link>
                  ),
                  value: h.accuracy,
                  hint: `${h.struggling} students below 60%`,
                }))}
              />
            )}
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel>
            <PanelHeader title="Needs attention" info="Students behind on reviews, or under 60% right on the first try." />
            <ul className="mt-2 divide-y divide-line">
              {attention.length === 0 && <li className="px-5 py-4 text-sm text-ink/50">{students.length ? "Everyone is on track." : "No students yet."}</li>}
              {attention.map(({ student: s, tag, detail }) => (
                <li key={s.id}>
                  <Link href={`${base}/students/${s.id}`} className="flex items-center gap-3 px-5 py-2.5 hover:bg-canvas">
                    <Avatar name={s.name} size={30} />
                    <span className="min-w-0 flex-1 truncate font-semibold" title={detail}>
                      {s.name}
                    </span>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${tag === "Behind" ? "bg-bad/10 text-bad" : "bg-warn/20 text-ink/70"}`}>
                      {tag}
                    </span>
                    <ArrowRight size={14} className="shrink-0 text-ink/30" />
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <PanelHeader
              title={`Week ${klass.currentWeek} homework`}
              action={
                <Link href={`${base}/assign`} className="text-sm font-semibold text-ink/50 hover:text-ink">
                  Edit
                </Link>
              }
            />
            <ul className="mt-2 divide-y divide-line">
              {thisWeek.length === 0 && <li className="px-5 py-4 text-sm text-ink/50">Nothing assigned yet.</li>}
              {thisWeek.map((a) => (
                <li key={a.formulaId}>
                  <Link href={`${base}/formulas/${a.formulaId}`} className="flex items-center gap-3 px-5 py-2.5 text-sm font-semibold hover:bg-canvas">
                    <span className="size-2 rounded-full" style={{ background: TOPIC_COLOR[FORMULA_BY_ID[a.formulaId].topic] }} />
                    {FORMULA_BY_ID[a.formulaId].name}
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
