import { Leaderboard } from "@lemmory/ui/Leaderboard";
import { Button, Panel } from "@lemmory/ui/ui";
import { getView } from "@/lib/session";

export const metadata = { title: "Leaderboard · Lemmory" };

export default async function LeaderboardPage() {
  const v = await getView();
  return (
    <div className="mx-auto max-w-2xl">
      {v.klass ? (
        <Leaderboard rows={v.leaderboard} gameAge={v.gameAge} />
      ) : (
        <Panel className="p-8 text-center">
          Join a class to compete on its leaderboard.
          <div className="mt-4">
            <Button href="/class">Join a class</Button>
          </div>
        </Panel>
      )}
    </div>
  );
}
