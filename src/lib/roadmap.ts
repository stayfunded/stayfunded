// src/lib/roadmap.ts

import type { FirmPhase } from "@/lib/accounts";

export type RoadmapWeek = {
  accountId: string;
  weekStart: string; // ISO date (YYYY-MM-DD), Monday
  objective: string;
  constraints: string[];
  operatingPlan: string[];
  completionCriteria: string[];
  updatedAt: string; // ISO
};

type Store = {
  version: 1;
  weeks: RoadmapWeek[];
};

const STORE_KEY = "sf_roadmap_store_v1";

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function nowIso() {
  return new Date().toISOString();
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function safeRead(key: string) {
  if (!isBrowser()) return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeWrite(key: string, value: unknown) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function defaultStore(): Store {
  return { version: 1, weeks: [] };
}

function readStore(): Store {
  const parsed = safeParse<Store>(safeRead(STORE_KEY));
  if (parsed && parsed.version === 1 && Array.isArray(parsed.weeks)) return parsed;
  const fresh = defaultStore();
  safeWrite(STORE_KEY, fresh);
  return fresh;
}

function writeStore(store: Store) {
  safeWrite(STORE_KEY, store);
}

export function getWeekStartISO(d = new Date()) {
  // Monday-based week start, return YYYY-MM-DD in local time
  const date = new Date(d);
  const day = date.getDay(); // 0 Sun ... 6 Sat
  const diff = (day === 0 ? -6 : 1 - day); // shift back to Monday
  date.setDate(date.getDate() + diff);
  date.setHours(0, 0, 0, 0);

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function getRoadmapWeek(accountId: string, weekStart: string): RoadmapWeek | null {
  const s = readStore();
  return s.weeks.find((w) => w.accountId === accountId && w.weekStart === weekStart) ?? null;
}

export function upsertRoadmapWeek(input: Omit<RoadmapWeek, "updatedAt">): RoadmapWeek {
  const s = readStore();
  const updatedAt = nowIso();
  const next: RoadmapWeek = { ...input, updatedAt };

  const idx = s.weeks.findIndex((w) => w.accountId === input.accountId && w.weekStart === input.weekStart);
  const weeks = idx >= 0 ? s.weeks.map((w, i) => (i === idx ? next : w)) : [next, ...s.weeks];

  writeStore({ version: 1, weeks });
  return next;
}

export function defaultRoadmapTemplate(phase: FirmPhase) {
  // No numbers. No performance. No journaling. Behavior under constraints only.
  const templates: Record<
    FirmPhase,
    Pick<RoadmapWeek, "objective" | "constraints" | "operatingPlan" | "completionCriteria">
  > = {
    discovery: {
      objective: "Choose a firm + account structure you can survive without resets or rule traps.",
      constraints: [
        "Avoid structures that punish your natural trading style",
        "Prefer clarity over marketing",
        "Treat rule complexity as risk",
      ],
      operatingPlan: [
        "Compare 2–3 candidate structures using rules, not hype",
        "Decide what you will not tolerate (drawdown type, daily loss, consistency traps)",
        "Commit to one selection and stop reopening the decision daily",
      ],
      completionCriteria: [
        "I selected one account structure with clear reasons",
        "I can explain the dominant failure rule in one sentence",
      ],
    },
    evaluation: {
      objective: "Stay eligible under constraints long enough for variance to resolve.",
      constraints: [
        "Trailing drawdown / daily loss enforcement",
        "Early size escalation pressure",
        "Revenge and overtrading after small losses",
      ],
      operatingPlan: [
        "Operate defensively: protect eligibility first",
        "Reduce variance exposure (fewer attempts, lower aggression)",
        "Treat rule survival as the win condition this week",
      ],
      completionCriteria: [
        "I stayed eligible all week (no rule breaches)",
        "I avoided escalation after losses",
      ],
    },
    stabilization: {
      objective: "Reduce variance and build buffer without giving the account back.",
      constraints: [
        "Post-pass overconfidence",
        "Size creep",
        "Drawdown sensitivity while buffer is thin",
      ],
      operatingPlan: [
        "Trade smaller than ego wants",
        "Keep behavior repeatable and boring",
        "Avoid expanding variance because the account feels 'real' now",
      ],
      completionCriteria: [
        "I kept behavior consistent (no variance expansion)",
        "I prioritized preservation over speed",
      ],
    },
    payout: {
      objective: "Extract value while staying compliant with payout mechanics.",
      constraints: [
        "Minimum days / consistency enforcement",
        "Eligibility traps around withdrawals",
        "Overtrading near payout thresholds",
      ],
      operatingPlan: [
        "Trade with compliance first, not excitement",
        "Avoid changing behavior near payout moments",
        "Keep the system stable and repeatable",
      ],
      completionCriteria: [
        "I maintained compliance all week",
        "I avoided behavior changes near withdrawal triggers",
      ],
    },
    maintenance: {
      objective: "Keep funded accounts alive by preventing slow failure and rule drift.",
      constraints: [
        "Discipline decay",
        "Rule drift over time",
        "Small repeated mistakes compounding",
      ],
      operatingPlan: [
        "Keep the plan boring on purpose",
        "Audit behavior weekly against the dominant failure modes",
        "Avoid adding complexity without a clear reason",
      ],
      completionCriteria: [
        "I maintained disciplined behavior all week",
        "I did not introduce new risk patterns",
      ],
    },
  };

  return templates[phase];
}
