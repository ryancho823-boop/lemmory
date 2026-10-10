"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FORMULA_BY_ID, TOPIC_COLOR } from "@/lib/formulas";
import {
  type Student,
  byTopic,
  confusions,
  recent,
  summary,
  weakest,
} from "@/lib/analytics";
import { BarList, WeekGrid } from "./charts";
import { Meter, Panel, PanelHeader, StatStrip, pct } from "./ui";

/** A student's analytics: used for "My stats" and the teacher's per-student page. */
export function StudentAnalytics({
  student,
  today,
  formulaHref,
}: {
  student: Student;
  today: number;
  formulaHref: (id: string) => string;
}) {
  const m = summary(student, today);
  const log28 = recent(student.log, today, 28);
  const topics = byTopic(log28).sort(
    (a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0),
  );
  const weak = weakest(student, today, 6);
  const mixups = confusions(log28).slice(0, 5);

  return (
    <div className="space-y-6">
      <StatStrip
        items={[
          {
            label: "Day streak",
            value: m.streak,
            hint: m.doneToday ? "Done today" : "Not done yet today",
          },
          { label: "Cards reviewed", value: m.reviews14, hint: "Last 14 days" },
          {
            label: "Right on first try",
            value: pct(m.accuracy),
            hint: `Recall ${pct(m.recallAccuracy)} · Application ${pct(m.applyAccuracy)}`,
          },
          {
            label: "Mastered",
            value: `${m.mastered}/${m.total}`,
            hint: `${m.inApply} in application mode`,
          },
        ]}
      />

      <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Panel>
          <PanelHeader
            title="Needs work"
            info="Right on the first try less than 70% of the time."
          />
          <ul className="mt-3 divide-y divide-line">
            {weak.length === 0 && (
              <li className="px-5 py-6 text-sm text-ink/50">
                Nothing under 70%. Nice work.
              </li>
            )}
            {weak.map((w) => {
              const f = FORMULA_BY_ID[w.formulaId];
              return (
                <li key={w.formulaId}>
                  <Link
                    href={formulaHref(w.formulaId)}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-canvas"
                  >
                    <span
                      className="size-2 shrink-0 rounded-full"
                      style={{ background: TOPIC_COLOR[f.topic] }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{f.name}</p>
                      <p className="text-xs text-ink/50">
                        Right first try {pct(w.accuracy)} of {w.n}
                      </p>
                    </div>
                    <div className="w-24 text-right">
                      <Meter value={w.retention} />
                      <p className="mt-1 text-[11px] text-ink/50">
                        {pct(w.retention)} recall
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Panel>

        <div className="space-y-6">
          <Panel>
            <PanelHeader
              title="Staying up to date"
              info="Each column is a week."
            />
            <div className="px-5 pb-5 pt-4">
              <WeekGrid student={student} today={today} />
            </div>
          </Panel>
          <Panel>
            <PanelHeader
              title="By topic"
              info="Right on first try, last 4 weeks."
            />
            <div className="px-5 pb-5 pt-4">
              <BarList
                rows={topics.map((t) => ({
                  key: t.topic,
                  label: (
                    <span className="flex items-center gap-2">
                      <span
                        className="size-2 rounded-full"
                        style={{ background: TOPIC_COLOR[t.topic] }}
                      />
                      {t.topic}
                    </span>
                  ),
                  value: t.accuracy,
                  hint: `${t.n} reviews`,
                }))}
              />
            </div>
          </Panel>
        </div>
      </div>

      {mixups.length > 0 && (
        <Panel>
          <PanelHeader
            title="Mix-ups"
            info="Times the wrong formula was picked in application mode."
          />
          <ul className="mt-3 divide-y divide-line">
            {mixups.map((c) => (
              <li
                key={c.needed + c.picked}
                className="flex items-center gap-3 px-5 py-3 text-sm"
              >
                <span className="font-semibold">
                  {FORMULA_BY_ID[c.needed].name}
                </span>
                <ArrowRight size={14} className="shrink-0 text-ink/30" />
                <span className="text-ink/60">
                  confused with {FORMULA_BY_ID[c.picked].name}
                </span>
                <span className="ml-auto shrink-0 text-xs font-bold text-ink/50">
                  {c.count}×
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
