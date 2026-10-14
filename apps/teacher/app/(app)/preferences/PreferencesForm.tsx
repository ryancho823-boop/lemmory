"use client";

import { useActionState } from "react";
import { Button } from "@lemmory/ui/ui";
import { savePreferences } from "../../actions";

export function PreferencesForm({ weeklyReport }: { weeklyReport: boolean }) {
  const [state, action, pending] = useActionState(savePreferences, undefined);
  return (
    <form action={action}>
      <label className="flex cursor-pointer items-start gap-3">
        <input type="checkbox" name="weeklyReport" defaultChecked={weeklyReport} className="mt-1 size-4 accent-ink" />
        <span>
          <span className="block font-semibold">Weekly email about struggling students</span>
          <span className="block text-sm text-ink/55">
            Every Monday: who&apos;s behind on reviews or under 60% right on the first try, and which formulas each class is forgetting.
          </span>
        </span>
      </label>
      <div className="mt-5 flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
        {state?.ok && <p className="text-sm font-semibold text-good">{state.ok}</p>}
      </div>
    </form>
  );
}
