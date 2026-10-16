"use client";

import { useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";
import { cx } from "./ui";

/** A circled "i" button that reveals an explanation in a small popover. Closes on outside click or Escape. */
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
        className={cx(
          "grid size-6 place-items-center rounded-full transition-colors",
          open ? "bg-ink text-white" : "text-ink/35 hover:bg-ink/5 hover:text-ink",
        )}
      >
        <Info size={15} />
      </button>
      {open && (
        <span
          role="dialog"
          className={cx(
            "rise absolute top-8 z-40 block w-72 rounded-2xl border border-line bg-white p-4 text-left font-sans text-sm font-normal normal-case leading-relaxed tracking-normal text-ink/65 shadow-[0_8px_24px_-12px_rgb(15_17_33/0.3)]",
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
