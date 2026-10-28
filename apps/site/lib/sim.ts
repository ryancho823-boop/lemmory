// The demo's simulated class: the real simulator (packages/core/src/sim.ts) run on the demo's
// slice of the bank, plus the demo class's name and contest.

import { simulate as run } from "@lemmory/core/sim";
import type { Assignment, StudentRecord } from "@lemmory/core/records";
import { BANK } from "./bank";

export { CLASSMATES, YOU, seedAssignments } from "@lemmory/core/sim";
export { NEW_PER_DAY } from "@lemmory/core/records";
export type { Assignment, LogEntry, StudentRecord } from "@lemmory/core/records";

export const simulate = (
  profile: Parameters<typeof run>[0],
  assignments: Assignment[],
  until: number,
  opts?: Parameters<typeof run>[4],
): StudentRecord => run(profile, assignments, until, BANK, opts);

export const CLASS_NAME = "Long-Term AMC 10 Course";
// The 2026 AMC 10A is on November 5 (maa.org/AMC).
export const CONTEST = "AMC 10A · Nov 5";

/** The contest label with a countdown from `today` (a local day number) to the next Nov 5. */
export function contestLabel(today: number) {
  const DAY = 86_400_000;
  const year = new Date(today * DAY).getUTCFullYear();
  let contest = Date.UTC(year, 10, 5) / DAY;
  if (contest < today) contest = Date.UTC(year + 1, 10, 5) / DAY;
  const n = contest - today;
  return `${CONTEST} · ${n === 0 ? "today" : n === 1 ? "tomorrow" : `${n} days away`}`;
}
