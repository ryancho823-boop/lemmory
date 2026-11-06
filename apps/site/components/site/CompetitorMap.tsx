import { cx } from "@lemmory/ui/ui";

// Where the alternatives sit: left to right from general subjects to competition math, top to
// bottom from long-term memory to practice only. Positions are percentages of the chart.
const OTHERS: { name: string; short?: string; left?: string; right?: string; top: string }[] = [
  { name: "Anki", left: "7%", top: "13%" },
  { name: "Podsie", left: "27%", top: "25%" },
  { name: "Quizlet", left: "13%", top: "36%" },
  // Built for contests and spaced review, but with no class tools, so it sits low in the corner.
  { name: "Achievable", right: "14%", top: "38%" },
  { name: "Alcumus", right: "12%", top: "66%" },
  { name: "AoPS, Think, AlphaStar", short: "Academies", right: "3%", top: "78%" },
];

/** The market in one picture: Lemmory in the competition-math, long-term-memory corner. */
export function CompetitorMap() {
  return (
    <figure aria-label="Chart: Lemmory is for competition math and for long-term memory. Anki, Podsie and Quizlet are for long-term memory in general subjects. Achievable is for competition math with some long-term memory. Alcumus and contest academies are competition math practice." className="relative aspect-[4/3] w-full text-sm">
      <div className="absolute left-1/2 right-0 top-0 h-1/2 bg-lemon-soft" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-ink/50" />
      <div className="absolute inset-y-0 left-1/2 w-px bg-ink/50" />

      <span className="absolute left-[calc(50%+10px)] top-2 text-xs text-ink/55">For long-term memory</span>
      <span className="absolute bottom-2 left-[calc(50%+10px)] text-xs text-ink/55">Practice only</span>
      <span className="absolute left-0 top-[calc(50%+8px)] text-xs text-ink/55">General subjects</span>
      <span className="absolute right-0 top-[calc(50%+8px)] text-xs text-ink/55">Competition math</span>

      {OTHERS.map((o) => (
        <span key={o.name} className={cx("absolute flex items-center gap-2", o.right && "flex-row-reverse")} style={{ left: o.left, right: o.right, top: o.top }}>
          <span className="size-2 shrink-0 rounded-full bg-ink/35" />
          {o.short ? (
            <>
              <span className="sm:hidden">{o.short}</span>
              <span className="hidden sm:inline">{o.name}</span>
            </>
          ) : (
            o.name
          )}
        </span>
      ))}

      <span className="absolute right-[3%] top-[21%] flex items-center gap-2 sm:right-[8%] sm:gap-3">
        <span className="font-display text-xl font-bold sm:text-3xl">Lemmory</span>
        <span className="size-4 rounded-full border-2 border-ink bg-lemon sm:size-5" />
      </span>
    </figure>
  );
}
