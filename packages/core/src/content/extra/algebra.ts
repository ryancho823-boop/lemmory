import { defineTopic, pos } from "../types";

export const ALGEBRA_3 = defineTopic("Algebra", [
  {
    id: "sum-of-three-cubes",
    name: "Sum of Three Cubes Identity",
    level: "AMC 12",
    statement: "a^3 + b^3 + c^3 - 3abc = (a+b+c)(a^2+b^2+c^2-ab-bc-ca)",
    setup: "In particular, if $a + b + c = 0$ then $a^3 + b^3 + c^3 = 3abc$.",
    whenToUse: "Three cubes show up with a $3abc$ term, or you know $a + b + c = 0$.",
    recall: [{ lhs: "a^3+b^3+c^3-3abc =", answer: "(a+b+c)(a^2+b^2+c^2-ab-bc-ca)", vars: { a: pos, b: pos, c: pos }, form: "product" }],
    related: ["sum-of-cubes", "vieta-cubic", "newton-sums"],
    problems: [
      { id: "x-t3c1", text: "Find $a^3 + b^3 + c^3$ if $a + b + c = 0$ and $abc = 4$.", answer: "12", solution: "With $a + b + c = 0$, the identity gives $a^3 + b^3 + c^3 = 3abc = 12$." },
      {
        id: "x-t3c2",
        text: "If $a + b + c = 6$, $ab + bc + ca = 11$, and $abc = 6$, find $a^3 + b^3 + c^3$.",
        answer: "36",
        solution: "$a^2 + b^2 + c^2 = 36 - 22 = 14$, so $a^3 + b^3 + c^3 = 3\\cdot 6 + 6(14 - 11) = 36$.",
      },
    ],
  },
  {
    id: "rational-root",
    name: "Rational Root Theorem",
    level: "AMC 10",
    statement: "\\tfrac{p}{q} \\text{ a root (lowest terms)} \\implies p \\mid a_0,\\ \\ q \\mid a_n",
    setup: "For $a_nx^n + \\cdots + a_1x + a_0$ with integer coefficients.",
    whenToUse: "Hunting for a root of a polynomial with integer coefficients before you factor it.",
    recall: [
      { lhs: "p \\text{ divides}", answer: "a_0", vars: { a_0: pos, a_n: pos } },
      { lhs: "q \\text{ divides}", answer: "a_n", vars: { a_0: pos, a_n: pos } },
    ],
    related: ["remainder-theorem", "vieta-cubic"],
    problems: [
      {
        id: "x-rr1",
        text: "How many candidates does the Rational Root Theorem give for the roots of $2x^3 - x + 3$?",
        answer: "8",
        solution: "$p \\in \\{\\pm1, \\pm3\\}$ and $q \\in \\{1, 2\\}$, giving $\\pm1, \\pm3, \\pm\\frac12, \\pm\\frac32$.",
      },
      {
        id: "x-rr2",
        text: "Find the only rational root of $2x^3 - 3x^2 - 3x - 5$.",
        answer: "\\frac{5}{2}",
        solution: "Testing candidates, $x = \\frac52$ works: the polynomial is $(2x - 5)(x^2 + x + 1)$, and $x^2 + x + 1$ has no real roots.",
      },
    ],
  },
  {
    id: "conjugate-roots",
    name: "Conjugate Root Theorem",
    level: "AMC 10",
    statement: "a + b\\sqrt{c} \\text{ a root} \\implies a - b\\sqrt{c} \\text{ a root};\\quad a + bi \\implies a - bi",
    setup: "Radical roots pair up when the coefficients are rational; complex roots pair up when they're real.",
    whenToUse: "A polynomial with rational or real coefficients has an irrational or complex root, and you need the others.",
    recall: [{ lhs: "\\text{If } a+b\\sqrt{c} \\text{ is a root, so is}", answer: "a-b\\sqrt{c}", vars: { a: pos, b: pos, c: pos } }],
    related: ["vieta-quadratic", "complex-modulus"],
    problems: [
      {
        id: "x-cr1",
        text: "A monic quadratic with rational coefficients has $3 + \\sqrt2$ as a root. Find its constant term.",
        answer: "7",
        solution: "The other root is $3 - \\sqrt2$, so the constant term is $(3 + \\sqrt2)(3 - \\sqrt2) = 7$.",
      },
      {
        id: "x-cr2",
        text: "A monic quadratic with real coefficients has $2 + 3i$ as a root. Find the sum of its coefficients.",
        answer: "10",
        solution: "The roots are $2 \\pm 3i$, so it's $x^2 - 4x + 13$, and $1 - 4 + 13 = 10$.",
      },
    ],
  },
  {
    id: "partial-fractions",
    name: "Partial Fractions",
    level: "AMC 10",
    statement: "\\frac{1}{n(n+k)} = \\frac{1}{k}\\left(\\frac{1}{n} - \\frac{1}{n+k}\\right)",
    setup: "Splits a product in the denominator into a difference of simpler fractions.",
    whenToUse: "A sum of fractions with products in the denominator: split each term so the sum telescopes.",
    recall: [
      {
        lhs: "\\frac{1}{n(n+k)} =",
        answer: "\\frac{1}{k}\\left(\\frac{1}{n}-\\frac{1}{n+k}\\right)",
        vars: { n: pos, k: pos },
        banned: ["n(n+k)", "n\\left(n+k\\right)", "(n+k)n", "\\left(n+k\\right)n"],
      },
    ],
    related: ["telescoping"],
    problems: [
      {
        id: "x-pf1",
        text: "Compute $\\frac{1}{1\\cdot 3} + \\frac{1}{3\\cdot 5} + \\cdots + \\frac{1}{19\\cdot 21}$.",
        answer: "\\frac{10}{21}",
        solution: "Each term is $\\frac12\\left(\\frac1n - \\frac{1}{n+2}\\right)$, so the sum telescopes to $\\frac12\\left(1 - \\frac{1}{21}\\right) = \\frac{10}{21}$.",
      },
      {
        id: "x-pf2",
        text: "Find $A$ if $\\frac{5x+1}{(x-1)(x+2)} = \\frac{A}{x-1} + \\frac{B}{x+2}$.",
        answer: "2",
        solution: "Multiply by $x - 1$ and set $x = 1$: $A = \\frac{5 + 1}{1 + 2} = 2$.",
      },
    ],
  },
  {
    id: "qm-am-gm-hm",
    name: "QM-AM-GM-HM Chain",
    level: "AMC 12",
    statement: "\\sqrt{\\frac{a^2+b^2}{2}} \\ge \\frac{a+b}{2} \\ge \\sqrt{ab} \\ge \\frac{2ab}{a+b}",
    setup: "For positive $a, b$, with equality only when $a = b$. It extends to any number of terms.",
    whenToUse: "Bounding a sum, product, or sum of squares of positive numbers. The harmonic mean shows up in average speeds and rates.",
    recall: [
      { lhs: "\\text{QM} =", answer: "\\sqrt{\\frac{a^2+b^2}{2}}", vars: { a: pos, b: pos } },
      { lhs: "\\text{HM} =", answer: "\\frac{2ab}{a+b}", vars: { a: pos, b: pos } },
    ],
    related: ["amgm", "cauchy-schwarz"],
    problems: [
      {
        id: "x-qm1",
        text: "Positive numbers $a$ and $b$ satisfy $a + b = 10$. Find the minimum of $a^2 + b^2$.",
        answer: "50",
        solution: "QM $\\ge$ AM gives $\\frac{a^2 + b^2}{2} \\ge 25$, so $a^2 + b^2 \\ge 50$, with equality at $a = b = 5$.",
      },
      { id: "x-qm2", text: "Find the harmonic mean of $3$ and $6$.", answer: "4", solution: "$\\frac{2\\cdot 3\\cdot 6}{3 + 6} = \\frac{36}{9} = 4$." },
    ],
  },
]);
