// src/app/dashboard/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

import {
  listAccountsDb,
  upsertAccountDb,
  updateAccountDb,
  type Account,
  type FirmPhase,
} from "@/lib/accountsDb";
import { listSnapshotAccountIdsForDateDb } from "@/lib/snapshotsDb";

/**
 * Dashboard (PRODUCT)
 * - This is the real "Today" operating surface (post-signup).
 * - Dashboard is conservative: it must not invent readiness.
 *
 * Readiness sources:
 * - Discord: derived from Supabase discord_memberships (approved => green).
 * - Trade Plan + Accountability: not DB-backed yet → remain conservative here.
 *
 * NOTE: This page must not claim readiness from localStorage.
 */

function titleCase(s: string) {
  return (s || "")
    .trim()
    .toLowerCase()
    .split("-")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function firmName(slug: string) {
  const map: Record<string, string> = {
    topstep: "Topstep",
    apex: "Apex Trader Funding",
    earn2trade: "Earn2Trade",
    bulenox: "Bulenox",
    "take-profit-trader": "Take Profit Trader",
  };
  const key = (slug || "").trim().toLowerCase();
  return map[key] ?? titleCase(key);
}

function firmLogoSrc(slug: string) {
  const key = (slug || "").trim().toLowerCase();
  const map: Record<string, string> = {
    topstep: "/visuals/firms/Topstep.png",
    apex: "/visuals/firms/Apex.png",
    earn2trade: "/visuals/firms/earn2trade.png",
    "take-profit-trader": "/visuals/firms/Take-Profit-Trader.png",
  };
  return map[key] ?? "";
}

function phaseLabel(phase: FirmPhase) {
  const map: Record<FirmPhase, string> = {
    discovery: "Discovery",
    evaluation: "Evaluation",
    stabilization: "Stabilization",
    payout: "Payout",
    maintenance: "Maintenance",
  };
  return map[phase] ?? String(phase);
}

function phaseSubtitle(phase: FirmPhase) {
  const map: Record<FirmPhase, string> = {
    discovery: "Choose structure before you pay for mistakes.",
    evaluation: "Run a structured plan under strict constraints.",
    stabilization: "After you pass, reduce variance and protect eligibility.",
    payout: "Trade with payout rules in mind; avoid eligibility traps.",
    maintenance: "Keep funded accounts alive by staying boring on purpose.",
  };
  return map[phase] ?? "";
}

function displayAccountName(a: Account) {
  return (a.name || "").trim() || (a.accountNumber || "").trim() || `${firmName(a.firmSlug)} account`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/* ---------------------------
   Product UI primitives (dark)
   --------------------------- */

function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warn" | "danger";
}) {
  const cls =
    tone === "success"
      ? "bg-emerald-400/15 text-emerald-200 ring-emerald-400/25"
      : tone === "warn"
      ? "bg-amber-400/15 text-amber-200 ring-amber-400/25"
      : tone === "danger"
      ? "bg-rose-400/15 text-rose-200 ring-rose-400/25"
      : "bg-white/5 text-white/70 ring-white/10";

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ${cls}`}>
      {children}
    </span>
  );
}

function FirmLogoPlate({ firmSlug }: { firmSlug: string }) {
  const name = firmName(firmSlug);
  const src = firmLogoSrc(firmSlug);

  const plate = "relative h-14 w-32 overflow-hidden rounded-2xl bg-white ring-1 ring-black/10";

  if (src) {
    return (
      <div className={plate}>
        <Image
          src={src}
          alt={`${name} logo`}
          fill
          className="object-contain px-2 py-1"
          sizes="128px"
          priority={false}
        />
      </div>
    );
  }

  const letter = (name[0] || "A").toUpperCase();
  return (
    <div className="flex h-14 w-32 items-center justify-center rounded-2xl bg-white/10 text-sm font-semibold text-white ring-1 ring-white/10">
      {letter}
    </div>
  );
}

/* ---------------------------
   Grouping (UI-first; localStorage)
   --------------------------- */

type AccountGroup = {
  id: string;
  name: string;
  accountIds: string[];
};

const LS_GROUPS = "sf_account_groups_v1"; // { [groupId]: AccountGroup }
const LS_GROUP_MAP = "sf_account_group_map_v1"; // { [accountId]: groupId }

function safeReadJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWriteJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

function uid() {
  return Math.random().toString(36).slice(2) + "-" + Date.now().toString(36);
}

function loadGroups(): Record<string, AccountGroup> {
  return safeReadJson<Record<string, AccountGroup>>(LS_GROUPS, {});
}

function loadGroupMap(): Record<string, string> {
  return safeReadJson<Record<string, string>>(LS_GROUP_MAP, {});
}

function saveGroups(next: Record<string, AccountGroup>) {
  safeWriteJson(LS_GROUPS, next);
}

function saveGroupMap(next: Record<string, string>) {
  safeWriteJson(LS_GROUP_MAP, next);
}

/* ---------------------------
   Icons + readiness UI
   --------------------------- */

function IconDiscord({ active }: { active: boolean }) {
  const cls = active ? "text-white" : "text-white/35";
  return (
    <svg className={`h-6 w-6 ${cls}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.3 4.6A16.9 16.9 0 0 0 16.2 3a11.2 11.2 0 0 0-.5 1.1 15.1 15.1 0 0 0-4.3 0c-.2-.4-.4-.8-.6-1.1A16.7 16.7 0 0 0 6.7 4.6C4 8.6 3.2 12.5 3.6 16.4a17 17 0 0 0 5.3 2.7c.4-.6.8-1.3 1.1-2a10.7 10.7 0 0 1-1.7-.8l.4-.3a12.1 12.1 0 0 0 10.5 0l.4.3c-.5.3-1.1.6-1.7.8.3.7.7 1.4 1.1 2a17 17 0 0 0 5.3-2.7c.5-4.5-.8-8.4-3-11.8ZM9.6 14.4c-.8 0-1.5-.8-1.5-1.7 0-1 .7-1.7 1.5-1.7s1.5.8 1.5 1.7c0 1-.7 1.7-1.5 1.7Zm4.8 0c-.8 0-1.5-.8-1.5-1.7 0-1 .7-1.7 1.5-1.7s1.5.8 1.5 1.7c0 1-.7 1.7-1.5 1.7Z" />
    </svg>
  );
}

