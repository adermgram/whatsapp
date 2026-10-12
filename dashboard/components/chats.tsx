"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { api, ApiError, fetcher } from "@/lib/api";
import type { ChatDetail, ChatList, ChatSummary } from "@/lib/types";
import { dateTime, naira, phoneLabel, timeAgo, whatsappLink } from "@/lib/format";
import { Badge, Button, Card, EmptyState, ErrorNote, PageHeader, Spinner, cx } from "@/components/ui";
import { useToast } from "@/components/toast";
import { StatusBadge } from "@/components/orders";

const who = (c: { customerName: string | null; phone: string }) => c.customerName ?? phoneLabel(c.phone);

const SENDER_LABEL = { CUSTOMER: "Customer", AI: "AI assistant", OWNER: "You" } as const;

export function ChatListView() {
  const [tab, setTab] = useState<"waiting" | "all">("waiting");
  const { data, error, isLoading, mutate } = useSWR<ChatList>(`/chats?waiting=${tab === "waiting"}`, fetcher, { keepPreviousData: true, refreshInterval: 10_000 });

  return (
    <>
      <PageHeader title="Chats" subtitle="Customers the AI has handed to you, and everyone else it is talking to." />

      <div className="mb-4 flex gap-2" role="group" aria-label="Which chats">
        {(
          [
            ["waiting", "Waiting for you"],
            ["all", "All chats"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            aria-pressed={tab === value}
            className={cx(
              "min-h-11 flex-1 rounded-lg border px-3 text-sm sm:flex-none",
              tab === value ? "border-brand bg-brand-soft font-medium text-brand" : "border-line bg-surface text-muted hover:text-ink",
            )}
          >
            {label}
            {value === "waiting" && data && data.waitingCount > 0 && (
              <span className="ml-2 rounded-full bg-danger px-2 py-0.5 text-xs font-semibold text-white tabular-nums">{data.waitingCount}</span>
            )}
          </button>
        ))}
      </div>

      {isLoading && !data ? (
        <div className="grid place-items-center py-20">
          <Spinner className="size-6" />
        </div>
      ) : error && !data ? (
        <ErrorNote message={error.message} onRetry={() => mutate()} />
      ) : data && data.chats.length === 0 ? (
        <EmptyState
          title={tab === "waiting" ? "Nobody is waiting for you" : "No chats yet"}
          body={tab === "waiting" ? "The AI is handling every customer. If it needs you, they show up here and you also get a WhatsApp and email alert." : "When a customer messages your WhatsApp number, the chat appears here."}
        />
      ) : (
        <ul className="space-y-3">
          {data?.chats.map((c) => (
            <li key={c.id}>
              <ChatRow chat={c} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function ChatRow({ chat: c }: { chat: ChatSummary }) {
  const waiting = c.mode === "HUMAN";
  return (
    <Link href={`/chats/${c.id}`} className={cx("block rounded-xl border bg-surface p-4 hover:border-brand", waiting ? "border-warn/50" : "border-line")}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold">{who(c)}</p>
          {c.customerName && <p className="text-xs text-muted">{phoneLabel(c.phone)}</p>}
        </div>
        <span className="shrink-0 text-xs text-muted">{timeAgo(c.lastMessageAt)}</span>
      </div>
      {c.lastMessage && (
        <p className="mt-2 line-clamp-2 text-sm text-muted">
          <span className="font-medium text-ink">{SENDER_LABEL[c.lastMessage.sender]}: </span>
          {c.lastMessage.text}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {waiting ? <Badge tone="warn">{c.handoffBy === "OWNER" ? "You are handling this" : "Needs you"}</Badge> : <Badge tone="ok">AI is handling it</Badge>}
        {waiting && c.handoffReason && <span className="min-w-0 text-xs text-muted">{c.handoffReason}</span>}
      </div>
    </Link>
  );
}

export function ChatThread({ chatId }: { chatId: string }) {
  const toast = useToast();
  const { data: chat, error, isLoading, mutate } = useSWR<ChatDetail>(`/chats/${chatId}`, fetcher, { refreshInterval: 8_000 });
  const [busy, setBusy] = useState<"resume" | "take" | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const count = chat?.messages.length ?? 0;

  useEffect(() => {
    if (count > 0) endRef.current?.scrollIntoView({ block: "end" });
  }, [count]);

  if (isLoading) {
    return (
      <div className="grid place-items-center py-24">
        <Spinner className="size-6" />
      </div>
    );
  }
  if (error || !chat) {
    return (
      <>
        <Link href="/chats" className="inline-flex min-h-11 items-center text-sm text-brand">
          ← All chats
        </Link>
        <div className="mt-4">
          <ErrorNote message={error instanceof ApiError && error.status === 404 ? "That chat could not be found." : (error?.message ?? "Could not load this chat.")} onRetry={() => mutate()} />
        </div>
      </>
    );
  }

  async function act(kind: "resume" | "take") {
    setBusy(kind);
    try {
      const next = await api<ChatDetail>(`/chats/${chatId}/${kind === "resume" ? "resume" : "take-over"}`, { method: "POST" });
      await mutate(next, { revalidate: false });
      toast(kind === "resume" ? "The AI is back in charge of this chat." : "The AI will stay quiet in this chat until you give it back.");
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "That did not work.", "error");
    } finally {
      setBusy(null);
    }
  }

  const waiting = chat.mode === "HUMAN";
  const wa = whatsappLink(chat.phone);

  return (
    <>
      <Link href="/chats" className="inline-flex min-h-11 items-center text-sm text-brand">
        ← All chats
      </Link>
      <div className="mt-2">
        <PageHeader
          title={who(chat)}
          subtitle={chat.customerName ? phoneLabel(chat.phone) : undefined}
          action={waiting ? <Badge tone="warn">{chat.handoffBy === "OWNER" ? "You are handling this" : "Needs you"}</Badge> : <Badge tone="ok">AI is handling it</Badge>}
        />
      </div>

      <Card className={cx("mb-5", waiting && "border-warn/40 bg-warn-soft")}>
        {waiting ? (
          <>
            <p className="text-sm font-medium">{chat.handoffReason ?? "The AI has stepped back from this chat."}</p>
            {chat.humanSince && <p className="mt-0.5 text-xs text-muted">Since {dateTime(chat.humanSince)}. The AI is not answering this customer.</p>}
          </>
        ) : (
          <p className="text-sm">The AI is answering this customer. Pause it if you want to talk to them yourself.</p>
        )}
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-brand px-4 text-sm font-medium text-on-brand hover:bg-brand-hover"
            >
              Reply in WhatsApp
            </a>
          )}
          {waiting ? (
            <Button variant="secondary" loading={busy === "resume"} onClick={() => act("resume")}>
              Give back to the AI
            </Button>
          ) : (
            <Button variant="secondary" loading={busy === "take"} onClick={() => act("take")}>
              Pause the AI and take over
            </Button>
          )}
        </div>
        {waiting && <p className="mt-2 text-xs text-muted">If you give the chat back, the AI also answers anything the customer is still waiting on.</p>}
      </Card>

      {chat.orders.length > 0 && (
        <div className="mb-5">
          <h2 className="mb-2 text-sm font-semibold text-muted">Orders from this customer</h2>
          <ul className="space-y-2">
            {chat.orders.map((o) => (
              <li key={o.id}>
                <Link href={`/orders/${o.id}`} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3 hover:border-brand">
                  <span className="font-medium">{o.orderNumber}</span>
                  <span className="flex items-center gap-3">
                    <StatusBadge status={o.status} />
                    <span className="text-sm tabular-nums">{naira(o.total)}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h2 className="mb-2 text-sm font-semibold text-muted">Conversation</h2>
      {chat.messages.length === 0 ? (
        <EmptyState title="No messages yet" />
      ) : (
        <ol className="space-y-2 rounded-xl border border-line bg-bg p-3 sm:p-4" aria-label="Messages">
          {chat.messages.map((m) => {
            const mine = m.sender !== "CUSTOMER";
            return (
              <li key={m.id} className={cx("flex", mine ? "justify-end" : "justify-start")}>
                <div className={cx("max-w-[85%] rounded-2xl px-3 py-2 text-sm sm:max-w-[75%]", mine ? (m.sender === "OWNER" ? "bg-brand text-on-brand" : "bg-brand-soft text-ink") : "border border-line bg-surface")}>
                  <p className={cx("mb-0.5 text-xs font-medium", m.sender === "OWNER" ? "opacity-80" : "text-muted")}>{SENDER_LABEL[m.sender]}</p>
                  <p className="whitespace-pre-wrap break-words">{m.text || (m.type === "audio" ? "🎤 Voice note" : m.type === "image" ? "📷 Photo" : m.type === "document" ? "📄 Document" : "")}</p>
                  <p className={cx("mt-1 text-right text-[11px]", m.sender === "OWNER" ? "opacity-80" : "text-muted")}>{timeAgo(m.createdAt)}</p>
                </div>
              </li>
            );
          })}
          <div ref={endRef} />
        </ol>
      )}
    </>
  );
}
