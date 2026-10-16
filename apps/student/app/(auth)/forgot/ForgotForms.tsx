"use client";

import { useActionState } from "react";
import { Field } from "@lemmory/ui/Shell";
import { Button } from "@lemmory/ui/ui";
import { emailResetLink, resetWithCode } from "../../account-actions";

/** Username + the code from the teacher + a new password the student chooses. */
export function CodeForm() {
  const [state, action, pending] = useActionState(resetWithCode, undefined);
  const v = state?.values;
  return (
    <form action={action} className="space-y-4">
      <Field label="Username" name="username" required autoComplete="username" autoCapitalize="none" defaultValue={v?.username} />
      <Field
        label="Reset code from your teacher"
        name="code"
        required
        autoComplete="one-time-code"
        autoCapitalize="characters"
        placeholder="ABCD-2345"
        defaultValue={v?.code}
        className="uppercase tracking-[0.15em]"
      />
      <Field label="New password" name="password" type="password" required minLength={8} autoComplete="new-password" hint="At least 8 characters." />
      <Field label="Type it again" name="confirm" type="password" required minLength={8} autoComplete="new-password" />
      {state?.error && <p className="text-sm font-semibold text-bad">{state.error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Saving…" : "Save and log in"}
      </Button>
    </form>
  );
}

export function EmailForm() {
  const [state, action, pending] = useActionState(emailResetLink, undefined);
  return (
    <form action={action} className="space-y-3">
      <Field label="Username or email" name="login" required autoComplete="username" autoCapitalize="none" defaultValue={state?.values?.login} />
      {state?.error && <p className="text-sm font-semibold text-bad">{state.error}</p>}
      {state?.ok && <p className="text-sm font-semibold text-good">{state.ok}</p>}
      <Button type="submit" variant="outline" size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Email me a link"}
      </Button>
    </form>
  );
}
