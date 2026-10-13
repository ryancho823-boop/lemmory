"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Lock, Search } from "lucide-react";
import {
  FORMULAS,
  LEVELS,
  LEVEL_LABEL,
  LOCKED,
  TOPICS,
  TOPIC_COLOR,
  TOTAL_FORMULAS,
  type Formula,
  type Level,
  type LockedFormula,
  type Topic,
  byDifficulty,
  difficultyTier,
} from "@/lib/bank";
import { useStore } from "@/lib/store";
import { Tex } from "./Tex";
import { LevelTag, Segmented, cx } from "./ui";

type Scope = "all" | "assigned" | "deck" | "unassigned";

interface Props {
  role: "student" | "teacher";
  hrefFor: (f: Formula) => string;
  action?: (f: Formula) => React.ReactNode;
  /** Small note next to the name (e.g. "Week 2"). */
  meta?: (f: Formula) => React.ReactNode;
}

/** Topic sidebar + compact rows grouped by topic. Shared by the student bank and the teacher's assign page. */
export function FormulaBrowser({ role, hrefFor, action, meta }: Props) {
  const { state } = useStore();
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState<Topic | "All">(TOPICS[0]);
  const [level, setLevel] = useState<Level | "All">("All");
  const [scope, setScope] = useState<Scope>("all");
  const assigned = useMemo(() => new Set(state.assignments.map((a) => a.formulaId)), [state.assignments]);

  const inScope = (f: Formula) =>
    scope === "all" ||
    (scope === "assigned" && assigned.has(f.id)) ||
    (scope === "unassigned" && !assigned.has(f.id)) ||
    (scope === "deck" && !!state.cards[f.id]);
  const needle = q.trim().toLowerCase();
  const matches = (f: Formula) =>
    inScope(f) &&
    (level === "All" || LEVELS.indexOf(f.level) <= LEVELS.indexOf(level)) &&
    (!needle || `${f.name} ${f.whenToUse} ${f.topic}`.toLowerCase().includes(needle));
  const visible = FORMULAS.filter((f) => matches(f) && (topic === "All" || f.topic === topic)).sort(byDifficulty);
  // The rest of the bank shows as locked names, only when browsing everything.
  const lockedMatches = (f: LockedFormula) =>
    scope === "all" &&
    (level === "All" || LEVELS.indexOf(f.level) <= LEVELS.indexOf(level)) &&
    (!needle || `${f.name} ${f.topic}`.toLowerCase().includes(needle));
  const locked = LOCKED.filter((f) => lockedMatches(f) && (topic === "All" || f.topic === topic)).sort(byDifficulty);
  const count = (t?: Topic) =>
    FORMULAS.filter((f) => matches(f) && (!t || f.topic === t)).length + LOCKED.filter((f) => lockedMatches(f) && (!t || f.topic === t)).length;
  const groups = TOPICS.map((t) => ({
    topic: t,
    items: visible.filter((f) => f.topic === t),
    locked: locked.filter((f) => f.topic === t),
  })).filter((g) => g.items.length || g.locked.length);

  const scopes =
    role === "student"
      ? [
          { value: "all" as Scope, label: "All" },
          { value: "assigned" as Scope, label: "Assigned" },
          { value: "deck" as Scope, label: "In my deck" },
        ]
      : [
          { value: "all" as Scope, label: "All" },
          { value: "assigned" as Scope, label: "Assigned" },
          { value: "unassigned" as Scope, label: "Not assigned" },
        ];

  return (
    <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
      {/* Topic sidebar */}
      <aside className="lg:sticky lg:top-8 lg:self-start">
        <nav className="-mx-1 flex gap-1 overflow-x-auto pb-1 lg:mx-0 lg:flex-col lg:overflow-visible">
          <TopicLink active={topic === "All"} onClick={() => setTopic("All")} count={count()}>
            All topics
          </TopicLink>
          {TOPICS.map((t) => (
            <TopicLink key={t} active={topic === t} onClick={() => setTopic(t)} color={TOPIC_COLOR[t]} count={count(t)}>
              {t}
            </TopicLink>
          ))}
        </nav>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value as Level | "All")}
          aria-label="Contest level"
          className="mt-4 hidden h-9 w-full rounded-xl border border-line bg-white px-3 text-sm font-medium lg:block"
        >
          <option value="All">All levels</option>
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l === "Calculus" ? "With calc rounds" : `Up to ${LEVEL_LABEL[l]}`}
            </option>
          ))}
        </select>
      </aside>

      <div className="min-w-0">
        <Link
          href="/users#pricing"
          className="mb-4 flex items-center gap-3 rounded-2xl border border-lemon/60 bg-lemon-soft px-4 py-3 text-sm hover:border-lemon-deep/50"
        >
          <Lock size={16} className="shrink-0 text-lemon-deep" />
          <span className="min-w-0 flex-1 text-ink/75">
            <b className="text-ink">The demo includes {FORMULAS.length} of {TOTAL_FORMULAS} formulas.</b> The rest come with every plan.
          </span>
          <ArrowRight size={15} className="shrink-0 text-ink/40" />
        </Link>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Segmented value={scope} onChange={setScope} options={scopes} />
          <label className="relative sm:ml-auto sm:w-64">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              aria-label="Search formulas"
              className="h-10 w-full rounded-xl border border-line bg-white pl-9 pr-3 text-sm outline-none focus:border-ink/40"
            />
          </label>
        </div>

        {groups.length === 0 && <p className="mt-10 text-center text-ink/50">No formulas match.</p>}
        {groups.map((g) => (
          <section key={g.topic} className="mt-6">
            <h2 className="mb-2 flex items-center gap-2 text-sm font-bold">
              <span className="size-2.5 rounded-full" style={{ background: TOPIC_COLOR[g.topic] }} />
              {g.topic}
              <span className="font-medium text-ink/40">{g.items.length + g.locked.length}</span>
            </h2>
            <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
              {g.items.map((f) => (
                <li key={f.id} className="flex items-center gap-4 px-4 py-3 hover:bg-canvas/60">
                  <Link href={hrefFor(f)} className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-semibold hover:underline">{f.name}</span>
                      <LevelTag level={f.level} />
                      <DifficultyMeter tier={difficultyTier(f)} />
                      {meta && <span className="shrink-0 text-xs text-ink/45">{meta(f)}</span>}
                    </span>
                    <span className="mt-1 block truncate text-sm text-ink/60">
                      <Tex math={f.statement} />
                    </span>
                  </Link>
                  {action && <div className="shrink-0">{action(f)}</div>}
                </li>
              ))}
              {g.locked.map((f) => (
                <li key={f.id} className="flex items-center gap-4 bg-canvas/40 px-4 py-3" title="In the full version">
                  <span className="flex min-w-0 flex-1 items-center gap-2 text-ink/40">
                    <span className="truncate font-semibold">{f.name}</span>
                    <LevelTag level={f.level} />
                    <DifficultyMeter tier={difficultyTier(f)} />
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5 text-xs font-semibold text-ink/35">
                    <Lock size={13} /> Full version
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function DifficultyMeter({ tier }: { tier: number }) {
  return (
    <span className="flex shrink-0 items-end gap-[2px]" title={`Difficulty ${tier} of 5`} aria-label={`Difficulty ${tier} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={cx("w-[3px] rounded-full", i <= tier ? "bg-ink/60" : "bg-ink/12")} style={{ height: 4 + i * 2 }} />
      ))}
    </span>
  );
}

function TopicLink({ active, onClick, color, count, children }: { active: boolean; onClick: () => void; color?: string; count: number; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors",
        active ? "bg-ink text-white" : "text-ink/65 hover:bg-ink/5 hover:text-ink",
      )}
    >
      {color ? <span className="size-2 shrink-0 rounded-full" style={{ background: color }} /> : <span className="size-2" />}
      <span className="flex-1">{children}</span>
      <span className={cx("text-xs tabular-nums", active ? "text-white/60" : "text-ink/35")}>{count}</span>
    </button>
  );
}
