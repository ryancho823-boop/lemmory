import { defineTopic, pos } from "./types";

const angle: [number, number] = [0.2, 2.8];
const noDouble = ["\\sin2", "\\cos2", "\\sin(2", "\\cos(2"];
const noTrig = ["\\sin", "\\cos", "\\tan", "^\\circ", "\\degree"];

export const TRIG = defineTopic("Trigonometry", [
  {
    id: "double-angle",
    name: "Double Angle Formulas",
    level: "AMC 12",
    statement: "\\sin 2x = 2\\sin x\\cos x, \\qquad \\cos 2x = \\cos^2 x - \\sin^2 x",
    setup: "From the angle addition formulas with both angles equal to $x$.",
    after: "Also $\\cos 2x = 2\\cos^2 x - 1 = 1 - 2\\sin^2 x$.",
    whenToUse: "An angle and its double both appear, or a product $\\sin x \\cos x$ needs simplifying.",
    recall: [
      { lhs: "\\sin 2x =", answer: "2\\sin x\\cos x", vars: { x: angle }, banned: noDouble },
      { lhs: "\\cos 2x =", answer: "\\cos^2x-\\sin^2x", vars: { x: angle }, banned: noDouble },
    ],
    related: ["angle-addition", "power-reduction"],
    problems: [
      {
        id: "da1",
        text: "$\\sin x = \\frac35$ and $x$ is acute. Find $\\sin 2x$.",
        answer: "\\frac{24}{25}",
        solution: "$\\cos x = \\frac45$, so $\\sin 2x = 2\\cdot\\frac35\\cdot\\frac45 = \\frac{24}{25}$.",
      },
      {
        id: "da2",
        text: "$\\cos x = \\frac13$. Find $\\cos 2x$.",
        answer: "-\\frac{7}{9}",
        solution: "$2\\cos^2 x - 1 = \\frac29 - 1 = -\\frac79$.",
      },
    ],
  },
  {
    id: "angle-addition",
    name: "Angle Addition Formulas",
    level: "AMC 12",
    statement: "\\sin(a \\pm b) = \\sin a\\cos b \\pm \\cos a\\sin b, \\quad \\cos(a\\pm b) = \\cos a\\cos b \\mp \\sin a\\sin b",
    setup: "Build odd angles like $15^\\circ$, $75^\\circ$, $105^\\circ$ from $30^\\circ$, $45^\\circ$, $60^\\circ$.",
    whenToUse: "An angle is a sum or difference of special angles, or a sum of two angles appears.",
    recall: [
      { lhs: "\\sin(a+b) =", answer: "\\sin a\\cos b+\\cos a\\sin b", vars: { a: angle, b: angle }, banned: ["a+b", "b+a"] },
      { lhs: "\\cos(a+b) =", answer: "\\cos a\\cos b-\\sin a\\sin b", vars: { a: angle, b: angle }, banned: ["a+b", "b+a"] },
    ],
    related: ["tan-addition", "double-angle"],
    problems: [
      {
        id: "aa1",
        text: "Compute $\\sin 75^\\circ$.",
        answer: "\\frac{\\sqrt{6}+\\sqrt{2}}{4}",
        solution: "$\\sin 45^\\circ\\cos 30^\\circ + \\cos 45^\\circ\\sin 30^\\circ = \\frac{\\sqrt6}{4} + \\frac{\\sqrt2}{4}$.",
      },
      {
        id: "aa2",
        text: "Compute $\\cos 105^\\circ$.",
        answer: "\\frac{\\sqrt{2}-\\sqrt{6}}{4}",
        solution: "$\\cos 60^\\circ\\cos 45^\\circ - \\sin 60^\\circ\\sin 45^\\circ = \\frac{\\sqrt2}{4} - \\frac{\\sqrt6}{4}$.",
      },
    ],
  },
  {
    id: "tan-addition",
    name: "Tangent Addition Formula",
    level: "AMC 12",
    statement: "\\tan(a+b) = \\frac{\\tan a + \\tan b}{1 - \\tan a\\tan b}",
    setup: "Write $p = \\tan a$ and $q = \\tan b$.",
    whenToUse: "Two angles are known by their tangents (slopes, grid triangles) and you need their sum.",
    recall: [{ lhs: "\\tan(a+b) =", answer: "\\frac{p+q}{1-pq}", vars: { p: [0.1, 0.5], q: [0.1, 0.5] } }],
    related: ["angle-addition", "double-angle"],
    problems: [
      {
        id: "ta1",
        text: "Acute angles $a$ and $b$ have $\\tan a = \\frac12$ and $\\tan b = \\frac13$. Find $a + b$ in degrees.",
        answer: "45",
        solution: "$\\tan(a+b) = \\frac{5/6}{1 - 1/6} = 1$, so $a + b = 45^\\circ$.",
      },
      {
        id: "ta2",
        text: "Compute $\\tan 75^\\circ$.",
        answer: "2+\\sqrt{3}",
        solution: "$\\frac{1 + \\frac{1}{\\sqrt3}}{1 - \\frac1{\\sqrt3}} = \\frac{\\sqrt3 + 1}{\\sqrt3 - 1} = 2 + \\sqrt3$.",
      },
    ],
  },
  {
    id: "power-reduction",
    name: "Power Reduction (Half Angle)",
    level: "AIME",
    statement: "\\cos^2 x = \\frac{1 + \\cos 2x}{2}, \\qquad \\sin^2 x = \\frac{1 - \\cos 2x}{2}",
    setup: "The double angle formula solved for the square.",
    whenToUse: "You need $\\sin$ or $\\cos$ of half a known angle, like $15^\\circ$ or $22.5^\\circ$, or squares of trig functions need simplifying.",
    recall: [
      { lhs: "\\cos^2 x =", answer: "\\frac{1+\\cos 2x}{2}", vars: { x: angle }, banned: ["\\cos^", "\\sin^"] },
      { lhs: "\\sin^2 x =", answer: "\\frac{1-\\cos 2x}{2}", vars: { x: angle }, banned: ["\\cos^", "\\sin^"] },
    ],
    related: ["double-angle"],
    problems: [
      {
        id: "prr1",
        text: "Compute $\\cos^2 15^\\circ$.",
        answer: "\\frac{2+\\sqrt{3}}{4}",
        solution: "$\\frac{1 + \\cos 30^\\circ}{2} = \\frac{2 + \\sqrt3}{4}$.",
      },
      {
        id: "prr2",
        text: "Compute $\\sin^2 22.5^\\circ$.",
        answer: "\\frac{2-\\sqrt{2}}{4}",
        solution: "$\\frac{1 - \\cos 45^\\circ}{2} = \\frac{2 - \\sqrt2}{4}$.",
      },
    ],
  },
  {
    id: "area-sine",
    name: "Triangle Area with Sine",
    level: "AMC 10",
    statement: "K = \\tfrac12 ab\\sin C",
    setup: "Two sides $a, b$ and the included angle $C$.",
    whenToUse: "You know two sides and the angle between them.",
    recall: [{ lhs: "K =", answer: "\\frac{1}{2}ab\\sin C", vars: { a: pos, b: pos, C: angle } }],
    related: ["heron", "law-of-cosines"],
    problems: [
      {
        id: "ar1",
        text: "Two sides of a triangle have lengths $8$ and $10$ and the angle between them is $30^\\circ$. Find the area.",
        answer: "20",
        solution: "$\\frac12\\cdot 8\\cdot 10\\cdot \\frac12 = 20$.",
      },
      {
        id: "ar2",
        text: "A parallelogram has sides $6$ and $9$ with an angle of $150^\\circ$ between them. Find its area.",
        answer: "27",
        solution: "Two triangles, each $\\frac12\\cdot6\\cdot9\\cdot\\sin150^\\circ = \\frac{27}{2}$.",
      },
    ],
  },
  {
    id: "law-of-cosines",
    name: "Law of Cosines",
    level: "AMC 10",
    statement: "c^2 = a^2 + b^2 - 2ab\\cos C",
    setup: "Angle $C$ is opposite side $c$.",
    whenToUse: "You know two sides and the included angle (find the third side), or all three sides (find an angle).",
    recall: [{ lhs: "c^2 =", answer: "a^2+b^2-2ab\\cos C", vars: { a: pos, b: pos, C: angle } }],
    related: ["law-of-sines", "stewart"],
    problems: [
      {
        id: "lc1",
        text: "Two sides of a triangle are $5$ and $8$ with a $60^\\circ$ angle between them. Find the third side.",
        answer: "7",
        solution: "$c^2 = 25 + 64 - 2\\cdot5\\cdot8\\cdot\\frac12 = 49$.",
      },
      {
        id: "lc2",
        text: "A triangle has sides $3$, $5$, and $7$. Find its largest angle in degrees.",
        answer: "120",
        solution: "$49 = 9 + 25 - 30\\cos C$ gives $\\cos C = -\\frac12$.",
      },
    ],
  },
  {
    id: "law-of-sines",
    name: "Extended Law of Sines",
    level: "AMC 10",
    statement: "\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R",
    setup: "$R$ is the circumradius; each side is opposite its matching angle.",
    whenToUse: "A problem connects a side with its opposite angle, or involves the circumradius.",
    recall: [{ lhs: "\\frac{a}{\\sin A} =", answer: "2R", vars: { R: pos } }],
    related: ["law-of-cosines", "inradius-circumradius"],
    problems: [
      {
        id: "ls1",
        text: "In triangle $ABC$, $BC = 6$ and $\\angle A = 30^\\circ$. Find the circumradius.",
        answer: "6",
        solution: "$2R = \\frac{6}{\\sin 30^\\circ} = 12$.",
      },
      {
        id: "ls2",
        text: "A triangle is inscribed in a circle of radius $5$ and one of its angles is $90^\\circ$. How long is the side opposite that angle?",
        answer: "10",
        solution: "$a = 2R\\sin 90^\\circ = 10$.",
      },
    ],
  },
]);
