"use client";

// The real leaderboard (packages/ui), with rows computed from the demo's simulated class.
import { leaderRows } from "@lemmory/core/analytics";
import { Leaderboard as Board } from "@lemmory/ui/Leaderboard";
import { useStore } from "@/lib/store";
import { YOU } from "@/lib/sim";

/** `teacher`: the class as the teacher sees it, with no "You" row. */
export function Leaderboard({ compact = false, teacher = false }: { compact?: boolean; teacher?: boolean }) {
  const { students, today, state } = useStore();
  return <Board rows={leaderRows(students, state.competition, today, teacher ? undefined : YOU.id)} gameAge={today - state.competition.day} compact={compact} />;
}
