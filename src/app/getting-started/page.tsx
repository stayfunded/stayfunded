// src/app/getting-started/page.tsx
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Getting Started — StayFunded",
  description:
    "StayFunded helps prop firm traders trade the account they have with structure: phase plans, weekly roadmaps, daily next steps, and tools that reduce rule-based failure modes. No signals. No guarantees.",
  openGraph: {
    title: "Getting Started — StayFunded",
    description:
      "A system designed to help you pass prop firm accounts by turning your firm + phase into a weekly plan and daily next steps. No signals. No guarantees.",
    type: "website"
  }
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-800">
      {children}
    </span>
  );
}

export default function GettingStartedPage() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        {/* HERO */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap gap-2">
            <Pill>No signals</Pill>
            <Pill>No trade calls</Pill>
            <Pill>No guarantees</Pill>
            <Pill>Firm + phase structure</Pill>
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
            A system designed to help you pass prop firm accounts.
          </h1>

          <p className="max-w-3xl text-gray-600">
            “Help you pass” is not a promise. It’s a mechanism.
            StayFunded turns your firm + phase into a weekly plan and daily next steps
            so you’re not improvising inside constraints you don’t fully see.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/strategy-analysis"
              className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-300"
            >
              Run Strategy Analysis (free)
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              View pricing
            </Link>
            <Link
              href="/product"
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              Product overview
            </Link>
          </div>
        </div>

        {/* 3-step mechanism */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <div className="text-sm font-semibold text-gray-900">
            The mechanism (simple)
          </div>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            This is what StayFunded does: it converts your account into an operating plan you can actually follow.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="text-xs font-semibold text-gray-500">STEP 1</div>
              <div className="mt-2 text-sm font-semibold text-gray-900">
                Diagnose where you’ll lose the account
              </div>
              <p className="mt-2 text-sm text-gray-700">
                Run Strategy Analysis to see where your approach is structurally compatible
                with your firm/phase — and where the constraints quietly punish it.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="text-xs font-semibold text-gray-500">STEP 2</div>
              <div className="mt-2 text-sm font-semibold text-gray-900">
                Apply a firm + phase plan
              </div>
              <p className="mt-2 text-sm text-gray-700">
                Use playbooks that translate the firm’s definitions and enforcement into
                behavior you can execute inside the phase you’re in.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="text-xs font-semibold text-gray-500">STEP 3</div>
              <div className="mt-2 text-sm font-semibold text-gray-900">
                Follow the weekly roadmap + daily steps
              </div>
              <p className="mt-2 text-sm text-gray-700">
                Your account workspace tells you what to do next this week and today —
                so you reduce the common ways traders fail under pressure.
              </p>
            </div>
          </div>
        </div>

        {/* Phase framing */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            Prop firms grade by phase. Your behavior has to change by phase.
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            Same trader, same strategy — different phase constraints — different outcome.
            StayFunded is built around this reality.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-gray-900">Evaluation</div>
              <p className="mt-2 text-sm text-gray-600">
                Most failures happen here because traders force personal-account behavior
                into evaluation constraints (drawdown mechanics, loss limits, minimum days, etc.).
              </p>
              <div className="mt-4 text-sm font-semibold text-gray-900">
                What you get:
              </div>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                <li>• Weekly plan that fits evaluation grading</li>
                <li>• Daily checklist to avoid common blow-up paths</li>
                <li>• Clear interpretation of definitions and enforcement</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-gray-900">Funded / Stabilization</div>
              <p className="mt-2 text-sm text-gray-600">
                Traders often “pass” then immediately lose the account because funded mechanics
                punish volatility and sloppy scaling.
              </p>
              <div className="mt-4 text-sm font-semibold text-gray-900">
                What you get:
              </div>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                <li>• Phase-specific operating plan (behavior shifts)</li>
                <li>• Guardrails that reduce account-loss behaviors</li>
                <li>• Tools that keep you eligible for payout conditions</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="text-sm font-semibold text-gray-900">Payout</div>
              <p className="mt-2 text-sm text-gray-600">
                Payout phases introduce new restrictions. Traders can be “profitable” and still
                fail payout eligibility because of definition traps.
              </p>
              <div className="mt-4 text-sm font-semibold text-gray-900">
                What you get:
              </div>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                <li>• Payout-focused checklist and weekly plan</li>
                <li>• Clarity on eligibility tripwires</li>
                <li>• Rule changes tracking so you don’t run old assumptions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Explicit “we help you pass” without promising */}
        <div className="mt-12 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <div className="text-sm font-semibold text-gray-900">
            What “help you pass” means (and what it doesn’t)
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="text-sm font-semibold text-gray-900">What we do</div>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                <li>• Turn firm + phase into a plan you can follow</li>
                <li>• Reduce decision load (“what do I do next?”)</li>
                <li>• Make definition traps and failure modes explicit</li>
                <li>• Keep your behavior aligned to what the phase is grading</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5">
              <div className="text-sm font-semibold text-gray-900">What we don’t do</div>
              <ul className="mt-2 space-y-1 text-sm text-gray-700">
                <li>• No signals or trade calls</li>
                <li>• No guarantees or pass promises</li>
                <li>• No “edge” claims or performance prediction</li>
                <li>• No judging your entries/exits as “good” or “bad”</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Branching CTA */}
        <div className="mt-12 rounded-3xl bg-indigo-600 px-6 py-10 text-center text-white shadow-sm">
          <h3 className="text-2xl font-semibold tracking-tight">
            Start with Strategy Analysis — then apply structure to your account.
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/85">
            If you already have a prop firm account, the next step is applying a firm/phase plan.
            If you don’t have an account yet, Discovery helps you choose one.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/strategy-analysis"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100"
            >
              I already have an account
            </Link>
            <Link
              href="/discovery"
              className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15"
            >
              I don’t have an account yet
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15"
            >
              View pricing
            </Link>
          </div>

          <div className="mt-4 text-xs text-white/70">
            No signals. No trade calls. No guarantees.
          </div>
        </div>
      </div>
    </main>
  );
}
