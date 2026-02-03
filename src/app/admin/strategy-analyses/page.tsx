import PendingWatcher from "./PendingWatcher";
import { createClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function StrategyAnalysisAdminPage({
  searchParams
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  noStore();

  const sp = await searchParams;
  const status = sp?.status === "sent" ? "sent" : "pending";

  const { data } = await supabase
    .from("strategy_analyses")
    .select("id, email, firm, phase, status, created_at")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .throwOnError();

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>
        Strategy Analysis Queue
      </h1>
      
      <PendingWatcher />

      <div style={{ marginTop: 12, display: "flex", gap: 12 }}>
        <a
          href="/admin/strategy-analyses"
          style={{
            textDecoration: "underline",
            fontWeight: status === "pending" ? 700 : 400
          }}
        >
          Pending
        </a>
        <a
          href="/admin/strategy-analyses?status=sent"
          style={{
            textDecoration: "underline",
            fontWeight: status === "sent" ? 700 : 400
          }}
        >
          Sent
        </a>
      </div>

      <table
        style={{
          width: "100%",
          marginTop: 16,
          borderCollapse: "collapse",
          fontSize: 14
        }}
      >
        <thead>
          <tr>
            <th
              style={{ padding: 8, borderBottom: "1px solid #ddd" }}
              align="left"
            >
              Email
            </th>
            <th
              style={{ padding: 8, borderBottom: "1px solid #ddd" }}
              align="left"
            >
              Firm
            </th>
            <th
              style={{ padding: 8, borderBottom: "1px solid #ddd" }}
              align="left"
            >
              Phase
            </th>
            <th
              style={{ padding: 8, borderBottom: "1px solid #ddd" }}
              align="left"
            >
              Status
            </th>
            <th
              style={{ padding: 8, borderBottom: "1px solid #ddd" }}
              align="left"
            >
              Submitted
            </th>
          </tr>
        </thead>

        <tbody>
          {data?.map((row) => (
            <tr key={row.id}>
              <td
                style={{
                  padding: 8,
                  borderBottom: "1px solid #f0f0f0",
                  fontWeight: 600
                }}
              >
                <a
                  href={`/admin/strategy-analyses/${row.id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block"
                  }}
                >
                  {row.email}
                </a>
              </td>

              <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                <a
                  href={`/admin/strategy-analyses/${row.id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block"
                  }}
                >
                  {row.firm}
                </a>
              </td>

              <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                <a
                  href={`/admin/strategy-analyses/${row.id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block"
                  }}
                >
                  {row.phase}
                </a>
              </td>

              <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                <a
                  href={`/admin/strategy-analyses/${row.id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block"
                  }}
                >
                  {row.status}
                </a>
              </td>

              <td style={{ padding: 8, borderBottom: "1px solid #f0f0f0" }}>
                <a
                  href={`/admin/strategy-analyses/${row.id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block"
                  }}
                >
                  {new Date(row.created_at).toLocaleString()}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`
        tr:hover td {
          background: #fafafa;
        }
      `}</style>
    </main>
  );
}
