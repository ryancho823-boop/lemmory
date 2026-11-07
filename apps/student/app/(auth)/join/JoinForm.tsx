"use client";

import { useActionState, useState } from "react";
import { isUnder13 } from "@lemmory/core/days";
import { SITE_URL } from "@lemmory/core/urls";
import { Button } from "@lemmory/ui/ui";
import { Field } from "@lemmory/ui/Shell";
import { TimeZoneField } from "../TimeZoneField";
import { noteUnder13, signup } from "../../actions";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const SELECT = "h-11 w-full min-w-0 rounded-xl border border-line bg-white px-3 text-[15px] outline-none focus:border-ink";

/**
 * `onOwn` drops the class code, for students on the individual plan. A birthday under 13 swaps the
 * form for one that asks only for a first name and a parent's email, unless a school covers the class.
 * The age question says nothing about why it's asked, and no year is left out, so it doesn't invite a fib.
 */
export function JoinForm({ code, onOwn, under13 }: { code: string; onOwn?: boolean; under13?: boolean }) {
  const [state, action, pending] = useActionState(signup, undefined);
  const v = state?.values;
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [young, setYoung] = useState(Boolean(under13));
  const parentStep = young && !state?.school;

  const pick = (m: string, y: string) => {
    setMonth(m);
    setYear(y);
    if (m && y && isUnder13(Number(y), Number(m))) {
      setYoung(true);
      void noteUnder13();
    }
  };

  if (state?.ok) {
    return (
      <p className="text-[15px] leading-relaxed">
        We emailed <b>{state.ok}</b>. Ask them to open it and follow the steps.
      </p>
    );
  }

  // Years come from the clock, so they're read only once the form is on screen.
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: 90 }, (_, i) => thisYear - i);

  return (
    <form action={action} className="space-y-4">
      <TimeZoneField />
      <input type="hidden" name="birthMonth" value={month} />
      <input type="hidden" name="birthYear" value={year} />
      {onOwn ? (
        <input type="hidden" name="own" value="1" />
      ) : (
        <Field
          label="Class code"
          name="code"
          required
          autoCapitalize="characters"
          autoComplete="off"
          defaultValue={v?.code ?? code}
          className="uppercase tracking-[0.2em]"
        />
      )}
      {!young && (
        <fieldset>
          <legend className="text-sm font-semibold">Birth month and year</legend>
          <div className="mt-1.5 grid grid-cols-2 gap-3">
            <select aria-label="Birth month" required value={month} onChange={(e) => pick(e.target.value, year)} className={SELECT}>
              <option value="">Month</option>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
            <select aria-label="Birth year" required value={year} onChange={(e) => pick(month, e.target.value)} className={SELECT} suppressHydrationWarning>
              <option value="">Year</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </fieldset>
      )}
      {parentStep ? (
        <>
          <p className="text-[15px] leading-relaxed">We need a parent or guardian&apos;s OK first. We&apos;ll email them the next step.</p>
          <Field label="Your first name" name="firstName" required autoComplete="given-name" defaultValue={v?.firstName} />
          <Field label="Parent or guardian's email" name="parentEmail" type="email" required defaultValue={v?.parentEmail} />
        </>
      ) : (
        <>
          {state?.school && <p className="text-[15px]">Your school has approved this class. Finish signing up.</p>}
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" name="firstName" required autoComplete="given-name" defaultValue={v?.firstName} />
            <Field label="Last name" name="lastName" required autoComplete="family-name" defaultValue={v?.lastName} />
          </div>
          <Field label="Username" name="username" required autoComplete="username" autoCapitalize="none" defaultValue={v?.username} />
          <Field label="Email" name="email" type="email" required autoComplete="email" defaultValue={v?.email} hint="Yours or a parent's. We use it to confirm your account and reset your password." />
          <Field label="Password" name="password" type="password" required minLength={8} autoComplete="new-password" hint="At least 8 characters." />
        </>
      )}
      {state?.error && <p className="text-sm font-semibold text-bad">{state.error}</p>}
      {!parentStep && (
        <p className="text-xs text-ink/70">
          By signing up you agree to the{" "}
          <a href={`${SITE_URL}/terms`} className="underline">
            Terms
          </a>{" "}
          and{" "}
          <a href={`${SITE_URL}/privacy`} className="underline">
            Privacy Policy
          </a>
          .
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {parentStep ? (pending ? "Sending…" : "Email my parent") : pending ? "Signing up…" : "Sign up"}
      </Button>
    </form>
  );
}
