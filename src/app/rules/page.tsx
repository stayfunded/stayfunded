"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type RuleIndexItem = {
  title: string;
  slug: string;
  category?: string;
};

function titleCase(s: string) {
  return s
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function Chip({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "warn";
}) {
  const cls =
    tone === "warn"
      ? "bg-amber-50 text-amber-800 ring-amber-200"
      : "bg-slate-50 text-slate-700 ring-slate-200";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${cls}`}
    >
      {children}
    </span>
  );
}

function buildRuleHref(slug: string, firm?: string | null, phase?: string | null) {
  const base = `/rules/${slug}`;
  const params = new URLSearchParams();
  if (firm) params.set("firm", firm);
  if (phase) params.set("phase", phase);
  // keep your existing tier behavior (safe default)
  params.set("tier", "public");
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export default function RulesIndexPage() {
  const sp = useSearchParams();

  const firm = (sp.get("firm") || "").trim().toLowerCase() || null;
  const phase = (sp.get("phase") || "").trim().toLowerCase() || null;

  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );
  const [items, setItems] = useState<RuleIndexItem[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setStatus("loading");
        const res = await fetch("/api/rules", { cache: "no-store" });
        if (!res.ok) {
          if (!cancelled) setStatus("error");
          return;
        }
        const json = (await res.json()) as { items: RuleIndexItem[] };
        if (!cancelled) {
          setItems(json.items ?? []);
          setStatus("ready");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((x) => {
      const hay = `${x.title} ${x.slug} ${x.category ?? ""}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [items, q]);

  const grouped = useMemo(() => {
    const map = new Map<string, RuleIndexItem[]>();
    for (const it of filtered) {
      const key = (it.category ?? "Uncategorized").trim();
      map.set(key, [...(map.get(key) ?? []), it]);
    }
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Top bar (match playbook tone) */}
      <div className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Chip>Rules</Chip>
              {firm && <Chip>{titleCase(firm)}</Chip>}
              {phase && <Chip tone="warn">{titleCase(phase)}</Chip>}
              <Chip>Dictionary</Chip>
            </div>

            <div className="w-full max-w-sm">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search rules…"
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 shadow-[0_10px_25px_rgba(2,6,23,0.05)] outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-2xl font-semibold text-slate-950">Rules</div>
            <div className="mt-1 text-sm text-slate-600">
              Canonical rule dictionary. Click a rule to open the detailed breakdown.
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {status === "loading" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-[0_10px_25px_rgba(2,6,23,0.05)]">
            Loading rules…
          </div>
        )}

        {status === "error" && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-900 shadow-[0_10px_25px_rgba(2,6,23,0.05)]">
            <div className="font-semibold">Rules failed to load.</div>
            <div className="mt-2 text-rose-900/80">
              Confirm <span className="font-semibold">/api/rules</span> exists and that your rule
              markdown lives under <span className="font-semibold">docs/rules/types/</span>.
            </div>
          </div>
        )}

        {status === "ready" && (
          <div className="space-y-8">
            {grouped.map(([category, rows]) => (
              <div key={category}>
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {category.replace(/-/g, " ")}
                  </div>
                  <div className="text-xs text-slate-500">{rows.length}</div>
                </div>

                <div className="space-y-2">
                  {rows.map((r, idx) => (
                    <Link
                      key={r.slug}
                      href={buildRuleHref(r.slug, firm, phase)}
                      className="group block"
                    >
                      <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-[0_10px_25px_rgba(2,6,23,0.05)] backdrop-blur transition hover:bg-white">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
                            {idx + 1}
                          </span>
                          <div className="text-sm font-semibold text-slate-900">
                            {r.title}
                          </div>
                        </div>

                        <div className="text-xs text-slate-500 group-hover:text-slate-700">
                          /rules/{r.slug}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-[0_10px_25px_rgba(2,6,23,0.05)]">
                No rules match your search.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
