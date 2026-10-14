"use client";

import { useActionState } from "react";
import { Field } from "@lemmory/ui/Shell";
import { Button } from "@lemmory/ui/ui";
import { signup } from "../../actions";

export function SignupForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(signup, undefined);
  return (
    <form action={action} className="space-y-4">
      <Field label="Name" name="name" required autoComplete="name" defaultValue={state?.values?.name} hint="What students call you, like Ms. Chen." />
      <Field label="Email" name="email" type="email" required autoComplete="email" defaultValue={state?.values?.email ?? email} />
      <Field label="Password" name="password" type="password" required minLength={8} autoComplete="new-password" hint="At least 8 characters." />
      {state?.error && <p className="text-sm font-semibold text-bad">{state.error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Signing up…" : "Sign up"}
      </Button>
    </form>
  );
}
