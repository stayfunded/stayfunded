import { supabase } from "@/lib/supabaseClient";

export type DiscordMembershipStatus = "pending" | "approved" | "rejected";

export type DiscordMembership = {
  id: string;
  userId: string;
  firmSlug: string;
  phase: string;
  discordHandle: string | null;
  status: DiscordMembershipStatus;
  accountId?: string | null;
  groupId?: string | null;
  createdAt: string;
  requestedAt?: string | null;
  reviewedAt?: string | null;
  reviewNote?: string | null;
};

function mapRow(row: any): DiscordMembership {
  return {
    id: row.id,
    userId: row.user_id,
    firmSlug: row.firm_slug,
    phase: row.phase,
    discordHandle: row.discord_handle ?? null,
    status: row.status,
    accountId: row.account_id ?? null,
    groupId: row.group_id ?? null,
    createdAt: row.created_at,
    requestedAt: row.requested_at ?? null,
    reviewedAt: row.reviewed_at ?? null,
    reviewNote: row.review_note ?? null,
  };
}

/**
 * Read the current user's Discord membership row for firm + phase.
 * Used by Account + Dashboard.
 */
export async function getDiscordMembershipForScope(
  firmSlug: string,
  phase: string
): Promise<DiscordMembership | null> {
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw new Error(userErr.message);
  const userId = userRes?.user?.id;
  if (!userId) throw new Error("Not logged in.");

  const { data, error } = await supabase
    .from("discord_memberships")
    .select(
      "id,user_id,firm_slug,phase,discord_handle,status,account_id,group_id,created_at,requested_at,reviewed_at,review_note"
    )
    .eq("user_id", userId)
    .eq("firm_slug", (firmSlug || "").trim().toLowerCase())
    .eq("phase", phase)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapRow(data) : null;
}

/**
 * Request Discord access.
 * Inserts/updates the current user's row for (firm_slug, phase) into pending.
 * RLS prevents users from editing once approved/rejected (expected).
 */
export async function requestDiscordAccess(params: {
  firmSlug: string;
  phase: string;
  discordHandle: string;
  accountId?: string | null;
  groupId?: string | null;
}): Promise<void> {
  const { firmSlug, phase, discordHandle, accountId, groupId } = params;

  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw new Error(userErr.message);
  const userId = userRes?.user?.id;
  if (!userId) throw new Error("Not logged in.");

  const payload = {
    user_id: userId,
    firm_slug: (firmSlug || "").trim().toLowerCase(),
    phase,
    discord_handle: (discordHandle || "").trim(),
    status: "pending" as const,
    requested_at: new Date().toISOString(),
    account_id: accountId ?? null,
    group_id: groupId ?? null,
  };

  const { error } = await supabase
    .from("discord_memberships")
    .upsert(payload, { onConflict: "user_id,firm_slug,phase" });

  if (error) throw new Error(error.message);
}
