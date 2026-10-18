"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FORMULA_BY_ID } from "@/lib/bank";
import { useStore } from "@/lib/store";
import { classFormulaHealth } from "@/lib/analytics";
import { Meter, PageHeader, Panel, Skeleton, TopicPill, pct } from "@lemmory/ui/ui";

export default function FormulaAnalyticsIndex() {
  const { ready, students, state, today } = useStore();
  if (!ready) return <Skeleton className="h-96" />;
  const weekOf = new Map(state.assignments.map((a) => [a.formulaId, a.week]));
  // In the order they were assigned: week 1 first.
  const order = [...state.assignments].sort((a, b) => a.week - b.week || a.day - b.day).map((a) => a.formulaId);
  const byId = new Map(classFormulaHealth(students, order, today).map((h) => [h.formulaId, h]));
  const health = order.map((id) => byId.get(id)!);

  return (
    <div>
      <PageHeader title="Formula analytics" info="Every assigned formula, in the order you assigned them. Click one for the full breakdown." />
      <Panel className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="border-b border-line text-left text-xs text-ink/45">
            <tr>
              <th className="px-5 py-3 font-semibold">Formula</th>
              <th className="px-3 py-3 font-semibold">Topic</th>
              <th className="px-3 py-3 font-semibold">Week</th>
              <th className="px-3 py-3 font-semibold">First-try accuracy</th>
              <th />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {health.map((h) => {
              const f = FORMULA_BY_ID[h.formulaId];
              return (
                <tr key={h.formulaId} className="group hover:bg-canvas">
                  <td className="px-5 py-3">
                    <Link href={`/teacher/formulas/${f.id}`} className="block">
                      <span className="font-semibold group-hover:underline">{f.name}</span>
                    </Link>
                  </td>
                  <td className="px-3 py-3">
                    <TopicPill topic={f.topic} />
                  </td>
                  <td className="px-3 py-3 text-ink/60">{weekOf.get(f.id)}</td>
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
