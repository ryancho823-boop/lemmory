import type { Notes } from "./types";

export const TRIG_NOTES: Notes = {
  "double-angle": {
    explain:
      "These rewrite $\\sin 2x$ and $\\cos 2x$ in terms of $\\sin x$ and $\\cos x$. The cosine version has three useful forms: $\\cos^2 x - \\sin^2 x$, $2\\cos^2 x - 1$, and $1 - 2\\sin^2 x$; pick whichever matches what you know.",
    proof:
      "Set $b = a = x$ in the angle addition formulas: $\\sin 2x = 2\\sin x\\cos x$ and $\\cos 2x = \\cos^2 x - \\sin^2 x$. Replace $\\sin^2 x$ or $\\cos^2 x$ using $\\sin^2 x + \\cos^2 x = 1$ for the other two forms.",
  },
  "angle-addition": {
    explain:
      "Angle addition gives the sine and cosine of a sum from the pieces. It's how you compute values like $\\sin 75^\\circ$ or $\\cos 15^\\circ$ from the special angles, and it's the source of the double, triple, and half-angle formulas.",
    proof:
      "Rotating the point $(\\cos b, \\sin b)$ on the unit circle by angle $a$ lands on $(\\cos(a+b), \\sin(a+b))$. Writing out that rotation, $x' = x\\cos a - y\\sin a$ and $y' = x\\sin a + y\\cos a$, gives both formulas.",
  },
  "tan-addition": {
    explain:
      "This adds two angles when you know their tangents. Tangents are slopes, so it's useful in coordinate and grid problems; if the result is $1$, the angles add to $45^\\circ$.",
    proof:
      "$\\tan(a + b) = \\frac{\\sin a\\cos b + \\cos a\\sin b}{\\cos a\\cos b - \\sin a\\sin b}$. Divide the top and bottom by $\\cos a\\cos b$ to get $\\frac{\\tan a + \\tan b}{1 - \\tan a\\tan b}$.",
  },
  "power-reduction": {
    explain:
      "These turn $\\cos^2 x$ and $\\sin^2 x$ into first powers of $\\cos 2x$. Read backwards they're half-angle formulas, giving exact values like $\\cos^2 15^\\circ$ from $\\cos 30^\\circ$.",
    proof: "Solve $\\cos 2x = 2\\cos^2 x - 1$ for $\\cos^2 x$, and $\\cos 2x = 1 - 2\\sin^2 x$ for $\\sin^2 x$.",
  },
  "area-sine": {
    explain:
      "With two sides and the angle between them, the area is half their product times the sine of the angle. When the angle is $90^\\circ$ it reduces to half base times height; it also works for parallelograms (drop the $\\frac12$).",
    proof: "Take $a$ as the base. The height to it is $b\\sin C$ (the side $b$ times the sine of the angle it makes with the base), so the area is $\\frac12 a \\cdot b\\sin C$.",
  },
  "law-of-cosines": {
    explain:
      "The law of cosines is the Pythagorean theorem with a correction term for non-right angles. Use it to find the third side from two sides and the angle between them, or to find any angle once all three sides are known.",
    proof:
      "Put $C$ at the origin and $B$ at $(a, 0)$, so $A = (b\\cos C, b\\sin C)$. Then $c^2 = (b\\cos C - a)^2 + (b\\sin C)^2 = a^2 + b^2 - 2ab\\cos C$.",
  },
  "law-of-sines": {
    explain:
      "Each side divided by the sine of its opposite angle gives the same number, and that number is the diameter of the circumscribed circle. Use it when sides and their opposite angles appear together, or when the circumradius is involved.",
    proof:
      "Draw the diameter from $B$ through the circumcenter to point $A'$ on the circle. Angle $A'$ equals angle $A$ (same arc), and triangle $A'BC$ has a right angle at $C$, so $a = 2R\\sin A$.",
  },
  "sum-to-product": {
    explain:
      "A sum of two sines (or cosines) becomes a product. Products are easier to set to zero, and the formula turns sums like $\\sin 75^\\circ + \\sin 15^\\circ$ into special angles.",
    proof:
      "Let $u = \\frac{a+b}{2}$ and $v = \\frac{a-b}{2}$, so $a = u + v$ and $b = u - v$. Then $\\sin(u + v) + \\sin(u - v) = 2\\sin u\\cos v$ by angle addition, since the $\\cos u\\sin v$ terms cancel.",
  },
  "product-to-sum": {
    explain:
      "The reverse of sum-to-product: a product of sines and cosines at different angles becomes a sum. It's useful for simplifying products and for telescoping sums of trig terms.",
    proof: "Add $\\sin(a + b) = \\sin a\\cos b + \\cos a\\sin b$ and $\\sin(a - b) = \\sin a\\cos b - \\cos a\\sin b$: the second terms cancel, leaving $2\\sin a\\cos b$.",
  },
  "triple-angle": {
    explain:
      "These write $\\sin 3x$ and $\\cos 3x$ as cubics in $\\sin x$ and $\\cos x$. They come up when an angle and its triple appear together, and they explain why angles like $20^\\circ$ lead to cubic equations.",
    proof:
      "$\\sin 3x = \\sin(2x + x) = \\sin 2x\\cos x + \\cos 2x\\sin x = 2\\sin x\\cos^2 x + (1 - 2\\sin^2 x)\\sin x$. Replace $\\cos^2 x$ with $1 - \\sin^2 x$ to get $3\\sin x - 4\\sin^3 x$. The cosine version is the same idea.",
  },
  polar: {
    explain:
      "Polar coordinates describe a point by its distance $r$ from the origin and its angle $t$. Convert to $x$ and $y$ with cosine and sine, and back with $r = \\sqrt{x^2 + y^2}$. Rotations are easy in polar form: just add to the angle.",
    proof:
      "The point, the origin, and the foot of the perpendicular to the $x$-axis form a right triangle with hypotenuse $r$ and angle $t$ at the origin. Its legs are $r\\cos t$ and $r\\sin t$.",
  },
  "arctan-sum": {
    explain:
      "For positive $x$, $\\arctan x$ and $\\arctan\\frac1x$ are complementary angles, so they add to $\\frac\\pi2$. For other sums of arctangents, apply the tangent addition formula to the angles.",
    proof:
      "In a right triangle with legs $1$ and $x$, one acute angle has tangent $x$ and the other has tangent $\\frac1x$. The two acute angles of a right triangle add to $90^\\circ = \\frac\\pi2$.",
  },
};
