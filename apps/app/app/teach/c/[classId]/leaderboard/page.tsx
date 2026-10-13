import { leaderRows } from "@lemmory/core/analytics";
import { InfoTip } from "@lemmory/ui/InfoTip";
import { Leaderboard } from "@lemmory/ui/Leaderboard";
import { Panel } from "@lemmory/ui/ui";
import { getClass } from "@/lib/teacher";
import { NewGameButton } from "./NewGameButton";

export const metadata = { title: "Leaderboard · Lemmory for teachers" };

export default async function TeacherLeaderboard({ params }: PageProps<"/teach/c/[classId]/leaderboard">) {
  const { classId } = await params;
  const { klass, students, today } = await getClass(classId);
  const age = today - klass.gameDay;
  return (
    <div className="mx-auto grid max-w-4xl items-start gap-6 lg:grid-cols-[1fr_300px]">
      <div>
        <Leaderboard rows={leaderRows(students, { day: klass.gameDay, baseline: klass.gameBaseline }, today)} gameAge={age} />
      </div>
      <Panel className="p-5">
        <h2 className="flex items-center gap-1 text-[17px] font-semibold">
          Current game
          <InfoTip title="New games" align="left">
            A new game sets everyone&apos;s game points to 0. Streaks and all-time points stay.
          </InfoTip>
        </h2>
        <p className="mt-1">Started {age === 0 ? "today" : age === 1 ? "yesterday" : `${age} days ago`}.</p>
        <NewGameButton classId={classId} />
      </Panel>
    </div>
  );
}
