// A plain reading page (privacy, terms, about): a title band, then short sections with headings.
import { Container, PageIntro } from "./blocks";
import { CONTACT_EMAIL } from "@/lib/links";

export function DocPage({ title, updated, children }: { title: string; updated?: string; children: React.ReactNode }) {
  return (
    <div>
      <section className="bg-lemon">
        <Container className="pb-14 pt-14 sm:pt-20">
          <PageIntro title={title} sub={updated && `Last updated ${updated}`} />
        </Container>
      </section>
      <Container className="py-14 [&_a]:font-semibold [&_a]:underline [&_a]:underline-offset-2 [&_li]:mt-1.5 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
        <div className="max-w-3xl text-[17px] leading-relaxed">{children}</div>
      </Container>
    </div>
  );
}

export function DocSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10 border-t border-line pt-6 first:mt-0 first:border-0 first:pt-0">
      <h2 className="font-display text-2xl">{title}</h2>
      {children}
    </section>
  );
}

export const ContactLink = () => <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;
