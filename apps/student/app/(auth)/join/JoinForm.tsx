"use client";

import { useActionState } from "react";
import { Button } from "@lemmory/ui/ui";
import { Field } from "@lemmory/ui/Shell";
import { signup } from "../../actions";

export function JoinForm({ code, username }: { code: string; username: string }) {
  const [state, action, pending] = useActionState(signup, undefined);
  const v = state?.values;
  return (
    <form action={action} className="space-y-4">
      <Field
        label="Class code"
        name="code"
        required
        autoCapitalize="characters"
        autoComplete="off"
        defaultValue={v?.code ?? code}
        className="uppercase tracking-[0.2em]"
      />
      <div className="grid grid-cols-2 gap-3">
        <Field label="First name" name="firstName" required autoComplete="given-name" defaultValue={v?.firstName} />
        <Field label="Last name" name="lastName" required autoComplete="family-name" defaultValue={v?.lastName} />
      </div>
      <Field label="Username" name="username" required autoComplete="username" autoCapitalize="none" defaultValue={v?.username ?? username} />
      <Field label="Password" name="password" type="password" required minLength={8} autoComplete="new-password" hint="At least 8 characters." />
      {state?.error && <p className="text-sm font-semibold text-bad">{state.error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Signing up…" : "Sign up"}
      </Button>
    </form>
  );
}
