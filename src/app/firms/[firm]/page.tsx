// src/app/firms/[firm]/phases/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";

type FirmPhase =
  | "discovery"
  | "evaluation"
  | "stabilization"
  | "payout"
  | "maintenance";

function titleizeFirm(slug: string) {
  const map: Record<string, string> = {
    topstep: "Topstep",
    apex: "Apex Trader Funding",
    bulenox: "Bulenox",
    earn2trade: "Earn2Trade",
    "take-profit-trader": "Take Profit Trader",
  };

  return (
    map[slug.toLowerCase()] ??
    slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

const PHASES: Array<{
  value: FirmPhase;
  title: string;
  desc: string;
}> = [
  {
    value: "discovery",
    title: "Discovery",
    desc: "Figure out what to buy and what to avoid before you spend money on attempts.",
  },
  {
    value: "evaluation",
    title: "Evaluation",
    desc: "Pass the test without getting killed by rules. Survival first. Speed is a trap.",
  },
  {
    value: "stabilization",
    title: "Stabilization",
    desc: "You passed. Now don’t give the account back. Reduce variance and protect the buffer.",
  },
  {
    value: "payout",
    title: "Payout",
    desc: "Trade with withdrawals in mind. Payout rules become the new landmines.",
  },
  {
    value: "maintenance",
    title: "Maintenance",
    desc: "Keep the account alive long-term by staying boring on purpose.",
  },
];

export default function FirmPhasesHubPage({
  params,
}: {
  params: { firm: string };
}) {
  const firmSlug = useMemo(
    () => (params.firm || "").trim().toLowerCase(),
    [params.firm]
  );
  const firmName = useMemo(() => titleizeFirm(firmSlug), [firmSlug]);

  useEffect(() => {
    try {
      document.title = `${firmName} — Choose Your Phase | StayFunded`;
    } catch {
      // ignore
    }
  }, [firmName]);

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-14">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/firms/${firmSlug}`}
            className="text-sm font-semibold text-amber-700 hover:text-amber-800"
          >
            ← Back to {firmName}
          </Link>
          <span className="text-sm text-gray-400">/</span>
          <span className="text-sm text-gray-600">Phases</span>
        </div>

        {/* Header */}
        <div className="mt-6 space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
            {firmName} — choose your phase
          </h1>

          <p className="max-w-3xl text-base text-gray-700">
            Pick the phase you’re in. We’ll open the{" "}
            <span className="font-semibold text-gray-900">playbook</span>{" "}
            for that phase — the straight, firm-specific guide for how to trade{" "}
            {firmName} without getting clipped by the rules.
          </p>

          <p className="max-w-3xl text-sm text-gray-600">
            No signals. No trade calls. No promises. Just: what matters in this phase,
            what kills accounts, and what to do before you trade.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href={`/firms/${firmSlug}`}
              className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Firm overview
            </Link>
            <Link
              href={`/firms/${firmSlug}/rules`}
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              Rules overview
            </Link>
            <Link
              href="/discovery"
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              Help me choose (Discovery)
            </Link>
          </div>
        </div>

        {/* Phase cards */}
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {PHASES.map((p) => (
            <div
              key={p.value}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="text-lg font-semibold text-gray-900">{p.title}</div>
              <p className="mt-2 text-sm text-gray-600">{p.desc}</p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link
                  href={`/firms/${encodeURIComponent(
                    firmSlug
                  )}/phases/playbooks/${encodeURIComponent(p.value)}`}
                  className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  Open playbook →
                </Link>

                <Link
                  href={`/firms/${encodeURIComponent(
                    firmSlug
                  )}/rules?phase=${encodeURIComponent(p.value)}`}
                  className="text-sm font-semibold text-gray-700 hover:text-gray-900"
                >
                  Rules for this phase →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <div className="text-sm font-semibold text-gray-900">
            Where the daily help lives
          </div>
          <p className="mt-2 max-w-3xl text-sm text-gray-700">
            Inside each playbook you’ll find the “Before you trade” checklist plus
            firm + phase social/accountability (Discord + pairing). This page is just
            the phase selector.
          </p>
        </div>
      </div>
    </main>
  );
}
