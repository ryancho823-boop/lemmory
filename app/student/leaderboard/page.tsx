"use client";

import { useStore } from "@/lib/store";
import { Leaderboard } from "@/components/Leaderboard";
import { PageHeader, Skeleton } from "@/components/ui";
import { CLASS_NAME } from "@/lib/sim";

export default function LeaderboardPage() {
  const { ready } = useStore();
  if (!ready) return <Skeleton className="h-96" />;
  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Leaderboard" sub={CLASS_NAME} />
      <Leaderboard />
    </div>
  );
}
