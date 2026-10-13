"use client";

import { useActionState, useTransition } from "react";
import { Field } from "@lemmory/ui/Shell";
import { Button, Panel } from "@lemmory/ui/ui";
import { removeStudentAction, resetPasswordAction } from "@/app/teach/actions";

export function ManageStudent({ classId, studentId, name }: { classId: string; studentId: string; name: string }) {
  const [state, action, pending] = useActionState(resetPasswordAction.bind(null, classId, studentId), undefined);
  const [removing, start] = useTransition();
  return (
    <Panel className="mt-6 grid gap-6 p-5 md:grid-cols-2">
      <form action={action}>
        <h2 className="text-[15px] font-bold">Reset password</h2>
        <p className="mb-3 mt-0.5 text-sm text-ink/55">For when {name.split(" ")[0]} forgets it. They&apos;ll be signed out everywhere.</p>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Field label="New password" name="password" type="text" autoComplete="off" required minLength={8} />
          </div>
          <Button type="submit" size="lg" variant="outline" disabled={pending}>
            Set
          </Button>
        </div>
        {state?.error && <p className="mt-2 text-sm font-semibold text-bad">{state.error}</p>}
        {state?.ok && <p className="mt-2 text-sm font-semibold text-good">{state.ok}</p>}
      </form>
      <div>
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
      </div>
    </Panel>
  );
}
