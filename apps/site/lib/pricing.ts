// The plans, for the pricing cards on "For users" and the Plan details page. The numbers come from packages/core/src/plans.ts,
// which the apps' billing uses too, so the site and the apps always agree.
import { PILOT_DAYS, PRICES } from "@lemmory/core/plans";

export { PILOT_DAYS, PRICES };

export interface Tier {
  id: "academy" | "club" | "student";
  who: string;
  /** Who should pick this plan, in one line. */
  bestFor: string;
  price: string;
  per: string;
  /** Extra line under the price, e.g. a cap. */
  note?: string;
  /** What a typical class would pay. */
  example: string;
  /** What the plan includes, one bullet each. */
  included: string[];
  /** How we make sure the right people get this price. */
  verify: string;
}

export const TIERS: Tier[] = [
  {
    id: "academy",
    who: "Math academies",
    bestFor: "You run paid classes or tutoring.",
    price: `$${PRICES.academy.perStudent}`,
    per: "per student / month",
    example: `A class of 20 students: $${20 * PRICES.academy.perStudent} a month.`,
    included: [
      "Every class you run, with the full formula bank",
      "Assigning formulas, class analytics and leaderboard games",
      "You pay only for students in your classes; a student in two of your classes counts once",
    ],
    verify: "No check needed. This is the standard price for anyone running paid classes.",
  },
  {
    id: "club",
    who: "School math clubs",
    bestFor: "You run a free math club at a school.",
    price: `$${PRICES.club.perStudent}`,
    per: "per student / month",
    note: `Never over $${PRICES.club.classCap} a month per class`,
    example: `A club of 5: $${5 * PRICES.club.perStudent} a month. A club of 30: $${Math.min(30 * PRICES.club.perStudent, PRICES.club.classCap)}.`,
    included: [
      "Everything academies get",
      "Until the school confirms the club, it runs on the free pilot",
    ],
    verify: "Sign up with your school email and school name. We confirm the club with the school before the club price applies.",
  },
  {
    id: "student",
    who: "Individual students",
    bestFor: "You're studying on your own, not in a class.",
    price: `$${PRICES.student.monthly}`,
    per: "per month",
    example: `One student: $${PRICES.student.monthly} a month.`,
    included: [
      "Your own deck and daily review, with the full formula bank",
      "No assigning or class leaderboard; those come with a teacher's plan",
    ],
    verify: "No check needed. It's one account with no classes, so it can't be used to run a class.",
  },
];

