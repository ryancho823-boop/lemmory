"use client";

import { useTransition } from "react";
import { Plus } from "lucide-react";
import { Button } from "@lemmory/ui/ui";
import { assignAction } from "@/app/teach/actions";

export function AssignButton({ classId, formulaId, week }: { classId: string; formulaId: string; week: number }) {
  const [pending, start] = useTransition();
  return (
    <Button disabled={pending} onClick={() => start(() => assignAction(classId, formulaId))}>
      <Plus size={15} strokeWidth={3} /> Assign to week {week}
    </Button>
  );
}
