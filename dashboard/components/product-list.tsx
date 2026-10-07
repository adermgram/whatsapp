"use client";

import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { fetcher } from "@/lib/api";
import { CATEGORIES } from "@/lib/types";
import type { Category, Product } from "@/lib/types";
import { plural, priceRange } from "@/lib/format";
import { Badge, Button, EmptyState, ErrorNote, Input, PageHeader, Spinner, cx } from "@/components/ui";
import { ProductThumb } from "@/components/product-thumb";

const label = (c: Category) => CATEGORIES.find((x) => x.value === c)?.label ?? c;

export function ProductList() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [showArchived, setShowArchived] = useState(false);

  const params = new URLSearchParams();
  if (q.trim()) params.set("q", q.trim());
  if (category) params.set("category", category);
  if (!showArchived) params.set("active", "true");
  const { data, error, isLoading, mutate } = useSWR<Product[]>(`/products?${params}`, fetcher, { keepPreviousData: true });

  return (
    <>
      <PageHeader
        title="Products"
        subtitle="Everything your WhatsApp assistant can sell."
        action={
          <Link href="/products/new">
            <Button>Add product</Button>
          </Link>
        }
      />

      <div className="mb-4 space-y-3">
        <Input label="Search" type="search" placeholder="e.g. Arsenal, Air Force…" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by type">
          {[{ value: "" as const, label: "All" }, ...CATEGORIES].map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              aria-pressed={category === c.value}
              className={cx(
                "min-h-9 rounded-full border px-3 text-sm",
                category === c.value ? "border-brand bg-brand-soft font-medium text-brand" : "border-line bg-surface text-muted hover:text-ink",
              )}
            >
              {c.label}
            </button>
          ))}
          <label className="ml-auto flex min-h-9 items-center gap-2 text-sm text-muted">
            <input type="checkbox" checked={showArchived} onChange={(e) => setShowArchived(e.target.checked)} className="size-4 accent-[var(--brand)]" />
            Show hidden
          </label>
        </div>
      </div>

      {isLoading && !data ? (
        <div className="grid place-items-center py-20">
          <Spinner className="size-6" />
        </div>
      ) : error && !data ? (
        <ErrorNote message={error.message} onRetry={() => mutate()} />
      ) : data && data.length === 0 ? (
        <EmptyState
          title={q || category ? "Nothing matches that" : "No products yet"}
          body={q || category ? "Try a different search or filter." : "Add your first product to get started."}
          action={
            !q && !category && (
              <Link href="/products/new">
                <Button>Add product</Button>
              </Link>
            )
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {data?.map((p) => (
            <li key={p.id}>
              <Link href={`/products/${p.id}`} className={cx("flex gap-3 rounded-xl border border-line bg-surface p-3 hover:border-brand", !p.active && "opacity-60")}>
                <ProductThumb imageId={p.mainImageId} name={p.name} className="size-20" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.name}</p>
                  <p className="text-sm text-muted">{label(p.category)}</p>
                  <p className="mt-1 text-sm font-medium">{priceRange(p.variants.map((v) => v.price))}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {!p.active && <Badge>Hidden</Badge>}
                    {p.variants.length === 0 ? (
                      <Badge tone="danger">No sizes yet</Badge>
                    ) : p.totalAvailable === 0 ? (
                      <Badge tone="danger">Sold out</Badge>
                    ) : (
                      <Badge tone="ok">{p.totalAvailable} in stock</Badge>
                    )}
                    {p.images.length === 0 && <Badge tone="warn">No photos</Badge>}
                    {p.images.length > 0 && <Badge>{plural(p.images.length, "photo")}</Badge>}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
