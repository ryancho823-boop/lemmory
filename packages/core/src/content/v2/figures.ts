// Diagrams for the formulas and problems written before diagrams existed: geometry here,
// trigonometry in trigFigures.ts. formulas.ts attaches them by id.
import type { Figure } from "../types";
import { TRIG_FORMULA_FIGURES, TRIG_PROBLEM_FIGURES } from "./trigFigures";
import {
  along, angleAt, circumcircle, curve, fig, foot, incircle, lineCircle, meet, mid, polar, tangentPoints, triangle,
  type Pt,
} from "../fig";

type Text = { on?: string; at?: Pt; text: string };

const axes = (x0: number, x1: number, y0: number, y1: number) => ({
  pts: { ax0: [x0, 0] as Pt, ax1: [x1, 0] as Pt, ay0: [0, y0] as Pt, ay1: [0, y1] as Pt },
  hide: ["ax0", "ax1", "ay0", "ay1"],
  lines: ["ax0-ax1", "ay0-ay1"],
  texts: [{ at: [x1, -0.06 * (y1 - y0)] as Pt, text: "x" }, { at: [0.06 * (x1 - x0), y1] as Pt, text: "y" }],
});

/** A polygon on coordinate axes, with its corners named A, B, C, ... */
const onAxes = (corners: Pt[], box: [number, number, number, number]) => {
  const ax = axes(...box);
  const names = corners.map((_, i) => "ABCDEFG"[i]);
  const pts = Object.fromEntries(corners.map((p, i) => [names[i], p]));
  return fig({ pts: { ...pts, ...ax.pts }, hide: ax.hide, shapes: [names.join("-")], lines: [...ax.lines, ...names.map((n, i) => `${n}-${names[(i + 1) % names.length]}`)], texts: ax.texts });
};

/** A triangle with sides a = BC, b = CA, c = AB, labeled with the given texts. */
const tri = (a: number, b: number, c: number, sides: [string, string, string] | null, extra: (t: { A: Pt; B: Pt; C: Pt }) => Partial<Parameters<typeof fig>[0]> = () => ({})) => {
  const t = triangle(a, b, c);
  const e = extra(t);
  const texts: Text[] = sides ? [{ on: "B-C", text: sides[0] }, { on: "C-A", text: sides[1] }, { on: "A-B", text: sides[2] }].filter((x) => x.text) : [];
  return fig({ ...e, pts: { ...t, ...e.pts }, shapes: ["A-B-C", ...(e.shapes ?? [])], lines: ["A-B", "B-C", "C-A", ...(e.lines ?? [])], texts: [...texts, ...(e.texts ?? [])] });
};

/** A quadrilateral inscribed in a circle, with sides in order AB, BC, CD, DA. */
function cyclicQuad(sides: number[]) {
  let lo = Math.max(...sides) / 2 + 1e-9, hi = 1e4;
  const total = (R: number) => sides.reduce((s, x) => s + 2 * Math.asin(x / (2 * R)), 0);
  for (let i = 0; i < 100; i++) {
    const R = (lo + hi) / 2;
    if (total(R) > 2 * Math.PI) lo = R;
    else hi = R;
  }
  const R = lo, O: Pt = [0, 0];
  let a = 90;
  const [A, B, C, D] = sides.map((x) => {
    const p = polar(O, R, a);
    a += (2 * Math.asin(x / (2 * R)) * 180) / Math.PI;
    return p;
  });
  return { A, B, C, D, circle: { c: O, r: R } };
}

const quadFig = (q: ReturnType<typeof cyclicQuad>, sides: string[], diagonals = false) =>
  fig({
    pts: { A: q.A, B: q.B, C: q.C, D: q.D },
    shapes: ["A-B-C-D"],
    circles: [q.circle],
    lines: ["A-B", "B-C", "C-D", "D-A", ...(diagonals ? ["A-C:blue", "B-D:blue"] : [])],
    texts: ["A-B", "B-C", "C-D", "D-A"].map((on, i) => ({ on, text: sides[i] })).filter((t) => t.text),
  });

const proj = ([x, y, z]: [number, number, number]): Pt => [x + 0.45 * y, z + 0.32 * y];

