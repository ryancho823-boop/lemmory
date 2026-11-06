"use client";

import { useActionState } from "react";
import { Button } from "@lemmory/ui/ui";
import { unsubscribeAction } from "../../actions";

export function UnsubscribeButton({ token }: { token: string }) {
  const [state, action, pending] = useActionState(unsubscribeAction.bind(null, token), undefined);
  if (state?.ok) return <p role="status" className="font-semibold text-good">{state.ok}</p>;
  return (
    <form action={action} className="space-y-3">
      {state?.error && <p className="text-sm font-semibold text-bad">{state.error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Saving…" : "Unsubscribe"}
      </Button>
    </form>
  );
}
