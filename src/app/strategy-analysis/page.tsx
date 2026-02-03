// src/app/strategy-analysis/page.tsx
"use client";

import { useMemo, useState } from "react";

type RiskUnit = "dollars" | "percent" | "not-sure";
type DailyStopType = "dollars" | "trades" | "none";
type ReentryRule = "none" | "same-setup-only" | "discretionary";

function SectionHeading({
  title,
  sub,
}: {
  title: string;
  sub?: string;
}) {
  return (
    <div>
      <div className="text-xs font-semibold tracking-wide text-white/55 uppercase">
        {title}
      </div>
      {sub ? <div className="mt-1 text-sm text-white/70">{sub}</div> : null}
    </div>
  );
}

function FieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-xs font-semibold text-white/70">{children}</span>
      {required ? (
        <span className="text-xs font-semibold text-rose-300">*</span>
      ) : null}
    </div>
  );
}

function InputBase(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={
        "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:ring-2 focus:ring-amber-400/30 " +
        (props.className || "")
      }
    />
  );
}

function SelectBase(
  props: React.SelectHTMLAttributes<HTMLSelectElement>
) {
  return (
    <select
      {...props}
      className={
        "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-amber-400/30 " +
        (props.className || "")
      }
    />
  );
}

function TextareaBase(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={
        "mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:ring-2 focus:ring-amber-400/30 " +
        (props.className || "")
      }
    />
  );
}

function Callout({
  variant = "neutral",
  title,
  children,
}: {
  variant?: "neutral" | "warn" | "success";
  title?: string;
  children: React.ReactNode;
}) {
  const base =
    "rounded-2xl border px-4 py-3 text-sm leading-relaxed";
  const cls =
    variant === "warn"
      ? "border-amber-400/25 bg-amber-400/10 text-white/85"
      : variant === "success"
      ? "border-emerald-400/25 bg-emerald-400/10 text-white/85"
      : "border-white/10 bg-black/20 text-white/80";

  return (
    <div className={`${base} ${cls}`}>
      {title ? <div className="font-semibold text-white">{title}</div> : null}
      <div className={title ? "mt-1" : ""}>{children}</div>
    </div>
  );
}

function VisualPlaceholder({
  title,
  subtitle,
  prompt,
}: {
  title: string;
  subtitle: string;
  prompt: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6">
      <div className="flex items-start justify-between gap-6 flex-col lg:flex-row">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/70">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Visual placeholder
          </div>
          <div className="mt-3 text-lg font-semibold text-white">{title}</div>
          <p className="mt-2 text-sm text-white/70 leading-relaxed">{subtitle}</p>

          <div className="mt-4 grid gap-2 text-sm text-white/70">
            <div className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span>Firm + phase specific (not generic)</span>
            </div>
            <div className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span>Finds rule friction + failure points</span>
            </div>
            <div className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span>Turns “how you trade” into enforceable constraints</span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[620px]">
          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="aspect-[16/8] w-full rounded-lg border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent" />
            <div className="mt-3 flex items-center justify-between text-xs text-white/55">
              <span>Diagram placeholder (generate later)</span>
              <span className="font-semibold text-amber-400">16:8</span>
            </div>
          </div>

          {/* IMAGE PROMPT — generate later (copy/paste to image generation)
              PURPOSE:
              Make Strategy Analysis feel like a real diagnostic, not a generic form.
              This should visually communicate: firm+phase lens + rule friction + risk constraints.

              ABSOLUTE REQUIREMENTS:
              - Dark-mode SaaS UI-illustration style (not a real screenshot).
              - NO candlesticks/charts/PNL/crypto hype.
              - NO brand logos.
              - No claims or numbers required.

              COMPOSITION:
              A “Strategy Analysis Report” panel with:
              - A top row of tag shapes (Firm, Phase, Instrument) with no text.
              - A left column of sections (abstract lines) for: Inputs / Behaviors / Risk / Stops.
              - A right column with 2–3 callout boxes:
                - “Rule friction” (warning icon shape)
                - “Failure point” (alert icon shape)
                - “Safe constraint” (shield icon shape)
              - A bottom strip that looks like “Next actions” (3 lines) — no text.

              STYLE:
              - Deep navy background
              - Translucent cards
              - Amber highlight on the “rule friction” callout
              - Rounded corners, soft shadows, clean spacing

              OUTPUT:
              - High resolution, aspect ratio 16:8.

              PROMPT:
              {prompt}
          */}
        </div>
      </div>
    </div>
  );
}

