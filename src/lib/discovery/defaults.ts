// src/lib/discovery/defaults.ts

import type { DiscoveryRequestFactsFirst, FactPriority, FirmPhase } from "./types";

/**
 * Discovery is facts-first and must work with zero input.
 * These are internal "house defaults" and are NOT shown as user claims.
 */

export const DEFAULT_PHASE_FOCUS: FirmPhase = "evaluation";

export const DEFAULT_PRIORITIES: FactPriority[] = [
  "kill_rules",
  "time_pressure",
  "reset_exposure",
];

// Constraint keys used by v1 (checkbox-style). Keep this list small and stable.
export const CONSTRAINT_KEYS = {
  NO_TRAILING_DRAWDOWN: "no-trailing-drawdown",
  LOW_TIME_PRESSURE: "low-time-pressure",
  MINIMIZE_MONTHLY_FEES: "minimize-monthly-fees",
  AVOID_INACTIVITY_RULES: "avoid-inactivity-rules",
  PREFER_FEWER_PHASES: "prefer-fewer-phases",
} as const;

export type ConstraintKey = (typeof CONSTRAINT_KEYS)[keyof typeof CONSTRAINT_KEYS];

export const DEFAULT_REQUEST: DiscoveryRequestFactsFirst = {
  priorities: DEFAULT_PRIORITIES,
  mustHave: [
    // default bias: reduce forcing & common disqualifiers
    CONSTRAINT_KEYS.LOW_TIME_PRESSURE,
  ],
  exclude: [],
};

export function normalizeRequest(
  req: DiscoveryRequestFactsFirst | null | undefined
): DiscoveryRequestFactsFirst {
  const mustHave = Array.from(
    new Set([...(DEFAULT_REQUEST.mustHave ?? []), ...(req?.mustHave ?? [])])
  );

  const exclude = Array.from(
    new Set([...(DEFAULT_REQUEST.exclude ?? []), ...(req?.exclude ?? [])])
  );

  const priorities = Array.from(
    new Set([...(DEFAULT_REQUEST.priorities ?? []), ...(req?.priorities ?? [])])
  ) as FactPriority[];

  return {
    currentFirmSlug: req?.currentFirmSlug,
    currentAccountId: req?.currentAccountId,
    budgetCeiling: req?.budgetCeiling,
    priorities,
    mustHave,
    exclude,
  };
}
