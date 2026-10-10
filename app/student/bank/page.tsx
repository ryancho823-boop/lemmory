"use client";

import { FormulaBrowser } from "@/components/FormulaBrowser";
import { DeckButton } from "@/components/DeckButton";
import { PageHeader } from "@/components/ui";
import { FORMULAS } from "@/lib/formulas";

export default function BankPage() {
  return (
    <div>
      <PageHeader title="Formula bank" sub={`${FORMULAS.length} formulas from AMC 8 to AIME, plus calculus rounds.`} />
      <FormulaBrowser role="student" hrefFor={(f) => `/student/bank/${f.id}`} action={(f) => <DeckButton formulaId={f.id} />} />
    </div>
  );
}
