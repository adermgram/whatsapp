"use client";

import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import type { Product, Variant } from "@/lib/types";
import { naira } from "@/lib/format";
import { Badge, Button, Card, Input } from "@/components/ui";
import { useToast } from "@/components/toast";

/** "18,000" -> 18000. Empty or nonsense -> NaN. */
const num = (s: string) => (s.trim() === "" ? NaN : Number(s.replace(/,/g, "")));

interface Draft {
  size: string;
  color: string;
  price: string;
  minPrice: string;
  stock: string;
}

/** Plain-language problems with a size option, or null when it is fine. */
function problem(d: Draft): string | null {
  const price = num(d.price);
  const min = num(d.minPrice);
  const stock = num(d.stock);
  if (!(price > 0)) return "Enter the selling price.";
  if (!(min > 0)) return "Enter the lowest price you would accept.";
  if (min > price) return "The lowest price cannot be higher than the selling price.";
  if (!Number.isInteger(stock) || stock < 0) return "Stock must be a whole number, 0 or more.";
  return null;
}

const toDraft = (v: Variant): Draft => ({
  size: v.size ?? "",
  color: v.color ?? "",
  price: String(v.price),
  minPrice: String(v.minPrice),
  stock: String(v.stock),
});

function DraftFields({ d, set }: { d: Draft; set: (patch: Partial<Draft>) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      <Input label="Size" value={d.size} onChange={(e) => set({ size: e.target.value })} placeholder="M, 42…" maxLength={20} />
      <Input label="Colour" value={d.color} onChange={(e) => set({ color: e.target.value })} placeholder="optional" maxLength={30} />
      <Input label="Price (₦)" value={d.price} onChange={(e) => set({ price: e.target.value })} inputMode="decimal" placeholder="18000" />
      <Input label="Lowest price (₦)" value={d.minPrice} onChange={(e) => set({ minPrice: e.target.value })} inputMode="decimal" placeholder="14000" />
      <Input label="In stock" value={d.stock} onChange={(e) => set({ stock: e.target.value })} inputMode="numeric" placeholder="3" />
    </div>
  );
}

function VariantRow({ variant, productId, onProduct }: { variant: Variant; productId: string; onProduct: (p: Product) => void }) {
  const toast = useToast();
  const [d, setD] = useState<Draft>(toDraft(variant));
  const [busy, setBusy] = useState(false);
  const original = toDraft(variant);
  const dirty = (Object.keys(d) as (keyof Draft)[]).some((k) => d[k] !== original[k]);
  const issue = problem(d);

  async function save() {
    setBusy(true);
    try {
      const p = await api<Product>(`/variants/${variant.id}`, {
        method: "PATCH",
        json: { size: d.size, color: d.color, price: num(d.price), minPrice: num(d.minPrice), stock: num(d.stock) },
      });
      onProduct(p);
      const fresh = p.variants.find((v) => v.id === variant.id);
      if (fresh) setD(toDraft(fresh));
      toast("Saved");
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Could not save.", "error");
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm(`Delete the ${variant.size ?? "this"} size option?`)) return;
    setBusy(true);
    try {
      onProduct(await api<Product>(`/variants/${variant.id}`, { method: "DELETE" }));
      toast("Deleted");
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Could not delete.", "error");
      setBusy(false);
    }
  }

  return (
    <li className="rounded-lg border border-line p-3" data-product={productId}>
      <DraftFields d={d} set={(patch) => setD((cur) => ({ ...cur, ...patch }))} />
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {variant.reserved > 0 && <Badge tone="warn">{variant.reserved} held for unpaid orders</Badge>}
        {issue && dirty && <span className="text-xs text-danger">{issue}</span>}
        <div className="ml-auto flex gap-2">
          <Button variant="danger" onClick={remove} disabled={busy} className="min-h-9">
            Delete
          </Button>
          <Button onClick={save} disabled={!dirty || !!issue} loading={busy} className="min-h-9">
            Save
          </Button>
        </div>
      </div>
    </li>
  );
}

