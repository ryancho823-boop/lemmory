import type { Notes } from "./types";

// Notes for the formulas in lib/content/extra/.
export const EXTRA_NOTES: Notes = {
  // ── algebra ──
  "sum-of-three-cubes": {
    explain:
      "This identity factors $a^3 + b^3 + c^3 - 3abc$. Its most famous consequence: whenever $a + b + c = 0$, the cubes add up to exactly $3abc$. Combined with Vieta, it also gives the sum of cubes of a cubic's roots.",
    proof:
      "Multiply out the right side: the $a \\cdot a^2$, $b\\cdot b^2$, $c\\cdot c^2$ terms give the cubes, every mixed term like $a^2b$ cancels in pairs, and the three ways to form $abc$ each contribute $-1$, giving $-3abc$.",
  },
  "rational-root": {
    explain:
      "If a polynomial has integer coefficients, any rational root in lowest terms has a numerator that divides the constant term and a denominator that divides the leading coefficient. That turns guessing roots into a short checklist.",
    proof:
      "Plug in $x = \\frac{p}{q}$ and multiply by $q^n$: $a_np^n + a_{n-1}p^{n-1}q + \\cdots + a_0q^n = 0$. Every term except $a_0q^n$ is a multiple of $p$, so $p \\mid a_0q^n$, and since $\\gcd(p, q) = 1$, $p \\mid a_0$. The same argument with $a_np^n$ gives $q \\mid a_n$.",
  },
  "conjugate-roots": {
    explain:
      "Roots involving a square root come in pairs $a \\pm b\\sqrt{c}$ when the coefficients are rational, and complex roots come in pairs $a \\pm bi$ when the coefficients are real. Knowing one root gives you a second one for free, and with Vieta the pair gives a quadratic factor.",
    proof:
      "Replacing $i$ by $-i$ (or $\\sqrt c$ by $-\\sqrt c$) respects addition and multiplication and leaves real (or rational) numbers alone. Applying it to $P(r) = 0$ gives $P(\\bar r) = \\bar 0 = 0$.",
  },
  "partial-fractions": {
    explain:
      "A fraction with a product in the denominator splits into a difference of two simpler fractions. That's what makes sums like $\\frac{1}{1\\cdot 3} + \\frac{1}{3\\cdot 5} + \\cdots$ telescope, leaving only the first and last pieces.",
    proof: "$\\frac1n - \\frac{1}{n+k} = \\frac{(n + k) - n}{n(n+k)} = \\frac{k}{n(n+k)}$. Divide both sides by $k$.",
  },
  "qm-am-gm-hm": {
    explain:
      "For positive numbers, the quadratic mean is at least the arithmetic mean, which is at least the geometric mean, which is at least the harmonic mean. All four are equal exactly when the numbers are equal, which is where the extreme values happen.",
    proof:
      "QM $\\ge$ AM: $\\frac{a^2 + b^2}{2} - \\left(\\frac{a+b}{2}\\right)^2 = \\frac{(a - b)^2}{4} \\ge 0$. AM $\\ge$ GM: $\\frac{a + b}{2} - \\sqrt{ab} = \\frac{(\\sqrt a - \\sqrt b)^2}{2} \\ge 0$. GM $\\ge$ HM: apply AM $\\ge$ GM to $\\frac1a$ and $\\frac1b$, then take reciprocals.",
  },

  // ── coordinate geometry ──
  parabola: {
    explain:
      "A parabola is all the points equally far from a point (the focus) and a line (the directrix). For $x^2 = 4py$ the focus is $p$ above the vertex and the directrix is $p$ below. The distance from a point on it to the focus equals its height above the directrix.",
    proof: "With focus $(0, p)$ and directrix $y = -p$: $\\sqrt{x^2 + (y - p)^2} = |y + p|$. Square both sides: $x^2 + y^2 - 2py + p^2 = y^2 + 2py + p^2$, so $x^2 = 4py$.",
  },
  ellipse: {
    explain:
      "An ellipse is all the points whose distances to two foci add up to $2a$, the length of the long axis. The foci sit $c$ from the center, where $c^2 = a^2 - b^2$. Its area is $\\pi ab$, a stretched circle.",
    proof:
      "The point $(0, b)$ is on the ellipse, so its distances to $(\\pm c, 0)$, each $\\sqrt{b^2 + c^2}$, add up to $2a$. That gives $b^2 + c^2 = a^2$. For the area, stretch a circle of radius $a$ by a factor of $\\frac{b}{a}$ vertically: $\\pi a^2 \\cdot \\frac ba = \\pi ab$.",
  },
  hyperbola: {
    explain:
      "A hyperbola is all the points whose distances to two foci differ by $2a$. Unlike the ellipse, $c^2 = a^2 + b^2$. Far from the center it hugs the asymptotes $y = \\pm\\frac{b}{a}x$.",
    proof:
      "Setting $\\left|\\sqrt{(x + c)^2 + y^2} - \\sqrt{(x - c)^2 + y^2}\\right| = 2a$ and squaring twice gives $\\frac{x^2}{a^2} - \\frac{y^2}{c^2 - a^2} = 1$, so $b^2 = c^2 - a^2$. For large $x$, $y \\approx \\pm\\frac{b}{a}x$.",
  },
  rotation: {
    explain:
      "To rotate a point about the origin by angle $t$, mix its coordinates with $\\cos t$ and $\\sin t$. The common cases are worth knowing by heart: $90^\\circ$ sends $(x, y)$ to $(-y, x)$, and $180^\\circ$ sends it to $(-x, -y)$.",
    proof:
      "Write $(x, y) = (r\\cos a, r\\sin a)$. After rotating it's $(r\\cos(a + t), r\\sin(a + t))$. Expanding with the angle addition formulas gives $(x\\cos t - y\\sin t,\\ x\\sin t + y\\cos t)$.",
  },

  // ── triangles ──
  "bisector-length": {
    explain:
      "When you know all three sides of a triangle, this gives the length of an angle bisector directly. It comes from Stewart's theorem combined with the angle bisector theorem.",
    proof:
      "The bisector splits $a$ into $\\frac{ac}{b+c}$ and $\\frac{ab}{b+c}$. Put $m = \\frac{ac}{b+c}$ and $n = \\frac{ab}{b+c}$ into Stewart's $b^2m + c^2n = a(t^2 + mn)$: the left side is $\\frac{abc(b + c)}{b + c} = abc$, so $t^2 = bc - mn = bc\\left(1 - \\frac{a^2}{(b+c)^2}\\right)$.",
  },
  menelaus: {
    explain:
      "When a straight line crosses all three side lines of a triangle, the three ratios it cuts multiply to $1$. It looks like Ceva's theorem, but Ceva is about three lines meeting at one point, while Menelaus is about one line cutting across.",
    proof:
      "Drop perpendiculars from $A$, $B$, $C$ to the line, with lengths $h_A$, $h_B$, $h_C$. Similar triangles give $\\frac{AF}{FB} = \\frac{h_A}{h_B}$, $\\frac{BD}{DC} = \\frac{h_B}{h_C}$, and $\\frac{CE}{EA} = \\frac{h_C}{h_A}$. Their product is $1$.",
  },
  "right-triangle-altitude": {
    explain:
      "The altitude to the hypotenuse splits a right triangle into two smaller triangles similar to the original. That gives $h = \\frac{ab}{c}$, and the altitude is the geometric mean of the two pieces of the hypotenuse.",
    proof:
      "Area two ways: $\\frac12 ab = \\frac12 ch$, so $h = \\frac{ab}{c}$. The two small triangles are similar to each other, so $\\frac{h}{p} = \\frac{q}{h}$, which gives $h^2 = pq$.",
  },
  "right-triangle-radii": {
    explain:
      "Right triangles have especially simple radii. The circumcenter is the midpoint of the hypotenuse, so $R = \\frac{c}{2}$. The inradius is $\\frac{a + b - c}{2}$, which avoids computing the area and semiperimeter.",
    proof:
      "A right angle is inscribed in a semicircle, so the hypotenuse is a diameter. For $r$: the tangent lengths from the right-angle corner are both $r$, so the hypotenuse is $(a - r) + (b - r)$. Solve $c = a + b - 2r$.",
  },
  "euler-oi": {
    explain:
      "This relates the distance between the circumcenter and incenter to the two radii. Since $OI^2 \\ge 0$, it immediately gives $R \\ge 2r$, with equality only for equilateral triangles.",
    proof:
      "Extend $AI$ to meet the circumcircle at $M$. Then $MI = MB = 2R\\sin\\frac{A}{2}$ and $AI = \\frac{r}{\\sin(A/2)}$, so $AI \\cdot IM = 2Rr$. By power of a point at $I$, $AI \\cdot IM = R^2 - OI^2$.",
  },

  // ── circles ──
  "circle-angles": {
    explain:
      "Every angle formed by chords, secants, or tangents can be read from the arcs it cuts off. Inside the circle you average the arcs. Outside, you take half the difference. A tangent and a chord make half the arc between them, just like an inscribed angle.",
    proof:
      "Inside: draw a chord to make a triangle whose exterior angle is the angle you want; it equals two inscribed angles, $\\frac{x}{2} + \\frac{y}{2}$. Outside: the inscribed angle on the far arc is the outside angle plus the inscribed angle on the near arc, so the outside angle is $\\frac{x}{2} - \\frac{y}{2}$.",
  },
  "cyclic-quadrilateral": {
    explain:
      "If four points lie on a circle, opposite angles of the quadrilateral add to $180^\\circ$. The converse is just as useful: if you can show two opposite angles are supplementary, the points are concyclic and every circle fact becomes available.",
    proof: "Opposite angles are inscribed angles on arcs that together make the whole circle, $360^\\circ$. Each is half its arc, so together they make $180^\\circ$.",
  },

  // ── polygons and solids ──
  "british-flag": {
    explain:
      "For any point and any rectangle, the squared distances to opposite corners have the same sum. Given three of the distances, you get the fourth without finding the rectangle or the point.",
    proof:
      "Put the rectangle at $(0, 0)$, $(w, 0)$, $(w, h)$, $(0, h)$ and $P = (x, y)$. Both $PA^2 + PC^2$ and $PB^2 + PD^2$ expand to $x^2 + y^2 + (w - x)^2 + (h - y)^2$.",
  },
  frustum: {
    explain:
      "Slicing the top off a cone or pyramid leaves a frustum. Its volume is the height over three times the two base areas plus their geometric mean.",
    proof:
      "Treat it as a big pyramid minus a small similar one. If the small one has height $x$, similarity gives $\\frac{x}{x+h} = \\sqrt{\\frac{B_2}{B_1}}$. Then $\\frac13 B_1(x + h) - \\frac13 B_2 x$ simplifies to $\\frac{h}{3}\\left(B_1 + B_2 + \\sqrt{B_1B_2}\\right)$.",
  },
  tetrahedron: {
    explain:
      "A regular tetrahedron with edge $s$ has a height of $s\\sqrt{\\frac23}$ and volume $\\frac{s^3}{6\\sqrt2}$. Another way to see it: take a cube with edge $\\frac{s}{\\sqrt2}$ and slice off four corners, leaving one third of the cube.",
    proof:
      "The center of a face is $\\frac{s}{\\sqrt3}$ from each of its corners, so $h^2 = s^2 - \\frac{s^2}{3}$ and $h = s\\sqrt{\\frac23}$. Then $V = \\frac13 \\cdot \\frac{\\sqrt3}{4}s^2 \\cdot s\\sqrt{\\frac23} = \\frac{s^3}{6\\sqrt2}$.",
  },
  pappus: {
    explain:
      "Spinning a flat shape around an axis sweeps out a volume equal to its area times the distance its centroid travels. A torus, for example, is a circle carried around a circle.",
    proof:
      "Each small piece $dA$ at distance $x$ from the axis sweeps a ring of volume $2\\pi x\\,dA$. Adding them up gives $2\\pi \\int x\\,dA$, and by the definition of the centroid, $\\int x\\,dA = dA$.",
  },

  // ── trigonometry and complex numbers ──
  "half-angle": {
    explain:
      "Half-angle formulas give the trig values of half an angle from the cosine of the full angle. They're how you get exact values like $\\sin 15^\\circ$ and $\\tan 22.5^\\circ$. The sign depends on the quadrant.",
    proof:
      "Start from $\\cos x = 2\\cos^2\\frac{x}{2} - 1 = 1 - 2\\sin^2\\frac{x}{2}$ and solve for $\\cos^2\\frac{x}{2}$ and $\\sin^2\\frac{x}{2}$. For tangent, multiply top and bottom of $\\frac{\\sin(x/2)}{\\cos(x/2)}$ by $2\\cos\\frac{x}{2}$ to get $\\frac{\\sin x}{1 + \\cos x}$.",
  },
  "euler-de-moivre": {
    explain:
      "Euler's formula writes any complex number as a length and an angle: $z = re^{i\\theta}$. Multiplying multiplies lengths and adds angles, so raising to the $n$th power gives length $r^n$ and angle $n\\theta$. That makes large powers and roots quick.",
    proof:
      "The series $e^{i\\theta} = \\sum \\frac{(i\\theta)^k}{k!}$ splits into its real terms, the series for $\\cos\\theta$, and its imaginary terms, the series for $\\sin\\theta$. Exponent rules then give $\\left(re^{i\\theta}\\right)^n = r^ne^{in\\theta}$.",
  },
  "roots-of-unity": {
    explain:
      "The solutions of $z^n = 1$ are $n$ points spaced evenly around the unit circle, starting at $1$. By symmetry they balance out, so they add up to $0$. That makes sums of evenly spaced cosines easy.",
    proof:
      "$\\left(e^{2\\pi ik/n}\\right)^n = e^{2\\pi ik} = 1$, and the $n$ values for $k = 0, \\dots, n-1$ are different. They're the roots of $z^n - 1$, whose $z^{n-1}$ coefficient is $0$, so by Vieta their sum is $0$.",
  },
};
