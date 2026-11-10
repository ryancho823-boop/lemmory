import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FORMULA_BY_ID } from "@lemmory/core/formulas";
import { classFormulaHealth } from "@lemmory/core/analytics";
import { Button, Meter, PageHeader, Panel, TopicPill, pct } from "@lemmory/ui/ui";
import { getClass } from "@/lib/session";

export const metadata = { title: "Formula analytics · Lemmory for teachers" };

const SORTS = [
  { key: "name", label: "Formula", className: "px-5" },
  { key: "topic", label: "Topic", className: "px-3" },
  { key: "week", label: "Week", className: "px-3" },
  { key: "accuracy", label: "First-try accuracy", className: "px-3" },
];

export default async function FormulaAnalytics({ params, searchParams }: PageProps<"/c/[classId]/formulas">) {
  const [{ classId }, { sort = "week" }] = await Promise.all([params, searchParams]);
  const { students, assignments: assigned, today } = await getClass(classId);
  const byId = new Map(classFormulaHealth(students, assigned.map((a) => a.formulaId), today).map((h) => [h.formulaId, h]));
  const f = (id: string) => FORMULA_BY_ID[id];
  const assignments = [...assigned].sort((a, b) =>
    sort === "name"
      ? f(a.formulaId).name.localeCompare(f(b.formulaId).name)
      : sort === "topic"
        ? f(a.formulaId).topic.localeCompare(f(b.formulaId).topic)
        : sort === "accuracy"
          ? (byId.get(a.formulaId)?.accuracy ?? 2) - (byId.get(b.formulaId)?.accuracy ?? 2)
          : 0,
  );

  return (
    <div>
      <PageHeader title="Formula analytics" info="Every assigned formula, in the order you assigned them. Click one for the full breakdown." />
      {assignments.length === 0 ? (
        <Panel className="p-10 text-center text-ink/55">
          Nothing assigned yet.
          <div className="mt-4">
            <Button href={`/c/${classId}/assign`}>Assign formulas</Button>
          </div>
        </Panel>
      ) : (
        <Panel className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="border-b border-line text-left text-xs text-ink/45">
              <tr>
                {SORTS.map((s) => (
                  <th key={s.key} aria-sort={sort === s.key ? "ascending" : undefined} className={`${s.className} py-3 font-semibold`}>
                    <Link href={`?sort=${s.key}`} className={`-my-2 inline-block py-2 ${sort === s.key ? "text-ink underline" : "hover:text-ink"}`}>
                      {s.label}
                    </Link>
                  </th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {assignments.map((a) => {
                const row = FORMULA_BY_ID[a.formulaId];
                const h = byId.get(a.formulaId)!;
                return (
                  <tr key={a.formulaId} className="group relative hover:bg-canvas">
                    <td className="px-5 py-3">
                      {/* Stretched over the row, so a click anywhere opens the formula. */}
                      <Link href={`/c/${classId}/formulas/${row.id}`} className="block font-semibold after:absolute after:inset-0 group-hover:underline">
                        {row.name}
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <TopicPill topic={row.topic} />
                    </td>
                    <td className="px-3 py-3 text-ink/60">{a.week}</td>
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
      )}
    </div>
  );
}
