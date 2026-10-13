import type { Notes } from "./types";

export const CALCULUS_NOTES: Notes = {
  "power-rule": {
    explain:
      "To differentiate $x^n$, bring the exponent down and subtract one from it. Combined with \"derivatives add,\" this handles every polynomial; setting the derivative to zero finds maxima and minima.",
    proof:
      "By the binomial theorem, $(x + h)^n = x^n + nx^{n-1}h + (\\text{terms with } h^2)$. So $\\frac{(x+h)^n - x^n}{h} = nx^{n-1} + (\\text{terms with } h) \\to nx^{n-1}$ as $h \\to 0$.",
  },
  "common-derivatives": {
    explain:
      "These four derivatives are the building blocks: $\\sin$ becomes $\\cos$, $\\cos$ becomes $-\\sin$, $e^x$ stays $e^x$, and $\\ln x$ becomes $\\frac1x$. Everything else is built from them with the product, quotient, and chain rules.",
    proof:
      "For $\\sin$: $\\frac{\\sin(x+h) - \\sin x}{h} = \\sin x\\frac{\\cos h - 1}{h} + \\cos x\\frac{\\sin h}{h} \\to \\cos x$, using $\\frac{\\sin h}{h} \\to 1$. For $\\ln$: $y = \\ln x$ means $e^y = x$; differentiating, $e^yy' = 1$, so $y' = \\frac1x$.",
  },
  "product-rule": {
    explain:
      "The derivative of a product is not the product of derivatives. Differentiate one factor at a time, keeping the other, and add the two results.",
    proof:
      "$\\frac{u(x+h)v(x+h) - u(x)v(x)}{h} = u(x+h)\\frac{v(x+h) - v(x)}{h} + v(x)\\frac{u(x+h) - u(x)}{h}$. As $h \\to 0$ this becomes $uv' + vu'$.",
  },
  "chain-rule": {
    explain:
      "For a function inside another function, differentiate the outside (leaving the inside alone), then multiply by the derivative of the inside. So $\\frac{d}{dx}(2x + 1)^3 = 3(2x+1)^2 \\cdot 2$.",
    proof:
      "Write $\\frac{f(g(x+h)) - f(g(x))}{h} = \\frac{f(g(x+h)) - f(g(x))}{g(x+h) - g(x)}\\cdot\\frac{g(x+h) - g(x)}{h}$. As $h \\to 0$, the first factor tends to $f'(g(x))$ and the second to $g'(x)$.",
  },
  "integral-power": {
    explain:
      "The definite integral is the area under a curve, and the Fundamental Theorem says you get it by finding an antiderivative and subtracting its values at the ends. For powers, raise the exponent by one and divide by the new exponent.",
    proof:
      "Let $A(t)$ be the area under $f$ from $a$ to $t$. Adding a thin strip of width $h$ adds about $f(t)h$, so $A'(t) = f(t)$: $A$ is an antiderivative. Any two antiderivatives differ by a constant, so the area is $F(b) - F(a)$. For powers, $\\frac{d}{dx}\\frac{x^{n+1}}{n+1} = x^n$.",
  },
  "key-limits": {
    explain:
      "Two limits come up constantly: $\\frac{\\sin x}{x} \\to 1$ as $x \\to 0$, and $\\left(1 + \\frac1n\\right)^n \\to e$ as $n \\to \\infty$. Rescale to match them: $\\frac{\\sin 5x}{x} = 5\\cdot\\frac{\\sin 5x}{5x} \\to 5$.",
    proof:
      "For small $x > 0$, comparing areas in the unit circle gives $\\sin x \\le x \\le \\tan x$, so $\\cos x \\le \\frac{\\sin x}{x} \\le 1$, and both bounds tend to $1$. For the second, $\\ln\\left(1 + \\frac1n\\right)^n = \\frac{\\ln(1 + 1/n)}{1/n} \\to (\\ln)'(1) = 1$.",
  },
  "exp-series": {
    explain:
      "$e^x$ equals the infinite sum of $\\frac{x^n}{n!}$. Spotting a factorial in the denominator of an infinite sum usually means the answer involves $e$; adjust for any missing first terms.",
    proof:
      "The series converges for all $x$, and differentiating it term by term gives the same series back. So it's a function equal to its own derivative with value $1$ at $x = 0$, which is $e^x$.",
  },
  "quotient-rule": {
    explain:
      "To differentiate a fraction: bottom times derivative of top, minus top times derivative of bottom, all over bottom squared. The order in the numerator matters.",
    proof: "Write $\\frac uv = u \\cdot v^{-1}$. The product and chain rules give $u'v^{-1} - uv^{-2}v' = \\frac{u'v - uv'}{v^2}$.",
  },
  lhopital: {
    explain:
      "When plugging in gives $\\frac00$ or $\\frac\\infty\\infty$, replace the top and bottom with their derivatives and try again. Check the indeterminate form first; it doesn't apply otherwise.",
    proof:
      "For the $\\frac00$ case at $a$ with $f(a) = g(a) = 0$: $\\frac{f(x)}{g(x)} = \\frac{(f(x) - f(a))/(x - a)}{(g(x) - g(a))/(x - a)} \\to \\frac{f'(a)}{g'(a)}$ when $g'(a) \\ne 0$. The general version uses the Cauchy mean value theorem.",
  },
  "basic-integrals": {
    explain:
      "These reverse the common derivatives. Watch the sign: the integral of $\\sin x$ is $-\\cos x$. Over $[0, \\pi]$, $\\sin x$ has area exactly $2$, a value worth remembering.",
    proof: "Differentiate each answer: $(e^x)' = e^x$, $(\\sin x)' = \\cos x$, $(-\\cos x)' = \\sin x$. Then use the Fundamental Theorem.",
  },
  "u-substitution": {
    explain:
      "When an integrand contains a function and the derivative of its inside, substitute $u$ for the inside and the integral becomes simpler. It's the chain rule run backwards.",
    proof:
      "If $F' = f$, the chain rule gives $\\frac{d}{dx}F(g(x)) = f(g(x))g'(x)$. So $F(g(x))$ is an antiderivative of $f(g(x))g'(x)$. In the example, $\\frac{d}{dx}e^{x^2} = 2xe^{x^2}$.",
  },
  "integration-by-parts": {
    explain:
      "Integration by parts trades $\\int u\\,dv$ for $uv - \\int v\\,du$. Choose $u$ to get simpler when differentiated (a polynomial or $\\ln x$) and $dv$ to be easy to integrate.",
    proof: "Integrate the product rule $(uv)' = u'v + uv'$: $uv = \\int v\\,du + \\int u\\,dv$. Rearrange.",
  },
  "average-value": {
    explain:
      "The average height of a function over an interval is its integral divided by the interval's length. It's the height of the rectangle with the same area as the region under the curve.",
    proof: "Averaging $n$ equally spaced samples gives $\\frac{1}{n}\\sum f(x_i) = \\frac{1}{b-a}\\sum f(x_i)\\Delta x$, a Riemann sum that tends to $\\frac{1}{b-a}\\int_a^b f(x)\\,dx$.",
  },
  "related-rates": {
    explain:
      "When two quantities are tied by an equation and both change over time, differentiate the equation with respect to time. Plug in the specific moment's values only after differentiating.",
    proof: "If $A = \\pi r^2$ and $r$ depends on $t$, the chain rule gives $\\frac{dA}{dt} = 2\\pi r\\frac{dr}{dt}$.",
  },
  "taylor-sin-cos": {
    explain:
      "Near $0$, $\\sin x \\approx x - \\frac{x^3}{6}$ and $\\cos x \\approx 1 - \\frac{x^2}{2}$. Substituting these into a limit where the leading terms cancel gives the answer directly, often faster than repeated L'Hôpital.",
    proof:
      "A Taylor series has coefficients $\\frac{f^{(n)}(0)}{n!}$. For $\\sin$, the derivatives at $0$ cycle $0, 1, 0, -1$, so the $x^3$ coefficient is $\\frac{-1}{3!}$. For $\\cos$ they cycle $1, 0, -1, 0$, so the $x^2$ coefficient is $\\frac{-1}{2!}$.",
  },
  "arithmetico-geometric": {
    explain:
      "A sum of $n$ times a geometric term, like $\\sum\\frac{n}{2^n}$, equals $\\frac{x}{(1-x)^2}$ with $x$ the ratio. It also gives expected values for waiting times.",
    proof:
      "Differentiate $\\sum_{n \\ge 0} x^n = \\frac{1}{1-x}$ to get $\\sum nx^{n-1} = \\frac{1}{(1-x)^2}$, then multiply by $x$. Without calculus: $S - xS = x + x^2 + \\cdots = \\frac{x}{1-x}$.",
  },
  "disk-method": {
    explain:
      "Spinning a curve around the $x$-axis makes a solid whose slices are disks of radius $f(x)$. Add up the disk areas $\\pi f(x)^2$ with an integral.",
    proof: "A thin slice of thickness $\\Delta x$ at position $x$ is a disk with volume $\\pi f(x)^2\\Delta x$. Summing the slices and letting $\\Delta x \\to 0$ gives the integral.",
  },
  "tangent-line": {
    explain:
      "The tangent line at $x = a$ passes through $(a, f(a))$ with slope $f'(a)$. Near $a$ it's the best straight-line approximation of the curve.",
    proof: "A line with slope $m$ through the point $(a, p)$ has equation $y - p = m(x - a)$. The tangent line uses $p = f(a)$ and $m = f'(a)$.",
  },
  "exponential-growth": {
    explain:
      "When something grows at a rate proportional to its size, it grows exponentially, $y_0e^{kt}$, and it doubles every $\\frac{\\ln 2}{k}$ time units no matter where it starts. So a fixed doubling time means powers of $2$.",
    proof:
      "If $y' = ky$, then $\\frac{d}{dt}\\left(ye^{-kt}\\right) = (y' - ky)e^{-kt} = 0$, so $ye^{-kt}$ is constant and $y = y_0e^{kt}$. Doubling means $e^{kt} = 2$, so $t = \\frac{\\ln 2}{k}$.",
  },
};
