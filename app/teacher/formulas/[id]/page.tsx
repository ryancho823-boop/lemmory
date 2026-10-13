import { notFound } from "next/navigation";
import { FORMULAS, FORMULA_BY_ID } from "@/lib/bank";
import { TeacherFormula } from "./TeacherFormula";

export function generateStaticParams() {
  return FORMULAS.map((f) => ({ id: f.id }));
}

export default async function Page({ params }: PageProps<"/teacher/formulas/[id]">) {
  const { id } = await params;
  if (!FORMULA_BY_ID[id]) notFound();
  return <TeacherFormula id={id} />;
}
