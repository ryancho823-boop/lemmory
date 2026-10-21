// Figures for geometry formulas and problems. Write points in ordinary math coordinates
// (y up, any scale) using the helpers below, and `fig` fits them into a drawing box.
import type { Figure, Pt } from "./types";

export type { Pt };

const add = (a: Pt, b: Pt): Pt => [a[0] + b[0], a[1] + b[1]];
const sub = (a: Pt, b: Pt): Pt => [a[0] - b[0], a[1] - b[1]];
const mul = (a: Pt, k: number): Pt => [a[0] * k, a[1] * k];
export const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);

/** The point at `deg` degrees on a circle of radius r around c. */
export const polar = (c: Pt, r: number, deg: number): Pt => [c[0] + r * Math.cos((deg * Math.PI) / 180), c[1] + r * Math.sin((deg * Math.PI) / 180)];
export const mid = (a: Pt, b: Pt): Pt => mul(add(a, b), 0.5);
/** The point a fraction t of the way from a to b. */
export const along = (a: Pt, b: Pt, t: number): Pt => add(a, mul(sub(b, a), t));
/** The foot of the perpendicular from p to line ab. */
export function foot(p: Pt, a: Pt, b: Pt): Pt {
  const d = sub(b, a);
  const t = ((p[0] - a[0]) * d[0] + (p[1] - a[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2);
  return along(a, b, t);
}
/** Where lines ab and cd cross. */
export function meet(a: Pt, b: Pt, c: Pt, d: Pt): Pt {
  const r = sub(b, a), s = sub(d, c);
  const t = ((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0]) / (r[0] * s[1] - r[1] * s[0]);
  return along(a, b, t);
}
/** The circle through three points. */
export function circumcircle(a: Pt, b: Pt, c: Pt): { c: Pt; r: number } {
  const d = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]));
  const sq = (p: Pt) => p[0] ** 2 + p[1] ** 2;
  const x = (sq(a) * (b[1] - c[1]) + sq(b) * (c[1] - a[1]) + sq(c) * (a[1] - b[1])) / d;
  const y = (sq(a) * (c[0] - b[0]) + sq(b) * (a[0] - c[0]) + sq(c) * (b[0] - a[0])) / d;
  return { c: [x, y], r: dist([x, y], a) };
}
/** The inscribed circle of a triangle. */
export function incircle(a: Pt, b: Pt, c: Pt): { c: Pt; r: number } {
  const [la, lb, lc] = [dist(b, c), dist(c, a), dist(a, b)];
  const p = la + lb + lc;
  const center: Pt = [(la * a[0] + lb * b[0] + lc * c[0]) / p, (la * a[1] + lb * b[1] + lc * c[1]) / p];
  const s = p / 2;
  return { c: center, r: Math.sqrt(((s - la) * (s - lb) * (s - lc)) / s) };
}
/** Where line ab crosses a circle: the two points, in order from a toward b. */
export function lineCircle(a: Pt, b: Pt, circle: { c: Pt; r: number }): [Pt, Pt] {
  const d = sub(b, a), f = sub(a, circle.c);
  const A = d[0] ** 2 + d[1] ** 2, B = 2 * (f[0] * d[0] + f[1] * d[1]), C = f[0] ** 2 + f[1] ** 2 - circle.r ** 2;
  const root = Math.sqrt(Math.max(0, B * B - 4 * A * C));
  return [along(a, b, (-B - root) / (2 * A)), along(a, b, (-B + root) / (2 * A))];
}
/** The mirror image of p over line ab. */
export const reflect = (p: Pt, a: Pt, b: Pt): Pt => sub(mul(foot(p, a, b), 2), p);
/** The excircle opposite a (tangent to side bc). */
export function excircle(a: Pt, b: Pt, c: Pt): { c: Pt; r: number } {
  const [la, lb, lc] = [dist(b, c), dist(c, a), dist(a, b)];
  const w = -la + lb + lc;
  const center: Pt = [(-la * a[0] + lb * b[0] + lc * c[0]) / w, (-la * a[1] + lb * b[1] + lc * c[1]) / w];
  const s = (la + lb + lc) / 2;
  return { c: center, r: Math.sqrt((s * (s - lb) * (s - lc)) / (s - la)) };
}
/** Where the altitudes of a triangle meet. */
export function orthocenter(a: Pt, b: Pt, c: Pt): Pt {
  const o = circumcircle(a, b, c).c;
  return [a[0] + b[0] + c[0] - 2 * o[0], a[1] + b[1] + c[1] - 2 * o[1]];
}
/** The two points where tangents from p touch a circle. */
export function tangentPoints(p: Pt, circle: { c: Pt; r: number }): [Pt, Pt] {
  const d = dist(p, circle.c);
  const base = (Math.atan2(p[1] - circle.c[1], p[0] - circle.c[0]) * 180) / Math.PI;
  const t = (Math.acos(circle.r / d) * 180) / Math.PI;
  return [polar(circle.c, circle.r, base + t), polar(circle.c, circle.r, base - t)];
}
/** Where to write an angle's size: inside angle a-v-b, at distance r from the vertex v. */
export function angleAt(v: Pt, a: Pt, b: Pt, r: number): Pt {
  const u = (p: Pt): Pt => mul(sub(p, v), 1 / dist(p, v));
  const m = add(u(a), u(b));
  return add(v, mul(m, r / (Math.hypot(m[0], m[1]) || 1)));
}
/** The third corner of an equilateral triangle on pq, on the side away from `away`. */
export function equilateralOn(p: Pt, q: Pt, away: Pt): Pt {
  const m = mid(p, q), d = sub(q, p);
  const n: Pt = [(-d[1] * Math.sqrt(3)) / 2, (d[0] * Math.sqrt(3)) / 2];
  const a = add(m, n), b = sub(m, n);
  return dist(a, away) > dist(b, away) ? a : b;
}
/** Where two circles cross. */
export function circleMeet(p: { c: Pt; r: number }, q: { c: Pt; r: number }): [Pt, Pt] {
  const d = dist(p.c, q.c);
  const a = (p.r ** 2 - q.r ** 2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, p.r ** 2 - a * a));
  const m = along(p.c, q.c, a / d);
  const u: Pt = [(q.c[1] - p.c[1]) / d, -(q.c[0] - p.c[0]) / d];
  return [add(m, mul(u, h)), sub(m, mul(u, h))];
}
/** Points along a curve, named prefix0, prefix1, ..., joined by segments, for arcs, ellipses and other curves. */
export function curve(prefix: string, points: Pt[], style?: string) {
  const pts = Object.fromEntries(points.map((p, i) => [`${prefix}${i}`, p]));
  const names = Object.keys(pts);
  return { pts, hide: names, lines: names.slice(1).map((n, i) => `${names[i]}-${n}${style ? `:${style}` : ""}`), names };
}
/** Points on a circular arc from one angle to another, in degrees. */
export const arc = (c: Pt, r: number, from: number, to: number, n = 24): Pt[] =>
  Array.from({ length: n + 1 }, (_, i) => polar(c, r, from + ((to - from) * i) / n));
