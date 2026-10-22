import { Brain, LineChart, Repeat, Shuffle } from "lucide-react";

export const RESEARCH = [
  {
    stat: "61% vs 40%",
    label: "Testing effect",
    body: "A week after studying a passage, students who practiced recalling it remembered 61% of it. Students who re-read it remembered 40%.",
    use: "Recall cards make students produce each formula, not re-read it.",
    cite: "Roediger & Karpicke (2006), Psychological Science",
    href: "https://pubmed.ncbi.nlm.nih.gov/16507066/",
    icon: Brain,
  },
  {
    stat: "317 experiments",
    label: "Spacing effect",
    body: "A meta-analysis of 839 comparisons found that spreading practice out beats cramming, and the best gap between reviews grows with how long you need to remember.",
    use: "Each formula comes back at the gap that keeps it until contest day.",
    cite: "Cepeda, Pashler, Vul, Wixted & Rohrer (2006), Psychological Bulletin",
    href: "https://pubmed.ncbi.nlm.nih.gov/16719566/",
    icon: Repeat,
  },
  {
    stat: "61% vs 38%",
    label: "Interleaved math practice",
    body: "In a trial with 787 seventh graders across 54 classes, mixing problem types instead of practicing one type at a time raised scores a month later from 38% to 61%. Mixing forces students to choose the strategy.",
    use: "Application mode mixes formulas so students learn which one a problem needs.",
    cite: "Rohrer, Dedrick, Hartwig & Cheung (2020), Journal of Educational Psychology",
    href: "https://ies.ed.gov/use-work/awards/efficacy-study-interleaved-mathematics-practice",
    icon: Shuffle,
  },
  {
    stat: "220M logs",
    label: "The FSRS scheduler",
    body: "FSRS models each student's memory of each card and schedules the review for when recall is predicted to drop to 90%. It was built from 220 million real memory logs.",
    use: "Lemmory schedules every card with FSRS, using its published default parameters.",
    cite: "Ye, Su & Cao (2022), ACM KDD",
    href: "https://dblp1.uni-trier.de/rec/conf/kdd/YeSC22.html",
    icon: LineChart,
  },
];

// The chart's colors: ink for the axes and the no-review curve, blue for the spaced-review curve.
const CHART_INK = "#0f1121";
const CHART_BLUE = "#2a78d6";
const CHART_BLUE_DARK = "#1c5cab";

/** Illustration: FSRS forgetting curve with and without spaced reviews. */
export function ForgettingCurve() {
  const W = 520;
  const H = 260;
  const pad = { l: 40, r: 16, t: 16, b: 34 };
  const days = 40;
  const x = (d: number) => pad.l + (d / days) * (W - pad.l - pad.r);
  const y = (r: number) => pad.t + (1 - r) * (H - pad.t - pad.b);
  const R = (t: number, S: number) => Math.pow(1 + (19 / 81) * (t / S), -0.5);
  const noReview = Array.from({ length: 81 }, (_, i) => i / 2).map((t) => `${x(t)},${y(R(t, 1))}`);
  const reviews = [
    { at: 0, S: 1 },
    { at: 1, S: 3 },
    { at: 4, S: 10 },
    { at: 14, S: 40 },
  ];
  const spaced: string[] = [];
  reviews.forEach((rv, i) => {
    const end = reviews[i + 1]?.at ?? days;
    for (let t = rv.at; t <= end; t += 0.25) spaced.push(`${x(t)},${y(R(t - rv.at, rv.S))}`);
  });

  return (
    <figure className="rounded-3xl border border-line p-5">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Forgetting curve with and without spaced reviews">
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <g key={g}>
            <line x1={pad.l} x2={W - pad.r} y1={y(g)} y2={y(g)} stroke={CHART_INK} strokeOpacity={0.07} />
            <text x={pad.l - 8} y={y(g) + 4} textAnchor="end" fontSize={11} fill={CHART_INK} fillOpacity={0.45}>
              {g * 100}%
            </text>
          </g>
        ))}
        {[0, 10, 20, 30, 40].map((d) => (
          <text key={d} x={x(d)} y={H - 12} textAnchor={d === 40 ? "end" : "middle"} fontSize={11} fill={CHART_INK} fillOpacity={0.45}>
            {d === 0 ? "Class" : `Day ${d}`}
          </text>
        ))}
        <polyline points={noReview.join(" ")} fill="none" stroke={CHART_INK} strokeOpacity={0.3} strokeWidth={2} strokeDasharray="5 5" />
        <polyline points={spaced.join(" ")} fill="none" stroke={CHART_BLUE} strokeWidth={2.5} strokeLinejoin="round" />
        {reviews.slice(1).map((rv) => (
          <circle key={rv.at} cx={x(rv.at)} cy={y(1)} r={5} fill={CHART_BLUE} stroke="white" strokeWidth={2} />
        ))}
        <text x={x(31)} y={y(R(31, 1)) + 18} fontSize={12} fill={CHART_INK} fillOpacity={0.55}>
          No review
        </text>
        <text x={x(22)} y={y(0.97) - 8} fontSize={12} fontWeight={700} fill={CHART_BLUE_DARK}>
          With Lemmory reviews
        </text>
      </svg>
      <figcaption className="mt-2 text-xs text-ink/45">
        Illustration using the FSRS forgetting curve. Dots mark reviews; each one makes the next decline slower.
      </figcaption>
    </figure>
  );
}