const ellipse = (a: number, b: number, c: Pt = [0, 0], from = 0, to = 2 * Math.PI, n = 60) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const t = from + ((to - from) * i) / n;
    return [c[0] + a * Math.cos(t), c[1] + b * Math.sin(t)] as Pt;
  });

const inscribed = (arcs: { A: number; B: number; C: number }) => {
  const O: Pt = [0, 0];
  const A = polar(O, 1, arcs.A), B = polar(O, 1, arcs.B), C = polar(O, 1, arcs.C);
  return fig({ pts: { A, B, C, O }, circles: [{ c: O, r: 1 }], lines: ["C-A", "C-B", "O-A:blue", "O-B:blue"], nudge: { O: [0, -12] } });
};

const bisector = (a: number, b: number, c: number, texts: Text[]) =>
  tri(a, b, c, null, ({ B, C }) => {
    const D = along(B, C, c / (b + c));
    return { pts: { D }, lines: ["A-D:blue"], texts };
  });

const cevianFig = (a: number, b: number, c: number, bd: number, texts: Text[]) =>
  tri(a, b, c, null, ({ B, C }) => ({ pts: { D: along(B, C, bd / a) }, lines: ["A-D:blue"], texts, nudge: { D: [16, 0] } }));

const tangentFig = (d: number, r: number, texts: Text[]) => {
  const O: Pt = [0, 0], P: Pt = [d, 0];
  const [T, U] = tangentPoints(P, { c: O, r });
  return fig({ pts: { O, P, T, U }, circles: [{ c: O, r }], lines: ["P-T:blue", "P-U:blue", "O-T", "O-P:dashed"], rights: ["O-T-P"], texts });
};

const cevaFig = (bd: number, ce: number, texts: Text[]) =>
  tri(7, 6, 5.4, null, ({ A, B, C }) => {
    const D = along(B, C, bd), E = along(C, A, ce);
    const O = meet(A, D, B, E), F = meet(C, O, A, B);
    return { pts: { D, E, F, O }, hide: ["O"], lines: ["A-D", "B-E", "C-F"], texts };
  });

const parabolaFig = (p: number, P?: Pt) => {
  const X = Math.max(4.2 * p, P ? Math.abs(P[0]) + 0.6 : 0);
  const c = curve("k", Array.from({ length: 41 }, (_, i) => {
    const x = -X + (2 * X * i) / 40;
    return [x, (x * x) / (4 * p)] as Pt;
  }));
  const pts: Record<string, Pt> = { ...c.pts, F: [0, p], u: [-X, -p], v: [X, -p] };
  const lines = [...c.lines, "u-v:dashed"];
  if (P) {
    pts.P = P;
    pts.D = [P[0], -p];
    lines.push("P-F:blue", "P-D:blue");
  }
  return fig({ pts, hide: [...c.hide, "u", "v"], lines, rights: P ? ["P-D-v"] : [] });
};

const ellipseFig = (a: number, b: number, t: number) => {
  const c = Math.sqrt(a * a - b * b);
  const e = curve("e", ellipse(a, b));
  const P: Pt = [a * Math.cos(t), b * Math.sin(t)];
  return fig({ pts: { ...e.pts, F: [-c, 0], G: [c, 0], P }, hide: e.hide, lines: [...e.lines, "P-F:blue", "P-G:blue"], nudge: { F: [0, 12], G: [0, 12] } });
};

const rotationFig = (P: Pt, deg: number, box: [number, number, number, number]) => {
  const O: Pt = [0, 0], Q = polar(O, Math.hypot(...P), (Math.atan2(P[1], P[0]) * 180) / Math.PI + deg);
  const ax = axes(...box);
  return fig({ pts: { O, P, Q, ...ax.pts }, hide: ["O", ...ax.hide], lines: [...ax.lines, "O-P:blue", "O-Q:rose"], texts: [...ax.texts, { at: angleAt(O, P, Q, Math.hypot(...P) * 0.3), text: `${deg}°` }], nudge: { Q: [-4, 0] } });
};

