// src/lib/discovery/rank.ts

import type {
  Account,
  AccountRuleProfile,
  DiscoveryRequestFactsFirst,
  DiscoveryResult,
  DiscoveryRecommendation,
  FactPriority,
  Firm,
  RuleFactInstance,
} from "./types";

import { normalizeRequest } from "./defaults";
import { buildCostModel } from "./util_cost";
import { buildRiskSurface } from "./util_risk";
import { buildExplanations } from "./util_explain";
import { buildComparisonRows } from "./util_compare";

type Dataset = {
  firms: Firm[];
  accounts: Account[];
  ruleProfiles: AccountRuleProfile[];
};

function hasRule(rules: RuleFactInstance[], slug: string) {
  return rules.some((r) => r.ruleSlug === slug);
}

function phaseCountFor(account: Account) {
  // util_compare assumes .phaseStructure.phases exists when kind="simple"
  if (account.phaseStructure.kind === "named") return account.phaseStructure.phases.length;
  return account.phaseStructure.phases.length;
}

function hasTimePressure(rec: DiscoveryRecommendation) {
  return rec.risk.pressureRules.some(
    (r) =>
      r.ruleSlug.includes("time") ||
      r.ruleSlug.includes("inactivity") ||
      r.ruleSlug.includes("deadline")
  );
}

function passesHardFilters(
  req: DiscoveryRequestFactsFirst,
  rules: RuleFactInstance[],
  account: Account
): boolean {
  if (typeof req.budgetCeiling === "number") {
    if ((account.priceInitial ?? 0) > req.budgetCeiling) return false;
  }

  const exclude = req.exclude ?? [];

  if (exclude.includes("avoid-inactivity-rules")) {
    if (hasRule(rules, "time-pressure-and-inactivity")) return false;
  }

  return true;
}

function preferenceScore(
  req: DiscoveryRequestFactsFirst,
  rules: RuleFactInstance[],
  account: Account
): number {
  const mustHave = req.mustHave ?? [];
  let score = 0;

  if (mustHave.includes("no-trailing-drawdown")) {
    if (!hasRule(rules, "trailing-drawdown")) score += 2;
  }

  if (mustHave.includes("low-time-pressure")) {
    if (!hasRule(rules, "time-pressure-and-inactivity")) score += 2;
  }

  if (mustHave.includes("minimize-monthly-fees")) {
    if (!account.monthlyFee || account.monthlyFee === 0) score += 1;
  }

  if (mustHave.includes("prefer-fewer-phases")) {
    if (phaseCountFor(account) <= 1) score += 1;
  }

  return score;
}

function sortByPriorities(
  priorities: FactPriority[] | undefined,
  a: DiscoveryRecommendation,
  b: DiscoveryRecommendation
) {
  const order = priorities ?? [];
  for (const p of order) {
    switch (p) {
      case "kill_rules": {
        const d = a.risk.killRules.length - b.risk.killRules.length;
        if (d !== 0) return d;
        break;
      }
      case "time_pressure": {
        const d = (hasTimePressure(a) ? 1 : 0) - (hasTimePressure(b) ? 1 : 0);
        if (d !== 0) return d;
        break;
      }
      case "reset_exposure": {
        const aReset = a.cost.resetExposure ?? Number.MAX_SAFE_INTEGER;
        const bReset = b.cost.resetExposure ?? Number.MAX_SAFE_INTEGER;
        const d = aReset - bReset;
        if (d !== 0) return d;
        break;
      }
      case "total_cost": {
        const d = a.cost.typicalToFund - b.cost.typicalToFund;
        if (d !== 0) return d;
        break;
      }
      case "phase_count": {
        const d = phaseCountFor(a.account) - phaseCountFor(b.account);
        if (d !== 0) return d;
        break;
      }
      default:
        break;
    }
  }
  return 0;
}

function sortByFallback(a: DiscoveryRecommendation, b: DiscoveryRecommendation) {
  // Conservative fallback ordering:
  // 1) fewer kill rules
  if (a.risk.killRules.length !== b.risk.killRules.length) {
    return a.risk.killRules.length - b.risk.killRules.length;
  }

  // 2) lower typical cost
  if (a.cost.typicalToFund !== b.cost.typicalToFund) {
    return a.cost.typicalToFund - b.cost.typicalToFund;
  }

  // 3) lower reset exposure
  const aReset = a.cost.resetExposure ?? Number.MAX_SAFE_INTEGER;
  const bReset = b.cost.resetExposure ?? Number.MAX_SAFE_INTEGER;
  if (aReset !== bReset) return aReset - bReset;

  return 0;
}

export function runDiscovery(
  request: DiscoveryRequestFactsFirst,
  dataset: Dataset
): DiscoveryResult {
  const req = normalizeRequest(request);

  const firmBySlug = new Map(dataset.firms.map((f) => [f.firmSlug, f]));
  const rulesByAccount = new Map<string, RuleFactInstance[]>();
  for (const rp of dataset.ruleProfiles) {
    rulesByAccount.set(rp.accountId, rp.ruleFacts);
  }

  const candidates: Array<DiscoveryRecommendation & { _pref: number }> = [];

  for (const account of dataset.accounts) {
    const rules = rulesByAccount.get(account.accountId) ?? [];
    if (!passesHardFilters(req, rules, account)) continue;

    const firm = firmBySlug.get(account.firmSlug);
    if (!firm) continue;

    const cost = buildCostModel(account);
    const risk = buildRiskSurface(rules);
    const { whyThisWins, whatYouGiveUp } = buildExplanations(account, rules);
    const comparisonRows = buildComparisonRows(account, rules);

    const _pref = preferenceScore(req, rules, account);

    candidates.push({
      account,
      firm,
      cost,
      risk,
      whyThisWins,
      whatYouGiveUp,
      comparisonRows,
      _pref,
    });
  }

  if (candidates.length === 0) {
    throw new Error("Discovery: no viable accounts after applying constraints.");
  }

  const ranked = [...candidates].sort((a, b) => {
    if (a._pref !== b._pref) return b._pref - a._pref;
    const p = sortByPriorities(req.priorities, a, b);
    if (p !== 0) return p;
    return sortByFallback(a, b);
  });

  const clean: DiscoveryRecommendation[] = ranked.map(({ _pref, ...rest }) => rest);

  const primary = clean[0];
  const alternatives = clean.slice(1, 5);

  // Optional: compare to current account if present
  let beatsCurrentBadge: string | undefined;
  let beatsCurrentWhy: string[] | undefined;

  if (req.currentAccountId) {
    const current = clean.find((c) => c.account.accountId === req.currentAccountId);
    if (current && primary.risk.killRules.length < current.risk.killRules.length) {
      beatsCurrentBadge = "Beats your current account";
      beatsCurrentWhy = [
        "Fewer rules that end accounts during evaluation.",
        "Lower reset exposure under normal variance.",
      ];
    }
  }

  return { primary, alternatives, beatsCurrentBadge, beatsCurrentWhy };
}
