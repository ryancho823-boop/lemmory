import { Button, Panel } from "@lemmory/ui/ui";
import { getView } from "@/lib/session";
import { ReviewSession } from "./ReviewSession";

export const metadata = { title: "Today's review · Lemmory" };

export default async function ReviewPage() {
  const v = await getView();
  if (!v.canReview)
    return (
      <Panel className="mx-auto max-w-xl px-6 py-12 text-center">
        <h1 className="text-3xl font-extrabold">Your class&apos;s free trial has ended</h1>
        <p className="mt-2 text-ink/75">Ask your teacher to pick a plan. Your cards and progress are saved.</p>
        <Button href="/" className="mt-6">
          Home
        </Button>
      </Panel>
    );
  const cards = Object.fromEntries(Object.values(v.record.cards).map((c) => [c.formulaId, { source: c.source, stage: c.stage, isNew: c.memory.last === null }]));
  return (
    <ReviewSession
      queue={v.queue}
      cards={cards}
      doneToday={v.doneToday}
      nothingDue={v.nothingDue}
      inClass={!!v.klass}
      streakDays={v.record.doneDays}
      today={v.today}
      leaderboard={v.leaderboard}
      gameAge={v.gameAge}
    />
  );
}
