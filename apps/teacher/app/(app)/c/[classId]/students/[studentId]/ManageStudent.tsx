"use client";

import { useTransition } from "react";
import { Button, Panel } from "@lemmory/ui/ui";
import { removeStudentAction } from "../../../../../actions";

export function ManageStudent({ classId, studentId, name }: { classId: string; studentId: string; name: string }) {
  const [removing, start] = useTransition();
  return (
    <Panel className="mt-6 p-5">
      <h2 className="text-[15px] font-bold">Remove from class</h2>
      <p className="mb-3 mt-0.5 text-sm text-ink/55">Their account and history stay. They can rejoin with the class code.</p>
      <Button
        variant="outline"
        disabled={removing}
        className="text-bad"
        onClick={() => confirm(`Remove ${name} from this class?`) && start(() => removeStudentAction(classId, studentId))}
      >
        Remove {name.split(" ")[0]}
      </Button>
    </Panel>
  );
}
