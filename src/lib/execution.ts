// src/lib/execution.ts
import { supabase } from "@/lib/supabaseClient";
import type { FirmPhase } from "@/lib/accountsDb";

export type DayIntent = "trade" | "no_trade";

export type DayClassification =
  | "good_execution"
  | "rule_safe_no_trade"
  | "increased_future_risk";

export type ExecutionDay = {
  accountId: string; // paths.id
  date: string; // YYYY-MM-DD
  phaseAtTime: FirmPhase;

  intent: DayIntent | null;
  completed: boolean;

  classification: DayClassification | null;
  notes?: string;

  createdAt: string; // ISO
  updatedAt: string; // ISO
};

function mapRowToExecutionDay(row: any): ExecutionDay {
  return {
    accountId: row.path_id,
    date: row.date, // Supabase returns YYYY-MM-DD for date columns
    phaseAtTime: (row.phase_at_time ?? "evaluation") as FirmPhase,

    intent: (row.intent ?? null) as DayIntent | null,
    completed: !!row.completed,

    classification: (row.classification ?? null) as DayClassification | null,
    notes: (row.notes ?? undefined) || undefined,

    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const userId = data?.user?.id;
  if (!userId) throw new Error("Not logged in.");
  return userId;
}

export async function getExecutionDay(
  accountId: string,
  date: string
): Promise<ExecutionDay | null> {
  const { data, error } = await supabase
    .from("execution_days")
    .select(
      "path_id, date, phase_at_time, intent, completed, classification, notes, created_at, updated_at"
    )
    .eq("path_id", accountId)
    .eq("date", date)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapRowToExecutionDay(data) : null;
}

/**
 * Ensure a day exists (idempotent). This is how we avoid "missing day" edge cases.
 */
export async function ensureExecutionDay(input: {
  accountId: string;
  date: string; // YYYY-MM-DD
  phaseAtTime: FirmPhase;
}): Promise<ExecutionDay> {
  const userId = await requireUserId();

  const payload: any = {
    user_id: userId,
    path_id: input.accountId,
    date: input.date,
    phase_at_time: input.phaseAtTime,
    intent: null,
    completed: false,
    classification: null,
    notes: null,
  };

  const { data, error } = await supabase
    .from("execution_days")
    // unique (path_id, date)
    .upsert(payload, { onConflict: "path_id,date" })
    .select(
      "path_id, date, phase_at_time, intent, completed, classification, notes, created_at, updated_at"
    )
    .single();

  if (error) throw new Error(error.message);
  return mapRowToExecutionDay(data);
}

export async function setDayIntent(input: {
  accountId: string;
  date: string;
  phaseAtTime: FirmPhase;
  intent: DayIntent;
}): Promise<ExecutionDay> {
  const userId = await requireUserId();

  // upsert to ensure row exists, then set intent + reset closeout fields
  const payload: any = {
    user_id: userId,
    path_id: input.accountId,
    date: input.date,
    phase_at_time: input.phaseAtTime,
    intent: input.intent,
    completed: false,
    classification: null,
    // keep notes as-is (do not blank)
  };

  const { data, error } = await supabase
    .from("execution_days")
    .upsert(payload, { onConflict: "path_id,date" })
    .select(
      "path_id, date, phase_at_time, intent, completed, classification, notes, created_at, updated_at"
    )
    .single();

  if (error) throw new Error(error.message);
  return mapRowToExecutionDay(data);
}

export async function closeOutDay(input: {
  accountId: string;
  date: string;
  phaseAtTime: FirmPhase;
  classification: DayClassification;
  notes?: string;
}): Promise<ExecutionDay> {
  const userId = await requireUserId();

  const trimmedNotes = (input.notes ?? "").trim();

  const payload: any = {
    user_id: userId,
    path_id: input.accountId,
    date: input.date,
    phase_at_time: input.phaseAtTime,
    completed: true,
    classification: input.classification,
    notes: trimmedNotes ? trimmedNotes : null,
  };

  const { data, error } = await supabase
    .from("execution_days")
    .upsert(payload, { onConflict: "path_id,date" })
    .select(
      "path_id, date, phase_at_time, intent, completed, classification, notes, created_at, updated_at"
    )
    .single();

  if (error) throw new Error(error.message);
  return mapRowToExecutionDay(data);
}

export async function listExecutionDaysForAccount(
  accountId: string,
  opts?: { limit?: number }
): Promise<ExecutionDay[]> {
  const limit = opts?.limit ?? 120;

  const { data, error } = await supabase
    .from("execution_days")
    .select(
      "path_id, date, phase_at_time, intent, completed, classification, notes, created_at, updated_at"
    )
    .eq("path_id", accountId)
    .order("date", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRowToExecutionDay);
}

/**
 * Phase-local streak: counts consecutive completed days with "good" classifications,
 * for the current phase only.
 *
 * - Includes both good_execution and rule_safe_no_trade.
 * - Breaks on increased_future_risk.
 * - Breaks on missing closeout (i.e., not completed).
 */
export async function getPhaseStreak(input: {
  accountId: string;
  phase: FirmPhase;
}): Promise<number> {
  const days = (await listExecutionDaysForAccount(input.accountId, { limit: 180 })).filter(
    (d) => d.phaseAtTime === input.phase
  );

  let streak = 0;

  for (const d of days) {
    if (!d.completed || !d.classification) break;

    if (d.classification === "good_execution" || d.classification === "rule_safe_no_trade") {
      streak += 1;
      continue;
    }

    // increased_future_risk breaks
    break;
  }

  return streak;
}
