import { defineTopic, int } from "./types";

export const COMBINATORICS = defineTopic("Combinatorics", [
  {
    id: "lattice-paths",
    name: "Lattice Paths",
    level: "AMC 8",
    statement: "\\#\\text{paths } (0,0)\\to(m,n) = \\binom{m+n}{m}",
    setup: "Paths using only unit steps right and up. Choose which of the $m + n$ steps go right.",
    whenToUse: "Counting shortest routes on a grid, possibly through or around a point.",
    recall: [{ lhs: "\\text{Paths to } (m,n) =", answer: "\\binom{m+n}{m}", vars: { m: int(1, 6), n: int(1, 6) } }],
    related: ["catalan", "binomial-theorem"],
    problems: [
      {
        id: "lp1",
        text: "How many shortest grid paths go from $(0,0)$ to $(4,3)$?",
        answer: "35",
        solution: "$\\binom{7}{3} = 35$.",
      },
      {
        id: "lp2",
        text: "How many shortest grid paths from $(0,0)$ to $(4,4)$ pass through $(2,2)$?",
        answer: "36",
        solution: "$\\binom42\\cdot\\binom42 = 36$.",
      },
    ],
  },
  {
    id: "binomial-theorem",
    name: "Binomial Theorem",
    level: "AMC 10",
    statement: "(x+y)^n = \\sum_{k=0}^{n}\\binom{n}{k}x^k y^{n-k}",
    setup: "Expanding a power of a two-term sum.",
    whenToUse: "The problem asks for one coefficient of an expanded power.",
    recall: [
      {
        lhs: "\\text{Coefficient of } x^ky^{n-k} \\text{ in } (x+y)^n =",
        answer: "\\binom{n}{k}",
        vars: { n: int(5, 10), k: int(1, 4) },
      },
    ],
    related: ["hockey-stick", "binomial-probability"],
    problems: [
      {
        id: "bt1",
        text: "Find the coefficient of $x^3$ in the expansion of $(2x + 1)^5$.",
        answer: "80",
        solution: "$\\binom53\\cdot2^3 = 80$.",
      },
      {
        id: "bt2",
        text: "Find the coefficient of $x^2y^2$ in the expansion of $(x - 2y)^4$.",
        answer: "24",
        solution: "$\\binom42\\cdot(-2)^2 = 24$.",
      },
    ],
  },
  {
    id: "stars-and-bars",
    name: "Stars and Bars",
    level: "AMC 10",
    statement: "\\binom{n+k-1}{k-1}\\ (\\ge 0), \\qquad \\binom{n-1}{k-1}\\ (\\ge 1)",
    setup: "Ways to split $n$ identical items among $k$ distinct groups.",
    whenToUse: "Distributing identical objects into distinct boxes, or counting integer solutions to $x_1 + \\cdots + x_k = n$.",
    recall: [
      { lhs: "\\text{Nonnegative: }", answer: "\\binom{n+k-1}{k-1}", vars: { n: int(6, 10), k: int(2, 5) } },
      { lhs: "\\text{Positive: }", answer: "\\binom{n-1}{k-1}", vars: { n: int(6, 10), k: int(2, 5) } },
    ],
    related: ["hockey-stick", "multinomial"],
    problems: [
      {
        id: "sb1",
        text: "How many nonnegative integer solutions does $a + b + c + d = 10$ have?",
        answer: "286",
        solution: "$\\binom{13}{3} = 286$.",
      },
      {
        id: "sb2",
        text: "In how many ways can $12$ identical candies be given to $4$ children so that each child gets at least one?",
        answer: "165",
        solution: "$\\binom{11}{3} = 165$.",
      },
    ],
  },
  {
    id: "hockey-stick",
    name: "Hockey Stick Identity",
    level: "AMC 12",
    statement: "\\binom{r}{r} + \\binom{r+1}{r} + \\cdots + \\binom{n}{r} = \\binom{n+1}{r+1}",
    setup: "A diagonal run in Pascal's triangle sums to the entry just below and beside it.",
    whenToUse: "A sum of binomial coefficients with a fixed bottom index.",
    recall: [
      {
        lhs: "\\binom{r}{r} + \\cdots + \\binom{n}{r} =",
        answer: "\\binom{n+1}{r+1}",
        vars: { n: int(6, 10), r: int(1, 4) },
      },
    ],
    related: ["stars-and-bars", "binomial-theorem", "power-sums"],
    problems: [
      {
        id: "hs1",
        text: "Evaluate $\\binom{3}{3} + \\binom{4}{3} + \\binom{5}{3} + \\cdots + \\binom{10}{3}$.",
        answer: "330",
        solution: "$\\binom{11}{4} = 330$.",
      },
      {
        id: "hs2",
        text: "Evaluate $1 + 3 + 6 + 10 + \\cdots + 45$, the first nine triangular numbers.",
        answer: "165",
        solution: "These are $\\binom{2}{2}$ through $\\binom{10}{2}$, so the sum is $\\binom{11}{3} = 165$.",
      },
    ],
  },
  {
    id: "pie",
    name: "Inclusion-Exclusion",
    level: "AMC 10",
    statement: "|A\\cup B\\cup C| = \\textstyle\\sum|A| - \\sum|A\\cap B| + |A\\cap B\\cap C|",
    setup: "Write $a, b, c$ for the set sizes, $x, y, z$ for the pairwise overlaps, and $t$ for the triple overlap.",
    whenToUse: "Counting things with at least one of several overlapping properties, like divisible by $2$, $3$, or $5$.",
    recall: [
      {
        lhs: "|A\\cup B\\cup C| =",
        answer: "a+b+c-x-y-z+t",
        vars: { a: [5, 9], b: [5, 9], c: [5, 9], x: [1, 3], y: [1, 3], z: [1, 3], t: [0, 1] },
      },
    ],
    related: [],
    problems: [
      {
        id: "ie1",
        text: "How many integers from $1$ to $100$ are divisible by $2$, $3$, or $5$?",
        answer: "74",
        solution: "$50 + 33 + 20 - 16 - 10 - 6 + 3 = 74$.",
      },
      {
        id: "ie2",
        text: "In a class of $30$, $18$ play soccer, $15$ play basketball, and $8$ play both. How many play neither?",
        answer: "5",
        solution: "$18 + 15 - 8 = 25$ play at least one, so $5$ play neither.",
      },
    ],
  },
  {
    id: "multinomial",
    name: "Arrangements with Repeats",
    level: "AMC 8",
    statement: "\\frac{n!}{a!\\,b!\\,c!\\cdots}",
    setup: "Arrangements of $n$ items where $a$ are identical, $b$ are identical, and so on.",
    whenToUse: "Rearranging the letters of a word, or lining up objects that aren't all different.",
    recall: [
      {
        lhs: "\\text{Arrangements} =",
        answer: "\\frac{n!}{a!\\,b!\\,c!}",
        vars: { n: int(6, 10), a: int(1, 3), b: int(1, 3), c: int(1, 3) },
      },
    ],
    related: ["stars-and-bars"],
    problems: [
      {
        id: "mn1",
        text: "How many distinct arrangements of the letters in MISSISSIPPI are there?",
        answer: "34650",
        solution: "$\\frac{11!}{4!\\,4!\\,2!} = 34650$.",
      },
      {
        id: "mn2",
        text: "How many distinct arrangements of the letters in BANANA are there?",
        answer: "60",
        solution: "$\\frac{6!}{3!\\,2!} = 60$.",
      },
    ],
  },
  {
    id: "circular-perms",
    name: "Circular Permutations",
    level: "AMC 8",
    statement: "(n-1)!",
    setup: "Arrangements of $n$ distinct people around a circle, where rotations count as the same.",
    whenToUse: "Seating around a round table, or beads on a ring that can rotate.",
    recall: [{ lhs: "\\text{Arrangements of } n \\text{ in a circle} =", answer: "(n-1)!", vars: { n: int(3, 8) } }],
    related: ["multinomial"],
    problems: [
      {
        id: "cp1",
        text: "In how many ways can $8$ people sit around a round table, if rotations count as the same?",
        answer: "5040",
        solution: "$7! = 5040$.",
      },
      {
        id: "cp2",
        text: "Six people sit around a round table (rotations count as the same). Two of them insist on sitting together. How many arrangements are there?",
        answer: "48",
        solution: "Glue the pair: $(5-1)! = 24$, times $2$ orders within the pair.",
      },
    ],
  },
  {
    id: "derangements",
    name: "Derangements",
    level: "AMC 12",
    statement: "D_n = (n-1)(D_{n-1} + D_{n-2}), \\quad D_1 = 0,\\ D_2 = 1",
    setup: "Permutations where nothing stays in its original spot. Write $p = D_{n-1}$ and $q = D_{n-2}$. Also $D_n \\approx \\frac{n!}{e}$.",
    whenToUse: "Letters in wrong envelopes, hats returned to the wrong people, nobody gets their own gift.",
    recall: [{ lhs: "D_n =", answer: "(n-1)(p+q)", vars: { n: int(3, 9), p: [1, 50], q: [1, 50] } }],
    related: ["pie"],
    problems: [
      {
        id: "de1",
        text: "In how many ways can $5$ letters go into their $5$ addressed envelopes so that every letter is in the wrong envelope?",
        answer: "44",
        solution: "$D_3 = 2$, $D_4 = 3(2+1) = 9$, $D_5 = 4(9+2) = 44$.",
      },
      {
        id: "de2",
        text: "Four friends put their hats in a pile and each takes one at random. In how many ways does nobody get their own hat?",
        answer: "9",
        solution: "$D_4 = 3(D_3 + D_2) = 3(2 + 1) = 9$.",
      },
    ],
  },
  {
    id: "pigeonhole",
    name: "Pigeonhole Principle",
    level: "AMC 8",
    statement: "m(k-1) + 1 \\text{ objects} \\implies \\text{some box has} \\ge k",
    setup: "Putting objects into $m$ boxes.",
    whenToUse: "\"How many must you pick to guarantee...\" questions.",
    recall: [
      {
        lhs: "\\text{Objects needed to guarantee } k \\text{ in one of } m \\text{ boxes} =",
        answer: "m(k-1)+1",
        vars: { m: int(2, 12), k: int(2, 6) },
      },
    ],
    related: [],
    problems: [
      {
        id: "ph1",
        text: "A drawer has socks in $5$ colors. How many socks must you take, without looking, to guarantee a matching pair?",
        answer: "6",
        solution: "$5(2-1) + 1 = 6$.",
      },
      {
        id: "ph2",
        text: "How many people are needed to guarantee that at least $3$ of them share a birth month?",
        answer: "25",
        solution: "$12(3-1) + 1 = 25$.",
      },
    ],
  },
  {
    id: "catalan",
    name: "Catalan Numbers",
    level: "AIME",
    statement: "C_n = \\frac{1}{n+1}\\binom{2n}{n}: \\quad 1, 1, 2, 5, 14, 42, \\dots",
    setup: "Counts balanced parentheses, grid paths that never cross the diagonal, triangulations, and more.",
    whenToUse: "A counting problem with a \"never goes below\" or \"properly nested\" condition.",
    recall: [{ lhs: "C_n =", answer: "\\frac{1}{n+1}\\binom{2n}{n}", vars: { n: int(1, 8) } }],
    related: ["lattice-paths"],
    problems: [
      {
        id: "ca1",
        text: "How many ways can $4$ pairs of parentheses be arranged so they are properly matched?",
        answer: "14",
        solution: "$C_4 = \\frac15\\binom84 = 14$.",
      },
      {
        id: "ca2",
        text: "How many shortest grid paths from $(0,0)$ to $(5,5)$ never go above the line $y = x$?",
        answer: "42",
        solution: "$C_5 = \\frac16\\binom{10}{5} = 42$.",
      },
    ],
  },
]);