const EMPTY: Draft = { size: "", color: "", price: "", minPrice: "", stock: "" };

export function VariantsEditor({ product, onProduct }: { product: Product; onProduct: (p: Product) => void }) {
  const toast = useToast();
  const [d, setD] = useState<Draft>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [sizes, setSizes] = useState("");
  const [quick, setQuick] = useState<Draft>(EMPTY);

  async function add(drafts: Draft[]) {
    setBusy(true);
    let latest: Product | null = null;
    let added = 0;
    try {
      for (const x of drafts) {
        latest = await api<Product>(`/products/${product.id}/variants`, {
          method: "POST",
          json: { size: x.size, color: x.color, price: num(x.price), minPrice: num(x.minPrice), stock: num(x.stock) },
        });
        added++;
      }
      toast(added === 1 ? "Size added" : `${added} sizes added`);
      return true;
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Could not add that.", "error");
      return false;
    } finally {
      if (latest) onProduct(latest);
      setBusy(false);
    }
  }

  const quickList = sizes.split(/[,\n]/).map((s) => s.trim()).filter(Boolean);
  const quickIssue = problem({ ...quick, size: "x" });

  return (
    <Card>
      <h2 className="text-lg font-semibold">Sizes, prices and stock</h2>
      <p className="mt-1 text-sm text-muted">
        The <strong>lowest price</strong> is the least you would accept when a customer bargains. The assistant never goes below it and never tells the customer what it is.
      </p>

      {product.variants.length > 0 && (
        <ul className="mt-4 space-y-3">
          {product.variants.map((v) => (
            <VariantRow key={`${v.id}-${v.price}-${v.minPrice}-${v.stock}-${v.size}-${v.color}`} variant={v} productId={product.id} onProduct={onProduct} />
          ))}
        </ul>
      )}

      <details className="mt-5 rounded-lg border border-dashed border-line p-3" open={product.variants.length === 0}>
        <summary className="cursor-pointer text-sm font-medium">Add several sizes at once (same price and stock)</summary>
        <div className="mt-3 space-y-3">
          <Input label="Sizes" value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="S, M, L, XL" hint="Separate with commas. Shoes: 40, 41, 42, 43" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Input label="Colour" value={quick.color} onChange={(e) => setQuick({ ...quick, color: e.target.value })} placeholder="optional" />
            <Input label="Price (₦)" value={quick.price} onChange={(e) => setQuick({ ...quick, price: e.target.value })} inputMode="decimal" />
            <Input label="Lowest price (₦)" value={quick.minPrice} onChange={(e) => setQuick({ ...quick, minPrice: e.target.value })} inputMode="decimal" />
            <Input label="Stock each" value={quick.stock} onChange={(e) => setQuick({ ...quick, stock: e.target.value })} inputMode="numeric" />
          </div>
          {quickList.length > 0 && quickIssue === null && (
            <p className="text-sm text-muted">
              This adds {quickList.length} sizes ({quickList.join(", ")}) at {naira(num(quick.price))} each.
            </p>
          )}
          <Button
            loading={busy}
            disabled={quickList.length === 0 || quickIssue !== null || quickList.length > 30}
            onClick={async () => {
              if (await add(quickList.map((size) => ({ ...quick, size })))) {
                setSizes("");
                setQuick(EMPTY);
              }
            }}
          >
            Add {quickList.length > 0 ? quickList.length : ""} sizes
          </Button>
        </div>
      </details>

      <details className="mt-3 rounded-lg border border-dashed border-line p-3">
        <summary className="cursor-pointer text-sm font-medium">Add one size with its own price</summary>
        <div className="mt-3 space-y-3">
          <DraftFields d={d} set={(patch) => setD((cur) => ({ ...cur, ...patch }))} />
          <Button
            loading={busy}
            disabled={problem(d) !== null}
            onClick={async () => {
              if (await add([d])) setD(EMPTY);
            }}
          >
            Add this size
          </Button>
        </div>
      </details>
    </Card>
  );
}
