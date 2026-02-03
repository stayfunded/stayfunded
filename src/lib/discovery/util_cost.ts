// src/lib/discovery/util_cost.ts

import type { Account, CostModel } from "./types";

/**
 * v1 cost model is intentionally simple and explainable.
 * "Typical cost to get funded" is a conservative proxy:
 * day0 cost + (monthly fee if present).
 *
 * Later we can replace this with scenario assumptions (time-to-pass, resets),
 * without changing the UI contract.
 */
export function buildCostModel(account: Account): CostModel {
  const day0Cost = account.priceInitial;
  const carryCost30 = account.monthlyFee && account.monthlyFee > 0 ? account.monthlyFee : null;
  const resetExposure = account.priceReset && account.priceReset > 0 ? account.priceReset : null;

  const typicalToFund = day0Cost + (carryCost30 ?? 0);

  return {
    day0Cost,
    carryCost30,
    resetExposure,
    typicalToFund,
  };
}
