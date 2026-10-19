import { Container, PageIntro } from "@/components/site/blocks";
import { Faq, type FaqGroup } from "@/components/site/Faq";
import { InfoTip } from "@lemmory/ui/InfoTip";
import { JOIN_URL, SIGNUP_URL } from "@/lib/links";
import { PILOT_DAYS, PRICES, TIERS } from "@/lib/pricing";
import { ACCENT } from "@/lib/accents";

export const metadata = { title: "Plans and pricing · Lemmory" };

const FAQ: FaqGroup[] = [
  {
    id: "start",
    label: "Getting started",
    color: ACCENT.blue,
    items: [
      {
        q: "How long does it take to set up a class?",
        a: "A few minutes. Sign up, create a class, and share its code or join link. Students sign up with the code, and you assign formulas whenever the course covers them.",
      },
      {
        q: "Do students need an email address?",
        a: "No. Students sign up with a username and the class code, so younger students can join without an email.",
      },
      {
        q: "Who is it for?",
        a: "Middle and high school students preparing for the AMC 8, AMC 10/12 and AIME, plus calculus rounds at tournaments. It works for academy courses, school math clubs, and students studying on their own.",
      },
      {
        q: "Does it replace our curriculum?",
        a: "No. You teach the way you already do and assign each week's formulas to match. Lemmory handles the review between classes.",
      },
    ],
  },
  {
    id: "daily",
    label: "Day to day",
    color: ACCENT.green,
    items: [
      {
        q: "How long does it take students each day?",
        a: "About five minutes. Each day's review only includes the cards that are due, usually 5 to 15.",
      },
      {
        q: "How is typed math graded?",
        a: "Answers are checked by value, so any equivalent form counts: 37/4 and 9.25 are both right. A one-letter typo in a formula gets one free retry.",
      },
      {
        q: "What happens if a student misses a day?",
        a: "Their cards wait for them and their streak resets. Teachers can see who's behind, and students see the missed days on their calendar.",
      },
      {
        q: "Can students practice more than what's assigned?",
        a: "Yes. They can add any formula from the bank to their own deck, or run Practice all before a contest. Extra practice doesn't earn leaderboard points, so the competition stays fair.",
      },
    ],
  },
  {
    id: "teachers",
    label: "For teachers",
    color: ACCENT.rose,
    items: [
      {
        q: "What will I see about my class?",
        a: "Which formulas the class is forgetting, who finished today's review, who needs attention, which look-alike formulas students mix up, and full stats for each student.",
      },
      {
        q: "Can I teach more than one class?",
        a: "Yes. Switch between classes from the sidebar. A student can be in several classes and keeps one deck across all of them.",
      },
      {
        q: "How does the leaderboard work?",
        a: "Students earn 10 points per assigned card, plus a streak bonus. You can start a new game whenever you want, for example at the start of a unit.",
      },
      {
        q: "How is this different from Anki or Quizlet?",
        a: "Those only have the cards people make. Lemmory comes with a ready-to-assign competition formula bank, grades typed math, trains students to recognize which formula a problem needs, and shows you how the class is doing.",
      },
    ],
  },
  {
    id: "pricing",
    label: "Pricing",
    color: ACCENT.purple,
    items: [
      {
        q: "Why are there different prices?",
        a: `Academies charge for contest prep, so they pay the standard $${PRICES.academy.perStudent} per student. School clubs are usually free for students, so their price is never over $${PRICES.club.classCap} a month per class. Students on their own pay $${PRICES.student.monthly} a month.`,
      },
      {
        q: "What happens when the free pilot ends?",
        a: `The pilot lasts ${PILOT_DAYS} days, once per teacher. When it ends, you pick a plan to keep going. Until then students can't start new reviews, but nothing is lost.`,
      },
      {
        q: "How do you check that a club is a school club?",
        a: "Club sign-ups need a school email address and the school's name, and we confirm with the school before the club price applies. A program that charges tuition counts as an academy.",
      },
      {
        q: "Do students in a paid class pay anything?",
        a: "No. When the teacher's plan covers the class, students use Lemmory for free.",
      },
    ],
  },
];

// What a visitor deciding what to buy needs: the plans, which one fits, and answers.
const INTRO = {
  title: "Plans and pricing",
  sub: `Pick the plan that matches how you teach. Every teacher plan starts with a free ${PILOT_DAYS}-day pilot, and students in a paid class never pay.`,
};

export default function ForUsers() {
  return (
    <div>
      <section className="bg-lemon">
        <Container className="pb-16 pt-14 sm:pt-20">
          <PageIntro title={INTRO.title} sub={INTRO.sub} />
        </Container>
      </section>

      <section id="pricing">
        <Container className="py-16">
          <div className="grid gap-5 md:grid-cols-3">
            {TIERS.map((t, i) => (
              <div key={t.id} className="flex flex-col rounded-lg border-2 border-lemon bg-white p-7">
                <h2 className="flex items-center gap-1 text-xl font-semibold">
                  {t.who}
                  <InfoTip title={t.who} align={i === TIERS.length - 1 ? "right" : "left"}>
                    <span className="block">{t.body}</span>
                    <span className="mt-2 block">{t.example}</span>
                    <span className="mt-2 block">
                      <b className="text-ink">How we check:</b> {t.verify}
                    </span>
                  </InfoTip>
                </h2>
                <p className="mt-1 text-ink/70">{t.bestFor}</p>
                <p className="mt-6">
                  <span className="text-4xl font-extrabold">{t.price}</span> <span className="text-ink/70">{t.per}</span>
                </p>
                <p className="mt-1 min-h-6 font-semibold">{t.note}</p>
                <a
                  href={t.id === "student" ? JOIN_URL : SIGNUP_URL}
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-ink px-4 font-semibold text-white hover:bg-ink/85"
                >
                  {t.id === "student" ? "Sign up as a student" : "Start a free pilot"}
                </a>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line py-20">
        <Container>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Questions people ask</h2>
          <div className="mt-8">
            <Faq groups={FAQ} />
          </div>
        </Container>
      </section>
    </div>
  );
}
