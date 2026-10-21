import { defineTopic, int, pos, type VarRange } from "../types";
import {
  along, angleAt, circumcircle, dist, equilateralOn, excircle, fig, foot, incircle, lineCircle, meet, mid, orthocenter, polar, tangentPoints, triangle,
  type Pt,
} from "../fig";

const ang: VarRange = [0.3, 1.2];

// ---- Shared constructions -------------------------------------------------

/** A quadrilateral around a circle, from its four tangent lengths (corner to touch point). */
function tangentialQuad(t: number[]) {
  // Find r so the half-angles at the corners, atan(r / t), add up to 180°.
  let lo = 0, hi = 100;
  for (let i = 0; i < 80; i++) {
    const r = (lo + hi) / 2;
    if (t.reduce((s, x) => s + Math.atan(r / x), 0) > Math.PI) hi = r;
    else lo = r;
  }
  const r = lo, O: Pt = [0, 0];
  let a = 0;
  const corners = t.map((x) => {
    const half = (Math.atan(r / x) * 180) / Math.PI; // half the corner angle
    const gap = 180 - 2 * half; // angle between the corner's two touch points, seen from O
    const p = polar(O, Math.hypot(r, x), a + gap / 2);
    a += gap;
    return p;
  });
  return { r, O, corners };
}

const butterfly = (() => {
  const circle = { c: [0, 0.9] as Pt, r: 2.2 };
  const w = Math.sqrt(circle.r ** 2 - 0.81);
  const P: Pt = [-w, 0], Q: Pt = [w, 0], M: Pt = [0, 0];
  const [B, A] = lineCircle(polar(M, 1, 245), polar(M, 1, 65), circle);
  const [D, C] = lineCircle(polar(M, 1, 300), polar(M, 1, 120), circle);
  const X = meet(A, D, P, Q), Y = meet(B, C, P, Q);
  return { circle, pts: { P, Q, M, A, B, C, D, X, Y } };
})();
export const butterflyFig = (texts: { on: string; text: string }[] = []) =>
  fig({ pts: butterfly.pts, circles: [butterfly.circle], lines: ["P-Q", "A-B", "C-D", "A-D", "B-C"], texts, nudge: { M: [0, 12], X: [0, 12], Y: [0, 12] } });

const t131415 = triangle(14, 15, 13);

export const carnotFig = (A: Pt, B: Pt, C: Pt, texts: { on: string; text: string }[] = []) => {
  const O = circumcircle(A, B, C).c;
  const X = foot(O, B, C), Y = foot(O, C, A), Z = foot(O, A, B);
  return fig({ pts: { A, B, C, O, X, Y, Z }, hide: ["X", "Y", "Z"], shapes: ["A-B-C"], lines: ["A-B", "B-C", "C-A", "O-X:dashed", "O-Y:dashed", "O-Z:dashed"], rights: ["O-X-C", "O-Y-A", "O-Z-B"], texts, nudge: { O: [12, -4] } });
};

const descartes = { A: [0, 0] as Pt, B: [3, 0] as Pt, C: [0, 4] as Pt };

export const incEx = (() => {
  const { A, B, C } = triangle(6, 7.5, 5);
  const I = incircle(A, B, C).c, J = excircle(A, B, C).c;
  const circ = circumcircle(A, B, C);
  const M = lineCircle(A, I, circ)[1];
  return fig({ pts: { A, B, C, I, M, J }, circles: [circ, { c: M, r: dist(M, B), dashed: true }], lines: ["A-B", "B-C", "C-A", "A-J", "M-B:blue", "M-C:blue"], nudge: { I: [10, 0], M: [10, 4] } });
})();

const monge = (() => {
  const c1 = { c: [0, 0] as Pt, r: 0.5 }, c2 = { c: [4, 0] as Pt, r: 1.2 }, c3 = { c: [1.5, 3.5] as Pt, r: 2.2 };
  const ext = (a: typeof c1, b: typeof c1): Pt => [(b.r * a.c[0] - a.r * b.c[0]) / (b.r - a.r), (b.r * a.c[1] - a.r * b.c[1]) / (b.r - a.r)];
  const X = ext(c1, c2), Y = ext(c1, c3), Z = ext(c2, c3);
  const pts = { X, Y, Z, x: tangentPoints(X, c2)[0], y: tangentPoints(Y, c3)[0], z: tangentPoints(Z, c3)[0] };
  const lines = ["X-Z:dashed", "X-x", "Y-y", "Z-z"];
  return fig({ pts, hide: ["x", "y", "z"], circles: [c1, c2, c3], lines, nudge: { Y: [8, 12] } });
})();

export const routhFig = (k: number, texts: { on: string; text: string }[]) => {
  const { A, B, C } = triangle(7, 6, 5.5);
  const t = k / (k + 1);
  const D = along(B, C, t), E = along(C, A, t), F = along(A, B, t);
  const P = meet(A, D, B, E), Q = meet(B, E, C, F), R = meet(C, F, A, D);
  return fig({ pts: { A, B, C, D, E, F, P, Q, R }, hide: ["P", "Q", "R"], shapes: ["P-Q-R"], lines: ["A-B", "B-C", "C-A", "A-D", "B-E", "C-F"], texts });
};

export const cevians = (A: Pt, B: Pt, C: Pt, af: number, ae: number, texts: { on: string; text: string }[] = []) => {
  const F = along(A, B, af), E = along(A, C, ae);
  const O = meet(B, E, C, F), D = meet(A, O, B, C);
  return fig({ pts: { A, B, C, D, E, F, O }, lines: ["A-B", "B-C", "C-A", "A-D", "B-E", "C-F"], texts, nudge: { O: [12, -2] } });
};

export const vivianiFig = (P: Pt, s: number, texts: { on: string; text: string }[] = []) => {
  const B: Pt = [0, 0], C: Pt = [s, 0], A: Pt = [s / 2, (s * Math.sqrt(3)) / 2];
  const X = foot(P, B, C), Y = foot(P, C, A), Z = foot(P, A, B);
  return fig({ pts: { A, B, C, P, X, Y, Z }, hide: ["X", "Y", "Z"], shapes: ["A-B-C"], lines: ["A-B", "B-C", "C-A", "P-X:blue", "P-Y:blue", "P-Z:blue"], rights: ["P-X-C", "P-Y-A", "P-Z-B"], texts });
};

export const massFig = (bd: number, ae: number, texts: { on: string; text: string }[]) => {
  const { A, B, C } = triangle(7, 6, 5);
  const D = along(B, C, bd), E = along(A, C, ae);
  const P = meet(A, D, B, E);
  return fig({ pts: { A, B, C, D, E, P }, lines: ["A-B", "B-C", "C-A", "A-D", "B-E"], texts, nudge: { P: [-12, 2] } });
};

export const homothetyFig = (r1: number, r2: number, d: number, inner: boolean, labels = true) => {
  const P: Pt = [0, 0], Q: Pt = [d, 0];
  const X: Pt = inner ? [(d * r1) / (r1 + r2), 0] : [(-d * r1) / (r2 - r1), 0];
  // Tangent points that line up with X: the same angle from each center, or opposite ones for internal tangents.
  const [a, b] = tangentPoints(X, { c: P, r: r1 });
  const [c, e] = tangentPoints(X, { c: Q, r: r2 });
  return fig({
    pts: { X, P, Q, a, b, c, e, p: [0, r1], q: [d, r2] },
    hide: ["a", "b", "c", "e", "p", "q"],
    circles: [{ c: P, r: r1 }, { c: Q, r: r2 }],
    lines: ["a-c", "b-e", "X-a", "X-b", "X-c", "X-e", "P-Q:dashed", ...(labels ? ["P-p:blue", "Q-q:blue"] : [])],
    texts: labels ? [{ on: "P-p", text: `${r1}` }, { on: "Q-q", text: `${r2}` }] : [],
    nudge: { X: [0, 12], P: [0, 12], Q: [0, 12] },
  });
};

