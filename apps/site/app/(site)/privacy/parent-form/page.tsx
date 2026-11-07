import { ContactLink, DocPage } from "@/components/site/Doc";
import { PrintButton } from "@/components/site/PrintButton";

export const metadata = { title: "Parent form · Lemmory" };

const LINES = ["Child's first and last name", "Class code, if they have one", "Parent or guardian's name", "Parent or guardian's email", "Signature", "Date"];

// How a parent agrees to a child being in a class. We answer with a set-up link (npm run parent:invite).
export default function ParentForm() {
  return (
    <DocPage title="Parent form">
      <p className="print:hidden">
        Sign this and send a photo or scan to <ContactLink />. We&apos;ll email you a link to set up your child&apos;s account.
      </p>
      <h1 className="hidden font-display text-3xl print:block">Lemmory parent form</h1>
      <p className="mt-6">
        I am the parent or legal guardian of the child named below. I have read the &quot;Children under 13&quot; section of the Lemmory privacy page, and I
        agree that Lemmory may collect and use my child&apos;s information as it describes. That includes showing their results to their teachers, and
        their first name, last initial and points to classmates on the class leaderboard.
      </p>
      <p>I can see or delete this information, or take back this permission, at any time by emailing support@lemmory.com.</p>
      <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 print:mt-5 print:grid-cols-2 print:gap-y-3">
        {LINES.map((label) => (
          <div key={label} className="border-b border-ink pb-7 print:pb-5">
            <dt className="text-sm">{label}</dt>
          </div>
        ))}
      </dl>
      <PrintButton />
    </DocPage>
  );
}
