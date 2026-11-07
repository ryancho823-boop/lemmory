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

// Common zones by place, west to east. No abbreviations: "PST" is wrong half the year, and CST
// means two places. The clock itself comes from the zone, so daylight saving is handled.
const ZONES: [string, string][] = [
  ["Pacific/Honolulu", "US: Hawaii"],
  ["America/Anchorage", "US: Alaska"],
  ["America/Los_Angeles", "US: Pacific (Los Angeles)"],
  ["America/Phoenix", "US: Arizona"],
  ["America/Denver", "US: Mountain (Denver)"],
  ["America/Chicago", "US: Central (Chicago)"],
  ["America/New_York", "US: Eastern (New York)"],
  ["America/Vancouver", "Canada: Vancouver"],
  ["America/Toronto", "Canada: Toronto"],
  ["America/Halifax", "Canada: Halifax"],
  ["America/Mexico_City", "Mexico City"],
  ["America/Sao_Paulo", "Brazil: Sao Paulo"],
  ["Europe/London", "UK and Ireland"],
  ["Europe/Paris", "Central Europe (Paris)"],
  ["Europe/Athens", "Eastern Europe (Athens)"],
  ["Africa/Johannesburg", "South Africa"],
  ["Asia/Dubai", "UAE: Dubai"],
  ["Asia/Kolkata", "India"],
  ["Asia/Bangkok", "Thailand and Vietnam"],
  ["Asia/Shanghai", "China"],
  ["Asia/Hong_Kong", "Hong Kong"],
  ["Asia/Taipei", "Taiwan"],
  ["Asia/Singapore", "Singapore"],
  ["Asia/Seoul", "South Korea"],
  ["Asia/Tokyo", "Japan"],
  ["Australia/Perth", "Australia: Perth"],
  ["Australia/Sydney", "Australia: Sydney"],
  ["Pacific/Auckland", "New Zealand"],
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
  // Every other zone, for places the short list doesn't name. Set after hydration, like the zone itself.
  const [others, setOthers] = useState<string[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the browser's own list
    setOthers(Intl.supportedValuesOf("timeZone"));
  }, []);

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
          {others.length > 0 && (
            <optgroup label="Every time zone">
              {others
                .filter((z) => !zones.some(([known]) => known === z))
                .map((z) => (
                  <option key={z} value={z}>
                    {z.replaceAll("_", " ")}
                  </option>
                ))}
            </optgroup>
          )}
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
