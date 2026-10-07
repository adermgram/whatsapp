"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { Button, ErrorNote, Input } from "@/components/ui";

/** Only follow redirects to pages on THIS site ("/products"), never "//evil.example" or "https://...". */
function safeNext(raw: string | null): string {
  return raw && raw.startsWith("/") && !raw.startsWith("//") && !raw.includes("\\") ? raw : "/";
}

export function LoginForm() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      await api("/auth/login", { method: "POST", json: { email: String(form.get("email")), password: String(form.get("password")) } });
      router.replace(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not log in. Please try again.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {error && <ErrorNote message={error} />}
      <Input label="Email" name="email" type="email" autoComplete="username" required autoFocus />
      <Input label="Password" name="password" type="password" autoComplete="current-password" required />
      <Button type="submit" loading={busy} className="w-full">
        Log in
      </Button>
    </form>
  );
}
