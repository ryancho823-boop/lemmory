"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { Panel, cx } from "@lemmory/ui/ui";
import { leaveClassAction, switchClass } from "../../actions";

export function ClassList({ classes, current }: { classes: { id: string; name: string }[]; current: string | null }) {
  const [pending, start] = useTransition();
  const [leaving, setLeaving] = useState<string | null>(null);
  return (
    <Panel className="divide-y divide-line overflow-hidden">
      {classes.map((c) => (
        <div key={c.id}>
          <div className="flex items-center">
            <button
              disabled={pending || c.id === current}
              onClick={() => start(() => switchClass(c.id))}
              className={cx("flex min-w-0 flex-1 items-center gap-3 px-5 py-3.5 text-left", c.id === current ? "font-semibold" : "hover:bg-canvas")}
            >
              <span className="min-w-0 flex-1 truncate">{c.name}</span>
              {c.id === current ? (
                <span className="flex items-center gap-1 text-sm text-good">
                  <Check size={15} /> Showing
                </span>
              ) : (
                <span className="text-sm text-ink/70">Switch</span>
              )}
            </button>
            <button disabled={pending} onClick={() => setLeaving(leaving === c.id ? null : c.id)} className="px-5 py-3.5 text-sm text-ink/70 hover:underline">
              Leave
            </button>
          </div>
          {leaving === c.id && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 bg-canvas px-5 py-3 text-sm">
              <span className="flex-1">Leave {c.name}? Your deck and progress stay with you.</span>
              <button disabled={pending} onClick={() => start(() => leaveClassAction(c.id))} className="font-semibold text-bad hover:underline">
                {pending ? "Leaving…" : "Yes, leave"}
              </button>
              <button onClick={() => setLeaving(null)} className="hover:underline">
                Cancel
              </button>
            </div>
          )}
        </div>
      ))}
    </Panel>
  );
}
