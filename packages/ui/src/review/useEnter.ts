"use client";

import { useEffect, useRef } from "react";

/**
 * Enter runs `fn` while `on` is set, wherever focus is: after an answer box is disabled (a wrong
 * formula choice, "I don't remember"), nothing else listens for it, yet the card says "Press Enter".
 * An answer box that handles Enter itself marks the key as handled, so it isn't run twice.
 */
export function useEnter(on: boolean, fn: () => void) {
  const latest = useRef(fn);
  useEffect(() => {
    latest.current = fn;
  });
  useEffect(() => {
    if (!on) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || e.repeat || e.isComposing || e.defaultPrevented) return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("input, textarea, select, a")) return;
      // A focused button would also be clicked by Enter; this runs instead, once.
      e.preventDefault();
      latest.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [on]);
}
