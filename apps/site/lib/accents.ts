// The four accent colors the main site uses for numbered steps, tabs and question topics.
// They match four of the topic colors, so the site and the app feel like one product.
export const ACCENT = {
  rose: "#e11d48",
  blue: "#2563eb",
  green: "#16a34a",
  purple: "#9333ea",
} as const;

/** The accents in order, for numbered lists: step 1 is rose, step 2 blue, and so on. */
export const ACCENT_CYCLE = [ACCENT.rose, ACCENT.blue, ACCENT.green, ACCENT.purple];
