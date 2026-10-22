import katex from "katex";

export function Tex({ math, display = false, className }: { math: string; display?: boolean; className?: string }) {
  const html = katex.renderToString(math, { displayMode: display, throwOnError: false });
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Text with inline `$...$` math. */
/** `display` sets fractions and sums at full size (still inline), for text worth reading closely. */
export function Rich({ text, className, display }: { text: string; className?: string; display?: boolean }) {
  const parts = text.split(/(\$[^$]+\$)/g);
  return (
    <span className={className}>
      {parts.map((p, i) =>
        p.startsWith("$") && p.endsWith("$") && p.length > 1 ? <Tex key={i} math={(display ? "\\displaystyle " : "") + p.slice(1, -1)} /> : <span key={i}>{p}</span>,
      )}
    </span>
  );
}
