// src/app/rules/[slug]/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

type RuleContent = {
  title: string;
  slug: string;
  category?: string;

  definition: string[];
  mechanics: string[];
  why: string[];
  misbeliefs: string[];
  hurt: string[];
  phaseInteraction: string[];
  adaptationLocked: string[];
  references: string[];
};

type Tier = "public" | "free" | "pro";

function normalizeTier(raw: string | null | undefined): Tier {
  const t = (raw || "").trim().toLowerCase();
  if (t === "pro") return "pro";
  if (t === "free") return "free";
  return "public";
}

function titleCase(s: string) {
  return (s || "")
    .split("-")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function Chip({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "warn" | "success";
}) {
  const cls =
    tone === "warn"
      ? "bg-amber-50 text-amber-800 ring-amber-200"
      : tone === "success"
      ? "bg-emerald-50 text-emerald-800 ring-emerald-200"
      : "bg-slate-50 text-slate-700 ring-slate-200";
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${cls}`}
    >
      {children}
    </span>
  );
}

function BulletCards({ items }: { items: string[] }) {
  if (!items?.length) return <div className="text-sm text-slate-500">—</div>;

  return (
    <ul className="space-y-2">
      {items.map((t, i) => (
        <li
          key={`${i}-${t}`}
          className="flex gap-3 rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-[0_10px_25px_rgba(2,6,23,0.05)] backdrop-blur"
        >
          <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
            {i + 1}
          </span>
          <p className="text-sm leading-6 text-slate-800">{t}</p>
        </li>
      ))}
    </ul>
  );
}

function LockedBlock({
  title,
  subtitle,
  ctaLabel,
}: {
  title: string;
  subtitle: string;
  ctaLabel: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/70 p-5 shadow-[0_10px_25px_rgba(2,6,23,0.05)] backdrop-blur">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm text-slate-600">{subtitle}</div>

      <div className="relative mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="select-none blur-sm">
          <div className="h-3 w-4/5 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-3/5 rounded bg-slate-200" />
          <div className="mt-2 h-3 w-2/3 rounded bg-slate-200" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-center shadow-[0_10px_25px_rgba(2,6,23,0.08)]">
            <Link
              href="/pricing"
              className="text-sm font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500"
            >
              {ctaLabel}
            </Link>
            <div className="mt-1 text-xs text-slate-600">
              Auth isn’t wired yet — pricing is the current unlock path.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RuleDetailPage() {
  const params = useParams<{ slug: string }>();
  const sp = useSearchParams();

  const slug = (params?.slug || "").trim().toLowerCase();
  const firm = (sp.get("firm") || "").trim().toLowerCase();
  const phase = (sp.get("phase") || "").trim().toLowerCase();
  const tier = normalizeTier(sp.get("tier"));

  const [data, setData] = useState<RuleContent | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = useMemo(() => {
    const qs = new URLSearchParams();
    qs.set("slug", slug);
    if (firm) qs.set("firm", firm);
    if (phase) qs.set("phase", phase);
    return `/api/rule?${qs.toString()}`;
  }, [slug, firm, phase]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setErr(null);

        if (!slug) throw new Error("Missing slug");

        const res = await fetch(apiUrl, { cache: "no-store" });
        if (!res.ok) {
          const j = await res.json().catch(() => null);
          throw new Error(j?.error || `Failed to load rule (${res.status})`);
        }

        const j = (await res.json()) as RuleContent;
        if (!cancelled) setData(j);
      } catch (e: any) {
        if (!cancelled) setErr(e?.message || "Failed to load rule");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [apiUrl, slug]);

  const canSeePhaseInteraction = tier === "free" || tier === "pro";
  const canSeeAdaptation = tier === "pro";

  const sourceLabel = phase
    ? "Firm + Phase override"
    : firm
    ? "Firm override"
    : "Canonical rule";

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* TOP BAR */}
      <div className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {firm ? (
                <Link
                  href={`/firms/${firm}/phases`}
                  className="rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  ← Back to {titleCase(firm)}
                </Link>
              ) : (
                <Link
                  href={`/rules`}
                  className="rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                >
                  ← Rules
                </Link>
              )}

              <Chip>Rule</Chip>
              {data?.category && <Chip>{data.category}</Chip>}
              {firm && <Chip tone="warn">{titleCase(firm)}</Chip>}
              {phase && <Chip>{titleCase(phase)}</Chip>}
              <Chip tone={tier === "pro" ? "success" : "neutral"}>
                Tier: {tier}
              </Chip>
            </div>

            <Link
              href="/pricing"
              className="rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_10px_25px_rgba(2,6,23,0.25)] hover:opacity-95"
            >
              See pricing
            </Link>
          </div>

          <div className="mt-3">
            <div className="text-lg font-semibold text-slate-950">
              {data?.title ?? "Loading rule…"}
            </div>
            <div className="mt-1 text-sm text-slate-600">
              Canonical definition → mechanics → why it exists → how traders get
              clipped → phase-aware framing → operating doctrine.
            </div>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="mx-auto max-w-5xl px-4 py-8">
        {loading && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700">
            Loading rule…
          </div>
        )}

        {!loading && (err || !data) && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-900">
            {err || "Could not load rule."}
          </div>
        )}

        {!loading && data && (
          <div className="space-y-6">
            <Section title="Definition" items={data.definition} />
            <Section title="Mechanics & math" items={data.mechanics} />
            <Section title="Why firms use it" items={data.why} />
            <Section title="Common trader misbeliefs" items={data.misbeliefs} />
            <Section title="How traders get hurt" items={data.hurt} />

            <GateSection
              title="Phase interaction"
              unlocked={canSeePhaseInteraction}
              items={data.phaseInteraction}
              locked={
                <LockedBlock
                  title="Phase interaction is gated in v0"
                  subtitle="This explains how the same rule changes meaning across phases."
                  ctaLabel="Unlock phase context (see pricing)"
                />
              }
            />

            <GateSection
              title="How to trade against it"
              unlocked={canSeeAdaptation}
              items={data.adaptationLocked}
              locked={
                <LockedBlock
                  title="Operational doctrine is gated"
                  subtitle="Phase-aware behavior, sizing, and when-not-to-trade guidance."
                  ctaLabel="Unlock doctrine (see pricing)"
                />
              }
            />

            <Section title="References" items={data.references} />

            {/* DEBUG SOURCE INDICATOR */}
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-xs text-slate-600">
              <div className="font-semibold text-slate-800">
                Source debug (v0)
              </div>
              <div className="mt-1 grid grid-cols-2 gap-x-6 gap-y-1">
                <div>Rule slug:</div>
                <div className="font-mono">{slug}</div>

                <div>Firm:</div>
                <div className="font-mono">{firm || "—"}</div>

                <div>Phase:</div>
                <div className="font-mono">{phase || "—"}</div>

                <div>Tier:</div>
                <div className="font-mono">{tier}</div>

                <div>Content source:</div>
                <div className="font-semibold">{sourceLabel}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* small helpers */

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/70 p-6">
      <div className="text-xl font-semibold text-slate-950">{title}</div>
      <div className="mt-4">
        <BulletCards items={items} />
      </div>
    </div>
  );
}

function GateSection({
  title,
  unlocked,
  items,
  locked,
}: {
  title: string;
  unlocked: boolean;
  items: string[];
  locked: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/70 p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xl font-semibold text-slate-950">{title}</div>
        <Chip tone={unlocked ? "success" : "warn"}>
          {unlocked ? "Unlocked" : "Locked"}
        </Chip>
      </div>
      <div className="mt-4">{unlocked ? <BulletCards items={items} /> : locked}</div>
    </div>
  );
}