function IconBuddy({ active }: { active: boolean }) {
  const cls = active ? "text-white" : "text-white/35";
  return (
    <svg className={`h-6 w-6 ${cls}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3Zm-8 0c1.7 0 3-1.3 3-3S9.7 5 8 5 5 6.3 5 8s1.3 3 3 3Zm0 2c-2.3 0-7 1.1-7 3.5V20h14v-3.5C15 14.1 10.3 13 8 13Zm8 0c-.3 0-.7 0-1.1.1 1.1.8 2.1 1.9 2.1 3.4V20h7v-3.5c0-2.4-4.7-3.5-7-3.5Z" />
    </svg>
  );
}

function IconPlan({ active }: { active: boolean }) {
  const cls = active ? "text-white" : "text-white/35";
  return (
    <svg className={`h-6 w-6 ${cls}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 2h9l3 3v17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.5V6h2.5L14 3.5ZM7 9h10v2H7V9Zm0 4h10v2H7v-2Zm0 4h7v2H7v-2Z" />
    </svg>
  );
}

function StatusDot({ ok }: { ok: boolean }) {
  return <span className={`h-2.5 w-2.5 rounded-full ${ok ? "bg-emerald-400" : "bg-amber-400"}`} />;
}

function ReadinessChip({
  label,
  active,
  icon,
  hint,
  onClick,
}: {
  label: "Trade Plan" | "Discord" | "Accountability";
  active: boolean;
  icon: React.ReactNode;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center justify-between gap-2 rounded-2xl bg-white/5 px-3 py-2 text-xs font-semibold ring-1 ring-white/10 transition hover:bg-white/10"
      title={hint}
    >
      <span className="flex min-w-0 items-center gap-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-black/20 ring-1 ring-white/10 group-hover:bg-white/5">
          {icon}
        </span>
        <span className="truncate text-white">{label}</span>
      </span>

      <StatusDot ok={active} />
    </button>
  );
}

function ReadinessRow({
  tradePlanOk,
  discordOk,
  accountabilityOk,
  onTradePlan,
  onDiscord,
  onAccountability,
}: {
  tradePlanOk: boolean;
  discordOk: boolean;
  accountabilityOk: boolean;
  onTradePlan: () => void;
  onDiscord: () => void;
  onAccountability: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="min-w-[170px] flex-1">
        <ReadinessChip
          label="Trade Plan"
          active={tradePlanOk}
          icon={<IconPlan active={tradePlanOk} />}
          hint="Trade Plan is completed on the account page (dashboard stays conservative)."
          onClick={onTradePlan}
        />
      </div>
      <div className="min-w-[170px] flex-1">
        <ReadinessChip
          label="Discord"
          active={discordOk}
          icon={<IconDiscord active={discordOk} />}
          hint={discordOk ? "Discord access approved" : "Discord access not approved yet (request from the account page)"}
          onClick={onDiscord}
        />
      </div>
      <div className="min-w-[170px] flex-1">
        <ReadinessChip
          label="Accountability"
          active={accountabilityOk}
          icon={<IconBuddy active={accountabilityOk} />}
          hint="Accountability is managed on the account page (dashboard stays conservative)."
          onClick={onAccountability}
        />
      </div>
    </div>
  );
}

function CardStackFrame({ enabled, children }: { enabled: boolean; children: React.ReactNode }) {
  if (!enabled) return <>{children}</>;
  return (
    <div className="relative">
      <div className="absolute -left-2 -top-2 h-full w-full rounded-3xl border border-white/10 bg-white/5 shadow-sm" />
      <div className="absolute -left-1 -top-1 h-full w-full rounded-3xl border border-white/10 bg-white/5 shadow-sm" />
      <div className="relative">{children}</div>
    </div>
  );
}

/* ---------------------------
   Card renderers
   --------------------------- */

function AccountCard({
  a,
  startedToday,
  tradePlanOk,
  discordOk,
  accountabilityOk,
  onTradePlan,
  onDiscord,
  onAccountability,
  onOpen,
  onDragStart,
  discordStateLabel,
}: {
  a: Account;
  startedToday: boolean;
  tradePlanOk: boolean;
  discordOk: boolean;
  accountabilityOk: boolean;
  onTradePlan: () => void;
  onDiscord: () => void;
  onAccountability: () => void;
  onOpen: () => void;
  onDragStart: (e: React.DragEvent) => void;
  discordStateLabel: string;
}) {
  const firm = (a.firmSlug || "").trim().toLowerCase();

  return (
    <div
      className="rounded-3xl border border-white/10 bg-white/5 shadow-sm transition hover:bg-white/10"
      draggable
      onDragStart={onDragStart}
      title="Drag to move this account to a different phase"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <FirmLogoPlate firmSlug={firm} />

            <div className="min-w-0">
              <div className="truncate text-base font-semibold text-white">{displayAccountName(a)}</div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Pill>{firmName(firm)}</Pill>
                <Pill tone="warn">{phaseLabel(a.phase)}</Pill>
                {startedToday ? <Pill tone="success">Today started</Pill> : <Pill>Today not started</Pill>}
                <Pill tone={discordOk ? "success" : "warn"}>{discordStateLabel}</Pill>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={onOpen}
              className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300"
            >
              Open →
            </button>
          </div>
        </div>

        <div className="my-4 h-px bg-white/10" />

        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-2xl bg-black/20 px-3 py-2 ring-1 ring-white/10">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-white/55">Account #</div>
              <div className="mt-1 font-mono font-semibold text-white">{(a.accountNumber || "").trim() || "—"}</div>
            </div>

            <div className="rounded-2xl bg-black/20 px-3 py-2 ring-1 ring-white/10">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-white/55">Type</div>
              <div className="mt-1 font-semibold text-white">{(a.accountType || "").trim() || "—"}</div>
            </div>
          </div>

          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-white/55">Readiness checks</div>
            <ReadinessRow
              tradePlanOk={tradePlanOk}
              discordOk={discordOk}
              accountabilityOk={accountabilityOk}
              onTradePlan={onTradePlan}
              onDiscord={onDiscord}
              onAccountability={onAccountability}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GroupCard({
  groupName,
  memberCount,
  phase,
  startedToday,
  tradePlanOk,
  discordOk,
  accountabilityOk,
  onTradePlan,
  onDiscord,
  onAccountability,
  onOpen,
  onDragStart,
  mixedLabel,
}: {
  groupName: string;
  memberCount: number;
  phase: FirmPhase;
  startedToday: boolean;
  tradePlanOk: boolean;
  discordOk: boolean;
  accountabilityOk: boolean;
  onTradePlan: () => void;
  onDiscord: () => void;
  onAccountability: () => void;
  onOpen: () => void;
  onDragStart: (e: React.DragEvent) => void;
  mixedLabel: string;
}) {
  return (
    <CardStackFrame enabled={true}>
      <div
        className="rounded-3xl border border-white/10 bg-white/5 shadow-sm transition hover:bg-white/10"
        draggable
        onDragStart={onDragStart}
        title="Drag to move this copy group to a different phase"
      >
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="truncate text-base font-semibold text-white">{groupName}</div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Pill>Copy · {memberCount} accts</Pill>
                <Pill tone="warn">{phaseLabel(phase)}</Pill>
                {startedToday ? <Pill tone="success">Today started</Pill> : <Pill>Today not started</Pill>}
                {mixedLabel ? <Pill tone="warn">{mixedLabel}</Pill> : null}
              </div>
            </div>

            <div className="shrink-0">
              <button
                type="button"
                onClick={onOpen}
                className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300"
              >
                Open →
              </button>
            </div>
          </div>

          <div className="my-4 h-px bg-white/10" />

          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-white/55">Readiness checks</div>
            <ReadinessRow
              tradePlanOk={tradePlanOk}
              discordOk={discordOk}
              accountabilityOk={accountabilityOk}
              onTradePlan={onTradePlan}
              onDiscord={onDiscord}
              onAccountability={onAccountability}
            />
          </div>
        </div>
      </div>
    </CardStackFrame>
  );
}

function firmPhaseKey(firmSlug: string, phase: FirmPhase) {
  return `${(firmSlug || "").trim().toLowerCase()}|${phase}`;
}

const PHASE_ORDER: FirmPhase[] = ["evaluation", "stabilization", "payout", "maintenance", "discovery"];

export default function DashboardPage() {
  const router = useRouter();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingErr, setLoadingErr] = useState<string>("");

  const [query, setQuery] = useState("");
  const [showRetired, setShowRetired] = useState(false);

  const [startedTodaySet, setStartedTodaySet] = useState<Set<string>>(new Set());

  // grouping state (localStorage)
  const [groupsById, setGroupsById] = useState<Record<string, AccountGroup>>({});
  const [groupMap, setGroupMap] = useState<Record<string, string>>({});

  // create group UI
  const [newGroupName, setNewGroupName] = useState<string>("Copy group");
  const [newGroupSelectedIds, setNewGroupSelectedIds] = useState<Set<string>>(new Set());

  // drag state
  const [draggingKey, setDraggingKey] = useState<string>(""); // either "acct:<id>" or "group:<id>"
  const [dragOverPhase, setDragOverPhase] = useState<FirmPhase | null>(null);

  // truth caches
  // Trade Plan + Accountability remain conservative here until DB-backed.
  const [tradePlanMap, setTradePlanMap] = useState<Record<string, boolean>>({});
  const [discordStatusMap, setDiscordStatusMap] = useState<Record<string, "pending" | "approved" | "denied">>({});
  const [accountabilityMap, setAccountabilityMap] = useState<Record<string, any>>({});

  useEffect(() => {
    setTradePlanMap({});
    setAccountabilityMap({});
    loadDiscordStatusesFromDb();

    setGroupsById(loadGroups());
    setGroupMap(loadGroupMap());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadDiscordStatusesFromDb() {
    try {
      const { data: userRes } = await supabase.auth.getUser();
      const userId = userRes?.user?.id;
      if (!userId) {
        setDiscordStatusMap({});
        return;
      }

      const { data, error } = await supabase
        .from("discord_memberships")
        .select("firm_slug,phase,status")
        .eq("user_id", userId);

      if (error) throw error;

      const next: Record<string, "pending" | "approved" | "denied"> = {};
      for (const row of data ?? []) {
        const key = `${String(row.firm_slug).toLowerCase()}|${row.phase}`;
        const status = row.status as any;
        if (status === "pending" || status === "approved" || status === "denied") {
          next[key] = status;
        }
      }
      setDiscordStatusMap(next);
    } catch {
      setDiscordStatusMap({});
    }
  }

  async function refresh() {
    try {
      setLoadingErr("");
      const [list, startedIds] = await Promise.all([listAccountsDb(), listSnapshotAccountIdsForDateDb(todayISO())]);
      setAccounts(list);
      setStartedTodaySet(new Set(startedIds));

      await loadDiscordStatusesFromDb();

      setTradePlanMap({});
      setAccountabilityMap({});

      setGroupsById(loadGroups());
      setGroupMap(loadGroupMap());
    } catch (e: any) {
      setAccounts([]);
      setStartedTodaySet(new Set());
      setLoadingErr(e?.message || "Failed to load dashboard");
    }
  }

  function isRetired(a: Account) {
    return (a.status ?? "active") === "archived";
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return accounts.filter((a) => {
      if (!showRetired && isRetired(a)) return false;
      if (!q) return true;

      const hay = [displayAccountName(a), a.firmSlug, a.phase, a.accountType || "", a.accountNumber || ""]
        .join(" ")
        .toLowerCase();

      return hay.includes(q);
    });
  }, [accounts, query, showRetired]);

  const counts = useMemo(() => {
    const active = accounts.filter((a) => !isRetired(a)).length;
    const retired = accounts.filter((a) => isRetired(a)).length;
    return { active, retired };
  }, [accounts]);

  const visibleSoloAccounts = useMemo(() => {
    const mapped = new Set(Object.keys(groupMap));
    return filtered.filter((a) => !mapped.has(a.id));
  }, [filtered, groupMap]);

  const visibleGroups = useMemo(() => {
    const filteredIds = new Set(filtered.map((a) => a.id));
    const out: { group: AccountGroup; memberAccounts: Account[] }[] = [];

    for (const g of Object.values(groupsById)) {
      const ids = (g.accountIds || []).filter((id) => filteredIds.has(id));
      if (!ids.length) continue;
      const memberAccounts = ids.map((id) => filtered.find((a) => a.id === id)).filter(Boolean) as Account[];
      out.push({ group: { ...g, accountIds: ids }, memberAccounts });
    }

    return out;
  }, [groupsById, filtered]);

  const byPhase = useMemo(() => {
    const m: Record<
      FirmPhase,
      { solo: Account[]; groups: { group: AccountGroup; memberAccounts: Account[]; phase: FirmPhase; mixed: boolean }[] }
    > = {
      discovery: { solo: [], groups: [] },
      evaluation: { solo: [], groups: [] },
      stabilization: { solo: [], groups: [] },
      payout: { solo: [], groups: [] },
      maintenance: { solo: [], groups: [] },
    };

    for (const a of visibleSoloAccounts) m[a.phase].solo.push(a);

    for (const g of visibleGroups) {
      const phases = Array.from(new Set(g.memberAccounts.map((a) => a.phase)));
      const phase = (phases[0] ?? "evaluation") as FirmPhase;
      const mixed = phases.length > 1;
      m[phase].groups.push({ ...g, phase, mixed });
    }

    return m;
  }, [visibleSoloAccounts, visibleGroups]);

  async function createQuickAccount() {
    const saved = await upsertAccountDb({
      firmSlug: "topstep",
      phase: "evaluation",
      name: "New evaluation account",
      status: "active",
    });
    router.push(`/dashboard/accounts/${saved.id}`);
  }

  async function moveAccountToPhase(accountId: string, toPhase: FirmPhase) {
    const a = accounts.find((x) => x.id === accountId);
    if (!a) return;
    if (a.phase === toPhase) return;

    setAccounts((prev) => prev.map((x) => (x.id === accountId ? { ...x, phase: toPhase } : x)));

    try {
      await updateAccountDb(accountId, { phase: toPhase });
    } catch {
      setAccounts((prev) => prev.map((x) => (x.id === accountId ? a : x)));
      setLoadingErr("Failed to move account. Refresh and try again.");
    }
  }

  async function moveGroupToPhase(groupId: string, toPhase: FirmPhase) {
    const g = groupsById[groupId];
    if (!g) return;

    const memberIds = (g.accountIds || []).slice();
    if (!memberIds.length) return;

    setAccounts((prev) => prev.map((x) => (memberIds.includes(x.id) ? { ...x, phase: toPhase } : x)));

    try {
      await Promise.all(memberIds.map((id) => updateAccountDb(id, { phase: toPhase })));
    } catch {
      setLoadingErr("Failed to move group. Refresh and try again.");
      refresh();
    }
  }

  function truthTradePlan(accountId: string) {
    return !!tradePlanMap[accountId];
  }

  function discordState(firmSlug: string, phase: FirmPhase): "approved" | "pending" | "denied" | "missing" {
    const v = discordStatusMap[firmPhaseKey(firmSlug, phase)];
    if (v === "approved") return "approved";
    if (v === "pending") return "pending";
    if (v === "denied") return "denied";
    return "missing";
  }

  function truthDiscord(firmSlug: string, phase: FirmPhase) {
    return discordState(firmSlug, phase) === "approved";
  }

  function discordLabelForCard(firmSlug: string, phase: FirmPhase) {
    const s = discordState(firmSlug, phase);
    if (s === "approved") return "Discord approved";
    if (s === "pending") return "Discord pending";
    if (s === "denied") return "Discord denied";
    return "Discord not requested";
  }

  function truthAccountability(firmSlug: string, phase: FirmPhase) {
    const rec = accountabilityMap[firmPhaseKey(firmSlug, phase)];
    return !!rec && typeof rec === "object";
  }

  function openTradePlan(accountId: string) {
    router.push(`/dashboard/accounts/${accountId}?tab=playbooks`);
  }

  function openDiscord(accountId: string) {
    router.push(`/dashboard/accounts/${accountId}?tab=discord`);
  }

  function openAccountability(accountId: string) {
    router.push(`/dashboard/accounts/${accountId}?tab=settings`);
  }

  function openAccount(accountId: string) {
    router.push(`/dashboard/accounts/${accountId}`);
  }

  function openGroup(groupId: string) {
    const g = groupsById[groupId];
    const first = g?.accountIds?.[0];
    if (first) router.push(`/dashboard/accounts/${first}`);
  }

  function toggleSelectForNewGroup(accountId: string) {
    setNewGroupSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(accountId)) next.delete(accountId);
      else next.add(accountId);
      return next;
    });
  }

  function createGroupFromSelection() {
    const ids = Array.from(newGroupSelectedIds);
    if (ids.length < 2) {
      setLoadingErr("Select at least 2 accounts to create a copy group.");
      return;
    }

    const groupId = uid();
    const group: AccountGroup = { id: groupId, name: (newGroupName || "").trim() || "Copy group", accountIds: ids };

    const nextGroups = { ...groupsById, [groupId]: group };
    const nextMap = { ...groupMap };
    for (const id of ids) nextMap[id] = groupId;

    setGroupsById(nextGroups);
    setGroupMap(nextMap);
    saveGroups(nextGroups);
    saveGroupMap(nextMap);

    setNewGroupSelectedIds(new Set());
  }

  function removeGroup(groupId: string) {
    const g = groupsById[groupId];
    if (!g) return;

    const nextGroups = { ...groupsById };
    delete nextGroups[groupId];

    const nextMap = { ...groupMap };
    for (const id of g.accountIds || []) {
      if (nextMap[id] === groupId) delete nextMap[id];
    }

    setGroupsById(nextGroups);
    setGroupMap(nextMap);
    saveGroups(nextGroups);
    saveGroupMap(nextMap);
  }

  function renderPhaseBlock(phase: FirmPhase) {
    const list = byPhase[phase];
    const isActive = dragOverPhase === phase;

    const totalCards = (list?.solo?.length ?? 0) + (list?.groups?.length ?? 0);

    return (
      <div key={phase} className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-lg font-semibold text-white">{phaseLabel(phase)}</div>
            <div className="mt-1 text-sm text-white/60">{phaseSubtitle(phase)}</div>
          </div>
          <Pill>{totalCards} cards</Pill>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOverPhase(phase);
          }}
          onDragLeave={() => setDragOverPhase((cur) => (cur === phase ? null : cur))}
          onDrop={(e) => {
            e.preventDefault();
            setDragOverPhase(null);

            const key = draggingKey || e.dataTransfer.getData("text/plain");
            if (!key) return;

            if (key.startsWith("acct:")) {
              const id = key.replace("acct:", "");
              moveAccountToPhase(id, phase);
              return;
            }

            if (key.startsWith("group:")) {
              const gid = key.replace("group:", "");
              moveGroupToPhase(gid, phase);
              return;
            }
          }}
          className={`rounded-3xl border p-4 transition ${
            isActive ? "border-amber-400/30 bg-amber-400/10" : "border-white/10 bg-white/5"
          }`}
          title="Drop a card here to move it into this phase"
        >
          {totalCards === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-black/20 p-6">
              <div className="text-sm font-semibold text-white">No cards in {phaseLabel(phase)}</div>
              <div className="mt-1 text-sm text-white/60">Drag an account or copy group here when it moves phases.</div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {(list.groups || []).map((g) => {
                const anyStarted = g.memberAccounts.some((a) => startedTodaySet.has(a.id));
                const allTradePlan = g.memberAccounts.every((a) => truthTradePlan(a.id));

                const phases = Array.from(new Set(g.memberAccounts.map((a) => a.phase)));
                const firms = Array.from(new Set(g.memberAccounts.map((a) => (a.firmSlug || "").toLowerCase())));
                const mixed = phases.length > 1 || firms.length > 1;

                const f0 = (firms[0] ?? "topstep") as string;
                const p0 = (phases[0] ?? g.phase) as FirmPhase;

                const discordOk = !mixed && truthDiscord(f0, p0);
                const accountabilityOk = !mixed && truthAccountability(f0, p0);

                return (
                  <GroupCard
                    key={g.group.id}
                    groupName={g.group.name}
                    memberCount={g.memberAccounts.length}
                    phase={g.phase}
                    startedToday={anyStarted}
                    tradePlanOk={allTradePlan}
                    discordOk={discordOk}
                    accountabilityOk={accountabilityOk}
                    mixedLabel={mixed ? "Mixed firm/phase" : ""}
                    onTradePlan={() => {
                      const first = g.memberAccounts[0];
                      if (first) openTradePlan(first.id);
                    }}
                    onDiscord={() => {
                      const first = g.memberAccounts[0];
                      if (first) openDiscord(first.id);
                    }}
                    onAccountability={() => {
                      const first = g.memberAccounts[0];
                      if (first) openAccountability(first.id);
                    }}
                    onOpen={() => openGroup(g.group.id)}
                    onDragStart={(ev) => {
                      const key = `group:${g.group.id}`;
                      setDraggingKey(key);
                      try {
                        ev.dataTransfer.setData("text/plain", key);
                      } catch {
                        // ignore
                      }
                    }}
                  />
                );
              })}

              {(list.solo || []).map((a) => {
                const startedToday = startedTodaySet.has(a.id);

                const tp = truthTradePlan(a.id);
                const dc = truthDiscord(a.firmSlug, a.phase);
                const ab = truthAccountability(a.firmSlug, a.phase);

                return (
                  <AccountCard
                    key={a.id}
                    a={a}
                    startedToday={startedToday}
                    tradePlanOk={tp}
                    discordOk={dc}
                    accountabilityOk={ab}
                    discordStateLabel={discordLabelForCard(a.firmSlug, a.phase)}
                    onTradePlan={() => openTradePlan(a.id)}
                    onDiscord={() => openDiscord(a.id)}
                    onAccountability={() => openAccountability(a.id)}
                    onOpen={() => openAccount(a.id)}
                    onDragStart={(ev) => {
                      const key = `acct:${a.id}`;
                      setDraggingKey(key);
                      try {
                        ev.dataTransfer.setData("text/plain", key);
                      } catch {
                        // ignore
                      }
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  const ungroupedActiveAccounts = useMemo(() => {
    const mapped = new Set(Object.keys(groupMap));
    return accounts.filter((a) => !isRetired(a) && !mapped.has(a.id));
  }, [accounts, groupMap]);

  return (
    <main className="min-h-screen bg-[#070A14] text-white">
      <div className="mx-auto max-w-[1280px] px-6 py-12 md:px-10">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">Today</h1>
            <p className="mt-2 max-w-3xl text-sm text-white/65">
              Operate your prop firm accounts with structure. Each card keeps you honest: Trade Plan, Discord, Accountability.
            </p>

            {loadingErr ? (
              <div className="mt-3 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-2 text-xs font-semibold text-rose-200">
                {loadingErr}
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={createQuickAccount}
              className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300"
              title="Creates a default evaluation account; refine details inside the account."
            >
              Add account
            </button>

            <button
              type="button"
              onClick={refresh}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Refresh
            </button>

            <Link
              href="/discovery"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Discovery
            </Link>

            <Link
              href="/firms"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Firms
            </Link>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 flex flex-col gap-3 rounded-3xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Pill>Active: {counts.active}</Pill>
            <Pill>Retired: {counts.retired}</Pill>
          </div>

          <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center md:justify-end">
            <div className="flex w-full max-w-md items-center gap-2 rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
              <span className="text-xs font-semibold text-white/55">Search</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Account name, firm, phase…"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
              />
            </div>

            <button
              type="button"
              onClick={() => setShowRetired((v) => !v)}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              {showRetired ? "Hide retired" : "Show retired"}
            </button>
          </div>
        </div>

        {/* Grouping panel */}
        <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-white">Copy trading groups</div>
              <div className="mt-1 text-sm text-white/65">
                Group multiple prop accounts into one operating unit (one card, one phase move).
              </div>
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-black/20 p-4 ring-1 ring-white/10">
              <div className="text-xs font-semibold uppercase tracking-wide text-white/55">Create group</div>

              <div className="mt-3">
                <div className="text-xs font-semibold text-white/70">Group name</div>
                <input
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:ring-2 focus:ring-amber-400/30"
                  placeholder="e.g. Apex copy set"
                />
              </div>

              <div className="mt-4">
                <div className="text-xs font-semibold text-white/70">Select accounts (min 2)</div>
                <div className="mt-2 max-h-48 overflow-auto rounded-2xl border border-white/10 bg-white/5 p-2">
                  {ungroupedActiveAccounts.length ? (
                    <div className="grid gap-2">
                      {ungroupedActiveAccounts.map((a) => {
                        const checked = newGroupSelectedIds.has(a.id);
                        return (
                          <label
                            key={a.id}
                            className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2 hover:bg-white/5"
                          >
                            <span className="min-w-0">
                              <div className="truncate text-sm font-semibold text-white">{displayAccountName(a)}</div>
                              <div className="mt-1 text-xs text-white/60">
                                {firmName(a.firmSlug)} · {phaseLabel(a.phase)}
                              </div>
                            </span>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleSelectForNewGroup(a.id)}
                              className="h-4 w-4"
                            />
                          </label>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="px-3 py-3 text-sm text-white/60">No ungrouped active accounts available.</div>
                  )}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={createGroupFromSelection}
                  className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300"
                >
                  Create group
                </button>
                <button
                  type="button"
                  onClick={() => setNewGroupSelectedIds(new Set())}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Clear selection
                </button>
              </div>
            </div>

            <div className="rounded-2xl bg-black/20 p-4 ring-1 ring-white/10">
              <div className="text-xs font-semibold uppercase tracking-wide text-white/55">Existing groups</div>
              <div className="mt-3 grid gap-3">
                {Object.values(groupsById).length ? (
                  Object.values(groupsById).map((g) => (
                    <div
                      key={g.id}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-white">{g.name}</div>
                        <div className="mt-1 text-xs text-white/60">{(g.accountIds || []).length} accounts</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeGroup(g.id)}
                        className="rounded-xl border border-rose-400/25 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-200 hover:bg-rose-400/15"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-white/60">No groups yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Empty state */}
        {filtered.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-8">
            <div className="text-lg font-semibold text-white">No accounts yet</div>
            <p className="mt-2 max-w-3xl text-sm text-white/65">
              Add one or more prop accounts. You’ll move them through lifecycle phases as they progress.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={createQuickAccount}
                className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-300"
              >
                Add your first account
              </button>
              <Link
                href="/discovery"
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Start with Discovery
              </Link>
            </div>
          </div>
        ) : null}

        {/* Phase sections */}
        <div className="mt-10 space-y-10">{PHASE_ORDER.map(renderPhaseBlock)}</div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/65">
          <div className="font-semibold text-white">About readiness checks</div>
          <div className="mt-2">
            Trade Plan turns green only when you commit a trade plan for that account. Discord turns green only after your
            request is approved for the firm+phase room. Accountability turns green only after you’re matched and we’ve
            stored your partner for that firm+phase.
          </div>
          <div className="mt-3 text-xs text-white/55">No signals. No trade calls. No guarantees.</div>
        </div>

        <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/65">
          <div className="font-semibold text-white">About phases</div>
          <div className="mt-2">
            Move accounts through phases as they progress (Evaluation → Stabilization → Payout → Maintenance). Drag any
            card into a different phase to keep the dashboard aligned with reality.
          </div>
        </div>
      </div>
    </main>
  );
}
