"use client";

import { useTransition } from "react";
import { Button } from "@lemmory/ui/ui";
import { letBackInAction } from "../../../../actions";

export function LetBackInButton({ classId, studentId, name }: { classId: string; studentId: string; name: string }) {
  const [pending, start] = useTransition();
  return (
    <Button size="sm" variant="outline" disabled={pending} onClick={() => start(() => letBackInAction(classId, studentId))}>
      Let {name.split(" ")[0]} back in
    </Button>
  );
}
