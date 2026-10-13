"use client";

import { useStore } from "@/lib/store";
import { Leaderboard } from "@/components/Leaderboard";
import { Skeleton } from "@/components/ui";

export default function LeaderboardPage() {
  const { ready } = useStore();
  if (!ready) return <Skeleton className="h-96" />;
  return (
    <div className="mx-auto max-w-2xl">
      <Leaderboard />
    </div>
  );
}
