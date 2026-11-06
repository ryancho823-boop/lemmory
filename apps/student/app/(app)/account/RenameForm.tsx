"use client";

import { useActionState } from "react";
import { Field } from "@lemmory/ui/Shell";
import { Button, Panel } from "@lemmory/ui/ui";
import { renameMe } from "../../actions";

/** Your username (for logging in), and the name your teacher sees, which you can fix. */
export function RenameForm({ name, username }: { name: string; username: string | null }) {
  const [state, run, pending] = useActionState(renameMe, undefined);
  return (
    <Panel className="p-6">
      <h2 className="text-[15px] font-bold">Your details</h2>
      <p className="mt-1 text-sm text-ink/60">
        You log in with your username: <span className="font-mono font-semibold text-ink">{username}</span>
      </p>
      <form action={run} className="mt-4 space-y-3">
        <Field label="Name" name="name" required autoComplete="name" defaultValue={name} error={state?.error} />
        <div className="flex items-center gap-3">
          <Button type="submit" variant="outline" disabled={pending}>
            {pending ? "Saving…" : "Save name"}
          </Button>
          {state?.ok && <span className="text-sm font-semibold text-good">{state.ok}</span>}
        </div>
      </form>
    </Panel>
  );
}
