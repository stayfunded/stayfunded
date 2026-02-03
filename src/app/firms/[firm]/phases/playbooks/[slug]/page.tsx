// src/app/firms/[firm]/phases/playbooks/[slug]/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import { type FirmPhase } from "@/lib/accountsDb";
import { getDiscordRoom } from "@/lib/discordRooms";

/**
 * API shape:
 * { title: string, sections: { designed, firmEdge, damagingRules, traderFailure, survivors, learning, misdirection, exit } }
 */
type PlaybookSectionKey =
  | "designed"
  | "firmEdge"
  | "damagingRules"
  | "traderFailure"
  | "survivors"
  | "learning"
  | "misdirection"
  | "exit";

type PlaybookContent = {
  title: string;
  sections: Record<PlaybookSectionKey, string[]>;
};

type TabSpec = {
  key: PlaybookSectionKey;
  label: string;
  title: string;
  hint?: string;
};

const TABS: TabSpec[] = [
  {
    key: "designed",
    label: "What this phase is",
    title: "What This Phase Is For",
    hint: "Plain-language purpose. What the firm is testing, and what “passing” really means here.",
  },
  {
    key: "firmEdge",
    label: "Rules that matter",
    title: "Rules That Actually Matter in This Phase",
    hint: "The rule mechanics that shape everything. This is where most traders misunderstand the game.",
  },
  {
    key: "damagingRules",
    label: "Kill rules",
    title: "The Rules That End Most Accounts",
    hint: "The small set of rules that do the real damage in this phase.",
  },
  {
    key: "traderFailure",
    label: "How accounts get blown",
    title: "How Traders Blow This Phase",
    hint: "The most common ways competent traders fail here (usually without realizing it until it’s too late).",
  },
  {
    key: "survivors",
    label: "How to trade this phase",
    title: "How Professionals Trade This Phase",
    hint: "How pros structure behavior to survive the rules (no signals, no setups).",
  },
  {
    key: "learning",
    label: "Get sharper",
    title: "How to Get Better at Executing This",
    hint: "What to practice and what to study so you stop making the predictable mistakes.",
  },
  {
    key: "misdirection",
    label: "What to ignore",
    title: "What to Ignore in This Phase",
    hint: "Stuff that feels useful but usually makes you fail faster.",
  },
  {
    key: "exit",
    label: "What changes next",
    title: "How This Phase Ends — and What Changes After",
    hint: "Exit conditions and what must change immediately when you move forward.",
  },
];

function isFirmPhase(x: string): x is FirmPhase {
  return (
    x === "discovery" ||
    x === "evaluation" ||
    x === "stabilization" ||
    x === "payout" ||
    x === "maintenance"
  );
}

type ExtraKey = "premarket" | "social";
type ActiveSectionKey = PlaybookSectionKey | ExtraKey;

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

function normalizeHref(href: string, firmSlug: string, phase: FirmPhase): string {
  if (!href.startsWith("/rules/")) return href;

  try {
    const u = new URL(href, "http://local");
    u.searchParams.set("firm", firmSlug);
    u.searchParams.set("phase", String(phase));
    const qs = u.searchParams.toString();
    return `${u.pathname}${qs ? `?${qs}` : ""}${u.hash ?? ""}`;
  } catch {
    const join = href.includes("?") ? "&" : "?";
    return `${href}${join}firm=${encodeURIComponent(
      firmSlug
    )}&phase=${encodeURIComponent(String(phase))}`;
  }
}

function renderMaybeLink(text: string, firmSlug: string, phase: FirmPhase) {
  const m = text.match(/\[([^\]]+)\]\(([^)]+)\)/);
  if (!m) return <span>{text}</span>;

  const full = m[0];
  const label = m[1];
  const rawHref = m[2];

  const idx = text.indexOf(full);
  const before = idx >= 0 ? text.slice(0, idx) : "";
  const after = idx >= 0 ? text.slice(idx + full.length) : "";

  const isInternal = rawHref.startsWith("/");
  const cls =
    "font-semibold underline decoration-slate-300 underline-offset-4 hover:decoration-slate-500";

  if (isInternal) {
    const href = normalizeHref(rawHref, firmSlug, phase);
    return (
      <span>
        {before}
        <Link href={href} className={cls}>
          {label}
        </Link>
        {after}
      </span>
    );
  }

  return (
    <span>
      {before}
      <a href={rawHref} target="_blank" rel="noreferrer" className={cls}>
        {label}
      </a>
      {after}
    </span>
  );
}

