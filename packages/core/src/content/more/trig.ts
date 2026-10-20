import { defineTopic, pos } from "../types";

const angle: [number, number] = [0.2, 1.3];

export const TRIG_2 = defineTopic("Trigonometry", [
  {
    id: "sum-to-product",
    name: "Sum-to-Product",
    level: "AIME",
    statement: "\\sin a + \\sin b = 2\\sin\\tfrac{a+b}{2}\\cos\\tfrac{a-b}{2}, \\quad \\sin a - \\sin b = 2\\cos\\tfrac{a+b}{2}\\sin\\tfrac{a-b}{2}",
    setup: "Similar forms exist for cosines.",
    whenToUse: "A sum or difference of two sines or cosines at different angles.",
    recall: [
      {
        lhs: "\\sin a + \\sin b =",
        answer: "2\\sin\\frac{a+b}{2}\\cos\\frac{a-b}{2}",
        vars: { a: angle, b: angle },
        form: "product",
      },
    ],
    related: ["product-to-sum", "angle-addition"],
    problems: [
      { id: "stp1", text: "Compute $\\sin 75^\\circ + \\sin 15^\\circ$.", answer: "\\frac{\\sqrt{6}}{2}", solution: "$2\\sin 45^\\circ\\cos 30^\\circ = \\frac{\\sqrt6}{2}$." },
      { id: "stp2", text: "Compute $\\sin 105^\\circ - \\sin 15^\\circ$.", answer: "\\frac{\\sqrt{2}}{2}", solution: "$2\\cos 60^\\circ\\sin 45^\\circ = \\frac{\\sqrt2}{2}$." },
    ],
  },
  {
    id: "product-to-sum",
    name: "Product-to-Sum",
    level: "AIME",
    statement: "2\\sin a\\cos b = \\sin(a+b) + \\sin(a-b), \\quad 2\\cos a\\cos b = \\cos(a-b) + \\cos(a+b)",
    setup: "The reverse of sum-to-product.",
    whenToUse: "A product of two trig functions at different angles needs to become a sum.",
    recall: [{ lhs: "2\\sin a\\cos b =", answer: "\\sin(a+b)+\\sin(a-b)", vars: { a: angle, b: angle }, form: "sum" }],
    related: ["sum-to-product", "angle-addition"],
    problems: [
      { id: "pts1", text: "Compute $2\\sin 75^\\circ\\cos 15^\\circ$.", answer: "\\frac{2+\\sqrt{3}}{2}", solution: "$\\sin 90^\\circ + \\sin 60^\\circ = 1 + \\frac{\\sqrt3}{2}$." },
      { id: "pts2", text: "Compute $2\\cos 45^\\circ\\cos 15^\\circ$.", answer: "\\frac{1+\\sqrt{3}}{2}", solution: "$\\cos 30^\\circ + \\cos 60^\\circ$." },
    ],
  },
  {
    id: "triple-angle",
    name: "Triple Angle Formulas",
    level: "AIME",
    statement: "\\sin 3x = 3\\sin x - 4\\sin^3 x, \\qquad \\cos 3x = 4\\cos^3 x - 3\\cos x",
    setup: "Angle addition applied twice.",
    whenToUse: "An angle and its triple appear together, or a cubic in $\\sin x$ or $\\cos x$.",
    recall: [
      { lhs: "\\sin 3x =", answer: "3\\sin x-4\\sin^3x", vars: { x: angle }, banned: ["\\sin3", "\\sin(3"] },
      { lhs: "\\cos 3x =", answer: "4\\cos^3x-3\\cos x", vars: { x: angle }, banned: ["\\cos3", "\\cos(3"] },
    ],
    related: ["double-angle", "angle-addition"],
    problems: [
      { id: "tra1", text: "$\\sin x = \\frac13$. Find $\\sin 3x$.", answer: "\\frac{23}{27}", solution: "$1 - \\frac{4}{27} = \\frac{23}{27}$." },
      { id: "tra2", text: "$\\cos x = \\frac13$. Find $\\cos 3x$.", answer: "-\\frac{23}{27}", solution: "$\\frac{4}{27} - 1 = -\\frac{23}{27}$." },
    ],
  },
  {
    id: "polar",
    name: "Polar Coordinates",
    level: "AMC 12",
    statement: "x = r\\cos t, \\quad y = r\\sin t, \\quad r = \\sqrt{x^2 + y^2}",
    setup: "A point at distance $r$ from the origin and angle $t$ from the positive $x$-axis.",
    whenToUse: "Points described by distance and angle, rotations, or complex numbers in polar form.",
    recall: [
      { lhs: "x =", answer: "r\\cos t", vars: { r: pos, t: angle } },
      { lhs: "y =", answer: "r\\sin t", vars: { r: pos, t: angle } },
    ],
    related: ["complex-modulus"],
    problems: [
      { id: "pol1", text: "A point has polar coordinates $r = 4$, angle $60^\\circ$. Find its $x$-coordinate.", answer: "2", solution: "$4\\cos 60^\\circ = 2$." },
      { id: "pol2", text: "Find $r$ for the point $(-3, 3)$.", answer: "3\\sqrt{2}", solution: "$\\sqrt{9 + 9}$." },
    ],
  },
  {
    id: "arctan-sum",
    name: "Inverse Tangent Identities",
    level: "AIME",
    statement: "\\arctan x + \\arctan\\frac{1}{x} = \\frac{\\pi}{2}\\ (x > 0)",
    setup: "Combine with the tangent addition formula to add any two arctangents.",
    whenToUse: "A sum of inverse tangents, often of nice numbers like $1$, $2$, $3$.",
    recall: [{ lhs: "\\arctan x + \\arctan\\frac1x =", answer: "\\frac{\\pi}{2}", vars: {} }],
    related: ["tan-addition"],
    problems: [
      { id: "atn1", text: "Compute $\\arctan 2 + \\arctan\\frac12$, in degrees.", answer: "90", solution: "Complementary angles." },
      { id: "atn2", text: "Compute $\\arctan 1 + \\arctan 2 + \\arctan 3$, in radians.", answer: "\\pi", uses: ["arctan-sum", "tan-addition"], solution: "$\\tan(\\arctan2 + \\arctan3) = \\frac{5}{-5} = -1$, so that sum is $\\frac{3\\pi}{4}$; adding $\\frac\\pi4$ gives $\\pi$." },
    ],
  },
]);
