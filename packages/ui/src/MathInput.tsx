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
/** Set once MathLive is in, so a box on a later card appears right away instead of a frame or two late. */
let ready = false;
function loadMathLive() {
  return (loader ??= import("mathlive").then(({ MathfieldElement }) => {
    MathfieldElement.fontsDirectory = "/mathlive/fonts";
    MathfieldElement.soundsDirectory = null;
    keepAboveKeyboard();
    ready = true;
  }));
}

/** On a phone or tablet, focusing a box opens the on-screen keyboard, so a card waits for a tap. */
const isTouch = () => window.matchMedia("(pointer: coarse)").matches;

/**
 * MathLive can believe a box has focus when nothing on the page does (after the window was in the
 * background, or with several boxes on a card), and then a click on a box leaves keystrokes going
 * nowhere. Once it's done with the click, check, and hand focus to the box's real input.
 */
function ensureFocus(el: MathfieldElement) {
  const take = () => {
    const sink = el.shadowRoot?.querySelector<HTMLElement>(".ML__keyboard-sink");
    if (sink && el.shadowRoot?.activeElement !== sink) sink.focus({ preventScroll: true });
  };
  take();
  // Again after MathLive's own focus step, which runs a moment later.
  setTimeout(take, 0);
}

/** Typing `x1` gives x₁, so a long formula doesn't need an arrow key after every subscript. */
const SHORTCUTS = {
  ...Object.fromEntries(
    ["a", "b", "c", "d", "n", "p", "q", "r", "s", "t", "x", "y", "z", "A", "B"].flatMap((v) => [0, 1, 2, 3, 4].map((i) => [`${v}${i}`, `${v}_${i}`])),
  ),
  cap: "\\cap",
  cup: "\\cup",
};

/**
 * `/` starts a fraction with the cursor in the denominator, and everything typed after it used to
 * stay there: `I+B/2-1` came out as I + B/(2-1). Read it the way a calculator does instead: the
 * denominator ends at the next + - = or *, or at a `)` that closes nothing, unless it's in
 * brackets (`a/(b+c)`). The toolbar's fraction button leaves the cursor alone. This listens to
 * `beforeinput`, so the on-screen keyboard follows the same rule.
 */
function endDenominators(el: MathfieldElement, fromToolbar: () => boolean) {
  let inside: { brackets: number; typed: number } | null = null;
  const onInput = (e: Event) => {
    const data = (e as InputEvent).data;
    if (typeof data !== "string") return;
    if (data.startsWith("\\frac{#@}")) {
      inside = fromToolbar() ? null : { brackets: 0, typed: 0 };
      return;
    }
    if (!inside) return;
    if (data === "(") inside.brackets++;
    else if (data === ")" && inside.brackets > 0) inside.brackets--;
    else if (inside.brackets === 0 && inside.typed > 0 && (data === ")" || /^\s*([+\-=*]|\\cdot|\\times)\s*$/.test(data))) {
      el.executeCommand("moveAfterParent");
      inside = null;
      return;
    }
    inside.typed++;
  };
  // The cursor moved somewhere else, so whatever comes next isn't the end of that denominator.
  const forget = () => (inside = null);
  const onKey = (e: KeyboardEvent) => {
    if (/^(Arrow|Tab|Home|End|Backspace|Delete)/.test(e.key)) forget();
  };
  el.addEventListener("beforeinput", onInput);
  el.addEventListener("keydown", onKey, { capture: true });
  el.addEventListener("pointerdown", forget);
  return () => {
    el.removeEventListener("beforeinput", onInput);
    el.removeEventListener("keydown", onKey, { capture: true });
    el.removeEventListener("pointerdown", forget);
  };
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
  /** Types a toolbar symbol into the field, as if its button had been clicked. */
  insert: (latex: string) => void;
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
  const [loaded, setLoaded] = useState(ready);
  const mf = useRef<MathfieldElement>(null);
  const toolbarInsert = useRef(false);
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
    el.inlineShortcuts = { ...el.inlineShortcuts, ...SHORTCUTS };
    if (placeholder) el.placeholder = placeholder;
    const stopTracking = endDenominators(el, () => toolbarInsert.current);
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
    if (autoFocus && !isTouch()) {
      requestAnimationFrame(() => {
        // Already in a box: the frame came late (a background tab), and the click wins.
        if (document.activeElement?.tagName === "MATH-FIELD") return;
        // MathLive scrolls to a box it focuses, which would open a card partway down the page.
        const top = window.scrollY;
        el.focus();
        window.scrollTo({ top });
        ensureFocus(el);
      });
    }
    return () => {
      stopTracking();
      el.removeEventListener("focus", onFocusIn);
      el.removeEventListener("input", onInput);
      el.removeEventListener("keydown", onKey, { capture: true });
    };
  }, [loaded, autoFocus, placeholder]);

  useEffect(() => {
    const el = mf.current;
    if (!el) return;
    el.readOnly = !!disabled;
    // Once answered, let go of the box: the on-screen keyboard closes and the result is in view.
    if (disabled) {
      el.blur();
      window.mathVirtualKeyboard?.hide();
    }
  }, [disabled, loaded]);

  // The next card shouldn't open under a keyboard left over from this one.
  useEffect(() => () => window.mathVirtualKeyboard?.hide(), []);

  const insert = (latex: string) => {
    toolbarInsert.current = true;
    mf.current?.insert(latex, { focus: true, selectionMode: "placeholder" });
    toolbarInsert.current = false;
    if (mf.current) onChange(mf.current.value);
  };

  useImperativeHandle(ref, () => ({
    focus: () => mf.current?.focus(),
    insert,
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
      <div
        className={`rounded-2xl border-2 px-4 py-2.5 transition-all ${ring}`}
        // MathLive keeps its own focus events to itself, so this is how the card learns which box is in use.
        onFocusCapture={() => cb.current.onFocus?.()}
        onPointerDown={() => {
          if (disabled || !mf.current) return;
          cb.current.onFocus?.();
          ensureFocus(mf.current);
        }}
        // The box's padding isn't the field: a click there would otherwise just take focus away.
        onMouseDown={(e) => {
          if (e.target === mf.current || disabled) return;
          e.preventDefault();
          mf.current?.focus();
        }}
      >
        {loaded ? (
          <math-field ref={mf} className="block w-full text-xl outline-none" />
        ) : (
          <div className="h-9 animate-pulse rounded-lg bg-ink/5" />
        )}
      </div>
      {tools && !disabled && <MathToolbar onInsert={insert} />}
    </div>
  );
});

/** The symbol buttons. Cards with several boxes show one, in a fixed place below all of them. */
export function MathToolbar({ onInsert }: { onInsert: (latex: string) => void }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {TOOLS.map((t) => (
        <button
          key={t.label}
          type="button"
          title={t.label}
          aria-label={`Insert ${t.label}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => onInsert(t.insert)}
          className="h-8 min-w-9 rounded-lg border border-line bg-white px-2 text-[13px] text-ink/75 transition-colors hover:border-ink/30 hover:bg-canvas"
        >
          <Tex math={t.latex} />
        </button>
      ))}
    </div>
  );
}
