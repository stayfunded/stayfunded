// src/app/login/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string>("");
  const [info, setInfo] = useState<string>("");

  const origin = useMemo(() => {
    if (typeof window === "undefined") return "https://stayfunded.io";
    return window.location.origin;
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // If the user is already logged in, go to dashboard.
        const { data } = await supabase.auth.getUser();
        if (data?.user?.id && !cancelled) {
          router.replace("/dashboard");
          return;
        }

        // If redirected back with a code (PKCE), exchange it for a session.
        const code = searchParams.get("code");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) throw error;
          if (!cancelled) {
            router.replace("/dashboard");
            router.refresh();
          }
        }
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "Login failed");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  async function sendMagicLink() {
    setErr("");
    setInfo("");

    const e = email.trim();
    if (!e) return setErr("Enter your email.");

    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: e,
        options: {
          emailRedirectTo: `${origin}/login`,
        },
      });
      if (error) throw error;

      setInfo("Check your email for a magic link to finish logging in.");
    } catch (ex: any) {
      setErr(ex?.message || "Failed to send magic link");
    } finally {
      setBusy(false);
    }
  }

  async function loginWithGoogle() {
    setErr("");
    setInfo("");
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/login`,
        },
      });
      if (error) throw error;
      // Redirect happens automatically.
    } catch (ex: any) {
      setErr(ex?.message || "Google login failed");
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070A14] text-white">
      <div className="mx-auto max-w-md px-6 py-12">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/75">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Log in
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white">
            Access your dashboard
          </h1>

          <p className="mt-2 text-sm text-white/70">
            Log in to use the post-signup operating surfaces (Today + Playbooks +
            Accountability) and keep your progress in one place.
          </p>

          <p className="mt-2 text-xs text-white/55">
            Outcome framing (no promises): built to increase your chances of passing
            evaluations, keeping funded accounts, and getting paid — by reducing rule
            violations and unforced errors. No signals. No trade calls.
          </p>

          {err ? (
            <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200">
              {err}
            </div>
          ) : null}

          {info ? (
            <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100">
              {info}
            </div>
          ) : null}

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
            <button
              type="button"
              onClick={loginWithGoogle}
              disabled={busy}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Continue with Google
            </button>

            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <div className="text-xs font-semibold text-white/50">or</div>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <label className="text-xs font-semibold text-white/70">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:ring-2 focus:ring-amber-400/30"
              placeholder="you@example.com"
              autoComplete="email"
            />

            <button
              type="button"
              onClick={sendMagicLink}
              disabled={busy}
              className="mt-4 w-full rounded-xl bg-amber-400 px-4 py-2.5 text-sm font-semibold text-black hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Working…" : "Send magic link"}
            </button>

            <div className="mt-4 flex items-center justify-between text-xs">
              <Link
                href="/"
                className="font-semibold text-white/60 hover:text-white"
              >
                Back home
              </Link>
              <Link
                href="/account"
                className="font-semibold text-white/60 hover:text-white"
              >
                Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
