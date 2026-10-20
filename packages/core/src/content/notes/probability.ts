import type { Notes } from "./types";

export const PROBABILITY_NOTES: Notes = {
  "binomial-probability": {
    explain:
      "For $n$ independent tries, each succeeding with probability $p$, the chance of exactly $k$ successes is the number of ways to choose which tries succeed, times the probability of any one such pattern.",
    proof:
      "Any specific pattern with $k$ successes and $n - k$ failures has probability $p^k(1 - p)^{n-k}$ by independence. There are $\\binom nk$ such patterns, and they can't happen together, so add them.",
  },
  "expected-value": {
    explain:
      "Expected value is the long-run average: each outcome times its probability, added up. Linearity, $E[X + Y] = E[X] + E[Y]$, holds even when the variables are dependent, so break a count into yes/no indicators and add their probabilities.",
    proof:
      "$E[X + Y] = \\sum (x + y)P(x, y) = \\sum xP(x, y) + \\sum yP(x, y)$. Summing out the other variable leaves $E[X] + E[Y]$; no independence is needed.",
  },
  "conditional-probability": {
    explain:
      "Knowing that $B$ happened shrinks the world to just the outcomes in $B$. The probability of $A$ given $B$ is the part of $B$ where $A$ also happens, as a fraction of $B$.",
    proof: "With equally likely outcomes, restricting to $B$ leaves $|B|$ outcomes, $|A \\cap B|$ of them favorable: $\\frac{|A \\cap B|}{|B|} = \\frac{P(A \\cap B)}{P(B)}$. This becomes the definition in general.",
  },
  bayes: {
    explain:
      "Bayes' theorem flips a conditional probability around: from \"positive test given sick\" to \"sick given positive test.\" The answer is often surprisingly small when the condition is rare, because false positives outnumber true ones.",
    proof: "By the definition of conditional probability, $P(A \\cap B) = P(A \\mid B)P(B)$ and also $P(A \\cap B) = P(B \\mid A)P(A)$. Set them equal and divide by $P(B)$.",
  },
  "geometric-distribution": {
    explain:
      "If each try succeeds with probability $p$, you need $\\frac1p$ tries on average to get the first success. A $\\frac16$ chance means $6$ rolls on average.",
    proof:
      "Let $E$ be the expected number of tries. The first try always counts; with probability $1 - p$ it fails and you start over: $E = 1 + (1 - p)E$, so $E = \\frac1p$.",
  },
  "geometric-probability": {
    explain:
      "When a point is chosen uniformly from a region, the probability of landing in a part is that part's share of the total length, area, or volume. Draw the region and compute areas.",
    proof: "\"Uniformly at random\" means the probability of landing in a region is proportional to its size. Normalizing so the whole space has probability $1$ gives favorable size over total size.",
  },
  variance: {
    explain:
      "Variance measures spread: the average squared distance from the mean. The shortcut is \"mean of the squares minus square of the mean.\" A yes/no variable with probability $p$ has variance $p(1 - p)$.",
    proof:
      "$\\operatorname{Var}(X) = E[(X - \\mu)^2] = E[X^2] - 2\\mu E[X] + \\mu^2 = E[X^2] - \\mu^2$, using linearity and $E[X] = \\mu$.",
  },
  "binomial-expectation": {
    explain:
      "The expected number of successes in $n$ tries with success probability $p$ is $np$. No need to use the binomial formula: it falls straight out of linearity of expectation.",
    proof: "Write the count as $X_1 + \\cdots + X_n$, where $X_i$ is $1$ if try $i$ succeeds. Each has $E[X_i] = p$, so the sum has expectation $np$.",
  },
  hypergeometric: {
    explain:
      "When drawing without replacement, count instead of multiplying: ways to choose the special items you want, times ways to choose the rest, over all ways to draw. Committees and card hands work this way.",
    proof:
      "All $\\binom Nn$ draws are equally likely. A draw with exactly $k$ special items picks $k$ of the $K$ special ones and $n - k$ of the $N - K$ others: $\\binom Kk\\binom{N-K}{n-k}$ ways.",
  },
  "gamblers-ruin": {
    explain:
      "In a fair game moving one step up or down, the chance of reaching $N$ before $0$ from position $k$ is just $\\frac kN$. Fair games have no drift, so the answer is proportional to how far along you start.",
    proof:
      "Let $P_k$ be the probability from position $k$. Then $P_k = \\frac12P_{k-1} + \\frac12P_{k+1}$, so the values are evenly spaced, with $P_0 = 0$ and $P_N = 1$. Evenly spaced from $0$ to $1$ gives $P_k = \\frac kN$.",
  },
  "all-different": {
    explain:
      "The chance that $k$ independent picks from $n$ options are all different is $\\frac nn \\cdot \\frac{n-1}{n} \\cdots \\frac{n-k+1}{n}$. Its complement is the birthday problem: with $23$ people, a shared birthday is more likely than not.",
    proof: "The first pick can be anything. Each later pick must avoid the earlier ones: the $i$th pick has $n - i + 1$ allowed options out of $n$. Multiply by independence.",
  },
  symmetry: {
    explain:
      "When two players are in identical situations, \"first beats second\" and \"second beats first\" are equally likely. So each is half of what's left after removing ties. Look for symmetry before doing any casework.",
    proof: "$P(X > Y) + P(X < Y) + P(X = Y) = 1$, and swapping the identical $X$ and $Y$ shows $P(X > Y) = P(X < Y)$. So each equals $\\frac{1 - P(X = Y)}{2}$.",
  },
};
