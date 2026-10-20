import type { Notes } from "./types";

export const PROBABILITY_V2_NOTES: Notes = {
  "total-probability": {
    explain: "Split into cases, find the chance of $B$ in each case, and weight each by how likely the case is. A tree diagram does exactly this: multiply along each branch, then add the branches that end in $B$.",
    proof: "The cases split $B$ into disjoint pieces $B \\cap A_i$, so $P(B) = \\sum P(B \\cap A_i)$. By the definition of conditional probability, $P(B \\cap A_i) = P(B \\mid A_i)P(A_i)$.",
  },
  "first-step-analysis": {
    explain: "Name the expected time (or win chance) from each state. One move later you're in some new state, so each unknown equals $1$ plus the average of the unknowns you can move to. Solve the equations.",
    proof: "For HH, let $a$ be the expected flips from the start and $b$ after one H. Then $a = 1 + \\frac{a + b}{2}$ and $b = 1 + \\frac a2$, since a T sends you back. Solving gives $b = 4$ and $a = 6$. Each equation is the law of total expectation applied to the first flip.",
  },
  "total-expectation": {
    explain: "To find an average, find the average in each case and then average those, weighted by how likely each case is. For example, a die roll followed by that many coin flips averages $\\frac{3.5}{2}$ heads.",
    proof: "$E[X] = \\sum_x xP(X = x) = \\sum_x x\\sum_i P(X = x \\mid A_i)P(A_i)$. Swap the sums: $\\sum_i P(A_i)\\sum_x xP(X = x \\mid A_i) = \\sum_i P(A_i)E[X \\mid A_i]$.",
  },
  "indicator-variables": {
    explain: "To find the expected number of things that happen, add up the chance of each one. You never need to know how the events depend on each other, which is why this works for matches, pairs, empty boxes and so on.",
    proof: "Let $I_i$ be $1$ if event $i$ happens and $0$ if not. The count is $\\sum I_i$, and $E[I_i] = P(\\text{event}_i)$. Linearity of expectation needs no independence. A box stays empty when all $n$ balls miss it: $\\left(1 - \\frac1k\\right)^n$.",
  },
  "fixed-points": {
    explain: "In a random shuffle, the expected number of items that stay in place is exactly $1$, whether there are $3$ items or $3$ million.",
    proof: "Item $i$ lands in spot $i$ with probability $\\frac1n$. Add over the $n$ items: $n \\cdot \\frac1n = 1$. Likewise a given pair swaps with probability $\\frac{1}{n(n-1)}$, and there are $\\binom n2$ pairs, giving $\\frac12$.",
  },
  "coupon-collector": {
    explain: "Collecting gets slower as you go: the first new type is instant, but the last one takes $n$ tries on average. Split the wait into stages, one per new type, and add their expected lengths.",
    proof: "With $k$ types found, each draw is new with probability $\\frac{n-k}{n}$, so that stage is geometric with mean $\\frac{n}{n-k}$. Summing over $k = 0, \\dots, n-1$ gives $n\\left(\\frac1n + \\cdots + \\frac11\\right)$.",
  },
  "tail-sum": {
    explain: "For a whole-number variable, the expected value is the sum of $P(X \\ge 1) + P(X \\ge 2) + \\cdots$. This is easy for a max or min, since \"max $\\le m$\" just means every roll is $\\le m$.",
    proof: "$X = \\sum_{k \\ge 1}[X \\ge k]$, since exactly $X$ of those brackets are $1$. Take expectations. For the max, $P(\\max \\ge k) = 1 - \\left(\\frac{k-1}{n}\\right)^2$ for two rolls; for the min, $P(\\min \\ge k) = \\left(\\frac{n-k+1}{n}\\right)^2$.",
  },
  "meeting-problem": {
    explain: "Plot one arrival time across and the other up, making a $T \\times T$ square. They meet when the times differ by at most $t$, a band along the diagonal. The two corners outside it form a square of side $T - t$.",
    proof: "The region $|x - y| > t$ is two right triangles with legs $T - t$, total area $(T - t)^2$. So $P(\\text{miss}) = \\frac{(T-t)^2}{T^2}$ and $P(\\text{meet}) = 1 - \\left(1 - \\frac tT\\right)^2$.",
  },
  "pie-probability": {
    explain: "Adding the probabilities of overlapping events counts the overlaps twice, so subtract them; with three events, the triple overlap was subtracted too often, so add it back.",
    proof: "An outcome in exactly $j \\ge 1$ of the events is counted $\\binom j1 - \\binom j2 + \\binom j3 = 1 - (1 - 1)^j = 1$ time. An outcome in none is counted $0$ times. So the formula gives exactly the probability of the union.",
  },
  "order-statistics": {
    explain: "Drop $n$ random points on $[0, 1]$. On average they spread out evenly, cutting it into $n + 1$ pieces of expected length $\\frac{1}{n+1}$ each. So the $k$th point sits at $\\frac{k}{n+1}$ on average.",
    proof: "Put the $[0,1]$ ends together into a circle and add a random $(n+1)$th point as the cut. The $n + 1$ gaps between the points are now symmetric, so each has expected length $\\frac{1}{n+1}$. The $k$th smallest is the sum of the first $k$ gaps.",
  },
  "negative-binomial": {
    explain: "For the $r$th success to land on trial $n$, trial $n$ must succeed and exactly $r - 1$ of the earlier trials must succeed. On average you wait $\\frac1p$ for each success, so $\\frac rp$ in total.",
    proof: "Choose which $r - 1$ of the first $n - 1$ trials succeed: $\\binom{n-1}{r-1}$ ways, each with probability $p^r(1-p)^{n-r}$. The wait is a sum of $r$ independent geometric waits, each with mean $\\frac1p$.",
  },
  "binomial-variance": {
    explain: "The number of successes in $n$ independent trials has variance $np(1-p)$. For a fair coin flipped $n$ times that's $\\frac n4$, so the standard deviation is $\\frac{\\sqrt n}{2}$.",
    proof: "A single trial is $1$ with probability $p$: $E = p$ and $E[X^2] = p$, so the variance is $p - p^2$. The count is a sum of $n$ independent trials, and independent variances add.",
  },
  "variance-sum": {
    explain: "Shifting a variable doesn't change its spread; scaling by $a$ multiplies the variance by $a^2$. Independent variables' variances add, so two dice have twice the variance of one.",
    proof: "$\\operatorname{Var}(aX + b) = E[(aX + b - aE[X] - b)^2] = a^2E[(X - E[X])^2]$. For a sum, expanding gives $\\operatorname{Var}(X) + \\operatorname{Var}(Y) + 2\\operatorname{Cov}(X, Y)$, and the covariance is $0$ when $X$ and $Y$ are independent.",
  },
  "conditional-independence": {
    explain: "Two flips of a known coin are independent. But if the coin is chosen at random, a head on the first flip makes the biased coin more likely, which raises the chance of a second head.",
    proof: "Given the coin, $P(HH \\mid C) = P(H \\mid C)^2$. Average over the coins with the law of total probability. Then $P(H_2 \\mid H_1) = \\frac{P(HH)}{P(H_1)}$, which is larger than $P(H_2)$ here.",
  },
  "total-variance": {
    explain: "Total spread is the average spread inside each case plus the spread between the case averages. For a randomly chosen die, that's the average of the dice's variances plus the variance of their means.",
    proof: "$E[\\operatorname{Var}(X \\mid Y)] = E[X^2] - E\\big[E[X \\mid Y]^2\\big]$ and $\\operatorname{Var}(E[X \\mid Y]) = E\\big[E[X \\mid Y]^2\\big] - E[X]^2$, using $E[E[X \\mid Y]] = E[X]$. Adding them gives $E[X^2] - E[X]^2$.",
  },
};
