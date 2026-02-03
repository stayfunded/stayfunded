// src/lib/discovery/types.ts

export type FirmPhase =
  | "discovery"
  | "evaluation"
  | "stabilization"
  | "payout"
  | "maintenance";

export type RuleSeverity = "kill" | "constraint" | "friction";

export type RuleValue =
  | { kind: "money"; amount: number; currency?: "USD" }
  | { kind: "percent"; pct: number }
  | { kind: "days"; days: number }
  | { kind: "count"; count: number; label?: string }
  | { kind: "enum"; value: string }
  | { kind: "boolean"; value: boolean }
  | { kind: "text"; text: string };

export type RuleFactInstance = {
  ruleSlug: string;
  label: string;
  value: RuleValue;
  severity: RuleSeverity;
  source?: string;
};

export type Firm = {
  firmSlug: string;
  displayName: string;
  affiliateTemplate?: string;
};

export type PhaseStructure =
  | { kind: "simple"; phases: FirmPhase[] }
  | { kind: "named"; phases: { phase: FirmPhase; label: string }[] };

export type Account = {
  accountId: string;
  firmSlug: string;
  accountName: string;
  accountSize: number;

  phaseStructure: PhaseStructure;

  // Cost facts
  priceInitial: number;
  priceReset: number | null;
  monthlyFee: number | null;

  // Conversion
  purchaseUrl: string;
};

export type AccountRuleProfile = {
  accountId: string;
  phase: FirmPhase;
  ruleFacts: RuleFactInstance[];
};

/**
 * Facts-first priority toggles (still “objective”, just choosing what to optimize for).
 */
export type FactPriority =
  | "kill_rules"
  | "time_pressure"
  | "reset_exposure"
  | "total_cost"
  | "phase_count";

export type DiscoveryRequestFactsFirst = {
  currentFirmSlug?: string;
  currentAccountId?: string;

  budgetCeiling?: number;

  priorities?: FactPriority[];

  mustHave?: string[];
  exclude?: string[];
};

export type CostModel = {
  day0Cost: number;
  carryCost30: number | null;
  resetExposure: number | null;
  typicalToFund: number;
};

export type RuleRiskSurface = {
  killRules: RuleFactInstance[];
  pressureRules: RuleFactInstance[];
  varianceAmplifiers: RuleFactInstance[];
};

export type TradeoffDelta = {
  label: string;
  recommended: string;
  alternative: string;
  differs: boolean;
};

export type DiscoveryRecommendation = {
  account: Account;
  firm: Firm;

  cost: CostModel;
  risk: RuleRiskSurface;

  whyThisWins: string[];
  whatYouGiveUp: string[];

  comparisonRows: TradeoffDelta[];
};

export type DiscoveryResult = {
  primary: DiscoveryRecommendation;
  alternatives: DiscoveryRecommendation[];

  beatsCurrentBadge?: string;
  beatsCurrentWhy?: string[];
};
