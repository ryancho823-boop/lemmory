import type { Notes } from "./types";

export const GEOMETRY_NOTES: Notes = {
  shoelace: {
    explain:
      "The shoelace formula finds the area of any polygon from its vertex coordinates, as long as you list the vertices in order around the shape. Cross-multiply consecutive coordinates, subtract the two diagonal sums, and halve the absolute value.",
    proof:
      "Each term $\\frac12(x_iy_{i+1} - x_{i+1}y_i)$ is the signed area of the triangle formed by the origin and edge $i$. Going around the polygon, the triangles outside the shape cancel with opposite signs, leaving the polygon's area.",
  },
  "inscribed-angle": {
    explain:
      "An angle with its vertex on a circle is half the arc it cuts off. Two big consequences: angles that cut off the same arc are equal, and an angle cutting off a diameter is $90^\\circ$. Opposite angles of a cyclic quadrilateral add to $180^\\circ$.",
    proof:
      "Case where one side passes through the center $O$: triangle formed with $O$ is isosceles (two radii), so its base angles are equal, and the exterior angle at $O$, the central angle, is their sum, twice the inscribed angle. Other cases split into two such pieces.",
  },
  heron: {
    explain:
      "Heron's formula finds a triangle's area from just its three side lengths, with no angles or heights needed. Compute the semiperimeter $s$ first; integer triangles like $13$-$14$-$15$ often give whole-number areas.",
    proof:
      "Start from $K = \\frac12 ab\\sin C$ and the law of cosines for $\\cos C$. Then $16K^2 = 4a^2b^2(1 - \\cos^2 C) = (2ab)^2 - (a^2 + b^2 - c^2)^2$, which factors by differences of squares into $(a+b+c)(-a+b+c)(a-b+c)(a+b-c) = 16s(s-a)(s-b)(s-c)$.",
  },
  brahmagupta: {
    explain:
      "Brahmagupta's formula is Heron's formula for a quadrilateral inscribed in a circle. Only use it when the quadrilateral is cyclic; for other quadrilaterals the area isn't determined by the sides alone. Setting $d = 0$ gives back Heron's formula.",
    proof:
      "Split the quadrilateral along a diagonal into two triangles. Opposite angles of a cyclic quadrilateral are supplementary, so the two triangles share the same $\\sin$ of their angles at the ends of the diagonal. Combining the two area formulas and the law of cosines for the diagonal, then factoring like Heron's proof, gives the result.",
  },
  "angle-bisector": {
    explain:
      "An angle bisector splits the opposite side in the same ratio as the two sides next to the angle. If the sides are $5$ and $7$, the opposite side is split $5 : 7$, with the shorter piece next to the shorter side.",
    proof:
      "Triangles $ABD$ and $ACD$ share the height from $A$, so their areas are in ratio $BD : DC$. They also have equal angles at $A$, so their areas are $\\frac12 \\cdot AB \\cdot AD\\sin\\theta$ and $\\frac12 \\cdot AC \\cdot AD\\sin\\theta$, in ratio $AB : AC$.",
  },
  "power-of-a-point": {
    explain:
      "For any point and any line through it that meets a circle twice, the product of the two distances to the circle is the same. It covers crossing chords, two secants from outside, and a tangent with a secant (where the tangent counts twice).",
    proof:
      "For chords $AB$ and $CD$ crossing at $P$: inscribed angles on the same arc give $\\angle PAC = \\angle PDB$ and $\\angle APC = \\angle DPB$, so triangles $PAC$ and $PDB$ are similar. Then $\\frac{PA}{PD} = \\frac{PC}{PB}$, so $PA \\cdot PB = PC \\cdot PD$. The outside cases use the same similar triangles.",
  },
  stewart: {
    explain:
      "Stewart's theorem gives the length of any cevian (a segment from a vertex to the opposite side) from the three sides and where the cevian lands. The mnemonic \"a man and his dad put a bomb in the sink\" spells $man + dad = bmb + cnc$.",
    proof:
      "Let $\\theta$ be the angle at $D$ in triangle $ABD$, so the angle at $D$ in triangle $ACD$ is $180^\\circ - \\theta$. Law of cosines in each: $c^2 = m^2 + d^2 - 2md\\cos\\theta$ and $b^2 = n^2 + d^2 + 2nd\\cos\\theta$. Multiply the first by $n$, the second by $m$, and add; the cosines cancel.",
  },
  ptolemy: {
    explain:
      "In a cyclic quadrilateral, the product of the diagonals equals the sum of the products of opposite sides. It's especially powerful for regular polygons and for points on a circle around an equilateral triangle.",
    proof:
      "Pick point $E$ on diagonal $AC$ with $\\angle ABE = \\angle DBC$. Inscribed angles make $\\triangle ABE \\sim \\triangle DBC$ and $\\triangle CBE \\sim \\triangle DBA$, which give $AE \\cdot BD = AB \\cdot CD$ and $CE \\cdot BD = BC \\cdot AD$. Adding them gives $AC \\cdot BD = AB \\cdot CD + AD \\cdot BC$.",
  },
  "inradius-circumradius": {
    explain:
      "A triangle's area connects to both of its special circles: $K = rs$ for the inscribed circle and $K = \\frac{abc}{4R}$ for the circumscribed one. Find the area another way (often Heron), then solve for $r$ or $R$.",
    proof:
      "Inradius: the incenter splits the triangle into three triangles with bases $a, b, c$ and common height $r$, so $K = \\frac12 r(a + b + c) = rs$. Circumradius: $K = \\frac12 ab\\sin C$ and the law of sines gives $\\sin C = \\frac{c}{2R}$.",
  },
  picks: {
    explain:
      "For a polygon whose corners are lattice points, area equals the interior points plus half the boundary points, minus one. Count boundary points on a segment from $(x_1,y_1)$ to $(x_2,y_2)$ with $\\gcd(|x_2 - x_1|, |y_2 - y_1|)$.",
    proof:
      "Sketch: the formula is additive, so gluing two lattice polygons along an edge keeps it true. It holds for rectangles and right triangles by direct counting, and every lattice polygon can be built from those by gluing and cutting.",
  },
  "point-line-distance": {
    explain:
      "The shortest distance from a point to a line is along the perpendicular, and this formula computes it directly from the line's equation. For two parallel lines $Ax + By = C_1$ and $Ax + By = C_2$, the distance is $\\frac{|C_1 - C_2|}{\\sqrt{A^2 + B^2}}$.",
    proof:
      "The vector $(A, B)$ is perpendicular to the line. Moving from $(x_0, y_0)$ along it by $t$ reaches the line when $A(x_0 + tA) + B(y_0 + tB) + C = 0$, so $t = -\\frac{Ax_0 + By_0 + C}{A^2 + B^2}$. The distance is $|t|\\sqrt{A^2 + B^2}$.",
  },
  "median-length": {
    explain:
      "This gives a median's length straight from the three sides. It's Stewart's theorem with the foot of the cevian at the midpoint, simplified.",
    proof:
      "Stewart with $m = n = \\frac a2$: $b^2\\frac a2 + c^2\\frac a2 = a\\left(m_a^2 + \\frac{a^2}{4}\\right)$. Divide by $a$ and solve: $m_a^2 = \\frac{2b^2 + 2c^2 - a^2}{4}$.",
  },
  "tangent-length": {
    explain:
      "A tangent meets the radius at a right angle, so the tangent length from an outside point is $\\sqrt{d^2 - r^2}$. The two tangents from one point are equal, which is why the incircle's touch points split each side of a triangle into pieces like $s - a$.",
    proof:
      "The radius to the point of tangency is perpendicular to the tangent, so center, tangent point, and outside point form a right triangle with hypotenuse $d$ and leg $r$. The other leg is $\\sqrt{d^2 - r^2}$, the same for both tangents.",
  },
  "euler-polyhedron": {
    explain:
      "For any convex polyhedron, vertices minus edges plus faces is always $2$. Combine it with edge counts (each edge touches two faces and two vertices) to find a missing quantity.",
    proof:
      "Sketch: remove one face and flatten the rest onto the plane, which leaves $V - E + F$ smaller by $1$. Triangulate (each added edge also adds a face, no change), then remove boundary triangles one at a time; each removal keeps $V - E + F$ the same. You end with one triangle, where $V - E + F = 3 - 3 + 1 = 1$, so originally it was $2$.",
  },
  centroid: {
    explain:
      "The centroid is where the three medians meet, and its coordinates are the averages of the vertices' coordinates. It's two thirds of the way from each vertex to the midpoint of the opposite side.",
    proof:
      "The point $\\frac23$ of the way from $A$ to the midpoint $\\frac{B + C}{2}$ is $A + \\frac23\\left(\\frac{B + C}{2} - A\\right) = \\frac{A + B + C}{3}$. That expression is symmetric, so the same point lies on all three medians.",
  },
  ceva: {
    explain:
      "Three cevians of a triangle meet at a single point exactly when the product of the three side ratios, going around the triangle, is $1$. Use it to find a missing ratio, or to prove that three lines are concurrent.",
    proof:
      "Let the cevians meet at $P$. Triangles with a common height have areas proportional to their bases, so $\\frac{BD}{DC} = \\frac{[ABP]}{[ACP]}$, $\\frac{CE}{EA} = \\frac{[BCP]}{[BAP]}$, and $\\frac{AF}{FB} = \\frac{[CAP]}{[CBP]}$. Multiplying, every area cancels.",
  },
};
