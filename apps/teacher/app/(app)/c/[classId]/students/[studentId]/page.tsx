import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { studentInfo } from "@lemmory/db/teacher";
import { StudentAnalytics } from "@lemmory/ui/StudentAnalytics";
import { Avatar } from "@lemmory/ui/ui";
import { getClass, requireTeacher } from "@/lib/session";
import { ManageStudent } from "./ManageStudent";

export default async function StudentPage({ params }: PageProps<"/c/[classId]/students/[studentId]">) {
  const { classId, studentId } = await params;
  const [me, { klass, students, today }] = await Promise.all([requireTeacher(), getClass(classId)]);
  const s = students.find((x) => x.id === studentId);
  if (!s) notFound();
  const { username } = await studentInfo(me.id, classId, studentId);
  return (
    <div>
      <Link href={`/c/${classId}/students`} className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/45 hover:text-ink">
        <ArrowLeft size={15} /> Students
      </Link>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Avatar name={s.name} size={52} />
        <div className="min-w-0 flex-1">
          <h1 className="text-[28px] font-extrabold leading-tight tracking-tight">{s.name}</h1>
          <p className="text-ink/55">
            {klass.name} · username <span className="font-mono">{username}</span>
          </p>
        </div>
      </div>
      <StudentAnalytics student={s} today={today} formulaHref={(fid) => `/c/${classId}/formulas/${fid}`} />
      <ManageStudent classId={classId} studentId={studentId} name={s.name} />
    </div>
  );
}
