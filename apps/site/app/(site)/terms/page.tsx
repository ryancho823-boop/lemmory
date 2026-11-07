import Link from "next/link";
import { ContactLink, DocPage, DocSection } from "@/components/site/Doc";
import { TRIAL_DAYS } from "@/lib/pricing";

export const metadata = { title: "Terms · Lemmory" };

export default function Terms() {
  return (
    <DocPage title="Terms" updated="November 7, 2026">
      <p>These are the rules for using Lemmory. By making an account, you agree to them.</p>

      <DocSection title="Accounts">
        <ul>
          <li>Give your real name, keep your password to yourself, and use only your own account.</li>
          <li>Teachers are responsible for the classes they create and for inviting only their own students.</li>
          <li>You can delete your account at any time from your account page.</li>
        </ul>
      </DocSection>

      <DocSection title="Students under 13">
        <p>
          A student under 13 needs a parent or guardian&apos;s permission, or their school&apos;s for a class it runs, as the{" "}
          <Link href="/privacy#children">privacy page</Link> explains. A student under 18 should read these terms with a parent or guardian.
        </p>
      </DocSection>

      <DocSection title="Plans and trials">
        <p>
          Every plan starts with a {TRIAL_DAYS}-day free trial. The prices are on the <Link href="/pricing">pricing page</Link>. When a trial ends
          without a paid plan, reviewing pauses until one starts; nothing is deleted. Students in a class on a paid plan never pay. Payments aren&apos;t connected yet, so choosing a plan doesn&apos;t charge you anything for now. We&apos;ll tell you before that changes.
        </p>
      </DocSection>

      <DocSection title="Using it fairly">
        <ul>
          <li>Don&apos;t try to get into accounts or classes that aren&apos;t yours, or to get around trial limits.</li>
          <li>Don&apos;t send automated traffic or try to break or overload the site.</li>
          <li>We may close an account that does these things.</li>
        </ul>
      </DocSection>

      <DocSection title="The content">
        <p>
          The formulas, problems and explanations are written for Lemmory, and are for use in Lemmory. We check every answer, but if you find a
          mistake, please email us. Lemmory isn&apos;t affiliated with the MAA, AoPS, or any contest.
        </p>
      </DocSection>

      <DocSection title="No guarantees">
        <p>
          We work to keep Lemmory running and correct, but it&apos;s provided as is, without a promise that it will always be available or free of
          errors, or that using it will raise anyone&apos;s scores.
        </p>
      </DocSection>

      <DocSection title="Changes and questions">
        <p>
          If these terms change, we&apos;ll update this page and the date at the top. Questions go to <ContactLink />. How we handle information is on
          the <Link href="/privacy">privacy page</Link>.
        </p>
      </DocSection>
    </DocPage>
  );
}
