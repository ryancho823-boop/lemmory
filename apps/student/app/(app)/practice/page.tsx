import { FORMULA_BY_ID } from "@lemmory/core/formulas";
import { isNew } from "@lemmory/core/srs";
import { getUnlockedView } from "@/lib/session";
import { Practice } from "./Practice";

export const metadata = { title: "Practice · Lemmory" };

export default async function PracticePage() {
  const v = await getUnlockedView();
  // Cards still waiting in today's review can't be practiced (practice shows the answers).
  const deck = Object.values(v.record.cards)
    .filter((c) => !isNew(c) && !v.queue.includes(c.formulaId))
    .map((c) => ({ id: c.formulaId, topic: FORMULA_BY_ID[c.formulaId].topic }));
  return <Practice deck={deck} />;
}
