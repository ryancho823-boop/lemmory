import { getView } from "@/lib/session";
import { ReviewSession } from "./ReviewSession";

export const metadata = { title: "Today's review · Lemmory" };

export default async function ReviewPage() {
  const v = await getView();
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
