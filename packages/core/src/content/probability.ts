import { defineTopic, int } from "./types";

const prob: [number, number] = [0.1, 0.9];

export const PROBABILITY = defineTopic("Probability", [
  {
    id: "basic-probability",
    name: "Equally Likely Outcomes",
    level: "AMC 8",
    statement: "P(E) = \\frac{\\#\\text{favorable}}{\\#\\text{total}}",
    setup: "Only valid when every outcome is equally likely. Write $f$ for favorable outcomes and $n$ for total outcomes.",
    whenToUse: "Dice, coins, cards, or random picks where you can count outcomes.",
    recall: [{ lhs: "P(E) =", answer: "\\frac{f}{n}", vars: { f: [1, 5], n: [6, 20] } }],
    related: ["complement", "perms-combs", "conditional-probability"],
    problems: [
      {
        id: "bp1",
        text: "Two fair dice are rolled. What is the probability that the sum is $7$?",
        answer: "\\frac{1}{6}",
        solution: "$6$ of the $36$ outcomes sum to $7$.",
      },
      {
        id: "bp2",
        text: "A bag has $4$ red and $6$ blue marbles. Two are drawn without replacement. What is the probability both are red?",
        answer: "\\frac{2}{15}",
        uses: ["basic-probability", "perms-combs"],
        solution: "$\\binom42 / \\binom{10}{2} = \\frac{6}{45} = \\frac{2}{15}$.",
      },
    ],
  },
  {
    id: "complement",
    name: "Complementary Probability",
    level: "AMC 8",
    statement: "P(\\text{at least one}) = 1 - P(\\text{none})",
    setup: "Write $q$ for the probability of none.",
    whenToUse: "The words \"at least one\": counting the opposite is usually much easier.",
    recall: [{ lhs: "P(\\text{at least one}) =", answer: "1-q", vars: { q: prob } }],
    related: ["basic-probability", "pie", "binomial-probability"],
    problems: [
      {
        id: "co1",
        text: "Four fair coins are flipped. What is the probability of at least one head?",
        answer: "\\frac{15}{16}",
        solution: "$1 - \\left(\\frac12\\right)^4 = \\frac{15}{16}$.",
      },
      {
        id: "co2",
        text: "Three fair dice are rolled. What is the probability that at least one shows a $6$?",
        answer: "\\frac{91}{216}",
        solution: "$1 - \\left(\\frac56\\right)^3 = 1 - \\frac{125}{216} = \\frac{91}{216}$.",
      },
    ],
  },
  {
    id: "binomial-probability",
    name: "Binomial Probability",
    level: "AMC 10",
    statement: "P(k \\text{ successes in } n) = \\binom{n}{k}p^k(1-p)^{n-k}",
    setup: "$n$ independent trials, each succeeding with probability $p$.",
    whenToUse: "\"Exactly $k$ out of $n$\" with repeated independent tries: coin flips, free throws, quiz guesses.",
    recall: [
      {
        lhs: "P(\\text{exactly } k) =",
        answer: "\\binom{n}{k}p^k(1-p)^{n-k}",
        vars: { n: int(4, 8), k: int(1, 3), p: prob },
      },
    ],
    related: ["binomial-theorem", "complement", "expected-value"],
    problems: [
      {
        id: "bpr1",
        text: "Five fair coins are flipped. What is the probability of exactly $3$ heads?",
        answer: "\\frac{5}{16}",
        solution: "$\\binom53 / 2^5 = \\frac{10}{32} = \\frac{5}{16}$.",
      },
      {
        id: "bpr2",
        text: "A player makes $80\\%$ of free throws. What is the probability she makes exactly $2$ of $3$?",
        answer: "\\frac{48}{125}",
        solution: "$3 \\cdot 0.8^2 \\cdot 0.2 = 0.384 = \\frac{48}{125}$.",
      },
    ],
  },
  {
    id: "expected-value",
    name: "Expected Value & Linearity",
    level: "AMC 10",
    statement: "E[X] = \\sum x\\,P(X = x), \\qquad E[X + Y] = E[X] + E[Y]",
    setup: "Linearity holds even when $X$ and $Y$ are dependent. Write $m = E[X]$.",
    whenToUse: "\"Expected number of...\": split the count into indicator variables and add their probabilities.",
    recall: [
      { lhs: "E[\\text{fair } n\\text{-sided die}] =", answer: "\\frac{n+1}{2}", vars: { n: int(4, 20) } },
      { lhs: "E[aX+b] =", answer: "am+b", vars: { a: [1, 5], b: [1, 5], m: [1, 5] } },
    ],
    related: ["geometric-distribution", "binomial-probability"],
    problems: [
      {
        id: "ev1",
        text: "What is the expected sum of two fair six-sided dice?",
        answer: "7",
        solution: "$3.5 + 3.5 = 7$.",
      },
      {
        id: "ev2",
        text: "Ten people's name tags are shuffled and handed back at random. What is the expected number of people who get their own tag?",
        answer: "1",
        solution: "Each person gets their own with probability $\\frac{1}{10}$; by linearity the total is $10\\cdot\\frac1{10} = 1$.",
      },
    ],
  },
  {
    id: "conditional-probability",
    name: "Conditional Probability",
    level: "AMC 10",
    statement: "P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}",
    setup: "Write $x = P(A \\cap B)$ and $q = P(B)$. Knowing $B$ happened shrinks the sample space to $B$.",
    whenToUse: "\"Given that...\" or \"if we know...\": restrict to the outcomes where the condition holds.",
    recall: [{ lhs: "P(A\\mid B) =", answer: "\\frac{x}{q}", vars: { x: [0.05, 0.2], q: [0.3, 0.9] } }],
    related: ["bayes", "basic-probability"],
    problems: [
      {
        id: "cnd1",
        text: "Two fair dice are rolled and their sum is $8$. What is the probability that both dice are even?",
        answer: "\\frac{3}{5}",
        solution: "Sum $8$: $(2,6),(3,5),(4,4),(5,3),(6,2)$. Three of the five are both even.",
      },
      {
        id: "cnd2",
        text: "A family has two children, and at least one is a boy. What is the probability both are boys?",
        answer: "\\frac{1}{3}",
        solution: "Of $BB, BG, GB$, only $BB$ works.",
      },
    ],
  },
  {
    id: "bayes",
    name: "Bayes' Theorem",
    level: "AMC 12",
    statement: "P(A \\mid B) = \\frac{P(B \\mid A)\\,P(A)}{P(B)}",
    setup: "Write $p = P(A)$, $r = P(B \\mid A)$, and $q = P(B)$.",
    whenToUse: "You know the probability one way (a test given a disease) and need it the other way (a disease given a test).",
    recall: [{ lhs: "P(A\\mid B) =", answer: "\\frac{rp}{q}", vars: { p: prob, r: prob, q: prob } }],
    related: ["conditional-probability"],
    problems: [
      {
        id: "by1",
        text: "A disease affects $1\\%$ of people. A test catches $90\\%$ of sick people but also flags $10\\%$ of healthy people. Someone tests positive. What is the probability they are sick?",
        answer: "\\frac{1}{12}",
        solution: "$\\frac{0.009}{0.009 + 0.099} = \\frac{1}{12}$.",
      },
      {
        id: "by2",
        text: "One coin is fair and one has two heads. You pick one at random, flip it, and get heads. What is the probability you picked the two-headed coin?",
        answer: "\\frac{2}{3}",
        solution: "$\\frac{\\frac12\\cdot1}{\\frac12\\cdot1 + \\frac12\\cdot\\frac12} = \\frac23$.",
      },
    ],
  },
  {
    id: "geometric-distribution",
    name: "Waiting for a Success",
    level: "AMC 12",
    statement: "E[\\text{trials until first success}] = \\frac{1}{p}",
    setup: "Independent trials, each succeeding with probability $p$.",
    whenToUse: "\"How many tries, on average, until...\" questions.",
    recall: [{ lhs: "E[\\text{trials}] =", answer: "\\frac{1}{p}", vars: { p: prob } }],
    related: ["expected-value", "geometric-series"],
    problems: [
      {
        id: "gd1",
        text: "On average, how many times must a fair die be rolled to get a $6$?",
        answer: "6",
        solution: "$\\frac{1}{1/6} = 6$.",
      },
      {
        id: "gd2",
        text: "Cards are drawn one at a time from a standard deck, with replacement. What is the expected number of draws until the first ace?",
        answer: "13",
        solution: "$p = \\frac{4}{52} = \\frac{1}{13}$, so the expected number of draws is $13$.",
      },
    ],
  },
]);
