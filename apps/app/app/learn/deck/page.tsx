import Link from "next/link";
import { FORMULAS, FORMULA_BY_ID, TOPICS, TOPIC_COLOR } from "@lemmory/core/formulas";
import { type Card, mastery } from "@lemmory/core/srs";
import { Button, PageHeader, cx } from "@lemmory/ui/ui";
import { getView } from "@/lib/student";
import { RemoveButton } from "../DeckButtons";

export const metadata = { title: "My deck · Lemmory" };

const BANK_ORDER = new Map(FORMULAS.map((f, i) => [f.id, i]));

export default async function DeckPage({ searchParams }: PageProps<"/learn/deck">) {
  const v = await getView();
  const byMastery = (await searchParams).order === "mastery";
  const cards = Object.values(v.record.cards);
  const groups = byMastery
    ? [{ title: "Most mastered first", color: undefined, items: [...cards].sort((a, b) => mastery(b) - mastery(a)) }]
    : TOPICS.map((t) => ({
        title: t,
        color: TOPIC_COLOR[t],
        items: cards.filter((c) => FORMULA_BY_ID[c.formulaId].topic === t).sort((a, b) => BANK_ORDER.get(a.formulaId)! - BANK_ORDER.get(b.formulaId)!),
      })).filter((g) => g.items.length);

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="My deck"
        sub={`${cards.length} formulas`}
        action={
          !v.doneToday && (
            <Button href="/learn/review" size="sm">
              Start today&apos;s cards
            </Button>
          )
        }
      />
      <div className="inline-flex rounded-xl bg-ink/5 p-1">
        {[
          { href: "/learn/deck", label: "By topic", on: !byMastery },
          { href: "/learn/deck?order=mastery", label: "By mastery", on: byMastery },
        ].map((o) => (
          <Link
            key={o.href}
            href={o.href}
            className={cx("rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors", o.on ? "bg-white text-ink shadow-sm" : "text-ink/55 hover:text-ink")}
          >
            {o.label}
          </Link>
        ))}
      </div>
      {cards.length === 0 && (
        <p className="mt-6 rounded-2xl border border-dashed border-ink/15 p-10 text-center text-ink/50">
          Your deck is empty.{" "}
          <Link href="/learn/bank" className="font-semibold underline">
            Add formulas from the bank.
          </Link>
        </p>
      )}
      <div className="mt-6 space-y-8">
        {groups.map((g) => (
          <section key={g.title}>
            <h2 className="mb-2 flex items-center gap-2 text-sm font-bold">
              {g.color && <span className="size-2.5 rounded-full" style={{ background: g.color }} />}
              {g.title} <span className="font-medium text-ink/40">{g.items.length}</span>
            </h2>
            <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
              {g.items.map((c) => (
                <Row key={c.formulaId} card={c} showTopic={byMastery} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function Row({ card, showTopic }: { card: Card; showTopic: boolean }) {
  const f = FORMULA_BY_ID[card.formulaId];
  const m = mastery(card);
  return (
    <li className="flex items-center gap-4 px-4 py-3">
      {showTopic && <span className="size-2 shrink-0 rounded-full" style={{ background: TOPIC_COLOR[f.topic] }} />}
      <Link href={`/learn/bank/${f.id}`} className="min-w-0 flex-1 truncate text-sm font-semibold hover:underline">
        {f.name}
      </Link>
      <span className="h-1.5 w-28 shrink-0 overflow-hidden rounded-full bg-ink/8" title={`${Math.round(m * 100)}% mastered`}>
        <span className="block h-full rounded-full bg-seq-400" style={{ width: `${Math.max(m * 100, m ? 4 : 0)}%` }} />
      </span>
      {card.source === "self" ? <RemoveButton formulaId={f.id} name={f.name} /> : <span className="w-[15px]" />}
    </li>
  );
}
