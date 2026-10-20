import { ChevronDown, Lightbulb, Sigma } from "lucide-react";
import type { Formula } from "@lemmory/core/formulas";
import { NOTES } from "@lemmory/core/content/notes";
import { Rich, Tex } from "./Tex";
import { LevelTag, Panel, TopicTag } from "./ui";
import { Figure } from "./Figure";

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
            {f.figure && <Figure figure={f.figure} className="mx-auto mt-6 h-auto w-full max-w-[300px]" />}
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
            {example.figure && <Figure figure={example.figure} className="mt-3 h-auto w-full max-w-[240px]" />}
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