/** A triangle with side lengths a = BC, b = CA, c = AB, with B at the origin and C on the x-axis. */
export function triangle(a: number, b: number, c: number): { A: Pt; B: Pt; C: Pt } {
  const x = (a * a + c * c - b * b) / (2 * a);
  return { A: [x, Math.sqrt(c * c - x * x)], B: [0, 0], C: [a, 0] };
}

interface Spec {
  pts: Record<string, Pt>;
  lines?: string[];
  shapes?: string[];
  circles?: { c: Pt; r: number; dashed?: boolean }[];
  /** Text at a point, or on a segment ("A-B") placed just outside the figure. */
  texts?: { at?: Pt; on?: string; text: string }[];
  rights?: string[];
  /** Unlabeled dots, like lattice points. */
  dots?: Pt[];
  hide?: string[];
  /** Move a label: extra offset in drawing pixels, e.g. { A: [0, -6] }. */
  nudge?: Record<string, Pt>;
}

const BOX = 260; // longest side of the drawing, in px
const PAD = 26; // room for labels

/** Fit a figure written in math coordinates (y up) into a drawing box (y down). */
export function fig(spec: Spec): Figure {
  const all: Pt[] = [...Object.values(spec.pts), ...(spec.dots ?? [])];
  for (const c of spec.circles ?? []) all.push([c.c[0] - c.r, c.c[1] - c.r], [c.c[0] + c.r, c.c[1] + c.r]);
  const xs = all.map((p) => p[0]), ys = all.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const k = BOX / Math.max(x1 - x0, y1 - y0, 1e-9);
  const to = (p: Pt): Pt => [PAD + (p[0] - x0) * k, PAD + (y1 - p[1]) * k];
  const pts = Object.fromEntries(Object.entries(spec.pts).map(([n, p]) => [n, to(p)]));
  const hide = spec.hide ?? [];
  const shown = Object.entries(pts).filter(([n]) => !hide.includes(n));
  const center: Pt = shown.length
    ? [shown.reduce((s, [, p]) => s + p[0], 0) / shown.length, shown.reduce((s, [, p]) => s + p[1], 0) / shown.length]
    : [0, 0];
  // Labels sit 14px from their point, pointing away from the middle of the figure.
  const away = (p: Pt, gap: number): Pt => {
    let d = sub(p, center);
    if (Math.hypot(d[0], d[1]) < 4) d = [-1, -1]; // a point at the middle gets its label up and to the left
    return add(p, mul(d, gap / Math.hypot(d[0], d[1])));
  };
  const labels = Object.fromEntries(shown.map(([n, p]) => [n, add(away(p, 14), spec.nudge?.[n] ?? [0, 0])]));
  const texts = (spec.texts ?? []).map((t) => {
    if (t.at) return { at: to(t.at), text: t.text };
    const [a, b] = t.on!.split("-");
    return { at: away(mid(pts[a], pts[b]), 12), text: t.text };
  });
  return {
    w: Math.round((x1 - x0) * k + 2 * PAD),
    h: Math.round((y1 - y0) * k + 2 * PAD),
    pts,
    labels,
    hide,
    lines: spec.lines ?? [],
    shapes: spec.shapes ?? [],
    circles: (spec.circles ?? []).map((c) => ({ c: to(c.c), r: c.r * k, dashed: c.dashed })),
    texts,
    rights: spec.rights ?? [],
    ...(spec.dots ? { dots: spec.dots.map(to) } : {}),
  };
}
