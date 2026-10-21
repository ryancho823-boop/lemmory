// Diagram builders for the extra geometry problems in geometry.ts (this folder).
// The shared triangle, circle and coordinate shapes live in ../figures and the topic files.
import {
  along, circleMeet, circumcircle, curve, dist, excircle, fig, incircle, lineCircle, meet, mid, orthocenter, polar, tangentPoints, triangle,
  type Pt,
} from "../../fig";
import { axes } from "../figures";

type Text = { on?: string; at?: Pt; text: string };
type Circle = { c: Pt; r: number; dashed?: boolean };
interface Extra {
  pts?: Record<string, Pt>;
  lines?: string[];
  texts?: Text[];
  rights?: string[];
  hide?: string[];
  circles?: Circle[];
  shapes?: string[];
  nudge?: Record<string, Pt>;
}

/** Points on a unit circle at the given angles (degrees), with the center O if `center` is set. */
export const circlePts = (at: Record<string, number>, lines: string[], e: Extra & { center?: boolean } = {}) => {
  const O: Pt = [0, 0];
  const pts: Record<string, Pt> = Object.fromEntries(Object.entries(at).map(([n, deg]) => [n, polar(O, 1, deg)]));
  if (e.center) pts.O = O;
  return fig({ ...e, pts: { ...pts, ...e.pts }, circles: [{ c: O, r: 1 }, ...(e.circles ?? [])], lines, nudge: { O: [0, -12], ...e.nudge } });
};

/** Two secants from an outside point P: one meets the circle at A then B, the other at C then D. */
export const twoSecants = (r: number, pa: number, pb: number, pc: number, pd: number, texts: Text[] = []) => {
  const d = Math.sqrt(r * r + pa * pb);
  const O: Pt = [0, 0], P: Pt = [d, 0];
  const line = (near: number, far: number, sign: number) => {
    const h = Math.sqrt(r * r - ((far - near) / 2) ** 2); // distance from O to the secant
    const deg = 180 + (sign * Math.asin(h / d) * 180) / Math.PI;
    return [polar(P, near, deg), polar(P, far, deg)];
  };
  const [A, B] = line(pa, pb, 1), [C, D] = line(pc, pd, -1);
  return fig({ pts: { P, A, B, C, D }, circles: [{ c: O, r }], lines: ["P-B:blue", "P-D:rose"], texts });
};

/** A chord AB through P inside a circle of radius r, with PA = pa and PB = pb, and the center O. */
export const chordThrough = (r: number, pa: number, pb: number, texts: Text[] = []) => {
  const half = (pa + pb) / 2, h = Math.sqrt(r * r - half * half);
  const O: Pt = [0, 0], A: Pt = [-half, -h], B: Pt = [half, -h], P: Pt = [pa - half, -h];
  return fig({ pts: { O, A, B, P }, circles: [{ c: O, r }], lines: ["A-B:blue", "O-P:dashed"], texts, nudge: { P: [0, 14] } });
};

/** Points and segments on coordinate axes. */
export const axesFig = (pts: Record<string, Pt>, lines: string[], box: [number, number, number, number], e: Extra = {}) => {
  const ax = axes(...box);
  return fig({
    ...e,
    pts: { ...pts, ...ax.pts, ...e.pts },
    hide: [...ax.hide, ...(e.hide ?? [])],
    lines: [...ax.lines, ...lines],
    texts: [...ax.texts, ...(e.texts ?? [])],
  });
};

/** A lattice polygon with every lattice point of the box drawn as a dot. */
export const lattice = (corners: Pt[], box: [number, number, number, number]) => {
  const names = corners.map((_, i) => "ABCDEFG"[i]);
  const dots: Pt[] = [];
  for (let x = Math.ceil(box[0]); x <= box[1]; x++) for (let y = Math.ceil(box[2]); y <= box[3]; y++) dots.push([x, y]);
  return fig({
    pts: Object.fromEntries(corners.map((p, i) => [names[i], p])),
    shapes: [names.join("-")],
    lines: names.map((n, i) => `${n}-${names[(i + 1) % names.length]}`),
    dots,
  });
};

