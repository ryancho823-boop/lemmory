import type { Notes } from "./types";

export const ALGEBRA_NOTES: Notes = {
  "vieta-quadratic": {
    explain:
      "Vieta's formulas tie the roots of a quadratic directly to its coefficients. If you only need the sum or product of the roots, or anything built from them like $r^2 + s^2 = (r+s)^2 - 2rs$, you never have to solve the equation. This is one of the most-used shortcuts on the AMC.",
    proof:
      "If the roots are $r_1, r_2$, the quadratic factors as $a(x - r_1)(x - r_2) = ax^2 - a(r_1 + r_2)x + ar_1r_2$. Matching coefficients with $ax^2 + bx + c$ gives $-a(r_1 + r_2) = b$ and $ar_1r_2 = c$.",
  },
  "vieta-cubic": {
    explain:
      "The same idea as for quadratics, one degree up: the three elementary symmetric sums of the roots come straight from the coefficients. Any symmetric expression in the roots (sum of squares, sum of reciprocals, and so on) can be rewritten in terms of these three sums.",
    proof:
      "Expand $a(x - r_1)(x - r_2)(x - r_3) = a\\left[x^3 - (r_1 + r_2 + r_3)x^2 + (r_1r_2 + r_2r_3 + r_3r_1)x - r_1r_2r_3\\right]$ and match it with $ax^3 + bx^2 + cx + d$ term by term.",
  },
  "sum-of-cubes": {
    explain:
      "Sums and differences of cubes always factor into a linear piece and a quadratic piece. The related identity $a^3 + b^3 = (a+b)^3 - 3ab(a+b)$ is the one to reach for when you know $a + b$ and $ab$ but not $a$ and $b$ themselves.",
    proof:
      "Multiply out the right side: $(a + b)(a^2 - ab + b^2) = a^3 - a^2b + ab^2 + a^2b - ab^2 + b^3 = a^3 + b^3$. Replacing $b$ with $-b$ gives the difference version.",
  },
  "arithmetic-series": {
    explain:
      "An arithmetic series adds numbers that go up by the same step each time. Its sum is the number of terms times the average term, and in an evenly spaced list the average is just the average of the first and last terms. The hardest part is usually counting the terms correctly.",
    proof:
      "Write the sum forwards and backwards: $S = a_1 + \\cdots + a_n$ and $S = a_n + \\cdots + a_1$. Each of the $n$ column pairs adds to $a_1 + a_n$, so $2S = n(a_1 + a_n)$.",
  },
  "geometric-series": {
    explain:
      "A geometric series multiplies by the same ratio $r$ each step. The finite formula adds the first $n$ terms; when $|r| < 1$ the terms shrink toward zero and the whole infinite series adds up to $\\frac{a}{1-r}$. Repeating decimals and many probability problems are geometric series in disguise.",
    proof:
      "Let $S = a + ar + \\cdots + ar^{n-1}$. Then $rS = ar + \\cdots + ar^n$, and subtracting gives $S - rS = a - ar^n$, so $S = a\\frac{1 - r^n}{1 - r}$. If $|r| < 1$, $r^n \\to 0$ as $n \\to \\infty$, leaving $\\frac{a}{1-r}$.",
  },
  "power-sums": {
    explain:
      "These give closed forms for adding the first $n$ integers, squares, or cubes. Notice that the sum of the first $n$ cubes is exactly the square of the sum of the first $n$ integers. Counting squares in a grid is a classic place where the sum of squares shows up.",
    proof:
      "The first is the arithmetic series formula. For squares, sum the identity $(k+1)^3 - k^3 = 3k^2 + 3k + 1$ from $k = 1$ to $n$: the left side telescopes to $(n+1)^3 - 1$, then solve for $\\sum k^2$. The cube formula follows by induction: adding $(n+1)^3$ to $\\left(\\frac{n(n+1)}{2}\\right)^2$ gives $\\left(\\frac{(n+1)(n+2)}{2}\\right)^2$.",
  },
  telescoping: {
    explain:
      "Splitting each fraction into a difference makes neighboring terms cancel, so a long sum collapses to its first and last pieces. Look for denominators that are products of numbers a fixed distance apart, like $n(n+1)$ or $n(n+2)$.",
    proof:
      "Combine the right side over a common denominator: $\\frac1n - \\frac{1}{n+1} = \\frac{(n+1) - n}{n(n+1)} = \\frac{1}{n(n+1)}$. In a sum $\\sum_{n=1}^{N}$, each $-\\frac{1}{n+1}$ cancels the next term's $+\\frac{1}{n+1}$, leaving $1 - \\frac{1}{N+1}$.",
  },
  amgm: {
    explain:
      "The arithmetic mean of nonnegative numbers is always at least their geometric mean, with equality exactly when the numbers are equal. It turns \"find the minimum\" questions into one line: if a product is fixed, the sum is smallest when the terms are equal. It extends to any number of terms.",
    proof:
      "Since squares are nonnegative, $(\\sqrt a - \\sqrt b)^2 \\ge 0$. Expanding gives $a - 2\\sqrt{ab} + b \\ge 0$, so $\\frac{a + b}{2} \\ge \\sqrt{ab}$, with equality only when $\\sqrt a = \\sqrt b$.",
  },
  "cauchy-schwarz": {
    explain:
      "Cauchy-Schwarz bounds a sum of products by the sums of squares. It's the go-to tool when a problem fixes $x^2 + y^2$ and asks for the largest value of a linear expression like $3x + 4y$, or the other way around. Equality holds when the two lists are proportional.",
    proof:
      "Expand: $(a^2 + b^2)(c^2 + d^2) - (ac + bd)^2 = a^2d^2 + b^2c^2 - 2abcd = (ad - bc)^2 \\ge 0$. Equality holds exactly when $ad = bc$, that is, when $\\frac ac = \\frac bd$.",
  },
  sfft: {
    explain:
      "Simon's Favorite Factoring Trick turns an equation with an $xy$ term and linear terms into a product of two factors equal to a constant. Then integer solutions come from listing factor pairs of that constant. The key move is adding the right constant to both sides.",
    proof:
      "Expand the right side: $(x + b)(y + a) = xy + ax + by + ab$. So $xy + ax + by = k$ becomes $(x + b)(y + a) = k + ab$.",
  },
  "change-of-base": {
    explain:
      "Change of base rewrites a log in any base as a ratio of logs in a base you like. It's how you compare or multiply logs with different bases, and it explains why products like $\\log_2 3 \\cdot \\log_3 4$ telescope.",
    proof:
      "Let $y = \\log_b a$, so $b^y = a$. Take the natural log of both sides: $y\\ln b = \\ln a$, so $y = \\frac{\\ln a}{\\ln b}$. Any other base works the same way.",
  },
  "remainder-theorem": {
    explain:
      "To find the remainder when a polynomial is divided by $x - a$, just plug in $a$. In particular, $x - a$ is a factor exactly when $P(a) = 0$, which is how you test candidate roots or solve for an unknown coefficient.",
    proof:
      "Polynomial division gives $P(x) = (x - a)Q(x) + r$, where the remainder $r$ is a constant because it has lower degree than $x - a$. Substitute $x = a$: $P(a) = 0 \\cdot Q(a) + r = r$.",
  },
  "complex-modulus": {
    explain:
      "The modulus $|a + bi|$ is the distance from $a + bi$ to $0$ in the complex plane. Powers of $i$ cycle through $i, -1, -i, 1$, so any power reduces using the exponent mod $4$. Moduli multiply: $|zw| = |z||w|$.",
    proof:
      "The point $a + bi$ sits at $(a, b)$, so its distance from the origin is $\\sqrt{a^2 + b^2}$ by the Pythagorean theorem. For powers, $i^2 = -1$ by definition, so $i^4 = (i^2)^2 = 1$ and the pattern repeats every $4$.",
  },
  "sophie-germain": {
    explain:
      "$a^4 + 4b^4$ looks like it can't factor, but it does, into two quadratics. It's rare but decisive: when it applies, a huge number or a messy fraction suddenly factors or telescopes.",
    proof:
      "Add and subtract $4a^2b^2$: $a^4 + 4b^4 = (a^2 + 2b^2)^2 - 4a^2b^2 = (a^2 + 2b^2)^2 - (2ab)^2$. Then use difference of squares.",
  },
  "newton-sums": {
    explain:
      "The sum of the squares of a polynomial's roots equals the square of their sum minus twice their pairwise products. Both of those come from Vieta, so you can find $\\sum r_i^2$ straight from the coefficients. Newton's sums extend this to cubes and higher powers.",
    proof:
      "Square the sum: $(r_1 + r_2 + r_3)^2 = r_1^2 + r_2^2 + r_3^2 + 2(r_1r_2 + r_2r_3 + r_3r_1)$. Solve for the sum of squares.",
  },
};
