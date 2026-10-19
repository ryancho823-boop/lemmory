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

// Common zones by their everyday names. A class's day starts at midnight in its zone.
const ZONES: [string, string][] = [
  ["Pacific/Honolulu", "HST (Hawaii)"],
  ["America/Anchorage", "AKST (Alaska)"],
  ["America/Los_Angeles", "PST (Pacific)"],
  ["America/Phoenix", "MST (Arizona)"],
  ["America/Denver", "MST (Mountain)"],
  ["America/Chicago", "CST (Central)"],
  ["America/New_York", "EST (Eastern)"],
  ["America/Halifax", "AST (Atlantic)"],
  ["Europe/London", "GMT (UK)"],
  ["Europe/Paris", "CET (Central Europe)"],
  ["Asia/Kolkata", "IST (India)"],
  ["Asia/Shanghai", "CST (China)"],
  ["Asia/Singapore", "SGT (Singapore)"],
  ["Asia/Seoul", "KST (Korea)"],
  ["Asia/Tokyo", "JST (Japan)"],
  ["Australia/Sydney", "AEST (Sydney)"],
];

/** A zone that isn't in the list, by its short name (like "EST" or "GMT+3"). */
function zoneLabel(zone: string) {
  const known = ZONES.find(([z]) => z === zone);
  if (known) return known[1];
  const short = new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "short" }).formatToParts().find((p) => p.type === "timeZoneName")?.value;
  return `${short ?? zone} (${zone.split("/").pop()?.replaceAll("_", " ")})`;
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
  const v = { ...initial, ...state?.values };
  const [tz, setTz] = useState(v.timezone ?? "");
  // A new class starts in the browser's zone (only known after hydration).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read the browser's zone after mount
    if (!tz) setTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, [tz]);

  // The list, plus the class's own zone if it isn't one of them.
  const zones = useMemo(() => (tz && !ZONES.some(([z]) => z === tz) ? [...ZONES, [tz, zoneLabel(tz)] as [string, string]] : ZONES), [tz]);

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Class name" name="name" required defaultValue={v.name} placeholder="Long-Term AMC 10 Course" />
      <fieldset>
        <legend className="text-sm font-semibold">Contest details (optional)</legend>
        <div className="mt-1.5 grid grid-cols-2 gap-3">
          <input
            name="contestName"
            aria-label="Contest name"
            defaultValue={v.contestName}
            placeholder="Name, like AMC 10A"
            className="h-11 w-full min-w-0 rounded-xl border border-line bg-white px-3 text-[15px] outline-none focus:border-ink"
          />
          <input
            name="contestDate"
            type="date"
            aria-label="Contest date"
            defaultValue={v.contestDate}
            className="h-11 w-full min-w-0 rounded-xl border border-line bg-white px-3 text-[15px] outline-none focus:border-ink"
          />
        </div>
      </fieldset>
      <label className="block">
        <span className="text-sm font-semibold">Time zone</span>
        <select
          name="timezone"
          value={tz}
          onChange={(e) => setTz(e.target.value)}
          className="mt-1.5 h-11 w-full rounded-xl border border-line bg-white px-3 text-[15px] outline-none focus:border-ink"
        >
          {!tz && <option value="">Choose…</option>}
          {zones.map(([z, label]) => (
            <option key={z} value={z}>
              {label}
            </option>
          ))}
        </select>
      </label>
      {state?.error && <p className="text-sm font-semibold text-bad">{state.error}</p>}
      {state?.ok && <p className="text-sm font-semibold text-good">{state.ok}</p>}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? "Saving…" : submit}
      </Button>
    </form>
  );
}
