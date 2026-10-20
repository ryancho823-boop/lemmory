import type { Notes } from "./types";

export const COMBINATORICS_NOTES: Notes = {
  "lattice-paths": {
    explain:
      "A shortest path on a grid from $(0,0)$ to $(m,n)$ is a sequence of $m$ right steps and $n$ up steps. Counting paths means choosing which steps go right. For paths through a point, multiply the counts for each leg.",
    proof: "Every path is a string of $m + n$ steps with exactly $m$ of them right. Choosing the positions of the right steps gives $\\binom{m+n}{m}$ strings.",
  },
  "binomial-theorem": {
    explain:
      "Expanding $(x + y)^n$ gives terms $\\binom nk x^ky^{n-k}$. To find one coefficient, find the right $k$ and multiply $\\binom nk$ by any constants inside the parentheses raised to their powers, signs included.",
    proof:
      "$(x + y)^n$ is $n$ factors multiplied together. A term $x^ky^{n-k}$ comes from picking $x$ from $k$ of the factors and $y$ from the rest, which can happen in $\\binom nk$ ways.",
  },
  "stars-and-bars": {
    explain:
      "To split $n$ identical items among $k$ distinct groups, line up the items and drop in $k - 1$ dividers. If every group needs at least one item, give each one first and count the rest.",
    proof:
      "Arrange $n$ stars and $k - 1$ bars in a row; the bars cut the stars into $k$ groups (some possibly empty). There are $\\binom{n+k-1}{k-1}$ arrangements. For the at-least-one version, give one to each group first, leaving $n - k$ to distribute: $\\binom{n-1}{k-1}$.",
  },
  "hockey-stick": {
    explain:
      "Adding binomial coefficients down a diagonal of Pascal's triangle gives the entry just below the end of the diagonal, off to the side. Sums of triangular or tetrahedral numbers are hockey-stick sums.",
    proof:
      "Count $(r+1)$-element subsets of $\\{1, \\dots, n+1\\}$ by their largest element $m + 1$: the other $r$ elements come from $\\{1, \\dots, m\\}$, in $\\binom mr$ ways. Summing over $m = r, \\dots, n$ gives $\\binom{n+1}{r+1}$.",
  },
  pie: {
    explain:
      "To count things with at least one of several properties, add the sizes of the sets, subtract the pairwise overlaps, add back the triple overlap, and so on. It's the standard way to count numbers divisible by $2$, $3$, or $5$.",
    proof:
      "Something in exactly $j$ of the sets is counted $j - \\binom j2 + \\binom j3 - \\cdots = 1 - (1 - 1)^j = 1$ time for $j \\ge 1$, and $0$ times if it's in none.",
  },
  multinomial: {
    explain:
      "To arrange items when some are identical, count arrangements as if all were different, then divide by the orderings of each identical group. MISSISSIPPI has $\\frac{11!}{4!4!2!}$ arrangements.",
    proof: "Label the identical items to make them distinct: $n!$ arrangements. Each real arrangement appears $a!\\,b!\\,c!$ times, once for each way to permute the labels within each group.",
  },
  "circular-perms": {
    explain:
      "Around a circle, rotations of the same seating count as one arrangement. Fix one person's seat to remove the rotations, then arrange the rest in a line: $(n-1)!$. If reflections also count as the same, divide by $2$ again.",
    proof: "There are $n!$ line arrangements, and each circular arrangement corresponds to exactly $n$ of them (one for each rotation), giving $\\frac{n!}{n} = (n-1)!$.",
  },
  derangements: {
    explain:
      "A derangement is a shuffle where nothing ends up in its original place. The counts go $0, 1, 2, 9, 44, 265$, and $D_n$ is the nearest integer to $\\frac{n!}{e}$, so about $37\\%$ of shuffles are derangements.",
    proof:
      "Item $1$ goes to some position $k$, in $n - 1$ ways. If item $k$ goes back to position $1$, the other $n - 2$ items form a derangement: $D_{n-2}$ ways. If not, treat position $1$ as item $k$'s forbidden spot, giving a derangement of $n - 1$ items: $D_{n-1}$ ways.",
  },
  pigeonhole: {
    explain:
      "If you put more than $m(k-1)$ objects into $m$ boxes, some box gets at least $k$. \"How many must you pick to guarantee...\" problems are answered by imagining the worst case, then adding one.",
    proof: "If every box had at most $k - 1$ objects, there would be at most $m(k - 1)$ objects in total. One more forces some box to $k$.",
  },
  catalan: {
    explain:
      "Catalan numbers $1, 1, 2, 5, 14, 42, \\dots$ count many structures: balanced parentheses, grid paths that never cross the diagonal, triangulations of a polygon, binary trees. If a count starts $1, 2, 5, 14$, it's probably Catalan.",
    proof:
      "Count paths from $(0,0)$ to $(n,n)$ that touch the line $y = x + 1$. Reflecting the part after the first touch maps them one-to-one to all paths ending at $(n-1, n+1)$, so there are $\\binom{2n}{n-1}$ bad paths. Good paths: $\\binom{2n}{n} - \\binom{2n}{n-1} = \\frac{1}{n+1}\\binom{2n}{n}$.",
  },
  "distinct-distribution": {
    explain:
      "When distinct objects each choose one of $k$ boxes with no restrictions, there are $k^n$ ways. If the objects are identical instead, use stars and bars. Which one applies is the first thing to decide.",
    proof: "Each of the $n$ objects independently picks one of $k$ boxes: $k \\times k \\times \\cdots \\times k = k^n$.",
  },
  "non-adjacent": {
    explain:
      "To pick $k$ items from a row of $n$ with no two next to each other, squeeze out the forced gaps: it's the same as picking $k$ from $n - k + 1$ with no restriction.",
    proof:
      "If the chosen positions are $a_1 < a_2 < \\cdots < a_k$ with gaps of at least $2$, then $a_1 < a_2 - 1 < a_3 - 2 < \\cdots < a_k - (k-1)$ are any $k$ distinct numbers from $1$ to $n - k + 1$, and this matching works both ways.",
  },
  "grid-rectangles": {
    explain:
      "Every rectangle in a grid is determined by choosing two of the vertical grid lines and two of the horizontal ones. An $m \\times n$ grid has $m + 1$ and $n + 1$ lines.",
    proof:
      "Two vertical lines give the left and right sides and two horizontal lines give the top and bottom, and every rectangle arises from exactly one such choice: $\\binom{m+1}{2}\\binom{n+1}{2}$.",
  },
  "pascal-rule": {
    explain:
      "Each entry of Pascal's triangle is the sum of the two entries above it. It lets you add neighboring binomial coefficients in one step and is the basis for many recursions.",
    proof:
      "Count $k$-element subsets of $\\{1, \\dots, n\\}$ by whether they contain $n$. With $n$: choose $k - 1$ more from the rest, $\\binom{n-1}{k-1}$. Without: choose all $k$ from the rest, $\\binom{n-1}{k}$.",
  },
  vandermonde: {
    explain:
      "Choosing $r$ people from a group of $m$ and a group of $n$ can be split by how many come from the first group. A sum of products of binomial coefficients with bottoms adding to $r$ collapses to one binomial coefficient. The sum of squares of a row of Pascal's triangle is a special case.",
    proof:
      "Count $r$-element subsets of the combined $m + n$ people two ways: directly $\\binom{m+n}{r}$, or by taking $k$ from the first group and $r - k$ from the second, summed over $k$.",
  },
  "fibonacci-recursion": {
    explain:
      "Many counting problems satisfy $T_n = T_{n-1} + T_{n-2}$ because the last move is either a size-$1$ or a size-$2$ piece. Find the first two values and build up the table by hand.",
    proof:
      "Climbing $n$ stairs, the final step is either $1$ stair (after reaching stair $n - 1$ in $T_{n-1}$ ways) or $2$ stairs (after reaching stair $n - 2$ in $T_{n-2}$ ways). The two cases don't overlap.",
  },
};
