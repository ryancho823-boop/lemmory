import { ContactLink, DocPage } from "@/components/site/Doc";

export const metadata = { title: "About · Lemmory" };

export default function About() {
  return (
    <DocPage title="About Lemmory">
      <p>
        Lemmory is made by Ryan Cho, a student who competes in math contests. It started from a simple problem: formulas learned in a fall course
        were gone by contest day, and nothing made reviewing them part of the class.
      </p>
      <p>
        So Lemmory gives every student a deck that grows with their course. Each formula comes back right before it would be forgotten, first to
        recall, then to use on real problems, and teachers see what the class is forgetting.
      </p>
      <p>
        Questions, ideas or a mistake in a problem? Email <ContactLink />.
      </p>
    </DocPage>
  );
}
