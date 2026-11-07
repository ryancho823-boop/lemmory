"use client";

/** Prints the page. The parent form is the part a teacher needs on paper. */
export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="mt-4 inline-flex h-10 items-center rounded-lg border-2 border-ink px-4 font-semibold hover:bg-lemon print:hidden">
      Print this page
    </button>
  );
}
