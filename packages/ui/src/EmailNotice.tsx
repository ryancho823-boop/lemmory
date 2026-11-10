"use client";

import { useActionState } from "react";

type State = { error?: string; ok?: string } | undefined;

/** The strip at the top of the app until the account's email is confirmed. */
export function EmailNotice({ email, action }: { email: string; action: (state: State) => Promise<State> }) {
  const [state, run, pending] = useActionState(action, undefined);
  return (
    <form action={run} className="flex flex-wrap items-center gap-x-3 gap-y-1 border-b border-lemon bg-lemon-soft px-5 py-2.5 text-sm">
      <span>
        <b>Confirm your email.</b> We sent a link to {email}. Check your spam folder too.
      </span>
      {state?.ok || state?.error ? (
        <span className={`font-semibold ${state.error ? "text-bad" : "text-good"}`}>{state.error ?? state.ok}</span>
      ) : (
        <button type="submit" disabled={pending} className="-my-1.5 py-1.5 font-semibold underline underline-offset-2 hover:no-underline">
          {pending ? "Sending…" : "Send it again"}
        </button>
      )}
    </form>
  );
}
