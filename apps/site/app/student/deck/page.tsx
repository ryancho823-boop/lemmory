"use client";

import Link from "next/link";
import { useState } from "react";
import { X } from "lucide-react";
import { FORMULAS, FORMULA_BY_ID, TOPICS, TOPIC_COLOR } from "@/lib/bank";
import { useStore } from "@/lib/store";
import { type Card, mastery } from "@lemmory/core/srs";
import { Button, PageHeader, Segmented, Skeleton } from "@lemmory/ui/ui";

type Order = "topic" | "mastery";
const BANK_ORDER = new Map(FORMULAS.map((f, i) => [f.id, i]));

export default function DeckPage() {
  const { ready, state, doneToday, removeFromDeck } = useStore();
  const [order, setOrder] = useState<Order>("topic");
  if (!ready) return <Skeleton className="h-96" />;

  const cards = Object.values(state.cards);
  const groups =
    order === "topic"
      ? TOPICS.map((t) => ({
          title: t,
          color: TOPIC_COLOR[t],
          items: cards
            .filter((c) => FORMULA_BY_ID[c.formulaId].topic === t)
            .sort((a, b) => BANK_ORDER.get(a.formulaId)! - BANK_ORDER.get(b.formulaId)!),
        })).filter((g) => g.items.length)
      : [{ title: "Most mastered first", color: undefined, items: [...cards].sort((a, b) => mastery(b) - mastery(a)) }];

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="My deck"
        sub={`${cards.length} formulas`}
        action={
          !doneToday && (
            <Button href="/student/review" size="sm">
              Start today&apos;s cards
            </Button>
          )
        }
      />
      <Segmented
        value={order}
        onChange={setOrder}
        options={[
          { value: "topic", label: "By topic" },
          { value: "mastery", label: "By mastery" },
        ]}
      />
      {cards.length === 0 && (
        <p className="mt-6 rounded-2xl border border-dashed border-ink/15 p-10 text-center text-ink/50">
          Your deck is empty. <Link href="/student/bank" className="font-semibold underline">Add formulas from the bank.</Link>
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
                <Row key={c.formulaId} card={c} showTopic={order === "mastery"} onRemove={() => removeFromDeck(c.formulaId)} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function Row({ card, showTopic, onRemove }: { card: Card; showTopic: boolean; onRemove: () => void }) {
  const f = FORMULA_BY_ID[card.formulaId];
  const m = mastery(card);
  return (
    <li className="flex items-center gap-4 px-4 py-3">
      {showTopic && <span className="size-2 shrink-0 rounded-full" style={{ background: TOPIC_COLOR[f.topic] }} />}
      <Link href={`/student/bank/${f.id}`} className="min-w-0 flex-1 truncate text-sm font-semibold hover:underline">
        {f.name}
      </Link>
      <span className="h-1.5 w-28 shrink-0 overflow-hidden rounded-full bg-ink/8" title={`${Math.round(m * 100)}% mastered`}>
        <span className="block h-full rounded-full bg-seq-400" style={{ width: `${Math.max(m * 100, m ? 4 : 0)}%` }} />
      </span>
      {card.source === "self" ? (
        <button onClick={onRemove} aria-label={`Remove ${f.name}`} className="text-ink/25 hover:text-bad">
          <X size={15} />
        </button>
      ) : (
        <span className="w-[15px]" />
      )}
    </li>
  );
}
