import type { Notes } from "./types";

export const GEOMETRY_V2_NOTES: Notes = {
  bretschneider: {
    explain: "Heron's formula for any quadrilateral, with a correction term for how far it is from cyclic. The correction is never negative, so with fixed sides the area is largest when the quadrilateral is cyclic.",
    proof: "Split along diagonal $BD$: $2K = ad\\sin A + bc\\sin C$. The law of cosines on both triangles gives $a^2 + d^2 - 2ad\\cos A = b^2 + c^2 - 2bc\\cos C$. Square both, add, and use $\\cos(A + C) = 2\\cos^2\\frac{A+C}{2} - 1$; the algebra factors into the formula.",
  },
  butterfly: {
    explain: "Through the midpoint $M$ of a chord, draw any two chords and join their ends crosswise. The two crossing lines cut the original chord at points equally far from $M$, like the wings of a butterfly.",
    proof: "One proof uses coordinates: put $M$ at the origin and $PQ$ on the $x$-axis, so the circle is $x^2 + y^2 + Dy + F = 0$ (no $x$ term, by symmetry). Write the two chords as $y = m_1x$ and $y = m_2x$; the $x$-intercepts of $AD$ and $BC$ come out as negatives of each other.",
  },
  carnot: {
    explain: "Drop perpendiculars from the circumcenter to the three sides. In an acute triangle their lengths add up to $R + r$. Each of these distances is $R\\cos$ of the opposite angle.",
    proof: "The distance from $O$ to side $a$ is $R\\cos A$, since $O$ sees $BC$ at angle $2A$. So the sum is $R(\\cos A + \\cos B + \\cos C) = R\\left(1 + \\frac rR\\right) = R + r$, using the identity $\\cos A + \\cos B + \\cos C = 1 + \\frac rR$.",
  },
  "descartes-circle": {
    explain: "Work with curvatures, $k = \\frac1r$. For four mutually tangent circles, the square of their sum is twice the sum of their squares. Given three, the fourth has two answers: a small circle in the gap, or a big circle around all three (negative curvature).",
    proof: "Solving the quadratic in $k_4$: $k_4 = k_1 + k_2 + k_3 \\pm 2\\sqrt{k_1k_2 + k_2k_3 + k_3k_1}$. The theorem itself is usually proved by inversion at a tangency point, which turns two of the circles into parallel lines.",
  },
  "incenter-excenter": {
    explain: "The bisector of angle $A$ hits the circumcircle at the midpoint $M$ of arc $BC$. That point is equally far from $B$, $C$, the incenter $I$ and the excenter $J$, so $I$ and $J$ are opposite ends of a diameter of a circle centered at $M$.",
    proof: "$\\angle MBI = \\angle MBC + \\angle CBI = \\frac A2 + \\frac B2$, and $\\angle MIB$ is an exterior angle of triangle $ABI$, also $\\frac A2 + \\frac B2$. So $MB = MI$. Since $BI \\perp BJ$ (inner and outer bisectors), $M$ is the midpoint of the hypotenuse $IJ$ of right triangle $IBJ$.",
  },
  monge: {
    explain: "Take three circles. For each pair, extend the two outer tangent lines until they meet. The three meeting points always lie on a line. Each meeting point divides the line through the two centers in the ratio of the radii.",
    proof: "Each meeting point is the center of a homothety taking one circle to the other, so it splits the centers' line externally in ratio $r_i : r_j$. Then Menelaus's theorem on the triangle of centers: $\\frac{r_1}{r_2} \\cdot \\frac{r_2}{r_3} \\cdot \\frac{r_3}{r_1} = 1$, so the three points are collinear.",
  },
  routh: {
    explain: "Three cevians cut each side in a given ratio; Routh's formula gives the area of the small triangle in the middle as a fraction of the whole. The famous case: ratios $2 : 1$ give exactly $\\frac17$.",
    proof: "Use mass points or coordinates to find where each pair of cevians cross, as fractions along each cevian. The three crossing points' areas then follow from the shoelace formula or by subtracting the three outer triangles and quadrilaterals. When $xyz = 1$, Ceva says they meet at one point, and the area is $0$.",
  },
  "van-aubel": {
    explain: "Where three cevians meet at $O$, the ratio $AO : OD$ along the cevian from $A$ is the sum of the ratios on the two sides at $A$. For the centroid, $1 + 1 = 2$.",
    proof: "Mass points: put masses $a, b, c$ at $A, B, C$ that balance at $D$, $E$, $F$. Then $\\frac{AE}{EC} = \\frac ca$ and $\\frac{AF}{FB} = \\frac ba$, while $\\frac{AO}{OD} = \\frac{b + c}{a}$, the mass at $D$ over the mass at $A$.",
  },
  viviani: {
    explain: "In an equilateral triangle, the distances from any inside point to the three sides always add up to the height. Move the point around and the sum doesn't change.",
    proof: "Join the point to the three corners, splitting the triangle into three triangles with base $s$ and heights $d_1, d_2, d_3$. Their areas add up: $\\frac12s(d_1 + d_2 + d_3) = \\frac12sh$, so $d_1 + d_2 + d_3 = h$.",
  },
  "mass-points": {
    explain: "Put weights on the vertices so each cevian's foot is the balance point of its side: heavier weight means closer. Then every point on the figure balances too, and each segment is split in the inverse ratio of the weights at its ends.",
    proof: "It's the lever law, or equivalently weighted averages: if $D = \\frac{bB + cC}{b + c}$, then $\\frac{BD}{DC} = \\frac cb$. The point where cevians cross is the weighted average of all three vertices, $\\frac{aA + bB + cC}{a + b + c}$, which sits on each cevian with ratio $\\frac{\\text{mass at foot}}{\\text{mass at vertex}}$.",
  },
  "radical-axis": {
    explain: "The power of a point to a circle is $d^2 - r^2$, the square of the tangent length. Points with equal power to two circles lie on a line. Write each circle as $x^2 + y^2 + \\cdots = 0$ and subtract: the squares cancel and a line is left.",
    proof: "Power to circle $i$ is $x^2 + y^2 + D_ix + E_iy + F_i$. Setting two of these equal cancels $x^2 + y^2$, leaving a linear equation. If the circles cross, both crossing points have power $0$ to each, so the line goes through them. Three axes meet where all three powers are equal.",
  },
  homothety: {
    explain: "A homothety scales everything from a center point by a factor $k$: lengths by $|k|$, areas by $k^2$. Two circles are always homothetic; their outer tangents meet at the external center and their inner tangents at the internal center.",
    proof: "The homothety centered at $X$ with ratio $k$ sends $P$ to $X + k(P - X)$, which scales all distances by $|k|$. It maps a circle to a circle and tangent lines through $X$ to themselves, so the common tangents of two circles pass through the centers of the homotheties between them.",
  },
  "ptolemy-inequality": {
    explain: "For any four points, the product of the diagonals is at most the sum of the products of opposite sides, with equality only for a cyclic quadrilateral. So Ptolemy's theorem gives the maximum.",
    proof: "Invert about $A$ with radius $1$: a point at distance $x$ goes to distance $\\frac1x$, and $B'C' = \\frac{BC}{AB \\cdot AC}$. The triangle inequality $B'D' \\le B'C' + C'D'$ becomes $\\frac{BD}{AB \\cdot AD} \\le \\frac{BC}{AB \\cdot AC} + \\frac{CD}{AC \\cdot AD}$. Multiply by $AB \\cdot AC \\cdot AD$. Equality means $B', C', D'$ are collinear, i.e. $A, B, C, D$ are concyclic.",
  },
  isoperimetric: {
    explain: "Of all shapes with a given perimeter, the circle has the most area: $A \\le \\frac{L^2}{4\\pi}$. For a fence along a straight wall, reflect over the wall: the best shape is a semicircle.",
    proof: "A full proof is hard. For polygons, a shape with the most area must be convex and symmetric about every line that splits its perimeter in half (otherwise reflecting the bigger half does better). The only such curve is a circle.",
  },
  "acute-obtuse-test": {
    explain: "Compare the square of the longest side with the sum of the squares of the other two. Smaller means acute, equal means right, bigger means obtuse. Point $C$ is inside the circle with diameter $AB$ exactly when angle $C$ is obtuse.",
    proof: "By the law of cosines, $c^2 = a^2 + b^2 - 2ab\\cos C$. So $c^2 > a^2 + b^2$ exactly when $\\cos C < 0$, i.e. when $C > 90^\\circ$.",
  },
  exradius: {
    explain: "The excircle opposite $A$ sits outside the triangle, touching side $a$ and the extensions of $b$ and $c$. Its radius is the area divided by $s - a$, just as the inradius is the area divided by $s$.",
    proof: "Join the excenter $J$ to $A$, $B$, $C$. Then $K = [JAB] + [JAC] - [JBC] = \\frac12r_a(c + b - a) = r_a(s - a)$. Multiplying the four radii gives $\\frac{K^4}{s(s-a)(s-b)(s-c)} = K^2$ by Heron's formula.",
  },
  "tangential-area": {
    explain: "If a polygon has an inscribed circle, its area is the inradius times the semiperimeter. It's the same as $K = rs$ for a triangle.",
    proof: "Join the center to every vertex. Each piece is a triangle with a side of the polygon as base and height $r$ (the radius to the touch point is perpendicular to the side). The areas add up to $\\frac12 r \\cdot \\text{perimeter} = rs$.",
  },
  "euler-line": {
    explain: "In any triangle, the circumcenter $O$, centroid $G$ and orthocenter $H$ lie on one line, with $G$ a third of the way from $O$ to $H$. Put $O$ at the origin and the orthocenter is just $A + B + C$.",
    proof: "With $O$ at the origin, let $H = A + B + C$. Then $H - A = B + C$, and $(B + C) \\cdot (B - C) = |B|^2 - |C|^2 = 0$, so $AH \\perp BC$. The same holds for the other altitudes, so $H$ is the orthocenter. And $G = \\frac{A + B + C}{3} = \\frac H3$.",
  },
  "nine-point-circle": {
    explain: "One circle passes through nine special points: the three side midpoints, the three feet of the altitudes, and the midpoints from each vertex to the orthocenter. Its radius is half the circumradius, and its center is halfway between $O$ and $H$.",
    proof: "The homothety centered at $G$ with ratio $-\\frac12$ sends $A, B, C$ to the midpoints of the opposite sides, so it sends the circumcircle to the circle through the three midpoints, with radius $\\frac R2$. With $O$ at the origin, its center is $\\frac32G = \\frac H2$, the midpoint of $OH$. The midpoints of $BC$ and $AH$ are ends of a diameter of this circle, and the foot of the altitude from $A$ sees them at a right angle, so it's on the circle too.",
  },
  "oh-formula": {
    explain: "The distance between circumcenter and orthocenter depends only on $R$ and the sum of the squared sides. It's $0$ exactly for an equilateral triangle.",
    proof: "With $O$ at the origin, $H = A + B + C$, so $OH^2 = |A + B + C|^2 = 3R^2 + 2(A\\cdot B + B\\cdot C + C\\cdot A)$. Since $c^2 = |A - B|^2 = 2R^2 - 2A\\cdot B$, the dot products add to $3R^2 - \\frac{a^2 + b^2 + c^2}{2}$. Substitute.",
  },
  "fermat-point": {
    explain: "The point that makes $PA + PB + PC$ smallest sees each side at $120^\\circ$. You can find it by building equilateral triangles outward on the sides: the lines from each new corner to the opposite vertex meet there, and each has length equal to the minimum sum.",
    proof: "Rotate triangle $APB$ by $60^\\circ$ about $B$ to $A'P'B$. Then $PB = PP'$ (equilateral) and $PA = P'A'$, so $PA + PB + PC = A'P' + P'P + PC \\ge A'C$, a fixed length. Equality needs $A', P', P, C$ in a line, which forces the $120^\\circ$ angles. $A'C$ can then be found with the law of cosines.",
  },
  "simson-line": {
    explain: "Drop perpendiculars from a point $P$ to the three sides (extended as needed). The three feet are collinear exactly when $P$ is on the circumcircle; that line is the Simson line.",
    proof: "$P$, $E$, $F$ and $A$ lie on the circle with diameter $PA$ (right angles at $E$ and $F$), and similarly for the other vertices. Angle chasing in these circles shows $\\angle PDF$ and $\\angle PDE$ are equal or supplementary exactly when $ABPC$ is cyclic. In the circle with diameter $PA$, the chord $EF$ is $PA\\sin A$ by the extended law of sines.",
  },
  "orthocenter-reflection": {
    explain: "Reflect the orthocenter $H$ over a side and you land on the circumcircle. So along an altitude, $H$ and the circle are equally far from the foot. Also, the distance from a vertex to $H$ is $2R\\cos A$.",
    proof: "$\\angle HBC = 90^\\circ - C$ (from the altitude from $B$), and $\\angle EBC = \\angle EAC = 90^\\circ - C$ (same arc $EC$). So $BD$ bisects angle $HBE$ and is perpendicular to $HE$, making $HD = DE$. For $AH$: with $O$ at the origin, $AH = |B + C|$, which is $2R\\cos A$.",
  },
  "trig-ceva": {
    explain: "The angle version of Ceva's theorem: three lines from the vertices meet at a point exactly when the product of the sine ratios of the angles they make is $1$. It's the tool for angle-chasing problems where a clever construction seems needed.",
    proof: "By the law of sines in triangles $ABD$ and $ADC$, $\\frac{BD}{DC} = \\frac{AB\\sin\\angle BAD}{AC\\sin\\angle DAC}$. Do the same for the other two cevians and multiply: the side lengths cancel, and Ceva's theorem says the product of the length ratios is $1$.",
  },
  "ptolemy-second": {
    explain: "Ptolemy gives the product of the diagonals; this gives their ratio. Together they give each diagonal. Each diagonal is paired with the sum of products of the two sides meeting at each of its ends.",
    proof: "Diagonal $BD$ splits the area into $\\frac12ad\\sin A + \\frac12bc\\sin C = \\frac{(ad + bc)\\sin A}{2}$, since $\\sin C = \\sin A$. With $BD = 2R\\sin A$, the area is $\\frac{(ad + bc)BD}{4R}$. Likewise via $AC$ it's $\\frac{(ab + cd)AC}{4R}$. Set them equal.",
  },
  pitot: {
    explain: "If a circle fits inside a quadrilateral touching all four sides, then the two pairs of opposite sides have the same sum. The converse also holds for convex quadrilaterals.",
    proof: "The two tangents from each corner to the circle are equal; call them $w, x, y, z$ going around. Then $a + c = (w + x) + (y + z)$ and $b + d = (x + y) + (z + w)$, which are equal.",
  },
  "quad-area-diagonals": {
    explain: "Any convex quadrilateral's area is half the product of its diagonals times the sine of the angle between them. Perpendicular diagonals (rhombus, kite, square) give just $\\frac12pq$.",
    proof: "The diagonals cut the quadrilateral into four triangles around their crossing point. If the diagonals are split into $p_1 + p_2$ and $q_1 + q_2$, the four areas are $\\frac12p_iq_j\\sin\\theta$ (the sine of $\\theta$ and $180^\\circ - \\theta$ are equal). They add up to $\\frac12(p_1 + p_2)(q_1 + q_2)\\sin\\theta$.",
  },
  "same-height-areas": {
    explain: "Two triangles with the same height have areas in the same ratio as their bases. A cevian splits a triangle's area in the ratio it splits the opposite side.",
    proof: "$[ABD] = \\frac12 \\cdot BD \\cdot h$ and $[ADC] = \\frac12 \\cdot DC \\cdot h$, where $h$ is the distance from $A$ to line $BC$. Divide.",
  },
  "regular-ngon-area": {
    explain: "Split the regular polygon into $n$ identical triangles from its center. Each has two sides $R$ with angle $\\frac{360^\\circ}{n}$ between them.",
    proof: "Each triangle has area $\\frac12R^2\\sin\\frac{2\\pi}{n}$, so the total is $n$ times that. Alternatively, each triangle has base equal to a side and height equal to the apothem, giving $\\frac12 \\cdot \\text{perimeter} \\cdot \\text{apothem}$.",
  },
  "common-tangents": {
    explain: "Slide the tangent segment over to pass through one center: you get a right triangle with hypotenuse $d$ (the centers' distance), one leg the tangent length, and the other leg the difference of radii (external) or their sum (internal).",
    proof: "Both radii to the touch points are perpendicular to the tangent, so they're parallel. For an external tangent, the segment from one center parallel to the tangent leaves a leg of $|r_1 - r_2|$; for an internal one the radii point opposite ways, giving $r_1 + r_2$. Then use the Pythagorean theorem.",
  },
  "chord-length": {
    explain: "The perpendicular from the center to a chord cuts it in half. Half the chord, the distance $d$ and the radius make a right triangle.",
    proof: "$O$ is equidistant from both ends of the chord, so the foot of the perpendicular is its midpoint. Then $\\left(\\frac{\\text{chord}}{2}\\right)^2 + d^2 = r^2$.",
  },
  "segment-area": {
    explain: "A segment is a sector with its triangle cut out. With the angle $\\theta$ in radians, the sector is $\\frac12r^2\\theta$ and the triangle $\\frac12r^2\\sin\\theta$.",
    proof: "The sector is $\\frac{\\theta}{2\\pi}$ of the circle: $\\frac{\\theta}{2\\pi} \\cdot \\pi r^2 = \\frac12r^2\\theta$. The triangle has two sides $r$ with angle $\\theta$, so area $\\frac12r^2\\sin\\theta$. Subtract.",
  },
  "circle-tangent-line": {
    explain: "To get the tangent at a point of $x^2 + y^2 = r^2$, replace one $x$ with $x_0$ and one $y$ with $y_0$: $x_0x + y_0y = r^2$. The tangent is perpendicular to the radius, so its slope is $-\\frac{x_0}{y_0}$.",
    proof: "The line through $(x_0, y_0)$ perpendicular to the radius direction $(x_0, y_0)$ is $x_0(x - x_0) + y_0(y - y_0) = 0$, which is $x_0x + y_0y = x_0^2 + y_0^2 = r^2$. Shifting the center to $(a, b)$ gives the general form.",
  },
  "coordinate-power": {
    explain: "Write the circle as $x^2 + y^2 + Dx + Ey + F = 0$ and plug in a point. The value is the point's power: the tangent length squared if it's outside, and $PA \\cdot PB$ along any line through it.",
    proof: "Completing the square, the left side is $(x - a)^2 + (y - b)^2 - r^2$ with center $(a, b)$, which at the point is $d^2 - r^2$. That equals the tangent length squared (Pythagoras), and by power of a point equals $PA \\cdot PB$ for any secant.",
  },
  "reflection-over-line": {
    explain: "To reflect a point over a line, move it twice its signed distance along the line's normal direction $(A, B)$. Reflections also solve bounce problems: the shortest path that touches a line is a straight line to the mirror image.",
    proof: "The foot of the perpendicular from $(x_0, y_0)$ is $(x_0, y_0) - t(A, B)$ with $t = \\frac{Ax_0 + By_0 + C}{A^2 + B^2}$, chosen so it lands on the line. The reflection goes twice as far: subtract $2t(A, B)$.",
  },
  "parallel-line-distance": {
    explain: "Write both lines with the same $A$ and $B$. Then the distance between them is the difference of the constants divided by $\\sqrt{A^2 + B^2}$.",
    proof: "Take any point $(x_0, y_0)$ on the first line, so $Ax_0 + By_0 = -C_1$. Its distance to the second line is $\\frac{|Ax_0 + By_0 + C_2|}{\\sqrt{A^2 + B^2}} = \\frac{|C_2 - C_1|}{\\sqrt{A^2 + B^2}}$.",
  },
  "point-plane-distance": {
    explain: "This is the point-to-line formula with one more coordinate. Plug the point into the plane's equation, take the absolute value, and divide by the length of the normal vector $(a, b, c)$.",
    proof: "$(a, b, c)$ is perpendicular to the plane. The distance is the length of the projection of the vector from any point $Q$ on the plane to $P$ onto the unit normal: $\\frac{|(P - Q) \\cdot (a, b, c)|}{\\sqrt{a^2 + b^2 + c^2}}$, and $(P - Q)\\cdot(a, b, c) = ax_0 + by_0 + cz_0 + d_0$.",
  },
  "dot-product": {
    explain: "Multiply matching coordinates and add. The result is $|\\mathbf u||\\mathbf v|\\cos\\theta$, so dividing by the lengths gives the cosine of the angle. In 3D this is usually the fastest way to an angle.",
    proof: "Apply the law of cosines to the triangle with sides $\\mathbf u$, $\\mathbf v$, $\\mathbf u - \\mathbf v$: $|\\mathbf u - \\mathbf v|^2 = |\\mathbf u|^2 + |\\mathbf v|^2 - 2|\\mathbf u||\\mathbf v|\\cos\\theta$. Expanding the left side in coordinates gives $|\\mathbf u|^2 + |\\mathbf v|^2 - 2(u_1v_1 + u_2v_2 + u_3v_3)$.",
  },
  "vector-area": {
    explain: "Put one corner at the origin and the other two at $(x_1, y_1)$ and $(x_2, y_2)$. The triangle's area is half of $|x_1y_2 - x_2y_1|$, the area of the parallelogram the two vectors span. In 3D use the length of the cross product.",
    proof: "The parallelogram's area is $|\\mathbf u||\\mathbf v|\\sin\\theta$. Squaring and using the dot product, $|\\mathbf u|^2|\\mathbf v|^2 - (\\mathbf u \\cdot \\mathbf v)^2 = (x_1y_2 - x_2y_1)^2$ (Lagrange's identity). The triangle is half the parallelogram.",
  },
  "tetra-volume-det": {
    explain: "Take the three edge vectors from one vertex as the rows of a $3 \\times 3$ determinant. Its absolute value is the volume of the slanted box they span, and the tetrahedron is one sixth of that.",
    proof: "The determinant equals $\\mathbf u \\cdot (\\mathbf v \\times \\mathbf w)$: the base parallelogram's area $|\\mathbf v \\times \\mathbf w|$ times the height. A pyramid is $\\frac13$ base times height, and a triangle is half the parallelogram, so $\\frac13 \\cdot \\frac12 = \\frac16$.",
  },
  "spherical-cap": {
    explain: "A cap is the piece of a ball cut off by a plane. Its volume depends only on the sphere's radius and the cap's height. Its curved surface area is $2\\pi rh$, exactly like a strip of the same height on the surrounding cylinder.",
    proof: "Stack disks: at height $y$ above the center the radius squared is $r^2 - y^2$, so $V = \\int_{r-h}^{r}\\pi(r^2 - y^2)\\,dy = \\pi\\left(r^2h - \\frac{r^3 - (r-h)^3}{3}\\right)$, which simplifies to $\\frac{\\pi h^2(3r - h)}{3}$.",
  },
  "platonic-solids": {
    explain: "There are exactly five convex solids with identical regular faces meeting the same way at every corner. Their counts are worth knowing, and they all satisfy $V - E + F = 2$.",
    proof: "If $q$ faces with $p$ sides meet at each vertex, the angles at a vertex add to less than $360^\\circ$, which forces $(p - 2)(q - 2) < 4$: only $(3,3), (4,3), (3,4), (5,3), (3,5)$. Counting edges: $pF = 2E = qV$, and Euler's formula then gives each count.",
  },
  "conic-eccentricity": {
    explain: "Every conic is the set of points whose distance to a focus is a fixed multiple $\\varepsilon$ of the distance to a line (the directrix). Below $1$ it's an ellipse, exactly $1$ a parabola, above $1$ a hyperbola. For ellipses and hyperbolas, $\\varepsilon = \\frac ca$.",
    proof: "For the ellipse $\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1$ with focus $(c, 0)$, substitute $y^2 = b^2\\left(1 - \\frac{x^2}{a^2}\\right)$: $(x - c)^2 + y^2 = \\left(a - \\frac cax\\right)^2$. So the distance to the focus is $a - \\frac cax = \\frac ca\\left(\\frac{a^2}{c} - x\\right)$, which is $\\frac ca$ times the distance to the line $x = \\frac{a^2}{c}$.",
  },
  "euler-inequality": {
    explain: "In any triangle, the circumradius is at least twice the inradius. They're exactly in ratio $2 : 1$ only for an equilateral triangle.",
    proof: "Euler's distance formula gives $OI^2 = R^2 - 2Rr = R(R - 2r)$. A squared distance can't be negative, so $R \\ge 2r$, with equality when $O = I$, which happens only for an equilateral triangle.",
  },
  "apollonius-circle": {
    explain: "The points twice as far from $A$ as from $B$ (or any fixed ratio other than $1$) form a circle. Its diameter runs between the two points on line $AB$ that divide $AB$ in that ratio, one inside and one outside.",
    proof: "With $A = (0, 0)$ and $B = (d, 0)$, $x^2 + y^2 = k^2((x - d)^2 + y^2)$. Since $k \\ne 1$, divide by $k^2 - 1$ and complete the square: a circle centered at $\\left(\\frac{k^2d}{k^2 - 1}, 0\\right)$ with radius $\\frac{kd}{|k^2 - 1|}$.",
  },
  "angle-between-lines": {
    explain: "Each slope is the tangent of the line's angle with the $x$-axis. The angle between two lines is the difference of those angles, and the tangent subtraction formula gives its tangent.",
    proof: "If $m_1 = \\tan\\alpha$ and $m_2 = \\tan\\beta$, then $\\tan(\\beta - \\alpha) = \\frac{\\tan\\beta - \\tan\\alpha}{1 + \\tan\\alpha\\tan\\beta}$. Take the absolute value for the acute angle. If $1 + m_1m_2 = 0$, the angle is $90^\\circ$.",
  },
  "line-circle-discriminant": {
    explain: "Plug the line into the circle's equation to get a quadratic in $x$. Two real roots mean two crossing points, a double root means the line is tangent, and no real roots mean it misses.",
    proof: "Each real root of the quadratic is the $x$-coordinate of a common point, and the line gives the $y$. For $y = mx + c$ and $x^2 + y^2 = r^2$: $(1 + m^2)x^2 + 2mcx + c^2 - r^2 = 0$, with discriminant $4(r^2(1 + m^2) - c^2)$. Equivalently, the distance $\\frac{|c|}{\\sqrt{1 + m^2}}$ from the center to the line is compared with $r$.",
  },
  "spiral-similarity": {
    explain: "A spiral similarity turns and scales the plane around a fixed center. In complex numbers it's $z \\mapsto az + b$, with center where $z = az + b$. Geometrically, the center for $AB \\to CD$ is where circles $(ABX)$ and $(CDX)$ meet again, with $X = AC \\cap BD$.",
    proof: "The fixed point solves $z = az + b$, so $z = \\frac{b}{1 - a}$, and then $f(z) - z_0 = a(z - z_0)$: multiplication by $a$ (scale $|a|$, turn by $\\arg a$) around $z_0$. For the circle fact: the center $S$ makes triangles $SAB$ and $SCD$ similar, so $\\angle SAX = \\angle SBX$, which puts $S$ on circle $(ABX)$; likewise on $(CDX)$.",
  },
  miquel: {
    explain: "Pick a point on each side of a triangle. The three circles through a vertex and the two chosen points beside it always pass through one common point, the Miquel point.",
    proof: "Let circles $(AEF)$ and $(BFD)$ meet again at $M$. Cyclic quadrilaterals give $\\angle FME = 180^\\circ - A$ and $\\angle FMD = 180^\\circ - B$. So $\\angle DME = 360^\\circ - (180^\\circ - A) - (180^\\circ - B) = A + B = 180^\\circ - C$, which makes $CDME$ cyclic.",
  },
  feuerbach: {
    explain: "The nine-point circle touches the incircle and all three excircles. So the distance between their centers is the difference of the radii for the incircle and the sum for each excircle.",
    proof: "With $O$ at the origin, $N = \\frac{A + B + C}{2}$. A computation with $OI^2 = R^2 - 2Rr$ and the vector formula for $I$ gives $NI^2 = \\left(\\frac R2 - r\\right)^2$. The excircle case is the same with $r$ replaced by $-r_a$.",
  },
  barycentric: {
    explain: "Describe a point by three weights on the vertices: it's their weighted average. The weights are proportional to the areas of the triangles opposite each vertex, so area ratios and barycentric coordinates are the same thing.",
    proof: "If $P = \\frac{xA + yB + zC}{x + y + z}$, then the height from $P$ to $BC$ is $\\frac{x}{x + y + z}$ of the height from $A$ (only the $A$ term moves it off line $BC$). So $[PBC] = \\frac{x}{x + y + z}[ABC]$, and likewise for the others.",
  },
};
