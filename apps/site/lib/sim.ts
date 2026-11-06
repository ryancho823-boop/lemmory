// The demo's simulated class: the real simulator (packages/core/src/sim.ts) run on the demo's
// slice of the bank, plus the demo class's name and contest.

import { simulate as run } from "@lemmory/core/sim";
import type { Assignment, StudentRecord } from "@lemmory/core/records";
import { contestLabel as label } from "@lemmory/core/days";
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
// The real contests, in order (maa.org/AMC and maa.org/maa-invitational-competitions). Add the next
// season's dates when the MAA publishes them.
const CONTESTS = [
  { name: "AMC 10A", date: Date.UTC(2026, 10, 5) },
  { name: "AMC 10B", date: Date.UTC(2026, 10, 13) },
  { name: "AIME", date: Date.UTC(2027, 1, 5) },
];
export const CONTEST = "AMC 10";

/** The next contest on or after `today` (a local day number), with its countdown. */
export function contestLabel(today: number) {
  const next = CONTESTS.find((c) => c.date / 86_400_000 >= today);
  return next ? label(next.name, next.date / 86_400_000, today) : CONTEST;
}