/** The hyperbola x²/a² - y²/b² = 1 with its foci F, G and, if given, a point P joined to both. */
export const hyperbolaFig = (a: number, b: number, P?: Pt) => {
  const c = Math.sqrt(a * a + b * b), T = 1.6;
  const branch = (s: number) => Array.from({ length: 31 }, (_, i) => {
    const t = -T + (2 * T * i) / 30;
    return [s * a * Math.cosh(t), b * Math.sinh(t)] as Pt;
  });
  const r = curve("r", branch(1)), l = curve("l", branch(-1));
  const pts: Record<string, Pt> = { ...r.pts, ...l.pts, F: [-c, 0], G: [c, 0] };
  const lines = [...r.lines, ...l.lines];
  if (P) {
    pts.P = P;
    lines.push("P-F:blue", "P-G:rose");
  }
  return fig({ pts, hide: [...r.hide, ...l.hide], lines, nudge: { F: [0, 12], G: [0, 12] } });
};

/** A triangle with its circumcircle and incircle, and their centers O and I. */
export const oiFig = (a: number, b: number, c: number, texts: Text[] = []) => {
  const { A, B, C } = triangle(a, b, c);
  const out = circumcircle(A, B, C), inn = incircle(A, B, C);
  return fig({ pts: { A, B, C, O: out.c, I: inn.c }, circles: [out, { ...inn, dashed: true }], lines: ["A-B", "B-C", "C-A", "O-I:blue"], texts, nudge: { O: [10, -8], I: [-10, 8] } });
};

/** A triangle with the excircle opposite A, centered at J. */
export const excircleFig = (a: number, b: number, c: number, texts: Text[] = []) => {
  const { A, B, C } = triangle(a, b, c);
  const ex = excircle(A, B, C);
  const far = (P: Pt) => along(A, P, (dist(A, ex.c) + ex.r) / dist(A, P) * 1.15);
  return fig({ pts: { A, B, C, J: ex.c, b2: far(B), c2: far(C) }, hide: ["b2", "c2"], shapes: ["A-B-C"], circles: [{ ...ex, dashed: true }], lines: ["A-B", "B-C", "C-A", "B-b2", "C-c2"], texts });
};

/** Routh's inner triangle for BD/DC = x, CE/EA = y, AF/FB = z. */
export const routhBy = (x: number, y: number, z: number, texts: Text[] = []) => {
  const { A, B, C } = triangle(7, 6, 5.5);
  const D = along(B, C, x / (x + 1)), E = along(C, A, y / (y + 1)), F = along(A, B, z / (z + 1));
  const P = meet(A, D, B, E), Q = meet(B, E, C, F), R = meet(C, F, A, D);
  return fig({ pts: { A, B, C, D, E, F, P, Q, R }, hide: ["P", "Q", "R"], shapes: ["P-Q-R"], lines: ["A-B", "B-C", "C-A", "A-D", "B-E", "C-F"], texts });
};

/** A triangle with circumcenter O, centroid G, orthocenter H and the Euler line through them. */
export const eulerFig = (A: Pt, B: Pt, C: Pt, nine = false) => {
  const O = circumcircle(A, B, C).c, H = orthocenter(A, B, C);
  const G: Pt = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
  const N = mid(O, H), R = dist(O, A);
  const pts: Record<string, Pt> = nine ? { A, B, C, O, H, N } : { A, B, C, O, G, H };
  return fig({
    pts,
    shapes: ["A-B-C"],
    circles: nine ? [{ c: N, r: R / 2, dashed: true }] : [],
    lines: ["A-B", "B-C", "C-A", "O-H:blue"],
    nudge: { O: [10, 6], G: [-10, -8], H: [-10, 6], N: [0, -12] },
  });
};

