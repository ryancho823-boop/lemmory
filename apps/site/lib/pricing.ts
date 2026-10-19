// The plans, for the pricing cards on "For users" and the Plan details page. The numbers come from packages/core/src/plans.ts,
// which the apps' billing uses too, so the site and the apps always agree.
import { PILOT_DAYS, PRICES } from "@lemmory/core/plans";
import { TOTAL_FORMULAS } from "@/lib/bank";

export { PILOT_DAYS, PRICES };

export interface Tier {
  id: "academy" | "club" | "student";
  who: string;
  /** Who should pick this plan, in one line (on the pricing card). */
  bestFor: string;
  price: string;
  per: string;
  /** Extra line under the price, e.g. a cap. */
  note?: string;
  /** The opening line on the Plan details page. */
  intro: string;
  /** The Plan details page: a few short groups of bullet points. */
  details: { title: string; items: string[] }[];
}

const { academy, club, student } = PRICES;

// What a teacher plan includes. Academies and clubs get the same features; only the price differs.
const TEACHER_FEATURES = [
  `Unlimited classes, each with all ${TOTAL_FORMULAS} formulas to assign`,
  "See which formulas each class is forgetting and who's falling behind",
  "Class leaderboard games",
];

export const TIERS: Tier[] = [
  {
    id: "academy",
    who: "Math academies",
    bestFor: "You run paid classes or tutoring.",
    price: `$${academy.perStudent}`,
    per: "per student / month",
    intro: "For tutoring centers and programs that charge for classes.",
    details: [
      { title: "What you get", items: TEACHER_FEATURES },
      { title: "What you pay", items: [`$${academy.perStudent} per student each month. A class of 20 costs $${20 * academy.perStudent} a month.`] },
    ],
  },
  {
    id: "club",
    who: "School math clubs",
    bestFor: "You run a free math club at a school.",
    price: `$${club.perStudent}`,
    per: "per student / month",
    note: `Never over $${club.classCap} a month per class`,
    intro: "For free math clubs run by a teacher or advisor at a school.",
    details: [
      { title: "What you get", items: TEACHER_FEATURES },
      { title: "What you pay", items: [`$${club.perStudent} per student each month, but never more than $${club.classCap} a month per club.`] },
      { title: "How we confirm", items: ["Sign up with your school email. The club price starts once we confirm your school; until then it's free."] },
    ],
  },
  {
    id: "student",
    who: "Individual students",
    bestFor: "You're studying on your own, not in a class.",
    price: `$${student.monthly}`,
    per: "per month",
    intro: "For students preparing on their own.",
    details: [
      { title: "What you get", items: [`Your own deck: add any of the ${TOTAL_FORMULAS} formulas and review them every day`] },
      { title: "What you pay", items: [`$${student.monthly} a month. If your teacher's plan covers your class, you don't need this.`] },
    ],
  },
];

/** Rules for the teacher plans (academies and clubs), not the individual student plan. */
export const TEACHER_PLAN_RULES = [
  `Free for the first ${PILOT_DAYS} days.`,
  "After that, choose a plan to keep going. Your classes and students' progress are saved.",
  "Your students never pay.",
];
