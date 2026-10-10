"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { FORMULA_BY_ID, TOPIC_COLOR } from "@/lib/formulas";
import { useStore } from "@/lib/store";
import { CLASS_NAME, CONTEST, contestLabel } from "@/lib/sim";
import { byTopic, classFormulaHealth, recent, summary } from "@/lib/analytics";
import { BarList } from "@/components/charts";
import { Avatar, Button, PageHeader, Panel, PanelHeader, Skeleton, pct } from "@/components/ui";

export default function TeacherOverview() {
  const { ready, students, state, today } = useStore();
  if (!ready) return <Skeleton className="h-96" />;

  const sums = students.map((s) => ({ s, m: summary(s, today) }));
  const done = sums.filter((x) => x.m.doneToday).length;
  const health = classFormulaHealth(students, state.assignments.map((a) => a.formulaId), today);
  // Who's behind on reviews or struggling, with the specifics a teacher would act on.
  const attention = sums
    .filter((x) => x.m.streak === 0 || (x.m.accuracy ?? 1) < 0.6)
    .map(({ s, m }) => {
      const waiting = Object.values(s.cards).filter((c) => c.source === "teacher" && c.memory.due <= today).length;
      const away = m.lastActive === null ? null : today - m.lastActive;
      const weak = byTopic(recent(s.log, today, 28))
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
        eyebrow={ready ? contestLabel(today) : CONTEST}
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
            info="Right on first try, last 14 days. Reteach the red ones."
            action={
              <Link href="/teacher/formulas" className="text-sm font-semibold text-ink/50 hover:text-ink">
                All
              </Link>
            }
          />
          <div className="px-5 pb-5 pt-4">
            <BarList
              tone="status"
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
                    <Avatar name={s.name} size={30} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{s.name}</span>
                      <span className="block truncate text-xs text-ink/55">{detail}</span>
                    </span>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${
                        tag === "Behind" ? "bg-bad/10 text-bad" : "bg-warn/20 text-ink/70"
                      }`}
                    >
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
