"use client";

import { useStore } from "@/lib/store";
import { StudentAnalytics } from "@lemmory/ui/StudentAnalytics";
import { PageHeader, Skeleton } from "@lemmory/ui/ui";
import { FORMULA_BY_ID } from "@/lib/bank";

export default function StatsPage() {
  const { ready, you, today } = useStore();
  if (!ready) return <Skeleton className="h-96" />;
  return (
    <div>
      <PageHeader title="My stats" info="Where you're strong, and what to fix before the contest." />
      <StudentAnalytics formulaById={FORMULA_BY_ID} student={you} today={today} formulaHref={(id) => `/student/bank/${id}`} />
    </div>
  );
}
