"use client";

import Link from "next/link";
import { ChevronRight, Flame } from "lucide-react";
import { TOPIC_COLOR } from "@/lib/formulas";
import { useStore } from "@/lib/store";
import { byTopic, recent, summary } from "@/lib/analytics";
import { Avatar, PageHeader, Panel, Skeleton, cx, pct, relDay } from "@/components/ui";

export default function StudentsPage() {
  const { ready, students, today } = useStore();
  if (!ready) return <Skeleton className="h-96" />;
  const rows = students
    .map((s) => {
      const m = summary(s, today);
      const topics = byTopic(recent(s.log, today, 28)).filter((t) => t.n >= 3);
      const weakTopic = topics.sort((a, b) => (a.accuracy ?? 1) - (b.accuracy ?? 1))[0];
      return { s, m, weakTopic };
    })
    .sort((a, b) => (a.m.accuracy ?? 1) - (b.m.accuracy ?? 1));

  return (
    <div>
      <PageHeader title="Students" info="Sorted by lowest accuracy first. Click a student for their full analytics." />
      <Panel className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="border-b border-line text-left text-xs text-ink/45">
            <tr>
              <th className="px-5 py-3 font-semibold">Student</th>
              <th className="px-3 py-3 font-semibold">Today</th>
              <th className="px-3 py-3 font-semibold">Streak</th>
              <th className="px-3 py-3 font-semibold">First-try accuracy</th>
              <th className="px-3 py-3 font-semibold">Weakest topic</th>
              <th className="px-3 py-3 font-semibold">XP this week</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map(({ s, m, weakTopic }) => (
              <tr key={s.id} className="group hover:bg-canvas">
                <td className="px-5 py-2.5">
                  <Link href={`/teacher/students/${s.id}`} className="flex items-center gap-3">
                    <Avatar name={s.name} size={30} you={s.isYou} />
                    <span className="font-semibold group-hover:underline">{s.isYou ? `${s.name} (demo)` : s.name}</span>
                  </Link>
                </td>
                <td className="px-3 py-2.5">
                  {m.doneToday ? (
                    <span className="font-semibold text-good">Done</span>
                  ) : (
                    <span className="text-ink/40">{m.lastActive === null ? "Never" : `Last: ${relDay(m.lastActive, today).toLowerCase()}`}</span>
                  )}
                </td>
                <td className="px-3 py-2.5">
                  <span className={cx("flex items-center gap-1 font-semibold", m.streak === 0 && "text-bad")}>
                    <Flame size={14} /> {m.streak}
                  </span>
                </td>
                <td className={cx("px-3 py-2.5 font-semibold tabular-nums", (m.accuracy ?? 1) < 0.6 && "text-bad")}>{pct(m.accuracy)}</td>
                <td className="px-3 py-2.5">
                  {weakTopic ? (
                    <span className="flex items-center gap-1.5 text-ink/70">
                      <span className="size-2 rounded-full" style={{ background: TOPIC_COLOR[weakTopic.topic] }} />
                      {weakTopic.topic}
                    </span>
                  ) : (
                    "–"
                  )}
                </td>
                <td className="px-3 py-2.5 tabular-nums">{m.xpWeek}</td>
                <td className="pr-4">
                  <ChevronRight size={16} className="text-ink/25" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
