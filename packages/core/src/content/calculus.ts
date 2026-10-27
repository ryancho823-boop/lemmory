import { defineTopic, int } from "./types";

const noDeriv = ["\\frac{d}", "dx", "\\mathrm{d}", "'", "\\prime"];

export const CALCULUS = defineTopic("Calculus", [
  {
    id: "power-rule",
    name: "Power Rule",
    level: "Calculus",
    statement: "\\frac{d}{dx}x^n = nx^{n-1}",
    setup: "Works for any real exponent $n$. Derivatives add term by term.",
    whenToUse: "Differentiating polynomials, finding slopes, or locating maxima and minima.",
    recall: [{ lhs: "\\frac{d}{dx}x^n =", answer: "nx^{n-1}", vars: { n: [1, 5], x: [0.5, 2] }, banned: noDeriv }],
    related: ["integral-power", "chain-rule", "product-rule"],
    problems: [
      {
        id: "pw1",
        text: "Let $f(x) = x^3 - 6x^2 + 9x + 1$. Find the sum of the $x$-values where $f'(x) = 0$.",
        answer: "4",
        solution: "$f'(x) = 3x^2 - 12x + 9 = 3(x-1)(x-3)$, so $1 + 3 = 4$.",
      },
      {
        id: "pw2",
        text: "Find the slope of the tangent line to $y = x^4$ at $x = 2$.",
        answer: "32",
        solution: "$4x^3 = 32$ at $x = 2$.",
      },
    ],
  },
  {
    id: "common-derivatives",
    name: "Common Derivatives",
    level: "Calculus",
    statement: "(\\sin x)' = \\cos x, \\quad (\\cos x)' = -\\sin x, \\quad (e^x)' = e^x, \\quad (\\ln x)' = \\frac1x",
    setup: "The building blocks for differentiating anything else.",
    whenToUse: "Trig, exponential, or log functions need differentiating.",
    recall: [
      { lhs: "\\frac{d}{dx}\\sin x =", answer: "\\cos x", vars: { x: [0.2, 2.8] }, banned: [...noDeriv, "\\sin"] },
      { lhs: "\\frac{d}{dx}\\ln x =", answer: "\\frac{1}{x}", vars: { x: [0.5, 3] }, banned: [...noDeriv, "\\ln"] },
      { lhs: "\\frac{d}{dx}e^x =", answer: "e^x", vars: { x: [0.1, 2] }, banned: noDeriv },
    ],
    related: ["chain-rule", "power-rule", "key-limits"],
    problems: [
      {
        id: "cd1",
        text: "Find the slope of $y = \\ln x$ at $x = 4$.",
        answer: "\\frac{1}{4}",
        solution: "$\\frac1x = \\frac14$.",
      },
      {
        id: "cd2",
        text: "Find the maximum value of $f(x) = \\sin x + \\cos x$.",
        answer: "\\sqrt{2}",
        solution: "$f'(x) = \\cos x - \\sin x = 0$ at $x = \\frac\\pi4$, where $f = \\sqrt2$.",
      },
    ],
  },
  {
    id: "product-rule",
    name: "Product Rule",
    level: "Calculus",
    statement: "(uv)' = u'v + uv'",
    setup: "Write $p = u'$ and $q = v'$.",
    whenToUse: "Differentiating two functions multiplied together, like $x^2e^x$ or $x\\sin x$.",
    recall: [{ lhs: "(uv)' =", answer: "pv+uq", vars: { u: [1, 5], v: [1, 5], p: [1, 5], q: [1, 5] }, banned: ["'", "\\prime"] }],
    related: ["chain-rule", "power-rule"],
    problems: [
      {
        id: "prd1",
        text: "Let $f(x) = x^2e^x$. Find $f'(1)$.",
        answer: "3e",
        uses: ["product-rule", "common-derivatives"],
        solution: "$f'(x) = 2xe^x + x^2e^x$, so $f'(1) = 3e$.",
      },
      {
        id: "prd2",
        text: "Let $f(x) = x\\sin x$. Find $f'(\\pi)$.",
        answer: "-\\pi",
        uses: ["product-rule", "common-derivatives"],
        solution: "$f'(x) = \\sin x + x\\cos x$, so $f'(\\pi) = 0 - \\pi$.",
      },
    ],
  },
  {
    id: "chain-rule",
    name: "Chain Rule",
    level: "Calculus",
    statement: "\\frac{d}{dx}f(g(x)) = f'(g(x))\\cdot g'(x)",
    setup: "Differentiate the outside, keep the inside, then multiply by the inside's derivative.",
    whenToUse: "One function is plugged into another: $(2x+1)^3$, $e^{3x}$, $\\sin(x^2)$.",
    recall: [
      { lhs: "\\frac{d}{dx}\\sin(kx) =", answer: "k\\cos(kx)", vars: { k: [1, 4], x: [0.1, 1] }, banned: [...noDeriv, "\\sin"] },
      { lhs: "\\frac{d}{dx}e^{kx} =", answer: "ke^{kx}", vars: { k: [1, 3], x: [0.1, 1] }, banned: noDeriv },
    ],
    related: ["product-rule", "power-rule", "common-derivatives"],
    problems: [
      {
        id: "cr1",
        text: "Let $f(x) = (2x + 1)^3$. Find $f'(1)$.",
        answer: "54",
        solution: "$f'(x) = 3(2x+1)^2\\cdot2$, so $f'(1) = 6\\cdot9 = 54$.",
      },
      {
        id: "cr2",
        text: "Find the derivative of $e^{3x}$ at $x = 0$.",
        answer: "3",
        solution: "$3e^{3x} = 3$ at $x = 0$.",
      },
    ],
  },
  {
    id: "integral-power",
    name: "Fundamental Theorem (Power Integrals)",
    level: "Calculus",
    statement: "\\int_a^b f(x)\\,dx = F(b) - F(a), \\qquad \\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C",
    setup: "$F$ is any antiderivative of $f$.",
    whenToUse: "Area under a curve, or between two curves.",
    recall: [
      {
        lhs: "\\int_0^a x^n\\,dx =",
        answer: "\\frac{a^{n+1}}{n+1}",
        vars: { a: [0.5, 3], n: int(1, 5) },
        banned: ["\\int"],
      },
    ],
    related: ["power-rule"],
    problems: [
      {
        id: "ip1",
        text: "Evaluate $\\int_0^2 3x^2\\,dx$.",
        answer: "8",
        solution: "$x^3 \\big|_0^2 = 8$.",
      },
      {
        id: "ip2",
        text: "Find the area between $y = x$ and $y = x^2$ for $0 \\le x \\le 1$.",
        answer: "\\frac{1}{6}",
        solution: "$\\int_0^1 (x - x^2)\\,dx = \\frac12 - \\frac13 = \\frac16$.",
      },
    ],
  },
  {
    id: "key-limits",
    name: "Key Limits",
    level: "Calculus",
    statement: "\\lim_{x\\to0}\\frac{\\sin x}{x} = 1, \\qquad \\lim_{n\\to\\infty}\\left(1 + \\frac{1}{n}\\right)^n = e",
    setup: "More generally $\\lim_{n\\to\\infty}\\left(1 + \\frac{a}{n}\\right)^n = e^a$.",
    whenToUse: "A limit has the form $\\frac{\\sin(\\cdot)}{(\\cdot)}$ near $0$, or $(1 + \\text{small})^{\\text{large}}$.",
    recall: [
      { lhs: "\\lim_{x\\to0}\\frac{\\sin x}{x} =", answer: "1", vars: {}, banned: ["\\lim", "\\sin"] },
      { lhs: "\\lim_{n\\to\\infty}\\left(1+\\frac1n\\right)^n =", answer: "e", vars: {}, banned: ["\\lim", "\\infty"] },
    ],
    related: ["exp-series", "common-derivatives"],
    problems: [
      {
        id: "kl1",
        text: "Evaluate $\\lim_{x\\to0}\\frac{\\sin 5x}{x}$.",
        answer: "5",
        solution: "$5\\cdot\\frac{\\sin 5x}{5x} \\to 5$.",
      },
      {
        id: "kl2",
        text: "Evaluate $\\lim_{n\\to\\infty}\\left(1 + \\frac{2}{n}\\right)^n$.",
        answer: "e^2",
        solution: "$\\left(1 + \\frac2n\\right)^n \\to e^2$.",
      },
    ],
  },
  {
    id: "exp-series",
    name: "Exponential Series",
    level: "Calculus",
    statement: "e^x = \\sum_{n=0}^{\\infty}\\frac{x^n}{n!} = 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots",
    setup: "A Taylor series that converges for all $x$.",
    after: "It's the Taylor series of $e^x$.",
    whenToUse: "An infinite sum has factorials in the denominator.",
    recall: [{ lhs: "\\sum_{n=0}^{\\infty}\\frac{x^n}{n!} =", answer: "e^x", vars: { x: [0.1, 2] }, banned: ["\\sum", "!"] }],
    related: ["key-limits", "geometric-series"],
    problems: [
      {
        id: "es1",
        text: "Evaluate $\\sum_{n=0}^{\\infty}\\frac{2^n}{n!}$.",
        answer: "e^2",
        solution: "This is the series for $e^x$ at $x = 2$.",
      },
      {
        id: "es2",
        text: "Evaluate $\\sum_{n=1}^{\\infty}\\frac{1}{n!}$.",
        answer: "e-1",
        solution: "The $e^1$ series without its $n = 0$ term.",
      },
    ],
  },
]);
