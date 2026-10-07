"use client";

/* eslint-disable @next/next/no-img-element -- pictures come from our own authenticated API */

import { useRef, useState } from "react";
import type { DragEvent } from "react";
import { api, ApiError } from "@/lib/api";
import { prepareImage } from "@/lib/image-prep";
import type { Product, UploadResponse } from "@/lib/types";
import { Badge, Button, Card, Input, Spinner, cx } from "@/components/ui";
import { useToast } from "@/components/toast";

const MAX_PHOTOS = 10;

interface QueueItem {
  id: number;
  name: string;
  status: "uploading" | "done" | "error";
  error?: string;
}

function PhotoTile({
  product,
  imageId,
  index,
  onProduct,
}: {
  product: Product;
  imageId: string;
  index: number;
  onProduct: (p: Product) => void;
}) {
  const toast = useToast();
  const image = product.images.find((i) => i.id === imageId)!;
  const [color, setColor] = useState(image.color ?? "");
  const [busy, setBusy] = useState(false);
  const last = product.images.length - 1;

  async function run(action: () => Promise<Product>, ok?: string) {
    setBusy(true);
    try {
      onProduct(await action());
      if (ok) toast(ok);
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "That did not work.", "error");
    } finally {
      setBusy(false);
    }
  }

  const move = (to: number) => {
    const ids = product.images.map((i) => i.id);
    ids.splice(to, 0, ids.splice(index, 1)[0]!);
    return run(() => api<Product>(`/products/${product.id}/images/order`, { method: "PUT", json: { order: ids } }));
  };

  return (
    <li className={cx("overflow-hidden rounded-xl border border-line bg-surface", busy && "opacity-60")}>
      <div className="relative aspect-square bg-bg">
        <img src={`/api/images/${imageId}`} alt={`${product.name}, photo ${index + 1}`} loading="lazy" className="size-full object-cover" />
        {index === 0 && (
          <span className="absolute left-2 top-2">
            <Badge tone="brand">Main photo</Badge>
          </span>
        )}
      </div>
      <div className="space-y-2 p-2">
        <Input
          label="Colour shown"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          onBlur={() => color !== (image.color ?? "") && run(() => api<Product>(`/images/${imageId}`, { method: "PATCH", json: { color } }), "Saved")}
          placeholder="optional"
          maxLength={30}
        />
        <div className="flex flex-wrap gap-1">
          {index > 0 && (
            <Button variant="secondary" className="min-h-9 flex-1 !px-2 text-xs" disabled={busy} onClick={() => move(0)}>
              Make main
            </Button>
          )}
          <Button variant="ghost" className="min-h-9 !px-2" disabled={busy || index === 0} onClick={() => move(index - 1)} aria-label="Move earlier">
            ←
          </Button>
          <Button variant="ghost" className="min-h-9 !px-2" disabled={busy || index === last} onClick={() => move(index + 1)} aria-label="Move later">
            →
          </Button>
          <Button
            variant="danger"
            className="min-h-9 !px-2 text-xs"
            disabled={busy}
            onClick={() => window.confirm("Delete this photo?") && run(() => api<Product>(`/images/${imageId}`, { method: "DELETE" }), "Photo deleted")}
          >
            Delete
          </Button>
        </div>
      </div>
    </li>
  );
}

export function PhotoManager({ product, onProduct }: { product: Product; onProduct: (p: Product) => void }) {
  const toast = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [color, setColor] = useState("");
  const [dragging, setDragging] = useState(false);
  const uploading = queue.some((q) => q.status === "uploading");
  const room = MAX_PHOTOS - product.images.length;

  async function upload(files: File[]) {
    const picked = files.filter((f) => f.type.startsWith("image/") || /\.(jpe?g|png|webp|heic)$/i.test(f.name));
    if (picked.length === 0) return toast("Choose pictures (JPG, PNG or WebP).", "error");
    const batch = picked.slice(0, Math.max(room, 0));
    if (batch.length < picked.length) toast(`A product can have ${MAX_PHOTOS} photos, so only the first ${batch.length} will be added.`, "error");
    if (batch.length === 0) return;

    const base = Date.now();
    setQueue(batch.map((f, i) => ({ id: base + i, name: f.name, status: "uploading" as const })));

    // One at a time: kind to mobile data, and each request stays small.
    let latest: Product | null = null;
    for (let i = 0; i < batch.length; i++) {
      const id = base + i;
      try {
        const prepared = await prepareImage(batch[i]!);
        if (prepared.size > 8 * 1024 * 1024) throw new ApiError("That picture is too big (limit 8 MB). Try a smaller one.", 413);
        const form = new FormData();
        form.append("files", prepared);
        if (color.trim()) form.append("color", color.trim());
        const res = await api<UploadResponse>(`/products/${product.id}/images`, { method: "POST", form });
        latest = res.product;
        const r = res.results[0];
        setQueue((q) => q.map((x) => (x.id === id ? { ...x, status: r?.ok ? "done" : "error", error: r?.error } : x)));
      } catch (err) {
        setQueue((q) => q.map((x) => (x.id === id ? { ...x, status: "error", error: err instanceof ApiError ? err.message : "Upload failed" } : x)));
      }
    }
    if (latest) onProduct(latest);
    if (inputRef.current) inputRef.current.value = "";
  }

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    void upload([...e.dataTransfer.files]);
  };

  return (
    <Card>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold">Photos</h2>
        <p className="text-sm text-muted">
          {product.images.length} of {MAX_PHOTOS}
        </p>
      </div>
      <p className="mt-1 text-sm text-muted">
        Customers can ask your assistant to send pictures of an item. The first photo is the main one. Phone photos are fine: they are resized for you.
      </p>

      {room > 0 && (
        <div
          onDragOver={(e) => (e.preventDefault(), setDragging(true))}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={cx("mt-4 rounded-xl border-2 border-dashed p-5 text-center transition-colors", dragging ? "border-brand bg-brand-soft" : "border-line")}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            id="photo-input"
            onChange={(e) => void upload([...(e.target.files ?? [])])}
          />
          <Button onClick={() => inputRef.current?.click()} loading={uploading}>
            {uploading ? "Uploading…" : "Choose photos"}
          </Button>
          <p className="mt-2 text-xs text-muted">or drag pictures here</p>
          <Input className="mx-auto mt-3 max-w-xs text-left" label="Colour in these photos (optional)" value={color} onChange={(e) => setColor(e.target.value)} placeholder="e.g. Red" maxLength={30} />
        </div>
      )}

      {queue.length > 0 && (
        <ul className="mt-3 space-y-1 text-sm" aria-live="polite">
          {queue.map((q) => (
            <li key={q.id} className="flex items-center gap-2">
              {q.status === "uploading" ? <Spinner /> : q.status === "done" ? <span className="text-ok">✓</span> : <span className="text-danger">✕</span>}
              <span className="truncate">{q.name}</span>
              {q.error && <span className="text-danger">: {q.error}</span>}
            </li>
          ))}
        </ul>
      )}

      {product.images.length > 0 && (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {product.images.map((img, i) => (
            <PhotoTile key={`${img.id}-${img.position}-${img.color}`} product={product} imageId={img.id} index={i} onProduct={onProduct} />
          ))}
        </ul>
      )}
    </Card>
  );
}
