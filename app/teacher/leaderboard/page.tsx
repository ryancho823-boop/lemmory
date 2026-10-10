"use client";

import { RotateCcw } from "lucide-react";
import { useStore } from "@/lib/store";
import { InfoTip } from "@/components/InfoTip";
import { Leaderboard } from "@/components/Leaderboard";
import { Button, PageHeader, Panel, Skeleton } from "@/components/ui";
import { CLASS_NAME } from "@/lib/sim";

export default function TeacherLeaderboard() {
  const { ready, state, today, resetCompetition } = useStore();
  if (!ready) return <Skeleton className="h-96" />;
  const age = today - state.competition.day;

  return (
    <div className="mx-auto grid max-w-4xl items-start gap-6 lg:grid-cols-[1fr_300px]">
      <div>
        <PageHeader title="Leaderboard" sub={CLASS_NAME} />
        <Leaderboard teacher />
      </div>
      <Panel className="p-5 lg:mt-[76px]">
        <h2 className="flex items-center gap-1 text-[15px] font-bold">
          Current game
          <InfoTip title="New games" align="left">
            A new game sets everyone&apos;s game points to 0. Streaks and all-time points stay.
          </InfoTip>
        </h2>
        <p className="mt-1 text-sm text-ink/55">Started {age === 0 ? "today" : age === 1 ? "yesterday" : `${age} days ago`}.</p>
        <Button
          className="mt-4 w-full"
          onClick={() => confirm("Start a new game? Game points go back to 0 for everyone.") && resetCompetition()}
        >
          <RotateCcw size={15} /> Start a new game
        </Button>
      </Panel>
    </div>
  );
}
