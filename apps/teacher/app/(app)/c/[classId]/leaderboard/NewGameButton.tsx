"use client";

import { useTransition } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@lemmory/ui/ui";
import { newGameAction } from "../../../../actions";

export function NewGameButton({ classId }: { classId: string }) {
  const [pending, start] = useTransition();
  return (
    <Button
      className="mt-4 w-full"
      disabled={pending}
      onClick={() => confirm("Start a new game? Game points go back to 0 for everyone.") && start(() => newGameAction(classId))}
    >
      <RotateCcw size={15} /> Start a new game
    </Button>
  );
}
