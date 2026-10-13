"use client";

import { useEffect } from "react";

/**
 * Fades and lifts every `[data-reveal]` element into place the first time it scrolls into view.
 * Stagger siblings with `style={{ "--d": "120ms" }}`. Without JS, nothing is ever hidden.
 */
export function ScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-revealed");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.1 },
    );
    els.forEach((el) => io.observe(el));
    document.documentElement.classList.add("reveal-on");
    return () => io.disconnect();
  }, []);
  return null;
}
