"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import useSWR from "swr";
import { api, ApiError, fetcher } from "@/lib/api";
import type { Me } from "@/lib/types";
import { Button, Card, Input, PageHeader } from "@/components/ui";
import { useToast } from "@/components/toast";

function ChangePassword() {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const current = String(data.get("current"));
    const next = String(data.get("next"));
    if (next.length < 10) return setError("Use at least 10 characters.");
    if (next !== String(data.get("again"))) return setError("The two new passwords are not the same.");
    setError(null);
    setBusy(true);
    try {
      await api("/auth/password", { method: "POST", json: { current, next } });
      toast("Password changed");
      form.reset();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not change the password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold">Change password</h2>
      <p className="mt-1 text-sm text-muted">Use something long that you do not use anywhere else. At least 10 characters.</p>
      <form onSubmit={submit} className="mt-4 max-w-sm space-y-4" noValidate>
        <Input label="Current password" name="current" type="password" autoComplete="current-password" required />
        <Input label="New password" name="next" type="password" autoComplete="new-password" required minLength={10} />
        <Input label="New password again" name="again" type="password" autoComplete="new-password" required error={error} />
        <Button type="submit" loading={busy}>
          Change password
        </Button>
      </form>
    </Card>
  );
}

export function AccountSettings() {
  const { data: me } = useSWR<Me>("/auth/me", fetcher);
  return (
    <>
      <PageHeader title="Settings" subtitle={me ? `${me.businessName} · ${me.email}` : undefined} />
      <div className="space-y-5">
        <ChangePassword />
      </div>
    </>
  );
}
