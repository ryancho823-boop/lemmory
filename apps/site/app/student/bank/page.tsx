"use client";

import { FormulaBrowser } from "@/components/FormulaBrowser";
import { DeckButton } from "@/components/DeckButton";
import { PageHeader } from "@lemmory/ui/ui";

export default function BankPage() {
  return (
    <div>
      <PageHeader title="Formula bank" />
      <FormulaBrowser role="student" hrefFor={(f) => `/student/bank/${f.id}`} action={(f) => <DeckButton formulaId={f.id} />} />
    </div>
  );
}
