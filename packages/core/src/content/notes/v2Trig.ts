import type { Notes } from "./types";

export const TRIG_V2_NOTES: Notes = {
  "law-of-tangents": {
    explain: "If you know $a$, $b$ and the angle $C$ between them, you know $A + B = 180^\\circ - C$. The law of tangents then gives $A - B$, and so both angles, without using the law of cosines.",
    proof: "By the law of sines, $\\frac{a-b}{a+b} = \\frac{\\sin A - \\sin B}{\\sin A + \\sin B}$. Sum-to-product turns the top into $2\\cos\\frac{A+B}{2}\\sin\\frac{A-B}{2}$ and the bottom into $2\\sin\\frac{A+B}{2}\\cos\\frac{A-B}{2}$. Divide.",
  },
  mollweide: {
    explain: "These relate the sum or difference of two sides to the third side using only angles. Each one contains all six parts of the triangle, so it's often used to check a solved triangle.",
    proof: "By the law of sines, $\\frac{a+b}{c} = \\frac{\\sin A + \\sin B}{\\sin C} = \\frac{2\\sin\\frac{A+B}{2}\\cos\\frac{A-B}{2}}{2\\sin\\frac C2\\cos\\frac C2}$. Since $\\frac{A+B}{2} = 90^\\circ - \\frac C2$, $\\sin\\frac{A+B}{2} = \\cos\\frac C2$ cancels.",
  },
  "auxiliary-angle": {
    explain: "Any mix $a\\sin x + b\\cos x$ is a single sine wave with amplitude $\\sqrt{a^2 + b^2}$, just shifted. So its largest value is $\\sqrt{a^2 + b^2}$ and its smallest is $-\\sqrt{a^2 + b^2}$.",
    proof: "Let $R = \\sqrt{a^2+b^2}$ and pick $\\varphi$ with $\\cos\\varphi = \\frac aR$, $\\sin\\varphi = \\frac bR$. Then $a\\sin x + b\\cos x = R(\\sin x\\cos\\varphi + \\cos x\\sin\\varphi) = R\\sin(x + \\varphi)$.",
  },
  "tan-half-sub": {
    explain: "Setting $t = \\tan\\frac x2$ writes $\\sin x$ and $\\cos x$ without square roots, so trig equations become polynomial equations in $t$. It also gives quick values: $\\tan\\frac x2 = \\frac12$ means $\\sin x = \\frac45$, $\\cos x = \\frac35$.",
    proof: "$\\sin x = 2\\sin\\frac x2\\cos\\frac x2 = \\frac{2\\tan\\frac x2}{\\sec^2\\frac x2} = \\frac{2t}{1 + t^2}$. Likewise $\\cos x = \\cos^2\\frac x2 - \\sin^2\\frac x2 = \\cos^2\\frac x2(1 - t^2) = \\frac{1 - t^2}{1 + t^2}$.",
  },
  "triangle-tan-identity": {
    explain: "In a triangle, the sum of the three tangents equals their product. Knowing two tangents gives the third from a linear equation.",
    proof: "$\\tan C = -\\tan(A + B) = -\\frac{\\tan A + \\tan B}{1 - \\tan A\\tan B}$. Multiply out: $\\tan C - \\tan A\\tan B\\tan C = -\\tan A - \\tan B$. Rearrange.",
  },
  "cos-squares-identity": {
    explain: "The cosines of a triangle's angles are tied by one equation. Given two of them, it's a quadratic in the third; one root is $-1$, which no triangle can have, so take the other.",
    proof: "$\\cos C = -\\cos(A+B) = \\sin A\\sin B - \\cos A\\cos B$. So $(\\cos C + \\cos A\\cos B)^2 = (1 - \\cos^2A)(1 - \\cos^2B)$. Expanding and cancelling $\\cos^2A\\cos^2B$ gives the identity.",
  },
  "half-angle-sides": {
    explain: "Half-angles of a triangle come straight from the sides. The tangent version is the easiest to remember: the incircle touches side $AB$ at distance $s - a$ from $A$, and the inradius is the opposite leg.",
    proof: "The incenter $I$, vertex $A$ and the touch point on $AB$ form a right triangle with legs $r$ and $s - a$, and angle $\\frac A2$ at $A$. So $\\tan\\frac A2 = \\frac{r}{s-a}$. The sine and cosine forms come from $\\cos A$ by the law of cosines and the half-angle formulas.",
  },
  "inradius-sines": {
    explain: "The inradius is the circumradius times a product of half-angle sines. A cleaner consequence: $\\cos A + \\cos B + \\cos C$ is always $1 + \\frac rR$, which is at most $\\frac32$ since $R \\ge 2r$.",
    proof: "The tangent lengths on side $a$ are $r\\cot\\frac B2$ and $r\\cot\\frac C2$, so $a = \\frac{r\\sin\\frac{B+C}{2}}{\\sin\\frac B2\\sin\\frac C2} = \\frac{r\\cos\\frac A2}{\\sin\\frac B2\\sin\\frac C2}$. Also $a = 2R\\sin A = 4R\\sin\\frac A2\\cos\\frac A2$. Set them equal and cancel $\\cos\\frac A2$. For the cosine sum, sum-to-product gives $\\cos A + \\cos B + \\cos C = 1 + 4\\sin\\frac A2\\sin\\frac B2\\sin\\frac C2 = 1 + \\frac rR$.",
  },
  "area-sines": {
    explain: "If you know the angles and the circumradius, the area is $2R^2\\sin A\\sin B\\sin C$. Equivalently, $K = \\frac{abc}{4R}$ when the sides are known.",
    proof: "Start from $K = \\frac12ab\\sin C$ and use the law of sines $a = 2R\\sin A$, $b = 2R\\sin B$. For the other form, $\\sin C = \\frac{c}{2R}$ gives $K = \\frac{abc}{4R}$.",
  },
  "sine-ap-sum": {
    explain: "A sum of sines at equally spaced angles equals the sine of the middle angle times a fixed ratio. Picture vectors at equal turning angles: they form part of a regular polygon.",
    proof: "Multiply the sum by $2\\sin\\frac d2$. Product-to-sum turns each term $2\\sin(a + kd)\\sin\\frac d2$ into $\\cos(a + (k - \\frac12)d) - \\cos(a + (k + \\frac12)d)$, which telescopes to $\\cos(a - \\frac d2) - \\cos(a + (n - \\frac12)d) = 2\\sin\\left(a + \\frac{(n-1)d}{2}\\right)\\sin\\frac{nd}{2}$.",
  },
  "sine-product": {
    explain: "Two product formulas cover most contest products. Sines of $\\frac{k\\pi}{n}$ for $k = 1, \\dots, n-1$ multiply to $\\frac{n}{2^{n-1}}$. And three angles $x$, $60^\\circ - x$, $60^\\circ + x$ multiply to $\\frac14\\sin 3x$.",
    proof: "For the first, $\\frac{z^n - 1}{z - 1} = \\prod_{k=1}^{n-1}(z - \\omega^k)$; set $z = 1$ to get $n = \\prod|1 - \\omega^k|$, and $|1 - \\omega^k| = 2\\sin\\frac{k\\pi}{n}$. For the second, $\\sin(60^\\circ - x)\\sin(60^\\circ + x) = \\sin^2 60^\\circ - \\sin^2x = \\frac34 - \\sin^2 x$; multiply by $\\sin x$ and compare with $\\sin 3x = 3\\sin x - 4\\sin^3x$.",
  },
  "exact-values": {
    explain: "Beyond $30^\\circ$, $45^\\circ$ and $60^\\circ$, these are the ones worth knowing. $15^\\circ$ comes from $45^\\circ - 30^\\circ$. $18^\\circ$ and $36^\\circ$ come from the regular pentagon, which is why $\\sqrt5$ shows up: $\\cos 36^\\circ$ is half the golden ratio.",
    proof: "$\\sin 15^\\circ = \\sin 45^\\circ\\cos 30^\\circ - \\cos 45^\\circ\\sin 30^\\circ$. For $x = 18^\\circ$, $2x = 90^\\circ - 3x$, so $\\sin 2x = \\cos 3x$: $2\\sin x = 4\\cos^2x - 3 = 1 - 4\\sin^2x$. Solve $4s^2 + 2s - 1 = 0$. Then $\\cos 36^\\circ = 1 - 2\\sin^2 18^\\circ$.",
  },
  "chebyshev-poly": {
    explain: "Each $\\cos n\\theta$ is a polynomial in $\\cos\\theta$, and you can build them up one at a time: double the previous one times $\\cos\\theta$ and subtract the one before.",
    proof: "Add $\\cos(n+1)\\theta = \\cos n\\theta\\cos\\theta - \\sin n\\theta\\sin\\theta$ and $\\cos(n-1)\\theta = \\cos n\\theta\\cos\\theta + \\sin n\\theta\\sin\\theta$ to get $2\\cos\\theta\\cos n\\theta$.",
  },
  "equal-angle-sums": {
    explain: "Cosines at angles spaced evenly around the full circle cancel to $0$. Their squares average to $\\frac12$, so they sum to $\\frac n2$.",
    proof: "The cosines are the real parts of $n$ points forming a regular $n$-gon centered at $0$, which sum to $0$. For squares, $\\cos^2 t = \\frac{1 + \\cos 2t}{2}$, and the doubled angles are still evenly spaced when $n \\ge 3$, so their cosines also sum to $0$.",
  },
  "projection-formula": {
    explain: "Each side equals the sum of the shadows the other two sides cast on it. It's a linear relation, so it's often quicker than the law of cosines.",
    proof: "Drop the altitude from $A$ to line $BC$, meeting it at $D$. Then $BD = c\\cos B$ and $DC = b\\cos C$, and $a = BD + DC$. If an angle is obtuse, its cosine is negative and the shadow subtracts, so the formula still holds.",
  },
  "half-angle-tan-identity": {
    explain: "The pairwise products of a triangle's half-angle tangents always add to $1$. Two half-angle tangents give the third from a linear equation.",
    proof: "$\\frac A2 + \\frac B2 = 90^\\circ - \\frac C2$, so $\\tan\\left(\\frac A2 + \\frac B2\\right) = \\cot\\frac C2$. Write $x, y, z$ for the half-angle tangents: $\\frac{x + y}{1 - xy} = \\frac1z$, so $z(x + y) = 1 - xy$.",
  },
  "complex-distance": {
    explain: "Subtract and take the modulus: $|z - w|$ is just the distance between the points $z$ and $w$. So $|z - c| = r$ is a circle, which turns many complex questions into geometry.",
    proof: "If $z = a + bi$ and $w = c + di$, then $z - w = (a - c) + (b - d)i$, whose modulus is $\\sqrt{(a-c)^2 + (b-d)^2}$, the distance formula.",
  },
};
