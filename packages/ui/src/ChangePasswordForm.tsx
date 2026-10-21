"use client";

import { useActionState } from "react";
import { Field } from "./Shell";
import { Button, Panel } from "./ui";

type State = { error?: string; ok?: string } | undefined;

/** Change your own password: the current one, then the new one. */
export function ChangePasswordForm({ action }: { action: (state: State, fd: FormData) => Promise<State> }) {
  const [state, run, pending] = useActionState(action, undefined);
  return (
    <Panel className="p-6">
      <h2 className="text-[15px] font-bold">Change your password</h2>
      <p className="mt-1 text-sm text-ink/60">This signs you out on every other device.</p>
      <form action={run} className="mt-4 space-y-3">
        <Field label="Current password" name="current" type="password" required autoComplete="current-password" />
        <Field label="New password" name="next" type="password" required autoComplete="new-password" minLength={8} hint="At least 8 characters" error={state?.error} />
        <div className="flex items-center gap-3">
          <Button type="submit" variant="outline" disabled={pending}>
            Change password
          </Button>
          {state?.ok && <span className="text-sm font-semibold text-good">{state.ok}</span>}
        </div>
      </form>
    </Panel>
  );
}
