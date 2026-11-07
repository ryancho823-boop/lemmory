"use client";

import { useActionState } from "react";
import { SITE_URL } from "@lemmory/core/urls";
import { Button } from "@lemmory/ui/ui";
import { Field } from "@lemmory/ui/Shell";
import { approveChild } from "../../actions";

export function ParentForm({ token, firstName }: { token: string; firstName: string }) {
  const [state, action, pending] = useActionState(approveChild.bind(null, token), undefined);
  const v = state?.values;
  if (state?.ok) {
    return (
      <div className="space-y-4 text-[15px] leading-relaxed">
        <p>{state.ok}</p>
        <p>We&apos;ll email you tomorrow with a link that deletes the account if you ever change your mind.</p>
        <Button href="/login" size="lg" className="w-full">
          Go to log in
        </Button>
      </div>
    );
  }
  return (
    <form action={action} className="space-y-4">
      <Field label="Last name" name="lastName" required autoComplete="off" defaultValue={v?.lastName} />
      <Field label="Username" name="username" required autoComplete="off" autoCapitalize="none" defaultValue={v?.username} hint={`${firstName} logs in with this.`} />
      <Field label="Password" name="password" type="password" required minLength={8} autoComplete="new-password" hint="At least 8 characters." />
      <label className="flex items-start gap-2.5 text-sm leading-snug">
        <input type="checkbox" name="agree" required className="mt-0.5 h-4 w-4 shrink-0 accent-ink" />
        <span>
          I&apos;m {firstName}&apos;s parent or guardian. I&apos;ve read the{" "}
          <a href={`${SITE_URL}/privacy#children`} className="underline">
            privacy notice
          </a>{" "}
          and{" "}
          <a href={`${SITE_URL}/terms`} className="underline">
            terms
          </a>
          , and I agree to them for my child.
        </span>
      </label>
      {state?.error && <p className="text-sm font-semibold text-bad">{state.error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Saving…" : "Agree and create account"}
      </Button>
    </form>
  );
}
