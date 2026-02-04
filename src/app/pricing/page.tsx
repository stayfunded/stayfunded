// src/app/pricing/page.tsx
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — StayFunded",
  description:
    "StayFunded pricing. A framework membership for phase-aware execution under prop firm rules: Today, Playbooks, and Accountability. No signals. No guarantees.",
  openGraph: {
    title: "Pricing — StayFunded",
    description:
      "Pricing for StayFunded — a framework membership for prop firm accounts. Built for rule-aware, phase-correct execution. No signals. No guarantees.",
    type: "website",
  },
};

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-gray-900/60" />
      <span>{children}</span>
    </li>
  );
}

function PriceLine({
  strike,
  price,
  suffix,
}: {
  strike?: string;
  price: string;
  suffix: string;
}) {
  return (
    <div className="mt-3">
      {strike ? (
        <div className="text-sm text-gray-500 line-through">{strike}</div>
      ) : (
        <div className="text-sm text-transparent select-none">.</div>
      )}

      <div className="mt-1 flex items-baseline gap-2">
        <div className="text-4xl font-semibold tracking-tight text-gray-900 tabular-nums">
          {price}
        </div>
        <div className="text-sm font-medium text-gray-600">{suffix}</div>
      </div>
    </div>
  );
}

function MiniCompare() {
  // Non-image visual element: a simple “what you get” comparison grid.
  return (
    <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-sm font-semibold text-gray-900">
            What you’re buying
          </div>
          <p className="mt-1 text-sm text-gray-600 max-w-2xl">
            StayFunded is a system, not a tool bundle. Pro/Lifetime unlock the
            full framework membership: Today → Playbooks → Accountability.
          </p>
        </div>
        <div className="text-xs text-gray-500">
          Outcome framing, no promises — built to reduce rule violations and
          unforced errors.
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-xl border border-gray-200">
        <div className="grid grid-cols-3 bg-gray-50 text-xs font-semibold text-gray-700">
          <div className="px-4 py-3">Included</div>
          <div className="px-4 py-3 text-center">Free</div>
          <div className="px-4 py-3 text-center">Pro / Lifetime</div>
        </div>

        {[
          ["Strategy Analysis (rule friction review)", true, true],
          ["Rule Changes tracking", true, true],
          ["Today: daily operating surface", false, true],
          ["Playbooks: firm + phase behavior plans", false, true],
          ["Checklists defining a correct trading day", false, true],
          ["Accountability pairing (as it ships)", false, true],
        ].map(([label, free, pro], idx) => (
          <div
            key={label as string}
            className={`grid grid-cols-3 text-sm ${
              idx % 2 === 0 ? "bg-white" : "bg-gray-50/50"
            }`}
          >
            <div className="px-4 py-3 text-gray-800">{label}</div>
            <div className="px-4 py-3 text-center">
              {free ? (
                <span className="inline-flex rounded-full bg-gray-900/5 px-2 py-0.5 text-xs font-semibold text-gray-900">
                  Included
                </span>
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </div>
            <div className="px-4 py-3 text-center">
              {pro ? (
                <span className="inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
                  Included
                </span>
              ) : (
                <span className="text-gray-400">—</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VideoPlaceholder() {
  return (
    <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
        <div className="max-w-xl">
          <div className="text-sm font-semibold text-gray-900">
            Optional: 90-second demo
          </div>
          <p className="mt-1 text-sm text-gray-600">
            This should be a tight walkthrough of the framework: Today → Playbooks
            → Accountability, and why it increases the odds of passing evals,
            keeping funded accounts, and getting paid — without promising outcomes.
          </p>

          <div className="mt-3 text-xs text-gray-500">
            Place a real video here later. For now, this is a placeholder box.
          </div>
        </div>

        <div className="w-full md:w-[520px]">
          <div className="aspect-video w-full rounded-xl border border-gray-200 bg-gray-50" />
          {/* VIDEO SCRIPT PROMPT — use later to generate a perfect demo video script
              Goal: 90 seconds. Crisp. Outcome-forward without promises.
              
              Structure:
              1) Hook (10s): "Most traders fail prop firms for the same reason..."
              2) The enemy (15s): "Unforced errors + rule friction + phase mismatch."
              3) The system (35s): Today, Playbooks, Accountability — show each quickly.
              4) Outcomes framing (15s): "Increase chances of passing evals, keeping funded accounts, getting paid."
              5) CTA (15s): Run Strategy Analysis free → then Pro.
              
              Visual guidance:
              - Show the Today screen (go/no-go, guardrails, stop conditions).
              - Show a Playbook view (prioritize/avoid/constraints/gotcha).
              - Show accountability pairing concept (plan + enforcement).
              
              Tone: decisive, practical, “tell me what to do” energy. No hype.
              Avoid: guarantees, PnL claims, “get rich”, “easy”.
          */}
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <main className="bg-white">
      <div className="bg-gradient-to-b from-amber-50/40 via-white to-white">
        <div className="mx-auto max-w-6xl px-6 py-14 md:px-10">
          {/* Header */}
          <div className="max-w-3xl">
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
              Pricing
            </h1>

            <p className="mt-3 text-base text-gray-600">
              StayFunded is a framework membership for prop firm accounts. It
              teaches and enforces phase-aware execution structure under real prop firm
              rules — day by day, phase by phase.
            </p>

            <p className="mt-2 text-sm text-gray-600">
              Outcome framing (no promises): built to increase your chances of{" "}
              <span className="font-semibold text-gray-900">passing evaluations</span>,{" "}
              <span className="font-semibold text-gray-900">keeping funded accounts</span>, and{" "}
              <span className="font-semibold text-gray-900">getting paid</span>{" "}
              by reducing unforced errors and rule violations.
            </p>
          </div>

          {/* Cards */}
          <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-3">
            {/* Free */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
              <div className="text-sm font-semibold text-gray-900">Free</div>
              <p className="mt-3 text-sm text-gray-600">
                Understand why accounts fail and where your approach breaks under
                prop firm rules.
              </p>

              <PriceLine price="$0" suffix="" />

              <ul className="mt-5 space-y-2 text-sm text-gray-700">
                <Bullet>Strategy Analysis (rule friction review)</Bullet>
                <Bullet>Rule Changes tracking</Bullet>
                <Bullet>Saved analysis history</Bullet>
              </ul>

              <div className="mt-7">
                <Link
                  href="/account"
                  className="inline-flex w-full justify-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Create free account
                </Link>
              </div>
            </div>

            {/* Pro */}
            <div className="relative rounded-2xl border border-amber-300 bg-white p-8 shadow-lg ring-1 ring-amber-200 lg:-translate-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-900">
                  Pro (Founder)
                </div>
                <div className="text-xs font-semibold text-amber-900">
                  Most popular
                </div>
              </div>

              <PriceLine strike="$149 / month" price="$99" suffix="/ month" />

              <p className="mt-3 text-sm text-gray-700">
                The full StayFunded system: Today, Playbooks, and Accountability.
                One framework. No feature tiers. Everything included.
              </p>

              <ul className="mt-5 space-y-2 text-sm text-gray-700">
                <Bullet>Today: daily operating surface</Bullet>
                <Bullet>Firm + phase playbooks</Bullet>
                <Bullet>Checklists defining a correct trading day</Bullet>
                <Bullet>Rule-aware guidance (no signals)</Bullet>
                <Bullet>Accountability pairing (as it ships)</Bullet>
              </ul>


              <p className="mt-5 text-xs text-gray-600">
                Founder pricing is temporary. Your rate stays locked while active.
              </p>

              <div className="mt-7">
                <Link
                  href="/account"
                  className="inline-flex w-full justify-center rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-black hover:bg-amber-300"
                >
                  Start Pro — $99/month
                </Link>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                No signals. No trade calls. No guarantees.
              </p>
            </div>

            {/* Lifetime */}
            <div className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm">
              <div className="text-sm font-semibold text-gray-900">Lifetime</div>
              <p className="mt-3 text-sm text-gray-600">
                One-time payment. Full access for as long as you trade prop firms.
              </p>

              <PriceLine strike="$1,999 one-time" price="$1,199" suffix="one-time" />

              <p className="mt-3 text-sm text-gray-700">
                Designed for traders who treat this as a long-term skill, not a
                one-off attempt.
              </p>

              <ul className="mt-5 space-y-2 text-sm text-gray-700">
                <Bullet>Everything in Pro</Bullet>
                <Bullet>Lifetime access</Bullet>
                <Bullet>Future framework updates included</Bullet>
                <Bullet>Founder lifetime (limited)</Bullet>
              </ul>

              <p className="mt-5 text-xs text-gray-600">
                Roughly ~10 months of Pro at current pricing.
              </p>

              <div className="mt-7">
                <Link
                  href="/account"
                  className="inline-flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100"
                >
                  Buy lifetime — $1,199
                </Link>
              </div>
            </div>
          </div>

          {/* Visual elements (non-image + optional media placeholder) */}
          <MiniCompare />
          <VideoPlaceholder />

          {/* Recovery add-on */}
          <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">Recovery add-on</h2>
            <p className="mt-3 text-sm text-gray-700">
              Recovery is a time-boxed, 30-day reset layer for Framework members who are close to washing out and need higher-touch structure temporarily.
            </p>
            <p className="mt-3 text-sm text-gray-700">
              $299 for month one, then $99/month starting month two. Cancel anytime. Requires active Framework membership.
            </p>
            <div className="mt-5">
              <Link
                href="/recovery"
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-100"
              >
                Learn about Recovery
              </Link>
            </div>
          </section>

          {/* Footer note */}
          <div className="mt-10 max-w-3xl text-xs text-gray-500">
            StayFunded is an educational operating framework for trading prop firm
            accounts. It does not provide financial advice, signals, or performance
            promises.
          </div>
        </div>
      </div>
    </main>
  );
}
