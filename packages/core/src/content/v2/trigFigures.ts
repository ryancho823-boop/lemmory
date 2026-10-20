// Diagrams for trigonometry formulas and problems that are really about triangles or the unit circle.
// Pure identities (product-to-sum, triple angle, ...) have none: a picture wouldn't help.
import type { Figure } from "../types";
import { angleAt, circumcircle, fig, foot, incircle, meet, polar, triangle, type Pt } from "../fig";

type Text = { on?: string; at?: Pt; text: string };

/** A triangle from two of its angles (degrees) and side a = BC, with B at the origin. */
function byAngles(B: number, C: number, a: number) {
  const b: Pt = [0, 0], c: Pt = [a, 0];
  return { A: meet(b, polar(b, 1, B), c, polar(c, 1, 180 - C)), B: b, C: c };
}

/** Labels a triangle's corners with angle texts placed just inside each corner. */
const cornerTexts = (t: { A: Pt; B: Pt; C: Pt }, texts: { A?: string; B?: string; C?: string }, r: number): Text[] =>
  (["A", "B", "C"] as const)
    .filter((k) => texts[k])
    .map((k) => {
      const [p, q] = k === "A" ? [t.B, t.C] : k === "B" ? [t.C, t.A] : [t.A, t.B];
      return { at: angleAt(t[k], p, q, r), text: texts[k]! };
    });

const triFig = (t: { A: Pt; B: Pt; C: Pt }, texts: Text[], extra: Partial<Parameters<typeof fig>[0]> = {}) =>
  fig({ ...extra, pts: { ...t, ...extra.pts }, shapes: ["A-B-C"], lines: ["A-B", "B-C", "C-A", ...(extra.lines ?? [])], texts: [...texts, ...(extra.texts ?? [])] });

/** Coordinate axes and, optionally, the unit circle. */
const plane = (x0: number, x1: number, y0: number, y1: number, labels: [string, string] = ["x", "y"]) => ({
  pts: { ax0: [x0, 0] as Pt, ax1: [x1, 0] as Pt, ay0: [0, y0] as Pt, ay1: [0, y1] as Pt, O: [0, 0] as Pt },
  hide: ["ax0", "ax1", "ay0", "ay1", "O"],
  lines: ["ax0-ax1", "ay0-ay1"],
  texts: [{ at: [x1, -0.08 * (y1 - y0)] as Pt, text: labels[0] }, { at: [0.08 * (x1 - x0), y1] as Pt, text: labels[1] }],
});

const unitAngles = (angles: [string, number][], extra: Text[] = []) => {
  const p = plane(-1.3, 1.4, -1.3, 1.4);
  const pts: Record<string, Pt> = { ...p.pts };
  angles.forEach(([n, d]) => (pts[n] = polar([0, 0], 1, d)));
  return fig({ pts, hide: p.hide, circles: [{ c: [0, 0], r: 1 }], lines: [...p.lines, ...angles.map(([n], i) => `O-${n}${i ? ":rose" : ":blue"}`)], texts: [...p.texts, ...extra] });
};

/** A right triangle with the right angle at C, legs along the axes. */
const rightTri = (leg: number, base: number, texts: Text[]) => {
  const A: Pt = [0, 0], C: Pt = [base, 0], B: Pt = [base, leg];
  return fig({ pts: { A, B, C }, shapes: ["A-B-C"], lines: ["A-B", "B-C", "C-A"], rights: ["A-C-B"], texts });
};

const polarFig = (P: Pt, box: [number, number, number, number], texts: Text[]) => {
  const p = plane(...box);
  const X: Pt = [P[0], 0], Y: Pt = [0, P[1]];
  return fig({ pts: { ...p.pts, P, X, Y }, hide: [...p.hide, "X", "Y"], lines: [...p.lines, "O-P:blue", "P-X:dashed", "P-Y:dashed"], texts: [...p.texts, ...texts] });
};

const incircleFig = (t: { A: Pt; B: Pt; C: Pt }, texts: Text[]) => {
  const i = incircle(t.A, t.B, t.C), T = foot(i.c, t.A, t.B);
  return triFig(t, texts, { pts: { I: i.c, T }, hide: ["T"], circles: [i], lines: ["A-I:dashed", "I-T:blue"], rights: ["I-T-B"] });
};

