"use client";

import { useActionState, useState } from "react";
import { Lock } from "lucide-react";
import { Button } from "@lemmory/ui/ui";
import { Field } from "@lemmory/ui/Shell";
import { buyStudentPlan, startTrialAction } from "../../actions";

interface Props {
  price: number;
  body: string;
  trialDays: number;
  state: "none" | "trial" | "active" | "expired";
  /** "May 4", when the trial ends or ended. */
  endsOn: string | null;
}

/** The individual plan: start the free trial, then pay with a parent or guardian's details. */
export function StudentPlan({ price, body, trialDays, state, endsOn }: Props) {
  const [paying, setPaying] = useState(state === "expired");
  if (state === "active") return <p className="mt-1 text-ink/75">You&apos;re on the individual plan (${price} a month).</p>;
  return (
    <div className="mt-2">
      <p>
        <span className="text-2xl font-extrabold">${price}</span> <span className="text-ink/70">per month</span>
      </p>
      <p className="mt-1 text-ink/75">
        {state === "none" && `${body} The first ${trialDays} days are free.`}
        {state === "trial" && `You're on the free trial until ${endsOn}.`}
        {state === "expired" && `Your free trial ended on ${endsOn}. To keep using Lemmory, pay for the individual plan. Your deck and progress are saved.`}
      </p>
      {state === "none" && <StartTrial trialDays={trialDays} onPay={() => setPaying(true)} />}
      {paying ? <Checkout price={price} /> : state === "trial" && <Button className="mt-4" variant="outline" onClick={() => setPaying(true)}>Pay now</Button>}
    </div>
  );
}

function StartTrial({ trialDays, onPay }: { trialDays: number; onPay: () => void }) {
  const [state, action, pending] = useActionState(startTrialAction, undefined);
  return (
    <form action={action} className="mt-4">
      <Button type="submit" disabled={pending}>
        {pending ? "Starting…" : `Start ${trialDays}-day free trial`}
      </Button>
      {state?.error && (
        <p className="mt-3 text-sm font-semibold text-bad">
          {state.error}{" "}
          <button type="button" onClick={onPay} className="underline">
            Pay instead
          </button>
        </p>
      )}
    </form>
  );
}

function Checkout({ price }: { price: number }) {
  const [state, action, pending] = useActionState(buyStudentPlan, undefined);
  return (
    <form action={action} className="mt-4 space-y-4 rounded-xl border border-line p-4">
      <p className="text-sm text-ink/75">Who should get the receipt?</p>
      <Field label="Parent or guardian's name" name="billingName" required autoComplete="name" defaultValue={state?.values?.billingName} />
      <Field label="Their email" name="billingEmail" type="email" required autoComplete="email" defaultValue={state?.values?.billingEmail} />
      <p className="flex items-start gap-2 text-sm">
        <Lock size={15} className="mt-0.5 shrink-0" />
        Test mode: no payment is connected yet, so nothing will be charged.
      </p>
      {state?.error && <p className="text-sm font-semibold text-bad">{state.error}</p>}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Processing…" : `Pay $${price} a month`}
      </Button>
    </form>
  );
}
