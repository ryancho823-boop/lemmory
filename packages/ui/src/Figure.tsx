import type { Figure as FigureData, Pt } from "@lemmory/core/content/types";

const COLORS: Record<string, string> = { blue: "#2563eb", rose: "#e11d48" };

/** Draws a formula or problem diagram. Points are labeled in italics like the math. */
export function Figure({ figure: f, className }: { figure: FigureData; className?: string }) {
  const p = (name: string): Pt => f.pts[name];
  return (
    <svg
      viewBox={`0 0 ${f.w} ${f.h}`}
      className={className ?? "mx-auto block h-auto w-full"}
      // Tall figures stay narrow, so every figure is about the same height.
      style={{ maxWidth: Math.round(f.w * 0.85) }}
      role="img"
      aria-label={`Diagram with points ${Object.keys(f.pts).filter((n) => !f.hide.includes(n)).join(", ")}`}
    >
      {f.shapes.map((s) => (
        <polygon key={s} points={s.split("-").map((n) => p(n).join(",")).join(" ")} fill="#fff7d1" stroke="none" />
      ))}
      {f.circles.map((c, i) => (
        <circle key={i} cx={c.c[0]} cy={c.c[1]} r={c.r} fill="none" stroke="#0f1121" strokeWidth={1.6} strokeDasharray={c.dashed ? "5 4" : undefined} />
      ))}
      {f.lines.map((l) => {
        const [seg, style] = l.split(":");
        const [a, b] = seg.split("-");
        return (
          <line
            key={l}
            x1={p(a)[0]}
            y1={p(a)[1]}
            x2={p(b)[0]}
            y2={p(b)[1]}
            stroke={COLORS[style] ?? "#0f1121"}
            strokeWidth={style && style !== "dashed" ? 2.6 : 1.6}
            strokeDasharray={style === "dashed" ? "5 4" : undefined}
            strokeLinecap="round"
          />
        );
      })}
      {f.rights.map((r) => {
        const [a, b, c] = r.split("-").map(p);
        const unit = (from: Pt, to: Pt): Pt => {
          const d = Math.hypot(to[0] - from[0], to[1] - from[1]) || 1;
          return [((to[0] - from[0]) / d) * 9, ((to[1] - from[1]) / d) * 9];
        };
        const [u, v] = [unit(b, a), unit(b, c)];
        const pts = [
          [b[0] + u[0], b[1] + u[1]],
          [b[0] + u[0] + v[0], b[1] + u[1] + v[1]],
          [b[0] + v[0], b[1] + v[1]],
        ];
        return <polyline key={r} points={pts.map((q) => q.join(",")).join(" ")} fill="none" stroke="#0f1121" strokeWidth={1.2} />;
      })}
      {f.dots?.map((q, i) => <circle key={`dot${i}`} cx={q[0]} cy={q[1]} r={2} fill="#0f1121" fillOpacity={0.45} />)}
      {Object.entries(f.pts)
        .filter(([n]) => !f.hide.includes(n))
        .map(([n, q]) => (
          <g key={n}>
            <circle cx={q[0]} cy={q[1]} r={3} fill="#0f1121" />
            <text x={f.labels[n][0]} y={f.labels[n][1]} textAnchor="middle" dominantBaseline="central" fontSize={15} fontStyle="italic" fontFamily="KaTeX_Math, 'Times New Roman', serif" fill="#0f1121">
              {n}
            </text>
          </g>
        ))}
      {f.texts.map((t, i) => (
        <text key={i} x={t.at[0]} y={t.at[1]} textAnchor="middle" dominantBaseline="central" fontSize={13} fontFamily="KaTeX_Main, 'Times New Roman', serif" fill="#0f1121" fillOpacity={0.8}>
          {t.text}
        </text>
      ))}
    </svg>
  );
}
