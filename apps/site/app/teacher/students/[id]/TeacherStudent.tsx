"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useStore } from "@/lib/store";
import { CLASS_NAME } from "@/lib/sim";
import { StudentAnalytics } from "@/components/StudentAnalytics";
import { Skeleton } from "@lemmory/ui/ui";

export function TeacherStudent({ id }: { id: string }) {
  const { ready, students, today } = useStore();
  const s = students.find((x) => x.id === id);
  if (!ready || !s) return <Skeleton className="h-96" />;
  return (
    <div>
      <Link href="/teacher/students" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/45 hover:text-ink">
        <ArrowLeft size={15} /> Students
      </Link>
      <div className="mb-6 flex items-center gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold leading-tight tracking-tight">{s.name}</h1>
          <p className="text-ink/55">
            {CLASS_NAME}
            {s.isYou && " · the student in the demo"}
          </p>
        </div>
      </div>
      <StudentAnalytics student={s} today={today} formulaHref={(fid) => `/teacher/formulas/${fid}`} />
    </div>
  );
}
