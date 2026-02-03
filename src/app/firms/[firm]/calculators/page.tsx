// src/app/firms/[firm]/calculators/page.tsx
"use client";

import Link from "next/link";
import type { HTMLAttributes } from "react";
import { useEffect, useMemo, useState } from "react";

function toTitle(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function parseNum(value: string): number | null {
  if (value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function clampMin(n: number, min: number) {
  return n < min ? min : n;
}

function formatCurrency(n: number) {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  return `${sign}$${abs.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

type CalculatorDefaults = {
  survivability: {
    bufferPct: string;
    bufferMin: string;
    ignoreProfits: boolean;
  };
  lossCapacity: {
    dailyLossLimit: string;
    pnlToday: string;
    trailingDdRemaining: string;
  };
  maxRisk: {
    lossesPlanned: string;
    stopPerContract: string;
  };
};

// Pattern is what matters here. Topstep values are placeholders (current v0 defaults)
// until you wire firm-specific constants from /docs later.
const FIRM_DEFAULTS: Record<string, CalculatorDefaults> = {
  topstep: {
    survivability: { bufferPct: "20", bufferMin: "50", ignoreProfits: true },
    lossCapacity: {
      dailyLossLimit: "1000",
      pnlToday: "0",
      trailingDdRemaining: "1000",
    },
    maxRisk: { lossesPlanned: "3", stopPerContract: "150" },
  },
  default: {
    survivability: { bufferPct: "20", bufferMin: "50", ignoreProfits: true },
    lossCapacity: {
      dailyLossLimit: "1000",
      pnlToday: "0",
      trailingDdRemaining: "1000",
    },
    maxRisk: { lossesPlanned: "3", stopPerContract: "150" },
  },
};

function getDefaultsForFirm(firm: string): CalculatorDefaults {
  return FIRM_DEFAULTS[firm] ?? FIRM_DEFAULTS.default;
}

function Field({
  label,
  hint,
  value,
  onChange,
  inputMode = "decimal",
  suffix,
  prefix,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  suffix?: string;
  prefix?: string;
}) {
  return (
    <label className="block">
      <div className="flex items-end justify-between gap-3">
        <div className="text-sm font-medium text-slate-900">{label}</div>
        {suffix ? (
          <div className="text-xs font-medium text-slate-500">{suffix}</div>
        ) : null}
      </div>
      {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}

      <div className="relative mt-2">
        {prefix ? (
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400">
            {prefix}
          </div>
        ) : null}

        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          inputMode={inputMode}
          className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none ring-0 placeholder:text-slate-400 focus:border-slate-300 ${
            prefix ? "pl-7" : ""
          }`}
          placeholder="0"
        />
      </div>
    </label>
  );
}

function StatRow({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "danger" | "ok";
}) {
  const toneClass =
    tone === "danger"
      ? "text-rose-700"
      : tone === "ok"
        ? "text-emerald-700"
        : "text-slate-900";

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-sm text-slate-600">{label}</div>
      <div className={`text-sm font-semibold ${toneClass}`}>{value}</div>
    </div>
  );
}

