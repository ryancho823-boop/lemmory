import Link from "next/link";
import { LEVEL_LABEL, TOPIC_COLOR, type Formula, type Topic } from "@/lib/bank";
import type { Stage } from "@/lib/srs";
import { InfoTip } from "./InfoTip";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <section className={cx("rounded-2xl border border-line bg-white", className)}>{children}</section>;
}

export function PanelHeader({ title, sub, info, action }: { title: string; sub?: React.ReactNode; info?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 px-5 pt-5">
      <div className="min-w-0">
        <h2 className="flex items-center gap-1 text-[17px] font-semibold">
          {title}
          {info && <InfoTip title={title} align="left">{info}</InfoTip>}
        </h2>
        {sub && <p className="mt-0.5 text-sm text-ink/70">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function PageHeader({ eyebrow, title, sub, info, action }: { eyebrow?: string; title: string; sub?: React.ReactNode; info?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="mb-1 text-sm text-ink/70">{eyebrow}</p>}
        <h1 className="flex items-center gap-1.5 text-[30px] font-extrabold leading-tight">
          {title}
          {info && <InfoTip title={title} align="left">{info}</InfoTip>}
        </h1>
        {sub && <p className="mt-1 text-ink/75">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

type BtnProps = { href?: string; onClick?: () => void; variant?: "primary" | "lemon" | "ghost" | "outline"; size?: "sm" | "md" | "lg"; className?: string; children: React.ReactNode; disabled?: boolean; type?: "button" | "submit" };

export function Button({ href, onClick, variant = "primary", size = "md", className, children, disabled, type = "button" }: BtnProps) {
  const cls = cx(
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all active:scale-[0.98] disabled:pointer-events-none disabled:opacity-35",
    size === "sm" && "h-8 px-3 text-sm",
    size === "md" && "h-10 px-4 text-sm",
    size === "lg" && "h-12 px-6 text-[15px]",
    variant === "primary" && "bg-ink text-white hover:bg-ink/85",
    variant === "lemon" && "bg-lemon text-ink shadow-[inset_0_-2px_0_rgb(0_0_0/0.12)] hover:brightness-105",
    variant === "ghost" && "text-ink/65 hover:bg-ink/5 hover:text-ink",
    variant === "outline" && "border border-line bg-white text-ink hover:border-ink/25",
    className,
  );
  return href ? (
    <Link href={href} className={cls}>
      {children}
    </Link>
  ) : (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}

export function TopicTag({ topic, className }: { topic: Topic; className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-1.5 text-xs font-medium text-ink/65", className)}>
      <span className="size-2 rounded-full" style={{ background: TOPIC_COLOR[topic] }} />
      {topic}
    </span>
  );
}

export function LevelTag({ level }: { level: Formula["level"] }) {
  return <span className="rounded-md bg-ink/5 px-1.5 py-0.5 text-[11px] font-semibold text-ink/55">{LEVEL_LABEL[level]}</span>;
}

export function StageTag({ stage, mastered }: { stage: Stage; mastered?: boolean }) {
  if (mastered) return <span className="rounded-full bg-good/10 px-2 py-0.5 text-[11px] font-bold text-good">Mastered</span>;
  return stage === "recall" ? (
    <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[11px] font-bold text-ink/60">Recall</span>
  ) : (
    <span className="rounded-full bg-lemon px-2 py-0.5 text-[11px] font-bold text-ink">Application</span>
  );
}

const AVATAR_TINTS = ["#dbeafe", "#fde2d3", "#d5f3e6", "#fdefc3", "#fbe0ec", "#d9f0d9", "#e2defa", "#fcdcdc"];
export function Avatar({ name, you, size = 32 }: { name: string; you?: boolean; size?: number }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return (
    <span
      className={cx("grid shrink-0 place-items-center rounded-full font-bold text-ink/75", you && "ring-2 ring-lemon ring-offset-2")}
      style={{ width: size, height: size, fontSize: size * 0.36, background: you ? "#ffd43b" : AVATAR_TINTS[h % AVATAR_TINTS.length] }}
    >
      {initials}
    </span>
  );
}

export function Stat({ label, value, hint, icon }: { label: string; value: React.ReactNode; hint?: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-4">
      <div className="flex items-center justify-between text-ink/50">
        <span className="text-xs font-semibold">{label}</span>
        {icon}
      </div>
      <div className="mt-2 text-[26px] font-extrabold leading-none tracking-tight tabular-nums">{value}</div>
      {hint && <div className="mt-1.5 text-xs text-ink/50">{hint}</div>}
    </div>
  );
}

export const pct = (x: number | null | undefined) => (x === null || x === undefined ? "–" : `${Math.round(x * 100)}%`);

export function Meter({ value, className }: { value: number | null; className?: string }) {
  const v = value ?? 0;
  const color = v >= 0.85 ? "var(--color-good)" : v >= 0.65 ? "var(--color-warn)" : "var(--color-bad)";
  return (
    <div className={cx("h-1.5 overflow-hidden rounded-full bg-ink/8", className)}>
      <div className="h-full rounded-full" style={{ width: `${v * 100}%`, background: color }} />
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx("animate-pulse rounded-2xl bg-ink/5", className)} />;
}

export function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { value: T; label: React.ReactNode }[]; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-xl bg-ink/5 p-1">
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cx(
            "rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors",
            value === o.value ? "bg-white text-ink shadow-sm" : "text-ink/55 hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function relDay(day: number, today: number) {
  const d = day - today;
  if (d === 0) return "Today";
  if (d === 1) return "Tomorrow";
  if (d === -1) return "Yesterday";
  return d > 0 ? `In ${d} days` : `${-d} days ago`;
}

/** One quiet row of headline numbers. Any extra detail sits behind an info button. */
export function StatStrip({ items }: { items: { label: string; value: React.ReactNode; hint?: React.ReactNode }[] }) {
  return (
    <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-line bg-white sm:flex sm:divide-x sm:divide-line">
      {items.map((it) => (
        <div key={it.label} className="flex-1 border-line px-5 py-4 [&:nth-child(-n+2)]:border-b sm:border-b-0">
          <p className="flex items-center gap-0.5 text-sm text-ink/70">
            {it.label}
            {it.hint && (
              <InfoTip title={it.label} align="left">
                {it.hint}
              </InfoTip>
            )}
          </p>
          <p className="mt-1 text-[28px] font-extrabold tabular-nums">{it.value}</p>
        </div>
      ))}
    </div>
  );
}

/** Topic as a soft tinted pill: reads as a label rather than a stray dot. */
export function TopicPill({ topic }: { topic: Topic }) {
  const c = TOPIC_COLOR[topic];
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ background: `color-mix(in srgb, ${c} 12%, white)`, color: `color-mix(in srgb, ${c} 75%, black)` }}
    >
      <span className="size-1.5 rounded-full" style={{ background: c }} />
      {topic}
    </span>
  );
}

/** Two-step progress: Recall, then Application (green once mastered). */
export function StageSteps({ stage, mastered }: { stage: Stage; mastered?: boolean }) {
  const filled = stage === "recall" ? 1 : 2;
  const color = mastered ? "var(--color-good)" : "var(--color-ink)";
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium text-ink/60">
      <span className="flex gap-0.5">
        {[1, 2].map((i) => (
          <span key={i} className="h-1.5 w-4 rounded-full" style={{ background: i <= filled ? color : "rgb(15 17 33 / 0.12)" }} />
        ))}
      </span>
      {mastered ? "Mastered" : stage === "recall" ? "Recall" : "Application"}
    </span>
  );
}
