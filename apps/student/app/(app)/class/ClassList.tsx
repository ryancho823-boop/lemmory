"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import { Panel, cx } from "@lemmory/ui/ui";
import { switchClass } from "../../actions";

export function ClassList({ classes, current }: { classes: { id: string; name: string }[]; current: string | null }) {
  const [pending, start] = useTransition();
  return (
    <Panel className="divide-y divide-line overflow-hidden">
      {classes.map((c) => (
        <button
          key={c.id}
          disabled={pending || c.id === current}
          onClick={() => start(() => switchClass(c.id))}
          className={cx("flex w-full items-center gap-3 px-5 py-3.5 text-left", c.id === current ? "font-semibold" : "hover:bg-canvas")}
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
      ))}
    </Panel>
  );
}
