// src/app/discovery/page.tsx
"use client";

import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  DEFAULT_REQUEST,
  getDiscoveryDataset,
  runDiscovery,
  type DiscoveryRecommendation,
  type FactPriority,
  type TradeoffDelta,
} from "@/lib/discovery";

/** -------------------------
 * Small local helpers
 * ------------------------*/

function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <div className="text-[11px] font-semibold text-white/60">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-sm font-semibold tracking-tight text-white/90">
      {children}
    </div>
  );
}

function formatMoney(n: number) {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

function buildSideBySideRows(
  recommended: DiscoveryRecommendation,
  alternative: DiscoveryRecommendation
): TradeoffDelta[] {
  const aMap = new Map(alternative.comparisonRows.map((r) => [r.label, r]));
  return recommended.comparisonRows.map((r) => {
    const a = aMap.get(r.label);
    const altVal = a?.recommended ?? "";
    return {
      label: r.label,
      recommended: r.recommended,
      alternative: altVal,
      differs: r.recommended !== altVal,
    };
  });
}

function PressureBar({
  label,
  left,
  right,
  pct,
}: {
  label: string;
  left: string;
  right: string;
  pct: number; // 0..100
}) {
  const clamped = Math.max(0, Math.min(100, pct));

  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="flex items-center justify-between text-[11px] font-semibold text-white/60">
        <span>{label}</span>
        <span className="text-white/45">{right}</span>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-white/50 transition-all"
          style={{ width: `${clamped}%` }}
        />
      </div>

      <div className="mt-2 text-xs font-semibold text-white/75">{left}</div>
    </div>
  );
}

function MiniLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-semibold tracking-wide text-white/55">
      {children}
    </div>
  );
}

function MiniValue({ children }: { children: React.ReactNode }) {
  return <div className="mt-1 text-sm font-semibold text-white">{children}</div>;
}

