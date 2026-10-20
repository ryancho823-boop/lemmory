import type { Notes } from "./types";

export const ALGEBRA_V2_NOTES: Notes = {
  "power-mean": {
    explain: "The $r$-th power mean $\\left(\\frac{a^r+b^r}{2}\\right)^{1/r}$ grows as $r$ grows. So the root-mean-square is at least the average, which is at least the geometric mean. Knowing one power sum bounds every lower one.",
    proof: "For $r > s > 0$, the function $t \\mapsto t^{r/s}$ is convex. Apply Jensen to $a^s$ and $b^s$: $\\frac{a^r + b^r}{2} \\ge \\left(\\frac{a^s+b^s}{2}\\right)^{r/s}$, then take $r$-th roots.",
  },
  "weighted-amgm": {
    explain: "When the terms of a sum have different sizes, give them weights that add to $1$. To minimize $x^2 + \\frac{16}{x}$, split $\\frac{16}{x}$ into two equal halves so that $x^2 \\cdot \\frac8x \\cdot \\frac8x = 64$ is constant.",
    proof: "$\\ln$ is concave, so $\\ln(w_1x_1 + w_2x_2) \\ge w_1\\ln x_1 + w_2\\ln x_2 = \\ln(x_1^{w_1}x_2^{w_2})$ by Jensen. Exponentiate both sides.",
  },
  titu: {
    explain: "Fractions with squares on top can be combined into one fraction that is never bigger: add the tops before squaring, and add the bottoms. Constants like $1$ and $4$ count as $1^2$ and $2^2$.",
    proof: "Apply Cauchy-Schwarz to the vectors $\\left(\\frac{a_i}{\\sqrt{b_i}}\\right)$ and $(\\sqrt{b_i})$: $\\left(\\sum\\frac{a_i^2}{b_i}\\right)\\left(\\sum b_i\\right) \\ge \\left(\\sum a_i\\right)^2$.",
  },
  holder: {
    explain: "Hölder lets you multiply three sums together and compare the product with the cube of a sum of cube roots. A common use is to multiply by the same linear constraint twice so the squares in the denominators cancel.",
    proof: "By AM-GM, for each $i$: $\\frac{a_i^3}{\\sum a^3} + \\frac{b_i^3}{\\sum b^3} + \\frac{c_i^3}{\\sum c^3} \\ge \\frac{3a_ib_ic_i}{\\sqrt[3]{\\sum a^3 \\sum b^3 \\sum c^3}}$. Adding over $i$ gives $3$ on the left, which rearranges to the inequality.",
  },
  minkowski: {
    explain: "Think of $\\sqrt{a^2+b^2}$ as the length of the vector $(a, b)$. Two vectors placed end to end reach no farther than their sum, so the minimum of a sum of such roots is the length of the straight path.",
    proof: "Square both sides. It reduces to $ac + bd \\le \\sqrt{(a^2+b^2)(c^2+d^2)}$, which is Cauchy-Schwarz.",
  },
  "chebyshev-sum": {
    explain: "If two lists rise together, then pairing them up gives an average product at least as big as the product of the averages. Pairing a list with itself shows $n\\sum a_i^2 \\ge (\\sum a_i)^2$.",
    proof: "$\\sum_{i,j}(a_i - a_j)(b_i - b_j) \\ge 0$, because each term pairs two differences with the same sign. Expanding gives $2n\\sum a_ib_i - 2\\sum a_i\\sum b_j \\ge 0$.",
  },
  rearrangement: {
    explain: "To make $\\sum a_ib_i$ as big as possible, match the largest $a$ with the largest $b$, the next with the next, and so on. Matching largest with smallest makes it as small as possible.",
    proof: "If two pairs are matched the wrong way ($a_i < a_j$ but $b_i > b_j$), swapping them changes the sum by $(a_j - a_i)(b_i - b_j) > 0$. Keep swapping until the lists are sorted the same way.",
  },
  jensen: {
    explain: "A convex function curves upward, so the average of its values is at least its value at the average input. For a sum like $x^4 + y^4 + z^4$ with $x + y + z$ fixed, the minimum is when all the variables are equal.",
    proof: "For two points, convexity means the chord lies above the graph: $\\frac{f(a)+f(b)}{2} \\ge f\\left(\\frac{a+b}{2}\\right)$. Induction, or the tangent line at the mean, extends this to $n$ points.",
  },
  schur: {
    explain: "Schur's inequality is stronger than AM-GM for symmetric degree-3 expressions. It is what you need when the equality cases include $(t, t, 0)$ as well as $a = b = c$.",
    proof: "Assume $a \\ge b \\ge c$. The first two terms combine to $(a - b)[a(a-c) - b(b-c)] \\ge 0$. The last term is $c(c-a)(c-b) \\ge 0$, as a product of $c$ and two non-positive factors.",
  },
  muirhead: {
    explain: "Compare symmetric sums by their exponent lists. $(3,0,0)$ is more spread out than $(2,1,0)$, which is more spread out than $(1,1,1)$, so $\\sum_{\\text{sym}} a^3 \\ge \\sum_{\\text{sym}} a^2b \\ge \\sum_{\\text{sym}} abc$.",
    proof: "Each step between exponent lists moves some exponent from a larger entry to a smaller one. Each such move is an AM-GM inequality applied to pairs of terms, so the symmetric sum can only go down.",
  },
  nesbitt: {
    explain: "The sum $\\frac{a}{b+c} + \\frac{b}{c+a} + \\frac{c}{a+b}$ is always at least $\\frac32$. Watch for disguises, like $\\frac{a}{6-a}$ when $a + b + c = 6$.",
    proof: "Write $\\frac{a}{b+c} = \\frac{a^2}{a(b+c)}$ and use Titu: the sum is at least $\\frac{(a+b+c)^2}{2(ab+bc+ca)} \\ge \\frac32$, since $(a+b+c)^2 \\ge 3(ab+bc+ca)$.",
  },
  maclaurin: {
    explain: "Average the symmetric sums, $S_1 = \\frac{a+b+c}{3}$, $S_2 = \\frac{ab+bc+ca}{3}$, $S_3 = abc$, and take matching roots. They decrease from left to right, so knowing one bounds the others.",
    proof: "$S_1 \\ge \\sqrt{S_2}$ is $(a+b+c)^2 \\ge 3(ab+bc+ca)$. The second inequality follows from Newton's inequalities $S_k^2 \\ge S_{k-1}S_{k+1}$, multiplied together.",
  },
  "newton-inequality": {
    explain: "Newton's inequality says the averaged symmetric sums are log-concave: each squared is at least the product of its neighbors. It works for any real numbers, not just positive ones.",
    proof: "The polynomial $(x-a)(x-b)(x-c)$ has three real roots, and so does its derivative. A real-rooted quadratic has a nonnegative discriminant, which gives $S_1^2 \\ge S_2$. The other inequality comes the same way from the reversed polynomial.",
  },
  karamata: {
    explain: "If one list majorizes another (same total, more spread out), then a convex function adds up to more on it. To maximize a convex sum with the variables boxed in an interval, push them to the ends.",
    proof: "The sum of convex function values changes in the same direction as the spread. Moving mass from a smaller entry to a larger one never decreases a convex sum, by the chord-slope property, and any majorizing list is reached by such moves.",
  },
  aczel: {
    explain: "Aczél's inequality is Cauchy-Schwarz with minus signs (Lorentz-style), and the inequality points the other way. It applies when the first squares dominate the rest.",
    proof: "Let $f(t) = (a_1t - b_1)^2 - \\sum_{i\\ge2}(a_it - b_i)^2$. Then $f\\left(\\frac{b_1}{a_1}\\right) \\le 0$, and $f(t) \\to +\\infty$ because its leading coefficient $a_1^2 - \\sum a_i^2$ is positive. So $f$ has a real root, and a nonnegative discriminant is exactly the inequality.",
  },
  "trivial-inequality": {
    explain: "Every real square is at least zero. Completing the square turns this into the minimum of any quadratic, and $(a-b)^2 \\ge 0$ is the two-variable AM-GM.",
    proof: "$x \\cdot x$ is positive for $x \\ne 0$ (two numbers of the same sign) and $0$ for $x = 0$. Expanding $(a-b)^2 \\ge 0$ gives $a^2 + b^2 \\ge 2ab$.",
  },
  bernoulli: {
    explain: "Raising $1 + x$ to the power $n$ gives at least $1 + nx$. It's the binomial theorem with the extra (nonnegative) terms thrown away, and it works for slightly negative $x$ too.",
    proof: "Induction on $n$: $(1+x)^{n+1} \\ge (1+nx)(1+x) = 1 + (n+1)x + nx^2 \\ge 1 + (n+1)x$. This uses $1 + x \\ge 0$.",
  },
  "abs-triangle": {
    explain: "The distance from $0$ to $a + b$ is at most the trip through $a$. So a sum $|x - c_1| + \\cdots + |x - c_n|$ is smallest when $x$ is a median of the $c_i$.",
    proof: "$-|a| \\le a \\le |a|$ and $-|b| \\le b \\le |b|$. Adding gives $-(|a|+|b|) \\le a + b \\le |a| + |b|$.",
  },
  "vieta-general": {
    explain: "For any degree, the coefficients give the elementary symmetric sums of the roots, with alternating signs. The sum of the roots is $-\\frac{a_{n-1}}{a_n}$, and the product is $(-1)^n\\frac{a_0}{a_n}$.",
    proof: "Expand $a_n(x - r_1)(x - r_2)\\cdots(x - r_n)$. The coefficient of $x^{n-k}$ collects every product of $k$ roots, each with the sign $(-1)^k$.",
  },
  "factor-theorem": {
    explain: "$x - r$ divides $p(x)$ exactly when plugging in $r$ gives $0$. To make $x - r$ a factor, set $p(r) = 0$ and solve for the unknown coefficient.",
    proof: "Divide: $p(x) = (x - r)q(x) + c$. Plugging in $x = r$ gives $c = p(r)$, so the remainder is $0$ exactly when $p(r) = 0$.",
  },
  fta: {
    explain: "Every polynomial of degree $n$ has exactly $n$ complex roots, counting repeats. With real coefficients, the non-real roots pair up as conjugates, so an odd degree forces a real root.",
    proof: "Any non-constant polynomial has a complex root (Gauss), say $r$. The factor theorem then gives $p(x) = (x - r)q(x)$ with $\\deg q = n - 1$, and induction finishes it.",
  },
  discriminant: {
    explain: "The discriminant tells you about the roots without solving. For a quadratic, $b^2 - 4ac$ decides between two real roots, one double root, and two complex roots.",
    proof: "The quadratic formula has $\\sqrt{b^2 - 4ac}$ in it, which is real exactly when $b^2 - 4ac \\ge 0$. In general, $\\Delta = a^{2n-2}\\prod_{i<j}(r_i - r_j)^2$, which is $0$ exactly when two roots coincide.",
  },
  "root-difference": {
    explain: "The gap between the roots is $\\frac{\\sqrt{b^2 - 4ac}}{|a|}$, which you can find without solving for either root.",
    proof: "$(r_1 - r_2)^2 = (r_1 + r_2)^2 - 4r_1r_2 = \\frac{b^2}{a^2} - \\frac{4c}{a} = \\frac{b^2 - 4ac}{a^2}$, by Vieta.",
  },
  "power-sums-two": {
    explain: "Symmetric expressions in $a$ and $b$ only depend on $a + b$ and $ab$. Rewriting with those two lets you use Vieta, or a given value of $x + \\frac1x$.",
    proof: "Expand $(a+b)^2 = a^2 + 2ab + b^2$ and $(a+b)^3 = a^3 + 3ab(a+b) + b^3$, then solve for $a^2 + b^2$ and $a^3 + b^3$.",
  },
  "depressed-cubic": {
    explain: "Shifting $x$ by $-\\frac{b}{3a}$, the average of the roots, removes the $x^2$ term. Roots in arithmetic progression are centered on that average, which gives the middle root immediately.",
    proof: "Substitute $x = t + h$: the $t^2$ coefficient becomes $3ah + b$, which is $0$ when $h = -\\frac{b}{3a}$.",
  },
  "lagrange-interpolation": {
    explain: "There is exactly one polynomial of degree at most $n$ through $n + 1$ points, and Lagrange writes it down directly. Often it's faster to build a helper polynomial that vanishes at the given points, like $xp(x) - 1$.",
    proof: "Each product $\\prod_{j\\ne i}\\frac{x - x_j}{x_i - x_j}$ is $1$ at $x_i$ and $0$ at the other points, so the sum hits every $y_i$. Two such polynomials would differ by a polynomial of degree $\\le n$ with $n+1$ roots, which must be $0$.",
  },
  "transformed-roots": {
    explain: "To shift, scale or flip the roots, substitute the inverse change into $p$. For example, $p(x - 1)$ has roots $r + 1$, and $x^np\\left(\\frac1x\\right)$ (the coefficients reversed) has roots $\\frac1r$.",
    proof: "If $p(r) = 0$, then $q(x) = p(x - h)$ satisfies $q(r + h) = p(r) = 0$. The same check works for $p\\left(\\frac xk\\right)$ and for $x^np\\left(\\frac1x\\right)$.",
  },
  "reciprocal-roots": {
    explain: "The sum of the reciprocals of the roots is the second-to-last symmetric sum divided by the last one: $-\\frac{a_1}{a_0}$.",
    proof: "Put everything over the common denominator $r_1\\cdots r_n$. The numerator is the sum of the products of $n - 1$ roots, so $\\sum\\frac1{r_i} = \\frac{e_{n-1}}{e_n}$, and Vieta turns that into $-\\frac{a_1}{a_0}$.",
  },
  "location-of-roots": {
    explain: "If a continuous function changes sign between two points, it has a root in between. Evaluating at a few integers counts and traps the real roots.",
    proof: "This is the Intermediate Value Theorem: a continuous function on $[a, b]$ takes every value between $f(a)$ and $f(b)$, including $0$.",
  },
  cramer: {
    explain: "In a $2\\times2$ linear system, each variable is a ratio of determinants. The bottom determinant $ad - bc$ decides everything: if it's $0$, there's no solution or infinitely many.",
    proof: "Multiply the first equation by $d$ and the second by $b$, then subtract: $(ad - bc)x = pd - bq$. Solving for $y$ works the same way.",
  },
  "power-difference": {
    explain: "$a - b$ always divides $a^n - b^n$, and for odd $n$, $a + b$ divides $a^n + b^n$. This factors expressions like $2^{12} - 1$ quickly.",
    proof: "Multiply $(a - b)(a^{n-1} + a^{n-2}b + \\cdots + b^{n-1})$ out. Every middle term cancels with a neighbor, leaving $a^n - b^n$.",
  },
  "common-factorizations": {
    explain: "Squaring a three-term sum gives the squares plus twice the pairwise products. So $a+b+c$ and $ab+bc+ca$ determine $a^2 + b^2 + c^2$. The second identity shows $a^2+b^2+c^2 \\ge ab+bc+ca$, with equality only when $a = b = c$.",
    proof: "Expand $(a+b+c)^2$ directly. For the second, expand $(a-b)^2 + (b-c)^2 + (c-a)^2 = 2(a^2+b^2+c^2) - 2(ab+bc+ca)$.",
  },
  "symmetric-sums": {
    explain: "$e_1, e_2, e_3$ are the building blocks of every symmetric expression in $a, b, c$. Knowing them makes $a, b, c$ the three roots of one cubic, $x^3 - e_1x^2 + e_2x - e_3$.",
    proof: "Expand $(x - a)(x - b)(x - c) = x^3 - (a+b+c)x^2 + (ab+bc+ca)x - abc$.",
  },
  "brahmagupta-fibonacci": {
    explain: "If two numbers are each a sum of two squares, so is their product, and usually in two different ways. That's how numbers like $65$ and $130$ get several representations.",
    proof: "Expand both sides: $(ac - bd)^2 + (ad + bc)^2 = a^2c^2 + b^2d^2 + a^2d^2 + b^2c^2$, and the cross terms cancel. With complex numbers it's $|z|^2|w|^2 = |zw|^2$.",
  },
  "lagrange-identity": {
    explain: "Lagrange's identity measures exactly how far Cauchy-Schwarz is from equality. The gap is $(ad - bc)^2$, which is $0$ when the vectors are proportional.",
    proof: "Expand both sides. The left side is $a^2d^2 + b^2c^2 - 2abcd$, which is $(ad - bc)^2$.",
  },
  "harmonic-sequence": {
    explain: "In a harmonic sequence, the reciprocals form an arithmetic sequence. The middle of three terms is the harmonic mean of the outer two, $\\frac{2ab}{a+b}$.",
    proof: "If $\\frac1a, \\frac1x, \\frac1b$ are arithmetic, then $\\frac2x = \\frac1a + \\frac1b = \\frac{a+b}{ab}$, so $x = \\frac{2ab}{a+b}$.",
  },
  "linear-recurrence": {
    explain: "Guess $a_n = r^n$. The recurrence then becomes the characteristic equation $r^2 = pr + q$, and the general term combines the two roots: $a_n = Ar_1^n + Br_2^n$. The first two terms fix $A$ and $B$.",
    proof: "$r^n$ satisfies the recurrence exactly when $r^2 = pr + q$, and sums of solutions are solutions. The two free constants can match any two starting values when $r_1 \\ne r_2$.",
  },
  binet: {
    explain: "Binet's formula is the closed form of the Fibonacci numbers. Because $|\\psi| < 1$, $F_n$ is just $\\frac{\\varphi^n}{\\sqrt5}$ rounded. Powers of $\\varphi$ also reduce to $F_n\\varphi + F_{n-1}$.",
    proof: "$\\varphi$ and $\\psi$ are the roots of $r^2 = r + 1$, the characteristic equation of $F_n = F_{n-1} + F_{n-2}$. Fitting $F_0 = 0$ and $F_1 = 1$ gives $A = -B = \\frac1{\\sqrt5}$.",
  },
  "log-identities": {
    explain: "Logs turn products into sums and powers into multipliers. A chain like $\\log_2 3 \\cdot \\log_3 4 \\cdots$ collapses because each base cancels with the previous argument.",
    proof: "By change of base, $\\log_a b \\cdot \\log_b c = \\frac{\\ln b}{\\ln a}\\cdot\\frac{\\ln c}{\\ln b} = \\frac{\\ln c}{\\ln a}$. The product rule comes from $a^xa^y = a^{x+y}$.",
  },
  "cauchy-functional": {
    explain: "An additive function that is also continuous or monotonic must be linear, $f(x) = f(1)x$. Taking logs or exponentials handles the multiplicative versions.",
    proof: "Additivity gives $f(n) = nf(1)$ for integers, then $f\\left(\\frac pq\\right) = \\frac pq f(1)$ for rationals. Continuity or monotonicity extends this to all reals.",
  },
  hermite: {
    explain: "Adding the floors of $x, x + \\frac1n, \\dots, x + \\frac{n-1}{n}$ gives exactly $\\lfloor nx \\rfloor$. A long sum of shifted floors collapses to one floor.",
    proof: "Both sides go up by $1$ every time $x$ passes a multiple of $\\frac1n$, and both are $0$ on $\\left[0, \\frac1n\\right)$. Both also increase by $n$ when $x$ increases by $1$.",
  },
  "floor-properties": {
    explain: "Integers slide in and out of a floor freely. And the floors of $x$ and $-x$ add to $-1$ unless $x$ is an integer, which collapses sums of positive and negative floors.",
    proof: "Write $x = n + f$ with $0 \\le f < 1$. Then $-x = -n - f$, whose floor is $-n - 1$ when $f > 0$ and $-n$ when $f = 0$.",
  },
  denesting: {
    explain: "$\\sqrt{a + 2\\sqrt b}$ simplifies to $\\sqrt x + \\sqrt y$ when you can find $x + y = a$ and $xy = b$. First rewrite the inner coefficient as $2$, as in $4\\sqrt3 = 2\\sqrt{12}$.",
    proof: "$(\\sqrt x + \\sqrt y)^2 = x + y + 2\\sqrt{xy}$, and both sides are positive.",
  },
  "vieta-jumping": {
    explain: "Treat a quadratic Diophantine equation as a quadratic in one variable. Vieta's formulas give the other root, which is another integer solution, usually a smaller one. Repeating that descent leads to a contradiction or to the smallest solution.",
    proof: "If $x$ is a root of $x^2 - (ky)x + (y^2 - m) = 0$, the roots sum to $ky$, so $x' = ky - x$ is an integer root too. The product of the roots, $y^2 - m$, shows when $x' < x$.",
  },
  uvw: {
    explain: "Any symmetric expression in $a, b, c$ depends only on $u = a+b+c$, $v = ab+bc+ca$ and $w = abc$. With $u$ and $v$ fixed, $w$ moves in an interval, and its endpoints come from two equal variables (or a zero). So check those cases.",
    proof: "$a, b, c$ are real exactly when $x^3 - ux^2 + vx - w$ has three real roots. As $w$ changes, that holds on an interval, and at its ends the cubic has a double root.",
  },
};
