"use client";

import { useState } from "react";
import Image from "next/image";
import { cx } from "@lemmory/ui/ui";
import { ACCENT } from "@/lib/accents";

// Screenshots of the demo (public/shots), retaken with the demo running locally.
const VIEWS = [
  {
    id: "home",
    tab: "Student home",
    color: ACCENT.blue,
    title: "One button a day",
    body: "Students see how many cards are due, the formulas they keep missing, and where they stand on the class leaderboard.",
    src: "/shots/student-home.png",
    w: 2560,
    h: 1300,
    alt: "Student home page: 9 cards today with a Start button, a list of formulas to focus on, and the class leaderboard",
  },
  {
    id: "assign",
    tab: "Assigning",
    color: ACCENT.rose,
    title: "Assign this week's formulas",
    body: "Teachers pick formulas from the bank as the course covers them. Each one goes into every student's deck with one click.",
    src: "/shots/teacher-assign.png",
    w: 1560,
    h: 1000,
    alt: "Teacher's Assign formulas page listing algebra formulas, most marked Assigned",
  },
  {
    id: "class",
    tab: "Class overview",
    color: ACCENT.green,
    title: "See what the class is forgetting",
    body: "Accuracy on every assigned formula, who finished today's review, and which students are falling behind.",
    src: "/shots/teacher-overview.png",
    w: 2560,
    h: 1300,
    alt: "Teacher overview: what the class is forgetting, students who need attention, and this week's homework",
  },
  {
    id: "stats",
    tab: "Student stats",
    color: ACCENT.purple,
    title: "Progress students can see",
    body: "A streak calendar, accuracy by topic, and the formulas that need more work.",
    src: "/shots/student-stats.png",
    w: 2560,
    h: 1720,
    alt: "Student stats page: streak, cards reviewed, formulas that need work, a calendar and accuracy by topic",
  },
];

export function ProductTour() {
  const [active, setActive] = useState(0);
  const v = VIEWS[active];
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <div role="tablist" aria-label="Parts of Lemmory" className="flex gap-2 overflow-x-auto [scrollbar-width:none] lg:flex-col lg:gap-1 lg:overflow-visible">
        {VIEWS.map((x, i) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={i === active}
            aria-controls="tour-panel"
            onClick={() => setActive(i)}
            className={cx(
              "shrink-0 rounded-lg border-l-4 px-4 py-3 text-left transition-colors",
              i === active ? "bg-white" : "border-transparent hover:bg-white/60",
            )}
            style={i === active ? { borderColor: x.color } : undefined}
          >
            <span className={cx("block font-semibold", i !== active && "text-ink/70")}>{x.tab}</span>
            {i === active && <span className="mt-1 hidden leading-relaxed text-ink/80 lg:block">{x.body}</span>}
          </button>
        ))}
      </div>
      <figure id="tour-panel" role="tabpanel">
        <div className="overflow-hidden rounded-lg border border-ink/15 bg-white">
          <div className="flex items-center gap-1.5 border-b border-line bg-canvas px-3 py-2">
            <span className="size-2.5 rounded-full bg-ink/15" />
            <span className="size-2.5 rounded-full bg-ink/15" />
            <span className="size-2.5 rounded-full bg-ink/15" />
            <span className="ml-3 text-xs text-ink/60">{v.tab}</span>
          </div>
          {/* Every screenshot stays mounted so switching tabs is instant; only the active one shows. */}
          <div className="relative">
            {VIEWS.map((x, i) => (
              <Image
                key={x.id}
                src={x.src}
                width={x.w}
                height={x.h}
                alt={x.alt}
                sizes="(min-width: 1024px) 760px, 100vw"
                priority={i === 0}
                loading={i === 0 ? undefined : "eager"}
                aria-hidden={i !== active}
                className={cx("h-auto w-full transition-opacity duration-300", i === active ? "relative opacity-100" : "absolute inset-x-0 top-0 opacity-0")}
              />
            ))}
          </div>
        </div>
        <figcaption className="mt-3 lg:hidden">
          <span className="font-semibold">{v.title}.</span> <span className="text-ink/80">{v.body}</span>
        </figcaption>
      </figure>
    </div>
  );
}
