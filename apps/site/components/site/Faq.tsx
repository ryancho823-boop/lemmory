"use client";

import { useState } from "react";
import { cx } from "@lemmory/ui/ui";

export type FaqItem = { q: string; a: string };
export type FaqGroup = { id: string; label: string; color: string; items: FaqItem[] };

/** Questions grouped by topic: pick a group, read the answers side by side. Nothing to expand. */
export function Faq({ groups }: { groups: FaqGroup[] }) {
  const [active, setActive] = useState(groups[0].id);
  const group = groups.find((g) => g.id === active) ?? groups[0];
  return (
    <div>
      <div role="tablist" aria-label="Question topics" className="flex flex-wrap gap-2">
        {groups.map((g) => (
          <button
            key={g.id}
            role="tab"
            aria-selected={g.id === active}
            onClick={() => setActive(g.id)}
            className={cx(
              "rounded-lg border-2 px-4 py-2 font-semibold transition-colors",
              g.id === active ? "text-white" : "border-line bg-white text-ink/75 hover:border-ink/30 hover:text-ink",
            )}
            style={g.id === active ? { background: g.color, borderColor: g.color } : undefined}
          >
            {g.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" key={group.id} className="mt-8 grid gap-4 md:grid-cols-2">
        {group.items.map((f, i) => (
          <article
            key={f.q}
            className="rise rounded-lg border border-line border-l-4 bg-white p-6"
            style={{ borderLeftColor: group.color, animationDelay: `${i * 50}ms` }}
          >
            <h3 className="font-display text-xl leading-snug">{f.q}</h3>
            <p className="mt-2 leading-relaxed text-ink/80">{f.a}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
