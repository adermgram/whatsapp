"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { api, ApiError } from "@/lib/api";
import type { AccessView } from "@/lib/types";
import { phoneLabel, timeAgo } from "@/lib/format";
import { Badge, Button, Card, Input, cx } from "@/components/ui";
import { useToast } from "@/components/toast";

/** A WhatsApp privacy id ("lid:123...") is not a phone number; show it as what it is. */
const shown = (phone: string) => (phone.startsWith("lid:") ? `Private WhatsApp id …${phone.slice(-6)}` : phoneLabel(phone));

const MODES = [
  { value: "ALLOWLIST" as const, title: "Only numbers I approve", note: "Safe for testing. Everyone else is ignored." },
  { value: "EVERYONE" as const, title: "Everyone", note: "Any customer who messages this number is answered." },
];

/**
 * Who the assistant talks to. Changes take effect at once, with no restart: the bot reads this list from the database.
 */
export function AccessCard({ access, onChange }: { access: AccessView; onChange: (next: AccessView) => void }) {
  const toast = useToast();
  const [phone, setPhone] = useState("");
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(key: string, action: () => Promise<AccessView>, ok: string) {
    setBusy(key);
    try {
      onChange(await action());
      toast(ok);
      return true;
    } catch (err) {
      toast(err instanceof ApiError ? err.message : "That did not work.", "error");
      return false;
    } finally {
      setBusy(null);
    }
  }

  async function setMode(mode: AccessView["mode"]) {
    if (mode === access.mode) return;
    if (mode === "EVERYONE" && !window.confirm("Answer EVERYONE who messages this WhatsApp number?\n\nThe assistant will start replying to any customer, friend or stranger. Only do this when you are ready to go live.")) return;
    await run("mode", () => api<AccessView>("/whatsapp/reply-mode", { method: "PUT", json: { mode } }), mode === "EVERYONE" ? "The assistant now answers everyone." : "The assistant now answers only approved numbers.");
  }

  async function add(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!phone.trim()) return setError("Type the phone number first.");
    try {
      setBusy("add");
      const next = await api<AccessView>("/whatsapp/allowed", { method: "POST", json: { phone, label: label.trim() || null } });
      onChange(next);
      setPhone("");
      setLabel("");
      toast("Number approved. The assistant will answer it right away.");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not add that number.");
    } finally {
      setBusy(null);
    }
  }

  const nobody = access.mode === "ALLOWLIST" && access.allowed.length === 0;

  return (
    <Card>
      <h2 className="text-lg font-semibold">Who the assistant answers</h2>
      <p className="mt-1 text-sm text-muted">Changes work immediately. You do not need to restart anything.</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="Who the assistant answers">
        {MODES.map((m) => (
          <button
            key={m.value}
            role="radio"
            aria-checked={access.mode === m.value}
            disabled={busy === "mode"}
            onClick={() => setMode(m.value)}
            className={cx(
              "min-h-16 rounded-xl border p-3 text-left disabled:opacity-60",
              access.mode === m.value ? "border-brand bg-brand-soft" : "border-line bg-surface hover:border-brand",
            )}
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              <span className={cx("grid size-4 place-items-center rounded-full border", access.mode === m.value ? "border-brand" : "border-line")} aria-hidden>
                {access.mode === m.value && <span className="size-2 rounded-full bg-brand" />}
              </span>
              {m.title}
            </span>
            <span className="mt-1 block text-xs text-muted">{m.note}</span>
          </button>
        ))}
      </div>

      {access.mode === "EVERYONE" && (
        <p className="mt-3 rounded-lg bg-warn-soft px-3 py-2 text-sm text-warn">The assistant is answering everyone, so the approved list below is not being used right now.</p>
      )}
      {nobody && <p className="mt-3 rounded-lg bg-danger-soft px-3 py-2 text-sm text-danger">Nobody is approved yet, so the assistant is not answering anyone. Add a number below.</p>}

      <h3 className="mb-2 mt-6 text-sm font-semibold">Approved numbers {access.allowed.length > 0 && <span className="font-normal text-muted">({access.allowed.length})</span>}</h3>
      <form onSubmit={add} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-start" noValidate>
        <Input label="Phone number" type="tel" inputMode="tel" autoComplete="off" placeholder="0801 234 5678" value={phone} onChange={(e) => setPhone(e.target.value)} error={error} />
        <Input label="Name (optional)" autoComplete="off" placeholder="e.g. Aunty Bisi, testing" maxLength={40} value={label} onChange={(e) => setLabel(e.target.value)} />
        <Button type="submit" loading={busy === "add"} className="w-full sm:mt-6 sm:w-auto">
          Approve
        </Button>
      </form>

      {access.allowed.length > 0 && (
        <ul className="mt-4 divide-y divide-line rounded-xl border border-line">
          {access.allowed.map((n) => (
            <li key={n.id} className="flex items-center justify-between gap-3 px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{n.label ?? shown(n.phone)}</p>
                {n.label && <p className="text-xs text-muted">{shown(n.phone)}</p>}
              </div>
              <Button
                variant="ghost"
                className="min-h-11 shrink-0"
                loading={busy === n.id}
                aria-label={`Stop answering ${n.label ?? shown(n.phone)}`}
                onClick={() => run(n.id, () => api<AccessView>(`/whatsapp/allowed/${n.id}`, { method: "DELETE" }), "Removed. The assistant will ignore that number.")}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      )}

      {access.ignored.length > 0 && (
        <>
          <h3 className="mb-1 mt-6 text-sm font-semibold">Messaged but not answered</h3>
          <p className="mb-2 text-xs text-muted">These numbers wrote to you while they were not approved. Tap Approve to let the assistant start talking to them. We only keep the number and name, never what they wrote.</p>
          <ul className="divide-y divide-line rounded-xl border border-line">
            {access.ignored.map((n) => (
              <li key={n.id} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{n.name ?? shown(n.phone)}</p>
                  <p className="text-xs text-muted">
                    {n.name && <>{shown(n.phone)} · </>}
                    {timeAgo(n.lastSeenAt)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="ghost" className="min-h-11" loading={busy === `d${n.id}`} onClick={() => run(`d${n.id}`, () => api<AccessView>(`/whatsapp/ignored/${n.id}`, { method: "DELETE" }), "Dismissed.")}>
                    Dismiss
                  </Button>
                  <Button variant="secondary" className="min-h-11" loading={busy === `a${n.id}`} onClick={() => run(`a${n.id}`, () => api<AccessView>(`/whatsapp/ignored/${n.id}/allow`, { method: "POST" }), "Approved. The assistant will answer them now.")}>
                    Approve
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="mt-5 flex flex-wrap items-center gap-2 text-xs text-muted">
        <Badge>Always on</Badge> Your own commands (like /paid and /resume) always work from your number, even if it is not on the list.
      </p>
    </Card>
  );
}
