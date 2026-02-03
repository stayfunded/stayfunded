// src/app/firms/[firm]/strategy/page.tsx

import Link from "next/link";

function toTitle(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function StrategyPage({ params }: { params: { firm: string } }) {
  const firm = params.firm;
  const firmName = toTitle(firm);

  return (
    <div className="space-y-8">
      {/* Header band */}
      <div className="rounded-3xl bg-slate-950 px-6 py-6 text-white">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-medium tracking-wider text-slate-300">
              {firmName} · STRATEGY FIT
            </div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              What survives this firm’s constraints
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Not signals. Not a system. This is a plain-language filter for
              which trading styles tend to survive under common prop rules — and
              why they fail when they don’t.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/firms/${firm}`}
              className="rounded-xl bg-white/10 px-3 py-2 text-sm font-medium text-white ring-1 ring-white/15 hover:bg-white/15"
            >
              ← Back to Hub
            </Link>
            <Link
              href={`/firms/${firm}/rules`}
              className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-100"
            >
              Review Rules
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Survives */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="text-xs font-medium tracking-wider text-slate-500">
            TENDS TO SURVIVE
          </div>

          <ul className="mt-4 space-y-4 text-sm text-slate-700">
            <li className="rounded-2xl bg-slate-50 p-4">
              <div className="font-semibold text-slate-950">
                Tight-risk, high-repeatability setups
              </div>
              <div className="mt-1 text-slate-600">
                Styles where each trade has a clearly defined stop and small
                expected loss relative to the account’s constraints.
              </div>
            </li>

            <li className="rounded-2xl bg-slate-50 p-4">
              <div className="font-semibold text-slate-950">
                “Don’t touch the limits” sizing
              </div>
              <div className="mt-1 text-slate-600">
                Traders who treat daily loss and trailing drawdown as untouchable
                floors (buffered sizing, not maxing out).
              </div>
            </li>

            <li className="rounded-2xl bg-slate-50 p-4">
              <div className="font-semibold text-slate-950">
                Avoiding high-volatility windows
              </div>
              <div className="mt-1 text-slate-600">
                Styles that reduce exposure to slippage/spikes that can push you
                into limits unintentionally.
              </div>
            </li>
          </ul>
        </div>

        {/* Dies */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="text-xs font-medium tracking-wider text-slate-500">
            TENDS TO DIE
          </div>

          <ul className="mt-4 space-y-4 text-sm text-slate-700">
            <li className="rounded-2xl bg-slate-50 p-4">
              <div className="font-semibold text-slate-950">
                “One big trade” behavior
              </div>
              <div className="mt-1 text-slate-600">
                Forcing size to hit targets quickly. This collides with daily
                loss and trailing drawdown faster than traders expect.
              </div>
            </li>

            <li className="rounded-2xl bg-slate-50 p-4">
              <div className="font-semibold text-slate-950">
                Wide-stop / long-hold styles without buffer
              </div>
              <div className="mt-1 text-slate-600">
                If your normal variance is large, you’ll “accidentally” violate
                limits unless you size extremely small.
              </div>
            </li>

            <li className="rounded-2xl bg-slate-50 p-4">
              <div className="font-semibold text-slate-950">
                Martingale / revenge loops
              </div>
              <div className="mt-1 text-slate-600">
                Any strategy that depends on increasing size after losses is
                structurally incompatible with hard daily stops.
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Practical filter */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-950">
          The filter to use before you trade any prop firm
        </h2>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-950">
              1) Risk per trade
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Can you define a stop that keeps losses small relative to the
              firm’s daily/trailing limits?
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-950">
              2) Variance vs limits
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Would a “normal bad day” put you near the limit? If yes, you’re
              oversized.
            </div>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm font-semibold text-slate-950">
              3) Slippage risk
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Does your style trade during news/open/volatility spikes that
              cause surprise losses?
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href={`/firms/${firm}/calculators`}
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-900"
          >
            Use Calculators →
          </Link>
          <Link
            href={`/firms/${firm}/checklists`}
            className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-950 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            Daily Checklist →
          </Link>
        </div>
      </div>

      {/* Placeholder note (keeps momentum honest) */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="text-xs font-medium tracking-wider text-slate-500">
          NOTE
        </div>
        <p className="mt-2 text-sm text-slate-700">
          We’ll make this firm-specific next (e.g., rules quirks, payout/risk
          mechanics, and which styles are most compatible). For now, this is the
          universal survivability lens.
        </p>
      </div>
    </div>
  );
}
