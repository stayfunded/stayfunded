// src/lib/accounts.ts
// Legacy localStorage account store (DEPRECATED)
//
// We migrated to Supabase-backed accounts in `src/lib/accountsDb.ts` (public.paths).
// This file is intentionally hard-disabled so any remaining imports fail fast,
// instead of silently creating phantom "local" accounts.

export type FirmPhase =
  | "discovery"
  | "evaluation"
  | "stabilization"
  | "payout"
  | "maintenance";

export type Account = {
  id: string;
  firmSlug: string;
  phase: FirmPhase;
  name: string;
  accountNumber?: string;
  accountType?: string;
  status?: "active" | "paused" | "archived";
  createdAt: string;
  updatedAt: string;
};

function legacyDisabled(): never {
  throw new Error(
    "Legacy localStorage accounts are disabled. Use `@/lib/accountsDb` (Supabase `public.paths`)."
  );
}

// Old API surface (kept only so imports compile; all calls fail fast)
export function listAccounts(): Account[] {
  legacyDisabled();
}
export function getAccount(_id: string): Account | null {
  legacyDisabled();
}
export function getActiveAccountId(): string | null {
  legacyDisabled();
}
export function setActiveAccountId(_id: string) {
  legacyDisabled();
}
export function getActiveAccount(): Account | null {
  legacyDisabled();
}
export function upsertAccount(_input: Partial<Account> & { id?: string }): Account {
  legacyDisabled();
}
export function deleteAccount(_id: string) {
  legacyDisabled();
}

// Shared formatting helpers some UI files may still import.
// These are safe to keep.
export function titleCase(s: string) {
  return (s || "")
    .trim()
    .toLowerCase()
    .split("-")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export function titleizeFirm(slug: string) {
  const map: Record<string, string> = {
    topstep: "Topstep",
    apex: "Apex Trader Funding",
    earn2trade: "Earn2Trade",
    bulenox: "Bulenox",
    "take-profit-trader": "Take Profit Trader",
  };
  const key = (slug || "").trim().toLowerCase();
  return map[key] ?? titleCase(key);
}

export function isFirmPhase(value: any): value is FirmPhase {
  return (
    value === "discovery" ||
    value === "evaluation" ||
    value === "stabilization" ||
    value === "payout" ||
    value === "maintenance"
  );
}
