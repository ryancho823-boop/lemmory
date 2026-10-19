"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "./ui";

export interface NavItem {
  href: string;
  label: string;
  /** Only active on this exact path (plus `also`). */
  exact?: boolean;
  also?: string[];
  /** Marks the link "Due", e.g. today's cards aren't done. */
  dot?: boolean;
}

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <span
      className="grid place-items-center rounded-md bg-lemon font-extrabold text-ink"
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      Σ
    </span>
  );
}

export function Logo({ tag, light }: { tag?: string; light?: boolean }) {
  return (
    <span className={cx("flex items-center gap-2.5 text-lg font-extrabold tracking-tight", light && "text-white")}>
      <LogoMark />
      Lemmory
      {tag && <span className={cx("text-sm font-semibold tracking-normal", light ? "text-lemon" : "text-ink/45")}>{tag}</span>}
    </span>
  );
}

/** A sidebar link: plain text, with a soft highlight on the current page. `due` flags today's unfinished review. */
export function SideLink({ href, active, due, children }: { href: string; active?: boolean; due?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cx(
        "flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-[15px] transition-colors",
        active ? "bg-paper font-semibold text-ink" : "text-ink/75 hover:bg-paper/60 hover:text-ink",
      )}
    >
      {children}
      {due && <span className="text-xs font-semibold text-lemon-deep">Due</span>}
    </Link>
  );
}

/**
 * The product's frame: a white sidebar with plain links on desktop, and a top bar with a row
 * of links on phones. Adds class="product", which switches on the plain product look.
 */
export function Frame({
  home,
  tag,
  above,
  nav,
  below,
  mobileExtra,
  children,
}: {
  home: string;
  tag?: string;
  /** Shown above the links, e.g. a class switcher. */
  above?: React.ReactNode;
  nav: { href: string; label: string; active: boolean; due?: boolean }[];
  /** Pinned to the bottom of the sidebar: who's signed in, log out, demo controls. */
  below?: React.ReactNode;
  /** Extra controls in the phone top bar. */
  mobileExtra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="product min-h-screen bg-canvas lg:grid lg:grid-cols-[256px_minmax(0,1fr)]">
      <div className="hidden border-r border-line bg-white lg:block">
        <aside className="sticky top-0 flex h-screen flex-col overflow-y-auto px-4 py-5">
          <Link href={home} className="px-2">
            <Logo tag={tag} />
          </Link>
          {above && <div className="mt-6">{above}</div>}
          <nav className="mt-6 space-y-0.5">
            {nav.map((it) => (
              <SideLink key={it.href} href={it.href} active={it.active} due={it.due}>
                {it.label}
              </SideLink>
            ))}
          </nav>
          {below && <div className="mt-auto border-t border-line px-2 pt-4">{below}</div>}
        </aside>
      </div>

      <header className="sticky top-0 z-30 border-b border-line bg-white lg:hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href={home}>
            <Logo tag={tag} />
          </Link>
          <div className="ml-auto flex items-center gap-3 text-sm">{mobileExtra}</div>
        </div>
        {above && <div className="px-4 pb-2">{above}</div>}
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2 [scrollbar-width:none]">
          {nav.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              aria-current={it.active ? "page" : undefined}
              className={cx("shrink-0 rounded-lg px-3 py-1.5 text-sm", it.active ? "bg-paper font-semibold text-ink" : "text-ink/70")}
            >
              {it.label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 lg:py-10">{children}</main>
    </div>
  );
}

/** A plain top bar, for product pages that have no sidebar (like picking a plan). */
export function TopBar({ tag, home = "/", width = "max-w-5xl", children }: { tag?: string; home?: string; width?: string; children?: React.ReactNode }) {
  return (
    <header className="border-b border-line bg-white">
      <div className={cx("mx-auto flex items-center justify-between px-5 py-4 text-sm", width)}>
        <Link href={home}>
          <Logo tag={tag} />
        </Link>
        {children}
      </div>
    </header>
  );
}

/** The student and teacher apps: the product frame plus an Account group with Log out. */
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
  const logout = (
    <form action={onLogout}>
      <button className="text-sm font-semibold text-ink/60 hover:text-ink">Log out</button>
    </form>
  );

  return (
    <Frame
      home={nav[0]?.href ?? "/"}
      tag={tag}
      above={above}
      nav={nav.map((it) => ({ href: it.href, label: it.label, active: isActive(it), due: it.dot }))}
      below={
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0 text-sm">{footer}</div>
          {logout}
        </div>
      }
      mobileExtra={logout}
    >
      {children}
    </Frame>
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
        <div className="mt-8 rounded-3xl border border-line bg-white p-7">
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
