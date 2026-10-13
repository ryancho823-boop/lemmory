"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { LEVELS, LEVEL_LABEL, TOPICS, TOPIC_COLOR, type Level, type Topic } from "@lemmory/core/content/types";
import type { BankEntry } from "@lemmory/core/bank";
import { Tex } from "./Tex";
import { LevelTag, Segmented, cx } from "./ui";

type Scope = "all" | "assigned" | "deck" | "unassigned";

interface Props {
  /** The bank, easiest first (from `bankEntries()` on the server). */
  formulas: BankEntry[];
  role: "student" | "teacher";
  hrefFor: (f: BankEntry) => string;
  action?: (f: BankEntry) => React.ReactNode;
  /** Small note next to the name (e.g. "Week 2"). */
  meta?: (f: BankEntry) => React.ReactNode;
  /** Formula ids the class has been assigned. */
  assigned: string[];
  /** Formula ids in the student's deck. */
  deck?: string[];
}

/** Topic sidebar + compact rows grouped by topic. Shared by the student bank and the teacher's assign page. */
export function FormulaBrowser({ formulas: FORMULAS, role, hrefFor, action, meta, assigned: assignedIds, deck = [] }: Props) {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState<Topic | "All">(TOPICS[0]);
  const [level, setLevel] = useState<Level | "All">("All");
  const [scope, setScope] = useState<Scope>("all");
  const assigned = useMemo(() => new Set(assignedIds), [assignedIds]);
  const inDeck = useMemo(() => new Set(deck), [deck]);

  const inScope = (f: BankEntry) =>
    scope === "all" ||
    (scope === "assigned" && assigned.has(f.id)) ||
    (scope === "unassigned" && !assigned.has(f.id)) ||
    (scope === "deck" && inDeck.has(f.id));
  const needle = q.trim().toLowerCase();
  const matches = (f: BankEntry) =>
    inScope(f) &&
    (level === "All" || LEVELS.indexOf(f.level) <= LEVELS.indexOf(level)) &&
    (!needle || `${f.name} ${f.whenToUse} ${f.topic}`.toLowerCase().includes(needle));
  const visible = FORMULAS.filter((f) => matches(f) && (topic === "All" || f.topic === topic));
  const groups = TOPICS.map((t) => ({ topic: t, items: visible.filter((f) => f.topic === t) })).filter((g) => g.items.length);

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
          <TopicLink active={topic === "All"} onClick={() => setTopic("All")} count={FORMULAS.filter(matches).length}>
            All topics
          </TopicLink>
          {TOPICS.map((t) => (
            <TopicLink key={t} active={topic === t} onClick={() => setTopic(t)} color={TOPIC_COLOR[t]} count={FORMULAS.filter((f) => f.topic === t && matches(f)).length}>
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
              <span className="font-medium text-ink/40">{g.items.length}</span>
            </h2>
            <ul className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
              {g.items.map((f) => (
                <li key={f.id} className="flex items-center gap-4 px-4 py-3 hover:bg-canvas/60">
                  <Link href={hrefFor(f)} className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-semibold hover:underline">{f.name}</span>
                      <LevelTag level={f.level} />
                      <DifficultyMeter tier={f.tier} />
                      {meta && <span className="shrink-0 text-xs text-ink/45">{meta(f)}</span>}
                    </span>
                    <span className="mt-1 block truncate text-sm text-ink/60">
                      <Tex math={f.statement} />
                    </span>
                  </Link>
                  {action && <div className="shrink-0">{action(f)}</div>}
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
