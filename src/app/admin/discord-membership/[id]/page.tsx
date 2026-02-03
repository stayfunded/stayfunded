// src/app/admin/discord-memberships/[id]/page.tsx
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const supabase = createClient(
  (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function fmtDate(dt: string | null) {
  if (!dt) return "—";
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return dt;
  }
}

export default async function DiscordMembershipAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  noStore();
  const { id } = await params;

  // server action: update status
  async function setStatus(formData: FormData) {
    "use server";
    const nextStatus = String(formData.get("status") || "").trim(); // pending|approved|denied
    const note = String(formData.get("note") || "").trim();

    if (!["pending", "approved", "denied"].includes(nextStatus)) return;

    const patch: any = {
      status: nextStatus,
      reviewed_at: new Date().toISOString(),
      review_note: note || null,
    };

    // Option B rule: when resetting to pending, clear review fields (keeps lifecycle clean)
    if (nextStatus === "pending") {
      patch.reviewed_at = null;
      patch.review_note = null;
      patch.reviewed_by = null;
    }

    await supabase
      .from("discord_memberships")
      .update(patch)
      .eq("id", id)
      .throwOnError();
  }

  const { data } = await supabase
    .from("discord_memberships")
    .select(
      "id,user_id,email,discord_handle,firm_slug,phase,status,requested_at,reviewed_at,review_note,account_id,group_id,invite_url,role_key"
    )
    .eq("id", id)
    .single()
    .throwOnError();

  return (
    <main style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Discord Access Request</h1>
          <div style={{ marginTop: 6, fontSize: 13, color: "#475569" }}>
            Approve only after you manually assign the Discord role.
          </div>
        </div>

        <Link href="/admin/inbox?tab=discord&discordStatus=pending" style={{ textDecoration: "underline" }}>
          ← Back to inbox
        </Link>
      </div>

      <div style={{ marginTop: 16, border: "1px solid #e2e8f0", borderRadius: 16, padding: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>Request</div>
        <div style={{ marginTop: 10, fontSize: 13, color: "#0f172a" }}>
          <div><b>User:</b> {data.email || data.user_id}</div>
          <div><b>Discord:</b> {data.discord_handle || "—"}</div>
          <div><b>Firm:</b> {data.firm_slug}</div>
          <div><b>Phase:</b> {data.phase}</div>
          <div>
            <b>Role to assign:</b>{" "}
            {`${data.firm_slug} — ${data.phase}`}
          </div>
          <div><b>Status:</b> {data.status}</div>
          <div><b>Requested:</b> {fmtDate(data.requested_at)}</div>
          <div><b>Reviewed:</b> {fmtDate(data.reviewed_at)}</div>
          <div><b>Note:</b> {data.review_note || "—"}</div>
          <div><b>Scope:</b> {data.group_id ? `group:${data.group_id}` : data.account_id ? `acct:${data.account_id}` : "firm×phase"}</div>
        </div>
      </div>

      <div style={{ marginTop: 16, border: "1px solid #e2e8f0", borderRadius: 16, padding: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>Actions</div>
        <div style={{ marginTop: 8, fontSize: 13, color: "#475569" }}>
          If denied, use “Reset to pending” (Option B) to allow a clean re-request.
        </div>

        <form action={setStatus} style={{ marginTop: 12, display: "grid", gap: 10, maxWidth: 520 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#334155" }}>Review note (optional)</span>
            <textarea
              name="note"
              rows={3}
              defaultValue={data.review_note || ""}
              style={{
                width: "100%",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: 10,
                fontSize: 13,
              }}
            />
          </label>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              name="status"
              value="approved"
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid #0f172a",
                background: "#0f172a",
                color: "white",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Approve
            </button>

            <button
              name="status"
              value="denied"
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                background: "#fff",
                color: "#0f172a",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Reject
            </button>

            <button
              name="status"
              value="pending"
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid #e2e8f0",
                background: "#fff",
                color: "#0f172a",
                fontWeight: 700,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Reset to pending
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