const menelausFig = (A: Pt, B: Pt, C: Pt, D: Pt, E: Pt, F: Pt, texts: Text[] = []) =>
  fig({ pts: { A, B, C, D, E, F }, shapes: ["A-B-C"], lines: ["A-B", "B-C", "C-A", "C-D", "B-F", "A-F", "A-E", "C-E", "F-D:blue", "E-D:blue", "E-F:blue"], texts });

const rightAlt = (p: number, q: number, texts: Text[]) => {
  const h = Math.sqrt(p * q);
  const A: Pt = [0, 0], B: Pt = [p + q, 0], C: Pt = [p, h], H: Pt = [p, 0];
  return fig({ pts: { A, B, C, H }, hide: ["H"], shapes: ["A-B-C"], lines: ["A-B", "B-C", "C-A", "C-H:blue"], rights: ["A-C-B", "C-H-B"], texts });
};

const britishFig = (x: number, y: number, w: number, h: number, texts: Text[]) => {
  const A: Pt = [0, 0], B: Pt = [w, 0], C: Pt = [w, h], D: Pt = [0, h], P: Pt = [x, y];
  return fig({ pts: { A, B, C, D, P }, shapes: ["A-B-C-D"], lines: ["A-B", "B-C", "C-D", "D-A", "P-A:blue", "P-C:blue", "P-B:rose", "P-D:rose"], texts, nudge: { P: [10, 6] } });
};

const pyramidFrustum = (s1: number, s2: number, h: number, labels: boolean) => {
  const sq = (s: number, z: number): Pt[] => [[-s / 2, -s / 2, z], [s / 2, -s / 2, z], [s / 2, s / 2, z], [-s / 2, s / 2, z]].map((p) => proj(p as [number, number, number]));
  const [a, b, c, d] = sq(s1, 0), [e, f, g, k] = sq(s2, h);
  const pts = { a, b, c, d, e, f, g, k };
  return fig({ pts, hide: Object.keys(pts), lines: ["a-b", "b-c", "c-d:dashed", "d-a:dashed", "e-f", "f-g", "g-k", "k-e", "a-e", "b-f", "c-g", "d-k:dashed"], texts: labels ? [{ on: "a-b", text: `${s1}` }, { on: "e-f", text: `${s2}` }] : [] });
};

const tetraFig = () => {
  const s = 4, hgt = s * Math.sqrt(2 / 3);
  const base: [number, number, number][] = [[0, 0, 0], [s, 0, 0], [s / 2, (s * Math.sqrt(3)) / 2, 0]];
  const cen: [number, number, number] = [s / 2, (s * Math.sqrt(3)) / 6, 0];
  const [A, B, C] = base.map(proj), D = proj([cen[0], cen[1], hgt]), M = proj(cen);
  return fig({ pts: { A, B, C, D, M }, hide: ["M"], lines: ["A-B", "B-C", "C-A:dashed", "D-A", "D-B", "D-C", "D-M:blue"], texts: [{ on: "D-M", text: "h" }, { on: "A-B", text: "s" }] });
};

const tri131415 = triangle(14, 15, 13);