export default function CalculatorsPage({ params }: { params: { firm: string } }) {
  const firm = params.firm;
  const firmName = toTitle(firm);

  useEffect(() => {
    // Lightweight SEO reinforcement for a client page.
    try {
      document.title = `${firmName} Calculators — Plan Guardrails Under Real Rules | StayFunded`;
    } catch {
      // ignore
    }
  }, [firmName]);

  const [didInitForFirm, setDidInitForFirm] = useState<string | null>(null);

  // Shared survivability settings
  const [bufferPct, setBufferPct] = useState("20");
  const [bufferMin, setBufferMin] = useState("50");
  const [ignoreProfits, setIgnoreProfits] = useState(true);

  // Loss capacity today
  const [dailyLossLimit, setDailyLossLimit] = useState("1000");
  const [pnlToday, setPnlToday] = useState("0");
  const [trailingDdRemaining, setTrailingDdRemaining] = useState("1000");

  // Max risk per trade
  const [lossesPlanned, setLossesPlanned] = useState("3");
  const [stopPerContract, setStopPerContract] = useState("150");

  const applyDefaults = (targetFirm: string) => {
    const d = getDefaultsForFirm(targetFirm);

    setBufferPct(d.survivability.bufferPct);
    setBufferMin(d.survivability.bufferMin);
    setIgnoreProfits(d.survivability.ignoreProfits);

    setDailyLossLimit(d.lossCapacity.dailyLossLimit);
    setPnlToday(d.lossCapacity.pnlToday);
    setTrailingDdRemaining(d.lossCapacity.trailingDdRemaining);

    setLossesPlanned(d.maxRisk.lossesPlanned);
    setStopPerContract(d.maxRisk.stopPerContract);
  };

  const clearValues = () => {
    // Keep survivability settings as-is.
    setDailyLossLimit("");
    setPnlToday("0");
    setTrailingDdRemaining("");
    setLossesPlanned("");
    setStopPerContract("");
  };

  // Initialize defaults on firm change (only once per firm)
  useEffect(() => {
    if (didInitForFirm === firm) return;
    applyDefaults(firm);
    setDidInitForFirm(firm);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firm, didInitForFirm]);

  const derived = useMemo(() => {
    const pct = clampMin(parseNum(bufferPct) ?? 0, 0);
    const min = clampMin(parseNum(bufferMin) ?? 0, 0);

    const dayLimit = parseNum(dailyLossLimit);
    const pnl = parseNum(pnlToday);
    const dd = parseNum(trailingDdRemaining);

    // Conservative default: do not expand risk from profits unless toggled off.
    const pnlForCapacity =
      pnl == null ? null : ignoreProfits ? Math.min(0, pnl) : pnl;

    const remainingDaily =
      dayLimit == null || pnlForCapacity == null
        ? null
        : Math.max(0, dayLimit + pnlForCapacity);

    const remainingTrailing = dd == null ? null : Math.max(0, dd);

    const rawCapacity =
      remainingDaily == null || remainingTrailing == null
        ? null
        : Math.min(remainingDaily, remainingTrailing);

    const safeCapacity =
      rawCapacity == null ? null : Math.max(0, rawCapacity * (1 - pct / 100) - min);

    const bindingConstraint =
      remainingDaily == null || remainingTrailing == null
        ? null
        : remainingDaily <= remainingTrailing
          ? "Daily loss limit"
          : "Trailing drawdown";

    const losses = parseNum(lossesPlanned);
    const stop = parseNum(stopPerContract);

    const maxRiskPerTrade =
      safeCapacity == null || losses == null || losses <= 0 ? null : safeCapacity / losses;

    const maxUnits =
      maxRiskPerTrade == null || stop == null || stop <= 0
        ? null
        : Math.floor(maxRiskPerTrade / stop);

    return {
      pct,
      min,
      remainingDaily,
      remainingTrailing,
      rawCapacity,
      safeCapacity,
      bindingConstraint,
      maxRiskPerTrade,
      maxUnits,
    };
  }, [
    bufferPct,
    bufferMin,
    dailyLossLimit,
    pnlToday,
    trailingDdRemaining,
    lossesPlanned,
    stopPerContract,
    ignoreProfits,
  ]);

  const capacityTone =
    derived.safeCapacity == null
      ? "default"
      : derived.safeCapacity <= 0
        ? "danger"
        : derived.safeCapacity < 0.25 * (derived.rawCapacity ?? 0)
          ? "danger"
          : "ok";

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-slate-950 px-6 py-6 text-white">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-medium tracking-wider text-slate-300">
              {firmName} · CALCULATORS
            </div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Plan guardrails
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              These calculators are conservative on purpose. They help you structure
              risk inside the rules so the plan doesn’t fail due to sizing and drawdown
              mechanics.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/firms/${firm}`}
              className="rounded-xl bg-white/10 px-3 py-2 text-sm font-medium text-white ring-1 ring-white/15 hover:bg-white/15"
            >
              ← Back to Playbooks
            </Link>
            <Link
              href={`/firms/${firm}/phases`}
              className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-100"
            >
              Choose phase plan
            </Link>
          </div>
        </div>
      </div>

      {/* Shared settings */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-950">
              Safety buffers
            </div>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Apply a buffer to every output so normal variance doesn’t turn into a rule collision.
              Defaults are intentionally strict.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="w-full md:w-52">
              <Field
                label="Safety buffer (%)"
                hint="Reduces usable capacity"
                value={bufferPct}
                onChange={setBufferPct}
                inputMode="decimal"
                suffix="%"
              />
            </div>
            <div className="w-full md:w-52">
              <Field
                label="Minimum buffer ($)"
                hint="Always held back"
                value={bufferMin}
                onChange={setBufferMin}
                inputMode="decimal"
                suffix="$"
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 md:flex-1">
            <div>
              <div className="text-sm font-medium text-slate-900">
                Ignore profits when calculating room
              </div>
              <div className="mt-1 text-xs text-slate-600">
                Conservative default: a green day does not expand your risk budget.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIgnoreProfits((v) => !v)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full border transition-colors ${
                ignoreProfits ? "border-slate-300 bg-slate-900" : "border-slate-300 bg-white"
              }`}
              aria-pressed={ignoreProfits}
              aria-label="Toggle ignore profits"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  ignoreProfits ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyDefaults(firm)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Reset to firm defaults
            </button>
            <button
              type="button"
              onClick={clearValues}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
            >
              Clear values
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Loss Capacity */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="text-sm font-semibold text-slate-950">
            Loss capacity today
          </div>
          <p className="mt-2 text-sm text-slate-600">
            How much room you actually have right now after buffers. Uses the tighter of daily
            loss and trailing drawdown. This is the number professionals respect when they’re
            trying to keep the plan inside the constraints.
          </p>

          <div className="mt-5 grid gap-4">
            <Field
              label="Daily loss limit"
              hint="Max loss allowed for the day"
              value={dailyLossLimit}
              onChange={setDailyLossLimit}
              prefix="$"
            />
            <Field
              label="P&L today (realized + open)"
              hint="Negative if down. Conservative mode ignores positive P&L."
              value={pnlToday}
              onChange={setPnlToday}
              prefix="$"
            />
            <Field
              label="Trailing drawdown remaining"
              hint="Distance to the trailing line (right now)"
              value={trailingDdRemaining}
              onChange={setTrailingDdRemaining}
              prefix="$"
            />
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <div className="space-y-2">
              <StatRow
                label="Daily room remaining"
                value={derived.remainingDaily == null ? "—" : formatCurrency(derived.remainingDaily)}
              />
              <StatRow
                label="Trailing room remaining"
                value={
                  derived.remainingTrailing == null ? "—" : formatCurrency(derived.remainingTrailing)
                }
              />
              <StatRow label="Binding constraint" value={derived.bindingConstraint ?? "—"} />
              <div className="h-px bg-slate-200" />
              <StatRow
                label="Usable loss capacity (buffered)"
                value={derived.safeCapacity == null ? "—" : formatCurrency(derived.safeCapacity)}
                tone={capacityTone as any}
              />
            </div>

            <div className="mt-4 text-xs text-slate-600">
              Plan rule: if this is near zero, you’re in the danger zone — stop trading.
            </div>
          </div>
        </div>

        {/* Max Risk Per Trade */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="text-sm font-semibold text-slate-950">
            Max risk per trade
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Convert today’s buffered room into a per-trade risk budget and conservative max size.
            This is how professionals keep a series of losses from becoming a rule violation.
          </p>

          <div className="mt-5 grid gap-4">
            <Field
              label="Max losing trades you’re willing to take"
              hint="If you hit this many losses, you stop"
              value={lossesPlanned}
              onChange={setLossesPlanned}
              inputMode="numeric"
            />
            <Field
              label="Stop size per contract/share"
              hint="Dollar loss if your stop is hit (per 1 unit)"
              value={stopPerContract}
              onChange={setStopPerContract}
              prefix="$"
            />
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <div className="space-y-2">
              <StatRow
                label="Usable loss capacity (buffered)"
                value={derived.safeCapacity == null ? "—" : formatCurrency(derived.safeCapacity)}
              />
              <StatRow
                label="Max risk per trade"
                value={derived.maxRiskPerTrade == null ? "—" : formatCurrency(derived.maxRiskPerTrade)}
              />
              <div className="h-px bg-slate-200" />
              <StatRow
                label="Max units (rounded down)"
                value={derived.maxUnits == null ? "—" : `${derived.maxUnits.toLocaleString()}`}
                tone={
                  derived.maxUnits == null ? "default" : derived.maxUnits <= 0 ? "danger" : "ok"
                }
              />
            </div>

            {derived.maxUnits != null && derived.maxUnits <= 0 ? (
              <div className="mt-4 rounded-xl bg-white p-3 text-xs text-slate-700 ring-1 ring-slate-200">
                Your stop size is too large for today’s buffered risk budget. Reduce size (0),
                tighten the stop, or don’t trade.
              </div>
            ) : null}

            <div className="mt-4 text-xs text-slate-600">
              Conservative note: assumes every loss is a full stop-out.
            </div>
          </div>
        </div>
      </div>

      {/* Coming next */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="text-sm font-semibold text-slate-950">Drawdown-aware scaling</div>
          <p className="mt-2 text-sm text-slate-600">
            Coming next. This will turn drawdown mechanics into safe scaling rules that keep the
            plan aligned to the constraint model.
          </p>
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            Placeholder.
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="text-sm font-semibold text-slate-950">News / volatility risk check</div>
          <p className="mt-2 text-sm text-slate-600">
            Coming next. This will help you avoid account-threatening volatility windows that
            routinely break otherwise-sound plans.
          </p>
          <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            Placeholder.
          </div>
        </div>
      </div>
    </div>
  );
}