function PressureBlock({
  title,
  items,
}: {
  title: string;
  items: Array<{ k: string; v: string }>;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-[11px] font-semibold tracking-wide text-white/55">
        {title}
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((it) => (
          <div key={it.k}>
            <div className="text-[11px] font-semibold text-white/45">{it.k}</div>
            <div className="mt-1 text-sm font-semibold text-white">{it.v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlurGateBlock({
  locked,
  title,
  subtitle,
  children,
}: {
  locked: boolean;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20">
      <div className={locked ? "blur-sm select-none pointer-events-none" : ""}>
        {children}
      </div>

      {locked ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl border border-white/10 bg-black/70 px-4 py-3 text-center">
            <div className="text-xs font-semibold text-white/85">{title}</div>
            {subtitle ? (
              <div className="mt-1 text-xs text-white/55">{subtitle}</div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function isValidEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

/** -------------------------
 * Discovery controls
 * ------------------------*/

type FocusKey = "survivability" | "cost" | "speed" | "reset";

function prioritiesForFocus(focus: FocusKey): FactPriority[] {
  switch (focus) {
    case "cost":
      return ["total_cost", "kill_rules", "reset_exposure"];
    case "speed":
      return ["phase_count", "time_pressure", "kill_rules"];
    case "reset":
      return ["reset_exposure", "kill_rules", "total_cost"];
    case "survivability":
    default:
      return ["kill_rules", "time_pressure", "reset_exposure"];
  }
}

function FocusCard({
  title,
  desc,
  active,
  onClick,
}: {
  title: string;
  desc: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-2xl border p-4 text-left transition",
        active
          ? "border-white/30 bg-white/10"
          : "border-white/10 bg-white/5 hover:bg-white/10",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-white">{title}</div>
        {active ? (
          <div className="rounded-full border border-white/15 bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-white/80">
            Selected
          </div>
        ) : null}
      </div>
      <div className="mt-1 text-sm text-white/65">{desc}</div>
    </button>
  );
}

function FactPriorityControls({
  value,
  onChange,
}: {
  value: FactPriority[];
  onChange: (v: FactPriority[]) => void;
}) {
  const options: { key: FactPriority; label: string }[] = [
    { key: "kill_rules", label: "Fewer kill rules" },
    { key: "time_pressure", label: "Less time pressure" },
    { key: "reset_exposure", label: "Lower reset exposure" },
    { key: "total_cost", label: "Lower total cost" },
    { key: "phase_count", label: "Fewer phases" },
  ];

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {options.map((o) => {
        const active = value.includes(o.key);
        return (
          <button
            key={o.key}
            type="button"
            onClick={() =>
              onChange(
                active ? value.filter((v) => v !== o.key) : [...value, o.key]
              )
            }
            className={[
              "rounded-full px-3 py-1.5 text-xs font-semibold transition",
              active
                ? "bg-white text-gray-900"
                : "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10",
            ].join(" ")}
          >
            {o.label}
          </button>
        );
      })}
      <div className="ml-1 text-xs font-semibold text-white/45">
        Facts-only re-ordering.
      </div>
    </div>
  );
}

/** -------------------------
 * Page
 * ------------------------*/

const UNLOCK_KEY = "sf_discovery_unlocked_v1";
const UNLOCK_EMAIL_KEY = "sf_discovery_unlock_email_v1";

export default function DiscoveryPage() {
  const dataset = useMemo(() => getDiscoveryDataset(), []);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  // Gate: require a single selection before running.
  const [focus, setFocus] = useState<FocusKey | null>(null);

  // Two-phase config:
  const [pendingPriorities, setPendingPriorities] = useState<FactPriority[]>([]);
  const [activePriorities, setActivePriorities] = useState<FactPriority[]>([]);
  const [hasRun, setHasRun] = useState(false);
  const [runToken, setRunToken] = useState(0);

  // Deterministic “analyzing” phase only when user runs (or re-runs).
  const ANALYZE_COPY = useMemo(
    () => [
      "Checking rule constraints and disqualifiers",
      "Estimating typical cost to reach funded",
      "Comparing enforcement and time pressure",
      "Selecting the best-fit plan context",
    ],
    []
  );
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeIdx, setAnalyzeIdx] = useState(0);

  // Unlock (email-only, optional; local-only storage in v1)
  const [unlocked, setUnlocked] = useState(false);
  const [unlockEmail, setUnlockEmail] = useState("");
  const [unlockError, setUnlockError] = useState<string | null>(null);

  // UI: collapse “Step 2 (optional)”
  const [advancedOpen, setAdvancedOpen] = useState(false);

  useEffect(() => {
    // Lightweight SEO reinforcement for a client page.
    try {
      document.title =
        "Discovery — Choose a Prop Firm Plan | StayFunded";
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem(UNLOCK_KEY);
      if (v === "1") setUnlocked(true);

      const savedEmail = window.localStorage.getItem(UNLOCK_EMAIL_KEY);
      if (savedEmail) setUnlockEmail(savedEmail);
    } catch {
      // ignore
    }
  }, []);


  useEffect(() => {
    if (runToken === 0) return;

    setAnalyzing(true);
    setAnalyzeIdx(0);

    const rotate = window.setInterval(() => {
      setAnalyzeIdx((i) => (i + 1) % ANALYZE_COPY.length);
    }, 1500);

    const done = window.setTimeout(() => {
      setAnalyzing(false);
      window.clearInterval(rotate);
    }, 8000);

    return () => {
      window.clearInterval(rotate);
      window.clearTimeout(done);
    };
  }, [runToken, ANALYZE_COPY]);

  // Build request only from active priorities (i.e., last run).
  const request = useMemo(() => {
    return { ...DEFAULT_REQUEST, priorities: activePriorities };
  }, [activePriorities]);

  const result = useMemo(() => {
    if (!hasRun) return null;
    return runDiscovery(request, dataset);
  }, [hasRun, request, dataset]);

  // UI state below the fold
  const [tradeoffsOpen, setTradeoffsOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [selectedAltId, setSelectedAltId] = useState<string | null>(null);

  const selectedAlt = useMemo(() => {
    if (!result || !selectedAltId) return null;
    return (
      result.alternatives.find((a) => a.account.accountId === selectedAltId) ??
      null
    );
  }, [result, selectedAltId]);

  const comparisonRows = useMemo(() => {
    if (!result || !compareOpen || !selectedAlt) return [];
    return buildSideBySideRows(result.primary, selectedAlt);
  }, [compareOpen, result, selectedAlt]);

  const scrollToResults = () => {
    if (!resultsRef.current) return;
    resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const runNow = () => {
    if (!focus) return;

    const base = prioritiesForFocus(focus);
    const effective = pendingPriorities.length > 0 ? pendingPriorities : base;

    setActivePriorities(effective);
    setHasRun(true);
    setTradeoffsOpen(false);
    setCompareOpen(false);
    setSelectedAltId(null);
    setRunToken((t) => t + 1);

    window.setTimeout(scrollToResults, 50);
  };

  const dirtyAfterRun =
    hasRun &&
    JSON.stringify(activePriorities) !==
      JSON.stringify(
        pendingPriorities.length
          ? pendingPriorities
          : prioritiesForFocus(focus ?? "survivability")
      );

  // If focus changes, set default pending priorities (but do not auto-run).
  useEffect(() => {
    if (!focus) {
      setPendingPriorities([]);
      return;
    }
    setPendingPriorities(prioritiesForFocus(focus));
  }, [focus]);

  const unlockNow = () => {
    setUnlockError(null);
    if (!isValidEmail(unlockEmail)) {
      setUnlockError("Enter a valid email to unlock.");
      return;
    }
    setUnlocked(true);
    try {
      window.localStorage.setItem(UNLOCK_KEY, "1");
      window.localStorage.setItem(UNLOCK_EMAIL_KEY, unlockEmail.trim());
    } catch {
      // ignore
    }
  };

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
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
              Discovery
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-white/65">
              Discovery helps you choose a firm/account context that supports a coherent plan.
              It compares real constraints (rules, terms, typical costs) so you can pick
              something you can actually operate — then follow the matching playbook.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                Plan-first
              </div>
              <div className="text-xs font-semibold text-white/50">
                Facts-first mechanics — not signals, and not a performance forecast.
              </div>
            </div>
          </div>

          <button
            type="button"
            className="text-sm font-semibold text-white/70 hover:text-white"
            disabled
            title="Constraints panel comes next (v1.1)"
          >
            Adjust constraints
          </button>
        </div>

        {/* How it works */}
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-[11px] font-semibold text-white/55">
              1) Choose a lens
            </div>
            <div className="mt-1 text-sm font-semibold text-white">
              What matters most for your plan
            </div>
            <div className="mt-1 text-xs text-white/55">
              Survivability, cost, speed, or reset exposure.
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-[11px] font-semibold text-white/55">2) Run</div>
            <div className="mt-1 text-sm font-semibold text-white">
              Compare constraints
            </div>
            <div className="mt-1 text-xs text-white/55">
              Rules, terms, enforcement signals, typical costs.
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-[11px] font-semibold text-white/55">
              3) Follow the playbook
            </div>
            <div className="mt-1 text-sm font-semibold text-white">
              Trade the phase you’re in
            </div>
            <div className="mt-1 text-xs text-white/55">
              Use the firm + phase playbook that matches the account.
            </div>
          </div>
        </div>

        {/* Step 1 + Step 2 (optional) + Run */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/70">
                Step 1
                <span className="text-white/40">/</span>
                Choose your lens
              </div>

              <div className="mt-3 grid gap-3 md:grid-cols-2">
                <FocusCard
                  title="Plan survivability first"
                  desc="Prioritize fewer kill rules and lower forcing mechanics."
                  active={focus === "survivability"}
                  onClick={() => setFocus("survivability")}
                />
                <FocusCard
                  title="Lowest typical cost"
                  desc="Prioritize typical cost to reach funded status, then mechanics."
                  active={focus === "cost"}
                  onClick={() => setFocus("cost")}
                />
                <FocusCard
                  title="Fastest path (less waiting)"
                  desc="Prioritize fewer phases and lower time pressure."
                  active={focus === "speed"}
                  onClick={() => setFocus("speed")}
                />
                <FocusCard
                  title="Lowest reset exposure"
                  desc="Prioritize how punishing resets are under normal variance."
                  active={focus === "reset"}
                  onClick={() => setFocus("reset")}
                />
              </div>

              {/* Step 2 (optional) collapsed */}
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => setAdvancedOpen((v) => !v)}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-left"
                >
                  <div>
                    <div className="text-xs font-semibold text-white/70">
                      Step 2 (optional)
                    </div>
                    <div className="mt-1 text-sm font-semibold text-white">
                      Fine-tune what gets weighted first
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-white/55">
                    {advancedOpen ? "Hide" : "Show"}
                  </div>
                </button>

                {advancedOpen ? (
                  <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-sm text-white/65">
                      Facts-only. This changes ranking weight, not the underlying facts.
                    </div>
                    <FactPriorityControls
                      value={pendingPriorities}
                      onChange={setPendingPriorities}
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-3 md:w-[320px]">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-[11px] font-semibold text-white/55">
                  What you’ll get
                </div>
                <div className="mt-2 text-sm font-semibold text-white">
                  A best-fit firm/account context
                </div>
                <div className="mt-2 text-xs text-white/55">
                  Then you follow the firm + phase playbook that matches it.
                </div>
              </div>

              <button
                type="button"
                onClick={runNow}
                disabled={!focus}
                className={[
                  "rounded-2xl px-4 py-3 text-sm font-semibold transition",
                  focus
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-white/10 text-white/40 cursor-not-allowed",
                ].join(" ")}
              >
                Find my firm + plan
              </button>

              {hasRun && dirtyAfterRun ? (
                <button
                  type="button"
                  onClick={runNow}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Re-run with new settings
                </button>
              ) : null}

              <div className="text-xs text-white/50">
                No signup required to see the recommendation.
              </div>

              <button
                type="button"
                onClick={scrollToResults}
                className="text-left text-xs font-semibold text-white/55 hover:text-white/75"
              >
                Results appear below ↓
              </button>

              <div className="mt-2 text-xs text-white/45">
                After you choose a firm/account, open the firm hub and follow the playbook
                for the phase you’re in.
              </div>
            </div>
          </div>
        </div>

        {/* Results section anchor */}
        <div ref={resultsRef} className="mt-10">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white">
                Results
              </h2>
              <div className="mt-1 text-sm text-white/60">
                Best-fit first. Alternatives below. Full comparison optionally unlocked.
              </div>
              <div className="mt-2 text-xs font-semibold text-white/45">
                Based on constraints — not trading style.
              </div>
            </div>
            <div className="text-xs font-semibold text-white/45">
              Facts-only ranking
            </div>
          </div>

          {/* Placeholder (before run) */}
          {!hasRun ? (
            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-7">
              <SectionTitle>Your best-fit context will appear here</SectionTitle>
              <div className="mt-2 text-sm text-white/65">
                Choose your lens above, then click{" "}
                <span className="font-semibold text-white/80">
                  Find my firm + plan
                </span>
                .
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs font-semibold text-white/60">
                    Terms & costs
                  </div>
                  <div className="mt-2 h-3 w-2/3 rounded-full bg-white/10" />
                  <div className="mt-2 h-3 w-1/2 rounded-full bg-white/10" />
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs font-semibold text-white/60">
                    Rules & disqualifiers
                  </div>
                  <div className="mt-2 h-3 w-3/4 rounded-full bg-white/10" />
                  <div className="mt-2 h-3 w-2/5 rounded-full bg-white/10" />
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="text-xs font-semibold text-white/60">
                    Plan fit
                  </div>
                  <div className="mt-2 h-3 w-1/2 rounded-full bg-white/10" />
                  <div className="mt-2 h-3 w-2/3 rounded-full bg-white/10" />
                </div>
              </div>

              <div className="mt-6 text-xs text-white/45">
                Then follow the firm- and phase-specific playbook.
              </div>
            </div>
          ) : null}

          {/* Analyzing overlay */}
          {hasRun && analyzing ? (
            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold text-white/80">
                Analyzing…
              </div>
              <div className="mt-2 text-sm text-white/65">
                {ANALYZE_COPY[analyzeIdx]}
              </div>
              <div className="mt-4 text-xs text-white/50">
                No signals. No prediction. Just constraint fit.
              </div>
            </div>
          ) : null}

          {/* Results */}
          {hasRun && !analyzing && result ? (
            <>
              {(() => {
                const primary = result.primary;
                const alternatives = result.alternatives;

                const primaryTimePressure = primary.risk.pressureRules.some((r) =>
                  r.ruleSlug.includes("time")
                )
                  ? "Higher"
                  : "Lower";

                const primaryResetExposure =
                  primary.cost.resetExposure && primary.cost.resetExposure > 0
                    ? formatMoney(primary.cost.resetExposure)
                    : "None";

                const primaryTermPressureItems = [
                  {
                    k: "Typical cost to get funded",
                    v: formatMoney(primary.cost.typicalToFund),
                  },
                  { k: "Reset exposure", v: primaryResetExposure },
                ];

                const primaryRulePressureItems = [
                  { k: "Kill rules", v: `${primary.risk.killRules.length}` },
                  { k: "Time pressure", v: primaryTimePressure },
                ];

                const openTradeoffs = () => {
                  setCompareOpen(false);
                  setTradeoffsOpen((v) => !v);
                };

                const openCompareWith = (altId: string) => {
                  setTradeoffsOpen(false);
                  setSelectedAltId(altId);
                  setCompareOpen(true);
                };

                const openCompare = () => {
                  setTradeoffsOpen(false);
                  setCompareOpen(true);
                  if (!selectedAltId && alternatives[0]?.account.accountId) {
                    setSelectedAltId(alternatives[0].account.accountId);
                  }
                };

                // Blur policy: keep recommendation intact; gate deeper mechanics.
                const whyWinsFree = primary.whyThisWins.slice(0, 4);
                const whyWinsGated = primary.whyThisWins.slice(4, 6);
                const giveUpGated = primary.whatYouGiveUp.slice(0, 4);

                return (
                  <>
                    {/* Hero recommendation */}
                    <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-sm">
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-40" />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
                      </div>

                      <div className="relative p-6">
                        <div className="absolute left-0 top-0 h-full w-[6px] bg-gradient-to-b from-emerald-300/70 via-emerald-300/20 to-transparent" />

                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="pl-3">
                            <div className="text-sm font-semibold text-white/90">
                              {primary.firm.displayName}
                            </div>
                            <div className="mt-1 text-2xl font-semibold tracking-tight text-white">
                              {primary.account.accountName}
                            </div>

                            <div className="mt-2 text-sm text-white/70">
                              Best-fit context for a coherent plan under this firm’s rules.
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-3">
                              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                                Recommended
                              </div>

                              <Link
                                href={`/firms/${primary.firm.firmSlug}`}
                                className="text-xs font-semibold text-white/70 hover:text-white"
                              >
                                Open this firm hub (playbooks + rules)
                              </Link>
                            </div>
                          </div>

                          <div className="grid gap-2 md:w-[420px] md:grid-cols-3">
                            <StatPill
                              label="Typical cost to get funded"
                              value={formatMoney(primary.cost.typicalToFund)}
                            />
                            <StatPill
                              label="Kill rules"
                              value={`${primary.risk.killRules.length}`}
                            />
                            <StatPill
                              label="Time pressure"
                              value={primaryTimePressure}
                            />
                          </div>
                        </div>

                        <div className="mt-6 grid gap-3 md:grid-cols-2">
                          <PressureBlock
                            title="TERMS & COSTS"
                            items={primaryTermPressureItems}
                          />
                          <PressureBlock
                            title="RULES & DISQUALIFIERS"
                            items={primaryRulePressureItems}
                          />
                        </div>

                        <div className="mt-5 grid gap-3 md:grid-cols-3">
                          <PressureBar
                            label="Rule pressure snapshot"
                            left={`${primary.risk.killRules.length} kill rule(s)`}
                            right="Lower is easier"
                            pct={Math.min(100, primary.risk.killRules.length * 35)}
                          />
                          <PressureBar
                            label="Time forcing"
                            left={
                              primaryTimePressure === "Higher"
                                ? "More time pressure on decisions"
                                : "Less time pressure on decisions"
                            }
                            right="Mechanics"
                            pct={primaryTimePressure === "Higher" ? 75 : 25}
                          />
                          <PressureBar
                            label="Reset exposure"
                            left={
                              primaryResetExposure === "None"
                                ? "Lower reset exposure"
                                : `Reset cost: ${primaryResetExposure}`
                            }
                            right="Cost reality"
                            pct={primaryResetExposure === "None" ? 20 : 65}
                          />
                        </div>

                        {/* Earned unlock (only after results) */}
                        {!unlocked ? (
                          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                              <div className="max-w-2xl">
                                <div className="text-sm font-semibold text-white">
                                  Unlock deeper comparisons (free)
                                </div>
                                <div className="mt-1 text-sm text-white/65">
                                  Your recommendation above is complete. This unlock adds the
                                  full side-by-side comparison and deeper “why / tradeoffs.”
                                </div>
                                <div className="mt-2 text-xs text-white/45">
                                Local-only unlock (saved in this browser). No password.

                                </div>
                              </div>

                              <div className="w-full md:w-[340px]">
                                <div className="flex gap-2">
                                  <input
                                    value={unlockEmail}
                                    onChange={(e) => setUnlockEmail(e.target.value)}
                                    placeholder="you@email.com"
                                    className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/25"
                                  />
                                  <button
                                    type="button"
                                    onClick={unlockNow}
                                    className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100"
                                  >
                                    Unlock
                                  </button>
                                </div>

                                {unlockError ? (
                                  <div className="mt-2 text-xs font-semibold text-rose-200">
                                    {unlockError}
                                  </div>
                                ) : null}

                                <div className="mt-2 text-xs text-white/45">
                                  You can skip and still use Discovery.
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : null}

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                            <SectionTitle>WHY THIS FITS A PLAN</SectionTitle>

                            <ul className="mt-3 space-y-2 text-sm text-white/75">
                              {whyWinsFree.map((b, i) => (
                                <li key={`free-${i}`} className="flex gap-2">
                                  <span className="mt-0.5 text-emerald-300">✓</span>
                                  <span>{b}</span>
                                </li>
                              ))}
                            </ul>

                            {whyWinsGated.length > 0 ? (
                              <div className="mt-3">
                                <BlurGateBlock
                                  locked={!unlocked}
                                  title="Deeper mechanics (free unlock)"
                                  subtitle="Two more reasons this context fits a coherent plan"
                                >
                                  <div className="p-4">
                                    <ul className="space-y-2 text-sm text-white/75">
                                      {whyWinsGated.map((b, i) => (
                                        <li key={`g-${i}`} className="flex gap-2">
                                          <span className="mt-0.5 text-emerald-300">
                                            ✓
                                          </span>
                                          <span>{b}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </BlurGateBlock>
                              </div>
                            ) : null}
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                            <SectionTitle>WHAT YOU TRADE OFF</SectionTitle>
                            <p className="mt-2 text-xs text-white/50">
                              Every plan is a tradeoff. These are the meaningful ones.
                            </p>

                            <div className="mt-3">
                              <BlurGateBlock
                                locked={!unlocked}
                                title="Tradeoffs (free unlock)"
                                subtitle="What this context costs you vs alternatives"
                              >
                                <div className="p-4">
                                  <ul className="space-y-2 text-sm text-white/75">
                                    {giveUpGated.map((b, i) => (
                                      <li key={i} className="flex gap-2">
                                        <span className="mt-0.5 text-white/50">•</span>
                                        <span>{b}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </BlurGateBlock>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 flex flex-wrap items-center gap-3">
                          <a
                            href={primary.account.purchaseUrl}
                            className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100"
                          >
                            Buy this account
                          </a>

                          <button
                            type="button"
                            onClick={() => setTradeoffsOpen((v) => !v)}
                            className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                          >
                            {tradeoffsOpen ? "Hide tradeoffs" : "Show tradeoffs"}
                          </button>

                          <button
                            type="button"
                            onClick={openCompare}
                            className="text-sm font-semibold text-white/70 hover:text-white"
                          >
                            Compare alternatives
                          </button>

                          <Link
                            href={`/firms/${primary.firm.firmSlug}`}
                            className="text-sm font-semibold text-white/70 hover:text-white"
                          >
                            Open the playbooks for this firm →
                          </Link>
                        </div>

                        {/* Tradeoffs block (unchanged behavior; just copy framing) */}
                        {tradeoffsOpen ? (
                          <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
                            <SectionTitle>Tradeoffs (plain English)</SectionTitle>
                            <div className="mt-2 text-sm text-white/70">
                              This is where “plan fit” gets real: constraints that change how
                              you must operate to remain eligible.
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>

                    {/* Alternatives */}
                    <div className="mt-8">
                      <div className="mb-3 flex items-end justify-between">
                        <SectionTitle>Other viable contexts</SectionTitle>
                        <div className="text-xs text-white/50">
                          Still facts-first.
                        </div>
                      </div>

                      {alternatives.length === 0 ? (
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/65">
                          No alternatives are available yet.
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {alternatives.map((alt, idx) => {
                            const isSelected = selectedAltId === alt.account.accountId;
                            const altTimePressure = alt.risk.pressureRules.some((r) =>
                              r.ruleSlug.includes("time")
                            )
                              ? "Higher"
                              : "Lower";

                            const altResetExposure =
                              alt.cost.resetExposure && alt.cost.resetExposure > 0
                                ? formatMoney(alt.cost.resetExposure)
                                : "None";

                            return (
                              <div
                                key={alt.account.accountId}
                                className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5"
                              >
                                <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-white/35 to-transparent" />

                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                  <div className="min-w-0">
                                    <div className="text-xs font-semibold text-white/50">
                                      #{idx + 2}
                                    </div>
                                    <div className="mt-1 text-sm font-semibold text-white/90">
                                      {alt.firm.displayName}
                                    </div>
                                    <div className="mt-1 text-lg font-semibold text-white">
                                      {alt.account.accountName}
                                    </div>

                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                        <MiniLabel>TERMS & COSTS</MiniLabel>
                                        <MiniValue>{formatMoney(alt.cost.typicalToFund)}</MiniValue>
                                        <div className="mt-1 text-xs text-white/55">
                                          Reset exposure:{" "}
                                          <span className="text-white/75">{altResetExposure}</span>
                                        </div>
                                      </div>

                                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                                        <MiniLabel>RULES & DISQUALIFIERS</MiniLabel>
                                        <MiniValue>{alt.risk.killRules.length} kill rule(s)</MiniValue>
                                        <div className="mt-1 text-xs text-white/55">
                                          Time pressure:{" "}
                                          <span className="text-white/75">{altTimePressure}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      type="button"
                                      onClick={() => openCompareWith(alt.account.accountId)}
                                      className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                                        isSelected && compareOpen
                                          ? "bg-white text-gray-900"
                                          : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                                      }`}
                                    >
                                      Compare to #1
                                    </button>
                                    <a
                                      href={alt.account.purchaseUrl}
                                      className="rounded-xl border border-white/10 bg-transparent px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/5"
                                    >
                                      Buy instead
                                    </a>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Comparison */}
                    {compareOpen ? (
                      <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6">
                        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
                          <div>
                            <SectionTitle>Side-by-side comparison</SectionTitle>
                            {selectedAlt ? (
                              <div className="mt-2 text-sm text-white/65">
                                Recommended:{" "}
                                <span className="font-semibold text-white/85">
                                  {primary.firm.displayName} — {primary.account.accountName}
                                </span>
                                <br />
                                Alternative:{" "}
                                <span className="font-semibold text-white/85">
                                  {selectedAlt.firm.displayName} — {selectedAlt.account.accountName}
                                </span>
                              </div>
                            ) : (
                              <div className="mt-2 text-sm text-white/65">
                                No alternative selected.
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={() => setCompareOpen(false)}
                            className="text-sm font-semibold text-white/70 hover:text-white"
                          >
                            Close
                          </button>
                        </div>

                        {selectedAlt ? (
                          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
                            <div className="grid grid-cols-3 bg-black/30 px-4 py-3 text-xs font-semibold text-white/60">
                              <div>Dimension</div>
                              <div className="text-white/80">Recommended</div>
                              <div className="text-white/80">Alternative</div>
                            </div>

                            <div className="divide-y divide-white/10">
                              {comparisonRows.slice(0, 4).map((row) => {
                                const isHeader =
                                  !row.recommended &&
                                  !row.alternative &&
                                  row.differs === false;

                                if (isHeader) {
                                  return (
                                    <div
                                      key={`f-${row.label}`}
                                      className="bg-black/25 px-4 py-3 text-xs font-semibold tracking-wide text-white/60"
                                    >
                                      {row.label}
                                    </div>
                                  );
                                }

                                return (
                                  <div key={`f-${row.label}`} className="grid grid-cols-3 px-4 py-3 text-sm">
                                    <div className="text-white/70">{row.label}</div>
                                    <div className="font-semibold text-white">{row.recommended}</div>
                                    <div className={`font-semibold ${row.differs ? "text-white" : "text-white/50"}`}>
                                      {row.alternative || "—"}
                                    </div>
                                  </div>
                                );
                              })}

                              {comparisonRows.length > 4 ? (
                                <BlurGateBlock
                                  locked={!unlocked}
                                  title="Full comparison (free unlock)"
                                  subtitle="Mechanics + terms across every dimension"
                                >
                                  <div className="divide-y divide-white/10">
                                    {comparisonRows.slice(4).map((row) => {
                                      const isHeader =
                                        !row.recommended &&
                                        !row.alternative &&
                                        row.differs === false;

                                      if (isHeader) {
                                        return (
                                          <div
                                            key={`g-${row.label}`}
                                            className="bg-black/25 px-4 py-3 text-xs font-semibold tracking-wide text-white/60"
                                          >
                                            {row.label}
                                          </div>
                                        );
                                      }

                                      return (
                                        <div key={`g-${row.label}`} className="grid grid-cols-3 px-4 py-3 text-sm">
                                          <div className="text-white/70">{row.label}</div>
                                          <div className="font-semibold text-white">{row.recommended}</div>
                                          <div className={`font-semibold ${row.differs ? "text-white" : "text-white/50"}`}>
                                            {row.alternative || "—"}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </BlurGateBlock>
                              ) : null}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {/* Bottom reinforcement */}
                    <div className="mt-10 rounded-3xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-7">
                      <div className="text-lg font-semibold tracking-tight text-white">
                        Next step: open the playbook and trade the phase you’re in.
                      </div>
                      <div className="mt-2 text-sm text-white/65">
                        The point of Discovery is choosing a context where a coherent plan makes sense —
                        then executing the firm- and phase-specific playbook.
                      </div>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <Link
                          href={`/firms/${primary.firm.firmSlug}`}
                          className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100"
                        >
                          Open this firm hub
                        </Link>
                        <Link
                          href="/firms"
                          className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                        >
                          Browse firm hubs
                        </Link>
                        <Link
                          href="/prop-firms-explained"
                          className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                        >
                          Learn how prop firms grade accounts
                        </Link>
                      </div>
                      <div className="mt-3 text-xs text-white/50">
                        No signals. No trade calls. No guarantees — structured plans aligned to real rules.
                      </div>
                    </div>
                  </>
                );
              })()}
            </>
          ) : null}

          {/* Defensive UI */}
          {hasRun && !analyzing && !result ? (
            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
              Unable to produce a recommendation with the current dataset.
            </div>
          ) : null}

          {/* Interlinking */}
          <div className="mt-10 text-xs text-white/50">
            Want the mental model first?{" "}
            <Link
              href="/prop-firms-explained"
              className="font-semibold text-white/70 hover:text-white"
            >
              Learn how prop firms grade accounts
            </Link>
            .
          </div>
        </div>
      </div>
    </main>
  );
}
