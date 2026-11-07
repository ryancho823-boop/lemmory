"use client";

/** Prints the page, for forms that need a signature. */
export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="mt-4 inline-flex h-10 items-center rounded-lg border-2 border-ink px-4 font-semibold hover:bg-lemon print:hidden">
      Print this form
    </button>
  );
}