export const FORMULA_FIGURES: Record<string, Figure> = {
  ...TRIG_FORMULA_FIGURES,
  shoelace: onAxes([[0, 0], [4, 0], [5, 3], [1, 4]], [-0.6, 6, -0.6, 4.8]),
  "inscribed-angle": inscribed({ A: 215, B: 325, C: 100 }),
  heron: tri(6, 5, 4, ["a", "b", "c"]),
  brahmagupta: quadFig(cyclicQuad([3, 4, 5, 6]), ["a", "b", "c", "d"]),
  "angle-bisector": bisector(6, 5, 4, [{ on: "A-B", text: "c" }, { on: "C-A", text: "b" }]),
  "power-of-a-point": (() => {
    const circle = { c: [0, 0] as Pt, r: 2 }, P: Pt = [5, 1.2];
    const [A, B] = lineCircle(P, [-2, -0.6], circle);
    const T = tangentPoints(P, circle)[0];
    return fig({ pts: { P, A, B, T }, circles: [circle], lines: ["P-B:blue", "P-T:rose"] });
  })(),
  stewart: cevianFig(7, 5.6, 4.6, 2.8, [{ on: "B-D", text: "m" }, { on: "D-C", text: "n" }, { on: "C-A", text: "b" }, { on: "A-B", text: "c" }, { on: "A-D", text: "d" }]),
  ptolemy: quadFig(cyclicQuad([3, 4.4, 3.6, 5.2]), ["a", "b", "c", "d"], true),
  "inradius-circumradius": tri(6, 5, 4.4, null, ({ A, B, C }) => ({ circles: [incircle(A, B, C), circumcircle(A, B, C)] })),
  picks: (() => {
    const dots: Pt[] = [];
    for (let x = 0; x <= 6; x++) for (let y = 0; y <= 4; y++) dots.push([x, y]);
    const [A, B, C, D, E]: Pt[] = [[0, 0], [5, 1], [6, 4], [2, 4], [0, 3]];
    return fig({ pts: { A, B, C, D, E }, hide: ["A", "B", "C", "D", "E"], shapes: ["A-B-C-D-E"], lines: ["A-B", "B-C", "C-D", "D-E", "E-A"], dots });
  })(),
  "point-line-distance": (() => {
    const u: Pt = [-1, 2.75], v: Pt = [5, -1.75], P: Pt = [3.2, 2.6], F = foot(P, u, v);
    const ax = axes(-1.2, 5.2, -1.9, 3.4);
    return fig({ pts: { P, F, u, v, ...ax.pts }, hide: ["F", "u", "v", ...ax.hide], lines: [...ax.lines, "u-v:blue", "P-F:dashed"], rights: ["P-F-v"], texts: [...ax.texts, { on: "P-F", text: "d" }] });
  })(),
  "median-length": tri(6, 5, 4.2, ["a", "b", "c"], ({ B, C }) => ({ pts: { M: mid(B, C) }, lines: ["A-M:blue"], nudge: { M: [16, 0] } })),
  "tangent-length": tangentFig(5, 2, [{ on: "O-T", text: "r" }, { on: "O-P", text: "d" }]),
  "euler-polyhedron": (() => {
    const v = (x: number, y: number, z: number) => proj([x * 3, y * 3, z * 3]);
    const pts = { a: v(0, 0, 0), b: v(1, 0, 0), c: v(1, 1, 0), d: v(0, 1, 0), e: v(0, 0, 1), f: v(1, 0, 1), g: v(1, 1, 1), h: v(0, 1, 1) };
    return fig({ pts, hide: Object.keys(pts), shapes: ["a-b-f-e"], lines: ["a-b", "b-c", "c-d:dashed", "d-a:dashed", "e-f", "f-g", "g-h", "h-e", "a-e", "b-f", "c-g", "d-h:dashed"] });
  })(),
  centroid: tri(6, 5.4, 4.6, null, ({ A, B, C }) => {
    const G: Pt = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
    return { pts: { G, x: mid(B, C), y: mid(C, A), z: mid(A, B) }, hide: ["x", "y", "z"], lines: ["A-x:blue", "B-y:blue", "C-z:blue"] };
  }),
  ceva: cevaFig(0.45, 0.55, []),
  parabola: parabolaFig(1, [2.6, 2.6 ** 2 / 4]),
  ellipse: ellipseFig(5, 3, 1.1),
  hyperbola: (() => {
    const a = 2, b = 1.5, c = Math.hypot(a, b);
    const br = (s: number) => curve(s > 0 ? "r" : "l", Array.from({ length: 31 }, (_, i) => {
      const t = -1.5 + i * 0.1;
      return [s * a * Math.cosh(t), b * Math.sinh(t)] as Pt;
    }));
    const r = br(1), l = br(-1), y = b * Math.sinh(1.5), x = (a / b) * y;
    return fig({ pts: { ...r.pts, ...l.pts, F: [-c, 0], G: [c, 0], u: [-x, -y], v: [x, y], w: [-x, y], z: [x, -y] }, hide: [...r.hide, ...l.hide, "u", "v", "w", "z"], lines: [...r.lines, ...l.lines, "u-v:dashed", "w-z:dashed"], nudge: { F: [0, 12], G: [0, 12] } });
  })(),
  rotation: rotationFig([3.6, 1.4], 55, [-0.8, 4.2, -0.6, 4.2]),
  "bisector-length": bisector(6, 4.6, 4, [{ on: "D-C", text: "a" }, { on: "C-A", text: "b" }, { on: "A-B", text: "c" }, { on: "A-D", text: "tₐ" }]),
  menelaus: (() => {
    const { A, B, C } = triangle(5, 5, 4.4);
    const F = along(A, B, 0.55), D = along(B, C, 1.5);
    return menelausFig(A, B, C, D, meet(F, D, C, A), F);
  })(),
  "right-triangle-altitude": rightAlt(2, 4.5, [{ on: "C-H", text: "h" }, { at: [1, -0.45], text: "p" }, { at: [4.25, -0.45], text: "q" }]),
  "right-triangle-radii": (() => {
    const A: Pt = [0, 3], B: Pt = [4, 0], C: Pt = [0, 0];
    return fig({ pts: { A, B, C }, shapes: ["A-B-C"], circles: [incircle(A, B, C), { c: mid(A, B), r: 2.5, dashed: true }], lines: ["A-B", "B-C", "C-A"], rights: ["A-C-B"] });
  })(),
  "euler-oi": (() => {
    const { A, B, C } = triangle(6, 5.2, 4);
    const o = circumcircle(A, B, C), i = incircle(A, B, C);
    return fig({ pts: { A, B, C, O: o.c, I: i.c }, circles: [o, i], lines: ["A-B", "B-C", "C-A", "O-I:blue"], nudge: { O: [8, -10], I: [-10, 4] } });
  })(),
  "circle-angles": (() => {
    const O: Pt = [0, 0];
    const A = polar(O, 1, 200), C = polar(O, 1, 270), B = polar(O, 1, 10), D = polar(O, 1, 120);
    const P = meet(A, B, C, D);
    return fig({ pts: { A, B, C, D, P }, circles: [{ c: O, r: 1 }], lines: ["A-B", "C-D"], texts: [{ at: polar(O, 1.22, 235), text: "x" }, { at: polar(O, 1.22, 65), text: "y" }] });
  })(),
  "cyclic-quadrilateral": quadFig(cyclicQuad([3.4, 2.6, 4, 4.4]), ["", "", "", ""]),
  "british-flag": britishFig(2, 1.4, 6, 4, [{ on: "P-A", text: "a" }, { on: "P-B", text: "b" }, { on: "P-C", text: "c" }, { on: "P-D", text: "d" }]),
  frustum: pyramidFrustum(4, 2, 3, false),
  tetrahedron: tetraFig(),
  pappus: (() => {
    const u: Pt = [0, -2.2], v: Pt = [0, 2.2], G: Pt = [3, 0];
    const blob = curve("b", ellipse(1.1, 1.5, G));
    return fig({ pts: { ...blob.pts, u, v, G, H: [0, 0] }, hide: [...blob.hide, "u", "v", "H"], shapes: [blob.names.join("-")], lines: [...blob.lines, "u-v:dashed", "H-G:blue"], texts: [{ on: "H-G", text: "d" }, { at: [3, 0.6], text: "A" }] });
  })(),
};

