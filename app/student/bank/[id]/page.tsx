import { notFound } from "next/navigation";
import { FORMULAS, FORMULA_BY_ID } from "@/lib/bank";
import { StudentFormula } from "./StudentFormula";

export function generateStaticParams() {
  return FORMULAS.map((f) => ({ id: f.id }));
}

export async function generateMetadata({ params }: PageProps<"/student/bank/[id]">) {
  const f = FORMULA_BY_ID[(await params).id];
  return { title: f ? `${f.name} · Lemmory` : "Lemmory" };
}

export default async function Page({ params }: PageProps<"/student/bank/[id]">) {
  const { id } = await params;
  if (!FORMULA_BY_ID[id]) notFound();
  return <StudentFormula id={id} />;
}
