// src/lib/discordMembershipsDb.ts
import { supabase } from "@/lib/supabaseClient";

export type DiscordMembershipStatus = "pending" | "approved" | "rejected";

export type DiscordMembership = {
  id: string;
  userId: string;
  firmSlug: string;
  phase: string;
  status: DiscordMembershipStatus;

  discordHandle: string | null;
  email: string | null;

  requestedAt: string;
  reviewedAt: string | null;
  reviewNote: string | null;

  accountId: string | null;
  groupId: string | null;
};

function mapRow(r: any): DiscordMembership {
  return {
    id: r.id,
    userId: r.user_id,
    firmSlug: r.firm_slug,
    phase: r.phase,
    status: r.status,

    discordHandle: r.discord_handle ?? null,
    email: r.email ?? null,

    requestedAt: r.requested_at,
    reviewedAt: r.reviewed_at ?? null,
    reviewNote: r.review_note ?? null,

    accountId: r.account_id ?? null,
    groupId: r.group_id ?? null,
  };
}

export async function getDiscordMembershipForScope(input: {
  firmSlug: string;
  phase: string;
}): Promise<DiscordMembership | null> {
  const { data, error } = await supabase
    .from("discord_memberships")
    .select(
      "id,user_id,firm_slug,phase,status,discord_handle,email,requested_at,reviewed_at,review_note,account_id,group_id"
    )
    .eq("firm_slug", input.firmSlug.trim().toLowerCase())
    .eq("phase", input.phase)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapRow(data) : null;
}

export async function requestDiscordAccess(input: {
  firmSlug: string;
  phase: string;
  discordHandle: string;
  email?: string | null;
  accountId?: string | null;
  groupId?: string | null;
}): Promise<DiscordMembership> {
  // IMPORTANT: Unique(user_id, firm_slug, phase) means this is 1 request per firm×phase.
  // Upsert ensures “request again” is idempotent *as long as row is still pending*
  // (RLS blocks edits after approval/rejection).
  const payload: any = {
    firm_slug: input.firmSlug.trim().toLowerCase(),
    phase: input.phase,
    discord_handle: input.discordHandle.trim(),
    email: input.email ?? null,
    status: "pending",
    requested_at: new Date().toISOString(),
    account_id: input.accountId ?? null,
    group_id: input.groupId ?? null,
  };

  const { data, error } = await supabase
    .from("discord_memberships")
    .upsert(payload, { onConflict: "user_id,firm_slug,phase" })
    .select(
      "id,user_id,firm_slug,phase,status,discord_handle,email,requested_at,reviewed_at,review_note,account_id,group_id"
    )
    .single();

  if (error) throw new Error(error.message);
  return mapRow(data);
}