function BulletList({
  items,
  firmSlug,
  phase,
}: {
  items: string[];
  firmSlug: string;
  phase: FirmPhase;
}) {
  if (!items?.length) return null;
  return (
    <ul className="space-y-2">
      {items.map((t, i) => (
        <li
          key={i}
          className="flex gap-3 rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-[0_10px_25px_rgba(2,6,23,0.05)] backdrop-blur"
        >
          <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-bold text-white">
            {i + 1}
          </span>
          <p className="text-sm leading-6 text-slate-800">
            {renderMaybeLink(t, firmSlug, phase)}
          </p>
        </li>
      ))}
    </ul>
  );
}

function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute left-1/2 top-1/2 w-[92vw] max-w-2xl -translate-x-1/2 -translate-y-1/2">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_40px_120px_rgba(2,6,23,0.35)]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
            <div className="text-sm font-semibold text-slate-900">{title}</div>
            <button
              onClick={onClose}
              className="rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
          <div className="px-6 py-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

function titleCase(s: string) {
  return (s || "")
    .split("-")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function firstPhaseFromSlug(slug: string): FirmPhase | null {
  const head = (slug || "").trim().toLowerCase().split("-")[0];
  return isFirmPhase(head) ? (head as FirmPhase) : null;
}

type ChecklistItem = { main: string; sub?: string };
function getPreMarketChecklist(firmSlug: string, phase: FirmPhase): ChecklistItem[] {
  if (firmSlug === "topstep" && phase === "evaluation") {
    return [
      { main: "Check StayFunded bias indicator", sub: "If it’s choppy → no-trade day (stand down)." },
      { main: "Check high-impact news", sub: "If there’s major news near your session → reduce risk or skip." },
      { main: "Confirm today’s market condition", sub: "If it’s choppy AND bias isn’t clean → skip. Don’t force it." },
      { main: "Confirm trailing drawdown mechanics for this account", sub: "Unrealized matters. Know exactly what moves it." },
      { main: "Know your drawdown buffer BEFORE the first trade", sub: "If buffer is small → trade minimum size or don’t trade." },
      { main: "Set your personal daily stop", sub: "Stop earlier than the firm stop. Protect the account." },
      { main: "Trade minimum size until buffer expands", sub: "Early aggression is how most evals die." },
      { main: "Pick your one setup category for the day", sub: "No switching and no improvising mid-session." },
      { main: "Hard rule: no revenge trades", sub: "If you feel urgency to “make it back” → you stop." },
      { main: "Hard rule: stop trading after emotional deviation", sub: "One tilt moment is enough. Close the platform." },
    ];
  }

  return [
    { main: "Check StayFunded bias indicator", sub: "If choppy → consider no-trade day." },
    { main: "Check high-impact news", sub: "If news near your session → reduce risk or skip." },
    { main: "Confirm the phase’s top kill rules", sub: "Know what ends accounts here." },
    { main: "Decide if today is a trade day", sub: "If conditions don’t fit → skip." },
  ];
}

function ChecklistList({ items }: { items: ChecklistItem[] }) {
  return (
    <div className="space-y-2">
      {items.map((it, idx) => (
        <div
          key={idx}
          className="flex items-start gap-3 rounded-2xl border border-slate-200/70 bg-white/70 p-4 shadow-[0_10px_25px_rgba(2,6,23,0.05)] backdrop-blur"
        >
          <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-500">
            <span className="text-xs">☐</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">
              {idx + 1}. {it.main}
            </div>
            {it.sub ? <div className="mt-1 text-sm text-slate-600">{it.sub}</div> : null}
          </div>
        </div>
      ))}
      <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        Reference checklist only. We are not tracking your day.
      </div>
    </div>
  );
}

function SocialPanel({ firmSlug, phase }: { firmSlug: string; phase: FirmPhase }) {
  const room = useMemo(() => getDiscordRoom(firmSlug, String(phase)), [firmSlug, phase]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white/70 p-5">
        <div className="text-sm font-semibold text-slate-950">{room.title}</div>
        <div className="mt-1 text-sm text-slate-600">
          {room.description ??
            "Firm + phase room. Read-mostly. This is for rules and phase execution — not trade calls."}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {room.mode === "open" && room.url ? (
            <a
              href={room.url}
              target="_blank"
              rel="noreferrer"
              className="rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_10px_25px_rgba(2,6,23,0.25)] hover:opacity-95"
            >
              Open Discord room
            </a>
          ) : room.mode === "request" ? (
            <button
              onClick={() => alert("TODO: request access flow (proof email + questions)")}
              className="rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_10px_25px_rgba(2,6,23,0.25)] hover:opacity-95"
            >
              Request access
            </button>
          ) : (
            <button
              disabled
              className="cursor-not-allowed rounded-xl bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600"
              title="Discord not connected yet"
            >
              Discord coming soon
            </button>
          )}

          <button
            onClick={() =>
              alert(
                "Rooms are firm + phase. Evaluation rooms will be open. Advanced phase rooms will require a request (proof + a few questions)."
              )
            }
            className="rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            How access works
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/70 p-5">
        <div className="text-sm font-semibold text-slate-950">Accountability pairing (optional)</div>
        <div className="mt-1 text-sm text-slate-600">
          Optional pairing with someone in the same firm + phase. We’ll start manual. No automation yet.
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            disabled
            className="cursor-not-allowed rounded-xl bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600"
            title="Pairing not enabled yet"
          >
            Pairing coming soon
          </button>
          <button
            onClick={() =>
              alert(
                "Pairing will be opt-in and firm + phase scoped. We’ll add a simple request form when ready."
              )
            }
            className="rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
          >
            Pairing rules
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PlaybookPage() {
  const params = useParams();

  const firmParam = useMemo(() => {
    const v = (params as any)?.firm;
    return (Array.isArray(v) ? v[0] : v ? String(v) : "topstep").trim().toLowerCase();
  }, [params]);

  const slugParam = useMemo(() => {
    const v = (params as any)?.slug;
    return (Array.isArray(v) ? v[0] : v ? String(v) : "evaluation").trim().toLowerCase();
  }, [params]);

  const [contentStatus, setContentStatus] = useState<"idle" | "loading" | "ready" | "error">(
    "idle"
  );
  const [content, setContent] = useState<PlaybookContent | null>(null);

  const [activeKey, setActiveKey] = useState<ActiveSectionKey>("designed");
  const [rulesOpen, setRulesOpen] = useState(false);

  const firmSlug = useMemo(() => firmParam, [firmParam]);

  // Phase comes from the slug head token (e.g. "evaluation", "payout-...", etc).
  // We no longer infer phase from any "active account" concept because legacy localStorage accounts are disabled.
  const phase: FirmPhase = useMemo(() => {
    const fromSlug = firstPhaseFromSlug(slugParam);
    return fromSlug ?? "evaluation";
  }, [slugParam]);

  useEffect(() => {
    try {
      document.title = `${titleCase(firmSlug)} ${titleCase(phase)} Playbook — Phase Plan | StayFunded`;
    } catch {
      // ignore
    }
  }, [firmSlug, phase]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setContentStatus("loading");
        setContent(null);

        const res = await fetch(
          `/api/playbook?firm=${encodeURIComponent(firmSlug)}&phase=${encodeURIComponent(
            String(phase)
          )}`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          if (!cancelled) {
            setContentStatus("error");
            setContent(null);
          }
          return;
        }

        const json = (await res.json()) as PlaybookContent;

        if (!cancelled) {
          setContent(json);
          setContentStatus("ready");
        }
      } catch {
        if (!cancelled) {
          setContentStatus("error");
          setContent(null);
        }
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [firmSlug, phase]);

  const quickBrief = useMemo(() => {
    if (!content) return null;
    const s = (content as any)?.sections ?? {};
    const a = (s.designed?.[0] ?? null) as string | null;
    const b = (s.damagingRules?.[0] ?? null) as string | null;
    const c = (s.survivors?.[0] ?? null) as string | null;

    return { purpose: a, killRule: b, planMove: c };
  }, [content]);

  const activeTab = useMemo(() => {
    if (activeKey === "premarket") {
      return {
        title: "Before You Trade (Pre-Market Checklist)",
        hint: "Use this every day before the first trade. If the checklist says “stand down,” you stand down.",
      };
    }
    if (activeKey === "social") {
      return {
        title: "Social & Accountability",
        hint: "Firm + phase rooms. Optional pairing. No noise, no guru feeds.",
      };
    }
    return TABS.find((t) => t.key === activeKey) ?? TABS[0];
  }, [activeKey]);

  const activeItems = useMemo(() => {
    if (!content) return [];
    if (activeKey === "premarket" || activeKey === "social") return [];
    return content.sections?.[activeKey] ?? [];
  }, [content, activeKey]);

  const preMarketItems = useMemo(() => getPreMarketChecklist(firmSlug, phase), [firmSlug, phase]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Top bar */}
      <div className="border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Link
                href={`/firms/${firmSlug}/phases`}
                className="rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
              >
                ← Back to phases
              </Link>

              <Chip>{titleCase(firmSlug)}</Chip>
              <Chip tone="warn">{titleCase(phase)}</Chip>
              <Chip>Playbook</Chip>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setRulesOpen(true)}
                className="rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_10px_25px_rgba(2,6,23,0.25)] hover:opacity-95"
              >
                Official rules (reference)
              </button>
            </div>
          </div>

          <div className="mt-3">
            <div className="text-lg font-semibold text-slate-950">
              {content?.title ?? "Loading playbook…"}
            </div>
            <div className="mt-1 text-sm text-slate-600">
              This is the phase plan: how professionals structure trading under the firm’s rules in this
              phase. No signals. No guarantees.
            </div>
          </div>

          {/* Quick Brief */}
          {quickBrief && contentStatus === "ready" && (
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-3xl border border-slate-200 bg-white/70 p-4 shadow-[0_10px_25px_rgba(2,6,23,0.05)] backdrop-blur">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Phase purpose
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-900">
                  {quickBrief.purpose ? renderMaybeLink(quickBrief.purpose, firmSlug, phase) : "—"}
                </div>
              </div>

              <div className="rounded-3xl border border-amber-200 bg-amber-50/70 p-4 shadow-[0_10px_25px_rgba(2,6,23,0.05)] backdrop-blur">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                  Primary kill rule
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-900">
                  {quickBrief.killRule ? renderMaybeLink(quickBrief.killRule, firmSlug, phase) : "—"}
                </div>
              </div>

              <div className="rounded-3xl border border-emerald-200 bg-emerald-50/60 p-4 shadow-[0_10px_25px_rgba(2,6,23,0.05)] backdrop-blur">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                  Key plan move
                </div>
                <div className="mt-2 text-sm leading-6 text-slate-900">
                  {quickBrief.planMove ? renderMaybeLink(quickBrief.planMove, firmSlug, phase) : "—"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {contentStatus === "loading" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-700 shadow-[0_10px_25px_rgba(2,6,23,0.05)]">
            Loading playbook…
          </div>
        )}

        {contentStatus === "error" && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-900 shadow-[0_10px_25px_rgba(2,6,23,0.05)]">
            <div className="font-semibold">Playbook failed to load.</div>
            <div className="mt-2 text-rose-900/80">
              This usually means the playbook file is missing or the markdown headers don’t match the schema expected by
              the API parser.
            </div>
            <div className="mt-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-rose-900/70">
                Expected sections
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-900/90">
                {TABS.map((t) => (
                  <li key={t.key}>{t.title}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {contentStatus === "ready" && content && (
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Left nav */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <div className="rounded-3xl border border-slate-200 bg-white/70 p-3 shadow-[0_10px_25px_rgba(2,6,23,0.05)] backdrop-blur">
                <div className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Playbook
                </div>

                <div className="space-y-1">
                  {TABS.map((t) => {
                    const active = t.key === activeKey;
                    return (
                      <button
                        key={t.key}
                        onClick={() => setActiveKey(t.key)}
                        className={[
                          "w-full rounded-2xl px-3 py-2 text-left text-sm font-semibold transition",
                          active
                            ? "bg-slate-950 text-white shadow-[0_10px_25px_rgba(2,6,23,0.25)]"
                            : "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span>{t.label}</span>
                          <span
                            className={[
                              "rounded-full px-2 py-0.5 text-[11px] font-bold",
                              active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-600",
                            ].join(" ")}
                          >
                            {content.sections[t.key]?.length ?? 0}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-4 px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Daily use
                </div>
                <div className="space-y-1">
                  {(() => {
                    const active = activeKey === "premarket";
                    return (
                      <button
                        onClick={() => setActiveKey("premarket")}
                        className={[
                          "w-full rounded-2xl px-3 py-2 text-left text-sm font-semibold transition",
                          active
                            ? "bg-slate-950 text-white shadow-[0_10px_25px_rgba(2,6,23,0.25)]"
                            : "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span>Before you trade</span>
                          <span
                            className={[
                              "rounded-full px-2 py-0.5 text-[11px] font-bold",
                              active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-600",
                            ].join(" ")}
                          >
                            {preMarketItems.length}
                          </span>
                        </div>
                      </button>
                    );
                  })()}
                </div>

                <div className="mt-4 px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Social
                </div>
                <div className="space-y-1">
                  {(() => {
                    const active = activeKey === "social";
                    return (
                      <button
                        onClick={() => setActiveKey("social")}
                        className={[
                          "w-full rounded-2xl px-3 py-2 text-left text-sm font-semibold transition",
                          active
                            ? "bg-slate-950 text-white shadow-[0_10px_25px_rgba(2,6,23,0.25)]"
                            : "bg-white text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span>Social & accountability</span>
                          <span
                            className={[
                              "rounded-full px-2 py-0.5 text-[11px] font-bold",
                              active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-600",
                            ].join(" ")}
                          >
                            2
                          </span>
                        </div>
                      </button>
                    );
                  })()}
                </div>

                <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                  Tip: Read the playbook when you need context. Hit “Before you trade” every morning.
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div>
              <div className="rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-[0_10px_25px_rgba(2,6,23,0.05)] backdrop-blur">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-xl font-semibold text-slate-950">{activeTab.title}</div>
                    {"hint" in activeTab && (activeTab as any).hint ? (
                      <div className="mt-1 text-sm text-slate-600">{(activeTab as any).hint}</div>
                    ) : null}
                  </div>
                  <div className="flex items-center gap-2">
                    <Chip>{titleCase(firmSlug)}</Chip>
                    <Chip tone="warn">{titleCase(phase)}</Chip>
                  </div>
                </div>

                <div className="mt-6">
                  {activeKey === "premarket" ? (
                    <ChecklistList items={preMarketItems} />
                  ) : activeKey === "social" ? (
                    <SocialPanel firmSlug={firmSlug} phase={phase} />
                  ) : (
                    <BulletList items={activeItems} firmSlug={firmSlug} phase={phase} />
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  Context: <span className="font-semibold">{firmSlug}</span> /{" "}
                  <span className="font-semibold">{phase}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRulesOpen(true)}
                    className="rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
                  >
                    Official rules (reference)
                  </button>
                  <Link
                    href={`/firms/${firmSlug}/phases`}
                    className="rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white shadow-[0_10px_25px_rgba(2,6,23,0.25)] hover:opacity-95"
                  >
                    Back to phases
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rules modal (placeholder; actual data source comes later) */}
      <Modal
        open={rulesOpen}
        title={`Official rules (reference) — ${titleCase(firmSlug)} · ${titleCase(phase)}`}
        onClose={() => setRulesOpen(false)}
      >
        <div className="space-y-3 text-sm text-slate-800">
          <p className="font-semibold">This is a factual rule list (no analysis).</p>
          <p className="text-slate-700">
            We’ll wire this to a canonical rules source so you can cross-check the plan against the rulebook without
            leaving the page.
          </p>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Coming next</div>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>Full rule list for this firm + phase</li>
              <li>Clear highlighting of the rules that actually end accounts</li>
              <li>Optional link out to firm source for verification</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}
