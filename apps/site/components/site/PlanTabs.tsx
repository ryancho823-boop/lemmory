"use client";

import { useEffect, useState } from "react";
import { cx } from "@lemmory/ui/ui";
import { JOIN_URL, SIGNUP_URL } from "@/lib/links";
import type { Tier } from "@/lib/pricing";

/**
 * One button per plan; the chosen plan's details show below. The URL's #academy, #club or #student picks one.
 * `teacherRules` (the pilot, students never paying) show on the teacher plans only.
 */
export function PlanTabs({ tiers, teacherRules }: { tiers: Tier[]; teacherRules: string[] }) {
  const [active, setActive] = useState(tiers[0].id);
  useEffect(() => {
    const fromHash = tiers.find((t) => `#${t.id}` === window.location.hash)?.id;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the hash is only known in the browser
    if (fromHash) setActive(fromHash);
  }, [tiers]);
  const pick = (id: Tier["id"]) => {
    setActive(id);
    history.replaceState(null, "", `#${id}`);
  };
  const t = tiers.find((x) => x.id === active) ?? tiers[0];

  return (
    <div>
      <div role="tablist" aria-label="Plans" className="grid gap-3 sm:grid-cols-3">
        {tiers.map((x) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={x.id === active}
            onClick={() => pick(x.id)}
            className={cx(
              "rounded-lg border-2 px-5 py-4 text-left transition-colors",
              x.id === active ? "border-ink bg-ink text-white" : "border-lemon bg-white hover:border-ink/40",
            )}
          >
            <span className="block text-lg font-semibold">{x.who}</span>
            <span className={cx("block text-sm", x.id === active ? "text-white/75" : "text-ink/60")}>
              {x.price} {x.per}
            </span>
          </button>
        ))}
      </div>

      <div role="tabpanel" key={t.id} className="rise mt-8 rounded-lg border border-line bg-white p-7 sm:p-9">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
          <h2 className="text-3xl font-extrabold">{t.who}</h2>
          <p className="text-lg">
            <span className="text-3xl font-extrabold">{t.price}</span> {t.per}
          </p>
        </div>
        <p className="mt-2 text-lg text-ink/80">{t.intro}</p>

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {t.details.map((d) => (
            <div key={d.title}>
              <h3 className="text-lg font-extrabold">{d.title}</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 leading-relaxed text-ink/85 marker:text-ink/40">
                {d.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {t.id !== "student" && (
          <div className="mt-8 rounded-lg bg-paper px-6 py-5">
            <h3 className="text-lg font-extrabold">Every teacher plan</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 leading-relaxed text-ink/85 marker:text-ink/40">
              {teacherRules.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
          </div>
        )}

        <a
          href={t.id === "student" ? JOIN_URL : SIGNUP_URL}
          className="mt-8 inline-flex h-11 items-center rounded-lg bg-ink px-5 font-semibold text-white hover:bg-ink/85"
        >
          {t.id === "student" ? "Sign up as a student" : "Start a free pilot"}
        </a>
      </div>
    </div>
  );
}
