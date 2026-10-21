import type { Notes } from "./types";

export const NUMBER_THEORY_NOTES: Notes = {
  "num-divisors": {
    explain:
      "To count a number's divisors, factor it into primes, add one to each exponent, and multiply. Working backwards, a number with exactly $10$ divisors must look like $p^9$ or $p^4q$, which is how \"smallest number with $k$ divisors\" problems are solved.",
    proof:
      "A divisor of $p_1^{e_1}p_2^{e_2}\\cdots$ is $p_1^{f_1}p_2^{f_2}\\cdots$ with each $0 \\le f_i \\le e_i$. That's $e_i + 1$ independent choices for each exponent, so $(e_1 + 1)(e_2 + 1)\\cdots$ divisors.",
  },
  "sum-divisors": {
    explain:
      "The sum of all divisors is a product of geometric series, one for each prime power. For $72 = 2^3 \\cdot 3^2$ it's $(1 + 2 + 4 + 8)(1 + 3 + 9)$.",
    proof:
      "Expanding $(1 + p + \\cdots + p^a)(1 + q + \\cdots + q^b)$ produces each term $p^iq^j$ exactly once, and those are exactly the divisors of $p^aq^b$. Each factor is a geometric series equal to $\\frac{p^{a+1} - 1}{p - 1}$.",
  },
  totient: {
    explain:
      "$\\varphi(n)$ counts the numbers from $1$ to $n$ sharing no factor with $n$. Start with $n$ and, for each distinct prime $p$ dividing $n$, keep the fraction $1 - \\frac1p$ that isn't a multiple of $p$.",
    proof:
      "By inclusion-exclusion: remove multiples of each prime, add back multiples of each pair, and so on. For $n = p^aq^b$ that's $n - \\frac np - \\frac nq + \\frac{n}{pq} = n\\left(1 - \\frac1p\\right)\\left(1 - \\frac1q\\right)$, and the same pattern holds for more primes.",
  },
  fermat: {
    explain:
      "For a prime $p$ not dividing $a$, raising $a$ to the power $p - 1$ always leaves remainder $1$. So powers of $a$ mod $p$ repeat with period dividing $p - 1$: reduce the exponent mod $p - 1$ first.",
    proof:
      "The numbers $a, 2a, \\dots, (p-1)a$ are all different mod $p$ (if $ia \\equiv ja$ then $p \\mid i - j$), so they're $1, 2, \\dots, p - 1$ in some order. Multiplying them all gives $a^{p-1}(p-1)! \\equiv (p-1)!$, and $(p-1)!$ is coprime to $p$, so $a^{p-1} \\equiv 1$.",
  },
  "euler-theorem": {
    explain:
      "Euler's theorem generalizes Fermat to any modulus: if $a$ shares no factor with $n$, then $a^{\\varphi(n)} \\equiv 1 \\pmod n$. It's the standard way to find the last two digits ($\\bmod 100$) of a huge power.",
    proof:
      "Same argument as Fermat: multiplying the $\\varphi(n)$ numbers coprime to $n$ by $a$ just rearranges them mod $n$. Comparing the two products gives $a^{\\varphi(n)} \\equiv 1$.",
  },
  wilson: {
    explain:
      "For a prime $p$, $(p - 1)!$ leaves remainder $p - 1$, which is $-1$, when divided by $p$. It turns factorials near a prime into easy remainders.",
    proof:
      "Each number from $1$ to $p - 1$ has a multiplicative inverse mod $p$. Pair each number with its inverse; the pairs multiply to $1$. Only $1$ and $p - 1$ are their own inverses, so $(p - 1)! \\equiv 1 \\cdot (p - 1) \\equiv -1$.",
  },
  legendre: {
    explain:
      "The power of a prime $p$ in $n!$ is found by adding $\\lfloor n/p \\rfloor$, $\\lfloor n/p^2 \\rfloor$, and so on until the terms hit zero. Trailing zeros of $n!$ count the factors of $5$, since there are always more $2$s.",
    proof:
      "$\\lfloor n/p \\rfloor$ counts the numbers up to $n$ that are multiples of $p$, each contributing at least one factor of $p$. $\\lfloor n/p^2 \\rfloor$ counts those contributing a second factor, and so on, so every factor of $p$ is counted exactly once.",
  },
  "chicken-mcnugget": {
    explain:
      "With two coprime coin sizes $a$ and $b$, every amount above $ab - a - b$ can be made, and exactly $\\frac{(a-1)(b-1)}{2}$ positive amounts can't. Check that the two sizes are coprime first.",
    proof:
      "Sketch: for each remainder mod $a$, the smallest reachable amount is a multiple of $b$, namely $b \\cdot k$ for $k = 0, \\dots, a - 1$. The largest of these is $(a-1)b$, so the largest unreachable amount is $(a-1)b - a = ab - a - b$. Counting the gaps below each $bk$ gives $\\frac{(a-1)(b-1)}{2}$.",
  },
  crt: {
    explain:
      "If the moduli share no factors, any combination of remainders happens for exactly one number in each block of $mn$ consecutive integers. To find it, list numbers with the right remainder for the larger modulus and check the others.",
    proof:
      "The map from $x \\bmod mn$ to the pair $(x \\bmod m, x \\bmod n)$ is one-to-one: if two numbers give the same pair, their difference is divisible by $m$ and $n$, hence by $mn$. Both sides have $mn$ possibilities, so every pair occurs exactly once.",
  },
  bezout: {
    explain:
      "The amounts you can make as $ax + by$ with integer $x$ and $y$ (positive or negative) are exactly the multiples of $\\gcd(a, b)$. So the equation $ax + by = c$ has integer solutions exactly when the GCD divides $c$.",
    proof:
      "Every $ax + by$ is divisible by $\\gcd(a,b)$. Conversely, run the Euclidean algorithm: each remainder is an integer combination of $a$ and $b$, and the last nonzero remainder is the GCD, so the GCD itself is a combination.",
  },
  "product-of-divisors": {
    explain:
      "The divisors of $n$ pair up as $d$ and $\\frac nd$, and each pair multiplies to $n$. With $t$ divisors there are $\\frac t2$ pairs, so the product is $n^{t/2}$, even when $n$ is a perfect square.",
    proof:
      "Write the product $P$ forwards and with each divisor $d$ replaced by $\\frac nd$ (the same list in a different order). Multiplying the two gives $P^2 = n^t$, so $P = n^{t/2}$.",
  },
  lte: {
    explain:
      "Lifting the exponent gives the exact power of an odd prime $p$ dividing $a^n - b^n$, when $p$ divides $a - b$ but not $a$ or $b$. It's the power in $a - b$ plus the power in $n$.",
    proof:
      "Sketch: factor $a^n - b^n = (a - b)(a^{n-1} + a^{n-2}b + \\cdots + b^{n-1})$. Since $a \\equiv b \\pmod p$, the second factor is $\\equiv nb^{n-1}$, so for $p \\nmid n$ it adds no $p$. For $n = p$, a closer expansion shows it adds exactly one factor of $p$. Combining the two cases handles any $n$.",
  },
  "pythagorean-triples": {
    explain:
      "Every primitive Pythagorean triple comes from Euclid's formula with coprime $m > n$ of opposite parity. The hypotenuse is $m^2 + n^2$, which is why hypotenuses of primitive triples are sums of two squares.",
    proof:
      "Check: $(m^2 - n^2)^2 + (2mn)^2 = m^4 - 2m^2n^2 + n^4 + 4m^2n^2 = (m^2 + n^2)^2$. That every primitive triple arises this way follows from factoring $b^2 = (c - a)(c + a)$ and noting both factors are twice squares.",
  },
  "repeating-decimals": {
    explain:
      "A repeating block of $k$ digits equals that block over $k$ nines: $0.\\overline{36} = \\frac{36}{99}$. If the repetition starts later, split off the non-repeating part first.",
    proof:
      "Let $x = 0.\\overline{ab}$. Then $100x = ab.\\overline{ab}$, and subtracting gives $99x = \\overline{ab}$. Equivalently, it's the geometric series $\\frac{\\overline{ab}}{100} + \\frac{\\overline{ab}}{100^2} + \\cdots$.",
  },
};
