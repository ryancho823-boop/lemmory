"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { MathfieldElement } from "mathlive";
import { Tex } from "./Tex";

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "math-field": React.DetailedHTMLProps<React.HTMLAttributes<MathfieldElement>, MathfieldElement>;
    }
  }
}

let loader: Promise<unknown> | null = null;
function loadMathLive() {
  return (loader ??= import("mathlive").then(({ MathfieldElement }) => {
    MathfieldElement.fontsDirectory = "/mathlive/fonts";
    MathfieldElement.soundsDirectory = null;
    keepAboveKeyboard();
  }));
}

/** Room below the answer box for the math toolbar and the Check / Continue buttons. */
const BELOW = 150;

/**
 * On phones and tablets the on-screen math keyboard slides up over the bottom of the page. While
 * it's open, add that much space under the page and scroll the answer box, with the buttons under
 * it, above the keyboard.
 */
function keepAboveKeyboard() {
  const kb = window.mathVirtualKeyboard;
  kb.addEventListener("geometrychange", () => {
    const h = kb.visible ? kb.boundingRect.height : 0;
    document.body.style.paddingBottom = h ? `${h}px` : "";
    const field = document.activeElement;
    if (!h || field?.tagName !== "MATH-FIELD") return;
    const overlap = field.getBoundingClientRect().bottom + BELOW - (window.innerHeight - h);
    if (overlap > 0) window.scrollBy({ top: overlap, behavior: "smooth" });
  });
}

export interface MathInputHandle {
  focus: () => void;
  clear: () => void;
}

const TOOLS: { label: string; latex: string; insert: string }[] = [
  { label: "fraction", latex: "\\frac{a}{b}", insert: "\\frac{#@}{#?}" },
  { label: "square root", latex: "\\sqrt{x}", insert: "\\sqrt{#0}" },
  { label: "power", latex: "x^n", insert: "#@^{#?}" },
  { label: "subscript", latex: "x_1", insert: "#@_{#?}" },
  { label: "binomial", latex: "\\tbinom{n}{k}", insert: "\\binom{#0}{#?}" },
  { label: "factorial", latex: "n!", insert: "!" },
  { label: "sine", latex: "\\sin", insert: "\\sin " },
  { label: "cosine", latex: "\\cos", insert: "\\cos " },
  { label: "pi", latex: "\\pi", insert: "\\pi" },
  { label: "natural log", latex: "\\ln", insert: "\\ln " },
  { label: "e", latex: "e", insert: "e" },
  { label: "absolute value", latex: "|x|", insert: "\\left|#0\\right|" },
  { label: "floor", latex: "\\lfloor x\\rfloor", insert: "\\left\\lfloor#0\\right\\rfloor" },
];

interface Props {
  onChange: (latex: string) => void;
  /** Receives the field's current value, which may be newer than the last onChange render. */
  onEnter?: (latex: string) => void;
  onFocus?: () => void;
  disabled?: boolean;
  tools?: boolean;
  autoFocus?: boolean;
  placeholder?: string;
  state?: "idle" | "right" | "wrong" | "typo";
}

/** Desmos-style math input: type `/` for a fraction, `sqrt` for a root, `^` for powers. No LaTeX needed. */
export const MathInput = forwardRef<MathInputHandle, Props>(function MathInput(
  { onChange, onEnter, onFocus, disabled, tools = true, autoFocus, placeholder, state = "idle" },
  ref,
) {
  const [loaded, setLoaded] = useState(false);
  const mf = useRef<MathfieldElement>(null);
  const cb = useRef({ onChange, onEnter, onFocus });
  useEffect(() => {
    cb.current = { onChange, onEnter, onFocus };
  });

  useEffect(() => {
    let live = true;
    loadMathLive().then(() => live && setLoaded(true));
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    const el = mf.current;
    if (!loaded || !el) return;
    el.mathVirtualKeyboardPolicy = "auto";
    el.smartFence = true;
    el.menuItems = [];
    if (placeholder) el.placeholder = placeholder;
    const onInput = () => cb.current.onChange(el.value);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        cb.current.onEnter?.(el.value);
      }
    };
    const onFocusIn = () => cb.current.onFocus?.();
    el.addEventListener("focus", onFocusIn);
    el.addEventListener("input", onInput);
    el.addEventListener("keydown", onKey, { capture: true });
    if (autoFocus) requestAnimationFrame(() => el.focus());
    return () => {
      el.removeEventListener("focus", onFocusIn);
      el.removeEventListener("input", onInput);
      el.removeEventListener("keydown", onKey, { capture: true });
    };
  }, [loaded, autoFocus, placeholder]);

  useEffect(() => {
    if (mf.current) mf.current.readOnly = !!disabled;
  }, [disabled, loaded]);

  useImperativeHandle(ref, () => ({
    focus: () => mf.current?.focus(),
    clear: () => {
      if (mf.current) mf.current.value = "";
      onChange("");
    },
  }));

  const ring =
    state === "right"
      ? "border-good bg-good/5"
      : state === "wrong"
        ? "border-bad bg-bad/5"
        : state === "typo"
          ? "border-warn bg-warn/5 focus-within:shadow-[0_0_0_4px_rgb(250_178_25/0.3)]"
        : "border-line bg-white focus-within:border-ink focus-within:shadow-[0_0_0_4px_rgb(255_212_59/0.35)]";

  return (
    <div className="w-full">
      <div className={`rounded-2xl border-2 px-4 py-2.5 transition-all ${ring}`}>
        {loaded ? (
          <math-field ref={mf} className="block w-full text-xl outline-none" />
        ) : (
          <div className="h-9 animate-pulse rounded-lg bg-ink/5" />
        )}
      </div>
      {tools && !disabled && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {TOOLS.map((t) => (
            <button
              key={t.label}
              type="button"
              title={t.label}
              aria-label={`Insert ${t.label}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                mf.current?.insert(t.insert, { focus: true, selectionMode: "placeholder" });
                if (mf.current) onChange(mf.current.value);
              }}
              className="h-8 min-w-9 rounded-lg border border-line bg-white px-2 text-[13px] text-ink/75 transition-colors hover:border-ink/30 hover:bg-canvas"
            >
              <Tex math={t.latex} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
