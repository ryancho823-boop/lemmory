import { defineTopic, int } from "../types";

export const TRIG_3 = defineTopic("Trigonometry", [
  {
    id: "half-angle",
    name: "Half-Angle Formulas",
    level: "AMC 12",
    statement:
      "\\sin\\frac{x}{2} = \\pm\\sqrt{\\frac{1-\\cos x}{2}}, \\quad \\cos\\frac{x}{2} = \\pm\\sqrt{\\frac{1+\\cos x}{2}}, \\quad \\tan\\frac{x}{2} = \\frac{\\sin x}{1+\\cos x}",
    setup: "The sign of the square root depends on which quadrant $\\frac{x}{2}$ is in.",
    whenToUse: "Exact values like $\\sin 15^\\circ$ or $\\tan 22.5^\\circ$, or simplifying $1 \\pm \\cos x$.",
    recall: [
      { lhs: "\\cos^2\\frac{x}{2} =", answer: "\\frac{1+\\cos x}{2}", vars: { x: [0.1, 3] }, banned: ["\\frac{x}{2}", "x/2"] },
      {
        lhs: "\\tan\\frac{x}{2} =",
        answer: "\\frac{\\sin x}{1+\\cos x}",
        accept: ["\\frac{1-\\cos x}{\\sin x}"],
        vars: { x: [0.1, 3] },
        banned: ["\\frac{x}{2}", "x/2"],
      },
    ],
    related: ["double-angle", "power-reduction"],
    problems: [
      { id: "x-ha1", text: "Find $\\cos^2 15^\\circ$.", answer: "\\frac{2+\\sqrt{3}}{4}", solution: "$\\frac{1 + \\cos 30^\\circ}{2} = \\frac{1 + \\frac{\\sqrt3}{2}}{2} = \\frac{2 + \\sqrt3}{4}$." },
      {
        id: "x-ha2",
        text: "Find $\\tan 22.5^\\circ$.",
        answer: "\\sqrt{2}-1",
        solution: "$\\frac{\\sin 45^\\circ}{1 + \\cos 45^\\circ} = \\frac{\\sqrt2/2}{1 + \\sqrt2/2} = \\frac{\\sqrt2}{2 + \\sqrt2} = \\sqrt2 - 1$.",
      },
    ],
  },
  {
    id: "euler-de-moivre",
    name: "Euler's Formula & De Moivre",
    level: "AMC 12",
    statement: "e^{i\\theta} = \\cos\\theta + i\\sin\\theta, \\qquad \\left(re^{i\\theta}\\right)^n = r^n e^{in\\theta}",
    setup: "Write $z = r(\\cos t + i\\sin t) = re^{it}$. Raising to a power raises the length and multiplies the angle.",
    whenToUse: "Powers or roots of complex numbers, or sums of cosines that turn into a geometric series.",
    recall: [
      { lhs: "|z^n| =", answer: "r^n", vars: { r: [1, 2], n: int(1, 5) } },
      { lhs: "\\arg(z^n) =", answer: "nt", vars: { n: int(1, 5), t: [0.1, 1] } },
      { lhs: "\\cos t =", answer: "\\frac{e^{it}+e^{-it}}{2}", vars: { t: [0.1, 3] }, banned: ["\\cos"] },
    ],
    related: ["polar", "complex-modulus", "roots-of-unity"],
    problems: [
      { id: "x-dm1", text: "Find $(1 + i)^8$.", answer: "16", solution: "$1 + i = \\sqrt2\\,e^{i\\pi/4}$, so $(1 + i)^8 = 16e^{2\\pi i} = 16$." },
      {
        id: "x-dm2",
        text: "Find the real part of $\\left(\\frac12 + \\frac{\\sqrt3}{2}i\\right)^{10}$.",
        answer: "-\\frac{1}{2}",
        solution: "The base is $e^{i\\pi/3}$, so the power is $e^{10\\pi i/3} = e^{4\\pi i/3}$, with real part $\\cos 240^\\circ = -\\frac12$.",
      },
    ],
  },
  {
    id: "roots-of-unity",
    name: "Roots of Unity",
    level: "AMC 12",
    statement: "z^n = 1 \\iff z = e^{2\\pi i k/n}, \\quad k = 0, 1, \\dots, n-1",
    setup: "The $n$ roots are evenly spaced around the unit circle, so for $n \\ge 2$ they add up to $0$.",
    whenToUse: "Polynomials like $z^n - 1$, regular polygons in the complex plane, or sums of evenly spaced cosines.",
    recall: [
      { lhs: "\\text{Angle of the } k\\text{th root} =", answer: "\\frac{2\\pi k}{n}", vars: { k: int(0, 5), n: int(6, 12) } },
      { lhs: "\\text{Sum of all } n\\text{th roots} =", answer: "0", vars: {} },
    ],
    related: ["euler-de-moivre", "polar", "vieta-cubic"],
    problems: [
      { id: "x-ru1", text: "Let $\\omega \\ne 1$ satisfy $\\omega^3 = 1$. Find $1 + \\omega + \\omega^2$.", answer: "0", solution: "These are the three cube roots of unity, which add to $0$." },
      {
        id: "x-ru2",
        text: "How many complex numbers $z$ with $z^{12} = 1$ have a positive real part?",
        answer: "5",
        solution: "The roots are at multiples of $30^\\circ$. The real part is positive at $0^\\circ, \\pm30^\\circ, \\pm60^\\circ$: five roots.",
      },
    ],
  },
]);
