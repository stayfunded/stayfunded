// src/app/firms/[firm]/rules/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { getActiveAccount, isFirmPhase, type FirmPhase } from "@/lib/accounts";

// v1 stub list — wire to canonical rules later if you want to render everything here.
// For now, keep it as “most referenced rules” and link to /rules for the full dictionary.
const RULES: Array<{
  slug: string;
  name: string;
  category: string;
  whyItMatters: string;
}> = [
  {
    slug: "trailing-drawdown",
    name: "Trailing drawdown",
    category: "drawdown-mechanics",
    whyItMatters:
      "This is the rule that quietly changes the risk model. If your plan ignores it, your plan is not real for this firm.",
  },
  {
    slug: "daily-loss-limit",
    name: "Daily loss limit",
    category: "daily-constraints",
    whyItMatters:
      "This is where good traders die: one emotional day becomes a hard failure. Your plan needs explicit behavior for this zone.",
  },
  {
    slug: "profit-target-asymmetry",
    name: "Profit target asymmetry",
    category: "incentives",
    whyItMatters:
      "Passing is work. Failing is easy. This shapes pacing, sizing, and why most people start forcing trades.",
  },
  {
    slug: "scaling-and-contract-limits",
    name: "Scaling and contract limits",
    category: "sizing",
    whyItMatters:
      "These limits define how you’re allowed to express risk. A generic sizing model often doesn’t survive here.",
  },
  {
    slug: "time-pressure-and-inactivity",
    name: "Time pressure and inactivity rules",
    category: "time-constraints",
    whyItMatters:
      "Time forcing is a hidden killer. It changes trade selection and pushes traders into low-quality activity.",
  },
];

function titleCase(s: string) {
  return (s || "")
    .split("-")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function firmTitle(slug: string) {
  const map: Record<string, string> = {
    topstep: "Topstep",
    apex: "Apex Trader Funding",
    earn2trade: "Earn2Trade",
    bulenox: "Bulenox",
    "take-profit-trader": "Take Profit Trader",
  };
  return map[(slug || "").trim().toLowerCase()] ?? titleCase(slug);
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-sm font-semibold tracking-tight text-gray-900">{children}</div>;
}

function Chip({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "warn";
}) {
  const cls =
    tone === "warn"
      ? "bg-amber-50 text-amber-800 ring-amber-200"
      : "bg-gray-50 text-gray-700 ring-gray-200";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${cls}`}
    >
      {children}
    </span>
  );
}

function buildRuleHref(slug: string, firm: string, phase: FirmPhase | null) {
  const base = `/rules/${slug}`;
  const qs = new URLSearchParams();
  qs.set("firm", firm);
  if (phase) qs.set("phase", phase);
  qs.set("tier", "public");
  return `${base}?${qs.toString()}`;
}

export default function FirmRulesIndexPage({ params }: { params: { firm: string } }) {
  const sp = useSearchParams();

  const firm = (params.firm || "").trim().toLowerCase();
  const firmName = useMemo(() => firmTitle(firm), [firm]);

  // Optional phase override via query
  const phaseFromQuery = (sp.get("phase") || "").trim().toLowerCase();
  const [activePhase, setActivePhase] = useState<FirmPhase | null>(null);

  useEffect(() => {
    const a = getActiveAccount();
    if (a && a.firmSlug?.toLowerCase() === firm && isFirmPhase(a.phase)) {
      setActivePhase(a.phase);
    } else {
      setActivePhase(null);
    }
  }, [firm]);

  const phase: FirmPhase | null = useMemo(() => {
    if (isFirmPhase(phaseFromQuery)) return phaseFromQuery;
    if (activePhase && isFirmPhase(activePhase)) return activePhase;
    return null;
  }, [phaseFromQuery, activePhase]);

  const rulesIndexHref = useMemo(() => {
    const qs = new URLSearchParams();
    qs.set("firm", firm);
    if (phase) qs.set("phase", phase);
    return `/rules?${qs.toString()}`;
  }, [firm, phase]);

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-5xl px-6 py-10 md:px-10">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Link
            href={`/firms/${firm}`}
            className="font-semibold text-amber-700 hover:text-amber-800"
          >
            ← Back to {firmName}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-600">Rules</span>
        </div>

        {/* Header */}
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              {firmName} — rules & grading mechanics
            </h1>

            <p className="mt-2 max-w-3xl text-sm text-gray-600">
              This is the rulebook you’re actually trading. Your strategy only “counts” if it survives these definitions
              and enforcement. The playbooks exist to show how professional prop traders structure trading under this
              rulebook, phase by phase.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Chip>{firmName}</Chip>
              {phase ? <Chip tone="warn">Phase: {titleCase(phase)}</Chip> : null}
              <Chip>{phase ? "Phase context from active account (or ?phase=)" : "Set ?phase= for phase context"}</Chip>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard"
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Dashboard
            </Link>
            <Link
              href={rulesIndexHref}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              Open full rules dictionary
            </Link>
          </div>
        </div>

        {/* How to use this */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <SectionTitle>What this page is</SectionTitle>
            <p className="mt-2 text-sm text-gray-600">
              A firm-specific starting point: the rules that most often decide eligibility.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <SectionTitle>How professionals use it</SectionTitle>
            <p className="mt-2 text-sm text-gray-600">
              They size and pace trading so normal variance doesn’t collide with hard limits — especially early in a phase.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <SectionTitle>What to do next</SectionTitle>
            <p className="mt-2 text-sm text-gray-600">
              Open the phase playbook for your account, then use rules pages to verify definitions when anything is unclear.
            </p>
          </div>
        </div>

        {/* Rule list */}
        <div className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-lg font-semibold text-gray-900">
                Most referenced rules
              </div>
              <div className="mt-1 text-sm text-gray-600">
                If a trader blows an account, it’s usually one of these mechanics.
              </div>
            </div>

            <div className="text-xs font-semibold text-gray-500">
              {phase ? `Links include firm + phase (${phase})` : "Links include firm (add ?phase= to include phase)"}
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            {RULES.map((r) => (
              <Link
                key={r.slug}
                href={buildRuleHref(r.slug, firm, phase)}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:bg-gray-50"
              >
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <div className="text-base font-semibold text-gray-900">{r.name}</div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {r.category}
                    </div>
                    <div className="mt-3 text-sm text-gray-600">{r.whyItMatters}</div>
                  </div>
                  <div className="shrink-0 text-sm font-semibold text-amber-700">
                    Open →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <div className="text-sm font-semibold text-gray-900">Full rule dictionary</div>
            <div className="mt-2 text-sm text-gray-600">
              The complete rule index lives in the rule dictionary. Use it when you want every rule, not just the most common killers.
            </div>
            <div className="mt-4">
              <Link
                href={rulesIndexHref}
                className="inline-flex rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
              >
                Open full rules dictionary →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
