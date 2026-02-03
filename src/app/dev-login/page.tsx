"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnon);

export default function DevLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string>("");

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-2xl font-semibold text-slate-950">Dev Login</h1>
        <p className="mt-2 text-sm text-slate-600">
          Temporary page so we can test Supabase-backed accounts.
        </p>

        <div className="mt-6 space-y-3">
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            placeholder="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            className="w-full rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
            onClick={async () => {
              setMsg("");
              const { error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password,
              });
              if (error) {
                setMsg(error.message);
                return;
              }
              router.push("/dashboard");
            }}
          >
            Sign in
          </button>

          {msg ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900">
              {msg}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
