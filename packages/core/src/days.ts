// A "day" is a calendar day number (days since 1970-01-01) in the class's time zone,
// so "today" flips at local midnight for everyone in the class.

export const DAY_MS = 86_400_000;

/** Today's day number in an IANA time zone like "America/Los_Angeles". */
export function dayInZone(timeZone: string, now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "numeric", day: "numeric" }).formatToParts(now);
  const get = (t: string) => Number(parts.find((p) => p.type === t)!.value);
  return Math.floor(Date.UTC(get("year"), get("month") - 1, get("day")) / DAY_MS);
}

export function isTimeZone(tz: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** "2026-11-06" → day number, or null. */
export function parseDate(iso: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  return m ? Math.floor(Date.UTC(+m[1], +m[2] - 1, +m[3]) / DAY_MS) : null;
}

/** Day number → "2026-11-06" (for date inputs). */
export const isoDate = (day: number) => new Date(day * DAY_MS).toISOString().slice(0, 10);

// Day numbers are calendar days, so format them in UTC.
export const fmtDay = (day: number, opts: Intl.DateTimeFormatOptions = { weekday: "short", month: "short", day: "numeric" }) =>
  new Date(day * DAY_MS).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });

/** "AMC 10A · Nov 6 · 25 days away", or just the name when there's no date. */
export function contestLabel(name: string | null, date: number | null, today: number) {
  if (!name) return null;
  if (date === null) return name;
  const n = date - today;
  const when = n < 0 ? "done" : n === 0 ? "today" : n === 1 ? "tomorrow" : `${n} days away`;
  return `${name} · ${fmtDay(date, { month: "short", day: "numeric" })} · ${when}`;
}
