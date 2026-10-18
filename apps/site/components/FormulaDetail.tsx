// The demo's version of packages/ui/src/FormulaDetail.tsx.
// It uses the demo's own data (lib/), so the full formula bank and the database never reach the demo.

import { ChevronDown, Lightbulb, Sigma } from "lucide-react";
import { NOTES, type Formula } from "@/lib/bank";
import { Rich, Tex } from "@lemmory/ui/Tex";
import { LevelTag, Panel, TopicTag } from "@lemmory/ui/ui";

/** Header, statement, explanation with an expandable proof, when to use it, and an example. */
export function FormulaDetail({ f, aside, actions }: { f: Formula; aside?: React.ReactNode; actions?: React.ReactNode }) {
  const example = f.problems[0];
  const note = NOTES[f.id];
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <TopicTag topic={f.topic} />
        <LevelTag level={f.level} />
      </div>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <h1 className="text-[30px] font-extrabold leading-tight tracking-tight">{f.name}</h1>
        {actions}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_340px]">
        <div className="space-y-5">
          <Panel className="overflow-x-auto px-6 py-10 text-center text-xl">
            <Tex math={f.statement} display />
            <p className="mt-2 text-sm text-ink/60">
              <Rich text={f.setup} />
            </p>
          </Panel>

          <Panel className="p-6">
            <h2 className="text-sm font-bold">What it says</h2>
            <p className="mt-2 leading-relaxed text-ink/80">
              <Rich text={note.explain} />
            </p>
            <details className="group mt-5 rounded-xl border border-line">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold hover:bg-canvas">
                <span className="flex items-center gap-2">
                  <Sigma size={16} className="text-ink/50" /> Show proof
                </span>
                <ChevronDown size={16} className="text-ink/40 transition-transform group-open:rotate-180" />
              </summary>
              <p className="border-t border-line px-4 py-4 leading-relaxed text-ink/80">
                <Rich text={note.proof} />
              </p>
            </details>
          </Panel>

          <div className="flex gap-4 rounded-2xl bg-lemon-soft p-5">
            <Lightbulb className="mt-0.5 shrink-0 text-lemon-deep" size={20} />
            <div>
              <h2 className="text-sm font-bold">When to use it</h2>
              <p className="mt-1 leading-relaxed text-ink/80">
                <Rich text={f.whenToUse} />
              </p>
            </div>
          </div>

          <Panel className="p-5">
            <h2 className="text-sm font-bold">Example</h2>
            <p className="mt-2 leading-relaxed">
              <Rich text={example.text} />
            </p>
            <details className="group mt-3">
              <summary className="cursor-pointer text-sm font-semibold text-ink/50 hover:text-ink">Show solution</summary>
              <p className="mt-2 leading-relaxed text-ink/80">
                <Rich text={example.solution} /> <b>Answer:</b> <Tex math={example.answer} />
              </p>
            </details>
          </Panel>
        </div>
        <div className="space-y-5">{aside}</div>
      </div>
    </div>
  );
}
