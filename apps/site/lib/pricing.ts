// The pricing cards on the "For users" page. The numbers come from packages/core/src/plans.ts,
// which the apps' billing uses too, so the site and the apps always agree.
import { PILOT_DAYS, PRICES } from "@lemmory/core/plans";

export { PILOT_DAYS, PRICES };

export interface Tier {
  id: "academy" | "club" | "student";
  who: string;
  price: string;
  per: string;
  /** Extra line under the price, e.g. a cap. */
  note?: string;
  body: string;
  verify: string;
}

export const TIERS: Tier[] = [
  {
    id: "academy",
    who: "Competition math academies",
    price: `$${PRICES.academy.perStudent}`,
    per: "per student / month",
    body: "Every class, the full formula bank, assigning, class analytics, and leaderboard games. You only pay for students in your classes.",
    verify: "No check needed. This is the standard price for anyone running paid classes.",
  },
  {
    id: "club",
    who: "School math clubs",
    price: `$${PRICES.club.perStudent}`,
    per: "per student / month",
    note: `Never over $${PRICES.club.classCap} a month per class`,
    body: "Everything academies get, for free clubs run at a school by a teacher or club advisor.",
    verify: "Sign up with your school email and school name. We confirm the club with the school before the cap applies; until then it's a free pilot.",
  },
  {
    id: "student",
    who: "Individual students",
    price: `$${PRICES.student.monthly}`,
    per: "per month",
    body: "Your own deck and daily review, with the full formula bank. Students in a class their teacher pays for don't need this.",
    verify: "No check needed. It's one account with no classes, so it can't be used to run a class.",
  },
];

