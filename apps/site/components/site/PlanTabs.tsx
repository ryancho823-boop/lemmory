"use client";

import { useEffect, useState } from "react";
import { cx } from "@lemmory/ui/ui";
import { INDIVIDUAL_SIGNUP_URL, SIGNUP_URL } from "@/lib/links";
import type { Tier } from "@/lib/pricing";

/**
 * One button per plan; the chosen plan's details show below. The URL's #academy, #club or #student picks one.
 * `teacherRules` (the free trial, students never paying) show on the teacher plans only.
 */
export function PlanTabs({ tiers, teacherRules }: { tiers: Tier[]; teacherRules: string[] }) {
  const [active, setActive] = useState(tiers[0].id);
  useEffect(() => {
    const fromHash = () => tiers.find((t) => `#${t.id}` === window.location.hash)?.id;
    const initial = fromHash();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the hash is only known in the browser
    if (initial) setActive(initial);
    // A link to another plan on this page (#club, say) only changes the hash.
    const onHash = () => {
      const id = fromHash();
      if (id) setActive(id);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [tiers]);
  const pick = (id: Tier["id"]) => {
    setActive(id);
    history.replaceState(null, "", `#${id}`);
  };
  const t = tiers.find((x) => x.id === active) ?? tiers[0];

  // Teacher plans add the shared rules (free trial, students never pay) as a last section.
  const sections = t.id === "student" ? t.details : [...t.details, { title: "Every teacher plan", items: teacherRules }];

  return (
    <div>
      <div role="tablist" aria-label="Plans" className="grid grid-cols-3 gap-4 border-b border-line sm:flex sm:gap-0">
        {tiers.map((x) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={x.id === active}
            onClick={() => pick(x.id)}
            className={cx(
              "-mb-px border-b-[3px] pb-3 text-left transition-colors sm:mr-8 sm:last:mr-0",
              x.id === active ? "border-ink text-ink" : "border-transparent text-ink/55 hover:text-ink",
            )}
          >
            <span className="block font-semibold leading-snug sm:text-lg">{x.who}</span>
            <span className="block text-sm">
              {x.price} {x.per}
            </span>
          </button>
        ))}
      </div>

      <div role="tabpanel" key={t.id} className="rise mt-10 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:gap-16">
        <div className="md:sticky md:top-24 md:self-start">
          <h2 className="text-4xl font-extrabold tracking-tight">{t.who}</h2>
          <p className="mt-4">
            <span className="text-5xl font-extrabold">{t.price}</span> <span className="text-lg">{t.per}</span>
          </p>
          {t.note && <p className="mt-1 font-semibold">{t.note}</p>}
          <p className="mt-5 text-lg leading-relaxed text-ink/80">{t.intro}</p>
          <a
            href={t.id === "student" ? INDIVIDUAL_SIGNUP_URL : SIGNUP_URL}
            className="mt-7 inline-flex h-11 items-center rounded-lg bg-ink px-5 font-semibold text-white hover:bg-ink/85"
          >
            {t.id === "student" ? "Sign up as a student" : "Start a free trial"}
          </a>
        </div>

        <div className="space-y-10">
          {sections.map((d) => (
            <section key={d.title} className="border-t-2 border-ink pt-4">
              <h3 className="text-xl font-extrabold">{d.title}</h3>
              <ul className="mt-2">
                {d.items.map((item) => (
                  <li key={item} className="border-b border-line py-3 leading-relaxed text-ink/85 last:border-b-0">
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
