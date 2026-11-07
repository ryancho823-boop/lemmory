"use client";

import { useActionState } from "react";
import { Field } from "@lemmory/ui/Shell";
import { Button, Panel } from "@lemmory/ui/ui";
import { renameMe } from "../../actions";

/** The name students see for their teacher. */
export function RenameForm({ name }: { name: string }) {
  const [state, run, pending] = useActionState(renameMe, undefined);
  return (
    <Panel className="border-t-4 border-t-good p-6">
      <h2 className="text-[15px] font-bold">Your name</h2>
      <p className="mt-1 text-sm text-ink/60">Students see this on their class.</p>
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
