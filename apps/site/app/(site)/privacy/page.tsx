import { ContactLink, DocPage, DocSection } from "@/components/site/Doc";
import { PrintButton } from "@/components/site/PrintButton";

export const metadata = { title: "Privacy · Lemmory" };

// Keep this in step with what the code actually stores (packages/db/src/schema.ts).
export default function Privacy() {
  return (
    <DocPage title="Privacy" updated="November 6, 2026">
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

      <DocSection title="Children under 13" id="parents">
        <p>
          Some students on Lemmory may be under 13, so this section is the notice for their parents and guardians, as the US Children&apos;s Online
          Privacy Protection Act (COPPA) requires. Lemmory is run by Ryan Cho. Reach us at <ContactLink />.
        </p>
        <p>
          <b>Permission comes first.</b> A student under 13 may use Lemmory only after one of these:
        </p>
        <ul>
          <li>
            <b>A parent or guardian agrees</b>, by signing the form below. This is needed for academies, tutors and students on the individual plan.
          </li>
          <li>
            <b>The school agrees</b> on parents&apos; behalf, for a class or club run by that school. A school may do this only for use in its own
            teaching, and we use the information only for that. The decision should come from the school, not one teacher alone.
          </li>
        </ul>
        <p>
          <b>What we collect from a child</b> is what&apos;s listed under Students at the top of this page: name, username, password, time zone, a
          contact email, classes, and practice results. We use it only to run the student&apos;s practice and show results to the student and their
          teachers. A child doesn&apos;t have to give more than Lemmory needs to work. We don&apos;t use it for ads, and we don&apos;t sell it.
        </p>
        <p>
          <b>Who receives it:</b> the student&apos;s teachers; classmates, who see the name and points on the class leaderboard; and the service
          companies named above, which only run parts of Lemmory for us. We don&apos;t share it with anyone else.
        </p>
        <p>
          <b>How long we keep it:</b> until the account is deleted, by the student, the parent or us.
        </p>
        <p>
          <b>What parents can do.</b> Email <ContactLink /> at any time to see what we hold about your child, have it deleted, or stop us collecting
          any more. A school can ask the same for its students. Deleting the information ends the child&apos;s use of Lemmory. You can agree to Lemmory
          using your child&apos;s information without agreeing to anything beyond what&apos;s on this page.
        </p>
        <p>
          If we learn that a child under 13 has an account without this permission, we&apos;ll delete it. If you think that has happened, please tell us.
        </p>
      </DocSection>

      <DocSection title="Parent permission form" id="parent-form">
        <p>
          Teachers: print this or copy it into an email for each student under 13, before they join. Parents: sign it and return it to the teacher, or
          email a photo of it to <ContactLink />. Parents of students on the individual plan send it to us directly.
        </p>
        <div className="mt-5 rounded-lg border-2 border-ink bg-white p-6 print:border-0 print:p-0">
          <p className="font-display text-xl">Permission for a child under 13 to use Lemmory</p>
          <p>
            I am the parent or legal guardian of the student named below. I have read the &quot;Children under 13&quot; section of the Lemmory privacy
            page. I agree that Lemmory may collect and use my child&apos;s name, username, time zone, contact email, classes and practice results to run
            their practice, and may show those results to their teachers and their name and points to classmates on the class leaderboard.
          </p>
          <p>I understand that I can see or delete this information, or withdraw this permission, at any time by emailing support@lemmory.com.</p>
          <dl className="mt-5 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {["Student's name", "Class and teacher", "Parent or guardian's name", "Parent or guardian's email", "Signature", "Date"].map((label) => (
              <div key={label} className="border-b border-ink pb-7">
                <dt className="text-sm">{label}</dt>
              </div>
            ))}
          </dl>
        </div>
        <PrintButton />
      </DocSection>

      <DocSection title="Changes">
        <p>If what we keep or how we use it changes, we&apos;ll update this page and the date at the top.</p>
      </DocSection>
    </DocPage>
  );
}
