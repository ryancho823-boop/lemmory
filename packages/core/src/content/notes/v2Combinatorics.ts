import type { Notes } from "./types";

export const COMBINATORICS_V2_NOTES: Notes = {
  "multinomial-theorem": {
    explain: "Expanding $(x + y + z)^n$ means picking one term from each of the $n$ factors. The coefficient of $x^ay^bz^c$ is the number of ways to say which factors gave $x$, which gave $y$ and which gave $z$.",
    proof: "Choosing which $a$ factors give $x$, then which $b$ of the rest give $y$, gives $\\binom na\\binom{n-a}{b} = \\frac{n!}{a!\\,b!\\,c!}$ arrangements, each contributing one $x^ay^bz^c$.",
  },
  burnside: {
    explain: "When rotations count as the same, don't divide the total by the number of rotations: symmetric colorings would be undercounted. Instead, for each symmetry count the colorings it leaves unchanged, then average.",
    proof: "Count pairs (symmetry $g$, coloring $x$) with $g$ fixing $x$. By symmetries the count is $\\sum |\\operatorname{Fix}(g)|$. By colorings, each $x$ is fixed by $\\frac{|G|}{|\\text{orbit of } x|}$ symmetries, so each orbit contributes exactly $|G|$. Divide by $|G|$.",
  },
  "generating-functions": {
    explain: "Write each choice as a polynomial whose exponents are the amounts you can take: a penny is $1 + x + x^2 + \\cdots$, a nickel is $1 + x^5 + x^{10} + \\cdots$. Multiplying adds the amounts, so the coefficient of $x^n$ counts the ways to make $n$.",
    proof: "Each term of the product picks one term from each factor, and its exponent is the sum of the chosen exponents. So the terms of degree $n$ match the ways to make $n$ one-to-one. $\\frac{1}{(1-x)^k}$ is $k$ copies of $1 + x + \\cdots$, so its $x^n$ coefficient counts solutions of $x_1 + \\cdots + x_k = n$: $\\binom{n+k-1}{k-1}$.",
  },
  "roots-of-unity-filter": {
    explain: "Plugging $x = 1, \\omega, \\omega^2$ into $(1 + x)^n$ and averaging cancels every term whose power isn't a multiple of $3$. With $x = \\pm1$, the same trick picks out the even terms.",
    proof: "$\\frac{1 + \\omega^k + \\omega^{2k}}{3}$ is $1$ when $3 \\mid k$ and $0$ otherwise, since then $\\omega^k \\ne 1$ is a root of $1 + t + t^2$. Apply this to each term $\\binom nk x^k$. For even terms, $\\frac{(1+1)^n + (1-1)^n}{2} = 2^{n-1}$.",
  },
  partitions: {
    explain: "A partition of $n$ is a way to write it as a sum where order doesn't matter: $4 = 3 + 1 = 2 + 2 = 2 + 1 + 1 = 1 + 1 + 1 + 1$, so $p(4) = 5$. For small $n$, list them by largest part.",
    proof: "In $\\prod \\frac{1}{1-x^k}$, the factor for $k$ chooses how many parts equal $k$, so the $x^n$ coefficient is $p(n)$. Distinct parts give $\\prod (1 + x^k) = \\prod \\frac{1 - x^{2k}}{1 - x^k}$, which cancels to $\\prod_{k \\text{ odd}} \\frac{1}{1 - x^k}$, the function for odd parts.",
  },
  "stirling-second": {
    explain: "$S(n, k)$ counts ways to split $n$ different items into $k$ groups when the groups have no names. For $2$ groups: each item but the first picks a side, minus the case where all are with the first.",
    proof: "Look at item $n$. Either it's alone, and the rest form $k - 1$ groups: $S(n-1, k-1)$ ways. Or the rest form $k$ groups and item $n$ joins one of them: $kS(n-1, k)$ ways.",
  },
  surjections: {
    explain: "Onto means every target gets used. Start with all $k^n$ functions, subtract those missing a given target, add back those missing two, and so on.",
    proof: "Functions avoiding a fixed set of $i$ targets number $(k - i)^n$, and there are $\\binom ki$ such sets. Inclusion-exclusion gives the sum. Also, an onto function is a split into $k$ groups (the preimages) with the groups labeled, so it equals $k!\\,S(n, k)$.",
  },
  "balls-in-boxes": {
    explain: "The formula depends on what you can tell apart. Distinct balls in distinct boxes: each ball picks a box. Identical balls in distinct boxes: stars and bars. Distinct balls in identical boxes: Stirling numbers. Identical in identical: partitions.",
    proof: "Each case is a different counting object. Labeled balls into labeled boxes is a function, $k^n$. Unlabeled balls into labeled boxes is a solution of $x_1 + \\cdots + x_k = n$. Labeled balls into unlabeled boxes is a set partition into at most $k$ blocks. Unlabeled into unlabeled is an integer partition into at most $k$ parts.",
  },
  "stars-bars-limits": {
    explain: "Count without the limit, then subtract the solutions where some variable is too big. If $x_1 \\ge m + 1$, set $x_1' = x_1 - (m + 1)$ and count again with total $n - (m + 1)$.",
    proof: "For each set of $j$ variables forced above $m$, subtracting $m + 1$ from each leaves an unrestricted problem with total $n - j(m+1)$, which has $\\binom{n - j(m+1) + k - 1}{k-1}$ solutions. Inclusion-exclusion over the $\\binom kj$ sets gives the sum.",
  },
  compositions: {
    explain: "A composition is a sum where order matters: $3 = 3 = 2 + 1 = 1 + 2 = 1 + 1 + 1$. Write $n$ as a row of $n$ ones and decide which of the gaps get a plus sign.",
    proof: "Between $n$ stars there are $n - 1$ gaps. Each composition is a choice of which gaps get a bar, so there are $2^{n-1}$. For exactly $k$ parts, choose $k - 1$ of the gaps: $\\binom{n-1}{k-1}$.",
  },
  ballot: {
    explain: "If $A$ gets $a$ votes and $B$ gets $b$ with $a > b$, the chance $A$ leads the whole count is $\\frac{a-b}{a+b}$. Multiply by $\\binom{a+b}{a}$ for the number of good orders.",
    proof: "The first vote must go to $A$. Among orders starting with $A$, the bad ones (that tie at some point) match, by reflecting up to the first tie, the orders starting with $B$, of which there are $\\binom{a+b-1}{b-1}$. So good orders are $\\binom{a+b-1}{a-1} - \\binom{a+b-1}{b-1} = \\frac{a-b}{a+b}\\binom{a+b}{a}$.",
  },
  "reflection-principle": {
    explain: "To count paths that never cross a line, count the ones that do and subtract. A path that touches the forbidden line can be flipped after its first touch, which turns it into a path to a reflected endpoint.",
    proof: "Take a path from $(0,0)$ to $(n,n)$ that touches $y = x + 1$. Reflect the part after the first touch over that line; it now ends at $(n - 1, n + 1)$. This is reversible, since every path to $(n-1, n+1)$ must touch the line. So there are $\\binom{2n}{n+1}$ bad paths.",
  },
  "binomial-identities": {
    explain: "Choosing $k$ to include is the same as choosing $n - k$ to leave out. Consecutive entries in a row have ratio $\\frac{n-k}{k+1}$. A row sums to $2^n$, and its even and odd entries each sum to $2^{n-1}$.",
    proof: "Symmetry: complement the chosen set. Ratio: $\\binom n{k+1} = \\frac{n!}{(k+1)!(n-k-1)!} = \\binom nk\\frac{n-k}{k+1}$. Sums: put $x = 1$ and $x = -1$ into $(1 + x)^n = \\sum \\binom nk x^k$.",
  },
  "binomial-sums": {
    explain: "$\\sum k\\binom nk$ counts committees with a chosen leader, which is $n2^{n-1}$: pick the leader, then any subset of the rest. $\\sum \\binom nk^2$ is $\\binom{2n}{n}$.",
    proof: "Leader first gives $n \\cdot 2^{n-1}$; committee first gives $\\sum k\\binom nk$. For squares, write $\\binom nk^2 = \\binom nk\\binom n{n-k}$: choose $k$ from the first $n$ people and $n - k$ from the other $n$, which is any way to choose $n$ of $2n$.",
  },
  regions: {
    explain: "Each new line adds one more region than the number of lines it crosses. For chords, each crossing point inside adds a region, and each crossing is set by $4$ of the points.",
    proof: "Line $k$ crosses the earlier $k - 1$ lines, cutting it into $k$ pieces, each splitting a region: $1 + \\sum_{k=1}^n k = 1 + n + \\binom n2$. For chords, use $V - E + F = 2$, or count: start at $1$, each chord adds $1$ ($\\binom n2$ chords) and each crossing adds $1$ ($\\binom n4$ crossings).",
  },
  "grid-squares": {
    explain: "Count squares by size. In an $n \\times n$ grid a $k \\times k$ square has $n - k + 1$ positions across and down, so there are $(n-k+1)^2$ of them. Summing gives the sum of squares.",
    proof: "The top-left corner of a $k \\times k$ square can be in any of $n - k + 1$ columns and $n - k + 1$ rows. Summing over $k$ gives $n^2 + (n-1)^2 + \\cdots + 1^2 = \\frac{n(n+1)(2n+1)}{6}$.",
  },
  "generalized-pigeonhole": {
    explain: "If $n$ objects go into $k$ boxes, some box gets at least $\\lceil \\frac nk \\rceil$. To guarantee $m$ in one box you need one more than the worst case of $m - 1$ in every box.",
    proof: "If every box had at most $\\lceil \\frac nk \\rceil - 1 < \\frac nk$ objects, the total would be less than $k \\cdot \\frac nk = n$. Worst case: $k(m-1)$ objects can have $m - 1$ per box, so you need $k(m-1) + 1$.",
  },
  ramsey: {
    explain: "Among any $6$ people, some $3$ all know each other or all don't. Five isn't enough: put them on a pentagon with neighbors as friends and diagonals as strangers.",
    proof: "Pick one person. Of the other $5$, at least $3$ have the same relation to them, say friends. If any two of those $3$ are friends, they form a friend triangle with the first person. If not, the $3$ are all strangers.",
  },
  "handshake-lemma": {
    explain: "Add up all the degrees and you count every edge twice, once from each end. So the sum of degrees is even, and the number of odd-degree vertices is even.",
    proof: "Each edge contributes $1$ to the degree of each of its two endpoints, so it adds exactly $2$ to the sum.",
  },
  "planar-euler": {
    explain: "For a connected graph drawn without crossings, vertices minus edges plus faces is $2$, counting the outside as a face. Since each face has at least $3$ edges, a simple planar graph can't have more than $3V - 6$ edges.",
    proof: "A tree has $E = V - 1$ and $F = 1$, so $V - E + F = 2$. Adding an edge to a connected drawing splits one face in two, so $E$ and $F$ both go up by $1$. For the bound, each face has at least $3$ edges and each edge borders at most $2$ faces, so $3F \\le 2E$; substitute into Euler's formula.",
  },
  involutions: {
    explain: "An involution swaps some pairs and leaves the rest alone, so applying it twice gives back where you started. Counting them is the same as counting ways to pair up some members of a group.",
    proof: "Look at person $n$. Either they're alone, and the rest form an involution: $I_{n-1}$. Or they're paired with one of the other $n - 1$, and the remaining $n - 2$ form an involution: $(n - 1)I_{n-2}$.",
  },
};
