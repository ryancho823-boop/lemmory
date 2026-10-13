import { bankEntries } from "@lemmory/core/bank";
import { PageHeader } from "@lemmory/ui/ui";
import { getView } from "@/lib/session";
import { Bank } from "./Bank";

export const metadata = { title: "Formula bank · Lemmory" };

export default async function BankPage() {
  const v = await getView();
  const formulas = bankEntries();
  const sources = Object.fromEntries(Object.values(v.record.cards).map((c) => [c.formulaId, c.source]));
  return (
    <div>
      <PageHeader title="Formula bank" sub={`${formulas.length} formulas from AMC 8 to AIME, plus calculus rounds.`} />
      <Bank formulas={formulas} assigned={v.assigned} sources={sources} />
    </div>
  );
}