const eulerTri = (() => {
  const A: Pt = [1.1, 4.6], B: Pt = [0, 0], C: Pt = [7, 0];
  const O = circumcircle(A, B, C).c, H = orthocenter(A, B, C);
  const G: Pt = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
  return { A, B, C, O, H, G };
})();

export const fermat = (() => {
  const { A, B, C } = triangle(7, 5.5, 4.6);
  const A2 = equilateralOn(B, C, A), B2 = equilateralOn(C, A, B);
  const P = meet(A, A2, B, B2);
  return fig({ pts: { A, B, C, P }, shapes: ["A-B-C"], lines: ["A-B", "B-C", "C-A", "P-A:blue", "P-B:blue", "P-C:blue"], texts: [{ at: angleAt(P, A, B, 0.55), text: "120°" }, { at: angleAt(P, B, C, 0.55), text: "120°" }, { at: angleAt(P, C, A, 0.55), text: "120°" }], nudge: { P: [8, 10] } });
})();

export const simson = (() => {
  const circ = { c: [0, 0] as Pt, r: 2 };
  const A = polar(circ.c, 2, 110), B = polar(circ.c, 2, 205), C = polar(circ.c, 2, 330), P = polar(circ.c, 2, 50);
  const D = foot(P, B, C), E = foot(P, C, A), F = foot(P, A, B);
  return fig({ pts: { A, B, C, P, D, E, F }, circles: [circ], lines: ["A-B", "B-C", "C-A", "B-D", "C-D", "C-E", "A-E", "A-F", "B-F", "P-D:dashed", "P-E:dashed", "P-F:dashed", "D-F:blue"], rights: ["P-D-C", "P-E-A", "P-F-A"] });
})();

export const orthoRefl = (A: Pt, B: Pt, C: Pt, texts: { on: string; text: string }[] = []) => {
  const H = orthocenter(A, B, C), D = foot(A, B, C);
  const circ = circumcircle(A, B, C);
  const E = lineCircle(A, D, circ)[1];
  return fig({ pts: { A, B, C, H, D, E }, circles: [circ], lines: ["A-B", "B-C", "C-A", "A-E", "B-H:dashed", "C-H:dashed"], rights: ["A-D-C"], texts, nudge: { H: [12, 0], D: [10, 10] } });
};

export const trigCevaFig = (Bang: number, Cang: number, pb: number, pc: number, texts: (v: Record<string, Pt>) => { at: Pt; text: string }[]) => {
  const B: Pt = [0, 0], C: Pt = [5, 0];
  const A = meet(B, polar(B, 1, Bang), C, polar(C, 1, 180 - Cang));
  const P = meet(B, polar(B, 1, pb), C, polar(C, 1, 180 - pc));
  const pts = { A, B, C, P };
  return fig({ pts, lines: ["A-B", "B-C", "C-A", "A-P", "B-P", "C-P"], texts: texts(pts), nudge: { P: [12, -4] } });
};

const ptolemyQuad = (() => {
  const B: Pt = [-32.5, 0], D: Pt = [32.5, 0];
  const xa = (25 ** 2 - 60 ** 2 + 65 ** 2) / 130, xc = (39 ** 2 - 52 ** 2 + 65 ** 2) / 130;
  const A: Pt = [-32.5 + xa, Math.sqrt(25 ** 2 - xa ** 2)], C: Pt = [-32.5 + xc, -Math.sqrt(39 ** 2 - xc ** 2)];
  return { A, B, C, D };
})();

// ---- Formulas -------------------------------------------------------------

