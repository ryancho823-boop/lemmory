"use client";

import { useTransition } from "react";
import { Panel } from "@lemmory/ui/ui";
import { setWeeklyReportAction } from "../../actions";

/** The one email Lemmory sends on a schedule. Account emails, like password resets, always go out. */
export function WeeklyReportSwitch({ on }: { on: boolean }) {
  const [pending, start] = useTransition();
  return (
    <Panel className="p-6">
      <h2 className="text-[15px] font-bold">Notifications</h2>
      <label className="mt-3 flex items-start gap-3">
        <input type="checkbox" className="mt-1 size-4 accent-ink" checked={on} disabled={pending} onChange={(e) => start(() => setWeeklyReportAction(e.target.checked))} />
        <span>
          <span className="block font-semibold">Weekly class report</span>
          <span className="block text-sm text-ink/60">Every Monday morning: who needs attention and what each class is forgetting.</span>
        </span>
      </label>
    </Panel>
  );
}
