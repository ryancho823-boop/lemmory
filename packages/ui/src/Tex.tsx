import katex from "katex";

export function Tex({ math, display = false, className }: { math: string; display?: boolean; className?: string }) {
  const html = katex.renderToString(math, { displayMode: display, throwOnError: false });
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** Text with inline `$...$` math. */
export function Rich({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\$[^$]+\$)/g);
  return (
    <span className={className}>
      {parts.map((p, i) =>
        p.startsWith("$") && p.endsWith("$") && p.length > 1 ? <Tex key={i} math={p.slice(1, -1)} /> : <span key={i}>{p}</span>,
      )}
    </span>
  );
}
