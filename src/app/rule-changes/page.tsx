// src/app/rule-changes/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type RuleChange = {
  id: string;
  firm: string; // display name
  firmSlug: string;
  effectiveDate: string; // ISO or readable
  changed: string; // what changed (neutral)
  whyItMatters: string; // impact framing
  sourceLabel: string; // "Firm update" etc
  sourceUrl: string; // link to firm source
  category: "Rule" | "Term";
};

// Go-live safe default: no fake placeholder rows.
// Real entries can be wired later from Supabase or a static dataset.
const SEED_CHANGES: RuleChange[] = [];

function Pill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
        active
          ? "bg-white text-black"
          : "border border-white/15 bg-white/5 text-white/80 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

export default function RuleChangesPage() {
  const [filter, setFilter] = useState<"All" | "Rule" | "Term">("All");

  useEffect(() => {
    // Lightweight SEO reinforcement for a client page.
    try {
      document.title = "Rule Changes — Keep Your Prop Firm Playbook Aligned | StayFunded";
    } catch {
      // ignore
    }
  }, []);

  const rows = useMemo(() => {
    const base = [...SEED_CHANGES];
    if (filter === "All") return base;
    return base.filter((c) => c.category === filter);
  }, [filter]);

  return (
    <main className="min-h-screen bg-[#070A13]">
      {/* subtle background glow */}
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-40 left-10 h-[420px] w-[420px] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-[420px] w-[420px] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-10 md:px-10">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Rule Changes
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-white/65">
              A firm-specific playbook only works against the firm’s current definitions. When rules or terms change,
              traders get disqualified running last month’s plan. This tracker keeps the rulebook visible: what changed,
              why it matters, and the firm source.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Pill active={filter === "All"} onClick={() => setFilter("All")}>
                All
              </Pill>
              <Pill active={filter === "Rule"} onClick={() => setFilter("Rule")}>
                Rules
              </Pill>
              <Pill active={filter === "Term"} onClick={() => setFilter("Term")}>
                Terms
              </Pill>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/discovery"
              className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-300"
            >
              Find my plan (Discovery)
            </Link>
            <Link
              href="/firms"
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Open playbooks
            </Link>
          </div>
        </div>

        {/* Why this matters (plan-first framing) */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="text-sm font-semibold text-white/90">
            Why serious traders check this
          </div>

          <div className="mt-2 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
              <div className="text-xs font-semibold text-white/60">THE REALITY</div>
              <div className="mt-1 font-semibold text-white/85">
                Firms grade the current rulebook.
              </div>
              <div className="mt-2">
                Prop firms don’t grade intentions or “good trading.” They grade outcomes under definitions and enforcement.
                When those definitions shift, the same behavior can produce different results.
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
              <div className="text-xs font-semibold text-white/60">THE PLAN ANGLE</div>
              <div className="mt-1 font-semibold text-white/85">
                Rule changes invalidate plans.
              </div>
              <div className="mt-2">
                A firm-specific playbook is a structured plan designed for a specific set of constraints. If the constraints
                change, professionals update the plan — they don’t keep improvising and hope it works.
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
              <div className="text-xs font-semibold text-white/60">IS</div>
              <div className="mt-1 font-semibold text-white/85">
                A change log
              </div>
              <div className="mt-2">
                What changed → why it matters → link to the firm source.
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
              <div className="text-xs font-semibold text-white/60">IS</div>
              <div className="mt-1 font-semibold text-white/85">
                Rules vs terms separated
              </div>
              <div className="mt-2">
                A term change can be as consequential as a rule change. We track both.
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
              <div className="text-xs font-semibold text-white/60">IS NOT</div>
              <div className="mt-1 font-semibold text-white/85">
                Trade advice
              </div>
              <div className="mt-2">
                No signals. No predictions. No guarantees.
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-white/50">
            Practical use: check this before buying attempts, and periodically while active.
          </div>
        </div>

        {/* Table */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <div className="grid grid-cols-12 gap-3 bg-black/30 px-5 py-3 text-xs font-semibold text-white/60">
            <div className="col-span-2">Firm</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Effective</div>
            <div className="col-span-3">What changed</div>
            <div className="col-span-2">Why it matters</div>
            <div className="col-span-1 text-right">Source</div>
          </div>

          <div className="divide-y divide-white/10">
            {rows.length === 0 ? (
              <div className="px-5 py-6 text-sm text-white/70">
                No rule changes published yet.
              </div>
            ) : (
              rows.map((c) => (
                <div key={c.id} className="grid grid-cols-12 gap-3 px-5 py-4 text-sm">
                  <div className="col-span-2">
                    <Link
                      href={`/firms/${c.firmSlug}`}
                      className="font-semibold text-white hover:underline"
                    >
                      {c.firm}
                    </Link>
                  </div>

                  <div className="col-span-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        c.category === "Rule"
                          ? "border border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                          : "border border-indigo-400/20 bg-indigo-400/10 text-indigo-200"
                      }`}
                    >
                      {c.category}
                    </span>
                  </div>

                  <div className="col-span-2 text-white/70">{c.effectiveDate}</div>
                  <div className="col-span-3 text-white/85">{c.changed}</div>
                  <div className="col-span-2 text-white/70">{c.whyItMatters}</div>

                  <div className="col-span-1 text-right">
                    <a
                      href={c.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-white/70 hover:text-white"
                      title={c.sourceLabel}
                    >
                      Link
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-white/10 bg-black/20 px-5 py-4 text-xs text-white/50">
            No public entries yet. We’ll publish neutral change summaries with firm sources as soon as the tracker is populated.
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-7">
          <div className="text-lg font-semibold tracking-tight text-white">
            Keep your playbook aligned to the current rulebook.
          </div>
          <div className="mt-2 text-sm text-white/65">
            If you’re trading a firm-specific plan, you should treat rule changes as plan changes. Verify constraints, then
            operate the phase you’re in with the matching playbook.
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/rule-changes"
              className="rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Refresh this tracker
            </Link>
            <Link
              href="/firms"
              className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-300"
            >
              Open playbooks
            </Link>
          </div>
          <div className="mt-3 text-xs text-white/50">
            No signals. No trade calls. Built for structured plans under real firm rules.
          </div>
        </div>
      </div>
    </main>
  );
}
