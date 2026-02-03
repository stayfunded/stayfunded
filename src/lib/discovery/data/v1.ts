// src/lib/discovery/data/v1.ts

import type {
    Firm,
    Account,
    AccountRuleProfile,
    FirmPhase,
    RuleFactInstance,
  } from "../types";
  
  /**
   * v1 stub dataset
   * Purpose: unblock Discovery UI + ranking logic end-to-end.
   * This is not authoritative data.
   */
  
  // --------------------
  // Firms
  // --------------------
  
  export const FIRMS: Firm[] = [
    {
      firmSlug: "topstep",
      displayName: "Topstep",
    },
    {
      firmSlug: "apex",
      displayName: "Apex Trader Funding",
    },
  ];
  
  // --------------------
  // Accounts
  // --------------------
  
  export const ACCOUNTS: Account[] = [
    {
      accountId: "topstep:50k:eval",
      firmSlug: "topstep",
      accountName: "$50K Evaluation",
      accountSize: 50_000,
      phaseStructure: {
        kind: "simple",
        phases: ["evaluation"],
      },
      priceInitial: 165,
      priceReset: null,
      monthlyFee: null,
      purchaseUrl: "https://example.com/topstep-50k",
    },
    {
      accountId: "apex:50k:eval",
      firmSlug: "apex",
      accountName: "$50K Evaluation",
      accountSize: 50_000,
      phaseStructure: {
        kind: "simple",
        phases: ["evaluation"],
      },
      priceInitial: 145,
      priceReset: 80,
      monthlyFee: null,
      purchaseUrl: "https://example.com/apex-50k",
    },
  ];
  
  // --------------------
  // Rule Profiles (evaluation phase)
  // --------------------
  
  function rule(
    ruleSlug: string,
    label: string,
    severity: RuleFactInstance["severity"]
  ): RuleFactInstance {
    return {
      ruleSlug,
      label,
      severity,
      value: { kind: "boolean", value: true },
    };
  }
  
  export const RULE_PROFILES: AccountRuleProfile[] = [
    {
      accountId: "topstep:50k:eval",
      phase: "evaluation",
      ruleFacts: [
        rule("daily-loss-limit", "Daily loss limit", "constraint"),
        rule("profit-target-asymmetry", "Profit target asymmetry", "constraint"),
        rule("scaling-and-contract-limits", "Contract limits", "friction"),
        // intentionally NO trailing drawdown
        // intentionally LOW time pressure
      ],
    },
    {
      accountId: "apex:50k:eval",
      phase: "evaluation",
      ruleFacts: [
        rule("trailing-drawdown", "Trailing drawdown", "kill"),
        rule("daily-loss-limit", "Daily loss limit", "constraint"),
        rule("time-pressure-and-inactivity", "Time pressure & inactivity", "constraint"),
        rule("scaling-and-contract-limits", "Contract limits", "friction"),
      ],
    },
  ];
  
  // --------------------
  // Dataset export
  // --------------------
  
  export function getDiscoveryDataset() {
    return {
      firms: FIRMS,
      accounts: ACCOUNTS,
      ruleProfiles: RULE_PROFILES,
    };
  }
  