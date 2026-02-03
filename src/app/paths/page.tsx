// src/app/paths/page.tsx
"use client";

import Link from "next/link";
import { useMemo, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import {
  listAccounts,
  getActiveAccount,
  setActiveAccountId,
  upsertAccount,
  type Account,
  type FirmPhase,
} from "@/lib/accounts";

/**
 * A Path represents the operating context for an exact account:
 * firm + phase (+ account identity).
 * Playbooks, rules, and tools adapt to this context.
 */

type Path = {
  id: string;
  firmSlug: string;
  name: string;
  description: string;
};

type Playbook = {
  id: string;
  firmSlug: string;
  phase: FirmPhase;
  title: string;
  excerpt: string;
  href: string; // canonical: /firms/<firm>/phases/playbooks/<phase>
};

const PHASES: { value: FirmPhase; label: string; note: string }[] = [
  { value: "discovery", label: "Discovery", note: "Choose a context your plan can survive" },
  { value: "evaluation", label: "Evaluation", note: "Structured plan under strict constraints" },
  { value: "stabilization", label: "Stabilization", note: "Funded survival under consistency pressure" },
  { value: "payout", label: "Payout", note: "Eligibility + withdrawal constraints" },
  { value: "maintenance", label: "Maintenance", note: "Stay funded without slow failure" },
];

const PHASE_INTENT: Record<FirmPhase, string> = {
  discovery:
    "In Discovery, you’re choosing constraints. Pick a firm/account context where a coherent plan makes sense before you pay for attempts.",
  evaluation:
    "In Evaluation, you’re trading a rules-based test. Professionals structure risk and pacing to fit the drawdown mechanics and avoid forcing trades.",
  stabilization:
    "In Stabilization, incentives change. Professionals reduce variance, tighten execution, and protect eligibility under consistency constraints.",
  payout:
    "In Payout, small violations can block withdrawals. Professionals trade with eligibility and payout rules in mind — not urgency.",
  maintenance:
    "In Maintenance, failure is usually slow: drift, overtrading, and accumulated rule contact. Professionals keep the plan boring on purpose.",
};

// v1: minimal mock Paths (one per firm for now)
const MOCK_PATHS: Path[] = [
  {
    id: "topstep-lifecycle",
    firmSlug: "topstep",
    name: "Topstep Lifecycle",
    description: "Firm + phase context for Topstep playbooks.",
  },
  {
    id: "apex-lifecycle",
    firmSlug: "apex",
    name: "Apex Lifecycle",
    description: "Firm + phase context for Apex playbooks.",
  },
  {
    id: "earn2trade-lifecycle",
    firmSlug: "earn2trade",
    name: "Earn2Trade Lifecycle",
    description: "Firm + phase context for Earn2Trade playbooks.",
  },
  {
    id: "take-profit-trader-lifecycle",
    firmSlug: "take-profit-trader",
    name: "Take Profit Trader Lifecycle",
    description: "Firm + phase context for Take Profit Trader playbooks.",
  },
];

// Canonical: one playbook per phase.
function playbooksForFirm(firmSlug: string): Playbook[] {
  const base = (phase: FirmPhase, title: string, excerpt: string): Playbook => ({
    id: `${firmSlug}:${phase}`,
    firmSlug,
    phase,
    title,
    excerpt,
    href: `/firms/${firmSlug}/phases/playbooks/${phase}`,
  });

  return [
    base(
      "discovery",
      "Discovery: choose constraints that fit your plan",
      "Compare firms/accounts and pick a context you can realistically operate under."
    ),
    base(
      "evaluation",
      "Evaluation: the plan professionals actually run",
      "How pros structure risk, pacing, and buffers under evaluation constraints."
    ),
    base(
      "stabilization",
      "Stabilization: what changes after you pass",
      "Why evaluation behavior often fails in funded — and how pros adjust."
    ),
    base(
      "payout",
      "Payout: eligibility and withdrawal constraints",
      "How pros avoid the rules that block withdrawals and end payout streaks."
    ),
    base(
      "maintenance",
      "Maintenance: staying funded long-term",
      "How pros prevent slow failure once the novelty wears off."
    ),
  ];
}

function titleizeFirm(slug: string) {
  if (!slug) return "";
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

function isFirmPhase(v: string): v is FirmPhase {
  return (
    v === "discovery" ||
    v === "evaluation" ||
    v === "stabilization" ||
    v === "payout" ||
    v === "maintenance"
  );
}

function displayAccountName(a: Account) {
  const n = (a.name || "").trim();
  if (n) return n;
  const acct = (a.accountNumber || "").trim();
  if (acct) return acct;
  return `${titleizeFirm(a.firmSlug)} account`;
}

export default function PathsPage() {
  const sp = useSearchParams();
  const firmFromQuery = (sp.get("firm") || "").trim().toLowerCase();
  const phaseFromQueryRaw = (sp.get("phase") || "").trim().toLowerCase();
  const phaseFromQuery = isFirmPhase(phaseFromQueryRaw)
    ? (phaseFromQueryRaw as FirmPhase)
    : null;

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);

  const [firmSlug, setFirmSlug] = useState<string>(firmFromQuery || "");
  const [phase, setPhase] = useState<FirmPhase>("evaluation");
  const [activePathId, setActivePathId] = useState<string>("");

  const [loaded, setLoaded] = useState(false);

  const firmName = useMemo(() => titleizeFirm(firmSlug), [firmSlug]);

  useEffect(() => {
    // Lightweight SEO reinforcement for a client page.
    try {
      document.title = "Paths — Set Your Firm + Phase Context | StayFunded";
    } catch {
      // ignore
    }
  }, []);

  // Load accounts + active account
  useEffect(() => {
    const list = listAccounts();
    const active = getActiveAccount();

    setAccounts(list);
    setActiveAccount(active);

    if (active) {
      setFirmSlug(active.firmSlug || firmFromQuery || "");
      setPhase(active.phase || phaseFromQuery || "evaluation");
    } else {
      if (firmFromQuery) setFirmSlug(firmFromQuery);
      if (phaseFromQuery) setPhase(phaseFromQuery);
    }

    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Ensure an active account exists when arriving with firm/phase
  useEffect(() => {
    if (!loaded) return;

    const active = getActiveAccount();
    if (active) return;

    const seedFirm = firmFromQuery || firmSlug || "topstep";
    const seedPhase = phaseFromQuery || phase || "evaluation";

    const created = upsertAccount({
      firmSlug: seedFirm,
      phase: seedPhase,
      name: `${titleizeFirm(seedFirm)} account`,
    });

    setActiveAccountId(created.id);
    setActiveAccount(created);
    setAccounts(listAccounts());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  // Apply query overrides onto the active account
  useEffect(() => {
    if (!loaded) return;
    if (!firmFromQuery && !phaseFromQuery) return;

    const current = getActiveAccount();
    if (!current) return;

    const nextFirm = firmFromQuery || current.firmSlug;
    const nextPhase = phaseFromQuery || current.phase;

    if (nextFirm !== current.firmSlug || nextPhase !== current.phase) {
      const updated = upsertAccount({
        id: current.id,
        firmSlug: nextFirm,
        phase: nextPhase,
      });
      setActiveAccount(updated);
      setAccounts(listAccounts());
      setFirmSlug(updated.firmSlug);
      setPhase(updated.phase);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, firmFromQuery, phaseFromQuery]);

  const availablePaths = useMemo(() => {
    if (!firmSlug) return [];
    return MOCK_PATHS.filter((p) => p.firmSlug === firmSlug);
  }, [firmSlug]);

  useEffect(() => {
    if (!loaded) return;
    if (!firmSlug) return;
    if (activePathId) return;
    if (availablePaths.length > 0) setActivePathId(availablePaths[0].id);
  }, [loaded, firmSlug, activePathId, availablePaths]);

  const playbooks = useMemo(() => {
    if (!firmSlug) return [];
    return playbooksForFirm(firmSlug).filter((p) => p.phase === phase);
  }, [firmSlug, phase]);

  const phaseLabel = useMemo(() => {
    return PHASES.find((p) => p.value === phase)?.label ?? phase;
  }, [phase]);

  const persistActive = (patch: { firmSlug?: string; phase?: FirmPhase }) => {
    const current = getActiveAccount();
    if (!current) return;

    const updated = upsertAccount({
      id: current.id,
      firmSlug: patch.firmSlug ?? current.firmSlug,
      phase: patch.phase ?? current.phase,
    });

    setActiveAccount(updated);
    setAccounts(listAccounts());
  };

  return (
    <main className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
              Your Path
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-gray-600">
              A Path sets the context for your{" "}
              <span className="font-semibold text-gray-900">exact account</span>:
              firm + phase. Once set, StayFunded routes you to the{" "}
              <span className="font-semibold text-gray-900">matching playbook</span>{" "}
              — the structured plan for how professionals operate under that rulebook.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard"
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Back to dashboard
            </Link>
            <Link
              href="/firms"
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              Open playbooks
            </Link>
          </div>
        </div>

        {/* Active account chooser */}
        {accounts.length > 1 ? (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <div className="text-sm font-semibold text-gray-900">
              Active account
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {accounts.map((a) => {
                const isActive = activeAccount?.id === a.id;
                return (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => {
                      setActiveAccountId(a.id);
                      setActiveAccount(a);
                      setFirmSlug(a.firmSlug);
                      setPhase(a.phase);
                    }}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                      isActive
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    {displayAccountName(a)}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Current state */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Current context
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-700">
              <span className="font-semibold text-gray-900">
                {firmName || firmSlug || "—"}
              </span>
              <span className="text-gray-400">/</span>
              <span className="font-semibold text-gray-900">{phaseLabel}</span>
              {activeAccount ? (
                <>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-700">
                    Account:{" "}
                    <span className="font-semibold text-gray-900">
                      {displayAccountName(activeAccount)}
                    </span>
                  </span>
                </>
              ) : null}
            </div>

            <div className="mt-3 max-w-4xl text-sm text-gray-700">
              {PHASE_INTENT[phase]}
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              {firmSlug ? (
                <Link
                  href={`/firms/${firmSlug}/phases`}
                  className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  Open {firmName || firmSlug} playbooks
                </Link>
              ) : null}

              <Link
                href="/discovery"
                className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
              >
                Find my plan (Discovery)
              </Link>
            </div>
          </div>

          {/* Playbooks */}
          <div className="px-6 py-6">
            <div className="text-xl font-semibold text-gray-900">
              Playbook for this phase
            </div>
            <p className="mt-1 text-sm text-gray-600">
              One playbook per firm, per phase. Content is sourced from{" "}
              <span className="font-semibold">
                docs/playbooks/&lt;firm&gt;/&lt;phase&gt;.md
              </span>.
            </p>

            {!firmSlug ? (
              <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-700">
                Select a firm to see playbooks.
              </div>
            ) : (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {playbooks.map((pb) => (
                  <div
                    key={pb.id}
                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                  >
                    <div className="text-xs font-semibold text-gray-500">
                      {pb.firmSlug} · {pb.phase}
                    </div>
                    <div className="mt-1 text-base font-semibold text-gray-900">
                      {pb.title}
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{pb.excerpt}</p>

                    <div className="mt-4">
                      <Link
                        href={pb.href}
                        className="text-sm font-semibold text-amber-700 hover:text-amber-800"
                      >
                        Open phase plan →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <details open>
            <summary className="cursor-pointer list-none">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold text-gray-900">
                    Update your context
                  </div>
                  <div className="mt-1 text-sm text-gray-600">
                    This changes which playbook you should follow.
                  </div>
                </div>
                <div className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
                  Controls
                </div>
              </div>
            </summary>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {/* Firm */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="text-sm font-semibold text-gray-900">Firm</div>
                <p className="mt-1 text-xs text-gray-600">
                  Sets the firm for the active account.
                </p>

                <input
                  value={firmSlug}
                  onChange={(e) => {
                    const next = e.target.value.trim().toLowerCase();
                    setFirmSlug(next);
                    setActivePathId("");
                    persistActive({ firmSlug: next });
                  }}
                  placeholder="e.g. topstep"
                  className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-amber-300/40"
                />

                <div className="mt-3 flex flex-wrap gap-2">
                  {["topstep", "apex", "earn2trade", "take-profit-trader"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setFirmSlug(s);
                        setActivePathId("");
                        persistActive({ firmSlug: s });
                      }}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        firmSlug === s
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phase */}
              <div className="rounded-2xl border border-gray-200 bg-white p-5">
                <div className="text-sm font-semibold text-gray-900">
                  Current phase
                </div>
                <p className="mt-1 text-xs text-gray-600">
                  Sets the phase for the active account.
                </p>

                <div className="mt-3 space-y-2">
                  {PHASES.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => {
                        setPhase(p.value);
                        persistActive({ phase: p.value });
                      }}
                      className={`w-full rounded-xl border px-3 py-2 text-left text-sm ${
                        phase === p.value
                          ? "border-gray-900 bg-gray-900 text-white"
                          : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-semibold">{p.label}</div>
                      <div className={phase === p.value ? "text-white/80" : "text-gray-600"}>
                        {p.note}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Path (still mock) */}
            <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <div className="text-sm font-semibold text-gray-900">
                Path (temporary)
              </div>
              <div className="mt-2 text-sm text-gray-700">
                {activePathId || "(none)"}{" "}
                {availablePaths.length ? (
                  <span className="text-gray-500">— {availablePaths[0]?.description}</span>
                ) : null}
              </div>
              <div className="mt-2 text-xs text-gray-500">
                This will be replaced by account editing inside Dashboard.
              </div>
            </div>
          </details>
        </div>
      </div>
    </main>
  );
}
