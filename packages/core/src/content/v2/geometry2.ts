import { defineTopic, int, pos, type VarRange } from "../types";
import {
  angleAt, arc, circleMeet, circumcircle, curve, dist, fig, foot, incircle, mid, orthocenter, polar, reflect, tangentPoints, triangle,
  type Pt,
} from "../fig";

const ang: VarRange = [0.3, 2.5];

// ---- Shared constructions -------------------------------------------------

/** x and y axes through the origin, as hidden end points and two lines. */
const axes = (x0: number, x1: number, y0: number, y1: number) => ({
  pts: { ax0: [x0, 0] as Pt, ax1: [x1, 0] as Pt, ay0: [0, y0] as Pt, ay1: [0, y1] as Pt },
  hide: ["ax0", "ax1", "ay0", "ay1"],
  lines: ["ax0-ax1", "ay0-ay1"],
  texts: [{ at: [x1, -0.06 * (y1 - y0)] as Pt, text: "x" }, { at: [0.06 * (x1 - x0), y1] as Pt, text: "y" }],
});

/** A simple oblique view of 3D points: x right, z up, y going back and up. */
const proj = ([x, y, z]: [number, number, number]): Pt => [x + 0.45 * y, z + 0.32 * y];

export const quadDiag = (p1: number, p2: number, q1: number, q2: number, deg: number, texts: { at: Pt; text: string }[] = [], right = false) => {
  const X: Pt = [0, 0];
  const A = polar(X, p1, 180), C = polar(X, p2, 0), B = polar(X, q1, 180 + deg), D = polar(X, q2, deg);
  return fig({ pts: { A, B, C, D, X }, hide: ["X"], shapes: ["A-B-C-D"], lines: ["A-B", "B-C", "C-D", "D-A", "A-C:blue", "B-D:blue"], rights: right ? ["C-X-D"] : [], texts });
};

const sameHeight = (bd: number, extra?: "median") => {
  const { A, B, C } = triangle(7, 5.4, 4.6);
  const D: Pt = [7 * bd, 0], H = foot(A, B, C);
  if (extra === "median") {
    const E = mid(A, D);
    return fig({ pts: { A, B, C, D, E }, shapes: ["B-E-D"], lines: ["A-B", "B-C", "C-A", "A-D", "B-E"] });
  }
  return fig({ pts: { A, B, C, D, H }, hide: ["H"], shapes: ["A-B-D"], lines: ["A-B", "B-C", "C-A", "A-D", "A-H:dashed"], rights: ["A-H-C"], texts: [{ on: "B-D", text: "2" }, { on: "D-C", text: "3" }] });
};

export const ngon = (n: number) => {
  const O: Pt = [0, 0];
  const vs = Array.from({ length: n }, (_, i) => polar(O, 1, 90 + (360 * i) / n));
  const pts: Record<string, Pt> = { O };
  vs.forEach((v, i) => (pts[`v${i}`] = v));
  const names = vs.map((_, i) => `v${i}`);
  return fig({
    pts,
    hide: names,
    shapes: [`O-${names[0]}-${names[1]}`],
    lines: [...names.map((nm, i) => `${nm}-${names[(i + 1) % n]}`), `O-${names[0]}:blue`, `O-${names[1]}`],
    texts: [{ on: `O-${names[0]}`, text: "R" }],
  });
};

export const tangentsFig = (r1: number, r2: number, d: number, labels: boolean) => {
  const P: Pt = [0, 0], Q: Pt = [d, 0];
  const e = (Math.acos((r1 - r2) / d) * 180) / Math.PI, i = (Math.acos((r1 + r2) / d) * 180) / Math.PI;
  const pts = { P, Q, a: polar(P, r1, e), b: polar(Q, r2, e), c: polar(P, r1, -i), f: polar(Q, r2, 180 - i) };
  return fig({
    pts,
    hide: ["a", "b", "c", "f"],
    circles: [{ c: P, r: r1 }, { c: Q, r: r2 }],
    lines: ["a-b:blue", "c-f:rose", "P-Q:dashed"],
    texts: labels ? [{ at: [d / 2, -r1 * 0.45], text: `${d}` }] : [],
    nudge: { P: [0, 12], Q: [0, 12] },
  });
};

export const chordFig = (r: number, d: number, texts: (k: string) => { on: string; text: string }[]) => {
  const O: Pt = [0, 0], M: Pt = [0, -d];
  const h = Math.sqrt(r * r - d * d);
  const A: Pt = [-h, -d], B: Pt = [h, -d];
  return fig({ pts: { O, A, B, M }, hide: ["M"], circles: [{ c: O, r }], lines: ["A-B:blue", "O-M:dashed", "O-B"], rights: ["O-M-B"], texts: texts("") });
};

export const segmentFig = (r: number, deg: number, texts: { at?: Pt; on?: string; text: string }[]) => {
  const O: Pt = [0, 0];
  const from = -90 - deg / 2, to = -90 + deg / 2;
  const a = curve("s", arc(O, r, from, to));
  return fig({ pts: { O, ...a.pts }, hide: a.hide, circles: [{ c: O, r }], shapes: [a.names.join("-")], lines: [`O-${a.names[0]}`, `O-${a.names[a.names.length - 1]}`, `${a.names[0]}-${a.names[a.names.length - 1]}`], texts });
};

export const capFig = (r: number, h: number, top: boolean, texts: { on?: string; at?: Pt; text: string }[]) => {
  const O: Pt = [0, 0];
  const y = top ? r - h : -(r - h);
  const t = (Math.asin(y / r) * 180) / Math.PI;
  const a = curve("s", top ? arc(O, r, t, 180 - t) : arc(O, r, 180 - t, 360 + t));
  const ends = [a.names[0], a.names[a.names.length - 1]];
  return fig({ pts: { O, ...a.pts, M: [0, y], T: [0, top ? r : -r] }, hide: [...a.hide, "M", "T"], circles: [{ c: O, r }], shapes: [a.names.join("-")], lines: [`${ends[0]}-${ends[1]}`, "M-T:blue", `O-${ends[0]}:dashed`], texts });
};

const ellipsePts = (a: number, b: number, c: Pt = [0, 0]) => Array.from({ length: 61 }, (_, i) => [c[0] + a * Math.cos((i * Math.PI) / 30), c[1] + b * Math.sin((i * Math.PI) / 30)] as Pt);

const spiral = (() => {
  const A: Pt = [0, 0], B: Pt = [2, 0], C: Pt = [3, 3], D: Pt = [3, 5], X: Pt = [2.5, 2.5], S: Pt = [0, 3];
  return fig({ pts: { A, B, C, D, X, S }, circles: [circumcircle(A, B, X), circumcircle(C, D, X)].map((c) => ({ ...c, dashed: true })), lines: ["A-B:blue", "C-D:blue", "A-X", "B-X"], nudge: { X: [12, 0] } });
})();

