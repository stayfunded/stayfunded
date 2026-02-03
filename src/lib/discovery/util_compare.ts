// src/lib/discovery/util_compare.ts

import type { Account, RuleFactInstance, TradeoffDelta } from "./types";

/**
 * Discovery compare rows must explicitly separate:
 * - RULE PRESSURE (how accounts fail)
 * - TERM PRESSURE (how money leaks)
 *
 * v1 returns a recommended-side representation only.
 * Side-by-side deltas are computed in the page/component.
 *
 * NOTE: We keep the same TradeoffDelta[] shape for compatibility.
 * We use "section header rows" (differs=false) to create visible separation in the UI.
 */

function fmtMoney(n: number | null) {
  if (!n || n <= 0) return "None";
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

function phaseCount(account: Account) {
  return account.phaseStructure.phases.length;
}

function hasRule(rules: RuleFactInstance[], slug: string) {
  return rules.some((r) => r.ruleSlug === slug);
}

function drawdownType(rules: RuleFactInstance[]) {
  if (hasRule(rules, "trailing-drawdown")) return "Trailing";
  // v1 fallback; real data will distinguish static/eod etc later
  return "Non-trailing";
}

function dailyLossBehavior(rules: RuleFactInstance[]) {
  if (hasRule(rules, "daily-loss-limit")) return "Daily limit present";
  return "No daily limit";
}

function timePressure(rules: RuleFactInstance[]) {
  if (hasRule(rules, "time-pressure-and-inactivity")) return "Higher";
  return "Lower";
}

function scaling(rules: RuleFactInstance[]) {
  if (hasRule(rules, "scaling-and-contract-limits")) return "Constrained";
  return "Less constrained";
}

function payoutConstraints(rules: RuleFactInstance[]) {
  // v1 placeholder; will be real once firm account docs are wired
  return hasRule(rules, "time-pressure-and-inactivity")
    ? "More restrictions"
    : "Standard";
}

function header(label: string): TradeoffDelta {
  return {
    label,
    recommended: "",
    alternative: "",
    differs: false, // important: headers are not diffs
  };
}

export function buildComparisonRows(
  account: Account,
  rules: RuleFactInstance[]
): TradeoffDelta[] {
  const termRows: TradeoffDelta[] = [
    {
      label: "Initial cost",
      recommended: fmtMoney(account.priceInitial),
      alternative: "",
      differs: true,
    },
    {
      label: "Reset / monthly fees",
      recommended: `${fmtMoney(account.priceReset)} / ${fmtMoney(account.monthlyFee)}`,
      alternative: "",
      differs: true,
    },
    {
      label: "Phase structure",
      recommended: `${phaseCount(account)} phase(s)`,
      alternative: "",
      differs: true,
    },
    {
      label: "Payout constraints",
      recommended: payoutConstraints(rules),
      alternative: "",
      differs: true,
    },
  ];

  const ruleRows: TradeoffDelta[] = [
    {
      label: "Drawdown type",
      recommended: drawdownType(rules),
      alternative: "",
      differs: true,
    },
    {
      label: "Daily loss behavior",
      recommended: dailyLossBehavior(rules),
      alternative: "",
      differs: true,
    },
    {
      label: "Time pressure rules",
      recommended: timePressure(rules),
      alternative: "",
      differs: true,
    },
    {
      label: "Scaling limits",
      recommended: scaling(rules),
      alternative: "",
      differs: true,
    },
  ];

  return [
    header("TERM PRESSURE (terms & costs)"),
    ...termRows,
    header("RULE PRESSURE (failure mechanics)"),
    ...ruleRows,
  ];
}
