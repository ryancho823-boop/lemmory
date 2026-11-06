import { ContactLink, DocPage, DocSection } from "@/components/site/Doc";

export const metadata = { title: "Privacy · Lemmory" };

// Keep this in step with what the code actually stores (packages/db/src/schema.ts).
export default function Privacy() {
  return (
    <DocPage title="Privacy" updated="November 5, 2026">
      <p>
        Lemmory is daily formula practice for math competition classes. This page says what we keep, why, who can see it, and how to have it deleted.
        The short version: we keep only what the app needs to work, we don&apos;t show ads, and we don&apos;t sell anyone&apos;s information.
      </p>

      <DocSection title="What we keep">
        <p>
          <b>Students:</b> first and last name, a username, a password (stored only as a one-way hash, never readable), the time zone of their device,
          the classes they join, and their practice: which formulas are in their deck, each answer marked right or wrong, which formulas they mixed up,
          and their points and streak. We ask for a contact email, theirs or a parent&apos;s, and use it only for account emails: confirming the address, changing it, and resetting passwords. We don&apos;t keep the answers they type.
        </p>
        <p>
          <b>Teachers:</b> name, email address and password (hashed the same way), their classes and assignments, the plan they chose, and whether they want the weekly report. Paid plans
          also keep the organization&apos;s name and location and who receives the bills; a school club gives a school email so we can confirm the club.
        </p>
        <p>
          <b>Students on the individual plan:</b> the name and email of the parent or guardian who receives the bills.
        </p>
        <p>
          <b>To keep accounts safe:</b> a cookie that keeps you logged in (30 days), and a random id for your browser (kept for two years) that limits
          free trials and password guessing. Free trials and failed logins are recorded as scrambled fingerprints of the email address, browser id or
          network address, so we can tell when one repeats but can&apos;t turn them back into the original.
        </p>
        <p>Payments aren&apos;t connected yet, so no card details are collected anywhere on Lemmory.</p>
      </DocSection>

      <DocSection title="Emails we send">
        <p>
          Everyone gets account emails: a link to confirm an address, a link when changing it, and password reset links. Teachers also get a weekly
          report on Mondays about how their classes are doing, including students who need attention. They can turn it off on their Account page or
          with the link in the email. Students don&apos;t get reminders or marketing email.
        </p>
      </DocSection>

      <DocSection title="Who can see it">
        <ul>
          <li>A student&apos;s teachers see that student&apos;s practice results in their classes.</li>
          <li>Classmates see each other&apos;s names and points on the class leaderboard, never anyone&apos;s answers or results.</li>
          <li>No one else using Lemmory. There are no ads, no analytics or tracking scripts, and nothing is sold.</li>
        </ul>
        <p>
          A few companies run parts of Lemmory for us and only handle what that job needs: Turso (the database) and Vercel (hosting), Resend (sends
          our emails, so it receives the address and the message), and ImprovMX (forwards mail sent to our support address). Our support inbox is
          on Gmail. They work for us and we don&apos;t give them information for their own use.
        </p>
      </DocSection>

      <DocSection title="Deleting it">
        <p>
          Anyone can delete their own account from their account page. That removes their account and everything listed above that belongs to it,
          except the scrambled trial fingerprints, which have to stay so a free trial can&apos;t be restarted. Deleting a teacher account also deletes
          their classes; their students keep their own accounts. A teacher can remove a student from a class at any time.
        </p>
        <p>
          To have anything else deleted or corrected, or to ask what we keep about you or your child, email <ContactLink />.
        </p>
      </DocSection>

      <DocSection title="Children">
        <p>
          Lemmory is used by students in classes run by their teachers, and students may be under 13. We collect only what&apos;s listed above. If you
          are a parent or guardian and want to see or delete your child&apos;s information, email <ContactLink /> and we&apos;ll take care of it.
        </p>
      </DocSection>

      <DocSection title="Changes">
        <p>If what we keep or how we use it changes, we&apos;ll update this page and the date at the top.</p>
      </DocSection>
    </DocPage>
  );
}