const circumFig = (t: { A: Pt; B: Pt; C: Pt }, texts: Text[]) => {
  const o = circumcircle(t.A, t.B, t.C);
  return triFig(t, texts, { pts: { O: o.c }, circles: [o], lines: ["O-B:blue"] });
};

const projFig = (t: { A: Pt; B: Pt; C: Pt }, texts: Text[]) => {
  const D = foot(t.A, t.B, t.C);
  return triFig(t, texts, { pts: { D }, lines: ["A-D:dashed"], rights: ["A-D-C"] });
};

// Angle A sits opposite the side the problem asks about.
const t345 = { A: [4, 0] as Pt, B: [0, 3] as Pt, C: [0, 0] as Pt };
const generic = triangle(6, 5, 4.2);

export const TRIG_FORMULA_FIGURES: Record<string, Figure> = {
  "double-angle": unitAngles([["P", 35], ["Q", 70]], [{ at: polar([0, 0], 0.32, 17), text: "x" }, { at: polar([0, 0], 0.5, 50), text: "2x" }]),
  "angle-addition": unitAngles([["P", 30], ["Q", 75]], [{ at: polar([0, 0], 0.32, 15), text: "a" }, { at: polar([0, 0], 0.42, 52), text: "b" }]),
  "area-sine": triFig(generic, [{ on: "B-C", text: "a" }, { on: "C-A", text: "b" }]),
  "law-of-cosines": triFig(generic, [{ on: "B-C", text: "a" }, { on: "C-A", text: "b" }, { on: "A-B", text: "c" }]),
  "law-of-sines": circumFig(generic, [{ on: "B-C", text: "a" }, { on: "C-A", text: "b" }, { on: "A-B", text: "c" }, { on: "O-B", text: "R" }]),
  polar: polarFig([2.2, 1.6], [-0.5, 3, -0.5, 2.2], [{ on: "O-P", text: "r" }, { at: angleAt([0, 0], [1, 0], [2.2, 1.6], 0.55), text: "t" }]),
  "arctan-sum": rightTri(1, 2.2, [{ on: "B-C", text: "1" }, { on: "C-A", text: "x" }, { at: angleAt([0, 0], [2.2, 0], [2.2, 1], 0.8), text: "arctan(1/x)" }, { at: angleAt([2.2, 1], [0, 0], [2.2, 0], 0.4), text: "arctan x" }]),
  "euler-de-moivre": (() => {
    const p = plane(-0.5, 2.6, -0.5, 2.2, ["Re", "Im"]), z = polar([0, 0], 2, 50);
    return fig({ pts: { ...p.pts, z }, hide: p.hide, lines: [...p.lines, "O-z:blue"], texts: [...p.texts, { on: "O-z", text: "r" }, { at: angleAt([0, 0], [1, 0], z, 0.5), text: "θ" }] });
  })(),
  "roots-of-unity": (() => {
    const p = plane(-1.35, 1.45, -1.35, 1.45, ["Re", "Im"]);
    const names = ["1", "ω", "ω²", "ω³", "ω⁴", "ω⁵", "ω⁶", "ω⁷"];
    const roots = Object.fromEntries(names.map((n, k) => [n, polar([0, 0], 1, 45 * k)]));
    return fig({ pts: { ...p.pts, ...roots }, hide: p.hide, circles: [{ c: [0, 0], r: 1, dashed: true }], lines: p.lines, texts: p.texts });
  })(),
  "law-of-tangents": triFig(generic, [{ on: "B-C", text: "a" }, { on: "C-A", text: "b" }]),
  mollweide: triFig(generic, [{ on: "B-C", text: "a" }, { on: "C-A", text: "b" }, { on: "A-B", text: "c" }]),
  "auxiliary-angle": rightTri(1.6, 2.4, [{ on: "B-C", text: "b" }, { on: "C-A", text: "a" }, { on: "A-B", text: "√(a²+b²)" }, { at: angleAt([0, 0], [2.4, 0], [2.4, 1.6], 0.55), text: "φ" }]),
  "tan-half-sub": rightTri(1.2, 1.6, [{ on: "B-C", text: "2t" }, { on: "C-A", text: "1 − t²" }, { on: "A-B", text: "1 + t²" }, { at: angleAt([0, 0], [1.6, 0], [1.6, 1.2], 0.45), text: "x" }]),
  "half-angle-sides": incircleFig(generic, [{ on: "I-T", text: "r" }, { on: "A-T", text: "s − a" }]),
  "inradius-sines": (() => {
    const o = circumcircle(generic.A, generic.B, generic.C), i = incircle(generic.A, generic.B, generic.C);
    return triFig(generic, [], { pts: { O: o.c, I: i.c }, circles: [o, i], nudge: { O: [10, -8] } });
  })(),
  "area-sines": circumFig(generic, [{ on: "O-B", text: "R" }]),
  "projection-formula": projFig(generic, [{ on: "B-D", text: "c cos B" }, { on: "D-C", text: "b cos C" }, { on: "A-B", text: "c" }, { on: "C-A", text: "b" }]),
  "half-angle-tan-identity": (() => {
    const i = incircle(generic.A, generic.B, generic.C);
    return triFig(generic, [], { pts: { I: i.c }, circles: [i], lines: ["A-I:dashed", "B-I:dashed", "C-I:dashed"] });
  })(),
  "complex-distance": (() => {
    const p = plane(-0.5, 4, -0.5, 3, ["Re", "Im"]), z: Pt = [3.2, 2.4], w: Pt = [1, 0.8];
    return fig({ pts: { ...p.pts, z, w }, hide: p.hide, lines: [...p.lines, "z-w:blue"], texts: [...p.texts, { on: "z-w", text: "|z − w|" }] });
  })(),
  "equal-angle-sums": (() => {
    const p = plane(-1.3, 1.45, -1.3, 1.45);
    const pts: Record<string, Pt> = { ...p.pts };
    for (let k = 0; k < 5; k++) pts[`v${k}`] = polar([0, 0], 1, 10 + 72 * k);
    return fig({ pts, hide: [...p.hide, "v0", "v1", "v2", "v3", "v4"], circles: [{ c: [0, 0], r: 1, dashed: true }], lines: [...p.lines, ...[0, 1, 2, 3, 4].map((k) => `O-v${k}:blue`)] });
  })(),
  "exact-values": (() => {
    // The golden triangle: apex 36°, base angles 72°. Bisecting a base angle makes a smaller copy.
    const t = byAngles(72, 72, 2);
    const D = meet(t.B, polar(t.B, 1, 36), t.A, t.C);
    return triFig(t, cornerTexts(t, { A: "36°", B: "72°", C: "72°" }, 0.5), { pts: { D }, lines: ["B-D:blue"] });
  })(),
};

