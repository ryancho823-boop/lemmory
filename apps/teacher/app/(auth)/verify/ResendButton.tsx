"use client";

import { useActionState } from "react";
import { Button } from "@lemmory/ui/ui";
import { resendConfirmation } from "../../actions";

export function ResendButton() {
  const [state, action, pending] = useActionState(resendConfirmation, undefined);
  return (
    <form action={action} className="space-y-3">
      <p className="text-sm text-ink/70">Nothing yet? Check your spam folder, or:</p>
      <Button type="submit" variant="outline" size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Send it again"}
      </Button>
      {state?.ok && <p className="text-sm font-semibold text-good">{state.ok}</p>}
      {state?.error && <p className="text-sm font-semibold text-bad">{state.error}</p>}
    </form>
  );
}
