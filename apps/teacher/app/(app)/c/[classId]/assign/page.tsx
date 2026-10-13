import { bankEntries } from "@lemmory/core/bank";
import { getClass } from "@/lib/session";
import { Assign } from "./Assign";

export const metadata = { title: "Assign formulas · Lemmory for teachers" };

export default async function AssignPage({ params }: PageProps<"/c/[classId]/assign">) {
  const { classId } = await params;
  const { klass, assignments } = await getClass(classId);
  return <Assign classId={classId} formulas={bankEntries()} assignments={assignments} currentWeek={klass.currentWeek} />;
}
