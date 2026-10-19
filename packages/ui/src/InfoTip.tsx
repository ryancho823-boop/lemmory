"use client";

import { useEffect, useRef, useState } from "react";
import { cx } from "./ui";

/** A small "[?]" link that reveals an explanation in a box. Closes on outside click or Escape. */
export function InfoTip({ title, children, align = "right", className }: { title?: string; children: React.ReactNode; align?: "left" | "right"; className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <span ref={ref} className={cx("relative inline-flex align-middle", className)}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        aria-label={title ? `About: ${title}` : "More info"}
        aria-expanded={open}
        className={cx("px-1 font-sans text-[13px] font-normal text-link hover:underline", open && "underline")}
      >
        [?]
      </button>
      {open && (
        <span
          role="dialog"
          className={cx(
            "absolute top-7 z-40 block w-72 border border-ink/40 bg-white p-4 text-left font-sans text-sm font-normal normal-case leading-relaxed tracking-normal text-ink/80",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {title && <span className="mb-1.5 block font-bold text-ink">{title}</span>}
          {children}
        </span>
      )}
    </span>
  );
}