/** Geometry added in the second version of the bank: triangle centers and circle theorems. */
export const GEOMETRY_V2 = defineTopic("Geometry", [
  {
    id: "bretschneider",
    name: "Bretschneider's Formula",
    level: "AIME",
    statement: "K^2 = (s-a)(s-b)(s-c)(s-d) - abcd\\cos^2\\frac{A + C}{2}",
    setup: "Any quadrilateral with sides $a, b, c, d$, semiperimeter $s$, and opposite angles $A$ and $C$. For a cyclic one, $A + C = 180^\\circ$ and it becomes Brahmagupta's formula.",
    whenToUse: "The area of a quadrilateral from its sides and one pair of opposite angles, or the largest area with given sides.",
    figure: (() => {
      const A: Pt = [0, 0], B: Pt = [5, 0], C: Pt = [6, 3.4], D: Pt = [1.1, 4];
      return fig({ pts: { A, B, C, D }, shapes: ["A-B-C-D"], lines: ["A-B", "B-C", "C-D", "D-A"], texts: [{ on: "A-B", text: "a" }, { on: "B-C", text: "b" }, { on: "C-D", text: "c" }, { on: "D-A", text: "d" }] });
    })(),
    recall: [{ lhs: "K^2 =", answer: "(s-a)(s-b)(s-c)(s-d)-abcd\\cos^2\\frac{A+C}{2}", vars: { s: [10, 12], a: pos, b: pos, c: pos, d: pos, A: ang, C: ang } }],
    related: ["brahmagupta", "heron", "quad-area-diagonals"],
    problems: [
      { id: "v2g-bre1", text: "A quadrilateral has sides $1$, $4$, $7$, $8$ in some order around it. What is the largest area it can have?", answer: "18", solution: "The area is largest when the $\\cos^2$ term is $0$, i.e. when it's cyclic: $\\sqrt{9 \\cdot 6 \\cdot 3 \\cdot 2}$." },
      {
        id: "v2g-bre2",
        text: "Quadrilateral $ABCD$ has sides $AB = 4$, $BC = 3$, $CD = 4$, $DA = 3$, and $\\angle A = \\angle C = 60^\\circ$. Find its area.",
        answer: "6\\sqrt3",
        solution: "$s = 7$: $K^2 = 3 \\cdot 4 \\cdot 3 \\cdot 4 - 144\\cos^2 60^\\circ = 108$.",
        figure: (() => {
          const A: Pt = [0, 0], B: Pt = [4, 0], D = polar(A, 3, 60), C: Pt = [B[0] + D[0], D[1]];
          return fig({ pts: { A, B, C, D }, shapes: ["A-B-C-D"], lines: ["A-B", "B-C", "C-D", "D-A"], texts: [{ on: "A-B", text: "4" }, { on: "B-C", text: "3" }, { on: "C-D", text: "4" }, { on: "D-A", text: "3" }, { at: angleAt(A, B, D, 0.7), text: "60°" }] });
        })(),
      },
    ],
  },
  {
    id: "butterfly",
    name: "Butterfly Theorem",
    level: "AIME",
    statement: "M \\text{ the midpoint of chord } PQ \\implies MX = MY",
    setup: "Chords $AB$ and $CD$ pass through $M$. Lines $AD$ and $BC$ cross $PQ$ at $X$ and $Y$.",
    whenToUse: "Two chords through the midpoint of a third chord.",
    figure: butterflyFig(),
    recall: [{ lhs: "\\text{Butterfly: if } MX = x, \\text{ then } MY =", answer: "x", vars: { x: pos } }],
    related: ["power-of-a-point", "inscribed-angle"],
    problems: [
      { id: "v2g-bf1", text: "$M$ is the midpoint of chord $PQ$. Chords $AB$ and $CD$ pass through $M$, and $AD$, $BC$ meet $PQ$ at $X$ and $Y$. If $MX = 3$, find $MY$.", answer: "3", solution: "The butterfly theorem.", figure: butterflyFig([{ on: "M-X", text: "3" }]) },
      { id: "v2g-bf2", text: "In the same setup, $PQ = 20$ and $PX = 6$. Find $QY$.", answer: "6", solution: "$MX = 10 - 6 = 4$, so $MY = 4$ and $QY = 10 - 4$.", figure: butterflyFig() },
    ],
  },
  {
    id: "carnot",
    name: "Carnot's Theorem",
    level: "AIME",
    statement: "OX + OY + OZ = R + r",
    setup: "$O$ is the circumcenter and $X, Y, Z$ are its feet on the sides of an acute triangle. ($R$ circumradius, $r$ inradius.) In an obtuse triangle, the distance to the longest side counts as negative.",
    whenToUse: "Sums of distances from the circumcenter to the sides.",
    figure: carnotFig(t131415.A, t131415.B, t131415.C),
    recall: [{ lhs: "OX+OY+OZ \\ (\\text{acute triangle}) =", answer: "R+r", vars: { R: pos, r: pos } }],
    related: ["inradius-circumradius", "euler-oi"],
    problems: [
      { id: "v2g-ca1", text: "Find the sum of the distances from the circumcenter of the $13$-$14$-$15$ triangle to its three sides.", answer: "\\frac{97}{8}", solution: "$R + r = \\frac{65}{8} + 4$.", figure: carnotFig(t131415.A, t131415.B, t131415.C, [{ on: "A-B", text: "13" }, { on: "B-C", text: "14" }, { on: "C-A", text: "15" }]) },
      (() => {
        const { A, B, C } = triangle(6, 5, 5);
        return { id: "v2g-ca2", text: "A triangle has sides $5$, $5$, $6$. Its circumcenter is $\\frac78$ from the side of length $6$. How far is it from each of the other sides?", answer: "\\frac{15}{8}", solution: "$R = \\frac{25}{8}$ and $r = \\frac32$, so the three distances add to $\\frac{37}{8}$. Subtract $\\frac78$ and halve.", figure: carnotFig(A, B, C, [{ on: "A-B", text: "5" }, { on: "B-C", text: "6" }, { on: "C-A", text: "5" }]) };
      })(),
    ],
  },
  {
    id: "descartes-circle",
    name: "Descartes' Circle Theorem",
    level: "AIME",
    statement: "(k_1 + k_2 + k_3 + k_4)^2 = 2(k_1^2 + k_2^2 + k_3^2 + k_4^2)",
    setup: "Four circles, each tangent to the other three. The curvature is $k = \\frac1r$, negative for a circle that encloses the others. Solved: $k_4 = k_1 + k_2 + k_3 \\pm 2\\sqrt{k_1k_2 + k_2k_3 + k_3k_1}$.",
    whenToUse: "A circle tangent to three mutually tangent circles.",
    figure: fig({ pts: descartes, hide: ["A", "B", "C"], circles: [{ c: descartes.A, r: 1 }, { c: descartes.B, r: 2 }, { c: descartes.C, r: 3 }, { c: [21 / 23, 20 / 23], r: 6 / 23 }], texts: [{ at: descartes.A, text: "k₁" }, { at: descartes.B, text: "k₂" }, { at: descartes.C, text: "k₃" }] }),
    recall: [{ lhs: "k_4 \\text{ (curvatures } a, b, c\\text{, small circle)} =", answer: "a+b+c+2\\sqrt{ab+bc+ca}", vars: { a: pos, b: pos, c: pos } }],
    related: ["tangent-length", "common-tangents"],
    problems: [
      { id: "v2g-dc1", text: "Circles of radius $1$, $2$, $3$ are mutually tangent. Find the radius of the small circle tangent to all three.", answer: "\\frac{6}{23}", solution: "$k_4 = 1 + \\frac12 + \\frac13 + 2\\sqrt{\\frac12 + \\frac16 + \\frac13} = \\frac{23}{6}$.", figure: fig({ pts: descartes, hide: ["A", "B", "C"], circles: [{ c: descartes.A, r: 1 }, { c: descartes.B, r: 2 }, { c: descartes.C, r: 3 }, { c: [21 / 23, 20 / 23], r: 6 / 23 }], texts: [{ at: descartes.A, text: "1" }, { at: descartes.B, text: "2" }, { at: descartes.C, text: "3" }] }) },
      { id: "v2g-dc2", text: "Circles of radius $1$, $2$, $3$ are mutually tangent. Find the radius of the circle that encloses all three and is tangent to each.", answer: "6", solution: "$k_4 = \\frac{11}{6} - 2 = -\\frac16$; the minus sign means it encloses them.", figure: fig({ pts: descartes, hide: ["A", "B", "C"], circles: [{ c: descartes.A, r: 1 }, { c: descartes.B, r: 2 }, { c: descartes.C, r: 3 }, { c: [3, 4], r: 6, dashed: true }], texts: [{ at: descartes.A, text: "1" }, { at: descartes.B, text: "2" }, { at: descartes.C, text: "3" }] }) },
    ],
  },
  {
    id: "incenter-excenter",
    name: "Incenter-Excenter Lemma",
    level: "AIME",
    statement: "MB = MC = MI = MJ",
    setup: "$I$ is the incenter of triangle $ABC$, $J$ the excenter opposite $A$ (also written $I_A$), and $M$ the midpoint of arc $BC$. Line $AI$ passes through $M$ and $J$, and $M$ is the center of a circle through $B$, $C$, $I$, $J$.",
    whenToUse: "The incenter and a point on the circumcircle; lengths along the angle bisector from $A$.",
    figure: incEx,
    recall: [{ lhs: "\\text{If } MB = x, \\text{ then } IJ =", answer: "2x", vars: { x: pos } }],
    related: ["inscribed-angle", "exradius", "angle-bisector"],
    problems: [
      { id: "v2g-ie1", text: "In triangle $ABC$, $BC = 8$ and $\\angle A = 60^\\circ$. The bisector of $\\angle A$ meets the circumcircle again at $M$. Find $MI$, where $I$ is the incenter.", answer: "\\frac{8\\sqrt3}{3}", solution: "$R = \\frac{8}{2\\sin 60^\\circ}$ and $MI = MB = 2R\\sin 30^\\circ = R$." },
      { id: "v2g-ie2", text: "With $M$ as above, $MB = 7$. Find the distance from the incenter to the excenter opposite $A$.", answer: "14", solution: "$I$ and $J$ are opposite ends of a diameter of the circle centered at $M$." },
    ],
  },
  {
    id: "monge",
    name: "Monge's Theorem",
    level: "AIME",
    statement: "\\text{The three external tangent meeting points of three circles are collinear}",
    setup: "For each pair of circles, the two external tangents meet at a point (the external center of similitude). For circles $(P, a)$ and $(Q, b)$ it's on line $PQ$, beyond the smaller circle, with distances from $P$ and $Q$ in ratio $a : b$.",
    whenToUse: "Three circles and their external tangents.",
    figure: monge,
    recall: [{ lhs: "\\text{External center of } (P, a), (Q, b): \\ \\frac{XP}{XQ} =", answer: "\\frac ab", vars: { a: pos, b: pos } }],
    related: ["homothety", "common-tangents", "menelaus"],
    problems: [
      { id: "v2g-mo1", text: "Circles centered at $(0, 0)$ and $(4, 0)$ have radii $1$ and $2$. Their external tangents meet at $X$. Find the $x$-coordinate of $X$.", answer: "-4", solution: "$\\frac{XP}{XQ} = \\frac12$ with $X$ beyond the smaller circle: $X = (-4, 0)$.", figure: homothetyFig(1, 2, 4, false) },
      { id: "v2g-mo2", text: "Add a third circle centered at $(0, 6)$ with radius $3$. The external tangent points for the three pairs lie on one line. Find its slope.", answer: "-\\frac34", solution: "For the first and third circles, $X$ is $(0, -3)$. The line through $(-4, 0)$ and $(0, -3)$ has slope $-\\frac34$." },
    ],
  },
  {
    id: "routh",
    name: "Routh's Theorem",
    level: "AIME",
    statement: "\\frac{[\\text{inner}]}{[ABC]} = \\frac{(xyz - 1)^2}{(xy + x + 1)(yz + y + 1)(zx + z + 1)}",
    setup: "Cevians $AD$, $BE$, $CF$ with $\\frac{BD}{DC} = x$, $\\frac{CE}{EA} = y$, $\\frac{AF}{FB} = z$ cut out an inner triangle. If all three ratios are $x$, it's $\\frac{(x-1)^2}{x^2 + x + 1}$.",
    whenToUse: "The area of the triangle made by three cevians.",
    figure: routhFig(2, []),
    recall: [{ lhs: "\\text{Routh with all ratios } x: \\frac{[\\text{inner}]}{[ABC]} =", answer: "\\frac{(x-1)^2}{x^2+x+1}", vars: { x: [1.5, 5] } }],
    related: ["mass-points", "ceva", "same-height-areas"],
    problems: [
      { id: "v2g-ro1", text: "Points $D$, $E$, $F$ divide $BC$, $CA$, $AB$ in ratio $2 : 1$. What fraction of the area of $ABC$ is the triangle formed by $AD$, $BE$, $CF$?", answer: "\\frac17", solution: "$\\frac{(8-1)^2}{7 \\cdot 7 \\cdot 7}$.", figure: routhFig(2, [{ on: "B-D", text: "2" }, { on: "D-C", text: "1" }]) },
      { id: "v2g-ro2", text: "Same, but with ratio $3 : 1$.", answer: "\\frac{4}{13}", solution: "$\\frac{(3-1)^2}{9 + 3 + 1}$.", figure: routhFig(3, [{ on: "B-D", text: "3" }, { on: "D-C", text: "1" }]) },
    ],
  },
  {
    id: "van-aubel",
    name: "Van Aubel's Theorem (Cevians)",
    level: "AIME",
    statement: "\\frac{AO}{OD} = \\frac{AE}{EC} + \\frac{AF}{FB}",
    setup: "Cevians $AD$, $BE$, $CF$ of triangle $ABC$ meet at $O$.",
    whenToUse: "How a point where cevians meet divides one of them.",
    figure: cevians(...([[1.4, 4.2], [0, 0], [6, 0]] as [Pt, Pt, Pt]), 0.38, 0.45),
    recall: [{ lhs: "\\frac{AO}{OD} \\text{ with } \\frac{AE}{EC}=x,\\ \\frac{AF}{FB}=y:", answer: "x+y", vars: { x: pos, y: pos } }],
    related: ["mass-points", "ceva"],
    problems: [
      { id: "v2g-va1", text: "Cevians $AD$, $BE$, $CF$ meet at $O$, with $\\frac{AF}{FB} = \\frac12$ and $\\frac{AE}{EC} = \\frac13$. Find $\\frac{AO}{OD}$.", answer: "\\frac56", solution: "$\\frac13 + \\frac12$.", figure: cevians([1.4, 4.2], [0, 0], [6, 0], 1 / 3, 1 / 4) },
      { id: "v2g-va2", text: "Cevians $AD$, $BE$, $CF$ meet at $O$, with $\\frac{AE}{EC} = 2$ and $\\frac{AF}{FB} = \\frac32$. Find $\\frac{AO}{OD}$.", answer: "\\frac72", solution: "$2 + \\frac32$.", figure: cevians([1.4, 4.2], [0, 0], [6, 0], 3 / 5, 2 / 3) },
    ],
  },
  {
    id: "viviani",
    name: "Viviani's Theorem",
    level: "AMC 10",
    statement: "\\text{In an equilateral triangle, the distances from any inside point to the sides add up to the height}",
    setup: "The height of an equilateral triangle with side $s$ is $\\frac{\\sqrt3}{2}s$.",
    whenToUse: "A point inside an equilateral triangle with known distances to some sides.",
    figure: vivianiFig([2.4, 1.3], 6),
    recall: [{ lhs: "\\text{Sum of the distances to the sides, side } s:", answer: "\\frac{\\sqrt3}{2}s", vars: { s: pos } }],
    related: ["same-height-areas"],
    problems: [
      { id: "v2g-vi1", text: "A point inside an equilateral triangle with side $6$ is $1$ from one side and $2$ from another. How far is it from the third side?", answer: "3\\sqrt3-3", solution: "The three distances add to $3\\sqrt3$.", figure: vivianiFig([5 / Math.sqrt(3), 1], 6, [{ on: "P-X", text: "1" }, { on: "P-Z", text: "2" }]) },
      { id: "v2g-vi2", text: "Any point inside an equilateral triangle with side $10$: what is the sum of its distances to the three sides?", answer: "5\\sqrt3", solution: "The height, $\\frac{\\sqrt3}{2} \\cdot 10$." },
    ],
  },
  {
    id: "mass-points",
    name: "Mass Points",
    level: "AMC 12",
    statement: "\\text{Masses } b \\text{ at } B, \\ c \\text{ at } C \\text{ balance at } D: \\ \\frac{BD}{DC} = \\frac cb, \\ \\text{mass at } D = b + c",
    setup: "Put masses on the vertices so each cevian's foot balances its side. Then where cevians cross, each one is split in the inverse ratio of the masses at its ends.",
    whenToUse: "Ratios of segments cut by crossing cevians.",
    figure: massFig(1 / 3, 1 / 2, [{ on: "B-D", text: "1" }, { on: "D-C", text: "2" }, { on: "A-E", text: "1" }, { on: "E-C", text: "1" }]),
    recall: [{ lhs: "\\text{Masses } b \\text{ at } B,\\ c \\text{ at } C \\text{ balance at } D: \\frac{BD}{DC} =", answer: "\\frac cb", vars: { b: pos, c: pos } }],
    related: ["van-aubel", "ceva", "menelaus"],
    problems: [
      { id: "v2g-mp1x", text: "In triangle $ABC$, $D$ is on $BC$ with $BD : DC = 1 : 2$ and $E$ is the midpoint of $AC$. $AD$ and $BE$ meet at $P$. Find $\\frac{AP}{PD}$.", answer: "3", solution: "Masses $B = 2$, $C = 1$, $A = 1$. $D$ gets $3$, so $\\frac{AP}{PD} = \\frac31$.", figure: massFig(1 / 3, 1 / 2, [{ on: "B-D", text: "1" }, { on: "D-C", text: "2" }, { on: "A-E", text: "1" }, { on: "E-C", text: "1" }]) },
      { id: "v2g-mp2x", text: "In triangle $ABC$, $BD : DC = 3 : 2$ with $D$ on $BC$, and $AE : EC = 2 : 1$ with $E$ on $AC$. $AD$ and $BE$ meet at $P$. Find $\\frac{BP}{PE}$.", answer: "\\frac94", solution: "Masses $B = 2$, $C = 3$, $A = \\frac32$. $E$ gets $\\frac92$, so $\\frac{BP}{PE} = \\frac{9/2}{2}$.", figure: massFig(3 / 5, 2 / 3, [{ on: "B-D", text: "3" }, { on: "D-C", text: "2" }, { on: "A-E", text: "2" }, { on: "E-C", text: "1" }]) },
    ],
  },
  {
    id: "radical-axis",
    name: "Radical Axis",
    level: "AIME",
    statement: "\\text{Points with equal power to two circles form a line} \\perp \\text{the line of centers}",
    setup: "Subtract the two circle equations (each written as $x^2 + y^2 + \\cdots = 0$) to get the line. For crossing circles it's the line through both crossing points. Three circles' axes meet at one point.",
    whenToUse: "Common chords, equal tangent lengths to two circles, or three circles at once.",
    figure: (() => {
      const P: Pt = [0, 0], Q: Pt = [6, 0], X: Pt = [4, 3], Y: Pt = [4, -3], T: Pt = [4, 6.5];
      const u = tangentPoints(T, { c: P, r: 5 })[1], v = tangentPoints(T, { c: Q, r: Math.sqrt(13) })[0];
      return fig({ pts: { P, Q, X, Y, T, u, v }, hide: ["u", "v"], circles: [{ c: P, r: 5 }, { c: Q, r: Math.sqrt(13) }], lines: ["T-Y:blue", "P-Q:dashed", "T-u:rose", "T-v:rose"] });
    })(),
    recall: [{ lhs: "\\text{Radical axis of } x^2+y^2=r^2 \\text{ and } (x-d)^2+y^2=s^2: \\ x =", answer: "\\frac{d^2+r^2-s^2}{2d}", vars: { d: pos, r: pos, s: pos } }],
    related: ["power-of-a-point", "coordinate-power"],
    problems: [
      { id: "v2g-rx1", text: "The circles $x^2 + y^2 = 25$ and $(x - 6)^2 + y^2 = 13$ cross at two points. The line through them is $x = c$. Find $c$.", answer: "4", solution: "Subtract: $12x - 36 = 12$." },
      {
        id: "v2g-rx2",
        text: "Find the $y$-coordinate of the point with equal power to the circles $x^2 + y^2 = 1$, $(x - 4)^2 + y^2 = 1$ and $x^2 + (y - 6)^2 = 4$.",
        answer: "\\frac{11}{4}",
        solution: "The first two give $x = 2$. The first and third give $12y - 36 = -3$.",
        figure: fig({ pts: { P: [0, 0], Q: [4, 0], R: [0, 6], u: [2, -1.5], v: [2, 8], w: [-2.5, 11 / 4], z: [5.5, 11 / 4] }, hide: ["u", "v", "w", "z"], circles: [{ c: [0, 0], r: 1 }, { c: [4, 0], r: 1 }, { c: [0, 6], r: 2 }], lines: ["u-v:dashed", "w-z:dashed"] }),
      },
    ],
  },
  {
    id: "homothety",
    name: "Homothety",
    level: "AMC 12",
    statement: "\\text{A homothety with center } X \\text{ and ratio } k \\text{ multiplies lengths by } |k| \\text{ and areas by } k^2",
    setup: "Any two circles are homothetic. The external tangents meet at the external center, which splits the line of centers externally in the ratio of the radii; the internal tangents meet at the internal center.",
    whenToUse: "Two circles and their common tangents, or similar figures sharing a center.",
    figure: homothetyFig(1, 2.2, 5, false, false),
    recall: [{ lhs: "\\text{Homothety with ratio } k \\text{ multiplies areas by}", answer: "k^2", vars: { k: pos } }],
    related: ["monge", "common-tangents", "spiral-similarity"],
    problems: [
      { id: "v2g-ho1", text: "Circles of radius $2$ and $6$ have centers $10$ apart. Their external tangents meet at $X$. How far is $X$ from the center of the smaller circle?", answer: "5", solution: "$\\frac{x}{x + 10} = \\frac26$.", figure: homothetyFig(2, 6, 10, false) },
      { id: "v2g-ho2", text: "For the same circles, the internal tangents meet at $X$. How far is $X$ from the center of the larger circle?", answer: "\\frac{15}{2}", solution: "$X$ splits the $10$ in ratio $2 : 6$: $10 \\cdot \\frac68$.", figure: homothetyFig(2, 6, 10, true) },
    ],
  },
  {
    id: "ptolemy-inequality",
    name: "Ptolemy's Inequality",
    level: "AIME",
    statement: "AC \\cdot BD \\le AB \\cdot CD + AD \\cdot BC",
    setup: "For any four points. Equality holds exactly when $ABCD$ is a cyclic quadrilateral (in that order).",
    whenToUse: "Bounding a product of diagonals, or $PA \\le PB + PC$ for an equilateral triangle $ABC$.",
    figure: (() => {
      const A: Pt = [0, 0], B: Pt = [5, -0.4], C: Pt = [5.6, 3.2], D: Pt = [0.8, 3.6];
      return fig({ pts: { A, B, C, D }, shapes: ["A-B-C-D"], lines: ["A-B", "B-C", "C-D", "D-A", "A-C:blue", "B-D:blue"] });
    })(),
    recall: [{ lhs: "pq \\le \\ (\\text{sides } a, b, c, d \\text{ in order, diagonals } p, q)", answer: "ac+bd", vars: { a: pos, b: pos, c: pos, d: pos } }],
    related: ["ptolemy", "abs-triangle"],
    problems: [
      { id: "v2g-pi1", text: "Quadrilateral $ABCD$ has $AB = 3$, $BC = 4$, $CD = 5$, $DA = 6$. What is the largest possible value of $AC \\cdot BD$?", answer: "39", solution: "$3 \\cdot 5 + 6 \\cdot 4$, reached when $ABCD$ is cyclic." },
      {
        id: "v2g-pi2",
        text: "$ABC$ is equilateral and $P$ is a point with $PB = 2$ and $PC = 3$. What is the largest possible value of $PA$?",
        answer: "5",
        solution: "Ptolemy's inequality on $A, B, P, C$ with equal sides: $PA \\le PB + PC$, with equality on arc $BC$.",
      },
    ],
  },
  {
    id: "isoperimetric",
    name: "Isoperimetric Inequality",
    level: "AMC 12",
    statement: "4\\pi A \\le L^2",
    setup: "A closed curve of length $L$ encloses area $A$. Equality holds only for a circle. Among $n$-gons with a fixed perimeter, the regular one has the most area.",
    whenToUse: "The largest area a fence or rope of fixed length can enclose.",
    figure: (() => {
      const h = Math.PI / 4; // a square with the same perimeter as the unit circle
      return fig({ pts: { a: [2.4 - h, -h], b: [2.4 + h, -h], c: [2.4 + h, h], d: [2.4 - h, h] }, hide: ["a", "b", "c", "d"], circles: [{ c: [0, 0], r: 1 }], shapes: ["a-b-c-d"], lines: ["a-b", "b-c", "c-d", "d-a"], texts: [{ at: [0, 0], text: "π" }, { at: [2.4, 0], text: "π²/4" }] });
    })(),
    recall: [{ lhs: "\\text{Largest area enclosed by a curve of length } L:", answer: "\\frac{L^2}{4\\pi}", vars: { L: pos } }],
    related: ["amgm", "regular-ngon-area"],
    problems: [
      { id: "v2g-ip1", text: "What is the largest area a loop of rope of length $20$ can enclose?", answer: "\\frac{100}{\\pi}", solution: "A circle with $2\\pi r = 20$." },
      { id: "v2g-ip2", text: "A fence of length $40$ and a long straight wall enclose a region (the wall needs no fence). What is the largest possible area?", answer: "\\frac{800}{\\pi}", solution: "Reflect over the wall: a loop of length $80$ encloses at most $\\frac{6400}{4\\pi}$, so half of that. It's a semicircle." },
    ],
  },
  {
    id: "acute-obtuse-test",
    name: "Acute or Obtuse Test",
    level: "AMC 10",
    statement: "c^2 < a^2 + b^2 \\iff C \\text{ acute}, \\qquad c^2 > a^2 + b^2 \\iff C \\text{ obtuse}",
    setup: "$c$ is the side opposite angle $C$. A triangle is acute when this holds for its longest side.",
    whenToUse: "Deciding whether a triangle with given sides is acute, right or obtuse.",
    figure: (() => {
      const A: Pt = [0, 0], B: Pt = [6, 0], C: Pt = [2.2, 1.6];
      return fig({ pts: { A, B, C }, shapes: ["A-B-C"], circles: [{ c: [3, 0], r: 3, dashed: true }], lines: ["A-B", "B-C", "C-A"], texts: [{ on: "A-B", text: "c" }, { on: "B-C", text: "a" }, { on: "C-A", text: "b" }] });
    })(),
    recall: [{ lhs: "\\text{Angle } C \\text{ is obtuse exactly when } c^2 >", answer: "a^2+b^2", vars: { a: pos, b: pos } }],
    related: ["law-of-cosines"],
    problems: [
      { id: "v2g-ao1", text: "For how many integers $x$ is the triangle with sides $4$, $5$, $x$ obtuse?", answer: "3", solution: "Triangle: $1 < x < 9$. Obtuse at $x$: $x^2 > 41$, so $x = 7, 8$. Obtuse at the side $5$: $25 > 16 + x^2$, so $x = 2$." },
      { id: "v2g-ao2", text: "What is the largest integer $c$ for which the triangle with sides $6$, $8$, $c$ is acute?", answer: "9", solution: "Need $c^2 < 100$ (and $64 < 36 + c^2$)." },
    ],
  },
  {
    id: "exradius",
    name: "Exradii",
    level: "AIME",
    statement: "r_a = \\frac{K}{s - a}, \\qquad rr_ar_br_c = K^2, \\qquad \\frac1r = \\frac1{r_a} + \\frac1{r_b} + \\frac1{r_c}",
    setup: "The excircle opposite $A$ touches side $a$ and the extensions of the other two. $K$ is the area and $s$ the semiperimeter.",
    whenToUse: "Radii of excircles, or relations among all four tangent circles.",
    figure: (() => {
      const { A, B, C } = triangle(5, 4.2, 3.4);
      const ex = excircle(A, B, C), T = foot(ex.c, B, C);
      const [, Bx] = lineCircle(A, B, { c: A, r: dist(A, ex.c) * 1.25 }), [, Cx] = lineCircle(A, C, { c: A, r: dist(A, ex.c) * 1.25 });
      return fig({ pts: { A, B, C, J: ex.c, T, u: Bx, v: Cx }, hide: ["T", "u", "v"], shapes: ["A-B-C"], circles: [ex], lines: ["A-u", "A-v", "B-C", "J-T:blue"], texts: [{ on: "J-T", text: "rₐ" }], nudge: { J: [0, 12], T: [0, 0] } });
    })(),
    recall: [{ lhs: "r_a =", answer: "\\frac{K}{s-a}", vars: { K: pos, s: [10, 15], a: pos } }],
    related: ["inradius-circumradius", "heron", "incenter-excenter"],
    problems: [
      { id: "v2g-ex1", text: "A triangle has sides $13$, $14$, $15$. Find the radius of the excircle opposite the side of length $14$.", answer: "12", solution: "$\\frac{84}{21 - 14}$." },
      { id: "v2g-ex2", text: "For the $3$-$4$-$5$ triangle, find the product of its three exradii.", answer: "36", solution: "$r_ar_br_c = \\frac{K^2}{r} = \\frac{36}{1}$; directly, $2 \\cdot 3 \\cdot 6$." },
    ],
  },
  {
    id: "tangential-area",
    name: "Area of a Tangential Polygon",
    level: "AMC 12",
    statement: "K = rs",
    setup: "Any polygon with an inscribed circle of radius $r$; $s$ is half the perimeter. Cut it into triangles from the center, each with height $r$.",
    whenToUse: "Area of a polygon circumscribed about a circle.",
    figure: (() => {
      const { r, O, corners } = tangentialQuad([1.5, 6, 1.5, 6]);
      const [A, B, C, D] = corners;
      return fig({ pts: { A, B, C, D, O, T: polar(O, r, 0) }, hide: ["T"], shapes: ["A-B-C-D"], circles: [{ c: O, r }], lines: ["A-B", "B-C", "C-D", "D-A", "O-T:blue"], texts: [{ on: "O-T", text: "r" }] });
    })(),
    recall: [{ lhs: "K \\ (\\text{tangential polygon, inradius } r, \\text{ semiperimeter } s) =", answer: "rs", vars: { r: pos, s: pos } }],
    related: ["inradius-circumradius", "pitot"],
    problems: [
      { id: "v2g-ta1", text: "A quadrilateral with perimeter $30$ is circumscribed about a circle of radius $3$. Find its area.", answer: "45", solution: "$3 \\cdot 15$." },
      { id: "v2g-ta2", text: "A regular hexagon has inradius $\\sqrt3$. Find its area.", answer: "6\\sqrt3", solution: "Its side is $2$, so $s = 6$ and $K = \\sqrt3 \\cdot 6$." },
    ],
  },
  {
    id: "euler-line",
    name: "Euler Line",
    level: "AIME",
    statement: "O, G, H \\text{ are collinear}, \\qquad HG = 2\\,GO",
    setup: "$O$ circumcenter, $G$ centroid, $H$ orthocenter. With $O$ at the origin, $H = A + B + C$ as vectors.",
    whenToUse: "Finding the orthocenter from the circumcenter and centroid, or the reverse.",
    figure: fig({ pts: eulerTri, shapes: ["A-B-C"], lines: ["A-B", "B-C", "C-A", "O-H:blue"], nudge: { H: [-4, -6], G: [0, -14], O: [8, 6] } }),
    recall: [{ lhs: "OH \\text{ when } OG = g:", answer: "3g", vars: { g: pos } }],
    related: ["centroid", "nine-point-circle", "oh-formula"],
    problems: [
      { id: "v2g-el1", text: "A triangle has circumcenter $(1, 2)$ and centroid $(3, 4)$. Find the sum of the coordinates of its orthocenter.", answer: "17", solution: "$H = O + 3(G - O) = (7, 10)$." },
      {
        id: "v2g-el2",
        text: "Find the distance between the circumcenter and orthocenter of the triangle with vertices $(0, 0)$, $(6, 0)$, $(2, 4)$.",
        answer: "\\sqrt2",
        solution: "$O = (3, 1)$ and $G = (\\frac83, \\frac43)$, so $H = 3G - 2O = (2, 2)$.",
        figure: fig({ pts: { A: [0, 0], B: [6, 0], C: [2, 4] }, shapes: ["A-B-C"], lines: ["A-B", "B-C", "C-A"] }),
      },
    ],
  },
  {
    id: "nine-point-circle",
    name: "Nine-Point Circle",
    level: "AIME",
    statement: "\\text{radius} = \\frac R2, \\qquad \\text{center } N = \\text{midpoint of } OH",
    setup: "It passes through the three side midpoints, the three feet of the altitudes, and the midpoints of $AH$, $BH$, $CH$.",
    whenToUse: "Circles through midpoints or feet of altitudes.",
    figure: (() => {
      const { A, B, C, O, H } = eulerTri;
      const N = mid(O, H);
      const pts = { A, B, C, H, N, d: foot(A, B, C), e: foot(B, C, A), f: foot(C, A, B), x: mid(B, C), y: mid(C, A), z: mid(A, B) };
      return fig({ pts, hide: ["d", "e", "f", "x", "y", "z"], circles: [{ c: N, r: dist(N, pts.x), dashed: true }], lines: ["A-B", "B-C", "C-A", "A-d:blue", "B-e:blue", "C-f:blue"], nudge: { H: [-14, 4] } });
    })(),
    recall: [{ lhs: "\\text{Radius of the nine-point circle:}", answer: "\\frac R2", vars: { R: pos } }],
    related: ["euler-line", "feuerbach"],
    problems: [
      { id: "v2g-np1", text: "A right triangle has legs $6$ and $8$. Find the radius of its nine-point circle.", answer: "\\frac52", solution: "$R = 5$, half the hypotenuse." },
      { id: "v2g-np2", text: "A triangle has circumcenter $(0, 0)$ and orthocenter $(4, 6)$. Find the sum of the coordinates of the center of its nine-point circle.", answer: "5", solution: "The midpoint $(2, 3)$." },
    ],
  },
  {
    id: "oh-formula",
    name: "Distance from Circumcenter to Orthocenter",
    level: "AIME",
    statement: "OH^2 = 9R^2 - (a^2 + b^2 + c^2)",
    setup: "$O$ circumcenter, $H$ orthocenter, $R$ circumradius, $a, b, c$ the sides.",
    whenToUse: "The length of the Euler line, or $a^2 + b^2 + c^2$ from $R$ and $OH$.",
    figure: fig({ pts: { A: eulerTri.A, B: eulerTri.B, C: eulerTri.C, O: eulerTri.O, H: eulerTri.H }, circles: [circumcircle(eulerTri.A, eulerTri.B, eulerTri.C)], lines: ["A-B", "B-C", "C-A", "O-H:blue"], nudge: { O: [8, 8] } }),
    recall: [{ lhs: "OH^2 =", answer: "9R^2-(a^2+b^2+c^2)", vars: { R: [3, 5], a: pos, b: pos, c: pos } }],
    related: ["euler-line", "euler-oi"],
    problems: [
      { id: "v2g-oh1", text: "Find $OH^2$ for the $13$-$14$-$15$ triangle.", answer: "\\frac{265}{64}", solution: "$9\\left(\\frac{65}{8}\\right)^2 - 590 = \\frac{38025 - 37760}{64}$." },
      { id: "v2g-oh2", text: "A triangle has circumradius $3$ and $a^2 + b^2 + c^2 = 60$. Find $OH$.", answer: "\\sqrt{21}", solution: "$\\sqrt{81 - 60}$." },
    ],
  },
  {
    id: "fermat-point",
    name: "Fermat Point",
    level: "AIME",
    statement: "(PA + PB + PC)_{\\min}^2 = \\frac{a^2 + b^2 + c^2}{2} + 2\\sqrt3\\,K",
    setup: "If every angle is under $120^\\circ$, the sum $PA + PB + PC$ is smallest at the point where the sides subtend $120^\\circ$ each. $K$ is the area.",
    whenToUse: "The shortest network joining three points.",
    figure: fermat,
    recall: [{ lhs: "(PA+PB+PC)_{\\min}^2 =", answer: "\\frac{a^2+b^2+c^2}{2}+2\\sqrt3K", vars: { a: pos, b: pos, c: pos, K: pos } }],
    related: ["rotation", "law-of-cosines"],
    problems: [
      { id: "v2g-fe1", text: "Find the smallest possible value of $PA + PB + PC$ for a $3$-$4$-$5$ triangle $ABC$.", answer: "\\sqrt{25+12\\sqrt3}", solution: "$\\frac{9 + 16 + 25}{2} + 2\\sqrt3 \\cdot 6$." },
      { id: "v2g-fe2", text: "Find the smallest possible value of $PA + PB + PC$ for an equilateral triangle with side $6$.", answer: "6\\sqrt3", solution: "$P$ is the center, $2\\sqrt3$ from each vertex." },
    ],
  },
  {
    id: "simson-line",
    name: "Simson Line",
    level: "AIME",
    statement: "P \\text{ on the circumcircle} \\iff \\text{its feet } D, E, F \\text{ on the sides are collinear}",
    setup: "$D$, $E$, $F$ are the feet of the perpendiculars from $P$ to lines $BC$, $CA$, $AB$. The feet on $AB$ and $AC$ are $PA\\sin A$ apart.",
    whenToUse: "Perpendiculars from a point on the circumcircle to the sides.",
    figure: simson,
    recall: [{ lhs: "\\text{Distance between the feet on } AB \\text{ and } AC \\ (PA = d):", answer: "d\\sin A", vars: { d: pos, A: ang } }],
    related: ["inscribed-angle", "cyclic-quadrilateral"],
    problems: [
      { id: "v2g-si1", text: "$P$ is the point on the circumcircle of triangle $ABC$ opposite $A$ (so $AP$ is a diameter), and $BC = 7$. Find the distance between the feet of the perpendiculars from $P$ to $AB$ and $AC$.", answer: "7", solution: "Since $AP$ is a diameter, those feet are $B$ and $C$." },
      { id: "v2g-si2", text: "An equilateral triangle $ABC$ with side $6$ is inscribed in a circle, and $P$ is on the circle with $PA = 4$. Find the distance between the feet of the perpendiculars from $P$ to $AB$ and $AC$.", answer: "2\\sqrt3", solution: "$PA\\sin 60^\\circ$: $P$, $A$ and the two feet lie on a circle with diameter $PA$." },
    ],
  },
  {
    id: "orthocenter-reflection",
    name: "Orthocenter Reflection Lemma",
    level: "AIME",
    statement: "HD = DE, \\qquad AH = 2R\\cos A",
    setup: "The altitude from $A$ meets $BC$ at $D$ and the circumcircle again at $E$. So the reflection of the orthocenter $H$ over any side lies on the circumcircle.",
    whenToUse: "Lengths along an altitude, or the distance from a vertex to the orthocenter.",
    figure: orthoRefl(...([[1.6, 4.2], [0, 0], [6, 0]] as [Pt, Pt, Pt])),
    recall: [{ lhs: "AH \\ (\\text{circumradius } R) =", answer: "2R\\cos A", vars: { R: pos, A: ang } }],
    related: ["power-of-a-point", "euler-line"],
    problems: [
      { id: "v2g-or1", text: "An acute triangle has circumradius $5$ and $\\angle A = 60^\\circ$. Find the distance from $A$ to the orthocenter.", answer: "5", solution: "$2 \\cdot 5 \\cos 60^\\circ$." },
      { id: "v2g-or2", text: "In acute triangle $ABC$, the altitude from $A$ meets $BC$ at $D$, with $BD = 4$, $DC = 9$ and $AD = 12$. Find $HD$, where $H$ is the orthocenter.", answer: "3", solution: "$HD = DE$, and power of $D$: $AD \\cdot DE = BD \\cdot DC$, so $DE = \\frac{36}{12}$.", figure: orthoRefl([0, 12], [-4, 0], [9, 0], [{ on: "B-D", text: "4" }, { on: "D-C", text: "9" }]) },
    ],
  },
  {
    id: "trig-ceva",
    name: "Trig Ceva",
    level: "AIME",
    statement: "\\frac{\\sin\\angle BAP}{\\sin\\angle PAC}\\cdot\\frac{\\sin\\angle CBP}{\\sin\\angle PBA}\\cdot\\frac{\\sin\\angle ACP}{\\sin\\angle PCB} = 1",
    setup: "Lines from $A$, $B$, $C$ through a common point $P$. Each fraction compares the two angles a cevian makes at its vertex. It holds exactly when the three lines meet.",
    whenToUse: "Angle chasing with cevians where Ceva's ratios of lengths aren't given.",
    figure: trigCevaFig(55, 70, 25, 30, () => []),
    recall: [{ lhs: "\\frac{\\sin\\angle BAP}{\\sin\\angle PAC}\\cdot\\frac{\\sin\\angle CBP}{\\sin\\angle PBA}\\cdot\\frac{\\sin\\angle ACP}{\\sin\\angle PCB} =", answer: "1", vars: {} }],
    related: ["ceva", "law-of-sines"],
    problems: [
      {
        id: "v2g-tc1",
        text: "In triangle $ABC$, $\\angle A = 20^\\circ$, $\\angle B = 60^\\circ$, $\\angle C = 100^\\circ$. $P$ is the point with $\\angle PAB = \\angle PAC = 10^\\circ$ and $\\angle PBC = 20^\\circ$. Find $\\angle PCB$ in degrees.",
        answer: "30",
        solution: "$\\frac{\\sin 10^\\circ}{\\sin 10^\\circ} \\cdot \\frac{\\sin 20^\\circ}{\\sin 40^\\circ} \\cdot \\frac{\\sin(100^\\circ - x)}{\\sin x} = 1$, so $\\frac{\\sin(100^\\circ - x)}{\\sin x} = 2\\cos 20^\\circ$, and $x = 30^\\circ$ works: $\\sin 70^\\circ = 2\\cos 20^\\circ\\sin 30^\\circ$.",
        figure: trigCevaFig(60, 100, 20, 30, ({ B, C, P }) => [{ at: angleAt(B, P, C, 1.2), text: "20°" }]),
      },
      {
        id: "v2g-tc2",
        text: "Point $P$ inside triangle $ABC$ has $\\angle PAB = 20^\\circ$, $\\angle PAC = 10^\\circ$, $\\angle PBA = 30^\\circ$ and $\\angle PBC = 20^\\circ$. Find $\\angle PCB$ in degrees.",
        answer: "60",
        solution: "$\\angle C = 100^\\circ$. Trig Ceva: $\\frac{\\sin 20^\\circ}{\\sin 10^\\circ} \\cdot \\frac{\\sin 20^\\circ}{\\sin 30^\\circ} \\cdot \\frac{\\sin(100^\\circ - x)}{\\sin x} = 1$, and $x = 60^\\circ$ works.",
        figure: trigCevaFig(50, 100, 20, 60, ({ A, B, C, P }) => [{ at: angleAt(B, P, C, 1.3), text: "20°" }, { at: angleAt(B, A, P, 1.3), text: "30°" }, { at: angleAt(A, B, P, 3.5), text: "20°" }, { at: angleAt(A, P, C, 3.5), text: "10°" }]),
      },
    ],
  },
  {
    id: "ptolemy-second",
    name: "Ptolemy's Second Theorem",
    level: "AIME",
    statement: "\\frac{AC}{BD} = \\frac{ad + bc}{ab + cd}",
    setup: "Cyclic quadrilateral $ABCD$ with $a = AB$, $b = BC$, $c = CD$, $d = DA$. Each diagonal goes with the products of the sides meeting at its ends. With Ptolemy's $AC \\cdot BD = ac + bd$ it gives both diagonals.",
    whenToUse: "The individual diagonals of a cyclic quadrilateral with known sides.",
    figure: fig({ pts: ptolemyQuad, circles: [{ c: [0, 0], r: 32.5 }], lines: ["A-B", "B-C", "C-D", "D-A", "A-C:blue", "B-D:blue"], texts: [{ on: "A-B", text: "a" }, { on: "B-C", text: "b" }, { on: "C-D", text: "c" }, { on: "D-A", text: "d" }] }),
    recall: [{ lhs: "\\frac{AC}{BD} =", answer: "\\frac{ad+bc}{ab+cd}", vars: { a: pos, b: pos, c: pos, d: pos } }],
    related: ["ptolemy", "brahmagupta"],
    problems: [
      { id: "v2g-ps1", text: "A cyclic quadrilateral $ABCD$ has $AB = 25$, $BC = 39$, $CD = 52$, $DA = 60$. Find $\\frac{AC}{BD}$.", answer: "\\frac{56}{65}", solution: "$\\frac{25 \\cdot 60 + 39 \\cdot 52}{25 \\cdot 39 + 52 \\cdot 60} = \\frac{3528}{4095}$.", figure: fig({ pts: ptolemyQuad, circles: [{ c: [0, 0], r: 32.5 }], lines: ["A-B", "B-C", "C-D", "D-A", "A-C:blue", "B-D:blue"], texts: [{ on: "A-B", text: "25" }, { on: "B-C", text: "39" }, { on: "C-D", text: "52" }, { on: "D-A", text: "60" }] }) },
      { id: "v2g-ps2", text: "For the same quadrilateral, find $BD$.", answer: "65", solution: "Ptolemy: $AC \\cdot BD = 25 \\cdot 52 + 39 \\cdot 60 = 3640$. With $AC = \\frac{56}{65}BD$, $BD^2 = 4225$." },
    ],
  },
  {
    id: "pitot",
    name: "Pitot Theorem",
    level: "AMC 12",
    statement: "a + c = b + d",
    setup: "A quadrilateral with an inscribed circle and sides $a, b, c, d$ in order. Opposite sides have equal sums, because the two tangents from each corner are equal.",
    whenToUse: "Quadrilaterals (or trapezoids) circumscribed about a circle.",
    figure: (() => {
      const { r, O, corners } = tangentialQuad([3, 4, 4, 6]);
      const [A, B, C, D] = corners;
      return fig({ pts: { A, B, C, D }, shapes: ["A-B-C-D"], circles: [{ c: O, r }], lines: ["A-B", "B-C", "C-D", "D-A"], texts: [{ on: "A-B", text: "a" }, { on: "B-C", text: "b" }, { on: "C-D", text: "c" }, { on: "D-A", text: "d" }] });
    })(),
    recall: [{ lhs: "\\text{Tangential quadrilateral with sides } a, b, c, d \\text{ in order: } a + c =", answer: "b+d", vars: { b: pos, d: pos } }],
    related: ["tangent-length", "tangential-area"],
    problems: [
      {
        id: "v2g-pt1x",
        text: "A circle is inscribed in quadrilateral $ABCD$ with $AB = 7$, $BC = 8$, $CD = 10$. Find $DA$.",
        answer: "9",
        solution: "$7 + 10 = 8 + DA$.",
        figure: (() => {
          const { r, O, corners } = tangentialQuad([3, 4, 4, 6]);
          const [A, B, C, D] = corners;
          return fig({ pts: { A, B, C, D }, shapes: ["A-B-C-D"], circles: [{ c: O, r }], lines: ["A-B", "B-C", "C-D", "D-A"], texts: [{ on: "A-B", text: "7" }, { on: "B-C", text: "8" }, { on: "C-D", text: "10" }] });
        })(),
      },
      {
        id: "v2g-pt2x",
        text: "An isosceles trapezoid with bases $4$ and $16$ has an inscribed circle. Find its area.",
        answer: "80",
        solution: "Legs: $2\\ell = 20$, so $\\ell = 10$. Height: $\\sqrt{100 - 36} = 8$. Area: $\\frac{4 + 16}{2} \\cdot 8$.",
        figure: fig({ pts: { A: [0, 0], B: [16, 0], C: [10, 8], D: [6, 8] }, shapes: ["A-B-C-D"], circles: [{ c: [8, 4], r: 4 }], lines: ["A-B", "B-C", "C-D", "D-A"], texts: [{ on: "A-B", text: "16" }, { on: "C-D", text: "4" }] }),
      },
    ],
  },
]);
