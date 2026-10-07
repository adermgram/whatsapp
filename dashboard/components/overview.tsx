"use client";

import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import type { Product } from "@/lib/types";
import { plural } from "@/lib/format";
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

export function Overview() {
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
        <PageHeader title="Welcome" subtitle="Your shop is empty. Add your first product and your WhatsApp assistant can start selling it." />
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
      <PageHeader
        title="Overview"
        subtitle="How your shop looks to customers right now."
        action={
          <Link href="/products/new">
            <Button>Add product</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Products on sale" value={data.length} />
        <Stat label="Sold out" value={outOfStock.length} tone="danger" />
        <Stat label="Low stock" value={lowStock.length} tone="warn" />
        <Stat label="Without photos" value={noPhotos.length} tone="warn" />
      </div>

      <h2 className="mb-3 mt-8 text-lg font-semibold">Needs your attention</h2>
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
