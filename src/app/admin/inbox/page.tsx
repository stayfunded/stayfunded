// src/app/admin/inbox/page.tsx
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const supabase = createClient(
  (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type InboxTab = "strategy" | "discord";
type StrategyStatus = "pending" | "sent";

// URL param uses "rejected" for human language; DB enum uses "denied".
type DiscordStatusParam = "pending" | "approved" | "rejected";
type DiscordStatusDb = "pending" | "approved" | "denied";

function getParam(sp: any, key: string): string | undefined {
  if (!sp) return undefined;
  const v = sp[key];
  if (typeof v === "string") return v;
  return undefined;
}

function pillStyle(active: boolean) {
  return { textDecoration: "underline", fontWeight: active ? 700 : 400, cursor: "pointer" } as const;
}

function tableCellLinkStyle() {
  return { textDecoration: "none", color: "inherit", display: "block" } as const;
}

function fmtDate(dt: string) {
  try {
    return new Date(dt).toLocaleString();
  } catch {
    return dt;
  }
}

function discordParamToDb(s: DiscordStatusParam): DiscordStatusDb {
  if (s === "rejected") return "denied";
  return s;
}

export default async function AdminInboxPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string>>;
}) {
  noStore();
  const sp = await searchParams;

  const tab = (getParam(sp, "tab") as InboxTab) || "strategy";
  const strategyStatus = (getParam(sp, "strategyStatus") as StrategyStatus) || "pending";

  const discordStatusParam = (getParam(sp, "discordStatus") as DiscordStatusParam) || "pending";
  const discordStatusDb = discordParamToDb(discordStatusParam);

  // Strategy queue
  const { data: strategyRows } = await supabase
    .from("strategy_analyses")
    .select("id, email, firm, phase, status, created_at")
    .eq("status", strategyStatus)
    .order("created_at", { ascending: false })
    .throwOnError();

  const { count: strategyPendingCount } = await supabase
    .from("strategy_analyses")
    .select("id", { count: "exact" })
    .eq("status", "pending")
    .throwOnError();

  const { count: strategySentCount } = await supabase
    .from("strategy_analyses")
    .select("id", { count: "exact" })
    .eq("status", "sent")
    .throwOnError();

  // Discord queue (SSoT)
  const { data: discordRows } = await supabase
    .from("discord_memberships")
    .select(
      "id, user_id, email, discord_handle, firm_slug, phase, status, requested_at, reviewed_at, review_note, account_id, group_id"
    )
    .eq("status", discordStatusDb)
    .order("requested_at", { ascending: false })
    .throwOnError();

  const { count: discordPendingCount } = await supabase
    .from("discord_memberships")
    .select("id", { count: "exact" })
    .eq("status", "pending")
    .throwOnError();

  const { count: discordApprovedCount } = await supabase
    .from("discord_memberships")
    .select("id", { count: "exact" })
    .eq("status", "approved")
    .throwOnError();

  const { count: discordDeniedCount } = await supabase
    .from("discord_memberships")
    .select("id", { count: "exact" })
    .eq("status", "denied")
    .throwOnError();

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Admin Inbox</h1>

      <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
        <a
          href={`/admin/inbox?tab=strategy&strategyStatus=${strategyStatus}`}
          style={pillStyle(tab === "strategy")}
        >
          Strategy ({(strategyPendingCount ?? 0) + (strategySentCount ?? 0)})
        </a>

        <a
          href={`/admin/inbox?tab=discord&discordStatus=${discordStatusParam}`}
          style={pillStyle(tab === "discord")}
        >
          Discord ({(discordPendingCount ?? 0) + (discordApprovedCount ?? 0) + (discordDeniedCount ?? 0)})
        </a>
      </div>

      {tab === "strategy" ? (
        <section style={{ marginTop: 18 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Strategy Analyses</h2>
              <div style={{ marginTop: 6, fontSize: 13, color: "#475569" }}>Click a row to open the request.</div>
            </div>

            <div style={{ display: "flex", gap: 12, fontSize: 14 }}>
              <a
                href={`/admin/inbox?tab=strategy&strategyStatus=pending`}
                style={pillStyle(strategyStatus === "pending")}
              >
                Pending ({strategyPendingCount ?? 0})
              </a>
              <a
                href={`/admin/inbox?tab=strategy&strategyStatus=sent`}
                style={pillStyle(strategyStatus === "sent")}
              >
                Sent ({strategySentCount ?? 0})
              </a>
              <Link href="/admin/strategy-analyses" style={{ textDecoration: "underline" }}>
                Full view →
              </Link>
            </div>
          </div>

          <table style={{ width: "100%", marginTop: 14, borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }} align="left">
                  Email
                </th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }} align="left">
                  Firm
                </th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }} align="left">
                  Phase
                </th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }} align="left">
                  Status
                </th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }} align="left">
                  Submitted
                </th>
              </tr>
            </thead>

            <tbody>
              {strategyRows?.length ? (
                strategyRows.map((row: any) => (
                  <tr key={row.id}>
                    <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0", fontWeight: 600 }}>
                      <a href={`/admin/strategy-analyses/${row.id}`} style={tableCellLinkStyle()}>
                        {row.email}
                      </a>
                    </td>
                    <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                      <a href={`/admin/strategy-analyses/${row.id}`} style={tableCellLinkStyle()}>
                        {row.firm}
                      </a>
                    </td>
                    <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                      <a href={`/admin/strategy-analyses/${row.id}`} style={tableCellLinkStyle()}>
                        {row.phase}
                      </a>
                    </td>
                    <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                      <a href={`/admin/strategy-analyses/${row.id}`} style={tableCellLinkStyle()}>
                        {row.status}
                      </a>
                    </td>
                    <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                      <a href={`/admin/strategy-analyses/${row.id}`} style={tableCellLinkStyle()}>
                        {fmtDate(row.created_at)}
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ padding: 12, color: "#475569" }}>
                    No items in this queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <style>{`tr:hover td { background: #fafafa; }`}</style>
        </section>
      ) : null}

      {tab === "discord" ? (
        <section style={{ marginTop: 18 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Discord Access Requests</h2>
              <div style={{ marginTop: 6, fontSize: 13, color: "#475569" }}>
                Approve only after you manually assign the Discord role.
              </div>
            </div>

            <div style={{ display: "flex", gap: 12, fontSize: 14 }}>
              <a
                href={`/admin/inbox?tab=discord&discordStatus=pending`}
                style={pillStyle(discordStatusParam === "pending")}
              >
                Pending ({discordPendingCount ?? 0})
              </a>
              <a
                href={`/admin/inbox?tab=discord&discordStatus=approved`}
                style={pillStyle(discordStatusParam === "approved")}
              >
                Approved ({discordApprovedCount ?? 0})
              </a>
              <a
                href={`/admin/inbox?tab=discord&discordStatus=rejected`}
                style={pillStyle(discordStatusParam === "rejected")}
              >
                Rejected ({discordDeniedCount ?? 0})
              </a>
            </div>
          </div>

          <table style={{ width: "100%", marginTop: 14, borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }} align="left">
                  User
                </th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }} align="left">
                  Discord
                </th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }} align="left">
                  Firm
                </th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }} align="left">
                  Phase
                </th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }} align="left">
                  Status
                </th>
                <th style={{ padding: 8, borderBottom: "1px solid #ddd" }} align="left">
                  Requested
                </th>
              </tr>
            </thead>

            <tbody>
              {discordRows?.length ? (
                discordRows.map((row: any) => (
                  <tr key={row.id}>
                    <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0", fontWeight: 600 }}>
                      <a href={`/admin/discord-membership/${row.id}`} style={tableCellLinkStyle()}>
                        {row.email || row.user_id}
                      </a>
                    </td>
                    <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                      <a href={`/admin/discord-membership/${row.id}`} style={tableCellLinkStyle()}>
                        {row.discord_handle || "—"}
                      </a>
                    </td>
                    <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                      <a href={`/admin/discord-membership/${row.id}`} style={tableCellLinkStyle()}>
                        {row.firm_slug}
                      </a>
                    </td>
                    <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                      <a href={`/admin/discord-membership/${row.id}`} style={tableCellLinkStyle()}>
                        {row.phase}
                      </a>
                    </td>
                    <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                      <a href={`/admin/discord-membership/${row.id}`} style={tableCellLinkStyle()}>
                        {row.status}
                      </a>
                    </td>
                    <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                      <a href={`/admin/discord-membership/${row.id}`} style={tableCellLinkStyle()}>
                        {fmtDate(row.requested_at)}
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: 12, color: "#475569" }}>
                    No items in this queue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <style>{`tr:hover td { background: #fafafa; }`}</style>
        </section>
      ) : null}
    </main>
  );
}
