import { createClient } from "@supabase/supabase-js";
import Editor from "./editor";

export const dynamic = "force-dynamic";

const supabase = createClient(
  (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL)!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getSignedScreenshotUrls(paths: string[]): Promise<string[]> {
  if (!paths.length) return [];
  const urls: string[] = [];

  for (const path of paths) {
    const { data, error } = await supabase.storage
      .from("strategy-analyses")
      .createSignedUrl(path, 60 * 60); // 1 hour

    if (!error && data?.signedUrl) {
      urls.push(data.signedUrl);
    } else {
      urls.push(`(failed to sign) ${path}`);
    }
  }

  return urls;
}

export default async function StrategyAnalysisDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("strategy_analyses")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return <pre style={{ padding: 24 }}>Error loading analysis</pre>;
  }

  const screenshotPaths: string[] = Array.isArray(data.screenshot_paths)
    ? data.screenshot_paths
    : [];

  const signedUrls = await getSignedScreenshotUrls(screenshotPaths);

  return (
    <main style={{ padding: 24, maxWidth: 980 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
        Strategy Analysis
      </h1>

      <div style={{ lineHeight: 1.6 }}>
        <div>
          <strong>Email:</strong> {data.email}
        </div>
        <div>
          <strong>Firm:</strong> {data.firm}
        </div>
        <div>
          <strong>Phase:</strong> {data.phase}
        </div>
        <div>
          <strong>Status:</strong> {data.status}
        </div>
        <div>
          <strong>Submitted:</strong> {new Date(data.created_at).toLocaleString()}
        </div>
      </div>

      <hr style={{ margin: "24px 0" }} />

      <h2>Intake</h2>
      <pre
        style={{
          background: "#f7f7f7",
          padding: 16,
          borderRadius: 8,
          whiteSpace: "pre-wrap"
        }}
      >
        {JSON.stringify(data.intake_json, null, 2)}
      </pre>

      <hr style={{ margin: "24px 0" }} />

      <h2>Screenshots</h2>
      {screenshotPaths.length === 0 ? (
        <div style={{ color: "#666" }}>None uploaded.</div>
      ) : (
        <ul style={{ paddingLeft: 18 }}>
          {screenshotPaths.map((path: string) => (
            <li key={path} style={{ marginBottom: 6 }}>
              <a
                href={`/api/admin/strategy-analysis-screenshot?path=${encodeURIComponent(
                  path
                )}`}
                target="_blank"
                rel="noreferrer"
              >
                {path}
              </a>
            </li>
          ))}
        </ul>
      )}

      <hr style={{ margin: "24px 0" }} />

      <h2>Final Analysis</h2>

      <Editor
        id={id}
        initialText={data.analysis_text || ""}
        email={data.email}
        firm={data.firm}
        phase={data.phase}
        intakeJson={data.intake_json}
        screenshotUrls={signedUrls}
      />
    </main>
  );
}
