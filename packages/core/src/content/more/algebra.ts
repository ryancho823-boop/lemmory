import { defineTopic, int, pos } from "../types";

export const ALGEBRA_2 = defineTopic("Algebra", [
  {
    id: "remainder-theorem",
    name: "Remainder Theorem",
    level: "AMC 10",
    statement: "P(x) \\div (x - a) \\text{ leaves remainder } P(a)",
    setup: "Divide a polynomial by a linear factor $x - a$.",
    after: "So if $P(a) = 0$, then $x - a$ is a factor (the factor theorem).",
    whenToUse: "A remainder of polynomial division by a linear factor, or a condition that something divides a polynomial.",
    recall: [{ lhs: "\\text{Remainder of } P(x) \\div (x-a) \\text{ is } P(\\;?\\;):", answer: "a", vars: { a: pos } }],
    related: ["vieta-quadratic", "vieta-cubic"],
    problems: [
      { id: "rt1", text: "Find the remainder when $x^{100} + 2x + 1$ is divided by $x - 1$.", answer: "4", solution: "$P(1) = 1 + 2 + 1 = 4$." },
      { id: "rt2", text: "$x^3 - 2x^2 + kx + 4$ is divisible by $x - 2$. Find $k$.", answer: "-2", solution: "$P(2) = 8 - 8 + 2k + 4 = 0$." },
    ],
  },
  {
    id: "complex-modulus",
    name: "Complex Numbers",
    level: "AMC 12",
    statement: "|a + bi| = \\sqrt{a^2 + b^2}, \\qquad i^2 = -1,\\ i^4 = 1",
    setup: "Powers of $i$ repeat every $4$. $|zw| = |z|\\,|w|$.",
    whenToUse: "Sizes of complex numbers, or large powers of $i$.",
    recall: [
      { lhs: "|a+bi| =", answer: "\\sqrt{a^2+b^2}", vars: { a: pos, b: pos }, banned: ["i"] },
      { lhs: "i^4 =", answer: "1", vars: {}, banned: ["i"] },
    ],
    related: [],
    problems: [
      { id: "cx1", text: "Compute $|3 + 4i| \\cdot |1 - i|$.", answer: "5\\sqrt{2}", solution: "$5 \\cdot \\sqrt2$." },
      { id: "cx2", text: "Compute $i^{2026}$.", answer: "-1", solution: "$2026 = 4\\cdot506 + 2$, so $i^{2026} = i^2 = -1$." },
    ],
  },
  {
    id: "sophie-germain",
    name: "Sophie Germain Identity",
    level: "AIME",
    statement: "a^4 + 4b^4 = (a^2 + 2b^2 + 2ab)(a^2 + 2b^2 - 2ab)",
    setup: "Complete the square, then factor.",
    after: "$a^4 + 4b^4 = (a^2 + 2b^2)^2 - (2ab)^2$, a difference of squares.",
    whenToUse: "An expression of the form $a^4 + 4b^4$ needs factoring.",
    recall: [{ lhs: "a^4 + 4b^4 =", answer: "(a^2+2b^2+2ab)(a^2+2b^2-2ab)", vars: { a: pos, b: pos }, form: "product" }],
    related: ["sum-of-cubes"],
    problems: [
      { id: "sg1", text: "What is the largest prime factor of $4^4 + 4$?", answer: "13", solution: "$(16 + 2 + 8)(16 + 2 - 8) = 26 \\cdot 10$." },
      { id: "sg2", text: "What is the largest prime factor of $5^4 + 4\\cdot3^4$?", answer: "73", solution: "$(25 + 18 + 30)(25 + 18 - 30) = 73 \\cdot 13$." },
    ],
  },
  {
    id: "newton-sums",
    name: "Sum of Squares of Roots",
    level: "AIME",
    statement: "\\textstyle\\sum r_i^2 = \\left(\\sum r_i\\right)^2 - 2\\sum_{i<j} r_ir_j",
    setup: "Write $s$ for the sum of the roots and $q$ for the sum of their pairwise products (both from Vieta). This is the first of Newton's sums.",
    whenToUse: "A polynomial's roots and the sum of their squares, without solving for the roots.",
    recall: [{ lhs: "r_1^2 + r_2^2 + r_3^2 =", answer: "s^2-2q", vars: { s: pos, q: pos } }],
    related: ["vieta-cubic", "vieta-quadratic"],
    problems: [
      { id: "ns1", text: "Let $r, s, t$ be the roots of $x^3 - 3x^2 + x - 7$. Find $r^2 + s^2 + t^2$.", answer: "7", uses: ["newton-sums", "vieta-cubic"], solution: "$3^2 - 2\\cdot1 = 7$." },
      { id: "ns2", text: "Let $r, s, t$ be the roots of $x^3 + 2x^2 - 5x + 1$. Find $r^2 + s^2 + t^2$.", answer: "14", uses: ["newton-sums", "vieta-cubic"], solution: "$(-2)^2 - 2(-5) = 14$." },
    ],
  },
]);
