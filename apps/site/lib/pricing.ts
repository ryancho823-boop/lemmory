// The plans, for the pricing cards on "For users" and the Plan details page. The numbers come from packages/core/src/plans.ts,
// which the apps' billing uses too, so the site and the apps always agree.
import { TRIAL_DAYS, PRICES } from "@lemmory/core/plans";
import { TOTAL_FORMULAS } from "@/lib/bank";

export { TRIAL_DAYS, PRICES };

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
  `All ${TOTAL_FORMULAS} formulas, from AMC 8 to AIME, ready to assign to your students`,
  "A dashboard that shows which formulas your class is forgetting and which students are falling behind",
  "A class leaderboard that you can restart whenever you want",
];

export const TIERS: Tier[] = [
  {
    id: "academy",
    who: "Math academies",
    bestFor: "You run paid classes or tutoring.",
    price: `$${academy.perStudent}`,
    per: "per student / month",
    intro: "For tutoring centers and programs that charge students for classes.",
    details: [
      { title: "What you get", items: TEACHER_FEATURES },
      {
        title: "What you pay",
        items: [
          `$${academy.perStudent} for each student, every month`,
          "A student in two of your classes is only counted once",
          `Example: 20 students cost $${20 * academy.perStudent} a month`,
        ],
      },
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
      {
        title: "What you pay",
        items: [
          `$${club.perStudent} for each student, every month`,
          `Never more than $${club.classCap} a month for the club, however many students join`,
          `Example: 5 students cost $${5 * club.perStudent} a month; 30 students cost $${Math.min(30 * club.perStudent, club.classCap)}`,
        ],
      },
      {
        title: "How we confirm",
        items: ["Sign up with your school email", "We confirm your school, then the club price starts", "Until we confirm, it's free"],
      },
    ],
  },
  {
    id: "student",
    who: "Individual students",
    bestFor: "You're studying on your own, not in a class.",
    price: `$${student.monthly}`,
    per: "per month",
    note: `The first ${TRIAL_DAYS} days are free`,
    intro: "For students preparing for contests on their own.",
    details: [
      {
        title: "What you get",
        items: [
          `Add any of the ${TOTAL_FORMULAS} formulas to your own deck`,
          "A short daily review that brings each formula back before you forget it",
          "Your own stats, and Practice all to go through your whole deck before a contest",
        ],
      },
      {
        title: "What you pay",
        items: [`Free for the first ${TRIAL_DAYS} days`, `Then $${student.monthly} a month`, "Not needed if your teacher's plan already covers your class"],
      },
    ],
  },
];

/** Rules for the teacher plans (academies and clubs), not the individual student plan. */
export const TEACHER_PLAN_RULES = [
  `Free for the first ${TRIAL_DAYS} days.`,
  "After that, enter your academy's or school's details and pay to keep going. Your classes and students' progress are saved.",
  "Your students never pay.",
];
