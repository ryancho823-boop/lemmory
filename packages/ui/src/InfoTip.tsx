"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cx } from "./ui";

const WIDTH = 288;
const GAP = 8;

/**
 * A small "[?]" link that reveals an explanation in a box. Closes on outside click or Escape,
 * and follows the [?] when the page scrolls. The box is drawn on top of the page (not inside the
 * card), so a card that hides its overflow can't cut it off, and it's kept inside the window.
 */
export function InfoTip({ title, children, align = "right", className }: { title?: string; children: React.ReactNode; align?: "left" | "right"; className?: string }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const button = useRef<HTMLButtonElement>(null);
  const box = useRef<HTMLSpanElement>(null);

  // Placed once the box is in the page (so its height is known), before it's shown.
  const place = () => {
    if (!button.current) return;
    const r = button.current.getBoundingClientRect();
    const width = Math.min(WIDTH, window.innerWidth - 2 * GAP);
    const wanted = align === "right" ? r.right - width : r.left;
    const left = Math.max(GAP, Math.min(wanted, window.innerWidth - width - GAP));
    // Below the [?], or above it when there isn't room below.
    const height = box.current?.offsetHeight ?? 0;
    const below = r.bottom + 6;
    const top = below + height > window.innerHeight - GAP && r.top - height - 6 > GAP ? r.top - height - 6 : below;
    setPos({ top, left });
  };
  useLayoutEffect(() => {
    if (open) place();
    else setPos(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- place reads the current layout
  }, [open, align]);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !button.current?.contains(e.target as Node) && !box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- place reads the current layout
  }, [open]);

  return (
    <span className={cx("inline-flex align-middle", className)}>
      <button
        ref={button}
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
      {open &&
        createPortal(
          <span
            ref={box}
            role="dialog"
            style={{ top: pos?.top ?? 0, left: pos?.left ?? 0, width: `min(${WIDTH}px, calc(100vw - ${2 * GAP}px))`, visibility: pos ? "visible" : "hidden" }}
            className="fixed z-50 block border border-ink/40 bg-white p-4 text-left font-sans text-sm font-normal normal-case leading-relaxed tracking-normal text-ink/80 shadow-sm"
          >
            {title && <span className="mb-1.5 block font-bold text-ink">{title}</span>}
            {children}
          </span>,
          document.body,
        )}
    </span>
  );
}
