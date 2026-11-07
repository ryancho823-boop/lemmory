import { ContactLink, DocPage } from "@/components/site/Doc";
import { PrintButton } from "@/components/site/PrintButton";

export const metadata = { title: "School form · Lemmory" };

const LINES = ["School or district", "Classes (name and join code)", "Name and title of the person signing", "Email", "Signature", "Date"];

// A school signs this once. It's the school's COPPA permission and the FERPA promises in one page.
export default function SchoolForm() {
  return (
    <DocPage title="School form">
      <h1 className="hidden font-display text-3xl print:block">Lemmory school form</h1>
      <p className="print:hidden">
        A school official signs this once, and students under 13 in the listed classes can then join without a parent&apos;s email. Send a scan to{" "}
        <ContactLink />. It should come from the school, not one teacher alone.
      </p>
      <h2 className="mt-8 font-display text-2xl">The school agrees</h2>
      <ul>
        <li>Lemmory may collect the information on our privacy page from students in the listed classes, on their parents&apos; behalf (COPPA).</li>
        <li>This permission is only for the school&apos;s own teaching, not for any other commercial use.</li>
        <li>The school will tell parents it uses Lemmory, and make our privacy page available to them.</li>
      </ul>
      <h2 className="mt-8 font-display text-2xl">Lemmory agrees</h2>
      <ul>
        <li>We act as a school official under FERPA, and the school keeps control of its students&apos; records.</li>
        <li>We use them only to run Lemmory for the school. No ads, no selling, and no sharing except with the service companies on our privacy page.</li>
        <li>On request we show the school what we hold about a student, stop collecting more, and delete it within 30 days.</li>
        <li>We tell the school without delay if student information is exposed, and we keep it protected with reasonable security.</li>
      </ul>
      <dl className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 print:mt-5 print:grid-cols-2 print:gap-y-3">
        {LINES.map((label) => (
          <div key={label} className="border-b border-ink pb-7 print:pb-5">
            <dt className="text-sm">{label}</dt>
          </div>
        ))}
      </dl>
      <p className="mt-6">Signed for Lemmory: ______________________ Date: __________</p>
      <PrintButton />
    </DocPage>
  );
}
