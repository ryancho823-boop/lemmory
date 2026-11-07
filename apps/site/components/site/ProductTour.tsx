"use client";

import { useState } from "react";
import Image from "next/image";
import { cx } from "@lemmory/ui/ui";
import { ACCENT } from "@/lib/accents";

// Screenshots of the demo (public/shots): taken at 1280 wide, 2x, with the sidebar cropped off.
// All four are the same size, so the frame never jumps between tabs.
const SHOT = { w: 1984, h: 1150 };
const VIEWS = [
  {
    id: "home",
    color: ACCENT.blue,
    tab: "Student home",
    title: "One button a day",
    body: "Students see how many cards are due, the formulas they keep missing, and where they stand on the class leaderboard.",
    src: "/shots/tour-student-home.png",
    alt: "Student home page: today's cards with a Start button, a list of formulas to focus on, and the class leaderboard",
  },
  {
    id: "assign",
    color: ACCENT.rose,
    tab: "Assigning",
    title: "Assign this week's formulas",
    body: "Teachers pick formulas from the bank as the course covers them. Each one goes into every student's deck with one click.",
    src: "/shots/tour-teacher-assign.png",
    alt: "Teacher's Assign formulas page listing algebra formulas, most marked Assigned",
  },
  {
    id: "class",
    color: ACCENT.green,
    tab: "Class overview",
    title: "See what the class is forgetting",
    body: "The formulas the class gets wrong most, who finished today's review, and who's falling behind, so you know what to reteach before the contest.",
    src: "/shots/tour-teacher-overview.png",
    alt: "Teacher overview: what the class is forgetting, students who need attention, and this week's homework",
  },
  {
    id: "stats",
    color: ACCENT.purple,
    tab: "Student stats",
    title: "Progress students can see",
    body: "A streak, a calendar of finished days, and the formulas that need more work.",
    src: "/shots/tour-student-stats.png",
    alt: "Student stats page: streak, cards reviewed, formulas that need work and a calendar",
  },
];

export function ProductTour() {
  const [active, setActive] = useState(0);
  const v = VIEWS[active];
  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] lg:gap-12">
      <div role="tablist" aria-label="Parts of Lemmory" className="flex gap-6 overflow-x-auto border-b border-line [scrollbar-width:none] lg:flex-col lg:gap-0 lg:overflow-visible lg:border-b-0">
        {VIEWS.map((x, i) => (
          <button
            key={x.id}
            role="tab"
            aria-selected={i === active}
            aria-controls="tour-panel"
            onClick={() => setActive(i)}
            className={cx("shrink-0 border-b-2 py-3 text-left transition-colors lg:border-b-0 lg:border-t lg:py-4", i === active ? "lg:border-t-2" : "border-transparent lg:border-line")}
            style={i === active ? { borderColor: x.color } : undefined}
          >
            <span className={cx("block font-semibold", i !== active && "text-ink/60 hover:text-ink")}>{x.tab}</span>
            {i === active && <span className="mt-1 hidden leading-relaxed text-ink/80 lg:block">{x.body}</span>}
          </button>
        ))}
      </div>
      <figure id="tour-panel" role="tabpanel">
        <div className="overflow-hidden rounded-lg border border-ink/20 bg-white">
          {/* Every screenshot stays mounted so switching tabs is instant; only the active one shows. */}
          <div className="relative">
            {VIEWS.map((x, i) => (
              <Image
                key={x.id}
                src={x.src}
                width={SHOT.w}
                height={SHOT.h}
                alt={x.alt}
                sizes="(min-width: 1024px) 800px, 100vw"
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
