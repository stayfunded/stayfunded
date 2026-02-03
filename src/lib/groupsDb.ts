import { supabase } from "@/lib/supabaseClient";

export type AccountGroup = {
  id: string;
  userId: string;
  name: string;
  firmSlug: string;
  phase: string; // keep as string to avoid tight coupling; validate in UI
  status: "active" | "archived";
  createdAt: string;
  updatedAt: string;
};

export type AccountGroupMember = {
  id: string;
  userId: string;
  groupId: string;
  accountId: string;
  createdAt: string;
};

function mapGroup(row: any): AccountGroup {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name ?? "Copy group",
    firmSlug: row.firm_slug,
    phase: row.phase,
    status: (row.status ?? "active") as any,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapMember(row: any): AccountGroupMember {
  return {
    id: row.id,
    userId: row.user_id,
    groupId: row.group_id,
    accountId: row.account_id,
    createdAt: row.created_at,
  };
}

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const userId = data?.user?.id;
  if (!userId) throw new Error("Not logged in.");
  return userId;
}

export async function listAccountGroupsDb(): Promise<AccountGroup[]> {
  const { data, error } = await supabase
    .from("account_groups")
    .select("id,user_id,name,firm_slug,phase,status,created_at,updated_at")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapGroup);
}

export async function listAccountGroupMembersDb(): Promise<AccountGroupMember[]> {
  const { data, error } = await supabase
    .from("account_group_members")
    .select("id,user_id,group_id,account_id,created_at");

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapMember);
}

export async function createAccountGroupDb(input: {
  name: string;
  firmSlug: string;
  phase: string;
}): Promise<AccountGroup> {
  const userId = await requireUserId();

  const { data, error } = await supabase
    .from("account_groups")
    .insert({
      user_id: userId,
      name: input.name.trim() || "Copy group",
      firm_slug: input.firmSlug.trim().toLowerCase(),
      phase: input.phase,
      status: "active",
    })
    .select("id,user_id,name,firm_slug,phase,status,created_at,updated_at")
    .single();

  if (error) throw new Error(error.message);
  return mapGroup(data);
}

export async function setAccountGroupMembershipDb(input: {
  accountId: string;
  groupId: string | null; // null = remove from group
}): Promise<void> {
  const userId = await requireUserId();

  // Remove
  if (!input.groupId) {
    const { error } = await supabase
      .from("account_group_members")
      .delete()
      .eq("account_id", input.accountId);

    if (error) throw new Error(error.message);
    return;
  }

  // Upsert membership (unique(account_id))
  const { error } = await supabase
    .from("account_group_members")
    .upsert(
      {
        user_id: userId,
        group_id: input.groupId,
        account_id: input.accountId,
      },
      { onConflict: "account_id" }
    );

  if (error) throw new Error(error.message);
}

export async function updateAccountGroupDb(
  groupId: string,
  patch: Partial<{ name: string; phase: string; status: "active" | "archived" }>
): Promise<void> {
  const updates: any = {};
  if (patch.name !== undefined) updates.name = patch.name;
  if (patch.phase !== undefined) updates.phase = patch.phase;
  if (patch.status !== undefined) updates.status = patch.status;

  const { error } = await supabase.from("account_groups").update(updates).eq("id", groupId);
  if (error) throw new Error(error.message);
}
