"use client";

import { useActionState, useState } from "react";
import { Check, Lock, X } from "lucide-react";
import { Field } from "@lemmory/ui/Shell";
import { Button, Panel, cx } from "@lemmory/ui/ui";
import { checkoutAction, startTrialAction } from "../../actions";

type Kind = "academy" | "club";

interface Props {
  formulaCount: number;
  trialDays: number;
  academy: { perStudent: number; body: string };
  club: { perStudent: number; classCap: number; body: string };
  /** The plan the teacher picked, if any. */
  current: Kind | null;
  /** none: pick a plan to start the trial. trial / expired: pay to keep going. active: paid. */
  state: "none" | "trial" | "active" | "expired";
  /** Students across the teacher's classes, for the cost estimate. */
  students: number;
}

export function PlanPicker({ formulaCount, trialDays, academy, club, current, state, students }: Props) {
  const [open, setOpen] = useState<Kind | null>(null);
  const included = [`All ${formulaCount} formulas`, "Class and student analytics", "Class leaderboards", "Your students never pay"];
  const action = (kind: Kind) =>
    state === "none" ? (
      <StartTrial kind={kind} trialDays={trialDays} onPay={() => setOpen(kind)} />
    ) : state === "active" && current === kind ? (
      <Button variant="outline" className="w-full" disabled>
        Current plan
      </Button>
    ) : (
      <Button className="w-full" variant={current === kind ? "primary" : "outline"} onClick={() => setOpen(kind)}>
        {state === "active" ? "Switch to this plan" : "Pay"}
      </Button>
    );

  return (
    <>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card title="Academy" price={`$${academy.perStudent}`} per="per student / month" body={academy.body} active={current === "academy"} action={action("academy")} />
        <Card
          title="School math club"
          price={`$${club.perStudent}`}
          per="per student / month"
          note={`Never over $${club.classCap} a month per class`}
          body="For free clubs run at a school. We confirm the club with your school."
          active={current === "club"}
          action={action("club")}
        />
      </div>
      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-ink/75">
        {included.map((i) => (
          <li key={i} className="flex items-center gap-1.5">
            <Check size={16} className="text-good" /> {i}
          </li>
        ))}
      </ul>

      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/40 px-4 py-8" onClick={() => setOpen(null)}>
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <Panel className="rise p-6">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold">{open === "academy" ? "Academy plan" : "School math club plan"}</h2>
                <button onClick={() => setOpen(null)} aria-label="Close" className="rounded-lg p-1 text-ink/50 hover:bg-ink/5">
                  <X size={18} />
                </button>
              </div>
              <Checkout kind={open} perStudent={academy.perStudent} classCap={club.classCap} students={students} />
            </Panel>
          </div>
        </div>
      )}
    </>
  );
}

function StartTrial({ kind, trialDays, onPay }: { kind: Kind; trialDays: number; onPay: () => void }) {
  const [state, action, pending] = useActionState(startTrialAction, undefined);
  return (
    <form action={action}>
      <input type="hidden" name="kind" value={kind} />
      <Button type="submit" className="w-full" disabled={pending}>
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

/** The academy's or school's details, then a simulated payment. */
function Checkout({ kind, perStudent, classCap, students }: { kind: Kind; perStudent: number; classCap: number; students: number }) {
  const [state, action, pending] = useActionState(checkoutAction, undefined);
  const v = state?.values?.kind === kind ? state.values : undefined;
  const org = kind === "academy" ? "Academy" : "School";
  return (
    <form action={action} className="mt-4 space-y-4">
      <input type="hidden" name="kind" value={kind} />
      <Field label={`${org} name`} name="orgName" required defaultValue={v?.orgName} />
      <Field label="City and state" name="orgLocation" required autoComplete="address-level2" defaultValue={v?.orgLocation} />
      {kind === "academy" ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Billing contact" name="billingName" required autoComplete="name" defaultValue={v?.billingName} />
          <Field label="Billing email" name="billingEmail" type="email" required autoComplete="email" defaultValue={v?.billingEmail} />
        </div>
      ) : (
        <>
          <Field label="Your school email" name="schoolEmail" type="email" required defaultValue={v?.schoolEmail} />
          <p className="text-sm text-ink/75">
            We confirm the club with your school. Until then it&apos;s ${perStudent} per student; after that, the club price, never over ${classCap} a month per class.
          </p>
        </>
      )}
      <div className="flex items-baseline justify-between border-y border-line py-3">
        <span>{kind === "academy" ? "Academy plan" : "School math club"}</span>
        <span className="font-semibold">
          ${perStudent} <span className="font-normal text-ink/70">per student / month</span>
        </span>
      </div>
      {students > 0 && (
        <p>
          With your {students} students now: <b>${students * perStudent} a month</b>
          {kind === "club" && " until the club is confirmed"}.
        </p>
      )}
      <p className="flex items-start gap-2 rounded-xl bg-lemon-soft p-3 text-sm">
        <Lock size={15} className="mt-0.5 shrink-0" />
        Test mode: no payment is connected yet, so nothing will be charged.
      </p>
      {state?.error && <p className="text-sm font-semibold text-bad">{state.error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Processing…" : "Pay"}
      </Button>
    </form>
  );
}

function Card({
  title,
  price,
  per,
  note,
  body,
  active,
  action,
}: {
  title: string;
  price: string;
  per: string;
  note?: string;
  body: string;
  active: boolean;
  action: React.ReactNode;
}) {
  return (
    <Panel className={cx("flex flex-col p-6", active && "ring-2 ring-lemon")}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-3">
        <span className="text-3xl font-extrabold">{price}</span> <span className="text-ink/70">{per}</span>
      </p>
      {note && <p className="mt-1 font-semibold">{note}</p>}
      <p className="mt-2 flex-1 text-ink/75">{body}</p>
      <div className="mt-5">{action}</div>
    </Panel>
  );
}
