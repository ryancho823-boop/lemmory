"use client";

import { useActionState } from "react";
import { Field } from "./Shell";
import { Button, Panel } from "./ui";

type State = { error?: string } | undefined;

/** Something that can't be undone (deleting an account or a class), behind a typed confirmation. */
export function ConfirmForm({
  title,
  body,
  label,
  type = "text",
  submit,
  action,
}: {
  title: string;
  body: React.ReactNode;
  /** What to type: a password, or the name of the thing being deleted. */
  label: string;
  type?: "text" | "password";
  submit: string;
  action: (state: State, fd: FormData) => Promise<State>;
}) {
  const [state, run, pending] = useActionState(action, undefined);
  return (
    <Panel className="p-6">
      <h2 className="text-[15px] font-bold">{title}</h2>
      <div className="mt-1 text-sm text-ink/60">{body}</div>
      <form action={run} className="mt-4 flex items-end gap-2">
        <div className="flex-1">
          <Field label={label} name="confirm" type={type} required autoComplete={type === "password" ? "current-password" : "off"} error={state?.error} />
        </div>
        <Button type="submit" size="lg" variant="outline" className="text-bad" disabled={pending}>
          {submit}
        </Button>
      </form>
    </Panel>
  );
}