/** Two circles of radius r whose centers are d apart, with the lens they share shaded. */
export const lensFig = (r: number, d: number) => {
  const P: Pt = [0, 0], Q: Pt = [d, 0];
  const [X, Y] = circleMeet({ c: P, r }, { c: Q, r });
  const half = (Math.acos(d / 2 / r) * 180) / Math.PI;
  const a = curve("a", Array.from({ length: 13 }, (_, i) => polar(P, r, -half + (2 * half * i) / 12)));
  const b = curve("b", Array.from({ length: 13 }, (_, i) => polar(Q, r, 180 - half + (2 * half * i) / 12)));
  return fig({ pts: { P, Q, X, Y, ...a.pts, ...b.pts }, hide: [...a.hide, ...b.hide, "X", "Y"], circles: [{ c: P, r }, { c: Q, r }], shapes: [[...a.names, ...b.names].join("-")], lines: ["P-Q:dashed"], nudge: { P: [0, 12], Q: [0, 12] } });
};

/** Two parallel chords of half-lengths h1, h2 on opposite sides of the center of a circle of radius r. */
export const parallelChords = (r: number, h1: number, h2: number, texts: Text[] = []) => {
  const d1 = Math.sqrt(r * r - h1 * h1), d2 = Math.sqrt(r * r - h2 * h2);
  const O: Pt = [0, 0];
  return fig({ pts: { O, A: [-h1, d1], B: [h1, d1], C: [-h2, -d2], D: [h2, -d2], M: [0, d1], N: [0, -d2] }, hide: ["M", "N"], circles: [{ c: O, r }], lines: ["A-B:blue", "C-D:blue", "M-N:dashed"], texts, nudge: { O: [12, 0] } });
};

/** Two circles crossing at A and B, and a point P on line AB with a tangent to each circle. */
export const radicalFig = (texts: Text[] = []) => {
  const c1 = { c: [0, 0] as Pt, r: 2 }, c2 = { c: [3, 0] as Pt, r: 1.6 };
  const [A, B] = circleMeet(c1, c2);
  const top = A[1] > B[1] ? A : B, low = A[1] > B[1] ? B : A;
  const P: Pt = [top[0], top[1] + 2.6];
  // The touch point on each circle's far side, away from the other circle.
  const S = tangentPoints(P, c1).sort((a, b) => a[0] - b[0])[0], T = tangentPoints(P, c2).sort((a, b) => b[0] - a[0])[0];
  return fig({ pts: { P, A: top, B: low, S, T }, circles: [c1, c2], lines: ["P-B", "P-S:blue", "P-T:blue"], texts, nudge: { A: [-12, 0] } });
};

/** The circle of points P with PA = k·PB, and one such point P. */
export const apolloniusFig = (ab: number, k: number, deg: number) => {
  const A: Pt = [0, 0], B: Pt = [ab, 0];
  const inner = (k * ab) / (k + 1), outer = (k * ab) / (k - 1);
  const c: Pt = [(inner + outer) / 2, 0], r = (outer - inner) / 2;
  const P = polar(c, r, deg);
  return fig({ pts: { A, B, P }, circles: [{ c, r, dashed: true }], lines: ["A-B", "P-A:blue", "P-B:rose"] });
};

/** The tangent line to a circle at the point T, drawn on coordinate axes. */
export const tangentAt = (c: Pt, r: number, T: Pt, box: [number, number, number, number]) => {
  const dir: Pt = [-(T[1] - c[1]) / r, (T[0] - c[0]) / r], len = Math.max(box[1] - box[0], box[3] - box[2]) * 0.45;
  const u: Pt = [T[0] + dir[0] * len, T[1] + dir[1] * len], v: Pt = [T[0] - dir[0] * len, T[1] - dir[1] * len];
  return axesFig({ T, C: c, u, v }, ["u-v:blue", "C-T:dashed"], box, { circles: [{ c, r }], hide: ["u", "v"], rights: ["C-T-u"] });
};

/** Circles each tangent to the others, given by their centers and radii. */
export const tangentCircles = (circles: Circle[]) => {
  const pts = Object.fromEntries(circles.map((c, i) => [`c${i}`, c.c]));
  return fig({ pts, hide: Object.keys(pts), circles });
};

/** A circle through two points, cut by a line: the chord's ends. */
export const lineCut = (c: Pt, r: number, p: Pt, q: Pt, box: [number, number, number, number]) => {
  const [A, B] = lineCircle(p, q, { c, r });
  return axesFig({ A, B, C: c }, ["A-B:blue"], box, { circles: [{ c, r }] });
};
