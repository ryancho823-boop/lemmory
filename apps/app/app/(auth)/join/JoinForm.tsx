"use client";

import { useActionState } from "react";
import { Button } from "@lemmory/ui/ui";
import { Field } from "@lemmory/ui/Shell";
import { signup } from "@/app/learn/actions";

export function JoinForm({ code }: { code: string }) {
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
      <Field label="Your name" name="name" required autoComplete="name" defaultValue={v?.name} hint="First and last, so your teacher knows it's you." />
      <Field label="Username" name="username" required autoComplete="username" autoCapitalize="none" defaultValue={v?.username} hint="No email needed." />
      <Field label="Password" name="password" type="password" required minLength={8} autoComplete="new-password" hint="At least 8 characters." />
      {state?.error && <p className="text-sm font-semibold text-bad">{state.error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Joining…" : "Join class"}
      </Button>
    </form>
  );
}
