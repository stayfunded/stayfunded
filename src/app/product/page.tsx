// src/app/product/page.tsx
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product — StayFunded",
  description:
    "StayFunded helps prop firm traders pass accounts by turning a firm + phase into a weekly plan and daily next steps. Strategy Analysis → Playbooks → Account OS. No signals. No guarantees.",
  openGraph: {
    title: "Product — StayFunded",
    description:
      "A system designed to help you pass prop firm accounts by turning firm + phase into weekly roadmaps and daily next steps. Start with Strategy Analysis. No signals. No guarantees.",
    type: "website",
  },
};

function SectionTitle({
  eyebrow,
  title,
  body,
}: {
  eyebrow?: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      {eyebrow ? (
        <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
          {eyebrow}
        </div>
      ) : null}
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-3xl text-gray-600">{body}</p>
    </div>
  );
}

function Card({
  title,
  body,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  body: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      <p className="mt-2 text-sm text-gray-600">{body}</p>
      {ctaHref && ctaLabel ? (
        <div className="mt-4">
          <Link
            href={ctaHref}
            className="inline-flex rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
          >
            {ctaLabel}
          </Link>
        </div>
      ) : null}
    </div>
  );
}

export default function ProductPage() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <SectionTitle
          eyebrow="Product"
          title="StayFunded helps you pass prop firm accounts with structure."
          body="This is not a signals product. StayFunded turns your firm + phase into a weekly roadmap and daily next steps — so you’re not improvising under constraints you don’t fully see."
        />

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/strategy-analysis"
            className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-300"
          >
            Run Strategy Analysis (free)
          </Link>
          <Link
            href="/getting-started"
            className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
          >
            Getting started
          </Link>
          <Link
            href="/pricing"
            className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
          >
            View pricing
          </Link>
        </div>

        {/* What this is (plain, strong) */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <div className="text-sm font-semibold text-gray-900">
            What this is (in plain English)
          </div>
          <p className="mt-2 max-w-4xl text-sm text-gray-700">
            Prop firm trading is closer to a standardized test than “regular trading.”
            You can be a capable trader and still fail because the account constraints punish
            common behaviors (drawdown mechanics, phase restrictions, definition traps, and rule changes).
            StayFunded exists to reduce decision load and make the constraints operational: what to do next,
            this week and today, for the specific account you’re trading.
          </p>
          <div className="mt-3 text-xs text-gray-600">
            No signals. No trade calls. No guarantees.
          </div>
        </div>

        {/* The mechanism */}
        <div className="mt-12">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
              The mechanism
            </h2>
            <Link
              href="/getting-started"
              className="hidden rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 md:inline-flex"
            >
              Read “Getting started”
            </Link>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <Card
              title="1) Diagnose the failure mode"
              body="Start with Strategy Analysis. We show where your approach is structurally compatible with your firm/phase — and where accounts like this typically break."
              ctaHref="/strategy-analysis"
              ctaLabel="Run analysis"
            />
            <Card
              title="2) Apply a firm + phase plan"
              body="Playbooks convert the firm’s definitions and enforcement into behavior you can actually execute — and adjust by phase (evaluation vs funded vs payout)."
              ctaHref="/firms"
              ctaLabel="Browse firm hubs"
            />
            <Card
              title="3) Follow the roadmap + daily next steps"
              body="Inside an account workspace, you get phase-aware weekly roadmaps, daily checklists, saved analyses, and clear next actions tied to one account."
              ctaHref="/pricing"
              ctaLabel="Apply this to an account"
            />
          </div>
        </div>

        {/* What you get (tight, product-y) */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
            What you get
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            Everything is organized around a single unit: a prop firm account (firm + phase + status).
            The question the product answers is: <span className="font-semibold text-gray-900">“What do I do next for this account?”</span>
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card
              title="Account OS (workspace per account)"
              body="A dedicated workspace with roadmap, checklists, rules context, playbooks, and saved Strategy Analyses — all tied to the account you’re operating."
              ctaHref="/dashboard"
              ctaLabel="Go to dashboard"
            />
            <Card
              title="Firm + phase playbooks"
              body="Firm hubs translate the fine print into executable behavior. Each phase gets its own plan — because phases grade different behavior."
              ctaHref="/firms"
              ctaLabel="Open firm hubs"
            />
            <Card
              title="Strategy Analysis (free + paid persistence)"
              body="A blunt diagnostic of where your approach breaks under the constraints of a specific firm/phase. Free TOF runs; persisted and archived when applied to an account."
              ctaHref="/strategy-analysis"
              ctaLabel="Run it"
            />
            <Card
              title="Weekly roadmaps (phase-aware)"
              body="Non-numeric weekly plans that keep behavior aligned to what the phase is grading — and reduce the common ways traders self-destruct."
              ctaHref="/getting-started"
              ctaLabel="See the mechanism"
            />
            <Card
              title="Daily checklists (pre / during / post)"
              body="Simple, non-journal checklists that keep execution consistent and reduce decision load during the day."
              ctaHref="/getting-started"
              ctaLabel="How it fits"
            />
            <Card
              title="Rule Changes tracker"
              body="When definitions change, plans break. Rule Changes tracks what changed, why it matters, and the firm source — so you don’t run old assumptions."
              ctaHref="/rule-changes"
              ctaLabel="View Rule Changes"
            />
          </div>
        </div>

        {/* Phase clarity */}
        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-gray-900">
            Phases are the point
          </div>
          <p className="mt-2 max-w-4xl text-sm text-gray-700">
            Evaluation behavior often fails in funded. Payout eligibility introduces its own restrictions.
            StayFunded is phase-first: roadmaps, checklists, and doctrine change depending on what the firm is grading right now.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <div className="text-xs font-semibold text-gray-500">EVALUATION</div>
              <div className="mt-2 text-sm font-semibold text-gray-900">
                Survive the constraints
              </div>
              <p className="mt-2 text-sm text-gray-700">
                Reduce the failure modes that disqualify accounts before “strategy” matters.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <div className="text-xs font-semibold text-gray-500">FUNDED</div>
              <div className="mt-2 text-sm font-semibold text-gray-900">
                Stabilize behavior
              </div>
              <p className="mt-2 text-sm text-gray-700">
                Funded mechanics punish volatility and sloppy scaling. Plans adapt by phase.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <div className="text-xs font-semibold text-gray-500">PAYOUT</div>
              <div className="mt-2 text-sm font-semibold text-gray-900">
                Stay eligible
              </div>
              <p className="mt-2 text-sm text-gray-700">
                Eligibility traps disqualify profitable traders. The plan shifts to payout constraints.
              </p>
            </div>
          </div>
        </div>

        {/* Who it's for / not for */}
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <div className="text-sm font-semibold text-gray-900">This is for you if…</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>• You already trade prop firms (or are about to) and want a plan that survives constraints.</li>
              <li>• You’re tired of “good trades” that still fail the account.</li>
              <li>• You want clear next actions tied to a specific firm + phase.</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <div className="text-sm font-semibold text-gray-900">This is not for you if…</div>
            <ul className="mt-3 space-y-2 text-sm text-gray-700">
              <li>• You want signals or trade calls.</li>
              <li>• You want guarantees or “pass promises.”</li>
              <li>• You won’t follow a plan consistently.</li>
            </ul>
          </div>
        </div>

        {/* Free tools positioning */}
        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-gray-900">Free tools</div>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            Most traders should start with Strategy Analysis. Discovery is primarily for traders who don’t have an account yet
            (or who are willing to switch).
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/strategy-analysis"
              className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-black"
            >
              Run Strategy Analysis (free)
            </Link>
            <Link
              href="/discovery"
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              Use Discovery (optional)
            </Link>
            <Link
              href="/rule-changes"
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              View Rule Changes
            </Link>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-12 rounded-3xl bg-indigo-600 px-6 py-10 text-center text-white shadow-sm">
          <h2 className="text-2xl font-semibold tracking-tight">
            Run Strategy Analysis — then apply structure to your account.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/85">
            StayFunded helps you pass prop firm accounts by turning firm + phase into a weekly roadmap and daily next steps.
            No signals. No guarantees — structure only.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/strategy-analysis"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100"
            >
              Run Strategy Analysis (free)
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15"
            >
              View pricing
            </Link>
            <Link
              href="/getting-started"
              className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15"
            >
              Getting started
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
