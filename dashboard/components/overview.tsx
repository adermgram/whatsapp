"use client";

import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import type { OverviewNumbers, Product } from "@/lib/types";
import { naira, plural } from "@/lib/format";
import { Badge, Button, Card, EmptyState, ErrorNote, PageHeader, Spinner } from "@/components/ui";
import { ProductThumb } from "@/components/product-thumb";

const LOW_STOCK = 2;

function Stat({ label, value, tone }: { label: string; value: number; tone?: "warn" | "danger" }) {
  return (
    <Card className="!p-4">
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-1 text-3xl font-semibold tabular-nums ${tone === "danger" && value > 0 ? "text-danger" : tone === "warn" && value > 0 ? "text-warn" : ""}`}>{value}</p>
    </Card>
  );
}

function ProductsOverview() {
  const { data, error, isLoading, mutate } = useSWR<Product[]>("/products?active=true", fetcher);

  if (isLoading) {
    return (
      <div className="grid place-items-center py-24">
        <Spinner className="size-6" />
      </div>
    );
  }
  if (error || !data) return <ErrorNote message={error?.message ?? "Could not load your shop."} onRetry={() => mutate()} />;

  if (data.length === 0) {
    return (
      <>
        <EmptyState
          title="No products yet"
          body="Add what you sell, with sizes, prices, stock and photos. Customers will see exactly this on WhatsApp."
          action={
            <Link href="/products/new">
              <Button>Add your first product</Button>
            </Link>
          }
        />
      </>
    );
  }

  const outOfStock = data.filter((p) => p.variants.length > 0 && p.totalAvailable === 0);
  const lowStock = data.filter((p) => p.totalAvailable > 0 && p.variants.some((v) => v.available > 0 && v.available <= LOW_STOCK));
  const noPhotos = data.filter((p) => p.images.length === 0);
  const noSizes = data.filter((p) => p.variants.length === 0);

  const attention: { p: Product; why: string; tone: "danger" | "warn" | "neutral" }[] = [
    ...noSizes.map((p) => ({ p, why: "No sizes or prices yet: customers can't buy it", tone: "danger" as const })),
    ...outOfStock.map((p) => ({ p, why: "Sold out", tone: "danger" as const })),
    ...lowStock.map((p) => ({ p, why: "Running low on some sizes", tone: "warn" as const })),
    ...noPhotos.map((p) => ({ p, why: "No photos yet", tone: "neutral" as const })),
  ];

  return (
    <>
      <div className="mb-3 mt-8 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Your products</h2>
        <Link href="/products/new">
          <Button variant="secondary">Add product</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Products on sale" value={data.length} />
        <Stat label="Sold out" value={outOfStock.length} tone="danger" />
        <Stat label="Low stock" value={lowStock.length} tone="warn" />
        <Stat label="Without photos" value={noPhotos.length} tone="warn" />
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Products that need attention</h2>
      {attention.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">Everything looks good: every product has sizes, stock and photos.</p>
        </Card>
      ) : (
        <ul className="space-y-2">
          {attention.slice(0, 12).map(({ p, why, tone }, i) => (
            <li key={`${p.id}-${i}`}>
              <Link href={`/products/${p.id}`} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3 hover:border-brand">
                <ProductThumb imageId={p.mainImageId} name={p.name} className="size-12" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.name}</p>
                  <p className="text-sm text-muted">{plural(p.images.length, "photo")} · {plural(p.variants.length, "size option")}</p>
                </div>
                <Badge tone={tone}>{why}</Badge>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

const STATE_TEXT = {
  CONNECTED: { label: "Connected", tone: "ok" as const },
  QR_PENDING: { label: "Scan to connect", tone: "warn" as const },
  DISCONNECTED: { label: "Not connected", tone: "danger" as const },
};

function Tile({ href, label, value, note, tone }: { href: string; label: string; value: string; note?: string; tone?: "warn" | "danger" | "ok" }) {
  const color = tone === "danger" ? "text-danger" : tone === "warn" ? "text-warn" : tone === "ok" ? "text-ok" : "";
  return (
    <Link href={href} className="block min-w-0 rounded-xl border border-line bg-surface p-4 hover:border-brand">
      <p className="text-sm text-muted">{label}</p>
      <p className={`mt-1 truncate text-2xl font-semibold tabular-nums sm:text-3xl ${color}`}>{value}</p>
      {note && <p className="mt-0.5 truncate text-xs text-muted">{note}</p>}
    </Link>
  );
}

/** What needs the owner today: customers waiting, money not yet in, and whether WhatsApp is connected. */
function Today() {
  const { data } = useSWR<OverviewNumbers>("/overview", fetcher, { refreshInterval: 20_000 });
  if (!data) return null;
  const wa = STATE_TEXT[data.whatsapp.state];
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <Tile href="/chats" label="Customers waiting for you" value={String(data.waitingChats)} tone={data.waitingChats > 0 ? "danger" : undefined} note={data.waitingChats > 0 ? "Tap to reply" : "The AI has it covered"} />
      <Tile href="/orders" label="Orders not paid yet" value={String(data.awaitingPayment)} tone={data.awaitingPayment > 0 ? "warn" : undefined} />
      <Tile href="/orders" label="Paid in the last 7 days" value={naira(data.paidLast7Days.total)} note={plural(data.paidLast7Days.count, "order")} tone={data.paidLast7Days.count > 0 ? "ok" : undefined} />
      <Tile href="/whatsapp" label="WhatsApp" value={data.whatsapp.live ? wa.label : "Test mode"} tone={data.whatsapp.live ? (wa.tone === "ok" ? "ok" : wa.tone) : undefined} />
    </div>
  );
}

export function Overview() {
  return (
    <>
      <PageHeader title="Overview" subtitle="What needs you today, and how your shop looks to customers." />
      <Today />
      <ProductsOverview />
    </>
  );
}
