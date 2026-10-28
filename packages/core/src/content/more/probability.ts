import { defineTopic, int } from "../types";

const prob: [number, number] = [0.1, 0.9];

export const PROBABILITY_2 = defineTopic("Probability", [
  {
    id: "geometric-probability",
    name: "Geometric Probability",
    level: "AMC 10",
    statement: "P = \\frac{\\text{favorable length, area, or volume}}{\\text{total}}",
    setup: "For a point chosen uniformly at random.",
    whenToUse: "A random point in a shape, or a random number from an interval.",
    recall: [{ lhs: "P(\\text{random point in a square is in its inscribed circle}) =", answer: "\\frac{\\pi}{4}", vars: {} }],
    related: [],
    problems: [
      { id: "gp1", text: "A point is chosen at random in a square of side $2$. What is the probability it is within $1$ of the center?", answer: "\\frac{\\pi}{4}", solution: "$\\frac{\\pi}{4}$." },
      { id: "gp2", text: "A number $x$ is chosen at random from $[0, 10]$. What is the probability that $x^2 < 25$?", answer: "\\frac{1}{2}", solution: "$x < 5$." },
    ],
  },
  {
    id: "variance",
    name: "Variance",
    level: "AMC 12",
    statement: "\\operatorname{Var}(X) = E[X^2] - E[X]^2",
    setup: "Write $s = E[X^2]$ and $m = E[X]$. For a yes/no variable, $\\operatorname{Var} = p(1-p)$.",
    whenToUse: "How spread out a random quantity is.",
    recall: [{ lhs: "\\operatorname{Var}(X) =", answer: "s-m^2", vars: { s: [5, 9], m: [1, 2] } }],
    related: ["expected-value"],
    problems: [
      { id: "var1", text: "Find the variance of one roll of a fair six-sided die.", answer: "\\frac{35}{12}", solution: "$\\frac{91}{6} - \\frac{49}{4} = \\frac{35}{12}$." },
      { id: "var2", text: "$X$ is $1$ with probability $0.3$ and $0$ otherwise. Find $\\operatorname{Var}(X)$.", answer: "\\frac{21}{100}", solution: "$0.3 \\cdot 0.7$." },
    ],
  },
  {
    id: "binomial-expectation",
    name: "Expected Successes",
    level: "AMC 10",
    statement: "E[\\text{successes in } n \\text{ trials}] = np",
    setup: "$n$ independent trials, each succeeding with probability $p$.",
    after: "Linearity: each trial contributes $p$.",
    whenToUse: "The expected count of something over many independent tries.",
    recall: [{ lhs: "E =", answer: "np", vars: { n: int(2, 20), p: prob } }],
    related: ["expected-value", "binomial-probability"],
    problems: [
      { id: "be1", text: "A coin lands heads $30\\%$ of the time. Expected heads in $20$ flips?", answer: "6", solution: "$20 \\cdot 0.3$." },
      { id: "be2", text: "What is the expected number of $6$s in $12$ rolls of a fair die?", answer: "2", solution: "$12 \\cdot \\frac16$." },
    ],
  },
  {
    id: "hypergeometric",
    name: "Drawing Without Replacement",
    level: "AMC 10",
    statement: "P(k \\text{ special}) = \\frac{\\binom{K}{k}\\binom{N-K}{n-k}}{\\binom{N}{n}}",
    setup: "Draw $n$ from $N$ items, of which $K$ are special.",
    whenToUse: "Committees, cards, or marbles drawn without replacement, asking for exactly $k$ of a type.",
    recall: [
      {
        lhs: "P(\\text{exactly } k) =",
        answer: "\\frac{\\binom{K}{k}\\binom{N-K}{n-k}}{\\binom{N}{n}}",
        vars: { N: int(10, 14), K: int(4, 6), n: int(3, 4), k: int(1, 2) },
      },
    ],
    related: [],
    problems: [
      { id: "hy1", text: "A committee of $3$ is picked at random from $5$ boys and $4$ girls. What is the probability it has exactly $2$ girls?", answer: "\\frac{5}{14}", solution: "$\\frac{\\binom42\\binom51}{\\binom93} = \\frac{30}{84}$." },
      { id: "hy2", text: "A bag has $6$ red and $4$ blue marbles. Three are drawn. What is the probability exactly one is blue?", answer: "\\frac{1}{2}", solution: "$\\frac{4\\cdot15}{120}$." },
    ],
  },
  {
    id: "gamblers-ruin",
    name: "Gambler's Ruin",
    level: "AIME",
    statement: "P(\\text{reach } N \\text{ before } 0 \\text{ from } k) = \\frac{k}{N}",
    setup: "A fair random walk that steps $\\pm1$ with equal probability.",
    whenToUse: "A fair game played until someone goes broke, or a fair walk between two walls.",
    recall: [{ lhs: "P =", answer: "\\frac{k}{N}", vars: { k: int(1, 5), N: int(6, 12) } }],
    related: ["expected-value", "conditional-probability"],
    problems: [
      { id: "gru1", text: "You start with $\\$3$ and bet $\\$1$ on fair coin flips until you have $\\$0$ or $\\$10$. What is the probability you reach $\\$10$?", answer: "\\frac{3}{10}", solution: "$\\frac{3}{10}$." },
      { id: "gru2", text: "A frog on a number line starts at $2$ and jumps left or right $1$ with equal probability. What is the probability it reaches $6$ before $0$?", answer: "\\frac{1}{3}", solution: "$\\frac26$." },
    ],
  },
  {
    id: "all-different",
    name: "All Different (Birthday Problem)",
    level: "AMC 10",
    statement: "P(\\text{all } k \\text{ different}) = \\frac{n(n-1)\\cdots(n-k+1)}{n^k}",
    setup: "$k$ independent picks from $n$ equally likely options.",
    whenToUse: "Dice showing different numbers, people with different birthdays.",
    recall: [{ lhs: "P =", answer: "\\frac{n!}{(n-k)!\\,n^k}", vars: { n: int(6, 12), k: int(2, 4) } }],
    related: [],
    problems: [
      { id: "ad1", text: "Three fair dice are rolled. What is the probability they all show different numbers?", answer: "\\frac{5}{9}", solution: "$\\frac{6\\cdot5\\cdot4}{216}$." },
      { id: "ad2", text: "Four people each pick a random day of the week. What is the probability all four days differ?", answer: "\\frac{120}{343}", solution: "$\\frac{7\\cdot6\\cdot5\\cdot4}{7^4} = \\frac{840}{2401}$." },
    ],
  },
  {
    id: "symmetry",
    name: "Symmetry Arguments",
    level: "AMC 10",
    statement: "P(X > Y) = \\frac{1 - P(X = Y)}{2}",
    setup: "For identically distributed $X$ and $Y$. Write $e = P(X = Y)$.",
    whenToUse: "Two players or dice in the same situation: \"who gets more?\"",
    recall: [{ lhs: "P(X>Y) =", answer: "\\frac{1-e}{2}", vars: { e: prob } }],
    related: [],
    problems: [
      { id: "sym1", text: "Two fair dice are rolled. What is the probability the first is larger than the second?", answer: "\\frac{5}{12}", solution: "$\\frac{1 - \\frac16}{2}$." },
      { id: "sym2", text: "Two people each pick a random integer from $1$ to $10$. What is the probability the first is larger?", answer: "\\frac{9}{20}", solution: "$\\frac{1 - \\frac{1}{10}}{2}$." },
    ],
  },
]);
