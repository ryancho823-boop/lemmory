import type { Notes } from "./types";

export const NUMBER_THEORY_V2_NOTES: Notes = {
  "unique-factorization": {
    explain: "Every integer above $1$ is a product of primes in exactly one way. So if two factorizations are equal, their exponents match prime by prime, which settles equations like $2^a3^b = 2^c3^d$.",
    proof: "Existence: keep splitting composite factors until only primes remain. Uniqueness: if a prime $p$ divides one product of primes, Euclid's lemma says it equals one of the primes in the other product. Cancel it and repeat.",
  },
  "euclid-lemma": {
    explain: "A prime that divides a product must divide one of the factors. This is the step that makes prime factorization unique, and it fails for non-primes: $6 \\mid 4 \\cdot 9$ but $6$ divides neither.",
    proof: "If $p \\nmid a$, then $\\gcd(p, a) = 1$, so by Bézout $px + ay = 1$ for some integers $x, y$. Multiply by $b$: $pbx + aby = b$. Both terms on the left are multiples of $p$, so $p \\mid b$.",
  },
  "euclidean-algorithm": {
    explain: "To find $\\gcd(a, b)$, replace the larger number by its remainder when divided by the smaller, and repeat. It works on expressions too: $\\gcd(n^2+1, n+1) = \\gcd(n+1, 2)$.",
    proof: "Any common divisor of $a$ and $b$ divides $a - kb$, and any common divisor of $b$ and $a - kb$ divides $a$. So both pairs have the same common divisors, and the same gcd.",
  },
  "linear-congruence": {
    explain: "$ax \\equiv b \\pmod m$ has solutions exactly when $d = \\gcd(a, m)$ divides $b$, and then there are $d$ of them mod $m$. Divide through by $d$, then multiply by the inverse of $\\frac ad$.",
    proof: "$ax \\equiv b$ means $ax - my = b$ for some $y$, which is solvable iff $d \\mid b$ (Bézout). After dividing by $d$ there is one solution mod $\\frac md$, which gives $d$ solutions mod $m$.",
  },
  "modular-inverse": {
    explain: "$a$ has an inverse mod $m$ (a number $x$ with $ax \\equiv 1$) exactly when $a$ and $m$ are coprime. That's what lets you divide in modular arithmetic.",
    proof: "$ax \\equiv 1 \\pmod m$ means $ax + my = 1$, which is solvable iff $\\gcd(a, m) = 1$, by Bézout.",
  },
  "order-mod": {
    explain: "The order of $a$ mod $m$ is the length of the cycle of powers of $a$. Any exponent that gives $1$ is a multiple of the order. Since $a^{\\varphi(m)} \\equiv 1$, the order divides $\\varphi(m)$.",
    proof: "Let $k$ be the order and write $n = qk + r$ with $0 \\le r < k$. If $a^n \\equiv 1$, then $a^r = a^n(a^k)^{-q} \\equiv 1$. Since $k$ is the smallest positive exponent that gives $1$, $r = 0$.",
  },
  "primitive-root": {
    explain: "A primitive root mod $p$ is a number whose powers hit every nonzero residue. Then each residue is $g^k$ for some $k$, which turns multiplication into addition of exponents. There are $\\varphi(p - 1)$ of them.",
    proof: "$\\mathbb{Z}_p^*$ is cyclic: for each $d \\mid p-1$, the polynomial $x^d - 1$ has at most $d$ roots, which forces exactly $\\varphi(d)$ elements of order $d$. Then $g^k$ has order $p - 1$ iff $\\gcd(k, p-1) = 1$.",
  },
  "carmichael-function": {
    explain: "$\\lambda(n)$ is the smallest exponent that sends every unit mod $n$ to $1$. It divides $\\varphi(n)$ and is often much smaller: $\\lambda(100) = 20$ while $\\varphi(100) = 40$.",
    proof: "By the Chinese Remainder Theorem, $a^k \\equiv 1 \\pmod{mn}$ iff it holds mod $m$ and mod $n$, so $\\lambda(mn) = \\operatorname{lcm}(\\lambda(m), \\lambda(n))$. Mod an odd prime power the units are cyclic, so $\\lambda = \\varphi$. Mod $2^k$, squaring shows every odd number satisfies $a^{2^{k-2}} \\equiv 1$.",
  },
  "quadratic-residues": {
    explain: "Exactly half of the nonzero residues mod an odd prime are squares. Euler's criterion decides which: $a^{\\frac{p-1}{2}}$ is $+1$ for squares and $-1$ for non-squares.",
    proof: "$x$ and $-x$ have the same square, so there are $\\frac{p-1}{2}$ squares. If $a = x^2$, then $a^{\\frac{p-1}{2}} = x^{p-1} \\equiv 1$. The polynomial $y^{\\frac{p-1}{2}} = 1$ has at most $\\frac{p-1}{2}$ roots, so the non-squares give $-1$.",
  },
  "quadratic-reciprocity": {
    explain: "Quadratic reciprocity links whether $p$ is a square mod $q$ to whether $q$ is a square mod $p$. The two answers agree unless both primes are $\\equiv 3 \\pmod 4$. Also, $-1$ is a square mod $p$ exactly when $p \\equiv 1 \\pmod 4$.",
    proof: "The $-1$ case is Euler's criterion: $(-1)^{\\frac{p-1}{2}}$. The main law is usually proved with Gauss's lemma, by counting lattice points under the line $y = \\frac qp x$ in two ways.",
  },
  "two-squares": {
    explain: "An odd prime is a sum of two squares exactly when it is $1$ more than a multiple of $4$. Squares are $0$ or $1$ mod $4$, so a sum of two of them is never $3$ mod $4$.",
    proof: "Since $-1$ is a square mod $p \\equiv 1 \\pmod 4$, there is an $x$ with $p \\mid x^2 + 1$. By Thue's lemma there are $a, b$ with $0 < |a|, |b| < \\sqrt p$ and $a \\equiv xb$. Then $p \\mid a^2 + b^2 < 2p$, which forces $a^2 + b^2 = p$.",
  },
  "two-squares-count": {
    explain: "The number of integer points on $x^2 + y^2 = n$ is $4$ times the excess of divisors $\\equiv 1 \\pmod 4$ over divisors $\\equiv 3 \\pmod 4$. Signs and order count separately, so $25 = 0^2 + 5^2 = 3^2 + 4^2$ gives $12$ points.",
    proof: "Count Gaussian integers of norm $n$. Each prime $p \\equiv 1 \\pmod 4$ splits into two conjugate Gaussian primes, and multiplying the choices together gives exactly $4(d_1 - d_3)$.",
  },
  "pell-equation": {
    explain: "Once you have the smallest solution $(x_1, y_1)$ of $x^2 - dy^2 = 1$, every other solution comes from powers of $x_1 + y_1\\sqrt d$. For $d = 2$: $(3,2)$, then $(17,12)$, then $(99,70)$.",
    proof: "Norms multiply: $(x^2 - dy^2)(u^2 - dv^2) = (xu + dyv)^2 - d(xv + yu)^2$, so powers of a solution are solutions. Conversely, dividing any solution by the fundamental one gives a smaller solution, so every solution is a power.",
  },
  lucas: {
    explain: "To find $\\binom nk$ mod a prime $p$, write $n$ and $k$ in base $p$ and multiply the small binomial coefficients digit by digit. With $p = 2$, row $n$ of Pascal's triangle has $2^{(\\text{number of 1s in } n)}$ odd entries.",
    proof: "Mod $p$, $(1 + x)^p \\equiv 1 + x^p$. So $(1+x)^n = \\prod_i (1 + x^{p^i})^{n_i}$, and the coefficient of $x^k$ comes from choosing $k_i$ from the $i$-th factor.",
  },
  kummer: {
    explain: "The power of $p$ dividing $\\binom{m+n}{m}$ equals the number of carries when you add $m$ and $n$ in base $p$. No carries means the coefficient isn't divisible by $p$.",
    proof: "Use Legendre's formula in digit-sum form: $v_p\\binom{m+n}{m} = \\frac{s_p(m) + s_p(n) - s_p(m+n)}{p-1}$. Each carry lowers the digit sum of the result by exactly $p - 1$.",
  },
  "legendre-digits": {
    explain: "The power of $p$ in $n!$ is $n$ minus its base-$p$ digit sum, divided by $p - 1$. For $p = 2$ it's just $n$ minus the number of 1s in binary.",
    proof: "Legendre gives $\\sum_k \\left\\lfloor\\frac n{p^k}\\right\\rfloor$. Writing $n = \\sum d_ip^i$, each digit $d_i$ contributes $d_i(p^{i-1} + \\cdots + 1) = d_i\\frac{p^i - 1}{p - 1}$, and summing gives $\\frac{n - s_p(n)}{p-1}$.",
  },
  "trailing-zeros": {
    explain: "A trailing zero needs a factor of $10 = 2 \\cdot 5$, and $n!$ always has more $2$s than $5$s. So count the $5$s: multiples of $5$, plus extra for multiples of $25$, $125$, and so on.",
    proof: "This is Legendre's formula for $p = 5$. Each multiple of $5^k$ contributes one more factor of $5$ than the multiples of $5^{k-1}$ alone.",
  },
  "multiplicative-functions": {
    explain: "$d(n)$, $\\sigma(n)$ and $\\varphi(n)$ are multiplicative: for coprime $m, n$, $f(mn) = f(m)f(n)$. Factor into prime powers, compute each piece, and multiply.",
    proof: "When $\\gcd(m,n) = 1$, each divisor of $mn$ splits uniquely as (divisor of $m$)(divisor of $n$), which gives $d$ and $\\sigma$. For $\\varphi$, the Chinese Remainder Theorem pairs units mod $mn$ with pairs of units mod $m$ and $n$.",
  },
  "sigma-k": {
    explain: "The sum of the $k$-th powers of the divisors is a product of geometric series, one per prime power. With $k = 2$, $12$ gives $(1 + 4 + 16)(1 + 9) = 210$.",
    proof: "$\\sigma_k$ is multiplicative, and the divisors of $p^a$ are $1, p, \\dots, p^a$. So $\\sigma_k(p^a) = 1 + p^k + \\cdots + p^{ak} = \\frac{p^{k(a+1)} - 1}{p^k - 1}$.",
  },
  "totient-sum": {
    explain: "Adding $\\varphi(d)$ over all divisors $d$ of $n$ gives exactly $n$. Each fraction $\\frac kn$ reduces to a lowest-terms fraction whose denominator is a divisor of $n$.",
    proof: "Reduce each of $\\frac1n, \\dots, \\frac nn$. The fractions with denominator $d$ in lowest terms are exactly $\\frac jd$ with $\\gcd(j, d) = 1$, and there are $\\varphi(d)$ of them. Every one of the $n$ fractions lands in exactly one group.",
  },
  "divisor-floor-sum": {
    explain: "Adding up the divisor counts of $1$ through $n$ is the same as adding $\\left\\lfloor\\frac nk\\right\\rfloor$ for $k = 1, \\dots, n$. The floors are much faster to compute.",
    proof: "Count pairs $(k, m)$ with $k \\mid m \\le n$. Grouping by $m$ gives $\\sum d(m)$. Grouping by $k$: there are $\\left\\lfloor\\frac nk\\right\\rfloor$ multiples of $k$ up to $n$.",
  },
  "gcd-exponents": {
    explain: "$\\gcd(a^m - 1, a^n - 1) = a^{\\gcd(m,n)} - 1$. The exponents follow the Euclidean algorithm.",
    proof: "$a^m - 1 - a^{m-n}(a^n - 1) = a^{m-n} - 1$, so $\\gcd(a^m - 1, a^n - 1) = \\gcd(a^{m-n} - 1, a^n - 1)$. That is the Euclidean step on the exponents, so it ends at $a^{\\gcd(m,n)} - 1$.",
  },
  "fibonacci-gcd": {
    explain: "Fibonacci numbers inherit gcds from their indices: $\\gcd(F_m, F_n) = F_{\\gcd(m,n)}$. The addition rule $F_{m+n} = F_{m-1}F_n + F_mF_{n+1}$ splits a large index into smaller ones.",
    proof: "The addition rule follows by induction on $n$ using $F_{k+1} = F_k + F_{k-1}$. It gives $\\gcd(F_{m+n}, F_n) = \\gcd(F_{m-1}F_n + F_mF_{n+1}, F_n) = \\gcd(F_m, F_n)$, since consecutive Fibonacci numbers are coprime. That's the Euclidean step on indices.",
  },
  "divisibility-rules": {
    explain: "Mod $11$, alternate signs on the digits from the right. Since $1001 = 7 \\cdot 11 \\cdot 13$, alternating sums of 3-digit blocks test $7$, $11$ and $13$ at once, and $\\overline{abcabc}$ is always a multiple of $1001$.",
    proof: "$10 \\equiv -1 \\pmod{11}$, so $10^k \\equiv (-1)^k$. Likewise $1000 \\equiv -1 \\pmod{1001}$, so 3-digit blocks alternate in sign.",
  },
  "casting-out-nines": {
    explain: "A number and its digit sum leave the same remainder mod $9$. Repeating the digit sum gives the digital root, which is $n \\bmod 9$ (or $9$).",
    proof: "$10 \\equiv 1 \\pmod 9$, so $10^k \\equiv 1$, and $\\sum d_k10^k \\equiv \\sum d_k$.",
  },
  "decimal-period": {
    explain: "The repeating block of $\\frac1p$ is as long as the smallest $k$ with $10^k \\equiv 1 \\pmod p$. By Fermat that $k$ divides $p - 1$, so $\\frac17$ can have period up to $6$, and it does.",
    proof: "$\\frac1p$ has period $k$ exactly when $10^k\\cdot\\frac1p - \\frac1p$ is an integer, that is, when $p \\mid 10^k - 1$. The smallest such $k$ is the order of $10$ mod $p$.",
  },
  "last-digits": {
    explain: "Last digits of huge powers are periodic. For bases coprime to $10$, $a^{20} \\equiv 1 \\pmod{100}$, so reduce the exponent mod $20$ first.",
    proof: "$\\lambda(100) = \\operatorname{lcm}(\\lambda(4), \\lambda(25)) = \\operatorname{lcm}(2, 20) = 20$, so $a^{20} \\equiv 1 \\pmod{100}$ for $\\gcd(a, 10) = 1$. Similarly $\\lambda(1000) = \\operatorname{lcm}(2, 100) = 100$.",
  },
  "euclid-euler": {
    explain: "Every even perfect number has the form $2^{p-1}(2^p - 1)$, where $2^p - 1$ is a Mersenne prime: $6, 28, 496, 8128, \\dots$ Whether any odd perfect number exists is still unknown.",
    proof: "If $q = 2^p - 1$ is prime, then $\\sigma(2^{p-1}q) = (2^p - 1)(q + 1) = 2 \\cdot 2^{p-1}q$. Conversely, writing $n = 2^km$ with $m$ odd and solving $\\sigma(n) = 2n$ forces $m$ to be the prime $2^{k+1} - 1$.",
  },
  "gcd-lcm-exponents": {
    explain: "Prime by prime, the gcd takes the smaller exponent and the lcm takes the larger. That handles several numbers at once, and it counts pairs with a given gcd and lcm: each prime chooses which number gets the larger exponent.",
    proof: "$p^e$ divides both $a$ and $b$ exactly when $e \\le \\min(v_p(a), v_p(b))$, so that is the gcd's exponent. A multiple of both needs $e \\ge \\max(v_p(a), v_p(b))$, which gives the lcm.",
  },
  "p-adic-valuation": {
    explain: "$v_p$ counts factors of $p$. Products add their counts. A sum has at least as many as the smaller count, and exactly that many when the two counts differ.",
    proof: "Write $a = p^xa'$ and $b = p^yb'$ with $p \\nmid a', b'$. Then $ab = p^{x+y}a'b'$. If $x < y$, then $a + b = p^x(a' + p^{y-x}b')$, and the bracket isn't divisible by $p$.",
  },
  "coprime-powers": {
    explain: "If coprime numbers multiply to a perfect $k$-th power, each one is itself a $k$-th power. For example $n(n+1)$ can never be a square, because $n$ and $n+1$ would both have to be squares.",
    proof: "Each prime's exponent in $ab$ is a multiple of $k$. Since $\\gcd(a, b) = 1$, that whole exponent belongs to $a$ or to $b$, so each of their exponents is a multiple of $k$.",
  },
  "linear-diophantine": {
    explain: "Find one solution of $ax + by = c$, then step: $x$ goes up by $\\frac bd$ while $y$ goes down by $\\frac ad$. Counting positive solutions means counting the steps that keep both positive.",
    proof: "If $(x_0, y_0)$ and $(x, y)$ are solutions, then $a(x - x_0) = -b(y - y_0)$. Dividing by $d$ gives coprime coefficients, so $\\frac bd$ divides $x - x_0$, which forces the form above.",
  },
  "modular-cancellation": {
    explain: "You can cancel a common factor $c$ from a congruence, but the modulus shrinks to $\\frac{m}{\\gcd(c, m)}$. Only when $c$ is coprime to $m$ does the modulus stay the same.",
    proof: "$m \\mid c(a - b)$ is the same as $\\frac{m}{g} \\mid \\frac cg(a - b)$ with $g = \\gcd(c, m)$. Since $\\frac{m}{g}$ and $\\frac cg$ are coprime, this means $\\frac mg \\mid a - b$.",
  },
};
