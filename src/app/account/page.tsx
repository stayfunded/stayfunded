"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type SessionUser = {
  email: string | null;
  id: string | null;
};

type SubscriptionRow = {
  status: string | null;
  price_id: string | null;
  current_period_end: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
};

function isPaidMonthlyStatus(status: string | null) {
  return !!status && ["active", "trialing", "past_due", "incomplete", "unpaid", "canceled"].includes(status);
}

function isGoodMonthlyStatus(status: string | null) {
  return !!status && ["active", "trialing", "past_due"].includes(status);
}

function isLifetime(status: string | null) {
  return status === "lifetime";
}

function planLabelFromSub(sub: SubscriptionRow | null) {
  if (!sub?.status) return "Free";
  if (isLifetime(sub.status)) return "Founder Lifetime";
  if (isPaidMonthlyStatus(sub.status)) return "Founder Monthly";
  return "Free";
}

export default function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string>("");

  const [user, setUser] = useState<SessionUser>({ email: null, id: null });
  const [sub, setSub] = useState<SubscriptionRow | null>(null);

  const stripeResult = useMemo(() => searchParams.get("stripe"), [searchParams]);

  async function loadSessionAndSub() {
    setErr("");

    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;

    const u = data?.user;
    const userId = u?.id ?? null;

    setUser({ email: u?.email ?? null, id: userId });

    if (!userId) {
      setSub(null);
      return;
    }

    const { data: row, error: subErr } = await supabase
      .from("subscriptions")
      .select("status,price_id,current_period_end,stripe_customer_id,stripe_subscription_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (subErr) throw subErr;
    setSub((row as any) ?? null);
  }

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await loadSessionAndSub();
        if (!cancelled) setLoading(false);
      } catch (e: any) {
        if (!cancelled) {
          setErr(e?.message || "Failed to load session");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function logout() {
    try {
      setErr("");
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (e: any) {
      setErr(e?.message || "Logout failed");
    }
  }

  async function getAccessToken() {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    const token = data?.session?.access_token;
    if (!token) throw new Error("No session token found. Please log in again.");
    return token;
  }

  async function startCheckout(plan: "monthly" | "lifetime") {
    setBusy(true);
    setErr("");
    try {
      const token = await getAccessToken();

      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ plan }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Checkout failed");

      if (!json?.url) throw new Error("Missing Stripe checkout URL");
      window.location.href = json.url;
    } catch (e: any) {
      setErr(e?.message || "Checkout failed");
      setBusy(false);
    }
  }

  async function openPortal() {
    setBusy(true);
    setErr("");
    try {
      const token = await getAccessToken();

      const res = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || "Portal failed");

      if (!json?.url) throw new Error("Missing portal URL");
      window.location.href = json.url;
    } catch (e: any) {
      setErr(e?.message || "Portal failed");
      setBusy(false);
    }
  }

  const loggedIn = !!user.id;
  const planLabel = planLabelFromSub(sub);

  const monthlyIsCurrent = loggedIn && !isLifetime(sub?.status ?? null) && isGoodMonthlyStatus(sub?.status ?? null);
  const lifetimeIsCurrent = loggedIn && isLifetime(sub?.status ?? null);

  const showManage =
    loggedIn &&
    sub?.stripe_customer_id &&
    !isLifetime(sub?.status ?? null) &&
    isPaidMonthlyStatus(sub?.status ?? null);

  const periodEndText =
    sub?.current_period_end && !isLifetime(sub?.status ?? null)
      ? new Date(sub.current_period_end).toLocaleString()
      : null;

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl px-6 py-12 md:px-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">Account</h1>
          <p className="text-sm text-gray-600">Confirm who you are logged in as, and manage billing.</p>
        </div>

        {stripeResult === "success" ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
            Payment completed. It may take a moment for your plan to update. Refresh this page if needed.
          </div>
        ) : null}

        {stripeResult === "cancel" ? (
          <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
            Checkout canceled. No changes were made.
          </div>
        ) : null}

        {err ? (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-900">
            {err}
          </div>
        ) : null}

        {/* Session */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-gray-900">Session</div>

          {loading ? (
            <div className="mt-3 text-sm text-gray-600">Loading…</div>
          ) : loggedIn ? (
            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-gray-50 px-4 py-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">Logged in as</div>
                <div className="mt-1 text-sm font-semibold text-gray-900">{user.email || "Unknown email"}</div>
                <div className="mt-1 text-xs text-gray-500">User ID: {user.id}</div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
                >
                  Log out
                </button>

                <Link
                  href="/dashboard"
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Go to dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <div className="rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-700">You are currently logged out.</div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300"
                >
                  Log in
                </Link>
                <Link
                  href="/"
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Back to home
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Billing */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-900">Billing</div>
            <div className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-900">
              Plan: {planLabel}
            </div>
          </div>

          {!loggedIn ? (
            <p className="mt-2 text-sm text-gray-600">Log in to upgrade or manage billing.</p>
          ) : (
            <>
              <p className="mt-2 text-sm text-gray-600">
                Founder pricing is temporary. Your plan updates automatically based on Stripe + system state.
              </p>

              {sub?.status ? (
                <div className="mt-3 rounded-xl bg-white px-4 py-3 text-sm text-gray-700">
                  <div>
                    <span className="font-semibold">Status:</span>{" "}
                    <span className="font-semibold text-gray-900">{sub.status}</span>
                  </div>
                  {periodEndText ? (
                    <div className="mt-1 text-xs text-gray-500">Current period ends: {periodEndText}</div>
                  ) : null}
                </div>
              ) : (
                <div className="mt-3 rounded-xl bg-white px-4 py-3 text-sm text-gray-700">No paid plan detected.</div>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                {/* Monthly */}
                <button
                  type="button"
                  disabled={busy || monthlyIsCurrent || lifetimeIsCurrent}
                  onClick={() => startCheckout("monthly")}
                  className={`rounded-xl px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60 ${
                    monthlyIsCurrent || lifetimeIsCurrent
                      ? "bg-gray-200 text-gray-800"
                      : "bg-amber-400 text-black hover:bg-amber-300"
                  }`}
                >
                  {monthlyIsCurrent ? "Current plan: Founder Monthly" : "Upgrade: Founder Monthly ($99/mo)"}
                </button>

                {/* Lifetime */}
                <button
                  type="button"
                  disabled={busy || lifetimeIsCurrent}
                  onClick={() => startCheckout("lifetime")}
                  className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {lifetimeIsCurrent ? "Current plan: Founder Lifetime" : "Buy: Founder Lifetime ($250)"}
                </button>

                {/* Manage */}
                {showManage ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={openPortal}
                    className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Manage subscription
                  </button>
                ) : null}
              </div>

              <div className="mt-3 text-xs text-gray-500">
                If plan doesn’t update immediately after checkout, refresh this page.
              </div>
            </>
          )}

          <div className="mt-4">
            <Link
              href="/pricing"
              className="inline-flex rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              View pricing
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
