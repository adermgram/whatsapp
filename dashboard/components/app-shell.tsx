"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import type { ReactNode } from "react";
import useSWR from "swr";
import { api, fetcher } from "@/lib/api";
import type { Me } from "@/lib/types";
import { cx } from "@/components/ui";

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

const NAV = [
  { href: "/", label: "Overview", icon: "M3 11l9-8 9 8M5 10v10h14V10" },
  { href: "/products", label: "Products", icon: "M20 7l-8-4-8 4m16 0v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4" },
  { href: "/settings", label: "Settings", icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z" },
];

/**
 * The menu. It is the only part that needs the current URL (to highlight where you are), and with Next.js'
 * cache components that must sit behind <Suspense> so the rest of the page can still be prepared in advance.
 */
function NavLinks({ variant }: { variant: "side" | "bottom" }) {
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  return NAV.map((n) => (
    <NavLink key={n.href} item={n} variant={variant} active={isActive(n.href)} />
  ));
}

function NavLink({ item, variant, active }: { item: (typeof NAV)[number]; variant: "side" | "bottom"; active: boolean }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={
        variant === "side"
          ? cx("flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium", active ? "bg-brand-soft text-brand" : "text-muted hover:bg-bg hover:text-ink")
          : cx("flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-medium", active ? "text-brand" : "text-muted")
      }
    >
      <Icon d={item.icon} />
      {item.label}
    </Link>
  );
}

/** What shows for a split second before the current page is known: the same links, none highlighted. */
function NavFallback({ variant }: { variant: "side" | "bottom" }) {
  return NAV.map((n) => <NavLink key={n.href} item={n} variant={variant} active={false} />);
}

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { data: me } = useSWR<Me>("/auth/me", fetcher);

  async function logout() {
    await api("/auth/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-dvh lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-line bg-surface p-4 lg:flex">
        <div className="mb-6 flex items-center gap-3 px-2">
          <div className="grid size-9 place-items-center rounded-xl bg-brand font-bold text-on-brand" aria-hidden>
            {(me?.businessName ?? "S").slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{me?.businessName ?? "…"}</p>
            <p className="truncate text-xs text-muted">{me?.email}</p>
          </div>
        </div>
        <nav aria-label="Main" className="flex flex-1 flex-col gap-1">
          <Suspense fallback={<NavFallback variant="side" />}>
            <NavLinks variant="side" />
          </Suspense>
        </nav>
        <button onClick={logout} className="min-h-11 rounded-lg px-3 text-left text-sm text-muted hover:bg-bg hover:text-ink">
          Log out
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Phone header */}
        <header className="flex items-center justify-between border-b border-line bg-surface px-4 py-3 lg:hidden">
          <p className="truncate text-sm font-semibold">{me?.businessName ?? "Shop dashboard"}</p>
          <button onClick={logout} className="min-h-11 px-2 text-sm text-muted">
            Log out
          </button>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-28 pt-5 sm:px-6 lg:pb-10 lg:pt-8">{children}</main>

        {/* Phone bottom tab bar */}
        <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-line bg-surface lg:hidden">
          <Suspense fallback={<NavFallback variant="bottom" />}>
            <NavLinks variant="bottom" />
          </Suspense>
        </nav>
      </div>
    </div>
  );
}
