"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import useSWR from "swr";
import { api, ApiError, fetcher } from "@/lib/api";
import { CATEGORIES } from "@/lib/types";
import type { Category, Product } from "@/lib/types";
import { Badge, Button, Card, ErrorNote, Input, PageHeader, Select, Spinner, Textarea } from "@/components/ui";
import { useToast } from "@/components/toast";
import { VariantsEditor } from "@/components/variants-editor";
import { PhotoManager } from "@/components/photo-manager";

/** The extra details customers ask about. They are searchable by the assistant (e.g. "Arsenal", "Nike"). */
const ATTRIBUTES: Record<Category, { key: string; label: string; placeholder: string }[]> = {
  JERSEY: [
    { key: "club", label: "Club or country", placeholder: "Arsenal" },
    { key: "season", label: "Season", placeholder: "24/25" },
    { key: "version", label: "Version", placeholder: "fan or player" },
  ],
  SHOES: [{ key: "brand", label: "Brand", placeholder: "Nike" }],
  CLOTHES: [{ key: "gender", label: "For", placeholder: "men, women or kids" }],
  ACCESSORIES: [{ key: "brand", label: "Brand", placeholder: "optional" }],
};

function DetailsForm({ product, onSaved }: { product?: Product; onSaved: (p: Product) => void }) {
  const toast = useToast();
  const [name, setName] = useState(product?.name ?? "");
  const [category, setCategory] = useState<Category>(product?.category ?? "JERSEY");
  const [description, setDescription] = useState(product?.description ?? "");
  const [active, setActive] = useState(product?.active ?? true);
  const [attrs, setAttrs] = useState<Record<string, string>>(
    Object.fromEntries(Object.entries(product?.attributes ?? {}).map(([k, v]) => [k, String(v)])),
  );
  const [busy, setBusy] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setNameError("Give the product a name.");
    setNameError(null);
    setBusy(true);
    // Keep only the details that apply to this type of product and were filled in.
    const keep = new Set(ATTRIBUTES[category].map((a) => a.key));
    const attributes = Object.fromEntries(Object.entries(attrs).filter(([k, v]) => keep.has(k) && v.trim()).map(([k, v]) => [k, v.trim()]));
    try {
      const json = { name: name.trim(), category, description: description.trim() || null, attributes, active };
      const saved = product
        ? await api<Product>(`/products/${product.id}`, { method: "PATCH", json })
        : await api<Product>("/products", { method: "POST", json });
      toast(product ? "Saved" : "Product created. Now add sizes and photos.");
      onSaved(saved);
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Could not save.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <h2 className="text-lg font-semibold">Details</h2>
        <Input label="Product name" value={name} onChange={(e) => setName(e.target.value)} error={nameError} placeholder="Arsenal Home Jersey 24/25" maxLength={120} required />
        <Select label="Type" value={category} onChange={(e) => setCategory(e.target.value as Category)}>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </Select>
        <div className="grid gap-4 sm:grid-cols-3">
          {ATTRIBUTES[category].map((a) => (
            <Input key={a.key} label={a.label} value={attrs[a.key] ?? ""} onChange={(e) => setAttrs({ ...attrs, [a.key]: e.target.value })} placeholder={a.placeholder} maxLength={120} />
          ))}
        </div>
        <Textarea label="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Red fan version, breathable fabric" maxLength={1000} />
        <label className="flex min-h-11 items-center gap-3 text-sm">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="size-5 accent-[var(--brand)]" />
          <span>
            <span className="font-medium">Show this product to customers</span>
            <span className="block text-xs text-muted">Untick to hide it without deleting it (for example when you stop selling it).</span>
          </span>
        </label>
        <Button type="submit" loading={busy}>
          {product ? "Save details" : "Create product"}
        </Button>
      </form>
    </Card>
  );
}

export function ProductEditor({ productId }: { productId?: string }) {
  const router = useRouter();
  const { data, error, isLoading, mutate } = useSWR<Product>(productId ? `/products/${productId}` : null, fetcher);

  if (productId && isLoading) {
    return (
      <div className="grid place-items-center py-24">
        <Spinner className="size-6" />
      </div>
    );
  }
  if (productId && (error || !data)) {
    return (
      <>
        <Link href="/products" className="text-sm text-brand">
          ← All products
        </Link>
        <div className="mt-4">
          <ErrorNote message={error?.status === 404 ? "That product could not be found." : (error?.message ?? "Could not load this product.")} onRetry={error?.status === 404 ? undefined : () => mutate()} />
        </div>
      </>
    );
  }

  // After any change the API returns the whole updated product: put it straight into the cache.
  const onProduct = (p: Product) => void mutate(p, { revalidate: false });

  return (
    <>
      <Link href="/products" className="text-sm text-brand">
        ← All products
      </Link>
      <div className="mt-2">
        <PageHeader
          title={data ? data.name : "New product"}
          subtitle={data ? undefined : "Start with the basics. You can add sizes and photos right after."}
          action={data && !data.active ? <Badge>Hidden from customers</Badge> : undefined}
        />
      </div>
      <div className="space-y-5">
        <DetailsForm key={data?.id ?? "new"} product={data} onSaved={(p) => (data ? onProduct(p) : router.replace(`/products/${p.id}`))} />
        {data && (
          <>
            <VariantsEditor product={data} onProduct={onProduct} />
            <PhotoManager product={data} onProduct={onProduct} />
          </>
        )}
      </div>
    </>
  );
}
