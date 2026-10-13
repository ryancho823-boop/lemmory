"use client";

import { useActionState } from "react";
import { Field } from "@lemmory/ui/Shell";
import { Button } from "@lemmory/ui/ui";
import { joinWithCode } from "../../actions";

export function JoinClassForm() {
  const [state, action, pending] = useActionState(joinWithCode, undefined);
  return (
    <form action={action} className="mt-4 flex items-end gap-2">
      <div className="flex-1">
        <Field label="Class code" name="code" required autoComplete="off" className="uppercase tracking-[0.2em]" defaultValue={state?.values?.code} error={state?.error} />
      </div>
      <Button type="submit" size="lg" disabled={pending}>
        Join
      </Button>
    </form>
  );
}
