"use client";

import { useState, useTransition } from "react";
import { Button, Panel } from "@lemmory/ui/ui";
import { kickStudentAction, removeStudentAction, resetCodeAction } from "../../../../../actions";

export function ManageStudent({ classId, studentId, name, forgotUrl }: { classId: string; studentId: string; name: string; forgotUrl: string }) {
  const [reset, setReset] = useState<{ code: string; expiresAt: string } | null>(null);
  const [making, makeCode] = useTransition();
  const [removing, start] = useTransition();
  const first = name.split(" ")[0];
  return (
    <Panel className="mt-6 grid gap-6 p-5 md:grid-cols-2">
      <div>
        <h2 className="text-[15px] font-bold">Forgot their password?</h2>
        <p className="mb-3 mt-0.5 text-sm text-ink/70">
          Give {first} a one-time reset code. They enter it and choose a new password themselves, so you never see it.
        </p>
        {reset ? (
          <div className="rounded-xl border-2 border-lemon p-4">
            <p className="text-sm text-ink/70">Reset code for {first}</p>
            <p className="mt-1 font-mono text-2xl font-bold tracking-[0.15em]">{reset.code}</p>
            <p className="mt-2 text-sm text-ink/70">
              Works once, until{" "}
              {new Date(reset.expiresAt).toLocaleString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit" })}. {first} goes to{" "}
              <span className="font-semibold">{forgotUrl.replace(/^https?:\/\//, "")}</span> and enters it with their username.
            </p>
          </div>
        ) : (
          <Button variant="outline" disabled={making} onClick={() => makeCode(async () => setReset(await resetCodeAction(classId, studentId)))}>
            {making ? "Making a code…" : "Make a reset code"}
          </Button>
        )}
      </div>
      <div>
        <h2 className="text-[15px] font-bold">Remove from class</h2>
        <p className="mb-3 mt-0.5 text-sm text-ink/55">
          Their account and history stay either way. <b>Remove</b> lets them rejoin with the class code. <b>Kick out</b> blocks the code for
          them until you let them back in from the Students page.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            disabled={removing}
            onClick={() => confirm(`Remove ${name} from this class? They can rejoin with the class code.`) && start(() => removeStudentAction(classId, studentId))}
          >
            Remove {first}
          </Button>
          <Button
            variant="outline"
            disabled={removing}
            className="text-bad"
            onClick={() =>
              confirm(`Kick ${name} out of this class? The class code won't work for them until you let them back in.`) &&
              start(() => kickStudentAction(classId, studentId))
            }
          >
            Kick out {first}
          </Button>
        </div>
      </div>
    </Panel>
  );
}
