"use client";

/* eslint-disable @next/next/no-img-element -- the QR is a data: URL made by our own API */

import useSWR from "swr";
import { fetcher } from "@/lib/api";
import type { WhatsAppStatus } from "@/lib/types";
import { phoneLabel, timeAgo } from "@/lib/format";
import { Badge, Card, ErrorNote, PageHeader, Spinner } from "@/components/ui";

const Step = ({ n, children }: { n: number; children: React.ReactNode }) => (
  <li className="flex gap-3">
    <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-brand">{n}</span>
    <span className="min-w-0 text-sm">{children}</span>
  </li>
);

export function WhatsAppPage() {
  // check often while a QR is on screen (it changes every ~20 seconds), calmly otherwise
  const { data, error, isLoading, mutate } = useSWR<WhatsAppStatus>("/whatsapp", fetcher, {
    refreshInterval: (d) => (d?.state === "QR_PENDING" ? 4_000 : 15_000),
  });

  if (isLoading) {
    return (
      <div className="grid place-items-center py-24">
        <Spinner className="size-6" />
      </div>
    );
  }
  if (error || !data) return <ErrorNote message={error?.message ?? "Could not check WhatsApp."} onRetry={() => mutate()} />;

  return (
    <>
      <PageHeader title="WhatsApp" subtitle="The number your customers message, and whether the assistant is connected to it." />
      <div className="space-y-5">
        <Card>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`size-3 rounded-full ${data.state === "CONNECTED" ? "bg-ok" : data.state === "QR_PENDING" ? "bg-warn" : "bg-danger"}`}
              aria-hidden
            />
            <h2 className="text-lg font-semibold">{data.state === "CONNECTED" ? "Connected" : data.state === "QR_PENDING" ? "Waiting for you to scan" : "Not connected"}</h2>
            <Badge tone={data.state === "CONNECTED" ? "ok" : data.state === "QR_PENDING" ? "warn" : "danger"}>
              {data.state === "CONNECTED" ? "Customers are being answered" : "Customers are not being answered"}
            </Badge>
          </div>

          {data.state === "CONNECTED" && (
            <p className="mt-3 text-sm">
              Linked to {data.phone ? <strong>{phoneLabel(data.phone)}</strong> : "your WhatsApp"}.
              {data.updatedAt && <span className="text-muted"> Last change {timeAgo(data.updatedAt)}.</span>}
            </p>
          )}

          {data.state === "QR_PENDING" && (
            <div className="mt-4 grid gap-5 sm:grid-cols-[auto_1fr]">
              {data.qr ? (
                <img src={data.qr} alt="WhatsApp link code" className="mx-auto size-64 rounded-lg border border-line bg-white p-2 sm:mx-0" />
              ) : (
                <div className="grid size-64 place-items-center rounded-lg border border-dashed border-line">
                  <Spinner />
                </div>
              )}
              <ol className="space-y-3">
                <Step n={1}>On the phone that has the shop&apos;s WhatsApp, open WhatsApp.</Step>
                <Step n={2}>
                  Go to <strong>Settings → Linked devices → Link a device</strong>.
                </Step>
                <Step n={3}>Point the camera at this code. It refreshes itself, so if it stops working, wait a few seconds and scan the new one.</Step>
                <p className="text-xs text-muted">Only scan this on the shop&apos;s own phone. Anyone who scans it gets to read and send messages on that WhatsApp.</p>
              </ol>
            </div>
          )}

          {data.state === "DISCONNECTED" && (
            <div className="mt-3 space-y-3 text-sm">
              {!data.live ? (
                <p>This server is running in test mode, without a real WhatsApp connection.</p>
              ) : (
                <>
                  <p>
                    The assistant lost its link to WhatsApp, so messages are going unanswered. It usually reconnects by itself within a minute. If this stays red, the link was removed from the phone
                    (or the phone was logged out).
                  </p>
                  <p className="text-muted">
                    To link it again, restart the assistant on the server (<code className="rounded bg-bg px-1.5 py-0.5">pm2 restart api</code>). A code will appear on this page for you to scan.
                  </p>
                </>
              )}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Who the assistant answers</h2>
          <p className="mt-2 text-sm">
            {data.replyTo === "everyone" ? (
              <>
                <strong>Everyone</strong> who messages this number.
              </>
            ) : (
              <>
                Only <strong>{data.allowedCount}</strong> approved {data.allowedCount === 1 ? "number" : "numbers"} (test mode). Everyone else is ignored, so friends and family on this WhatsApp
                are not answered by mistake.
              </>
            )}
          </p>
          <p className="mt-2 text-xs text-muted">This is set on the server, not here, so that nobody can switch it on by accident.</p>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold">Alerts to you</h2>
          <dl className="mt-2 space-y-2 text-sm">
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <dt className="text-muted sm:w-40">WhatsApp alerts go to</dt>
              <dd>{data.ownerPhone ? phoneLabel(data.ownerPhone) : "Not set"}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:gap-4">
              <dt className="text-muted sm:w-40">Email alerts go to</dt>
              <dd className="break-all">{data.alertEmail ?? "Not set"}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </>
  );
}
