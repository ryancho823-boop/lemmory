// Prices shown on the "For users" page. The teacher and student sites in lemmory-app
// use the same numbers (packages/db/src/billing.ts); keep them in sync.

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
    price: "$3",
    per: "per student / month",
    body: "Every class, the full formula bank, assigning, class analytics, and leaderboard games. You only pay for students in your classes.",
    verify: "No check needed. This is the standard price for anyone running paid classes.",
  },
  {
    id: "club",
    who: "School math clubs",
    price: "$3",
    per: "per student / month",
    note: "Never more than $40 per class a month",
    body: "Everything academies get, for free clubs run at a school by a teacher or club advisor.",
    verify: "Sign up with your school email and school name. We confirm the club with the school before the cap applies; until then it's a free pilot.",
  },
  {
    id: "student",
    who: "Individual students",
    price: "$2",
    per: "per month",
    body: "Your own deck and daily review, with the full formula bank. Students in a class their teacher pays for don't need this.",
    verify: "No check needed. It's one account with no classes, so it can't be used to run a class.",
  },
];

export const PILOT_DAYS = 30;
