import { defineTopic, pos } from "../types";

export const GEOMETRY_2 = defineTopic("Geometry", [
  {
    id: "point-line-distance",
    name: "Point-to-Line Distance",
    level: "AMC 12",
    statement: "d = \\frac{|Ax_0 + By_0 + C|}{\\sqrt{A^2 + B^2}}",
    setup: "Distance from $(x_0, y_0)$ to the line $Ax + By + C = 0$.",
    whenToUse: "The shortest distance from a point to a line, or between two parallel lines.",
    recall: [
      { lhs: "d =", answer: "\\frac{|Ax_0+By_0+C|}{\\sqrt{A^2+B^2}}", vars: { A: pos, B: pos, C: pos, x_0: pos, y_0: pos } },
    ],
    related: [],
    problems: [
      { id: "pld1", text: "Find the distance from $(1, 2)$ to the line $3x + 4y - 1 = 0$.", answer: "2", solution: "$\\frac{|3 + 8 - 1|}{5} = 2$." },
      { id: "pld2", text: "Find the distance between the parallel lines $3x + 4y = 5$ and $3x + 4y = 20$.", answer: "3", solution: "$\\frac{|20 - 5|}{5} = 3$." },
    ],
  },
  {
    id: "median-length",
    name: "Median Length Formula",
    level: "AMC 12",
    statement: "m_a = \\tfrac12\\sqrt{2b^2 + 2c^2 - a^2}",
    setup: "The median to side $a$ in a triangle with sides $a, b, c$. (Stewart's theorem with $m = n$.)",
    whenToUse: "You need the length of a median and know all three sides.",
    recall: [{ lhs: "m_a =", answer: "\\frac12\\sqrt{2b^2+2c^2-a^2}", vars: { a: [1, 2], b: [2, 3], c: [2, 3] } }],
    related: ["stewart", "centroid"],
    problems: [
      { id: "ml1", text: "A triangle has sides $13$, $14$, $15$. Find the length of the median to the side of length $14$.", answer: "2\\sqrt{37}", solution: "$\\frac12\\sqrt{338 + 450 - 196} = \\frac12\\sqrt{592} = 2\\sqrt{37}$." },
      { id: "ml2", text: "A triangle has sides $5$, $5$, $6$. Find the length of the median to the side of length $6$.", answer: "4", solution: "$\\frac12\\sqrt{50 + 50 - 36} = 4$." },
    ],
  },
  {
    id: "tangent-length",
    name: "Tangent Lengths",
    level: "AMC 10",
    statement: "\\text{tangent length} = \\sqrt{d^2 - r^2}",
    setup: "From a point at distance $d$ from the center of a circle of radius $r$. Two tangents from the same point are equal.",
    whenToUse: "Tangent segments, or a circle inscribed in a polygon (each vertex's two tangents are equal).",
    recall: [{ lhs: "\\text{Tangent length} =", answer: "\\sqrt{d^2-r^2}", vars: { d: [3, 5], r: [1, 2] } }],
    related: ["power-of-a-point", "inradius-circumradius"],
    problems: [
      { id: "tl1", text: "A point is $13$ from the center of a circle of radius $5$. How long is a tangent from the point to the circle?", answer: "12", solution: "$\\sqrt{169 - 25} = 12$." },
      { id: "tl2", text: "A circle is inscribed in triangle $ABC$ with $AB = 7$, $BC = 8$, $CA = 9$. How long is the tangent segment from $A$ to the circle?", answer: "4", solution: "Equal tangents give $s - BC = 12 - 8 = 4$." },
    ],
  },
  {
    id: "euler-polyhedron",
    name: "Euler's Polyhedron Formula",
    level: "AMC 10",
    statement: "V - E + F = 2",
    setup: "Vertices, edges, and faces of a convex polyhedron.",
    whenToUse: "A 3D solid where you know two of the counts and need the third.",
    recall: [{ lhs: "V - E + F =", answer: "2", vars: {} }],
    related: [],
    problems: [
      { id: "eu1", text: "A convex polyhedron has $12$ vertices and $30$ edges. How many faces does it have?", answer: "20", solution: "$12 - 30 + F = 2$." },
      { id: "eu2", text: "A soccer ball has $32$ faces and $60$ vertices. How many edges?", answer: "90", solution: "$60 - E + 32 = 2$." },
    ],
  },
  {
    id: "centroid",
    name: "Centroid",
    level: "AMC 10",
    statement: "G = \\left(\\frac{x_1+x_2+x_3}{3},\\ \\frac{y_1+y_2+y_3}{3}\\right)",
    setup: "Where the three medians meet. It splits each median $2 : 1$ from the vertex.",
    whenToUse: "Medians of a triangle, or the average of three vertices.",
    recall: [{ lhs: "G_x =", answer: "\\frac{x_1+x_2+x_3}{3}", vars: { x_1: pos, x_2: pos, x_3: pos } }],
    related: ["median-length"],
    problems: [
      { id: "cn1", text: "Find the sum of the coordinates of the centroid of the triangle $(0,0)$, $(6,0)$, $(3,9)$.", answer: "6", solution: "The centroid is $(3, 3)$." },
      { id: "cn2", text: "A median of a triangle has length $12$. How far is the centroid from the vertex on that median?", answer: "8", solution: "$\\frac23 \\cdot 12 = 8$." },
    ],
  },
  {
    id: "ceva",
    name: "Ceva's Theorem",
    level: "AMC 12",
    statement: "\\frac{BD}{DC}\\cdot\\frac{CE}{EA}\\cdot\\frac{AF}{FB} = 1",
    setup: "Cevians $AD$, $BE$, $CF$ of triangle $ABC$ meet at one point exactly when this holds.",
    whenToUse: "Three cevians are concurrent and you need one of the ratios they create.",
    recall: [{ lhs: "\\frac{BD}{DC}\\cdot\\frac{CE}{EA}\\cdot\\frac{AF}{FB} =", answer: "1", vars: {} }],
    related: ["angle-bisector", "centroid"],
    problems: [
      { id: "cv1", text: "Concurrent cevians in triangle $ABC$ have $\\frac{BD}{DC} = 2$ and $\\frac{CE}{EA} = 3$. Find $\\frac{AF}{FB}$.", answer: "\\frac{1}{6}", solution: "$2\\cdot3\\cdot x = 1$." },
      { id: "cv2", text: "In triangle $ABC$, $AD$ is a median and concurrent cevians have $\\frac{CE}{EA} = \\frac12$. Find $\\frac{AF}{FB}$.", answer: "2", solution: "$1 \\cdot \\frac12 \\cdot x = 1$." },
    ],
  },
]);

