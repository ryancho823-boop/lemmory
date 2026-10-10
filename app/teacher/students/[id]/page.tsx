import { notFound } from "next/navigation";
import { CLASSMATES, YOU } from "@/lib/sim";
import { TeacherStudent } from "./TeacherStudent";

const IDS = [...CLASSMATES, YOU].map((p) => p.id);

export function generateStaticParams() {
  return IDS.map((id) => ({ id }));
}

export default async function Page({ params }: PageProps<"/teacher/students/[id]">) {
  const { id } = await params;
  if (!IDS.includes(id)) notFound();
  return <TeacherStudent id={id} />;
}
