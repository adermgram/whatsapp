import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";
import { Card } from "@/components/ui";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-brand text-lg font-bold text-on-brand" aria-hidden>
            S
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Shop dashboard</h1>
          <p className="mt-1 text-sm text-muted">Log in to manage your products and orders.</p>
        </div>
        <Card>
          <Suspense fallback={<p className="py-6 text-center text-sm text-muted">Loading…</p>}>
            <LoginForm />
          </Suspense>
        </Card>
      </div>
    </main>
  );
}
