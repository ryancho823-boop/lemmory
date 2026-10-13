"use client";

import { useTransition } from "react";
import { Button } from "@lemmory/ui/ui";
import { newCodeAction } from "@/app/teach/actions";

export function NewCodeButton({ classId }: { classId: string }) {
  const [pending, start] = useTransition();
  return (
    <Button variant="outline" disabled={pending} onClick={() => confirm("Make a new class code? The old one stops working.") && start(() => newCodeAction(classId))}>
      Make a new code
    </Button>
  );
}