export const miquelFig = (A: Pt, B: Pt, C: Pt, D: Pt, E: Pt, F: Pt) => {
  const c1 = circumcircle(A, E, F), c2 = circumcircle(B, F, D), c3 = circumcircle(C, D, E);
  const [m1, m2] = circleMeet(c1, c2);
  const M = dist(m1, F) > dist(m2, F) ? m1 : m2;
  return fig({ pts: { A, B, C, D, E, F, M }, circles: [c1, c2, c3].map((c) => ({ ...c, dashed: true })), lines: ["A-B", "B-C", "C-A"], nudge: { M: [10, -6] } });
};

// ---- Formulas -------------------------------------------------------------

/** Geometry added in the second version of the bank: areas, coordinates, vectors, solids and conics. */
export const GEOMETRY_V2B = defineTopic("Geometry", [
  {
    id: "quad-area-diagonals",
    name: "Quadrilateral Area from Diagonals",
    level: "AMC 10",
    statement: "K = \\frac12 pq\\sin\\theta",
    setup: "$p$ and $q$ are the diagonals and $\\theta$ the angle between them. Works for any convex quadrilateral; with perpendicular diagonals it's $\\frac12pq$.",
    whenToUse: "A quadrilateral's diagonals and the angle between them are known.",
    figure: quadDiag(2.2, 3.6, 2.8, 2.4, 55, [{ at: angleAt([0, 0], [1, 0], polar([0, 0], 1, 55), 0.7), text: "θ" }]),
    recall: [{ lhs: "K \\ (\\text{diagonals } p, q \\text{ at angle } x) =", answer: "\\frac12pq\\sin x", vars: { p: pos, q: pos, x: ang } }],
    related: ["area-sine", "bretschneider"],
    problems: [
      { id: "v2g-qd1", text: "A convex quadrilateral has diagonals $8$ and $10$ that meet at a $30^\\circ$ angle. Find its area.", answer: "20", solution: "$\\frac12 \\cdot 8 \\cdot 10 \\cdot \\frac12$.", figure: quadDiag(3, 5, 6, 4, 30, [{ at: angleAt([0, 0], [1, 0], polar([0, 0], 1, 30), 1.3), text: "30°" }]) },
      { id: "v2g-qd2", text: "A quadrilateral has perpendicular diagonals of lengths $6$ and $9$. Find its area.", answer: "27", solution: "$\\frac12 \\cdot 6 \\cdot 9$.", figure: quadDiag(2, 4, 3, 6, 90, [], true) },
    ],
  },
  {
    id: "same-height-areas",
    name: "Triangles with the Same Height",
    level: "AMC 10",
    statement: "\\frac{[ABD]}{[ADC]} = \\frac{BD}{DC}",
    setup: "$D$ is on $BC$. Both triangles have the same height from $A$, so their areas are in the ratio of their bases.",
    whenToUse: "Area ratios with cevians, medians and points dividing sides.",
    figure: sameHeight(0.4),
    recall: [{ lhs: "\\frac{[ABD]}{[ADC]} \\text{ with } BD=m,\\ DC=n:", answer: "\\frac mn", vars: { m: pos, n: pos } }],
    related: ["mass-points", "routh"],
    problems: [
      { id: "v2g-sh1", text: "$D$ is on side $BC$ of triangle $ABC$ with $BD : DC = 2 : 3$, and $[ABC] = 40$. Find $[ABD]$.", answer: "16", solution: "$40 \\cdot \\frac25$.", figure: sameHeight(0.4) },
      { id: "v2g-sh2", text: "Triangle $ABC$ has area $60$. $D$ is the midpoint of $BC$ and $E$ the midpoint of $AD$. Find $[BED]$.", answer: "15", solution: "$[ABD] = 30$, and $E$ halves it.", figure: sameHeight(0.5, "median") },
    ],
  },
  {
    id: "regular-ngon-area",
    name: "Area of a Regular Polygon",
    level: "AMC 12",
    statement: "K = \\frac12 nR^2\\sin\\frac{2\\pi}{n} = \\frac12 \\cdot \\text{perimeter} \\cdot \\text{apothem}",
    setup: "$R$ is the distance from the center to a vertex. The polygon splits into $n$ triangles with two sides $R$ and angle $\\frac{360^\\circ}{n}$.",
    whenToUse: "Areas of regular octagons, dodecagons and other regular polygons.",
    figure: ngon(8),
    recall: [{ lhs: "\\text{Area of a regular } n\\text{-gon with circumradius } R:", answer: "\\frac12nR^2\\sin\\frac{2\\pi}{n}", vars: { n: int(3, 12), R: pos } }],
    related: ["area-sine", "isoperimetric"],
    problems: [
      { id: "v2g-ng1", text: "A regular octagon is inscribed in a circle of radius $1$. Find its area.", answer: "2\\sqrt2", solution: "$\\frac12 \\cdot 8 \\cdot \\sin 45^\\circ$." },
      { id: "v2g-ng2", text: "A regular dodecagon ($12$ sides) is inscribed in a circle of radius $1$. Find its area.", answer: "3", solution: "$\\frac12 \\cdot 12 \\cdot \\sin 30^\\circ$." },
    ],
  },
  {
    id: "common-tangents",
    name: "Common Tangent Lengths",
    level: "AMC 12",
    statement: "\\text{external} = \\sqrt{d^2 - (r_1 - r_2)^2}, \\qquad \\text{internal} = \\sqrt{d^2 - (r_1 + r_2)^2}",
    setup: "Two circles with radii $r_1$, $r_2$ and centers $d$ apart. The length is between the two touch points.",
    whenToUse: "Belts around pulleys, or tangent segments shared by two circles.",
    figure: tangentsFig(1.4, 2.4, 5.2, false),
    recall: [
      { lhs: "\\text{External tangent length (radii } a, b\\text{, centers } d \\text{ apart):}", answer: "\\sqrt{d^2-(a-b)^2}", vars: { a: pos, b: pos, d: [12, 15] } },
      { lhs: "\\text{Internal tangent length (radii } a, b\\text{, centers } d \\text{ apart):}", answer: "\\sqrt{d^2-(a+b)^2}", vars: { a: pos, b: pos, d: [12, 15] } },
    ],
    related: ["tangent-length", "homothety"],
    problems: [
      { id: "v2g-ct1", text: "Circles of radius $3$ and $8$ have centers $13$ apart. Find the length of a common external tangent.", answer: "12", solution: "$\\sqrt{169 - 25}$.", figure: tangentsFig(3, 8, 13, true) },
      { id: "v2g-ct2", text: "For the same circles, find the length of a common internal tangent.", answer: "4\\sqrt3", solution: "$\\sqrt{169 - 121}$." },
    ],
  },
  {
    id: "chord-length",
    name: "Chord Length",
    level: "AMC 10",
    statement: "\\text{chord} = 2\\sqrt{r^2 - d^2}",
    setup: "$d$ is the distance from the center to the chord. The perpendicular from the center bisects the chord.",
    whenToUse: "Chords at a known distance from the center, or the reverse.",
    figure: chordFig(5, 3, () => [{ on: "O-B", text: "r" }, { on: "O-M", text: "d" }]),
    recall: [{ lhs: "\\text{Chord at distance } d \\text{ from the center:}", answer: "2\\sqrt{r^2-d^2}", vars: { r: [5, 9], d: [0, 4] } }],
    related: ["power-of-a-point", "tangent-length"],
    problems: [
      { id: "v2g-cl1", text: "A chord of a circle with radius $10$ is $6$ from the center. How long is the chord?", answer: "16", solution: "$2\\sqrt{100 - 36}$.", figure: chordFig(10, 6, () => [{ on: "O-B", text: "10" }, { on: "O-M", text: "6" }]) },
      { id: "v2g-cl2", text: "A chord of length $24$ is in a circle of radius $13$. How far is it from the center?", answer: "5", solution: "$\\sqrt{169 - 144}$.", figure: chordFig(13, 5, () => [{ on: "O-B", text: "13" }]) },
    ],
  },
  {
    id: "segment-area",
    name: "Area of a Circular Segment",
    level: "AMC 12",
    statement: "\\text{segment} = \\frac12 r^2(\\theta - \\sin\\theta)",
    setup: "The region between a chord and its arc, where the chord subtends angle $\\theta$ (in radians) at the center. Sector minus triangle.",
    whenToUse: "Areas cut off by a chord, or overlaps of circles.",
    figure: segmentFig(2, 110, [{ at: [0, -0.5], text: "θ" }]),
    recall: [{ lhs: "\\text{Segment area, central angle } x \\text{ radians:}", answer: "\\frac12r^2(x-\\sin x)", vars: { r: pos, x: [0.2, 3] } }],
    related: ["chord-length", "area-sine"],
    problems: [
      { id: "v2g-sa1", text: "A chord of a circle with radius $6$ subtends a right angle at the center. Find the area between the chord and the shorter arc.", answer: "9\\pi-18", solution: "$\\frac12 \\cdot 36\\left(\\frac\\pi2 - 1\\right)$.", figure: segmentFig(6, 90, [{ at: [0, -1.5], text: "90°" }, { on: "O-s0", text: "6" }]) },
      { id: "v2g-sa2", text: "A chord of a circle with radius $2$ subtends $60^\\circ$ at the center. Find the area between the chord and the shorter arc.", answer: "\\frac{2\\pi}{3}-\\sqrt3", solution: "$\\frac12 \\cdot 4\\left(\\frac\\pi3 - \\frac{\\sqrt3}{2}\\right)$.", figure: segmentFig(2, 60, [{ at: [0, -0.6], text: "60°" }, { on: "O-s0", text: "2" }]) },
    ],
  },
  {
    id: "circle-tangent-line",
    name: "Tangent Line to a Circle",
    level: "AMC 12",
    statement: "\\text{At } (x_0, y_0) \\text{ on } x^2 + y^2 = r^2: \\quad x_0x + y_0y = r^2",
    setup: "For a circle centered at $(a, b)$: $(x_0 - a)(x - a) + (y_0 - b)(y - b) = r^2$. The tangent is perpendicular to the radius.",
    whenToUse: "The equation, slope or intercepts of a tangent line at a given point.",
    figure: (() => {
      const P: Pt = [3, 4], O: Pt = [0, 0], u: Pt = [-1, 7], v: Pt = [7, 1];
      const ax = axes(-6, 7.5, -6, 7.5);
      return fig({ pts: { O, P, u, v, ...ax.pts }, hide: ["u", "v", ...ax.hide], circles: [{ c: O, r: 5 }], lines: [...ax.lines, "u-v:blue", "O-P"], rights: ["O-P-v"], texts: ax.texts, nudge: { O: [-8, 10] } });
    })(),
    recall: [{ lhs: "\\text{Slope of the tangent to } x^2+y^2=r^2 \\text{ at } (p,q):", answer: "-\\frac pq", vars: { p: pos, q: pos } }],
    related: ["point-line-distance", "coordinate-power"],
    problems: [
      { id: "v2g-tl1", text: "Find the $y$-intercept of the tangent line to $x^2 + y^2 = 25$ at $(3, 4)$.", answer: "\\frac{25}{4}", solution: "$3x + 4y = 25$." },
      { id: "v2g-tl2", text: "Find the $x$-intercept of the tangent line to $(x - 1)^2 + (y - 2)^2 = 13$ at $(3, 5)$.", answer: "\\frac{21}{2}", solution: "$2(x - 1) + 3(y - 2) = 13$, so $2x + 3y = 21$." },
    ],
  },
  {
    id: "coordinate-power",
    name: "Power of a Point in Coordinates",
    level: "AIME",
    statement: "\\text{power of } (x_0, y_0) = x_0^2 + y_0^2 + Dx_0 + Ey_0 + F",
    setup: "For the circle $x^2 + y^2 + Dx + Ey + F = 0$, plug the point into the left side. It equals $d^2 - r^2$: the tangent length squared from outside, or $PA \\cdot PB$ for any line through the point.",
    whenToUse: "Tangent lengths or secant products from a point to a circle given by an equation.",
    figure: (() => {
      const c = { c: [1, -2] as Pt, r: 3 }, P: Pt = [7, 1];
      const ax = axes(-2.5, 8, -5.5, 2.5);
      const T = tangentPoints(P, c)[0];
      return fig({ pts: { P, T, C: c.c, ...ax.pts }, hide: ax.hide, circles: [c], lines: [...ax.lines, "P-T:blue", "C-T:dashed"], rights: ["C-T-P"], texts: ax.texts });
    })(),
    recall: [{ lhs: "\\text{Power of } (p,q) \\text{ to } x^2+y^2+ax+by+c=0:", answer: "p^2+q^2+ap+bq+c", vars: { p: pos, q: pos, a: pos, b: pos, c: pos } }],
    related: ["power-of-a-point", "radical-axis", "tangent-length"],
    problems: [
      { id: "v2g-cp1", text: "Find the length of a tangent from $(7, 1)$ to the circle $x^2 + y^2 - 2x + 4y - 4 = 0$.", answer: "6", solution: "Power: $49 + 1 - 14 + 4 - 4 = 36$." },
      { id: "v2g-cp2", text: "A line through the origin meets the circle $(x - 5)^2 + y^2 = 9$ at $A$ and $B$. Find $OA \\cdot OB$.", answer: "16", solution: "The power of the origin: $25 - 9$." },
    ],
  },
  {
    id: "reflection-over-line",
    name: "Reflecting a Point over a Line",
    level: "AMC 12",
    statement: "(x_0, y_0) \\mapsto (x_0, y_0) - \\frac{2(Ax_0 + By_0 + C)}{A^2 + B^2}(A, B)",
    setup: "Reflection over the line $Ax + By + C = 0$. Over $y = x$: $(p, q) \\mapsto (q, p)$. Over $y = x + c$: $(p, q) \\mapsto (q - c, p + c)$.",
    whenToUse: "Mirror images, and shortest paths that bounce off a line.",
    figure: (() => {
      const u: Pt = [-1, -1], v: Pt = [5, 3], P: Pt = [1, 3];
      const Q = reflect(P, u, v), F = foot(P, u, v);
      return fig({ pts: { P, Q, F, u, v }, hide: ["F", "u", "v"], lines: ["u-v:blue", "P-Q:dashed"], rights: ["P-F-v"], nudge: { Q: [6, 4] } });
    })(),
    recall: [{ lhs: "x\\text{-coordinate of the reflection of } (p,q) \\text{ over } y=x+c:", answer: "q-c", vars: { p: pos, q: pos, c: pos } }],
    related: ["point-line-distance", "rotation"],
    problems: [
      { id: "v2g-rf1", text: "The reflection of $(1, 2)$ over the line $y = x + 3$ is $(a, b)$. Find $a + b$.", answer: "3", solution: "$(2 - 3, 1 + 3) = (-1, 4)$." },
      {
        id: "v2g-rf2",
        text: "Find the length of the shortest path from $A = (1, 3)$ to a point on the $x$-axis and then to $B = (5, 1)$.",
        answer: "4\\sqrt2",
        solution: "Reflect $B$ to $(5, -1)$; the path is at least $\\sqrt{4^2 + 4^2}$, with equality on the straight line.",
        figure: (() => {
          const A: Pt = [1, 3], B: Pt = [5, 1];
          const ax = axes(-0.5, 6.5, -0.5, 3.8);
          return fig({ pts: { A, B, ...ax.pts }, hide: ax.hide, lines: ax.lines, texts: ax.texts });
        })(),
      },
    ],
  },
  {
    id: "parallel-line-distance",
    name: "Distance Between Parallel Lines",
    level: "AMC 12",
    statement: "\\frac{|C_1 - C_2|}{\\sqrt{A^2 + B^2}}",
    setup: "For $Ax + By + C_1 = 0$ and $Ax + By + C_2 = 0$. First make the $x$ and $y$ coefficients match.",
    whenToUse: "The gap between two parallel lines, like the sides of a strip or a parallelogram.",
    figure: (() => {
      const a: Pt = [0, 0], b: Pt = [6, 3], c: Pt = [-0.8, 1.6], e: Pt = [5.2, 4.6];
      const P: Pt = [2.4, 1.2], F = foot(P, c, e);
      return fig({ pts: { a, b, c, e, P, F }, hide: ["a", "b", "c", "e", "P", "F"], lines: ["a-b:blue", "c-e:blue", "P-F:dashed"], rights: ["P-F-e"], texts: [{ on: "P-F", text: "d" }] });
    })(),
    recall: [{ lhs: "\\text{Distance between } ax+by+c=0 \\text{ and } ax+by+d=0:", answer: "\\frac{|c-d|}{\\sqrt{a^2+b^2}}", vars: { a: pos, b: pos, c: pos, d: pos } }],
    related: ["point-line-distance"],
    problems: [
      { id: "v2g-pl1", text: "Find the distance between the lines $y = 2x + 1$ and $y = 2x - 4$.", answer: "\\sqrt5", solution: "$2x - y + 1 = 0$ and $2x - y - 4 = 0$: $\\frac{5}{\\sqrt5}$." },
      { id: "v2g-pl2", text: "Find the distance between the lines $6x + 8y = 7$ and $3x + 4y = 1$.", answer: "\\frac12", solution: "Rewrite the second as $6x + 8y = 2$: $\\frac{|7 - 2|}{10}$." },
    ],
  },
  {
    id: "point-plane-distance",
    name: "Distance from a Point to a Plane",
    level: "AIME",
    statement: "d = \\frac{|ax_0 + by_0 + cz_0 + d_0|}{\\sqrt{a^2 + b^2 + c^2}}",
    setup: "From $(x_0, y_0, z_0)$ to the plane $ax + by + cz + d_0 = 0$. It's the 3D version of the point-to-line formula.",
    whenToUse: "Heights of tetrahedra and pyramids given by coordinates.",
    figure: (() => {
      const pts = { a: proj([0, 0, 0]), b: proj([5, 0, 0]), c: proj([5, 4, 0]), e: proj([0, 4, 0]), P: proj([2.6, 2, 2.6]), F: proj([2.6, 2, 0]) };
      return fig({ pts, hide: ["a", "b", "c", "e"], shapes: ["a-b-c-e"], lines: ["a-b", "b-c", "c-e", "e-a", "P-F:blue"], texts: [{ on: "P-F", text: "d" }] });
    })(),
    recall: [{ lhs: "\\text{Distance from } (p,q,r) \\text{ to } ax+by+cz+d=0:", answer: "\\frac{|ap+bq+cr+d|}{\\sqrt{a^2+b^2+c^2}}", vars: { a: pos, b: pos, c: pos, d: pos, p: pos, q: pos, r: pos } }],
    related: ["point-line-distance", "tetra-volume-det"],
    problems: [
      { id: "v2g-pp1", text: "Find the distance from $(1, 2, 3)$ to the plane $2x + y + 2z = 1$.", answer: "3", solution: "$\\frac{|2 + 2 + 6 - 1|}{3}$." },
      { id: "v2g-pp2", text: "Find the distance from the origin to the plane $x + 2y + 2z = 12$.", answer: "4", solution: "$\\frac{12}{3}$." },
    ],
  },
  {
    id: "dot-product",
    name: "Dot Product and Angles",
    level: "AMC 12",
    statement: "\\mathbf u \\cdot \\mathbf v = u_1v_1 + u_2v_2 + u_3v_3 = |\\mathbf u||\\mathbf v|\\cos\\theta",
    setup: "$\\theta$ is the angle between the vectors. The dot product is $0$ exactly when they're perpendicular.",
    whenToUse: "Angles between lines or edges in coordinates, especially in 3D.",
    figure: (() => {
      const O: Pt = [0, 0], U: Pt = [4, 1], V: Pt = [1.5, 3];
      return fig({ pts: { O, U, V }, hide: ["O"], lines: ["O-U:blue", "O-V:rose"], texts: [{ at: angleAt(O, U, V, 0.9), text: "θ" }, { on: "O-U", text: "u" }, { on: "O-V", text: "v" }] });
    })(),
    recall: [{ lhs: "\\cos\\theta \\text{ between } (a,b) \\text{ and } (c,d):", answer: "\\frac{ac+bd}{\\sqrt{a^2+b^2}\\sqrt{c^2+d^2}}", vars: { a: pos, b: pos, c: pos, d: pos } }],
    related: ["law-of-cosines", "vector-area", "angle-between-lines"],
    problems: [
      { id: "v2g-dp1", text: "Find the cosine of the angle between $(1, 2, 2)$ and $(2, -1, 2)$.", answer: "\\frac49", solution: "$\\frac{2 - 2 + 4}{3 \\cdot 3}$." },
      {
        id: "v2g-dp2",
        text: "Find the cosine of the acute angle between two space diagonals of a cube.",
        answer: "\\frac13",
        solution: "Use $(1, 1, 1)$ and $(1, 1, -1)$: $\\frac{1 + 1 - 1}{3}$.",
        figure: (() => {
          const v = (x: number, y: number, z: number) => proj([x * 3, y * 3, z * 3]);
          const pts = { a: v(0, 0, 0), b: v(1, 0, 0), c: v(1, 1, 0), d: v(0, 1, 0), e: v(0, 0, 1), f: v(1, 0, 1), g: v(1, 1, 1), h: v(0, 1, 1) };
          return fig({ pts, hide: Object.keys(pts), lines: ["a-b", "b-c", "c-d:dashed", "d-a:dashed", "e-f", "f-g", "g-h", "h-e", "a-e", "b-f", "c-g", "d-h:dashed", "a-g:blue", "f-d:rose"] });
        })(),
      },
    ],
  },
  {
    id: "vector-area",
    name: "Triangle Area from Vectors",
    level: "AMC 12",
    statement: "[\\triangle] = \\frac12|x_1y_2 - x_2y_1| \\ (2\\text{D}), \\qquad \\frac12|\\mathbf u \\times \\mathbf v| \\ (3\\text{D})",
    setup: "$\\mathbf u = (x_1, y_1)$ and $\\mathbf v = (x_2, y_2)$ are two sides from the same corner. The determinant is the area of the parallelogram they span.",
    whenToUse: "Triangle areas from coordinates, in the plane or in space.",
    figure: (() => {
      const O: Pt = [0, 0], U: Pt = [4, 1], V: Pt = [1.5, 3], W: Pt = [5.5, 4];
      return fig({ pts: { O, U, V, W }, hide: ["W"], shapes: ["O-U-V"], lines: ["O-U:blue", "O-V:blue", "U-V", "U-W:dashed", "V-W:dashed"], texts: [{ on: "O-U", text: "u" }, { on: "O-V", text: "v" }] });
    })(),
    recall: [{ lhs: "\\text{Area of the triangle } (0,0),\\ (a,b),\\ (c,d):", answer: "\\frac12|ad-bc|", vars: { a: pos, b: pos, c: pos, d: pos } }],
    related: ["shoelace", "dot-product", "tetra-volume-det"],
    problems: [
      { id: "v2g-vc1", text: "Find the area of the triangle with vertices $(0, 0)$, $(4, 1)$, $(2, 5)$.", answer: "9", solution: "$\\frac12|4 \\cdot 5 - 2 \\cdot 1|$." },
      { id: "v2g-vc2", text: "Find the area of the triangle with vertices $(1, 0, 0)$, $(0, 1, 0)$, $(0, 0, 1)$.", answer: "\\frac{\\sqrt3}{2}", solution: "$(-1, 1, 0) \\times (-1, 0, 1) = (1, 1, 1)$, so $\\frac12\\sqrt3$. (It's equilateral with side $\\sqrt2$.)" },
    ],
  },
  {
    id: "tetra-volume-det",
    name: "Tetrahedron Volume from Coordinates",
    level: "AIME",
    statement: "V = \\frac16\\left|\\det\\begin{pmatrix} \\mathbf u & \\mathbf v & \\mathbf w \\end{pmatrix}\\right|",
    setup: "$\\mathbf u$, $\\mathbf v$, $\\mathbf w$ are the three edges from one vertex. The determinant is the volume of the box they span; the tetrahedron is $\\frac16$ of it.",
    whenToUse: "Volumes of tetrahedra with vertices given in coordinates.",
    figure: (() => {
      const pts = { O: proj([0, 0, 0]), A: proj([4, 0, 0]), B: proj([0, 5, 0]), C: proj([0, 0, 3.4]) };
      return fig({ pts, shapes: ["A-B-C"], lines: ["O-A:blue", "O-B:dashed", "O-C:blue", "A-B", "B-C", "C-A"] });
    })(),
    recall: [{ lhs: "\\text{Volume of the tetrahedron } O,\\ (a,0,0),\\ (0,b,0),\\ (0,0,c):", answer: "\\frac{abc}{6}", vars: { a: pos, b: pos, c: pos } }],
    related: ["tetrahedron", "vector-area", "point-plane-distance"],
    problems: [
      { id: "v2g-tv1", text: "Find the volume of the tetrahedron with vertices $(0, 0, 0)$, $(1, 0, 0)$, $(0, 2, 0)$, $(0, 0, 3)$.", answer: "1", solution: "$\\frac{1 \\cdot 2 \\cdot 3}{6}$." },
      { id: "v2g-tv2", text: "Find the volume of the tetrahedron with vertices $(0, 0, 0)$, $(1, 2, 3)$, $(2, 3, 1)$, $(3, 1, 2)$.", answer: "3", solution: "The determinant is $1(6 - 1) - 2(4 - 3) + 3(2 - 9) = -18$; $\\frac{18}{6}$." },
    ],
  },
  {
    id: "spherical-cap",
    name: "Spherical Cap",
    level: "AIME",
    statement: "V = \\frac{\\pi h^2(3r - h)}{3}, \\qquad \\text{curved area} = 2\\pi rh",
    setup: "A plane cuts a cap of height $h$ off a sphere of radius $r$. With $h = r$ it's a hemisphere: $\\frac23\\pi r^3$.",
    whenToUse: "Volumes of liquid in a sphere, or pieces of a ball cut by a plane.",
    figure: capFig(3, 1.2, true, [{ on: "M-T", text: "h" }, { on: "O-s0", text: "r" }]),
    recall: [{ lhs: "\\text{Volume of a cap of height } h \\text{ on a sphere of radius } r:", answer: "\\frac{\\pi h^2(3r-h)}{3}", vars: { h: [0.5, 2], r: [3, 5] } }],
    related: ["frustum", "pappus"],
    problems: [
      { id: "v2g-sc1", text: "A plane $3$ units from the center of a sphere of radius $5$ cuts off a cap. Find the cap's volume.", answer: "\\frac{52\\pi}{3}", solution: "$h = 2$: $\\frac{\\pi \\cdot 4 \\cdot 13}{3}$.", figure: capFig(5, 2, true, [{ on: "O-s0", text: "5" }]) },
      { id: "v2g-sc2", text: "A sphere of radius $3$ is filled with water to a depth of $2$. Find the volume of water divided by $\\pi$.", answer: "\\frac{28}{3}", solution: "$\\frac{4(9 - 2)}{3}$.", figure: capFig(3, 2, false, [{ on: "M-T", text: "2" }]) },
    ],
  },
  {
    id: "platonic-solids",
    name: "Platonic Solids",
    level: "AMC 10",
    statement: "\\begin{array}{lccc} & V & E & F \\\\ \\text{tetrahedron} & 4 & 6 & 4 \\\\ \\text{cube} & 8 & 12 & 6 \\\\ \\text{octahedron} & 6 & 12 & 8 \\\\ \\text{dodecahedron} & 20 & 30 & 12 \\\\ \\text{icosahedron} & 12 & 30 & 20 \\end{array}",
    setup: "The five convex solids with identical regular faces and the same number of faces at each vertex. Cube and octahedron swap $V$ and $F$, as do the dodecahedron and icosahedron.",
    whenToUse: "Counting vertices, edges, faces or diagonals of regular solids.",
    figure: (() => {
      const pts = { a: proj([0, 0, 2.6]), b: proj([0, 0, -2.6]), c: proj([2.6, 0, 0]), d: proj([-2.6, 0, 0]), e: proj([0, 2.6, 0]), f: proj([0, -2.6, 0]) };
      return fig({ pts, hide: Object.keys(pts), lines: ["a-c", "a-d", "a-e:dashed", "a-f", "b-c", "b-d", "b-e:dashed", "b-f", "c-f", "f-d", "d-e:dashed", "e-c:dashed"] });
    })(),
    recall: [
      { lhs: "\\text{Edges of an icosahedron:}", answer: "30", vars: {} },
      { lhs: "\\text{Faces of a dodecahedron:}", answer: "12", vars: {} },
    ],
    related: ["euler-polyhedron", "handshake-lemma"],
    problems: [
      { id: "v2g-pz1", text: "How many edges does a regular icosahedron have?", answer: "30", solution: "$20$ triangles have $60$ sides, each edge shared by $2$ faces." },
      { id: "v2g-pz2", text: "How many space diagonals (segments joining two vertices not on a common face) does a regular dodecahedron have?", answer: "100", solution: "$\\binom{20}{2} - 30$ edges $- 12 \\cdot 5$ face diagonals." },
    ],
  },
  {
    id: "conic-eccentricity",
    name: "Conics by Eccentricity",
    level: "AIME",
    statement: "PF = \\varepsilon \\cdot PD, \\qquad \\varepsilon = \\frac ca",
    setup: "$F$ is a focus and $PD$ the distance to the matching directrix. $\\varepsilon < 1$: ellipse; $\\varepsilon = 1$: parabola; $\\varepsilon > 1$: hyperbola. For an ellipse or hyperbola, the directrix is $x = \\frac{a}{\\varepsilon}$.",
    whenToUse: "One definition for all conics, or the eccentricity of a given conic.",
    figure: (() => {
      const e = curve("e", ellipsePts(5, 4));
      const P: Pt = [2.5, 4 * Math.sin(Math.PI / 3)], F: Pt = [3, 0], D: Pt = [25 / 3, P[1]];
      return fig({ pts: { ...e.pts, P, F, D, u: [25 / 3, -4.5], v: [25 / 3, 4.5] }, hide: [...e.hide, "u", "v"], lines: [...e.lines, "u-v:dashed", "P-F:blue", "P-D:rose"] });
    })(),
    recall: [{ lhs: "\\text{Eccentricity of } \\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1 \\ (a>b):", answer: "\\frac{\\sqrt{a^2-b^2}}{a}", vars: { a: [4, 6], b: [1, 3] } }],
    related: ["ellipse", "hyperbola", "parabola"],
    problems: [
      { id: "v2g-ce1", text: "Find the eccentricity of the ellipse $\\frac{x^2}{25} + \\frac{y^2}{16} = 1$.", answer: "\\frac35", solution: "$c = \\sqrt{25 - 16} = 3$." },
      { id: "v2g-ce2", text: "Find the eccentricity of the hyperbola $\\frac{x^2}{9} - \\frac{y^2}{16} = 1$.", answer: "\\frac53", solution: "$c = \\sqrt{9 + 16} = 5$." },
    ],
  },
  {
    id: "euler-inequality",
    name: "Euler's Inequality",
    level: "AMC 12",
    statement: "R \\ge 2r",
    setup: "The circumradius is at least twice the inradius, with equality only for an equilateral triangle. It follows from $OI^2 = R^2 - 2Rr \\ge 0$.",
    whenToUse: "Bounds relating the two radii of a triangle.",
    figure: (() => {
      const { A, B, C } = triangle(6, 5, 4.2);
      return fig({ pts: { A, B, C }, shapes: ["A-B-C"], circles: [circumcircle(A, B, C), incircle(A, B, C)], lines: ["A-B", "B-C", "C-A"] });
    })(),
    recall: [{ lhs: "R \\ge", answer: "2r", vars: { r: pos } }],
    related: ["euler-oi", "inradius-circumradius"],
    problems: [
      { id: "v2g-ei1", text: "A triangle has inradius $3$. What is the smallest possible circumradius?", answer: "6", solution: "$R \\ge 2r$, with equality for an equilateral triangle." },
      { id: "v2g-ei2", text: "A triangle has circumradius $10$. What is the largest possible inradius?", answer: "5", solution: "$r \\le \\frac R2$." },
    ],
  },
  {
    id: "apollonius-circle",
    name: "Circle of Apollonius",
    level: "AIME",
    statement: "\\{P : PA = k \\cdot PB\\} \\text{ is a circle } (k \\ne 1), \\qquad \\text{radius} = \\frac{k \\cdot AB}{|k^2 - 1|}",
    setup: "The circle crosses line $AB$ at the two points dividing $AB$ internally and externally in ratio $k : 1$; those are the ends of a diameter.",
    whenToUse: "Points with a fixed ratio of distances to two points.",
    figure: (() => {
      const A: Pt = [0, 0], B: Pt = [3, 0], P = polar([4, 0], 2, 115);
      return fig({ pts: { A, B, P }, circles: [{ c: [4, 0], r: 2, dashed: true }], lines: ["P-A:blue", "P-B:rose", "A-B"] });
    })(),
    recall: [{ lhs: "\\text{Radius of } \\{P: PA = kPB\\},\\ AB = d \\ (k>1):", answer: "\\frac{kd}{k^2-1}", vars: { k: [2, 4], d: pos } }],
    related: ["angle-bisector", "power-of-a-point"],
    problems: [
      { id: "v2g-ap1", text: "$A = (0, 0)$ and $B = (3, 0)$. The points $P$ with $PA = 2PB$ form a circle. Find its radius.", answer: "2", solution: "$x^2 + y^2 = 4((x - 3)^2 + y^2)$ simplifies to $(x - 4)^2 + y^2 = 4$." },
      { id: "v2g-ap2", text: "$AB = 3$ and $PA = 2PB$. What is the largest possible area of triangle $PAB$?", answer: "3", solution: "$P$ is on a circle of radius $2$ centered on line $AB$, so the height is at most $2$: $\\frac12 \\cdot 3 \\cdot 2$." },
    ],
  },
  {
    id: "angle-between-lines",
    name: "Angle Between Two Lines",
    level: "AMC 12",
    statement: "\\tan\\theta = \\left|\\frac{m_2 - m_1}{1 + m_1m_2}\\right|",
    setup: "$m_1$ and $m_2$ are the slopes and $\\theta$ the acute angle between the lines. If $m_1m_2 = -1$ they're perpendicular.",
    whenToUse: "Angles between lines given by equations.",
    figure: (() => {
      const O: Pt = [0, 0], U: Pt = [4, 1.4], V: Pt = [2, 4.2];
      const ax = axes(-0.5, 4.6, -0.5, 4.6);
      return fig({ pts: { O, U, V, ...ax.pts }, hide: ["O", "U", "V", ...ax.hide], lines: [...ax.lines, "O-U:blue", "O-V:rose"], texts: [...ax.texts, { at: angleAt(O, U, V, 1.3), text: "θ" }, { on: "O-U", text: "m₁" }, { on: "O-V", text: "m₂" }] });
    })(),
    recall: [{ lhs: "\\tan\\theta \\text{ between lines with slopes } m, n:", answer: "\\left|\\frac{n-m}{1+mn}\\right|", vars: { m: pos, n: pos } }],
    related: ["tan-addition", "dot-product"],
    problems: [
      { id: "v2g-al1", text: "Find the tangent of the acute angle between $y = 2x$ and $y = 3x$.", answer: "\\frac17", solution: "$\\frac{3 - 2}{1 + 6}$." },
      { id: "v2g-al2", text: "Find the acute angle, in degrees, between $y = 3x$ and $y = -2x$.", answer: "45", solution: "$\\left|\\frac{-2 - 3}{1 - 6}\\right| = 1$." },
    ],
  },
  {
    id: "line-circle-discriminant",
    name: "When a Line Meets a Circle",
    level: "AMC 12",
    statement: "\\text{Substitute the line into the circle: } \\Delta > 0 \\text{ crosses}, \\ \\Delta = 0 \\text{ tangent}, \\ \\Delta < 0 \\text{ misses}",
    setup: "Equivalently, compare the distance from the center to the line with $r$. $y = mx + c$ is tangent to $x^2 + y^2 = r^2$ exactly when $c^2 = r^2(1 + m^2)$.",
    whenToUse: "Tangency conditions, or counting intersections of a line and a circle.",
    figure: (() => {
      const O: Pt = [0, 0];
      return fig({ pts: { O, a: [-3.2, -1.2], b: [3.2, 1.6], c: [-3.2, 2], d: [3.2, 2], e: [-3.2, 3.4], f: [3.2, 2.8] }, hide: ["a", "b", "c", "d", "e", "f"], circles: [{ c: O, r: 2 }], lines: ["a-b:blue", "c-d", "e-f:rose"] });
    })(),
    recall: [{ lhs: "y=mx+c \\text{ is tangent to } x^2+y^2=r^2 \\text{ exactly when } c^2 =", answer: "r^2(1+m^2)", vars: { r: pos, m: pos } }],
    related: ["discriminant", "point-line-distance", "circle-tangent-line"],
    problems: [
      { id: "v2g-lc1", text: "For which value of $k^2$ is the line $y = kx + 2$ tangent to $x^2 + y^2 = 1$?", answer: "3", solution: "$(1 + k^2)x^2 + 4kx + 3 = 0$ has $\\Delta = 4k^2 - 12 = 0$." },
      { id: "v2g-lc2", text: "For how many integers $b$ does the line $y = x + b$ cross the circle $x^2 + y^2 = 8$ at two points?", answer: "7", solution: "Distance $\\frac{|b|}{\\sqrt2} < 2\\sqrt2$, so $|b| < 4$." },
    ],
  },
  {
    id: "spiral-similarity",
    name: "Spiral Similarity",
    level: "AIME",
    statement: "z \\mapsto az + b \\ (a \\ne 1) \\text{ has center } \\frac{b}{1 - a}, \\text{ ratio } |a|, \\text{ angle } \\arg a",
    setup: "A spiral similarity rotates and scales about a center. The one sending segment $AB$ to $CD$ ($A \\to C$, $B \\to D$): if lines $AC$ and $BD$ meet at $X$, its center is the second meeting point of circles $(ABX)$ and $(CDX)$.",
    whenToUse: "Two similar triangles sharing a vertex, or a segment mapped to another by rotation and scaling.",
    figure: spiral,
    recall: [{ lhs: "\\text{Center of } z\\mapsto az+b \\ (a\\ne1):", answer: "\\frac{b}{1-a}", vars: { a: [2, 5], b: pos } }],
    related: ["rotation", "homothety", "euler-de-moivre"],
    problems: [
      { id: "v2g-ss1", text: "A spiral similarity centered at the origin sends $(1, 0)$ to $(0, 2)$. What is its scale factor?", answer: "2", solution: "It's $z \\mapsto 2iz$: a $90^\\circ$ turn and a factor of $2$." },
      { id: "v2g-ss2", text: "A spiral similarity sends $A = (0, 0)$ to $C = (3, 3)$ and $B = (2, 0)$ to $D = (3, 5)$. Find the $y$-coordinate of its center.", answer: "3", solution: "$a = \\frac{D - C}{B - A} = i$ and $b = C - aA = 3 + 3i$. Center: $\\frac{3 + 3i}{1 - i} = 3i$.", figure: spiral },
    ],
  },
  {
    id: "miquel",
    name: "Miquel's Theorem",
    level: "AIME",
    statement: "\\text{Circles } (AEF), (BFD), (CDE) \\text{ meet at one point } M",
    setup: "$D$, $E$, $F$ are on sides $BC$, $CA$, $AB$. Since $AFME$ is cyclic, $\\angle EMF = 180^\\circ - A$ when $M$ is inside the triangle.",
    whenToUse: "Three circles through a vertex and points on the two sides beside it.",
    figure: (() => {
      const { A, B, C } = triangle(7, 6, 5.2);
      return miquelFig(A, B, C, [4.3, 0], mid(A, C) as Pt, [A[0] * 0.4, A[1] * 0.4]);
    })(),
    recall: [{ lhs: "\\angle EMF \\ (M \\text{ inside, angle } A) =", answer: "180-A", vars: { A: [30, 80] } }],
    related: ["cyclic-quadrilateral", "inscribed-angle", "spiral-similarity"],
    problems: [
      { id: "v2g-mq1", text: "$D$, $E$, $F$ are the midpoints of the sides of a right triangle with legs $6$ and $8$. The circles $(AEF)$, $(BFD)$, $(CDE)$ meet at $M$. How far is $M$ from the vertex at the right angle?", answer: "5", solution: "With midpoints, each circle has the segment from a vertex to the circumcenter $O$ as a diameter, so $M = O$, the midpoint of the hypotenuse." },
      {
        id: "v2g-mq2",
        text: "$A = (0, 12)$, $B = (-4, 0)$, $C = (9, 0)$. $D$, $E$, $F$ are the feet of the altitudes from $A$, $B$, $C$. The circles $(AEF)$, $(BFD)$, $(CDE)$ meet at $M$. Find $AM$.",
        answer: "9",
        solution: "Each circle has a vertex-to-orthocenter segment as a diameter, so $M$ is the orthocenter $(0, 3)$.",
        figure: (() => {
          const A: Pt = [0, 12], B: Pt = [-4, 0], C: Pt = [9, 0];
          return miquelFig(A, B, C, foot(A, B, C), foot(B, C, A), foot(C, A, B));
        })(),
      },
    ],
  },
  {
    id: "feuerbach",
    name: "Feuerbach's Theorem",
    level: "AIME",
    statement: "NI = \\frac R2 - r, \\qquad NJ = \\frac R2 + r_a",
    setup: "The nine-point circle (center $N$, radius $\\frac R2$) touches the incircle from outside it and each excircle (center $J$, radius $r_a$) as well.",
    whenToUse: "Distances from the nine-point center to the incenter or excenters.",
    figure: (() => {
      const { A, B, C } = triangle(6, 5.2, 3.6);
      const O = circumcircle(A, B, C), H = orthocenter(A, B, C), N = mid(O.c, H), inc = incircle(A, B, C);
      return fig({ pts: { A, B, C, N, I: inc.c }, circles: [inc, { c: N, r: O.r / 2, dashed: true }], lines: ["A-B", "B-C", "C-A"], nudge: { I: [-10, 4], N: [10, -4] } });
    })(),
    recall: [{ lhs: "NI =", answer: "\\frac R2-r", vars: { R: [8, 10], r: [1, 3] } }],
    related: ["nine-point-circle", "euler-oi", "exradius"],
    problems: [
      { id: "v2g-fb1", text: "Find the distance between the incenter and the nine-point center of the $13$-$14$-$15$ triangle.", answer: "\\frac{1}{16}", solution: "$\\frac R2 - r = \\frac{65}{16} - 4$." },
      { id: "v2g-fb2", text: "For the $13$-$14$-$15$ triangle, find the distance from the nine-point center to the excenter opposite the side of length $14$.", answer: "\\frac{257}{16}", solution: "$r_a = \\frac{84}{21 - 14} = 12$, so $\\frac{65}{16} + 12$." },
    ],
  },
  {
    id: "barycentric",
    name: "Barycentric Coordinates",
    level: "AIME",
    statement: "P = (x : y : z) \\iff P = \\frac{xA + yB + zC}{x + y + z}, \\qquad [PBC] : [PCA] : [PAB] = x : y : z",
    setup: "Each weight is proportional to the area of the triangle opposite its vertex. The centroid is $(1 : 1 : 1)$ and the incenter $(a : b : c)$.",
    whenToUse: "Points described by area ratios or weighted averages of the vertices.",
    figure: (() => {
      const { A, B, C } = triangle(7, 5.8, 5);
      const P: Pt = [(2 * A[0] + 3 * B[0] + 2.4 * C[0]) / 7.4, (2 * A[1] + 3 * B[1] + 2.4 * C[1]) / 7.4];
      const cen = (p: Pt, q: Pt, r: Pt): Pt => [(p[0] + q[0] + r[0]) / 3, (p[1] + q[1] + r[1]) / 3];
      return fig({ pts: { A, B, C, P }, lines: ["A-B", "B-C", "C-A", "P-A", "P-B", "P-C"], texts: [{ at: cen(P, B, C), text: "x" }, { at: cen(P, C, A), text: "y" }, { at: cen(P, A, B), text: "z" }], nudge: { P: [10, 8] } });
    })(),
    recall: [{ lhs: "\\frac{[PBC]}{[ABC]} \\text{ for } P = (x:y:z):", answer: "\\frac{x}{x+y+z}", vars: { x: pos, y: pos, z: pos } }],
    related: ["mass-points", "centroid", "same-height-areas"],
    problems: [
      { id: "v2g-bc1", text: "$A = (0, 0)$, $B = (6, 0)$, $C = (0, 6)$. Find the sum of the coordinates of the point with barycentric coordinates $(1 : 2 : 3)$.", answer: "5", solution: "$\\frac{1 \\cdot A + 2 \\cdot B + 3 \\cdot C}{6} = (2, 3)$." },
      { id: "v2g-bc2", text: "$P = (1 : 2 : 3)$ in triangle $ABC$. What fraction of $[ABC]$ is $[PBC]$?", answer: "\\frac16", solution: "$\\frac{1}{1 + 2 + 3}$." },
    ],
  },
]);