export const TRIG_PROBLEM_FIGURES: Record<string, Figure> = {
  da1: rightTri(3, 4, [{ on: "A-B", text: "5" }, { on: "B-C", text: "3" }, { at: angleAt([0, 0], [4, 0], [4, 3], 0.9), text: "x" }]),
  ar1: (() => {
    const t = { A: polar([0, 0], 8, 30), B: [0, 0] as Pt, C: [10, 0] as Pt };
    return triFig(t, [{ on: "A-B", text: "8" }, { on: "B-C", text: "10" }, ...cornerTexts(t, { B: "30°" }, 1.6)]);
  })(),
  ar2: (() => {
    const A: Pt = [0, 0], B: Pt = [9, 0], D = polar(A, 6, 30), C: Pt = [B[0] + D[0], D[1]];
    return fig({ pts: { A, B, C, D }, shapes: ["A-B-C-D"], lines: ["A-B", "B-C", "C-D", "D-A"], texts: [{ on: "A-B", text: "9" }, { on: "D-A", text: "6" }, { at: angleAt(B, A, C, 1.3), text: "150°" }] });
  })(),
  lc1: (() => {
    const t = { A: polar([0, 0], 5, 60), B: [0, 0] as Pt, C: [8, 0] as Pt };
    return triFig(t, [{ on: "A-B", text: "5" }, { on: "B-C", text: "8" }, ...cornerTexts(t, { B: "60°" }, 1.2)]);
  })(),
  lc2: (() => {
    const t = triangle(7, 5, 3);
    return triFig(t, [{ on: "B-C", text: "7" }, { on: "C-A", text: "5" }, { on: "A-B", text: "3" }]);
  })(),
  ls1: (() => {
    const t = byAngles(80, 70, 6);
    return circumFig(t, [{ on: "B-C", text: "6" }, ...cornerTexts(t, { A: "30°" }, 1.6)]);
  })(),
  ls2: (() => {
    const t = byAngles(35, 55, 10);
    const o = circumcircle(t.A, t.B, t.C);
    return triFig(t, [], { circles: [o], rights: ["B-A-C"] });
  })(),
  pol1: polarFig(polar([0, 0], 4, 60), [-0.6, 3, -0.6, 4], [{ on: "O-P", text: "4" }, { at: angleAt([0, 0], [1, 0], polar([0, 0], 1, 60), 0.8), text: "60°" }]),
  pol2: polarFig([-3, 3], [-3.8, 1, -0.6, 3.8], []),
  "x-dm1": (() => {
    const p = plane(-0.5, 1.6, -0.5, 1.6, ["Re", "Im"]), z: Pt = [1, 1];
    return fig({ pts: { ...p.pts, z, u: [1, 0] }, hide: [...p.hide, "u"], lines: [...p.lines, "O-z:blue", "z-u:dashed"], texts: [...p.texts, { at: [1.18, 1.12], text: "1 + i" }] });
  })(),
  "v2-lt1": (() => {
    const t = byAngles(45, 60, 4);
    return triFig(t, [{ on: "B-C", text: "a" }, { on: "C-A", text: "b" }, ...cornerTexts(t, { A: "75°", B: "45°" }, 0.7)]);
  })(),
  "v2-mw1": (() => {
    const t = byAngles(45, 60, 4);
    return triFig(t, [{ on: "A-B", text: "2" }, ...cornerTexts(t, { A: "75°", B: "45°" }, 0.7)]);
  })(),
  "v2-hsd1": incircleFig(t345, [{ on: "B-C", text: "3" }, { on: "C-A", text: "4" }, { on: "A-B", text: "5" }]),
  "v2-hsd2": incircleFig(triangle(13, 14, 15), [{ on: "B-C", text: "13" }, { on: "C-A", text: "14" }, { on: "A-B", text: "15" }]),
  "v2-is1": (() => {
    const t = { A: [0, Math.sqrt(3)] as Pt, B: [1, 0] as Pt, C: [0, 0] as Pt };
    const o = circumcircle(t.A, t.B, t.C);
    return triFig(t, cornerTexts(t, { A: "30°", B: "60°" }, 0.35), { pts: { O: o.c }, circles: [o], rights: ["A-C-B"], lines: ["O-B:blue"], texts: [{ on: "O-B", text: "1" }] });
  })(),
  "v2-as2": (() => {
    const t = byAngles(60, 75, 2 * 2 * Math.sin(Math.PI / 4));
    return circumFig(t, [{ on: "O-B", text: "2" }, ...cornerTexts(t, { A: "45°", B: "60°", C: "75°" }, 0.45)]);
  })(),
  "v2-pf1": projFig(triangle(14, 13, 15), [{ on: "C-A", text: "13" }, { on: "A-B", text: "15" }]),
  "v2-cd1": (() => {
    const p = plane(-1.6, 3.8, -0.5, 4.6, ["Re", "Im"]), z: Pt = [3, 4], w: Pt = [-1, 1];
    return fig({ pts: { ...p.pts, z, w }, hide: p.hide, lines: [...p.lines, "z-w:blue"], texts: [...p.texts, { at: [2.2, 4.1], text: "3 + 4i" }, { at: [-1, 1.45], text: "−1 + i" }] });
  })(),
  "v2-cd2": (() => {
    const p = plane(-2.6, 2.8, -0.6, 5.6, ["Re", "Im"]), c: Pt = [0, 3];
    return fig({ pts: p.pts, hide: p.hide, circles: [{ c, r: 2 }], lines: p.lines, dots: [c], texts: [...p.texts, { at: [0.45, 3], text: "3i" }] });
  })(),
};

