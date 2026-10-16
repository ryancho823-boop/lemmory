import Link from "next/link";
import { ChevronRight, Flame } from "lucide-react";
import { TOPIC_COLOR } from "@lemmory/core/formulas";
import { byTopic, recent, summary } from "@lemmory/core/analytics";
import { kickedStudents } from "@lemmory/db/teacher";
import { Avatar, PageHeader, Panel, cx, pct, relDay } from "@lemmory/ui/ui";
import { getClass, requireTeacher, studentUrl } from "@/lib/session";
import { JoinCode } from "../JoinCode";
import { LetBackInButton } from "./LetBackInButton";

export const metadata = { title: "Students · Lemmory for teachers" };

export default async function Students({ params }: PageProps<"/c/[classId]/students">) {
  const { classId } = await params;
  const [me, { klass, students, today }] = await Promise.all([requireTeacher(), getClass(classId)]);
  const kicked = await kickedStudents(me.id, classId);
  const rows = students
    .map((s) => {
      const m = summary(s, today);
      const weakTopic = byTopic(recent(s.log, today, 28))
        .filter((t) => t.n >= 3)
        .sort((a, b) => (a.accuracy ?? 1) - (b.accuracy ?? 1))[0];
      return { s, m, weakTopic };
    })
    .sort((a, b) => (a.m.accuracy ?? 1) - (b.m.accuracy ?? 1));

  return (
    <div className="space-y-6">
      <PageHeader title="Students" sub={`${students.length} in ${klass.name}`} info="Sorted by lowest accuracy first. Click a student for their full analytics." />
      {students.length > 0 && (
        <Panel className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="border-b border-line text-left text-xs text-ink/45">
              <tr>
                <th className="px-5 py-3 font-semibold">Student</th>
                <th className="px-3 py-3 font-semibold">Today</th>
                <th className="px-3 py-3 font-semibold">Streak</th>
                <th className="px-3 py-3 font-semibold">First-try accuracy</th>
                <th className="px-3 py-3 font-semibold">Weakest topic</th>
                <th className="px-3 py-3 font-semibold">Points this week</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {rows.map(({ s, m, weakTopic }) => (
                <tr key={s.id} className="group hover:bg-canvas">
                  <td className="px-5 py-2.5">
                    <Link href={`/c/${classId}/students/${s.id}`} className="flex items-center gap-3">
                      <Avatar name={s.name} size={30} />
                      <span className="font-semibold group-hover:underline">{s.name}</span>
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
      )}
      {kicked.length > 0 && (
        <Panel>
          <div className="px-5 pt-5">
            <h2 className="text-[15px] font-bold">Kicked out</h2>
            <p className="mt-0.5 text-sm text-ink/55">The class code doesn&apos;t work for them. Letting someone back in lets them rejoin with the code.</p>
          </div>
          <ul className="mt-3 divide-y divide-line border-t border-line">
            {kicked.map((k) => (
              <li key={k.id} className="flex items-center gap-3 px-5 py-2.5">
                <Avatar name={k.name} size={30} />
                <span className="min-w-0 flex-1 truncate">
                  <span className="font-semibold">{k.name}</span> <span className="font-mono text-sm text-ink/45">{k.username}</span>
                </span>
                <LetBackInButton classId={classId} studentId={k.id} name={k.name} />
              </li>
            ))}
          </ul>
        </Panel>
      )}
      <Panel className="p-5">
        <h2 className="mb-4 text-[15px] font-bold">Add students</h2>
        <JoinCode code={klass.joinCode} url={studentUrl} />
      </Panel>
    </div>
  );
}
