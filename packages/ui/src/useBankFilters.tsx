"use client";

import { useEffect, useRef, useState } from "react";
import { LEVELS, TOPICS, type Level, type Topic } from "@lemmory/core/content/types";

export type Scope = "all" | "assigned" | "deck" | "unassigned";

const SCOPES: Scope[] = ["all", "assigned", "deck", "unassigned"];

/**
 * The formula bank's filters (topic, level, scope, search), kept in the page's URL. Opening a
 * formula and pressing Back lands on the same topic and filters instead of the first topic.
 */
export function useBankFilters() {
  const [topic, setTopic] = useState<Topic | "All">(TOPICS[0]);
  const [level, setLevel] = useState<Level | "All">("All");
  const [scope, setScope] = useState<Scope>("all");
  const [q, setQ] = useState("");
  const loaded = useRef(false);

  // Read the filters back from the URL. Only the browser knows the URL, so this runs after mount.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const t = p.get("topic"), l = p.get("level"), s = p.get("scope");
    /* eslint-disable react-hooks/set-state-in-effect -- the URL is only known in the browser */
    if (t === "All" || TOPICS.includes(t as Topic)) setTopic(t as Topic | "All");
    if (LEVELS.includes(l as Level)) setLevel(l as Level);
    if (SCOPES.includes(s as Scope)) setScope(s as Scope);
    if (p.get("q")) setQ(p.get("q")!.slice(0, 100));
    /* eslint-enable react-hooks/set-state-in-effect */
    loaded.current = true;
  }, []);

  // Write them back without adding history entries, so Back still leaves the bank.
  useEffect(() => {
    if (!loaded.current) return;
    const url = new URL(window.location.href);
    const set = (k: string, v: string, fallback: string) => (v === fallback ? url.searchParams.delete(k) : url.searchParams.set(k, v));
    set("topic", topic, TOPICS[0]);
    set("level", level, "All");
    set("scope", scope, "all");
    set("q", q.trim(), "");
    if (url.href !== window.location.href) history.replaceState(history.state, "", url);
  }, [topic, level, scope, q]);

  return { topic, setTopic, level, setLevel, scope, setScope, q, setQ };
}
