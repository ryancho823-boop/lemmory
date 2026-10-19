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

export const TIERS: Tier[] = [
  {
    id: "academy",
    who: "Math academies",
    bestFor: "You run paid classes or tutoring.",
    price: `$${academy.perStudent}`,
    per: "per student / month",
    intro: "For tutoring centers and programs that charge for their classes.",
    details: [
      {
        title: "What you get",
        items: [
          "Create as many classes as you need, with no extra fee per class",
          `Assign any of the ${TOTAL_FORMULAS} formulas, from AMC 8 to AIME`,
          "See what each class is forgetting, and run leaderboard games",
        ],
      },
      {
        title: "What you pay",
        items: [
          `$${academy.perStudent} a month for each student in your classes`,
          "A student in two of your classes is only counted once",
          `For example, a class of 20 students costs $${20 * academy.perStudent} a month`,
        ],
      },
      { title: "How to start", items: [`Start a free ${PILOT_DAYS}-day pilot. There's nothing to verify.`] },
    ],
  },
  {
    id: "club",
    who: "School math clubs",
    bestFor: "You run a free math club at a school.",
    price: `$${club.perStudent}`,
    per: "per student / month",
    note: `Never over $${club.classCap} a month per class`,
    intro: "For free math clubs at a school, run by a teacher or club advisor.",
    details: [
      { title: "What you get", items: ["Everything the academy plan has"] },
      {
        title: "What you pay",
        items: [
          `$${club.perStudent} a month for each student, but never more than $${club.classCap} a month for a club`,
          `For example, a club of 5 costs $${5 * club.perStudent} a month, and a club of 30 costs $${Math.min(30 * club.perStudent, club.classCap)}`,
        ],
      },
      {
        title: "How to start",
        items: [
          "Sign up with your school email and the name of your school",
          "We check with your school, then the club price begins",
          `While we check, you're on the free ${PILOT_DAYS}-day pilot`,
        ],
      },
    ],
  },
  {
    id: "student",
    who: "Individual students",
    bestFor: "You're studying on your own, not in a class.",
    price: `$${student.monthly}`,
    per: "per month",
    intro: "For students preparing on their own, without a class.",
    details: [
      {
        title: "What you get",
        items: [
          `Your own deck and daily review, with all ${TOTAL_FORMULAS} formulas to choose from`,
          "Assigning and class leaderboards aren't included. Those come with a teacher's plan.",
        ],
      },
      {
        title: "What you pay",
        items: [`$${student.monthly} a month`, "If your teacher already pays for your class, you don't need this"],
      },
    ],
  },
];

/** Rules for the teacher plans (academies and clubs), not the individual student plan. */
export const TEACHER_PLAN_RULES = [
  `Every teacher plan starts with a free ${PILOT_DAYS}-day pilot, once per teacher`,
  "When the pilot ends, pick a plan to keep going. Students can't start new reviews until you do, but nothing is lost.",
  "Students never pay when their teacher's plan covers the class",
];
