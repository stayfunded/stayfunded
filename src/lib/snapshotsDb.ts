// src/lib/snapshotsDb.ts
import { supabase } from "@/lib/supabaseClient";

export type AccountSnapshot = {
  id: string;
  userId: string;
  accountId: string;
  date: string; // YYYY-MM-DD

  balance: number;
  maxLossThreshold: number;
  drawdownType?: string | null;

  daysUsed?: number | null;
  daysRemaining?: number | null;

  createdAt: string;
  updatedAt: string;
};

function mapRow(row: any): AccountSnapshot {
  return {
    id: row.id,
    userId: row.user_id,
    accountId: row.account_id,
    date: row.date,

    balance: Number(row.balance),
    maxLossThreshold: Number(row.max_loss_threshold),
    drawdownType: row.drawdown_type ?? null,

    daysUsed: row.days_used ?? null,
    daysRemaining: row.days_remaining ?? null,

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

const SNAPSHOT_SELECT =
  "id, user_id, account_id, date, balance, max_loss_threshold, drawdown_type, days_used, days_remaining, created_at, updated_at";

export async function getSnapshotDb(accountId: string, dateISO: string): Promise<AccountSnapshot | null> {
  const { data, error } = await supabase
    .from("account_snapshots")
    .select(SNAPSHOT_SELECT)
    .eq("account_id", accountId)
    .eq("date", dateISO)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapRow(data) : null;
}

export async function upsertSnapshotDb(input: {
  accountId: string;
  date: string; // YYYY-MM-DD
  balance: number;
  maxLossThreshold: number;
  drawdownType?: string | null;
  daysUsed?: number | null;
  daysRemaining?: number | null;

  // allowed during migration (ignored by DB if column removed)
  remainingDrawdown?: number | null;
}): Promise<AccountSnapshot> {
  const userId = await requireUserId();

  const payload: any = {
    user_id: userId,
    account_id: input.accountId,
    date: input.date,
    balance: input.balance,
    max_loss_threshold: input.maxLossThreshold,
    drawdown_type: input.drawdownType ?? null,
    days_used: input.daysUsed ?? null,
    days_remaining: input.daysRemaining ?? null,
  };

  // Optional: if you still have remaining_drawdown column and want to keep it populated.
  if (input.remainingDrawdown !== undefined) payload.remaining_drawdown = input.remainingDrawdown;

  // Unique(account_id, date) handles the upsert constraint
  const { data, error } = await supabase
    .from("account_snapshots")
    .upsert(payload, { onConflict: "account_id,date" })
    .select(SNAPSHOT_SELECT)
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data);
}

export async function listRecentSnapshotsDb(accountId: string, limit = 14): Promise<AccountSnapshot[]> {
  const { data, error } = await supabase
    .from("account_snapshots")
    .select(SNAPSHOT_SELECT)
    .eq("account_id", accountId)
    .order("date", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRow);
}

/**
 * Dashboard helper: which accounts have a snapshot on a given date (for the logged-in user).
 */
export async function listSnapshotAccountIdsForDateDb(dateISO: string): Promise<string[]> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from("account_snapshots")
    .select("account_id")
    .eq("user_id", userId)
    .eq("date", dateISO);

  if (error) throw new Error(error.message);
  return (data ?? []).map((r: any) => String(r.account_id));
}
