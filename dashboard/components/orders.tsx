"use client";

import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { api, ApiError, fetcher } from "@/lib/api";
import type { MarkPaidResponse, Order, OrderList, OrderStatus } from "@/lib/types";
import { dateTime, naira, phoneLabel, plural, timeAgo, whatsappLink } from "@/lib/format";
import { Badge, Button, Card, EmptyState, ErrorNote, Input, PageHeader, Spinner, cx } from "@/components/ui";
import { useToast } from "@/components/toast";

const STATUS: Record<OrderStatus, { label: string; tone: "warn" | "ok" | "neutral" | "danger" }> = {
  AWAITING_PAYMENT: { label: "Waiting for payment", tone: "warn" },
  PAID: { label: "Paid", tone: "ok" },
  FULFILLED: { label: "Delivered", tone: "ok" },
  CANCELLED: { label: "Cancelled", tone: "neutral" },
  EXPIRED: { label: "Expired", tone: "neutral" },
};

const FILTERS: { value: OrderStatus | ""; label: string }[] = [
  { value: "", label: "All" },
  { value: "AWAITING_PAYMENT", label: "Unpaid" },
  { value: "PAID", label: "Paid" },
  { value: "FULFILLED", label: "Delivered" },
  { value: "EXPIRED", label: "Expired" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const StatusBadge = ({ status }: { status: OrderStatus }) => <Badge tone={STATUS[status].tone}>{STATUS[status].label}</Badge>;

/** A bank-transfer payment can be confirmed while the order still waits, or after its hold on the stock ran out. */
const canMarkPaid = (o: Order) => o.status === "AWAITING_PAYMENT" || o.status === "EXPIRED";

const itemLine = (i: Order["items"][number]) => [i.name, i.size && `size ${i.size}`, i.color].filter(Boolean).join(" · ");

export function OrderList() {
  const [status, setStatus] = useState<OrderStatus | "">("");
  const [q, setQ] = useState("");

  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (q.trim()) params.set("q", q.trim());
  const { data, error, isLoading, mutate } = useSWR<OrderList>(`/orders?${params}`, fetcher, { keepPreviousData: true, refreshInterval: 20_000 });

  const total = data ? Object.values(data.counts).reduce((a, b) => a + b, 0) : 0;
  const countOf = (v: OrderStatus | "") => (!data ? undefined : v === "" ? total : data.counts[v]);

  return (
    <>
      <PageHeader title="Orders" subtitle="Every sale your assistant has taken, and what is still waiting for money." />

      <div className="mb-4 space-y-3">
        <Input label="Search" type="search" placeholder="Order number, customer name or phone" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label="Filter by status">
          {FILTERS.filter((f) => f.value === "" || f.value === status || (countOf(f.value) ?? 1) > 0).map((f) => (
            <button
              key={f.value}
              onClick={() => setStatus(f.value)}
              aria-pressed={status === f.value}
              className={cx(
                "min-h-9 shrink-0 rounded-full border px-3 text-sm",
                status === f.value ? "border-brand bg-brand-soft font-medium text-brand" : "border-line bg-surface text-muted hover:text-ink",
              )}
            >
              {f.label}
              {countOf(f.value) !== undefined && <span className="ml-1.5 tabular-nums opacity-70">{countOf(f.value)}</span>}
            </button>
          ))}
        </div>
      </div>

      {isLoading && !data ? (
        <div className="grid place-items-center py-20">
          <Spinner className="size-6" />
        </div>
      ) : error && !data ? (
        <ErrorNote message={error.message} onRetry={() => mutate()} />
      ) : data && data.orders.length === 0 ? (
        <EmptyState
          title={q || status ? "No orders match that" : "No orders yet"}
          body={q || status ? "Try a different search or filter." : "When a customer buys on WhatsApp, the order shows up here."}
        />
      ) : (
        <ul className="space-y-3">
          {data?.orders.map((o) => (
            <li key={o.id}>
              <Link href={`/orders/${o.id}`} className="block rounded-xl border border-line bg-surface p-4 hover:border-brand">
                <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                  <div className="min-w-0">
                    <p className="font-semibold">{o.orderNumber}</p>
                    <p className="truncate text-sm text-muted">
                      {o.customer.name ?? "Customer"} · {phoneLabel(o.customer.phone)}
                    </p>
                  </div>
                  <p className="text-lg font-semibold tabular-nums">{naira(o.total)}</p>
                </div>
                <p className="mt-2 line-clamp-2 text-sm">{o.items.map(itemLine).join("; ")}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StatusBadge status={o.status} />
                  {o.payment?.manual && <Badge>Confirmed by you</Badge>}
                  <span className="ml-auto text-xs text-muted">{timeAgo(o.paidAt ?? o.createdAt)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-4">
      <dt className="text-sm text-muted sm:w-40 sm:shrink-0">{label}</dt>
      <dd className="min-w-0 break-words text-sm">{children}</dd>
    </div>
  );
}

export function OrderDetail({ orderId }: { orderId: string }) {
  const toast = useToast();
  const { data: order, error, isLoading, mutate } = useSWR<Order>(`/orders/${orderId}`, fetcher, { refreshInterval: 20_000 });
  const [busy, setBusy] = useState(false);

  if (isLoading) {
    return (
      <div className="grid place-items-center py-24">
        <Spinner className="size-6" />
      </div>
    );
  }
  if (error || !order) {
    return (
      <>
        <Link href="/orders" className="inline-flex min-h-11 items-center text-sm text-brand">
          ← All orders
        </Link>
        <div className="mt-4">
          <ErrorNote message={error instanceof ApiError && error.status === 404 ? "That order could not be found." : (error?.message ?? "Could not load this order.")} onRetry={() => mutate()} />
        </div>
      </>
    );
  }

  async function markPaid() {
    if (!order) return;
    const ok = window.confirm(
      `Mark ${order.orderNumber} as paid?\n\nDo this only when the ${naira(order.total)} is really in your account. The customer will immediately get a payment confirmation and their receipt on WhatsApp.`,
    );
    if (!ok) return;
    setBusy(true);
    try {
      const res = await api<MarkPaidResponse>(`/orders/${order.id}/mark-paid`, { method: "POST" });
      await mutate(res.order, { revalidate: false });
      toast(
        res.outcome === "paid"
          ? "Marked as paid. The customer has been sent their receipt."
          : res.outcome === "already_paid"
            ? "That order was already paid."
            : "Marked as paid, but that item sold out meanwhile. Contact the customer to sort it out.",
        res.outcome === "oversold" ? "error" : "ok",
      );
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "Could not mark it as paid.", "error");
    } finally {
      setBusy(false);
    }
  }

  const wa = whatsappLink(order.customer.phone);

  return (
    <>
      <Link href="/orders" className="inline-flex min-h-11 items-center text-sm text-brand">
        ← All orders
      </Link>
      <div className="mt-2">
        <PageHeader title={order.orderNumber} subtitle={`Placed ${dateTime(order.createdAt)}`} action={<StatusBadge status={order.status} />} />
      </div>

      <div className="space-y-5">
        {canMarkPaid(order) && (
          <Card className="border-warn/40 bg-warn-soft">
            <h2 className="font-semibold text-warn">{order.status === "EXPIRED" ? "This order expired, but the customer may still have paid" : "Waiting for payment"}</h2>
            <p className="mt-1 text-sm">
              Paystack payments are confirmed automatically. If the customer paid {naira(order.total)} by bank transfer instead, check your account and confirm it here. They will get their receipt on WhatsApp.
            </p>
            <Button onClick={markPaid} loading={busy} className="mt-3 w-full sm:w-auto">
              Mark as paid
            </Button>
          </Card>
        )}

        <Card>
          <h2 className="text-lg font-semibold">Items</h2>
          <ul className="mt-3 divide-y divide-line">
            {order.items.map((i, idx) => (
              <li key={idx} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-medium">{i.name}</p>
                  <p className="text-sm text-muted">{[i.size && `Size ${i.size}`, i.color, plural(i.quantity, "piece")].filter(Boolean).join(" · ")}</p>
                  {i.unitPrice < i.listPrice && <p className="text-xs text-muted">Agreed price (list price {naira(i.listPrice)})</p>}
                </div>
                <p className="shrink-0 text-sm font-medium tabular-nums">{naira(i.unitPrice * i.quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-2 space-y-1 border-t border-line pt-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="tabular-nums">{naira(order.subtotal)}</dd>
            </div>
            {order.deliveryFee > 0 && (
              <div className="flex justify-between">
                <dt className="text-muted">Delivery</dt>
                <dd className="tabular-nums">{naira(order.deliveryFee)}</dd>
              </div>
            )}
            <div className="flex justify-between text-base font-semibold">
              <dt>Total</dt>
              <dd className="tabular-nums">{naira(order.total)}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Customer and delivery</h2>
          <dl className="mt-2 divide-y divide-line">
            <Row label="Name">{order.customer.name ?? "Not given"}</Row>
            <Row label="WhatsApp number">
              {phoneLabel(order.customer.phone)}
              {wa && (
                <>
                  {" · "}
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="text-brand underline">
                    Open chat in WhatsApp
                  </a>
                </>
              )}
            </Row>
            <Row label="Delivery address">{order.deliveryAddress ?? "Not given"}</Row>
            <Row label="Conversation">
              <Link href={`/chats/${order.conversationId}`} className="text-brand underline">
                See the chat with the AI
              </Link>
            </Row>
          </dl>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Payment</h2>
          <dl className="mt-2 divide-y divide-line">
            <Row label="Status">
              {order.payment?.status === "SUCCESS" ? (order.payment.manual ? "Paid. You confirmed it (bank transfer)." : "Paid through Paystack") : order.status === "AWAITING_PAYMENT" ? "Not paid yet" : "Not paid"}
            </Row>
            {order.paidAt && <Row label="Paid on">{dateTime(order.paidAt)}</Row>}
            {order.status === "AWAITING_PAYMENT" && order.expiresAt && <Row label="Stock held until">{dateTime(order.expiresAt)}</Row>}
            {order.payment && !order.payment.manual && <Row label="Paystack reference">{order.payment.reference}</Row>}
            <Row label="Receipt">
              {order.receipt ? (
                <>
                  {order.receipt.number}
                  {order.receipt.sent ? " · sent to the customer" : " · not delivered yet"}
                  {" · "}
                  <a href={`/api/orders/${order.id}/receipt`} target="_blank" rel="noopener noreferrer" className="text-brand underline">
                    View PDF
                  </a>
                </>
              ) : (
                "Created once the order is paid"
              )}
            </Row>
          </dl>
        </Card>
      </div>
    </>
  );
}
