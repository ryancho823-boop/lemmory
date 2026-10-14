"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, type LucideIcon } from "lucide-react";
import { cx } from "./ui";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Only active on this exact path (plus `also`). */
  exact?: boolean;
  also?: string[];
  /** A small dot, e.g. "today's cards aren't done". */
  dot?: boolean;
}

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <span
      className="grid place-items-center rounded-[10px] bg-lemon font-extrabold text-ink shadow-[inset_0_-2px_0_rgb(0_0_0/0.15)]"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      Σ
    </span>
  );
}

export function Logo({ tag }: { tag?: string }) {
  return (
    <span className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight">
      <LogoMark />
      Lemmory
      {tag && <span className="rounded-md bg-ink/5 px-1.5 py-0.5 text-[11px] font-bold tracking-normal text-ink/50">{tag}</span>}
    </span>
  );
}

/** Sidebar on desktop, top bar with scrolling tabs on mobile. */
export function Shell({
  tag,
  nav,
  above,
  footer,
  onLogout,
  children,
}: {
  tag: string;
  nav: NavItem[];
  /** Shown above the nav, e.g. a class switcher. */
  above?: React.ReactNode;
  /** Who's signed in. */
  footer: React.ReactNode;
  onLogout: () => Promise<void>;
  children: React.ReactNode;
}) {
  const path = usePathname();
  const isActive = (it: NavItem) =>
    it.exact ? path === it.href || !!it.also?.includes(path) : path === it.href || path.startsWith(it.href + "/");
  const home = nav[0]?.href ?? "/";

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[256px_minmax(0,1fr)]">
      <div className="hidden border-r border-line bg-white lg:block">
        <aside className="sticky top-0 flex h-screen flex-col px-4 py-5">
          <Link href={home} className="px-2">
            <Logo tag={tag} />
          </Link>
          {above && <div className="mt-6">{above}</div>}
          <nav className="mt-6 space-y-0.5">
            {nav.map((it) => {
              const active = isActive(it);
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className={cx(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                    active ? "bg-ink text-white" : "text-ink/60 hover:bg-ink/5 hover:text-ink",
                  )}
                >
                  <it.icon size={18} strokeWidth={2.2} />
                  {it.label}
                  {it.dot && <span className={cx("ml-auto size-2 rounded-full", active ? "bg-lemon" : "bg-lemon-deep")} />}
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto flex items-center gap-2 rounded-xl px-2 py-1">
            <div className="flex min-w-0 flex-1 items-center gap-3">{footer}</div>
            <form action={onLogout}>
              <button aria-label="Log out" title="Log out" className="rounded-lg p-2 text-ink/40 hover:bg-ink/5 hover:text-ink">
                <LogOut size={16} />
              </button>
            </form>
          </div>
        </aside>
      </div>

      <header className="sticky top-0 z-30 border-b border-line bg-white/90 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href={home}>
            <Logo tag={tag} />
          </Link>
          <form action={onLogout} className="ml-auto">
            <button aria-label="Log out" className="rounded-lg p-1.5 text-ink/50 hover:bg-ink/5">
              <LogOut size={18} />
            </button>
          </form>
        </div>
        {above && <div className="px-4 pb-2">{above}</div>}
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2">
          {nav.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={cx(
                "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold",
                isActive(it) ? "bg-ink text-white" : "text-ink/60",
              )}
            >
              <it.icon size={15} />
              {it.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 lg:py-10">{children}</main>
    </div>
  );
}

/**
 * The Teacher | Student switch at the top of the sign-up page. Teachers and students sign
 * up on different sites, so each side is a link to the other site's sign-up page.
 */
export function RoleToggle({ current, teacherHref, studentHref }: { current: "teacher" | "student"; teacherHref: string; studentHref: string }) {
  const option = (role: "teacher" | "student", label: string, href: string) =>
    role === current ? (
      <span aria-current="page" className="rounded-lg bg-white px-3 py-1.5 text-center text-sm font-semibold text-ink shadow-sm">
        {label}
      </span>
    ) : (
      <a href={href} className="rounded-lg px-3 py-1.5 text-center text-sm font-semibold text-ink/60 hover:text-ink">
        {label}
      </a>
    );
  return (
    <div className="grid grid-cols-2 rounded-xl bg-ink/5 p-1" role="group" aria-label="I'm signing up as">
      {option("teacher", "Teacher", teacherHref)}
      {option("student", "Student", studentHref)}
    </div>
  );
}

/** Centered card for sign-in and sign-up pages. `top` sits above the title (e.g. a RoleToggle). */
export function AuthFrame({
  tag,
  title,
  sub,
  top,
  children,
  foot,
}: {
  tag?: string;
  title: string;
  sub?: React.ReactNode;
  top?: React.ReactNode;
  children: React.ReactNode;
  foot?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo tag={tag} />
        </div>
        <div className="mt-8 rounded-3xl border border-line bg-white p-7 shadow-[0_30px_70px_-40px_rgb(15_17_33/0.35)]">
          {top && <div className="mb-6">{top}</div>}
          <h1 className="text-2xl font-extrabold">{title}</h1>
          {sub && <p className="mt-1 text-ink/75">{sub}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {foot && <div className="mt-5 space-y-1 text-center text-sm text-ink/70">{foot}</div>}
      </div>
    </div>
  );
}

export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  error,
  hint,
  className,
  ...rest
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  error?: string;
  hint?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "type" | "defaultValue">) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        aria-invalid={!!error}
        className={cx(
          "mt-1.5 h-11 w-full rounded-xl border bg-white px-3.5 text-[15px] outline-none transition-shadow focus:border-ink focus:shadow-[0_0_0_4px_rgb(255_212_59/0.35)]",
          error ? "border-bad" : "border-line",
          className,
        )}
        {...rest}
      />
      {error ? <span className="mt-1 block text-xs font-semibold text-bad">{error}</span> : hint && <span className="mt-1 block text-xs text-ink/45">{hint}</span>}
    </label>
  );
}
