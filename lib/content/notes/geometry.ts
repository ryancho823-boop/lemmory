import type { Notes } from "./types";

export const GEOMETRY_NOTES: Notes = {
  pythagorean: {
    explain:
      "In a right triangle, the squares of the two legs add up to the square of the hypotenuse. Memorizing common triples like $3$-$4$-$5$, $5$-$12$-$13$, and their multiples saves a lot of arithmetic. Whenever a problem has a right angle, even a hidden one, look for it.",
    proof:
      "Place four copies of the triangle inside a square of side $a + b$, leaving a tilted square of side $c$ in the middle. Area two ways: $(a + b)^2 = 4\\cdot\\frac12 ab + c^2$, which simplifies to $a^2 + b^2 = c^2$.",
  },
  "distance-formula": {
    explain:
      "The distance between two points is the hypotenuse of the right triangle whose legs are the horizontal and vertical gaps. It's the Pythagorean theorem written in coordinates.",
    proof:
      "The points differ by $x_2 - x_1$ horizontally and $y_2 - y_1$ vertically. Those are perpendicular legs, so the straight-line distance is $\\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$.",
  },
  shoelace: {
    explain:
      "The shoelace formula finds the area of any polygon from its vertex coordinates, as long as you list the vertices in order around the shape. Cross-multiply consecutive coordinates, subtract the two diagonal sums, and halve the absolute value.",
    proof:
      "Each term $\\frac12(x_iy_{i+1} - x_{i+1}y_i)$ is the signed area of the triangle formed by the origin and edge $i$. Going around the polygon, the triangles outside the shape cancel with opposite signs, leaving the polygon's area.",
  },
  "triangle-inequality": {
    explain:
      "Any side of a triangle must be shorter than the other two combined, and longer than their difference. It decides whether three lengths can form a triangle and how many integer third sides are possible.",
    proof:
      "The straight segment between two points is the shortest path. Going from one vertex to another through the third vertex is a longer path, so $c < a + b$. Rearranging the other two inequalities gives $c > |a - b|$.",
  },
  "polygon-angles": {
    explain:
      "An $n$-sided polygon's interior angles add to $180^\\circ(n - 2)$, and in a regular polygon they're all equal. The exterior angles always add to $360^\\circ$, which is often the fastest route: each exterior angle of a regular $n$-gon is $\\frac{360^\\circ}{n}$.",
    proof:
      "Draw diagonals from one vertex. They split the polygon into $n - 2$ triangles, each with angle sum $180^\\circ$, and together those angles make up exactly the polygon's interior angles.",
  },
  "equilateral-area": {
    explain:
      "An equilateral triangle with side $s$ has height $\\frac{\\sqrt3}{2}s$ and area $\\frac{\\sqrt3}{4}s^2$. A regular hexagon splits into six of these triangles, so its area is $\\frac{3\\sqrt3}{2}s^2$.",
    proof:
      "The altitude splits the triangle into two $30$-$60$-$90$ triangles with hypotenuse $s$ and short leg $\\frac s2$, so the height is $\\sqrt{s^2 - \\frac{s^2}{4}} = \\frac{\\sqrt3}{2}s$. Area $= \\frac12 \\cdot s \\cdot \\frac{\\sqrt3}{2}s$.",
  },
  "arcs-sectors": {
    explain:
      "An arc or sector is a fraction of the whole circle, and that fraction is the central angle over $360^\\circ$. Multiply the full circumference or full area by that fraction.",
    proof:
      "Arc length and sector area are proportional to the central angle, since equal angles cut equal pieces. The full $360^\\circ$ gives circumference $2\\pi r$ and area $\\pi r^2$, so $d^\\circ$ gives $\\frac{d}{360}$ of each.",
  },
  "inscribed-angle": {
    explain:
      "An angle with its vertex on a circle is half the arc it cuts off. Two big consequences: angles that cut off the same arc are equal, and an angle cutting off a diameter is $90^\\circ$. Opposite angles of a cyclic quadrilateral add to $180^\\circ$.",
    proof:
      "Case where one side passes through the center $O$: triangle formed with $O$ is isosceles (two radii), so its base angles are equal, and the exterior angle at $O$, the central angle, is their sum, twice the inscribed angle. Other cases split into two such pieces.",
  },
  "similar-figures": {
    explain:
      "When a figure is scaled by $k$, every length scales by $k$, every area by $k^2$, and every volume by $k^3$. A line parallel to one side of a triangle cuts off a smaller similar triangle, which is where this shows up most.",
    proof:
      "Area is measured in squares of side $1$; scaling turns each into a square of side $k$, area $k^2$. Volume uses unit cubes, which become $k \\times k \\times k$ cubes, volume $k^3$.",
  },
  volumes: {
    explain:
      "A sphere of radius $r$ holds $\\frac43\\pi r^3$, and any cone or pyramid is one third of base times height. The sphere's surface area, $4\\pi r^2$, is exactly the derivative of its volume with respect to $r$.",
    proof:
      "Cone: slice it into thin disks at height $t$ with radius $\\frac{r}{h}t$; the volume is $\\int_0^h \\pi\\left(\\frac{rt}{h}\\right)^2dt = \\frac13\\pi r^2h$. Sphere: disks of radius $\\sqrt{r^2 - t^2}$ give $\\int_{-r}^{r}\\pi(r^2 - t^2)\\,dt = \\frac43\\pi r^3$.",
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
  midpoint: {
    explain:
      "The midpoint of a segment averages the coordinates of its endpoints. Run it backwards to find a missing endpoint: $B = 2M - A$.",
    proof:
      "Going from $A$ to $B$ changes $x$ by $x_2 - x_1$. Halfway there, $x = x_1 + \\frac{x_2 - x_1}{2} = \\frac{x_1 + x_2}{2}$; the same for $y$.",
  },
  "circle-equation": {
    explain:
      "A circle is every point at distance $r$ from its center, which written with the distance formula is $(x - h)^2 + (y - k)^2 = r^2$. When an equation comes expanded, complete the square in $x$ and in $y$ to read off the center and radius.",
    proof:
      "Complete the squares in $x^2 + Dx + y^2 + Ey + F = 0$: $\\left(x + \\frac D2\\right)^2 + \\left(y + \\frac E2\\right)^2 = \\frac{D^2}{4} + \\frac{E^2}{4} - F$. The right side is $r^2$.",
  },
  "point-line-distance": {
    explain:
      "The shortest distance from a point to a line is along the perpendicular, and this formula computes it directly from the line's equation. For two parallel lines $Ax + By = C_1$ and $Ax + By = C_2$, the distance is $\\frac{|C_1 - C_2|}{\\sqrt{A^2 + B^2}}$.",
    proof:
      "The vector $(A, B)$ is perpendicular to the line. Moving from $(x_0, y_0)$ along it by $t$ reaches the line when $A(x_0 + tA) + B(y_0 + tB) + C = 0$, so $t = -\\frac{Ax_0 + By_0 + C}{A^2 + B^2}$. The distance is $|t|\\sqrt{A^2 + B^2}$.",
  },
  "trapezoid-area": {
    explain:
      "A trapezoid's area is the average of its two parallel bases times the height. The average of the bases is also the length of the midline, the segment joining the midpoints of the legs.",
    proof:
      "Rotate a copy of the trapezoid $180^\\circ$ and attach it along a leg. The two copies form a parallelogram with base $b_1 + b_2$ and height $h$, so one trapezoid is half of $(b_1 + b_2)h$.",
  },
  "circle-area": {
    explain:
      "A circle's circumference is $2\\pi r$ and its area is $\\pi r^2$. For a ring (annulus), subtract the inner circle's area from the outer one.",
    proof:
      "$\\pi$ is defined as circumference over diameter, so $C = 2\\pi r$. Cut the disk into thin wedges and rearrange them into a near-rectangle with height $r$ and width half the circumference, $\\pi r$, so the area is $\\pi r^2$.",
  },
  "special-right-triangles": {
    explain:
      "The $45$-$45$-$90$ triangle (half a square) has sides $1 : 1 : \\sqrt2$, and the $30$-$60$-$90$ triangle (half an equilateral triangle) has sides $1 : \\sqrt3 : 2$. Recognizing them avoids trig entirely.",
    proof:
      "Cut a unit square along its diagonal: legs $1$, hypotenuse $\\sqrt{1 + 1} = \\sqrt2$. Cut an equilateral triangle of side $2$ down its altitude: hypotenuse $2$, short leg $1$, long leg $\\sqrt{4 - 1} = \\sqrt3$.",
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
  "box-diagonal": {
    explain:
      "The space diagonal of a box reaches from one corner to the opposite corner through the inside. It's the Pythagorean theorem used twice, and for a cube of side $s$ it's $s\\sqrt3$.",
    proof:
      "The diagonal of the bottom face is $\\sqrt{a^2 + b^2}$. It's perpendicular to the vertical edge $c$, so the space diagonal is $\\sqrt{(a^2 + b^2) + c^2}$.",
  },
  cylinder: {
    explain:
      "A cylinder's volume is base area times height. Its surface area is two circles plus the side, which unrolls into a rectangle whose width is the circumference.",
    proof:
      "Stacking circular slices of area $\\pi r^2$ to height $h$ gives $\\pi r^2 h$. The side unrolls to a $2\\pi r \\times h$ rectangle, so $SA = 2\\pi r^2 + 2\\pi rh$.",
  },
  "rhombus-area": {
    explain:
      "When a quadrilateral's diagonals are perpendicular, as in a rhombus, kite, or square, its area is half the product of the diagonals. In a rhombus the diagonals also bisect each other, so half-diagonals form right triangles with the sides.",
    proof:
      "The perpendicular diagonals split the shape into triangles that fit inside a $d_1 \\times d_2$ rectangle, filling exactly half of it.",
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
