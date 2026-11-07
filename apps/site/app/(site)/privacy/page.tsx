import Link from "next/link";
import { ContactLink, DocPage, DocSection } from "@/components/site/Doc";
import { MAILING_ADDRESS, PHONE } from "@/lib/links";

export const metadata = { title: "Privacy · Lemmory" };

// Keep this in step with what the code actually stores (packages/db/src/schema.ts).
export default function Privacy() {
  return (
    <DocPage title="Privacy" updated="November 7, 2026">
      <p>
        Lemmory is daily formula practice for math competition classes. This page says what we keep, why, who can see it, and how to have it deleted.
        The short version: we keep only what the app needs to work, we don&apos;t show ads, and we don&apos;t sell anyone&apos;s information.
      </p>

      <DocSection title="What we keep">
        <p>
          <b>Students:</b> first and last name, a username, a password (stored only as a one-way hash, never readable), the time zone of their device,
          the classes they join, and their practice: which formulas are in their deck, each answer marked right or wrong, which formulas they mixed up,
          and their points and streak. We ask for a contact email, theirs or a parent&apos;s, and use it only for account emails: confirming the address, changing it, and resetting passwords. We don&apos;t keep the answers they type.
          At sign-up we ask for a birth month and year to see whether a parent or school has to agree first. We don&apos;t store them. A student under 13
          gets a cookie for one day so the answer can&apos;t simply be changed, and we record who gave permission, including the name a parent signs with and when.
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
          <li>Classmates see each other&apos;s names and points on the class leaderboard, never anyone&apos;s answers or results. For a student under 13, that&apos;s a first name and last initial.</li>
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
          To have anything else deleted or corrected, or to ask what we keep about you or your child, email <ContactLink />. We answer within 30 days.
        </p>
      </DocSection>

      <DocSection title="How long we keep it">
        <p>
          We keep information so the account works, and no longer than that. A student account is deleted after 12 months with no practice and no login,
          unless it&apos;s on a paid plan. A request from a parent or school is finished within 30 days. If a parent doesn&apos;t answer our email, we
          delete their email and the child&apos;s first name after 14 days. Teacher accounts stay until they&apos;re deleted.
        </p>
      </DocSection>

      <DocSection title="Children under 13" id="children">
        <p>
          This is the notice for parents and guardians under the US Children&apos;s Online Privacy Protection Act (COPPA). Lemmory is run by Ryan Cho,{" "}
          {MAILING_ADDRESS}, {PHONE}, <ContactLink />. Lemmory isn&apos;t run by or affiliated with that school.
        </p>
        <p>A child under 13 can use Lemmory only after one of these:</p>
        <ul>
          <li>
            <b>A parent or guardian agrees.</b> The child gives us their first name and a parent&apos;s email, and nothing else. We email the parent, who
            signs online and sets up the account. A day later we email again, with a link to delete the account if the parent didn&apos;t sign or changes
            their mind. A parent can use the paper <Link href="/privacy/parent-form">parent form</Link> instead.
          </li>
          <li>
            <b>The child&apos;s school agrees</b> for a class it runs, by signing the <Link href="/privacy/school-form">school form</Link>. A school can do
            this only for use in its own teaching, and that&apos;s the only way we use the information. Academies and tutors aren&apos;t schools, so their
            students use a parent&apos;s permission.
          </li>
        </ul>
        <p>
          We collect from a child what&apos;s listed under Students at the top of this page, and use it only to run their practice. A child never has to
          give more than Lemmory needs. In a class, their teachers see their results, and classmates see their first name, last initial and points on the class leaderboard.
          The companies named above handle it only to run Lemmory, and nobody else receives it.
        </p>
        <p>
          <b>What parents can do:</b> email <ContactLink /> at any time to see what we hold about your child, have it deleted, or stop us collecting more.
          Deleting it ends their use of Lemmory. You can agree to us collecting and using it without agreeing to any sharing beyond what this page
          describes. If we learn a child under 13 has an account without permission, we delete it. Please tell us if you think that has happened.
        </p>
      </DocSection>

      <DocSection title="Schools and FERPA" id="schools">
        <p>
          The Family Educational Rights and Privacy Act (FERPA) sets rules for schools&apos; student records. When a school uses Lemmory under the{" "}
          <Link href="/privacy/school-form">school form</Link>, we act as a &quot;school official&quot;: we do a job the school would otherwise do, the
          school keeps control of its students&apos; records, and we use them only for that job. We don&apos;t pass them on, except to the companies
          named above that run Lemmory for us. The school can review or delete them at any time, and families&apos; requests to see or correct records go
          through the school. If student information is ever exposed, we tell the school without delay.
        </p>
      </DocSection>

      <DocSection title="Changes">
        <p>If what we keep or how we use it changes, we&apos;ll update this page and the date at the top.</p>
      </DocSection>
    </DocPage>
  );
}