export default function StrategyAnalysisPage() {
  const [submitting, setSubmitting] = useState(false);

  // UI state (drives conditional fields)
  const [firmSel, setFirmSel] = useState<string>("");
  const [instrumentSel, setInstrumentSel] = useState<string>("");
  const [riskUnit, setRiskUnit] = useState<RiskUnit>("dollars");
  const [dailyStopType, setDailyStopType] = useState<DailyStopType>("dollars");
  const [reentryRule, setReentryRule] = useState<ReentryRule>("same-setup-only");

  const supportedFirms = useMemo(
    () => [
      { value: "", label: "Select…" },
      { value: "topstep", label: "Topstep" },
      { value: "apex", label: "Apex" },
      { value: "take-profit-trader", label: "Take Profit Trader" },
      { value: "earn2trade", label: "Earn2Trade" },
      { value: "ftmo", label: "FTMO" },
      { value: "funding-pips", label: "Funding Pips" },
      { value: "other", label: "Other" },
    ],
    []
  );

  const instruments = useMemo(
    () => [
      { value: "", label: "Select…" },
      { value: "MNQ", label: "MNQ" },
      { value: "NQ", label: "NQ" },
      { value: "MES", label: "MES" },
      { value: "ES", label: "ES" },
      { value: "CL", label: "CL" },
      { value: "GC", label: "GC" },
      { value: "Other", label: "Other" },
    ],
    []
  );

  const strategyPlaceholder = useMemo(
    () => `Example:
I trade the opening range breakout. I wait for the first 15 minutes to form the range, then enter on a break + close outside.
Stop goes beyond the opposite side of the range or the prior candle.
I either take a fixed target or scale out (partial) and manage the rest.

Include:
- where your stop usually goes
- what makes you stop trading for the day
- whether you re-enter after a loss`,
    []
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const fd = new FormData(form);

    // Firm: dropdown + optional “Other” text
    const firmDropdown = String(fd.get("firm_dropdown") || "");
    const firmOther = String(fd.get("firm_other") || "").trim();
    const firm = firmDropdown === "other" ? firmOther : firmDropdown;

    const phase = String(fd.get("phase") || "");
    const email = String(fd.get("email") || "").trim();
    const firstName = String(fd.get("first_name") || "").trim();
    const lastName = String(fd.get("last_name") || "").trim();

    // Instrument: dropdown + optional “Other”
    const instrumentDropdown = String(fd.get("instrument_dropdown") || "");
    const instrumentOther = String(fd.get("instrument_other") || "").trim();
    const instrument =
      instrumentDropdown === "Other" ? instrumentOther : instrumentDropdown;

    // Screenshot rule: allow 0, or 3+
    const screenshots = fd.getAll("screenshots") as File[];
    if (screenshots.length > 0 && screenshots.length < 3) {
      setSubmitting(false);
      alert("If you upload screenshots, please upload at least 3.");
      return;
    }

    // Required core
    if (!email || !firstName || !lastName || !firm || !phase || !instrument) {
      setSubmitting(false);
      alert("Please complete required fields.");
      return;
    }

    const intake = {
      email,
      firstName,
      lastName,
      firm,
      phase,
      instrument,

      strategyName: String(fd.get("strategy_name") || "").trim(),
      strategySummary: String(fd.get("strategy_summary") || "").trim(),

      holding: String(fd.get("holding") || ""),
      tradesPerDayTypical: String(fd.get("trades_per_day_typical") || ""),
      maxTradesHardCap: Number(fd.get("max_trades_hard_cap") || 0),

      contractsPerTradeTypical: Number(fd.get("contracts_per_trade") || 0),
      maxContractsPerTrade: Number(fd.get("max_contracts_per_trade") || 0),
      sizingChanges: String(fd.get("sizing_changes") || ""),

      riskUnit: String(fd.get("risk_unit") || "") as RiskUnit,
      riskPerTradeDollars: Number(fd.get("risk_per_trade_dollars") || 0),
      riskPerTradePercent: Number(fd.get("risk_per_trade_percent") || 0),

      dailyStopType: String(fd.get("daily_stop_type") || "") as DailyStopType,
      dailyStopDollars: Number(fd.get("daily_stop_dollars") || 0),
      dailyStopTrades: Number(fd.get("daily_stop_trades") || 0),

      reentryRule: String(fd.get("reentry_rule") || "") as ReentryRule,
      maxReentries: Number(fd.get("max_reentries") || 0),

      afterLossBehavior: String(fd.get("after_loss_behavior") || ""),

      session: String(fd.get("session") || ""),
      endOfDay: String(fd.get("end_of_day") || ""),

      screenshotNotes: String(fd.get("screenshot_notes") || "").trim(),
      extra: String(fd.get("extra") || "").trim(),
      updatesOk: Boolean(fd.get("updates_ok")),
    };

    // These are still used by the backend columns
    fd.set("email", email);
    fd.set("firm", firm);
    fd.set("phase", phase);
    fd.set("intake", JSON.stringify(intake));

    const res = await fetch("/api/strategy-analysis", {
      method: "POST",
      body: fd,
    });

    setSubmitting(false);

    if (!res.ok) {
      alert("Submission failed. Please try again.");
      return;
    }

    form.reset();

    window.location.href = `/strategy-analysis/success?firm=${encodeURIComponent(
      firm
    )}&phase=${encodeURIComponent(phase)}`;
  }

  return (
    <main className="min-h-screen bg-[#070A14] text-white">
      <div className="mx-auto max-w-[980px] px-4 py-10 sm:px-6 sm:py-14">
        {/* Hero */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/75">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Strategy Analysis (free)
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
            Pressure-test how you trade against real prop firm rules.
          </h1>

          <p className="mt-3 text-sm sm:text-base text-white/70 leading-relaxed max-w-3xl">
            This is a firm + phase diagnostic. We evaluate rule friction and failure
            points — not “edge,” not markets, and not trade-by-trade performance.
          </p>

          <p className="mt-3 text-sm text-white/70">
            Outcome framing (no promises): this is designed to{" "}
            <span className="font-semibold text-white">
              increase your chances of passing evaluations, keeping funded accounts,
              and getting paid
            </span>{" "}
            by identifying the behaviors that quietly break under your firm’s rules.
          </p>

          <div className="mt-5">
            <Callout variant="warn" title="Important">
              Answer as if you are trading <span className="font-semibold text-white">this prop firm account</span>, not a personal account.
              If you upload screenshots, upload <span className="font-semibold text-white">0 or 3+</span>.
            </Callout>
          </div>
        </div>

        {/* Primary visual placeholder */}
        <section className="mt-10">
          <VisualPlaceholder
            title="What you’re getting"
            subtitle="A structured diagnostic lens: firm + phase context, your behavior, and where rules punish it — so you can build enforceable constraints before the next account blow-up."
            prompt={`Create a premium dark-mode SaaS UI-illustration of a "Strategy Analysis Report" panel showing tags for firm/phase/instrument (no text), sections for inputs/behavior/risk/stops, and callouts for rule friction/failure point/safe constraint. No charts/candles/PNL. Subtle amber highlight. Aspect ratio 16:8.`}
          />
        </section>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 grid gap-6"
        >
          <div className="text-xs text-white/55">
            Fields marked with <span className="text-rose-300 font-semibold">*</span>{" "}
            are required.
          </div>

          {/* Contact */}
          <SectionHeading title="Contact" />
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="grid gap-1">
              <FieldLabel required>First name</FieldLabel>
              <InputBase name="first_name" required />
            </label>

            <label className="grid gap-1">
              <FieldLabel required>Last name</FieldLabel>
              <InputBase name="last_name" required />
            </label>

            <label className="grid gap-1">
              <FieldLabel required>Email</FieldLabel>
              <InputBase name="email" type="email" required />
            </label>
          </div>

          {/* Account context */}
          <SectionHeading
            title="Account context"
            sub="This analysis is evaluated against the firm + phase you select."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1">
              <FieldLabel required>Prop firm</FieldLabel>
              <SelectBase
                name="firm_dropdown"
                required
                value={firmSel}
                onChange={(e) => setFirmSel(e.target.value)}
              >
                {supportedFirms.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </SelectBase>
              <div className="text-xs text-white/55 mt-1">
                If your firm isn’t listed, choose “Other”.
              </div>
            </label>

            <label className="grid gap-1">
              <FieldLabel required>Phase</FieldLabel>
              <SelectBase name="phase" required>
                <option value="">Select…</option>
                <option value="evaluation">Evaluation</option>
                <option value="stabilization">Funded / Stabilization</option>
                <option value="payout">Payout</option>
              </SelectBase>
            </label>
          </div>

          {firmSel === "other" && (
            <label className="grid gap-1">
              <FieldLabel required>Firm name</FieldLabel>
              <InputBase
                name="firm_other"
                required
                placeholder="Enter the firm name"
              />
            </label>
          )}

          <div className="h-px bg-white/10" />

          {/* Strategy identifier */}
          <SectionHeading title="Strategy identifier" />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1">
              <FieldLabel>Does this strategy have a name?</FieldLabel>
              <InputBase
                name="strategy_name"
                placeholder='Example: "15m ORB Retest"'
              />
              <div className="text-xs text-white/55 mt-1">
                Optional. Helps label and compare analyses.
              </div>
            </label>

            <label className="grid gap-1">
              <FieldLabel required>Main instrument</FieldLabel>
              <SelectBase
                name="instrument_dropdown"
                required
                value={instrumentSel}
                onChange={(e) => setInstrumentSel(e.target.value)}
              >
                {instruments.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </SelectBase>
              <div className="text-xs text-white/55 mt-1">
                Contracts only make sense with the instrument.
              </div>
            </label>
          </div>

          {instrumentSel === "Other" && (
            <label className="grid gap-1">
              <FieldLabel required>Instrument</FieldLabel>
              <InputBase name="instrument_other" required placeholder="Example: YM" />
            </label>
          )}

          <div className="h-px bg-white/10" />

          {/* How you trade */}
          <SectionHeading title="How you trade" />
          <label className="grid gap-1">
            <FieldLabel required>Describe your approach in plain language</FieldLabel>
            <div className="text-xs text-white/55">
              Focus on behavior: entry trigger, stop placement, management, exit.
            </div>
            <TextareaBase
              name="strategy_summary"
              required
              rows={6}
              placeholder={strategyPlaceholder}
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1">
              <FieldLabel required>Typical holding time</FieldLabel>
              <SelectBase name="holding" required>
                <option value="">Select…</option>
                <option value="minutes">Seconds to a few minutes</option>
                <option value="several-minutes">Several minutes</option>
                <option value="30+">30+ minutes</option>
                <option value="hours">Multiple hours</option>
                <option value="overnight">Sometimes overnight</option>
              </SelectBase>
            </label>

            <label className="grid gap-1">
              <FieldLabel required>Typical trades per day</FieldLabel>
              <SelectBase name="trades_per_day_typical" required>
                <option value="">Select…</option>
                <option value="1-2">1–2</option>
                <option value="3-5">3–5</option>
                <option value="6-10">6–10</option>
                <option value="10+">More than 10</option>
                <option value="varies">Varies significantly</option>
              </SelectBase>
            </label>
          </div>

          <label className="grid gap-1">
            <FieldLabel required>Hard cap: maximum trades in a day</FieldLabel>
            <InputBase name="max_trades_hard_cap" type="number" min={1} step={1} required />
          </label>

          <div className="h-px bg-white/10" />

          {/* Sizing & risk */}
          <SectionHeading title="Sizing & risk" />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1">
              <FieldLabel required>Typical contracts per trade</FieldLabel>
              <InputBase name="contracts_per_trade" type="number" min={1} step={1} required />
            </label>

            <label className="grid gap-1">
              <FieldLabel required>Max contracts on any single trade</FieldLabel>
              <InputBase name="max_contracts_per_trade" type="number" min={1} step={1} required />
            </label>
          </div>

          <label className="grid gap-1">
            <FieldLabel required>Do you change size after wins or losses?</FieldLabel>
            <SelectBase name="sizing_changes" required>
              <option value="">Select…</option>
              <option value="never">Never</option>
              <option value="after-win">Sometimes after a win</option>
              <option value="after-loss">Sometimes after a loss</option>
              <option value="both">Both</option>
              <option value="depends">Depends</option>
            </SelectBase>
          </label>

          <label className="grid gap-1">
            <FieldLabel required>How do you define risk per trade?</FieldLabel>
            <SelectBase
              name="risk_unit"
              required
              value={riskUnit}
              onChange={(e) => setRiskUnit(e.target.value as RiskUnit)}
            >
              <option value="dollars">Fixed dollars</option>
              <option value="percent">Fixed percent</option>
              <option value="not-sure">Not sure / varies</option>
            </SelectBase>
          </label>

          {riskUnit === "dollars" && (
            <>
              <label className="grid gap-1">
                <FieldLabel required>Risk per trade (dollars)</FieldLabel>
                <InputBase name="risk_per_trade_dollars" type="number" min={1} step={1} required />
              </label>
              <input name="risk_per_trade_percent" type="hidden" value="0" />
            </>
          )}

          {riskUnit === "percent" && (
            <>
              <label className="grid gap-1">
                <FieldLabel required>Risk per trade (percent)</FieldLabel>
                <InputBase name="risk_per_trade_percent" type="number" min={0.01} step={0.01} required />
              </label>
              <input name="risk_per_trade_dollars" type="hidden" value="0" />
            </>
          )}

          {riskUnit === "not-sure" && (
            <>
              <Callout title="If you’re not sure" variant="neutral">
                Enter your best estimate in dollars. We’ll treat uncertainty as part of the analysis.
              </Callout>
              <label className="grid gap-1">
                <FieldLabel required>Best estimate: risk per trade (dollars)</FieldLabel>
                <InputBase name="risk_per_trade_dollars" type="number" min={1} step={1} required />
                <input name="risk_per_trade_percent" type="hidden" value="0" />
              </label>
            </>
          )}

          <div className="h-px bg-white/10" />

          {/* Daily stop & attempts */}
          <SectionHeading title="Daily stop & attempts" />
          <label className="grid gap-1">
            <FieldLabel required>Which best describes your daily stop?</FieldLabel>
            <SelectBase
              name="daily_stop_type"
              required
              value={dailyStopType}
              onChange={(e) => setDailyStopType(e.target.value as DailyStopType)}
            >
              <option value="dollars">I stop after losing a set dollar amount</option>
              <option value="trades">I stop after a set number of losing trades</option>
              <option value="none">I don’t have a consistent daily stop</option>
            </SelectBase>
          </label>

          {dailyStopType === "dollars" && (
            <>
              <label className="grid gap-1">
                <FieldLabel required>Daily stop (dollars)</FieldLabel>
                <InputBase name="daily_stop_dollars" type="number" min={1} step={1} required />
              </label>
              <input name="daily_stop_trades" type="hidden" value="0" />
            </>
          )}

          {dailyStopType === "trades" && (
            <>
              <label className="grid gap-1">
                <FieldLabel required>Daily stop (losing trades)</FieldLabel>
                <InputBase name="daily_stop_trades" type="number" min={1} step={1} required />
              </label>
              <input name="daily_stop_dollars" type="hidden" value="0" />
            </>
          )}

          {dailyStopType === "none" && (
            <>
              <input name="daily_stop_dollars" type="hidden" value="0" />
              <input name="daily_stop_trades" type="hidden" value="0" />
              <Callout variant="warn" title="Note">
                This will be assessed as a structural risk.
              </Callout>
            </>
          )}

          <label className="grid gap-1">
            <FieldLabel required>Re-entry rule</FieldLabel>
            <SelectBase
              name="reentry_rule"
              required
              value={reentryRule}
              onChange={(e) => setReentryRule(e.target.value as ReentryRule)}
            >
              <option value="none">No re-entries</option>
              <option value="same-setup-only">Only if the exact setup triggers again</option>
              <option value="discretionary">Sometimes / discretionary</option>
            </SelectBase>
          </label>

          {reentryRule === "none" ? (
            <input name="max_reentries" type="hidden" value="0" />
          ) : (
            <label className="grid gap-1">
              <FieldLabel required>Max re-entries per day</FieldLabel>
              <InputBase name="max_reentries" type="number" min={0} step={1} required />
            </label>
          )}

          <label className="grid gap-1">
            <FieldLabel required>After a losing trade, what usually happens next?</FieldLabel>
            <SelectBase name="after_loss_behavior" required>
              <option value="">Select…</option>
              <option value="stop">I stop trading for the day</option>
              <option value="wait">I wait for another clean opportunity</option>
              <option value="continue">I continue as planned</option>
              <option value="increase">I increase activity to recover</option>
              <option value="depends">It depends on the day</option>
            </SelectBase>
          </label>

          <div className="h-px bg-white/10" />

          {/* Timing */}
          <SectionHeading title="Timing" />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1">
              <FieldLabel required>When do you usually trade?</FieldLabel>
              <SelectBase name="session" required>
                <option value="">Select…</option>
                <option value="single">One specific session</option>
                <option value="multiple">Multiple sessions</option>
                <option value="varies">Varies day to day</option>
              </SelectBase>
            </label>

            <label className="grid gap-1">
              <FieldLabel required>How does your day usually end?</FieldLabel>
              <SelectBase name="end_of_day" required>
                <option value="">Select…</option>
                <option value="planned">Planned stop time</option>
                <option value="profit">After a profit target</option>
                <option value="loss">After a loss limit</option>
                <option value="conditions">When conditions degrade</option>
                <option value="varies">Varies</option>
              </SelectBase>
            </label>
          </div>

          <div className="h-px bg-white/10" />

          {/* Trade examples */}
          <SectionHeading
            title="Trade examples"
            sub="Screenshots are recommended for the most accurate analysis."
          />

          <Callout variant="neutral" title="Screenshots (optional)">
            You may submit with <span className="font-semibold text-white">0 screenshots</span>, or{" "}
            <span className="font-semibold text-white">3+</span>.
            If you upload screenshots, try to include:
            <ul className="mt-2 list-disc pl-5 text-white/80">
              <li>Entry + reason (marked level / opening range / trigger)</li>
              <li>Stop placement</li>
              <li>Take profit / exit</li>
            </ul>
          </Callout>

          <label className="grid gap-1">
            <FieldLabel>Upload screenshots (optional)</FieldLabel>
            <input
              name="screenshots"
              type="file"
              accept="image/*"
              multiple
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:bg-white/10"
            />
            <div className="text-xs text-white/55 mt-1">
              If you upload screenshots, upload at least 3.
            </div>
          </label>

          <label className="grid gap-1">
            <FieldLabel>Notes for screenshots (optional)</FieldLabel>
            <TextareaBase name="screenshot_notes" rows={3} />
          </label>

          <label className="grid gap-1">
            <FieldLabel>Anything else that materially affects how you trade?</FieldLabel>
            <TextareaBase name="extra" rows={3} />
          </label>

          <label className="flex gap-3 items-center">
            <input
              name="updates_ok"
              type="checkbox"
              className="h-4 w-4 rounded border-white/20 bg-white/5"
            />
            <span className="text-sm text-white/70">
              Send me product updates and rule-change notes (optional)
            </span>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-amber-400 px-4 py-3 text-sm font-semibold text-black hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Request Strategy Analysis"}
          </button>

          <div className="text-xs text-white/55">
            No signals. No trade calls. No guarantees.
          </div>
        </form>
      </div>
    </main>
  );
}
