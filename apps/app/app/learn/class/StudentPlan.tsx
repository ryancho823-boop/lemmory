"use client";

import { useState, useTransition } from "react";
import { Lock } from "lucide-react";
import { Button } from "@lemmory/ui/ui";
import { buyStudentPlan } from "@/app/learn/actions";

export function StudentPlan({ price, body, paid }: { price: number; body: string; paid: boolean }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  if (paid) return <p className="mt-1 text-ink/75">You&apos;re on the individual plan (${price}/month).</p>;
  return (
    <div className="mt-2">
      <p>
        <span className="text-2xl font-extrabold">${price}</span> <span className="text-ink/70">per month</span>
      </p>
      <p className="mt-1 text-ink/75">{body}</p>
      {open ? (
        <div className="mt-4 rounded-xl border border-line p-4">
          <p className="flex items-start gap-2 text-sm">
            <Lock size={15} className="mt-0.5 shrink-0" />
            Test mode: no payment is connected yet, so nothing will be charged.
          </p>
          <Button className="mt-3 w-full" disabled={pending} onClick={() => start(() => buyStudentPlan())}>
            {pending ? "Processing…" : `Pay $${price}`}
          </Button>
        </div>
      ) : (
        <Button className="mt-4" onClick={() => setOpen(true)}>
          Get the individual plan
        </Button>
      )}
    </div>
  );
}
