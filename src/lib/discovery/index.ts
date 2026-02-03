// src/lib/discovery/index.ts

export type {
  FirmPhase,
  RuleSeverity,
  RuleValue,
  RuleFactInstance,
  Firm,
  Account,
  AccountRuleProfile,
  FactPriority,
  DiscoveryRequestFactsFirst,
  DiscoveryResult,
  DiscoveryRecommendation,
  TradeoffDelta,
} from "./types";

export {
  DEFAULT_PHASE_FOCUS,
  DEFAULT_PRIORITIES,
  DEFAULT_REQUEST,
  normalizeRequest,
} from "./defaults";

export { runDiscovery } from "./rank";

export { getDiscoveryDataset } from "./data/v1";
