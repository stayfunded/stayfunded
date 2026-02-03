// src/lib/discovery/util_risk.ts

import type {
    RuleFactInstance,
    RuleRiskSurface,
    RuleSeverity,
  } from "./types";
  
  /**
   * Groups raw rule facts into a risk surface that Discovery can reason about
   * and explain visually.
   *
   * No scoring. No weighting. Just categorization.
   */
  
  function isKillRule(r: RuleFactInstance) {
    return r.severity === "kill";
  }
  
  function isPressureRule(r: RuleFactInstance) {
    // Pressure = rules that force behavior under time / pnl stress
    return (
      r.severity === "constraint" &&
      (r.ruleSlug.includes("time") ||
        r.ruleSlug.includes("profit") ||
        r.ruleSlug.includes("inactivity"))
    );
  }
  
  function isVarianceAmplifier(r: RuleFactInstance) {
    // Variance amplifiers quietly turn normal trading variance into violations
    return (
      r.severity !== "kill" &&
      (r.ruleSlug.includes("trailing") ||
        r.ruleSlug.includes("daily-loss") ||
        r.ruleSlug.includes("drawdown"))
    );
  }
  
  export function buildRiskSurface(
    rules: RuleFactInstance[]
  ): RuleRiskSurface {
    const killRules: RuleFactInstance[] = [];
    const pressureRules: RuleFactInstance[] = [];
    const varianceAmplifiers: RuleFactInstance[] = [];
  
    for (const r of rules) {
      if (isKillRule(r)) {
        killRules.push(r);
        continue;
      }
  
      if (isPressureRule(r)) {
        pressureRules.push(r);
        continue;
      }
  
      if (isVarianceAmplifier(r)) {
        varianceAmplifiers.push(r);
        continue;
      }
    }
  
    return {
      killRules,
      pressureRules,
      varianceAmplifiers,
    };
  }
  