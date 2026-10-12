"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Suspense } from "react";
import type { ReactNode } from "react";
import useSWR from "swr";
import { api, fetcher } from "@/lib/api";
import type { Me, OverviewNumbers } from "@/lib/types";
import { cx } from "@/components/ui";

const Icon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

type Badge = "orders" | "chats";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: Badge;
  /** Shown in the phone's bottom bar. The bar has room for five; the rest are reached from the pages themselves. */
  phone: boolean;
}

const NAV: NavItem[] = [
  { href: "/", label: "Home", icon: "M3 11l9-8 9 8M5 10v10h14V10", phone: true },
  { href: "/orders", label: "Orders", icon: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0", badge: "orders", phone: true },
  { href: "/chats", label: "Chats", icon: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z", badge: "chats", phone: true },
  { href: "/products", label: "Products", icon: "M20 7l-8-4-8 4m16 0v10l-8 4m0-14L4 7m8 4v10M4 7v10l8 4", phone: true },
  { href: "/whatsapp", label: "WhatsApp", icon: "M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2", phone: false },
  {
    href: "/settings",
    label: "Settings",
    icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1.1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3H9a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8V9a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z",
    phone: true,
  },
];

/** Numbers for the little red counters: customers waiting for you, and orders waiting for money. */
function useOverview() {
  return useSWR<OverviewNumbers>("/overview", fetcher, { refreshInterval: 20_000, shouldRetryOnError: false });
}

function Counter({ n, className }: { n: number | undefined; className?: string }) {
  if (!n) return null;
  return (
    <span
      aria-label={`${n} waiting`}
      className={cx("grid min-w-5 place-items-center rounded-full bg-danger px-1.5 text-[11px] font-semibold leading-5 text-white tabular-nums", className)}
    >
      {n > 99 ? "99+" : n}
    </span>
  );
}

/**
 * The menu. It is the only part that needs the current URL (to highlight where you are), and with Next.js'
 * cache components that must sit behind <Suspense> so the rest of the page can still be prepared in advance.
 */
function NavLinks({ variant }: { variant: "side" | "bottom" }) {
  const pathname = usePathname();
  const { data } = useOverview();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const counts: Record<Badge, number | undefined> = { orders: data?.awaitingPayment, chats: data?.waitingChats };
  return NAV.filter((n) => variant === "side" || n.phone).map((n) => (
    <NavLink key={n.href} item={n} variant={variant} active={isActive(n.href)} count={n.badge ? counts[n.badge] : undefined} />
  ));
}

function NavLink({ item, variant, active, count }: { item: NavItem; variant: "side" | "bottom"; active: boolean; count?: number }) {
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className={
        variant === "side"
          ? cx("flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium", active ? "bg-brand-soft text-brand" : "text-muted hover:bg-bg hover:text-ink")
          : cx("relative flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium", active ? "text-brand" : "text-muted")
      }
    >
      <span className="relative">
        <Icon d={item.icon} />
        {variant === "bottom" && <Counter n={count} className="absolute -right-3 -top-2 !min-w-4 !px-1 !text-[10px] !leading-4" />}
      </span>
      {item.label}
      {variant === "side" && <Counter n={count} className="ml-auto" />}
    </Link>
  );
}

/** What shows for a split second before the current page is known: the same links, none highlighted. */
function NavFallback({ variant }: { variant: "side" | "bottom" }) {
  return NAV.filter((n) => variant === "side" || n.phone).map((n) => <NavLink key={n.href} item={n} variant={variant} active={false} />);
}

/** A small "is WhatsApp connected?" light that links to the WhatsApp page, so a dropped connection is never a surprise. */
function ConnectionPill() {
  const { data } = useOverview();
  if (!data) return null;
  const { state, live } = data.whatsapp;
  const ok = state === "CONNECTED";
  const label = ok ? "WhatsApp connected" : state === "QR_PENDING" ? "Scan to connect" : live ? "WhatsApp disconnected" : "Test mode";
  return (
    <Link
      href="/whatsapp"
      className={cx(
        "inline-flex min-h-9 items-center gap-2 rounded-full border px-3 text-xs font-medium",
        ok || !live ? "border-line text-muted" : state === "QR_PENDING" ? "border-warn/50 bg-warn-soft text-warn" : "border-danger/40 bg-danger-soft text-danger",
      )}
    >
      <span className={cx("size-2 rounded-full", ok ? "bg-ok" : !live ? "bg-muted" : state === "QR_PENDING" ? "bg-warn" : "bg-danger")} aria-hidden />
      {label}
    </Link>
  );
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
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-line bg-surface p-4 lg:flex">
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
        <div className="mb-3 px-1">
          <ConnectionPill />
        </div>
        <button onClick={logout} className="min-h-11 rounded-lg px-3 text-left text-sm text-muted hover:bg-bg hover:text-ink">
          Log out
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Phone header */}
        <header className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] lg:hidden">
          <p className="min-w-0 truncate text-sm font-semibold">{me?.businessName ?? "Shop dashboard"}</p>
          <div className="flex shrink-0 items-center gap-1">
            <ConnectionPill />
            <button onClick={logout} className="min-h-11 px-2 text-sm text-muted">
              Log out
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pb-32 pt-5 sm:px-6 lg:pb-10 lg:pt-8">{children}</main>

        {/* Phone bottom tab bar */}
        <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
          <Suspense fallback={<NavFallback variant="bottom" />}>
            <NavLinks variant="bottom" />
          </Suspense>
        </nav>
      </div>
    </div>
  );
}
