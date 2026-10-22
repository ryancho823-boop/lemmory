"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FORMULA_BY_ID, TOPIC_COLOR, topicOf } from "@/lib/bank";
import { useStore } from "@/lib/store";
import { CLASS_NAME } from "@/lib/sim";
import { byTopic, classFormulaHealth, recent, summary } from "@lemmory/core/analytics";
import { BarList, FLAG_MARGIN, average } from "@lemmory/ui/charts";
import { Button, PageHeader, Panel, PanelHeader, Skeleton, pct } from "@lemmory/ui/ui";

export default function TeacherOverview() {
  const { ready, students, state, today } = useStore();
  if (!ready) return <Skeleton className="h-96" />;

  const sums = students.map((s) => ({ s, m: summary(s, today) }));
  const done = sums.filter((x) => x.m.doneToday).length;
  const health = classFormulaHealth(students, state.assignments.map((a) => a.formulaId), today);
  // Formulas are compared with this class's own average, not a fixed cutoff.
  const typical = average(health.map((h) => h.accuracy));
  // Who's behind on reviews or struggling, with the specifics a teacher would act on.
  const attention = sums
    .filter((x) => x.m.streak === 0 || (x.m.accuracy ?? 1) < 0.6)
    .map(({ s, m }) => {
      const waiting = Object.values(s.cards).filter((c) => c.source === "teacher" && c.memory.due <= today).length;
      const away = m.lastActive === null ? null : today - m.lastActive;
      const weak = byTopic(recent(s.log, today, 28), topicOf)
        .filter((t) => t.n >= 3)
        .sort((a, b) => (a.accuracy ?? 1) - (b.accuracy ?? 1))[0];
      const behind = m.streak === 0;
      return {
        s,
        tag: behind ? "Behind" : "Struggling",
        detail: behind
          ? `${away === null ? "Never reviewed" : `No review in ${away}d`} · ${waiting} cards waiting`
          : `${pct(m.accuracy)} first try${weak ? ` · weak: ${weak.topic}` : ""}`,
        score: behind ? -waiting : (m.accuracy ?? 1),
      };
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, 5);
  const thisWeek = state.assignments.filter((a) => a.week === state.currentWeek);

  return (
    <div className="space-y-6">
      <PageHeader
        title={CLASS_NAME}
        sub={
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-good" />
            {done} of {students.length} students finished today&apos;s review
          </span>
        }
        action={<Button href="/teacher/assign">Assign formulas</Button>}
      />

      <div className="grid items-start gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Panel>
          <PanelHeader
            title="What the class is forgetting"
            info={`Right on the first try, last 14 days. Red means well below this class's average${typical === null ? "" : ` (${pct(typical)})`}: reteach those.`}
            action={
              <Link href="/teacher/formulas" className="text-sm font-semibold text-ink/50 hover:text-ink">
                All
              </Link>
            }
          />
          <div className="px-5 pb-5 pt-4">
            <BarList
              flagBelow={typical === null ? undefined : typical - FLAG_MARGIN}
              unit="right"
              rows={health.slice(0, 8).map((h) => ({
                key: h.formulaId,
                label: (
                  <Link href={`/teacher/formulas/${h.formulaId}`} className="flex items-center gap-2 hover:underline">
                    <span className="size-2 shrink-0 rounded-full" style={{ background: TOPIC_COLOR[FORMULA_BY_ID[h.formulaId].topic] }} />
                    <span className="truncate">{FORMULA_BY_ID[h.formulaId].name}</span>
                  </Link>
                ),
                value: h.accuracy,
                hint: `${h.struggling} students below 60%`,
              }))}
            />
          </div>
        </Panel>

        <div className="space-y-6">
          <Panel>
            <PanelHeader title="Needs attention" info="Students behind on reviews, or under 60% right on the first try." />
            <ul className="mt-2 divide-y divide-line">
              {attention.length === 0 && <li className="px-5 py-4 text-sm text-ink/50">Everyone is on track.</li>}
              {attention.map(({ s, tag, detail }) => (
                <li key={s.id}>
                  <Link href={`/teacher/students/${s.id}`} className="flex items-center gap-3 px-5 py-2.5 hover:bg-canvas">
                    <span className="min-w-0 flex-1 truncate font-semibold" title={detail}>
                      {s.name}
                    </span>
                    <span className={`shrink-0 text-sm font-bold ${tag === "Behind" ? "text-bad" : "text-ink/70"}`}>
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
              title={`Week ${state.currentWeek} homework`}
              action={
                <Link href="/teacher/assign" className="text-sm font-semibold text-ink/50 hover:text-ink">
                  Edit
                </Link>
              }
            />
            <ul className="mt-2 divide-y divide-line">
              {thisWeek.length === 0 && <li className="px-5 py-4 text-sm text-ink/50">Nothing assigned yet.</li>}
              {thisWeek.map((a) => (
                <li key={a.formulaId}>
                  <Link href={`/teacher/formulas/${a.formulaId}`} className="flex items-center gap-3 px-5 py-2.5 text-sm font-semibold hover:bg-canvas">
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
