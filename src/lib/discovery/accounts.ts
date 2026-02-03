// src/lib/accounts.ts
export type FirmPhase =
  | "discovery"
  | "evaluation"
  | "stabilization"
  | "payout"
  | "maintenance";

export type PropFirmSlug =
  | "topstep"
  | "apex"
  | "earn2trade"
  | "take-profit-trader"
  | (string & {});

export type PropAccount = {
  id: string;
  friendlyName: string; // user-facing label
  firmSlug: PropFirmSlug;
  accountType?: string; // e.g. "50K Eval", "PA", "XFA", etc.
  accountNumber?: string; // optional
  phase: FirmPhase;

  // Optional grouping for copy-traded / linked accounts
  linkedGroupId?: string;

  notes?: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
};

export type AccountsState = {
  version: 1;
  activeAccountId: string | null;
  accounts: PropAccount[];
  updatedAt: string; // ISO
};

const STORAGE_KEY_V1_SINGLE = "sf_account_state_v1"; // your old key
const STORAGE_KEY_V1_MULTI = "sf_accounts_v1"; // new key

function nowIso() {
  return new Date().toISOString();
}

function safeJsonParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function isFirmPhase(v: any): v is FirmPhase {
  return (
    v === "discovery" ||
    v === "evaluation" ||
    v === "stabilization" ||
    v === "payout" ||
    v === "maintenance"
  );
}

export function makeId(prefix = "acc") {
  // good-enough unique for localStorage
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

export function titleizeFirm(slug: string) {
  const s = (slug || "").trim().toLowerCase();
  const map: Record<string, string> = {
    topstep: "Topstep",
    apex: "Apex Trader Funding",
    earn2trade: "Earn2Trade",
    "take-profit-trader": "Take Profit Trader",
  };
  return (
    map[s] ??
    s
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export function titleCase(s: string) {
  return (s || "")
    .split("-")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export function getAccountsState(): AccountsState {
  if (typeof window === "undefined") {
    return { version: 1, activeAccountId: null, accounts: [], updatedAt: nowIso() };
  }

  // 1) If multi-store exists, return it
  const existing = safeJsonParse<AccountsState>(localStorage.getItem(STORAGE_KEY_V1_MULTI));
  if (existing && existing.version === 1 && Array.isArray(existing.accounts)) {
    return existing;
  }

  // 2) Migrate from old single-store if present
  const old = safeJsonParse<any>(localStorage.getItem(STORAGE_KEY_V1_SINGLE));
  if (old && typeof old === "object") {
    const firmSlug =
      typeof old.firmSlug === "string" && old.firmSlug.trim()
        ? old.firmSlug.trim().toLowerCase()
        : "topstep";

    const phase: FirmPhase =
      isFirmPhase(old.currentPhase) ? old.currentPhase : "evaluation";

    const migrated: PropAccount = {
      id: makeId("migrated"),
      friendlyName: `${titleizeFirm(firmSlug)} (migrated)`,
      firmSlug,
      phase,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };

    const next: AccountsState = {
      version: 1,
      activeAccountId: migrated.id,
      accounts: [migrated],
      updatedAt: nowIso(),
    };

    try {
      localStorage.setItem(STORAGE_KEY_V1_MULTI, JSON.stringify(next));
      // keep old key for now (no destructive delete). You can remove later.
    } catch {
      // ignore
    }

    return next;
  }

  // 3) Nothing exists -> initialize
  const blank: AccountsState = {
    version: 1,
    activeAccountId: null,
    accounts: [],
    updatedAt: nowIso(),
  };

  try {
    localStorage.setItem(STORAGE_KEY_V1_MULTI, JSON.stringify(blank));
  } catch {
    // ignore
  }

  return blank;
}

export function saveAccountsState(state: AccountsState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY_V1_MULTI,
      JSON.stringify({ ...state, version: 1, updatedAt: nowIso() })
    );
  } catch {
    // ignore
  }
}

export function setActiveAccountId(id: string | null) {
  const s = getAccountsState();
  const next: AccountsState = { ...s, activeAccountId: id, updatedAt: nowIso() };
  saveAccountsState(next);
  return next;
}

export function upsertAccount(partial: Partial<PropAccount> & { id?: string }) {
  const s = getAccountsState();
  const id = partial.id || makeId("acc");

  const existing = s.accounts.find((a) => a.id === id);
  const base: PropAccount =
    existing ??
    ({
      id,
      friendlyName: "Untitled account",
      firmSlug: "topstep",
      phase: "evaluation",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    } as PropAccount);

  const merged: PropAccount = {
    ...base,
    ...partial,
    firmSlug: (partial.firmSlug ?? base.firmSlug ?? "topstep").toString().toLowerCase(),
    phase: (partial.phase ?? base.phase) as FirmPhase,
    updatedAt: nowIso(),
  };

  const accounts = existing
    ? s.accounts.map((a) => (a.id === id ? merged : a))
    : [merged, ...s.accounts];

  const next: AccountsState = {
    ...s,
    accounts,
    activeAccountId: s.activeAccountId ?? id,
    updatedAt: nowIso(),
  };

  saveAccountsState(next);
  return { state: next, account: merged };
}

export function deleteAccount(id: string) {
  const s = getAccountsState();
  const accounts = s.accounts.filter((a) => a.id !== id);

  const activeAccountId =
    s.activeAccountId === id ? (accounts[0]?.id ?? null) : s.activeAccountId;

  const next: AccountsState = { ...s, accounts, activeAccountId, updatedAt: nowIso() };
  saveAccountsState(next);
  return next;
}

export function getActiveAccount(): PropAccount | null {
  const s = getAccountsState();
  if (!s.activeAccountId) return null;
  return s.accounts.find((a) => a.id === s.activeAccountId) ?? null;
}
