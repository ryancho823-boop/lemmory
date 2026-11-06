"use client";

import { useActionState } from "react";
import { Field } from "./Shell";
import { Button, Panel } from "./ui";

type State = { error?: string; ok?: string } | undefined;

/** Add or change the account's email. Changing one asks for the password. */
export function ChangeEmailForm({
  email,
  confirmed,
  pending: waiting,
  hint,
  action,
}: {
  email: string | null;
  confirmed: boolean;
  /** A new address waiting on its confirmation link. */
  pending: string | null;
  hint: string;
  action: (state: State, fd: FormData) => Promise<State>;
}) {
  const [state, run, saving] = useActionState(action, undefined);
  return (
    <Panel className="p-6">
      <h2 className="text-[15px] font-bold">{email ? "Your email" : "Add your email"}</h2>
      <p className="mt-1 text-sm text-ink/60">{hint}</p>
      {email && (
        <p className="mt-3 text-sm">
          <span className="font-semibold">{email}</span> {confirmed ? <span className="text-good">Confirmed</span> : <span className="text-ink/60">Not confirmed yet</span>}
        </p>
      )}
      {waiting && <p className="mt-1 text-sm text-ink/60">Waiting for you to click the link sent to {waiting}.</p>}
      <form action={run} className="mt-4 space-y-3">
        <Field label={email ? "New email" : "Email"} name="email" type="email" required autoComplete="email" error={state?.error} />
        {email && <Field label="Your password" name="password" type="password" required autoComplete="current-password" />}
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" variant="outline" disabled={saving} className="shrink-0">
            {saving ? "Sending…" : "Send confirmation link"}
          </Button>
          {state?.ok && <span className="text-sm font-semibold text-good">{state.ok}</span>}
        </div>
      </form>
    </Panel>
  );
}
