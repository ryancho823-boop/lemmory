"use client";

import { useStore } from "@/lib/store";
import { StudentAnalytics } from "@/components/StudentAnalytics";
import { PageHeader, Skeleton } from "@/components/ui";

export default function StatsPage() {
  const { ready, you, today } = useStore();
  if (!ready) return <Skeleton className="h-96" />;
  return (
    <div>
      <PageHeader title="My stats" info="Where you're strong, and what to fix before the contest." />
      <StudentAnalytics student={you} today={today} formulaHref={(id) => `/student/bank/${id}`} />
    </div>
  );
}
