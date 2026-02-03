import { supabase } from "@/lib/supabaseClient";

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

function mapRowToAccount(row: any): Account {
  return {
    id: row.id,
    firmSlug: (row.firm_slug ?? "").toString(),
    phase: row.current_phase as FirmPhase,

    name: (row.name ?? "").toString(),
    accountNumber: row.account_number ?? undefined,
    accountType: row.account_type ?? undefined,
    status: row.status ?? undefined,

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

/**
 * DB source of truth: public.paths
 * - Each row = one prop firm account instance
 * - RLS should restrict rows to the logged-in user.
 */

export async function listAccountsDb(): Promise<Account[]> {
  // RLS will filter to auth.uid() = user_id
  const { data, error } = await supabase
    .from("paths")
    .select(
      "id, firm_slug, current_phase, name, account_number, account_type, status, created_at, updated_at"
    )
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRowToAccount);
}

export async function getAccountDb(id: string): Promise<Account | null> {
  const { data, error } = await supabase
    .from("paths")
    .select(
      "id, firm_slug, current_phase, name, account_number, account_type, status, created_at, updated_at"
    )
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapRowToAccount(data) : null;
}

export async function upsertAccountDb(input: {
  id?: string;
  firmSlug: string;
  phase: FirmPhase;
  name: string;
  accountNumber?: string;
  accountType?: string;
  status?: Account["status"];
}): Promise<Account> {
  const userId = await requireUserId();

  const payload: any = {
    user_id: userId,
    firm_slug: (input.firmSlug || "").trim().toLowerCase(),
    current_phase: input.phase,
    name: (input.name || "").trim(),
    account_number: input.accountNumber ?? null,
    account_type: input.accountType ?? null,
    status: input.status ?? "active",
  };

  // If you provide id, we upsert on PK "id"
  if (input.id) payload.id = input.id;

  const { data, error } = await supabase
    .from("paths")
    .upsert(payload, { onConflict: "id" })
    .select(
      "id, firm_slug, current_phase, name, account_number, account_type, status, created_at, updated_at"
    )
    .single();

  if (error) throw new Error(error.message);
  return mapRowToAccount(data);
}

export async function updateAccountDb(
  id: string,
  patch: Partial<{
    firmSlug: string;
    phase: FirmPhase;
    name: string;
    accountNumber?: string;
    accountType?: string;
    status?: Account["status"];
  }>
): Promise<Account> {
  const updates: any = {};
  if (patch.firmSlug !== undefined) updates.firm_slug = patch.firmSlug.trim().toLowerCase();
  if (patch.phase !== undefined) updates.current_phase = patch.phase;
  if (patch.name !== undefined) updates.name = patch.name;
  if (patch.accountNumber !== undefined) updates.account_number = patch.accountNumber ?? null;
  if (patch.accountType !== undefined) updates.account_type = patch.accountType ?? null;
  if (patch.status !== undefined) updates.status = patch.status ?? null;

  const { data, error } = await supabase
    .from("paths")
    .update(updates)
    .eq("id", id)
    .select(
      "id, firm_slug, current_phase, name, account_number, account_type, status, created_at, updated_at"
    )
    .single();

  if (error) throw new Error(error.message);
  return mapRowToAccount(data);
}

export async function deleteAccountDb(id: string): Promise<void> {
  const { error } = await supabase.from("paths").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
