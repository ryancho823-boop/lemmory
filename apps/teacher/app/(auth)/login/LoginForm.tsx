"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Field } from "@lemmory/ui/Shell";
import { Button } from "@lemmory/ui/ui";
import { login } from "../../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="space-y-4">
      <Field label="Email" name="email" type="email" autoComplete="email" required defaultValue={state?.values?.email} />
      <Field label="Password" name="password" type="password" autoComplete="current-password" required />
      {state?.error && <p className="text-sm font-semibold text-bad">{state.error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Logging in…" : "Log in"}
      </Button>
      <p className="text-center text-xs text-ink/45">
        <Link href="/forgot" className="font-semibold underline hover:text-ink">
          Forgot your password?
        </Link>
      </p>
    </form>
  );
}
