// src/app/news/page.tsx
"use client";

import type { Metadata } from "next";
import { useEffect, useMemo, useRef, useState } from "react";

type Impact = "High" | "Medium" | "Low";

type NewsItem = {
  id: string;
  title: string;
  link: string;
  source?: string;
  publishedAt: string; // ISO
  summary?: string;
  tags: string[];
  impact: Impact;
  impactScore: number; // 0..100
};

type ApiResponse = {
  items: NewsItem[];
  fetchedAt: string; // ISO
  sources: string[];
};

type SortKey = "time" | "impact" | "source" | "title";
type SortDir = "desc" | "asc";

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
  });
}

function uniq<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

function includesCI(hay: string, needle: string) {
  return hay.toLowerCase().includes(needle.toLowerCase());
}

function ImpactPill({ impact }: { impact: Impact }) {
  const cls =
    impact === "High"
      ? "border-rose-200 bg-rose-50 text-rose-800"
      : impact === "Medium"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}
    >
      {impact}
    </span>
  );
}

function TagPill({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700">
      {tag}
    </span>
  );
}

export default function NewsPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );
  const [data, setData] = useState<ApiResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  // filters
  const [q, setQ] = useState("");
  const [impact, setImpact] = useState<Impact | "All">("All");
  const [source, setSource] = useState<string>("All");
  const [tag, setTag] = useState<string>("All");
  const [ageHours, setAgeHours] = useState<number>(24);

  // sorting
  const [sortKey, setSortKey] = useState<SortKey>("time");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // refresh
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshSec, setRefreshSec] = useState(60);

  const timerRef = useRef<number | null>(null);

  async function load() {
    try {
      setStatus((s) => (s === "ready" ? "loading" : "loading"));
      setErr(null);

      const res = await fetch("/api/news", { cache: "no-store" });
      if (!res.ok) {
        const j = await res.json().catch(() => null);
        throw new Error(j?.error || `Failed to load news (${res.status})`);
      }

      const j = (await res.json()) as ApiResponse;
      setData(j);
      setStatus("ready");
    } catch (e: any) {
      setErr(e?.message || "Failed to load news");
      setStatus("error");
    }
  }

  useEffect(() => {
    // initial load
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // auto refresh
    if (!autoRefresh) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      return;
    }

    const sec = clamp(refreshSec, 15, 600);
    if (timerRef.current) window.clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      load();
    }, sec * 1000);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, refreshSec]);

  const allSources = useMemo(() => {
    const items = data?.items ?? [];
    return ["All", ...uniq(items.map((x) => x.source || "Unknown"))].sort(
      (a, b) => {
        if (a === "All") return -1;
        if (b === "All") return 1;
        return a.localeCompare(b);
      }
    );
  }, [data]);

  const allTags = useMemo(() => {
    const items = data?.items ?? [];
    const tags = uniq(items.flatMap((x) => x.tags)).sort((a, b) =>
      a.localeCompare(b)
    );
    return ["All", ...tags];
  }, [data]);

  const filtered = useMemo(() => {
    const items = data?.items ?? [];
    const now = Date.now();
    const maxAgeMs = ageHours * 60 * 60 * 1000;

    return items.filter((it) => {
      // age
      const t = new Date(it.publishedAt).getTime();
      if (Number.isFinite(t) && maxAgeMs > 0) {
        if (now - t > maxAgeMs) return false;
      }

      // query
      if (q.trim()) {
        const hay = `${it.title} ${it.source ?? ""} ${it.summary ?? ""} ${it.tags.join(
          " "
        )}`;
        if (!includesCI(hay, q.trim())) return false;
      }

      // impact
      if (impact !== "All" && it.impact !== impact) return false;

      // source
      if (source !== "All") {
        const s = it.source || "Unknown";
        if (s !== source) return false;
      }

      // tag
      if (tag !== "All") {
        if (!it.tags.includes(tag)) return false;
      }

      return true;
    });
  }, [data, q, impact, source, tag, ageHours]);

  const sorted = useMemo(() => {
    const items = [...filtered];

    const dir = sortDir === "asc" ? 1 : -1;

    items.sort((a, b) => {
      if (sortKey === "time") {
        const at = new Date(a.publishedAt).getTime();
        const bt = new Date(b.publishedAt).getTime();
        const av = Number.isFinite(at) ? at : 0;
        const bv = Number.isFinite(bt) ? bt : 0;
        return (av - bv) * dir;
      }

      if (sortKey === "impact") {
        return (a.impactScore - b.impactScore) * dir;
      }

      if (sortKey === "source") {
        return ((a.source || "Unknown").localeCompare(b.source || "Unknown") ||
          a.title.localeCompare(b.title)) * dir;
      }

      // title
      return a.title.localeCompare(b.title) * dir;
    });

    return items;
  }, [filtered, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("desc");
      return;
    }
    setSortDir((d) => (d === "desc" ? "asc" : "desc"));
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
              High-impact trading news (test)
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600">
              Real-time stream built from public RSS sources. Impact is a
              heuristic label (keyword-based), not a claim.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={load}
              className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
            >
              Refresh
            </button>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <div className="text-xs font-semibold text-slate-600">
                Auto-refresh
              </div>
              <button
                type="button"
                onClick={() => setAutoRefresh((v) => !v)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors ${
                  autoRefresh
                    ? "border-slate-300 bg-slate-950"
                    : "border-slate-300 bg-white"
                }`}
                aria-pressed={autoRefresh}
                aria-label="Toggle auto-refresh"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    autoRefresh ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>

              <div className="ml-1 flex items-center gap-2">
                <span className="text-xs text-slate-500">every</span>
                <input
                  value={String(refreshSec)}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (!Number.isFinite(n)) return;
                    setRefreshSec(clamp(n, 15, 600));
                  }}
                  className="w-16 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-slate-200"
                  inputMode="numeric"
                />
                <span className="text-xs text-slate-500">sec</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 grid gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="text-xs font-semibold text-slate-600">Search</div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Rates, CPI, FOMC, crude, earnings, NFP…"
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200"
            />
          </div>

          <div className="md:col-span-2">
            <div className="text-xs font-semibold text-slate-600">Impact</div>
            <select
              value={impact}
              onChange={(e) => setImpact(e.target.value as any)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="All">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs font-semibold text-slate-600">Source</div>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200"
            >
              {allSources.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs font-semibold text-slate-600">Tag</div>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200"
            >
              {allTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1">
            <div className="text-xs font-semibold text-slate-600">Age</div>
            <select
              value={String(ageHours)}
              onChange={(e) => setAgeHours(Number(e.target.value))}
              className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-slate-200"
            >
              <option value="6">6h</option>
              <option value="12">12h</option>
              <option value="24">24h</option>
              <option value="48">48h</option>
              <option value="168">7d</option>
            </select>
          </div>
        </div>

        {/* Status */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-600">
          <div>
            {status === "loading" && <span>Loading…</span>}
            {status === "error" && (
              <span className="text-rose-700">Error: {err}</span>
            )}
            {status === "ready" && data && (
              <span>
                Showing <span className="font-semibold">{sorted.length}</span>{" "}
                items · last fetched{" "}
                <span className="font-semibold">
                  {formatTime(data.fetchedAt)}
                </span>
              </span>
            )}
          </div>

          <div className="text-xs text-slate-500">
            Sort:{" "}
            <span className="font-semibold">
              {sortKey} ({sortDir})
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white">
          <div className="grid grid-cols-12 gap-3 bg-slate-50 px-5 py-3 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={() => toggleSort("time")}
              className="col-span-2 text-left hover:text-slate-900"
              title="Sort by time"
            >
              Time
            </button>
            <button
              type="button"
              onClick={() => toggleSort("impact")}
              className="col-span-2 text-left hover:text-slate-900"
              title="Sort by impact"
            >
              Impact
            </button>
            <button
              type="button"
              onClick={() => toggleSort("source")}
              className="col-span-2 text-left hover:text-slate-900"
              title="Sort by source"
            >
              Source
            </button>
            <button
              type="button"
              onClick={() => toggleSort("title")}
              className="col-span-6 text-left hover:text-slate-900"
              title="Sort by title"
            >
              Headline
            </button>
          </div>

          <div className="divide-y divide-slate-200">
            {sorted.map((it) => (
              <div key={it.id} className="grid grid-cols-12 gap-3 px-5 py-4">
                <div className="col-span-2 text-xs text-slate-600">
                  {formatTime(it.publishedAt)}
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <ImpactPill impact={it.impact} />
                  <span className="text-xs font-semibold text-slate-500">
                    {it.impactScore}
                  </span>
                </div>

                <div className="col-span-2 text-xs text-slate-700">
                  {it.source || "Unknown"}
                </div>

                <div className="col-span-6">
                  <a
                    href={it.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-slate-950 hover:underline"
                    title={it.title}
                  >
                    {it.title}
                  </a>

                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {it.tags.slice(0, 6).map((t) => (
                      <TagPill key={`${it.id}-${t}`} tag={t} />
                    ))}
                  </div>

                  {it.summary ? (
                    <div className="mt-2 text-xs text-slate-600">
                      {it.summary}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

            {status === "ready" && sorted.length === 0 ? (
              <div className="px-5 py-10 text-sm text-slate-600">
                No items match your filters.
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-6 text-xs text-slate-500">
          This is a standalone test page. It does not affect product plans.
        </div>
      </div>
    </main>
  );
}