export const PROBLEM_FIGURES: Record<string, Figure> = {
  ...TRIG_PROBLEM_FIGURES,
  sh1: onAxes([[1, 1], [5, 2], [3, 6]], [-0.6, 6, -0.6, 6.6]),
  sh2: FORMULA_FIGURES.shoelace,
  ia1: inscribed({ A: 215, B: 325, C: 100 }),
  ia2: (() => {
    const O: Pt = [0, 0];
    const A = polar(O, 1, 90), B = polar(O, 1, 200), C = polar(O, 1, 270), D = polar(O, 1, 340);
    return fig({ pts: { A, B, C, D }, shapes: ["A-B-C-D"], circles: [{ c: O, r: 1 }], lines: ["A-B", "B-C", "C-D", "D-A"], texts: [{ at: angleAt(A, B, D, 0.42), text: "70°" }] });
  })(),
  he1: tri(14, 15, 13, ["14", "15", "13"]),
  he2: tri(6, 5, 5, ["6", "5", "5"]),
  he3: tri(14, 15, 13, ["14", "15", "13"], ({ A, B, C }) => ({ circles: [incircle(A, B, C)] })),
  br1: quadFig(cyclicQuad([25, 39, 52, 60]), ["25", "39", "52", "60"]),
  br2: quadFig(cyclicQuad([2, 3, 4, 5]), ["2", "3", "4", "5"]),
  ab1: bisector(10, 9, 6, [{ on: "A-B", text: "6" }, { on: "C-A", text: "9" }, { on: "B-C", text: "10" }]),
  ab2: bisector(6, 7, 5, [{ on: "A-B", text: "5" }, { on: "C-A", text: "7" }, { on: "B-D", text: "2.5" }]),
  pp1: (() => {
    const P: Pt = [0, 0], A: Pt = [-4, 0], B: Pt = [6, 0], C = polar(P, 3, 250), D = polar(P, 8, 70);
    return fig({ pts: { A, B, C, D, P }, circles: [circumcircle(A, B, C)], lines: ["A-B", "C-D"], texts: [{ on: "P-A", text: "4" }, { on: "P-B", text: "6" }, { on: "P-C", text: "3" }], nudge: { P: [12, 6] } });
  })(),
  pp2: (() => {
    const P: Pt = [0, 0], A: Pt = [4, 0], B: Pt = [9, 0];
    const circle = circumcircle(A, B, [6.5, 3 + Math.hypot(2.5, 3)]);
    const T = tangentPoints(P, circle).sort((p, q) => q[1] - p[1])[0];
    return fig({ pts: { P, A, B, T }, circles: [circle], lines: ["P-B:blue", "P-T:rose"], texts: [{ on: "P-T", text: "6" }, { on: "P-A", text: "4" }] });
  })(),
  st1: cevianFig(8, 7, 5, 5, [{ on: "A-B", text: "5" }, { on: "C-A", text: "7" }, { on: "B-D", text: "5" }]),
  st2: cevianFig(8, 7, 9, 4, [{ on: "A-B", text: "9" }, { on: "C-A", text: "7" }, { on: "B-C", text: "8" }]),
  pt1: (() => {
    const O: Pt = [0, 0];
    const [A, B, C, D, E] = [90, 162, 234, 306, 18].map((t) => polar(O, 1, t));
    return fig({ pts: { A, B, C, D, E }, shapes: ["A-B-C-D-E"], lines: ["A-B", "B-C", "C-D", "D-E", "E-A", "A-C:blue"], texts: [{ on: "A-B", text: "1" }] });
  })(),
  pt2: (() => {
    const R = 7 / Math.sqrt(3), O: Pt = [0, 0];
    const A = polar(O, R, 90), B = polar(O, R, 210), C = polar(O, R, 330);
    const P = polar(O, R, 210 + (2 * Math.asin(3 / (2 * R)) * 180) / Math.PI);
    return fig({ pts: { A, B, C, P }, circles: [{ c: O, r: R }], lines: ["A-B", "B-C", "C-A", "P-B:blue", "P-C:blue", "P-A:dashed"], texts: [{ on: "P-B", text: "3" }, { on: "P-C", text: "5" }] });
  })(),
  ir1: tri(14, 15, 13, ["14", "15", "13"], ({ A, B, C }) => ({ circles: [circumcircle(A, B, C)] })),
  ir2: (() => {
    const A: Pt = [0, 6], B: Pt = [8, 0], C: Pt = [0, 0];
    return fig({ pts: { A, B, C }, shapes: ["A-B-C"], circles: [incircle(A, B, C)], lines: ["A-B", "B-C", "C-A"], rights: ["A-C-B"], texts: [{ on: "C-A", text: "6" }, { on: "B-C", text: "8" }] });
  })(),
  pk2: (() => {
    const dots: Pt[] = [];
    for (let x = 0; x <= 6; x++) for (let y = 0; y <= 4; y++) dots.push([x, y]);
    return fig({ pts: { A: [0, 0], B: [6, 0], C: [0, 4] }, shapes: ["A-B-C"], lines: ["A-B", "B-C", "C-A"], dots });
  })(),
  pld1: (() => {
    const u: Pt = [-1, 1], v: Pt = [3, -2], P: Pt = [1, 2], F = foot(P, u, v);
    const ax = axes(-1.4, 3.4, -2.3, 2.6);
    return fig({ pts: { P, F, u, v, ...ax.pts }, hide: ["F", "u", "v", ...ax.hide], lines: [...ax.lines, "u-v:blue", "P-F:dashed"], rights: ["P-F-v"], texts: ax.texts });
  })(),
  pld2: (() => {
    const a: Pt = [-1, 2], b: Pt = [3, -1], c: Pt = [0, 5], d: Pt = [6, 0.5];
    const ax = axes(-1.4, 6.4, -1.4, 5.4);
    return fig({ pts: { a, b, c, d, ...ax.pts }, hide: ["a", "b", "c", "d", ...ax.hide], lines: [...ax.lines, "a-b:blue", "c-d:blue"], texts: ax.texts });
  })(),
  ml1: tri(14, 15, 13, ["14", "15", "13"], ({ B, C }) => ({ pts: { M: mid(B, C) }, lines: ["A-M:blue"], nudge: { M: [16, 0] } })),
  ml2: tri(6, 5, 5, ["6", "5", "5"], ({ B, C }) => ({ pts: { M: mid(B, C) }, lines: ["A-M:blue"], nudge: { M: [16, 0] } })),
  tl1: tangentFig(13, 5, [{ on: "O-T", text: "5" }, { on: "O-P", text: "13" }]),
  tl2: tri(8, 9, 7, ["8", "9", "7"], ({ A, B, C }) => {
    const i = incircle(A, B, C);
    return { pts: { T: foot(i.c, A, B) }, circles: [i], lines: ["A-T:blue"] };
  }),
  cn1: onAxes([[0, 0], [6, 0], [3, 9]], [-0.8, 7, -0.8, 9.6]),
  cn2: tri(6, 5.4, 4.6, null, ({ A, B, C }) => {
    const M = mid(B, C), G: Pt = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
    return { pts: { M, G }, lines: ["A-M:blue"], texts: [{ on: "A-M", text: "12" }], nudge: { G: [12, 4] } };
  }),
  cv1: cevaFig(2 / 3, 3 / 4, []),
  cv2: cevaFig(1 / 2, 1 / 3, []),
  "x-pb2": parabolaFig(1, [6, 9]),
  "x-el2": ellipseFig(6, Math.sqrt(20), 1.0),
  "x-ro1": rotationFig([3, 4], 90, [-4.6, 3.6, -0.6, 4.6]),
  "x-ro2": rotationFig([2, 0], 60, [-0.6, 2.6, -0.6, 2.2]),
  "x-bl1": bisector(7, 3, 6, [{ on: "A-B", text: "6" }, { on: "C-A", text: "3" }, { on: "B-C", text: "7" }]),
  "x-bl2": bisector(7, 3, 5, [{ on: "A-B", text: "5" }, { on: "C-A", text: "3" }, { on: "B-C", text: "7" }]),
  "x-me1": (() => {
    const { A, B, C } = triangle(5, 5, 4.4);
    const F = along(A, B, 2 / 3), D = along(B, C, 1.5);
    return menelausFig(A, B, C, D, meet(F, D, C, A), F);
  })(),
  "x-me2": (() => {
    const { A, B, C } = triangle(5, 5, 4.4);
    const D = mid(B, C), E = along(C, A, 1 / 3), F = meet(D, E, A, B);
    return menelausFig(A, B, C, D, E, F);
  })(),
  "x-ra1": rightAlt(3.6, 6.4, [{ at: [1.4, 3.4], text: "6" }, { at: [8, 2.8], text: "8" }]),
  "x-ra2": rightAlt(4, 9, [{ at: [2, -0.7], text: "4" }, { at: [8.5, -0.7], text: "9" }]),
  "x-rt1": (() => {
    const A: Pt = [0, 5], B: Pt = [12, 0], C: Pt = [0, 0];
    return fig({ pts: { A, B, C }, shapes: ["A-B-C"], circles: [incircle(A, B, C)], lines: ["A-B", "B-C", "C-A"], rights: ["A-C-B"], texts: [{ on: "C-A", text: "5" }, { on: "B-C", text: "12" }, { on: "A-B", text: "13" }] });
  })(),
  "x-rt2": (() => {
    const A: Pt = [0, 7], B: Pt = [24, 0], C: Pt = [0, 0];
    return fig({ pts: { A, B, C }, shapes: ["A-B-C"], circles: [{ c: mid(A, B), r: 12.5, dashed: true }], lines: ["A-B", "B-C", "C-A"], rights: ["A-C-B"], texts: [{ on: "C-A", text: "7" }, { on: "B-C", text: "24" }] });
  })(),
  "x-cag1": (() => {
    const O: Pt = [0, 0];
    const A = polar(O, 1, 0), C = polar(O, 1, 70), B = polar(O, 1, 160), D = polar(O, 1, 270);
    const P = meet(A, B, C, D);
    return fig({ pts: { A, B, C, D, P }, circles: [{ c: O, r: 1 }], lines: ["A-B", "C-D"], texts: [{ at: polar(O, 1.25, 35), text: "70°" }, { at: polar(O, 1.25, 215), text: "110°" }], nudge: { P: [0, -12] } });
  })(),
  "x-cag2": (() => {
    const O: Pt = [0, 0];
    const N1 = polar(O, 1, 160), F1 = polar(O, 1, 70), N2 = polar(O, 1, 200), F2 = polar(O, 1, 290);
    const P = meet(N1, F1, N2, F2);
    return fig({ pts: { P, A: N1, B: F1, C: N2, D: F2 }, hide: ["A", "B", "C", "D"], circles: [{ c: O, r: 1 }], lines: ["P-B", "P-D"], texts: [{ at: polar(O, 0.75, 0), text: "140°" }, { at: polar(O, 1.25, 180), text: "40°" }] });
  })(),
  "x-cq1": (() => {
    const O: Pt = [0, 0];
    const [A, B, C, D] = [90, 135, 270, 45].map((t) => polar(O, 1, t));
    return fig({ pts: { A, B, C, D }, shapes: ["A-B-C-D"], circles: [{ c: O, r: 1 }], lines: ["A-B", "B-C", "C-D", "D-A"] });
  })(),
  "x-bf1": britishFig(Math.sqrt(9 - 2.25), 1.5, Math.sqrt(9 - 2.25) + Math.sqrt(16 - 2.25), 1.5 + Math.sqrt(11.25), [{ on: "P-A", text: "3" }, { on: "P-B", text: "4" }, { on: "P-C", text: "5" }]),
  "x-bf2": britishFig(Math.sqrt(3), 1, Math.sqrt(3) + Math.sqrt(24), 1 + Math.sqrt(13), [{ on: "P-A", text: "2" }, { on: "P-B", text: "5" }, { on: "P-D", text: "4" }]),
  "x-fr1": pyramidFrustum(4, 2, 3, true),
  "x-fr2": (() => {
    const bot = curve("b", ellipse(2, 0.55, [0, 0])), top = curve("t", ellipse(1, 0.28, [0, 3]));
    return fig({ pts: { ...bot.pts, ...top.pts, l: [-2, 0], r: [2, 0], L: [-1, 3], R: [1, 3], o: [0, 0], O: [0, 3] }, hide: [...bot.hide, ...top.hide, "l", "r", "L", "R", "o", "O"], lines: [...bot.lines, ...top.lines, "l-L", "r-R", "o-r:blue", "O-R:blue", "o-O:dashed"], texts: [{ on: "o-r", text: "2" }, { on: "O-R", text: "1" }, { on: "o-O", text: "3" }] });
  })(),
  "x-te1": tetraFig(),
  "x-te2": tetraFig(),
  "x-pa1": (() => {
    const u: Pt = [0, -1.8], v: Pt = [0, 1.8], G: Pt = [3, 0];
    return fig({ pts: { u, v, G, H: [0, 0] }, hide: ["u", "v", "H"], circles: [{ c: G, r: 1 }], lines: ["u-v:dashed", "H-G:blue"], texts: [{ on: "H-G", text: "3" }] });
  })(),
  "x-pa2": onAxes([[1, 0], [3, 0], [3, 2], [1, 2]], [-1, 3.8, -0.8, 2.8]),
};

