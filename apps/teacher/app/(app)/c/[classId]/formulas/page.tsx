import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FORMULA_BY_ID } from "@lemmory/core/formulas";
import { classFormulaHealth } from "@lemmory/core/analytics";
import { Button, Meter, PageHeader, Panel, TopicPill, pct } from "@lemmory/ui/ui";
import { getClass } from "@/lib/session";

export const metadata = { title: "Formula analytics · Lemmory for teachers" };

export default async function FormulaAnalytics({ params }: PageProps<"/c/[classId]/formulas">) {
  const { classId } = await params;
  const { students, assignments, today } = await getClass(classId);
  const byId = new Map(classFormulaHealth(students, assignments.map((a) => a.formulaId), today).map((h) => [h.formulaId, h]));

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
                <th className="px-5 py-3 font-semibold">Formula</th>
                <th className="px-3 py-3 font-semibold">Topic</th>
                <th className="px-3 py-3 font-semibold">Week</th>
                <th className="px-3 py-3 font-semibold">First-try accuracy</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {assignments.map((a) => {
                const f = FORMULA_BY_ID[a.formulaId];
                const h = byId.get(a.formulaId)!;
                return (
                  <tr key={a.formulaId} className="group hover:bg-canvas">
                    <td className="px-5 py-3">
                      <Link href={`/c/${classId}/formulas/${f.id}`} className="block font-semibold group-hover:underline">
                        {f.name}
                      </Link>
                    </td>
                    <td className="px-3 py-3">
                      <TopicPill topic={f.topic} />
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
