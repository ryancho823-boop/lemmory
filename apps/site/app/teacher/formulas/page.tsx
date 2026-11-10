"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FORMULA_BY_ID } from "@/lib/bank";
import { useStore } from "@/lib/store";
import { classFormulaHealth } from "@lemmory/core/analytics";
import { Meter, PageHeader, Panel, Skeleton, TopicPill, pct } from "@lemmory/ui/ui";

const SORTS = [
  { key: "name", label: "Formula", className: "px-5" },
  { key: "topic", label: "Topic", className: "px-3" },
  { key: "week", label: "Week", className: "px-3" },
  { key: "accuracy", label: "First-try accuracy", className: "px-3" },
];

export default function FormulaAnalyticsIndex() {
  const { ready, students, state, today } = useStore();
  const [sort, setSort] = useState("week");
  if (!ready) return <Skeleton className="h-96" />;
  const weekOf = new Map(state.assignments.map((a) => [a.formulaId, a.week]));
  // In the order they were assigned: week 1 first.
  const order = [...state.assignments].sort((a, b) => a.week - b.week || a.day - b.day).map((a) => a.formulaId);
  const byId = new Map(classFormulaHealth(students, order, today).map((h) => [h.formulaId, h]));
  const f = (id: string) => FORMULA_BY_ID[id];
  const health = order
    .map((id) => byId.get(id)!)
    .sort((a, b) =>
      sort === "name"
        ? f(a.formulaId).name.localeCompare(f(b.formulaId).name)
        : sort === "topic"
          ? f(a.formulaId).topic.localeCompare(f(b.formulaId).topic)
          : sort === "accuracy"
            ? (a.accuracy ?? 2) - (b.accuracy ?? 2)
            : 0,
    );

  return (
    <div>
      <PageHeader title="Formula analytics" info="Every assigned formula, in the order you assigned them. Click one for the full breakdown." />
      <Panel className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-line text-left text-xs text-ink/45">
            <tr>
              {SORTS.map((s) => (
                <th key={s.key} aria-sort={sort === s.key ? "ascending" : undefined} className={`${s.className} py-3 font-semibold`}>
                  <button onClick={() => setSort(s.key)} className={`-my-2 py-2 ${sort === s.key ? "text-ink underline" : "hover:text-ink"}`}>
                    {s.label}
                  </button>
                </th>
              ))}
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {health.map((h) => {
              const row = FORMULA_BY_ID[h.formulaId];
              return (
                <tr key={h.formulaId} className="group relative hover:bg-canvas">
                  <td className="px-5 py-3">
                    {/* Stretched over the row, so a click anywhere opens the formula. */}
                    <Link href={`/teacher/formulas/${row.id}`} className="block after:absolute after:inset-0">
                      <span className="font-semibold group-hover:underline">{row.name}</span>
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <TopicPill topic={row.topic} />
                  </td>
                  <td className="px-3 py-3 text-ink/60">{weekOf.get(row.id)}</td>
                  <td className="px-3 py-3">
                    <span className="flex items-center gap-2">
                      <Meter value={h.accuracy} className="w-20" />
                      <span className="font-semibold tabular-nums">{pct(h.accuracy)}</span>
                    </span>
                  </td>
                  <td className="pr-4">
                    <ChevronRight size={16} className="text-ink/25" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
    </div>
  );
}
