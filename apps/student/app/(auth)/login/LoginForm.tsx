"use client";

import { useActionState } from "react";
import { Button } from "@lemmory/ui/ui";
import { Field } from "@lemmory/ui/Shell";
import { login } from "../../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="space-y-4">
      <Field label="Username" name="username" autoComplete="username" autoCapitalize="none" required defaultValue={state?.values?.username} />
      <Field label="Password" name="password" type="password" autoComplete="current-password" required />
      {state?.error && <p className="text-sm font-semibold text-bad">{state.error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Logging in…" : "Log in"}
      </Button>
    </form>
  );
}
