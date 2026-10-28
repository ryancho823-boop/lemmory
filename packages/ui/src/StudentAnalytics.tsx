import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type Formula, TOPIC_COLOR } from "@lemmory/core/content/types";
import {
  type Student,
  byTopic,
  confusions,
  recent,
  summary,
  weakest,
} from "@lemmory/core/analytics";
import { BarList, WeekGrid } from "./charts";
import { Meter, Panel, PanelHeader, StatStrip, pct } from "./ui";

/** A student's analytics: used for "My stats" and the teacher's per-student page. */
export function StudentAnalytics({
  student,
  today,
  formulaHref,
  formulaById,
}: {
  student: Student;
  today: number;
  formulaHref: (id: string) => string;
  /** The formulas this app has: the full bank, or the demo's slice. */
  formulaById: Record<string, Formula>;
}) {
  const m = summary(student, today);
  const log28 = recent(student.log, today, 28);
  const topics = byTopic(log28, (id) => formulaById[id]?.topic).sort(
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
            hint: m.doneToday ? "Today's review is done." : "Today's review isn't done yet.",
          },
          { label: "Cards reviewed", value: m.reviews14, hint: "In the last 14 days." },
          {
            label: "Right on first try",
            value: pct(m.accuracy),
            hint: `Last 14 days. Recall ${pct(m.recallAccuracy)}, application ${pct(m.applyAccuracy)}.`,
          },
          {
            label: "Mastered",
            value: `${m.mastered}/${m.total}`,
            hint: `${m.inApply} of ${m.total} cards are in application mode.`,
          },
        ]}
      />

      <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Panel>
          <PanelHeader
            title="Needs work"
            info="Right on the first try less than 70% of the time, over the last 4 weeks."
          />
          <ul className="mt-3 divide-y divide-line">
            {weak.length === 0 && (
              <li className="px-5 py-6">
                {student.log.length ? "Nothing under 70%. Nice work." : "Do your first review to see what needs work."}
              </li>
            )}
            {weak.map((w) => {
              const f = formulaById[w.formulaId];
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
                    <span className="min-w-0 flex-1 truncate font-semibold">{f.name}</span>
                    <Meter value={w.accuracy} className="hidden w-20 xl:block" />
                    <span className="w-10 text-right tabular-nums">{pct(w.accuracy)}</span>
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
                unit="right"
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
                  {formulaById[c.needed].name}
                </span>
                <ArrowRight size={14} className="shrink-0 text-ink/30" />
                <span className="text-ink/60">
                  confused with {formulaById[c.picked].name}
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
