"use client";

import { useActionState, useTransition } from "react";
import { Field } from "@lemmory/ui/Shell";
import { Button } from "@lemmory/ui/ui";
import { addRecoveryEmail, removeEmail } from "../../account-actions";

/**
 * Students 13 or older can add an email so they can reset their own password. Without one,
 * their teacher gives them a reset code.
 */
export function RecoveryEmail({ email, pending: sentTo }: { email: string | null; pending: string | null }) {
  const [state, action, pending] = useActionState(addRecoveryEmail, undefined);
  const [removing, start] = useTransition();

  if (email)
    return (
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <p className="text-ink/75">
          <span className="font-semibold text-ink">{email}</span>. If you forget your password, we can email you a link.
        </p>
        <Button variant="ghost" size="sm" disabled={removing} onClick={() => start(() => removeEmail())}>
          Remove
        </Button>
      </div>
    );

  return (
    <form action={action} className="mt-2 space-y-3">
      <p className="text-ink/75">
        {sentTo
          ? `We sent a link to ${sentTo}. Click it to finish, or send it to a different email.`
          : "Optional. Add an email so you can reset your password yourself. Without one, your teacher can give you a reset code."}
      </p>
      <Field label="Email" name="email" type="email" required autoComplete="email" defaultValue={state?.values?.email} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="age" required className="size-4 accent-ink" />
        I&apos;m 13 or older
      </label>
      {state?.error && <p className="text-sm font-semibold text-bad">{state.error}</p>}
      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? "Sending…" : "Send confirmation link"}
      </Button>
    </form>
  );
}
