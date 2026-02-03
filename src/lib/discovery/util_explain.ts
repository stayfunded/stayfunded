// src/lib/discovery/util_explain.ts

import type { Account, RuleFactInstance } from "./types";

/**
 * Generates plain-English bullets for:
 * - whyThisWins (3–6 bullets)
 * - whatYouGiveUp (2–4 bullets)
 *
 * v1 is template-driven and conservative:
 * - No hype
 * - No scores
 * - No probabilities
 * - One concrete claim per bullet
 *
 * Later we can upgrade this to use richer firm/phase overrides and citations.
 */

function hasRule(rules: RuleFactInstance[], slug: string) {
  return rules.some((r) => r.ruleSlug === slug);
}

function money(n: number) {
  return `$${Math.round(n).toLocaleString("en-US")}`;
}

export function buildExplanations(account: Account, rules: RuleFactInstance[]) {
  const whyThisWins: string[] = [];
  const whatYouGiveUp: string[] = [];

  // --- WHY THIS WINS (facts-first, conservative) ---

  // Trailing drawdown is a major kill mechanic for many firms.
  if (!hasRule(rules, "trailing-drawdown")) {
    whyThisWins.push("No trailing drawdown during evaluation.");
  } else {
    whyThisWins.push("Trailing drawdown is present during evaluation.");
  }

  // Time pressure / inactivity forcing
  if (!hasRule(rules, "time-pressure-and-inactivity")) {
    whyThisWins.push("Less time-based forcing during evaluation.");
  } else {
    whyThisWins.push("Time pressure increases forcing behavior risk.");
  }

  // Daily loss constraints
  if (!hasRule(rules, "daily-loss-limit")) {
    whyThisWins.push("Daily loss mechanics are less likely to force reactive trading.");
  } else {
    whyThisWins.push("Daily loss mechanics can punish recovery behavior under stress.");
  }

  // Reset exposure (cost reality)
  if (!account.priceReset || account.priceReset <= 0) {
    whyThisWins.push("Lower reset exposure compared to most evaluations.");
  } else {
    whyThisWins.push(`Reset exposure exists (${money(account.priceReset)}).`);
  }

  // Keep whyThisWins within 3–6
  const trimmedWhy = whyThisWins.slice(0, 6);

  // --- WHAT YOU GIVE UP (honest negatives; small and stable) ---

  if (account.monthlyFee && account.monthlyFee > 0) {
    whatYouGiveUp.push(`Ongoing monthly fees (${money(account.monthlyFee)}).`);
  }

  if (account.priceInitial >= 200) {
    whatYouGiveUp.push("Higher upfront cost than many entry accounts.");
  }

  if (account.phaseStructure.kind === "named" && account.phaseStructure.phases.length > 1) {
    whatYouGiveUp.push("More phase steps before payout access.");
  }

  if (whatYouGiveUp.length === 0) {
    // Always show something; keep it honest and generic.
    whatYouGiveUp.push("Every account has tradeoffs depending on rules and phase mechanics.");
  }

  const trimmedGiveUp = whatYouGiveUp.slice(0, 4);

  return {
    whyThisWins: trimmedWhy,
    whatYouGiveUp: trimmedGiveUp,
  };
}
