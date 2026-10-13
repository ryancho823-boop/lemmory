"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Field } from "@lemmory/ui/Shell";
import { Button } from "@lemmory/ui/ui";
import type { FormState } from "../actions";

export interface ClassValues {
  name: string;
  contestName: string;
  contestDate: string;
  timezone: string;
}

/** Create or edit a class. The time zone defaults to the teacher's browser. */
export function ClassForm({
  action,
  initial,
  submit,
}: {
  action: (state: FormState, fd: FormData) => Promise<FormState>;
  initial?: ClassValues;
  submit: string;
}) {
  const [state, formAction, pending] = useActionState(action, undefined);
  const zones = useMemo(() => Intl.supportedValuesOf("timeZone"), []);
  const v = { ...initial, ...state?.values };
  const [tz, setTz] = useState(v.timezone ?? "");
  // A new class starts in the browser's zone (only known after hydration).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the browser's zone after mount
    if (!tz) setTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, [tz]);

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Class name" name="name" required defaultValue={v.name} placeholder="Long-Term AMC 10 Course" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Contest" name="contestName" defaultValue={v.contestName} placeholder="AMC 10A" hint="Optional. Shown with a countdown." />
        <Field label="Contest date" name="contestDate" type="date" defaultValue={v.contestDate} />
      </div>
      <label className="block">
        <span className="text-sm font-semibold">Time zone</span>
        <select
          name="timezone"
          value={tz}
          onChange={(e) => setTz(e.target.value)}
          className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3 text-[15px] outline-none focus:border-ink"
        >
          {!tz && <option value="">Choose…</option>}
          {zones.map((z) => (
            <option key={z} value={z}>
              {z.replaceAll("_", " ")}
            </option>
          ))}
        </select>
        <span className="mt-1 block text-xs text-ink/45">Each student&apos;s day starts at midnight here.</span>
      </label>
      {state?.error && <p className="text-sm font-semibold text-bad">{state.error}</p>}
      {state?.ok && <p className="text-sm font-semibold text-good">{state.ok}</p>}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving…" : submit}
      </Button>
    </form>
  );
}
