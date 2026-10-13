"use client";

import { useActionState, useState, useTransition } from "react";
import { Check, Lock, X } from "lucide-react";
import { Field } from "@lemmory/ui/Shell";
import { Button, Panel, cx } from "@lemmory/ui/ui";
import { academyCheckoutAction, clubRequestAction, startPilotAction } from "../../actions";

type Kind = "pilot" | "academy" | "club";

interface Props {
  formulaCount: number;
  pilotDays: number;
  academy: { perStudent: number; body: string };
  club: { perStudent: number; classCap: number; body: string };
  current: Kind | null;
  /** The free pilot can be used once. */
  pilot: "available" | "current" | "used";
  /** Students across the teacher's classes, for the cost estimate. */
  students: number;
}

export function PlanPicker({ formulaCount, pilotDays, academy, club, current, pilot, students }: Props) {
  const [open, setOpen] = useState<"academy" | "club" | null>(null);
  const [pending, start] = useTransition();
  const included = [`All ${formulaCount} formulas`, "Unlimited classes and assigning", "Class and student analytics", "Leaderboard games"];

  return (
    <>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card
          title="Free pilot"
          price="$0"
          per={`for ${pilotDays} days`}
          body="Try it with a real class before you decide."
          active={pilot === "current"}
          action={
            <Button variant="outline" className="w-full" disabled={pending || pilot !== "available"} onClick={() => start(() => startPilotAction())}>
              {pilot === "current" ? "Current plan" : pilot === "used" ? "Already used" : "Start free pilot"}
            </Button>
          }
        />
        <Card
          title="Academy"
          price={`$${academy.perStudent}`}
          per="per student / month"
          body={academy.body}
          active={current === "academy"}
          action={
            <Button className="w-full" disabled={current === "academy"} onClick={() => setOpen("academy")}>
              {current === "academy" ? "Current plan" : `Pay $${academy.perStudent} per student`}
            </Button>
          }
        />
        <Card
          title="School math club"
          price={`$${club.perStudent}`}
          per="per student / month"
          note={`Never more than $${club.classCap} per class`}
          body="For free clubs run at a school. We confirm the club with your school first."
          active={current === "club"}
          action={
            <Button variant="outline" className="w-full" disabled={current === "club"} onClick={() => setOpen("club")}>
              {current === "club" ? "Current plan" : "Request club pricing"}
            </Button>
          }
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
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/40 px-4" onClick={() => setOpen(null)}>
          <div className="w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <Panel className="rise p-6">
              <div className="flex items-start justify-between">
                <h2 className="text-xl font-semibold">{open === "academy" ? "Checkout" : "Club pricing"}</h2>
                <button onClick={() => setOpen(null)} aria-label="Close" className="rounded-lg p-1 text-ink/50 hover:bg-ink/5">
                  <X size={18} />
                </button>
              </div>
              {open === "academy" ? <AcademyCheckout perStudent={academy.perStudent} students={students} /> : <ClubRequest />}
            </Panel>
          </div>
        </div>
      )}
    </>
  );
}

function AcademyCheckout({ perStudent, students }: { perStudent: number; students: number }) {
  const [state, action, pending] = useActionState(academyCheckoutAction, undefined);
  return (
    <form action={action} className="mt-4 space-y-4">
      <Field label="Academy name" name="orgName" required />
      <div className="flex items-baseline justify-between border-y border-line py-3">
        <span>Academy plan</span>
        <span className="font-semibold">
          ${perStudent} <span className="font-normal text-ink/70">per student / month</span>
        </span>
      </div>
      {students > 0 && (
        <p>
          With your {students} students now: <b>${students * perStudent} a month</b>.
        </p>
      )}
      <p className="flex items-start gap-2 rounded-xl bg-lemon-soft p-3 text-sm">
        <Lock size={15} className="mt-0.5 shrink-0" />
        Test mode: no payment is connected yet, so your card won&apos;t be charged.
      </p>
      {state?.error && <p className="text-sm font-semibold text-bad">{state.error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Processing…" : "Pay"}
      </Button>
    </form>
  );
}

function ClubRequest() {
  const [state, action, pending] = useActionState(clubRequestAction, undefined);
  return (
    <form action={action} className="mt-4 space-y-4">
      <p className="text-ink/75">
        Club pricing is for free clubs run at a school. Use your school email so we can confirm it. You&apos;re on a free pilot while we check.
      </p>
      <Field label="School name" name="orgName" required defaultValue={state?.values?.orgName} />
      <Field label="Your school email" name="schoolEmail" type="email" required defaultValue={state?.values?.schoolEmail} />
      {state?.error && <p className="text-sm font-semibold text-bad">{state.error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Request club pricing"}
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
