"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listAccountsDb, type Account } from "@/lib/accountsDb";

export default function DevAccountsPage() {
  const [rows, setRows] = useState<Account[]>([]);
  const [err, setErr] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const list = await listAccountsDb();
        setRows(list);
      } catch (e: any) {
        setErr(e?.message ?? "failed");
      }
    })();
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-950">Dev: Supabase Accounts</h1>
          <Link href="/dashboard" className="text-sm font-semibold text-slate-700 hover:underline">
            Back to dashboard
          </Link>
        </div>

        <p className="mt-2 text-sm text-slate-600">
          This page reads from <code className="font-mono">public.paths</code>.
        </p>

        {err ? (
          <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
            {err}
          </div>
        ) : null}

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Rows: {rows.length}
          </div>

          <div className="mt-3 space-y-2">
            {rows.map((a) => (
              <div key={a.id} className="rounded-xl border border-slate-200 p-3 text-sm">
                <div className="font-semibold text-slate-900">{a.name}</div>
                <div className="mt-1 text-slate-600">
                  {a.firmSlug} · {a.phase} · {a.id}
                </div>
              </div>
            ))}
            {rows.length === 0 && !err ? (
              <div className="text-sm text-slate-600">No rows found.</div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
