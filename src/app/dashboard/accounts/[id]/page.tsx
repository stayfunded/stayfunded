// src/app/dashboard/accounts/[id]/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  getDiscordMembershipForScope,
  requestDiscordAccess,
} from "@/lib/discordMembershipsDb";

import {
  getAccountDb,
  updateAccountDb,
  deleteAccountDb,
  type Account,
  type FirmPhase,
} from "@/lib/accountsDb";

import {
  defaultRoadmapTemplate,
  getRoadmapWeek,
  getWeekStartISO,
  upsertRoadmapWeek,
} from "@/lib/roadmap";

import {
  defaultChecklistTemplate,
  getDailyChecklist,
  getTodayISO,
  upsertDailyChecklist,
  type ChecklistItem,
} from "@/lib/checklists";

import {
  ensureExecutionDay,
  getPhaseStreak,
  setDayIntent,
  closeOutDay,
  listExecutionDaysForAccount,
  type ExecutionDay,
  type DayClassification,
} from "@/lib/execution";

import {
  getSnapshotDb,
  upsertSnapshotDb,
  type AccountSnapshot,
} from "@/lib/snapshotsDb";
import { computeDailyGuidance } from "@/lib/dailyGuidance";

type TabKey =
  | "today"
  | "roadmap"
  | "playbooks"
  | "rules"
  | "checklists"
  | "discord"
  | "settings";
type GuidanceState = ReturnType<typeof computeDailyGuidance> | null;

const PHASES: { value: FirmPhase; label: string; note: string }[] = [
  { value: "discovery", label: "Discovery", note: "Choose structure before you pay for mistakes." },
  { value: "evaluation", label: "Evaluation", note: "Survive constraints long enough for variance to resolve." },
  { value: "stabilization", label: "Stabilization", note: "Post-pass danger zone. Reduce variance, protect eligibility." },
  { value: "payout", label: "Payout", note: "Extract value while staying compliant with payout mechanics." },
  { value: "maintenance", label: "Maintenance", note: "Keep it boring on purpose to prevent slow failure." },
];

function titleCase(s: string) {
  return (s || "")
    .trim()
    .toLowerCase()
    .split("-")
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function titleizeFirm(slug: string) {
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

function phaseObjective(phase: FirmPhase) {
  const map: Record<FirmPhase, string> = {
    discovery: "Pick a firm + evaluation structure you can survive, not one that sounds impressive.",
    evaluation: "Stay eligible long enough for your edge to play out. Passing is survival, not aggression.",
    stabilization: "Build buffer and avoid giving the account back right after you pass.",
    payout: "Get paid without triggering the rules that quietly disqualify withdrawals.",
    maintenance: "Keep funded accounts alive by treating variance as the enemy.",
  };
  return map[phase] ?? "";
}

function primaryRisk(phase: FirmPhase) {
  const map: Record<FirmPhase, string> = {
    discovery: "Buying a structure that punishes your natural style (and forces resets).",
    evaluation: "Rule violation from drawdown mechanics + early size escalation.",
    stabilization: "Overconfidence and variance expansion right after you pass.",
    payout: "Eligibility traps: minimum days, consistency enforcement, payout timing rules.",
    maintenance: "Slow bleed: rule drift, discipline decay, creeping risk.",
  };
  return map[phase] ?? "";
}

function operatingPosture(phase: FirmPhase) {
  const map: Record<FirmPhase, string> = {
    discovery: "Selection and avoidance.",
    evaluation: "Defensive survival.",
    stabilization: "Variance compression.",
    payout: "Extraction with restraint.",
    maintenance: "Boring consistency.",
  };
  return map[phase] ?? "";
}

/* ---------------------------
   Product UI primitives (dark)
   --------------------------- */

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
        active
          ? "bg-amber-400 text-black"
          : "bg-white/5 text-white ring-1 ring-white/10 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

function Toast({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="rounded-2xl bg-black/80 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 shadow-lg">
        {text}
      </div>
    </div>
  );
}

function linesToList(s: string) {
  return (s || "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

function listToLines(items: string[]) {
  return (items || []).join("\n");
}

function ChecklistRow({
  item,
  onToggle,
}: {
  item: ChecklistItem;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-left hover:bg-white/10"
    >
      <div
        className={`mt-0.5 h-5 w-5 shrink-0 rounded-md ring-1 ring-white/10 ${
          item.done ? "bg-amber-400" : "bg-black/20"
        }`}
      />
      <div className="min-w-0">
        <div className={`text-sm font-semibold ${item.done ? "text-white" : "text-white"}`}>
          {item.label}
        </div>
        <div className="mt-1 text-xs text-white/55">Tap to {item.done ? "undo" : "mark done"}.</div>
      </div>
    </button>
  );
}

function intentLabel(intent: string | null | undefined) {
  if (intent === "trade") return "Trade";
  if (intent === "no_trade") return "No-trade";
  return "—";
}

function classificationLabel(c: string | null | undefined) {
  if (c === "good_execution") return "Good execution";
  if (c === "rule_safe_no_trade") return "Rule-safe no-trade";
  if (c === "increased_future_risk") return "Increased future risk";
  return "—";
}

function isoFromDate(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function addDaysISO(iso: string, deltaDays: number) {
  const [y, m, d] = iso.split("-").map((x) => Number(x));
  const dt = new Date(y, (m || 1) - 1, d || 1);
  dt.setDate(dt.getDate() + deltaDays);
  return isoFromDate(dt);
}

function shortDowLabel(iso: string) {
  const [y, m, d] = iso.split("-").map((x) => Number(x));
  const dt = new Date(y, (m || 1) - 1, d || 1);
  return dt.toLocaleDateString(undefined, { weekday: "short" });
}

function mmddLabel(iso: string) {
  const [y, m, d] = iso.split("-").map((x) => Number(x));
  const dt = new Date(y, (m || 1) - 1, d || 1);
  return dt.toLocaleDateString(undefined, { month: "numeric", day: "numeric" });
}

function DayStrip({
  todayISO,
  selectedISO,
  setSelectedISO,
  byDate,
}: {
  todayISO: string;
  selectedISO: string;
  setSelectedISO: (iso: string) => void;
  byDate: Record<string, ExecutionDay | undefined>;
}) {
  const days = useMemo(() => {
    const out: string[] = [];
    for (let i = 6; i >= 0; i--) out.push(addDaysISO(todayISO, -i));
    return out;
  }, [todayISO]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-white/55">
            Day
          </div>
          <div className="mt-1 text-sm font-semibold text-white">
            {selectedISO === todayISO ? "Today" : "Selected"}:{" "}
            <span className="font-mono text-white/85">{selectedISO}</span>
          </div>
        </div>
        <div className="text-xs text-white/55">Last 7 days</div>
      </div>

      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {days.map((iso) => {
          const d = byDate[iso];
          const selected = iso === selectedISO;
          const closed = !!d?.completed;
          const hasIntent = !!d?.intent;

          const base =
            "shrink-0 rounded-2xl px-3 py-2 text-left ring-1 transition hover:bg-white/10";
          const cls = selected
            ? "bg-amber-400 text-black ring-amber-400"
            : "bg-black/20 text-white ring-white/10";

          return (
            <button
              key={iso}
              type="button"
              onClick={() => setSelectedISO(iso)}
              className={`${base} ${cls}`}
              title={iso}
            >
              <div
                className={`text-[11px] font-semibold ${
                  selected ? "text-black/70" : "text-white/55"
                }`}
              >
                {shortDowLabel(iso)}
              </div>
              <div className="mt-0.5 text-sm font-semibold">{mmddLabel(iso)}</div>
              <div
                className={`mt-1 text-[11px] font-semibold ${
                  selected ? "text-black/80" : "text-white/60"
                }`}
              >
                {closed ? "Closed" : "Open"} · {hasIntent ? intentLabel(d?.intent) : "—"}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-2 text-[11px] text-white/55">
        Selecting a day loads its intent, checklist, and closeout state.
      </div>
    </div>
  );
}

export default function AccountPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = (params?.id || "").toString();

  const [discordHandle, setDiscordHandle] = useState("");
  const [discordStatus, setDiscordStatus] = useState<
    "none" | "pending" | "approved" | "denied"
  >("none");
  const [discordError, setDiscordError] = useState("");
  const [discordSubmitting, setDiscordSubmitting] = useState(false);

  const [account, setAccount] = useState<Account | null>(null);
  const [tab, setTab] = useState<TabKey>("today");

  const [toast, setToast] = useState<{ show: boolean; text: string }>({
    show: false,
    text: "",
  });

  // Settings form state
  const [name, setName] = useState("");
  const [firmSlug, setFirmSlug] = useState("topstep");
  const [accountType, setAccountType] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [phase, setPhase] = useState<FirmPhase>("evaluation");
  const [status, setStatus] = useState<Account["status"]>("active");

  // Roadmap (still local for now)
  const [weekStart, setWeekStart] = useState<string>(getWeekStartISO());
  const [rmObjective, setRmObjective] = useState("");
  const [rmConstraints, setRmConstraints] = useState("");
  const [rmOperatingPlan, setRmOperatingPlan] = useState("");
  const [rmCompletion, setRmCompletion] = useState("");

  // Checklists (DB)
  const [todayISO, setTodayISO] = useState<string>(getTodayISO());
  const [selectedISO, setSelectedISO] = useState<string>(getTodayISO());
  const [preItems, setPreItems] = useState<ChecklistItem[]>([]);
  const [postItems, setPostItems] = useState<ChecklistItem[]>([]);

  // Execution (DB)
  const [exec, setExec] = useState<ExecutionDay | null>(null);
  const [execNotes, setExecNotes] = useState("");
  const [phaseStreak, setPhaseStreak] = useState<number>(0);
  const [execHistory, setExecHistory] = useState<ExecutionDay[]>([]);

  // Snapshots (DB)
  const [snapshot, setSnapshot] = useState<AccountSnapshot | null>(null);

  // Snapshot form fields
  const [snapBalance, setSnapBalance] = useState<string>("");
  const [snapMaxLossThreshold, setSnapMaxLossThreshold] = useState<string>("");
  const [snapDrawdownType, setSnapDrawdownType] = useState<string>("");
  const [snapDaysUsed, setSnapDaysUsed] = useState<string>("");
  const [snapDaysRemaining, setSnapDaysRemaining] = useState<string>("");

  // Guidance (computed later)
  const [guidance, setGuidance] = useState<GuidanceState>(null);

  const flashToast = (text: string) => {
    setToast({ show: true, text });
    window.setTimeout(() => setToast({ show: false, text: "" }), 1400);
  };

  async function saveSnapshotForSelectedDay() {
    try {
      if (!account) return;

      const balance = Number(snapBalance);
      const maxLossThreshold = Number(snapMaxLossThreshold);

      if (!Number.isFinite(balance) || !Number.isFinite(maxLossThreshold)) {
        flashToast("Enter balance and max loss threshold");
        return;
      }

      const remainingDrawdown = balance - maxLossThreshold;

      await upsertSnapshotDb({
        accountId: account.id,
        date: selectedISO,
        balance,
        maxLossThreshold,
        drawdownType: snapDrawdownType.trim() || undefined,
        daysUsed: snapDaysUsed.trim() ? Number(snapDaysUsed) : undefined,
        daysRemaining: snapDaysRemaining.trim()
          ? Number(snapDaysRemaining)
          : undefined,
        remainingDrawdown,
      } as any);

      await loadSnapshot(account.id, account.phase, selectedISO);

      flashToast("Snapshot saved");
    } catch (e: any) {
      flashToast(e?.message || "Snapshot save failed");
    }
  }

  async function loadChecklist(accountId: string, phaseNow: FirmPhase, dateISO: string) {
    const existingDay = await getDailyChecklist(accountId, dateISO);
    if (existingDay) {
      setPreItems(existingDay.pre || []);
      setPostItems(existingDay.post || []);
    } else {
      const tpl = defaultChecklistTemplate(phaseNow);
      setPreItems(tpl.pre);
      setPostItems(tpl.post);
    }
  }

  async function loadExecution(accountId: string, phaseNow: FirmPhase, dateISO: string) {
    const ex = await ensureExecutionDay({ accountId, date: dateISO, phaseAtTime: phaseNow });
    setExec(ex);
    setExecNotes(ex.notes ?? "");

    const [hist, streak] = await Promise.all([
      listExecutionDaysForAccount(accountId, { limit: 14 }),
      getPhaseStreak({ accountId, phase: phaseNow }),
    ]);

    setExecHistory(hist);
    setPhaseStreak(streak);
  }

  async function loadSnapshot(accountId: string, phaseNow: FirmPhase, dateISO: string) {
    const s = await getSnapshotDb(accountId, dateISO);
    setSnapshot(s);

    if (!s) {
      setGuidance(null);
      setSnapBalance("");
      setSnapMaxLossThreshold("");
      setSnapDrawdownType("");
      setSnapDaysUsed("");
      setSnapDaysRemaining("");
      return;
    }

    const balance = Number((s as any).balance ?? NaN);
    const maxLossThreshold = Number(
      (s as any).maxLossThreshold ?? (s as any).max_loss_threshold ?? NaN
    );

    setSnapBalance(
      Number.isFinite(balance) ? String(balance) : String((s as any).balance ?? "")
    );
    setSnapMaxLossThreshold(
      Number.isFinite(maxLossThreshold)
        ? String(maxLossThreshold)
        : String(
            (s as any).maxLossThreshold ?? (s as any).max_loss_threshold ?? ""
          )
    );

    setSnapDrawdownType(
      String((s as any).drawdownType ?? (s as any).drawdown_type ?? "")
    );
    setSnapDaysUsed((s as any).daysUsed == null ? "" : String((s as any).daysUsed));
    setSnapDaysRemaining(
      (s as any).daysRemaining == null ? "" : String((s as any).daysRemaining)
    );

    try {
      const remainingDrawdown =
        Number.isFinite(balance) && Number.isFinite(maxLossThreshold)
          ? balance - maxLossThreshold
          : 0;

      const snapshotForGuidance: any = { ...(s as any), remainingDrawdown };

      const g = computeDailyGuidance({
        phase: phaseNow,
        snapshot: snapshotForGuidance,
        recentSnapshots: [],
      } as any);

      setGuidance(g);
    } catch {
      setGuidance(null);
    }
  }

  async function loadSelectedDay(accountId: string, phaseNow: FirmPhase, dateISO: string) {
    await Promise.all([
      loadChecklist(accountId, phaseNow, dateISO),
      loadExecution(accountId, phaseNow, dateISO),
      loadSnapshot(accountId, phaseNow, dateISO),
    ]);
  }

  async function loadDiscordStatus(firmSlugNow: string, phaseNow: FirmPhase) {
    try {
      setDiscordError("");
      const rec = await getDiscordMembershipForScope(firmSlugNow, phaseNow);

      if (!rec) {
        setDiscordStatus("none");
        return;
      }

      if (rec.status === "pending") setDiscordStatus("pending");
      else if (rec.status === "approved") setDiscordStatus("approved");
      else setDiscordStatus("denied");

      if (rec.discordHandle) setDiscordHandle(rec.discordHandle);
    } catch (e: any) {
      setDiscordError(e?.message || "Failed to load Discord status");
      setDiscordStatus("none");
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const a = await getAccountDb(id);
        if (cancelled) return;

        setAccount(a);
        if (!a) return;
        await loadDiscordStatus(a.firmSlug, a.phase);

        setName(a.name || "");
        setFirmSlug(a.firmSlug || "topstep");
        setAccountType(a.accountType || "");
        setAccountNumber(a.accountNumber || "");
        setPhase(a.phase);
        setStatus(a.status ?? "active");

        const ws = getWeekStartISO();
        setWeekStart(ws);
        const existing = getRoadmapWeek(a.id, ws);
        if (existing) {
          setRmObjective(existing.objective || "");
          setRmConstraints(listToLines(existing.constraints || []));
          setRmOperatingPlan(listToLines(existing.operatingPlan || []));
          setRmCompletion(listToLines(existing.completionCriteria || []));
        } else {
          const tpl = defaultRoadmapTemplate(a.phase);
          setRmObjective(tpl.objective);
          setRmConstraints(listToLines(tpl.constraints));
          setRmOperatingPlan(listToLines(tpl.operatingPlan));
          setRmCompletion(listToLines(tpl.completionCriteria));
        }

        const t = getTodayISO();
        setTodayISO(t);
        setSelectedISO(t);

        await loadSelectedDay(a.id, a.phase, t);
      } catch (e: any) {
        if (cancelled) return;
        flashToast(e?.message || "Load failed");
        setAccount(null);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Tab sync from URL (?tab=discord, etc.)
  useEffect(() => {
    const t = searchParams.get("tab");
    if (!t) return;
    if (t === "discord") setTab("discord");
    if (t === "playbooks") setTab("playbooks");
    if (t === "rules") setTab("rules");
    if (t === "checklists") setTab("checklists");
    if (t === "roadmap") setTab("roadmap");
    if (t === "today") setTab("today");
    if (t === "settings") setTab("settings");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // When a different day is selected, load that day’s checklist + execution.
  useEffect(() => {
    (async () => {
      try {
        if (!account) return;
        await loadSelectedDay(account.id, account.phase, selectedISO);
      } catch {
        // ignore
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedISO, account?.id, account?.phase]);

  // Refresh on focus (but do not forcibly override a past-day selection).
  useEffect(() => {
    const onFocus = async () => {
      try {
        if (!account) return;

        const newToday = getTodayISO();
        const prevToday = todayISO;

        setTodayISO(newToday);

        if (selectedISO === prevToday) setSelectedISO(newToday);

        await loadSelectedDay(
          account.id,
          account.phase,
          selectedISO === prevToday ? newToday : selectedISO
        );
      } catch {
        // ignore
      }
    };

    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, todayISO, selectedISO]);

  const firmDisplayName = useMemo(() => titleizeFirm(firmSlug), [firmSlug]);

  const phaseMeta = useMemo(() => {
    const p = PHASES.find((x) => x.value === phase);
    return p ?? PHASES[1];
  }, [phase]);

  const execByDate = useMemo(() => {
    const m: Record<string, ExecutionDay | undefined> = {};
    for (const d of execHistory) m[d.date] = d;
    if (exec) m[exec.date] = exec;
    return m;
  }, [execHistory, exec]);

  if (!account) {
    return (
      <main className="min-h-screen bg-[#070A14] text-white">
        <div className="mx-auto max-w-4xl px-6 py-12 md:px-10">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            Account not found.
            <div className="mt-4">
              <Link href="/dashboard" className="font-semibold text-amber-400 hover:text-amber-300">
                Back to dashboard →
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const saveSettings = async () => {
    try {
      const next = await updateAccountDb(id, {
        name: (name || "").trim() || account.name,
        firmSlug: (firmSlug || "").trim().toLowerCase(),
        accountType: accountType.trim() || undefined,
        accountNumber: accountNumber.trim() || undefined,
        phase,
        status: status ?? "active",
      });

      setAccount(next);

      setName(next.name);
      setFirmSlug(next.firmSlug);
      setAccountType(next.accountType || "");
      setAccountNumber(next.accountNumber || "");
      setPhase(next.phase);
      setStatus(next.status ?? "active");

      await loadSelectedDay(next.id, next.phase, selectedISO);

      flashToast("Saved");
    } catch (e: any) {
      flashToast(e?.message || "Save failed");
    }
  };

  const saveRoadmapWeek = () => {
    const saved = upsertRoadmapWeek({
      accountId: account.id,
      weekStart,
      objective: (rmObjective || "").trim(),
      constraints: linesToList(rmConstraints),
      operatingPlan: linesToList(rmOperatingPlan),
      completionCriteria: linesToList(rmCompletion),
    });

    setRmObjective(saved.objective);
    setRmConstraints(listToLines(saved.constraints));
    setRmOperatingPlan(listToLines(saved.operatingPlan));
    setRmCompletion(listToLines(saved.completionCriteria));

    flashToast("Roadmap saved");
  };

  const resetRoadmapToTemplate = () => {
    const tpl = defaultRoadmapTemplate(account.phase);
    setRmObjective(tpl.objective);
    setRmConstraints(listToLines(tpl.constraints));
    setRmOperatingPlan(listToLines(tpl.operatingPlan));
    setRmCompletion(listToLines(tpl.completionCriteria));
    flashToast("Template loaded");
  };

  const toggle = (
    items: ChecklistItem[],
    setItems: (x: ChecklistItem[]) => void,
    itemId: string
  ) => {
    setItems(items.map((it) => (it.id === itemId ? { ...it, done: !it.done } : it)));
  };

  const resetChecklistToTemplate = () => {
    const tpl = defaultChecklistTemplate(account.phase);
    setPreItems(tpl.pre);
    setPostItems(tpl.post);
    flashToast("Template loaded");
  };

  const saveChecklistSelectedDay = async () => {
    try {
      const saved = await upsertDailyChecklist({
        accountId: account.id,
        date: selectedISO,
        pre: preItems,
        post: postItems,
      });

      setPreItems(saved.pre);
      setPostItems(saved.post);
      flashToast("Checklist saved");
    } catch (e: any) {
      flashToast(e?.message || "Checklist save failed");
    }
  };

  const preDone = preItems.length > 0 && preItems.every((x) => x.done);
  const postDone = postItems.length > 0 && postItems.every((x) => x.done);
  const intentLocked = !!exec?.completed;

  return (
    <main className="min-h-screen bg-[#070A14] text-white">
      <Toast show={toast.show} text={toast.text} />

      <div className="mx-auto max-w-5xl px-6 py-10 md:px-10">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/55">Account</div>
            <h1 className="mt-1 truncate text-3xl font-semibold tracking-tight text-white">
              {account.name}
            </h1>
            <p className="mt-2 text-sm text-white/65">
              {titleizeFirm(account.firmSlug)} · {titleCase(account.phase)}
              {account.accountType ? ` · ${account.accountType}` : ""}
              {account.accountNumber ? ` · #${account.accountNumber}` : ""}
            </p>

            <div className="mt-3 text-xs text-white/55">
              Status: <span className="font-semibold text-white">{account.status ?? "active"}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Back
            </Link>

            <button
              type="button"
              onClick={() => setTab("settings")}
              className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300"
            >
              Settings
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex flex-wrap gap-2">
          <TabButton active={tab === "today"} onClick={() => setTab("today")}>
            Today
          </TabButton>
          <TabButton active={tab === "roadmap"} onClick={() => setTab("roadmap")}>
            Roadmap
          </TabButton>
          <TabButton active={tab === "playbooks"} onClick={() => setTab("playbooks")}>
            Playbooks
          </TabButton>
          <TabButton active={tab === "rules"} onClick={() => setTab("rules")}>
            Rules
          </TabButton>
          <TabButton active={tab === "checklists"} onClick={() => setTab("checklists")}>
            Checklists
          </TabButton>
          <TabButton active={tab === "discord"} onClick={() => setTab("discord")}>
            Discord
          </TabButton>
        </div>

        {/* Content */}
        <div className="mt-6">
          {tab === "today" ? (
            <div className="space-y-4">
              <DayStrip
                todayISO={todayISO}
                selectedISO={selectedISO}
                setSelectedISO={setSelectedISO}
                byDate={execByDate}
              />

              {/* Snapshot + Daily Guidance */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">Daily guidance</div>
                    <div className="mt-1 text-sm text-white/65">
                      Selected day:{" "}
                      <span className="font-mono font-semibold text-white/85">{selectedISO}</span>
                    </div>
                    <div className="mt-1 text-xs text-white/55">
                      Guidance requires a daily snapshot (balance + max loss threshold).
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {snapshot ? (
                      <span className="inline-flex rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/25">
                        Snapshot saved
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 ring-1 ring-white/10">
                        Snapshot missing
                      </span>
                    )}
                  </div>
                </div>

                {!snapshot ? (
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <label className="block">
                      <div className="text-xs font-semibold text-white/70">Current balance</div>
                      <input
                        value={snapBalance}
                        onChange={(e) => setSnapBalance(e.target.value)}
                        inputMode="decimal"
                        placeholder="e.g. 50300"
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:ring-2 focus:ring-amber-400/30"
                      />
                    </label>

                    <label className="block">
                      <div className="text-xs font-semibold text-white/70">
                        Max loss threshold (from firm dashboard)
                      </div>
                      <input
                        value={snapMaxLossThreshold}
                        onChange={(e) => setSnapMaxLossThreshold(e.target.value)}
                        inputMode="decimal"
                        placeholder="e.g. 50000"
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:ring-2 focus:ring-amber-400/30"
                      />
                      <div className="mt-1 text-[11px] text-white/55">
                        Remaining drawdown (calculated):{" "}
                        <span className="font-semibold text-white">
                          {(() => {
                            const b = Number(snapBalance);
                            const t = Number(snapMaxLossThreshold);
                            if (!Number.isFinite(b) || !Number.isFinite(t)) return "—";
                            return String(b - t);
                          })()}
                        </span>
                      </div>
                    </label>

                    <label className="block">
                      <div className="text-xs font-semibold text-white/70">Drawdown type (if known)</div>
                      <input
                        value={snapDrawdownType}
                        onChange={(e) => setSnapDrawdownType(e.target.value)}
                        placeholder="e.g. Trailing drawdown"
                        className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:ring-2 focus:ring-amber-400/30"
                      />
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block">
                        <div className="text-xs font-semibold text-white/70">Days used (optional)</div>
                        <input
                          value={snapDaysUsed}
                          onChange={(e) => setSnapDaysUsed(e.target.value)}
                          inputMode="numeric"
                          placeholder="e.g. 7"
                          className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:ring-2 focus:ring-amber-400/30"
                        />
                      </label>

                      <label className="block">
                        <div className="text-xs font-semibold text-white/70">Days remaining (optional)</div>
                        <input
                          value={snapDaysRemaining}
                          onChange={(e) => setSnapDaysRemaining(e.target.value)}
                          inputMode="numeric"
                          placeholder="e.g. 2"
                          className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:ring-2 focus:ring-amber-400/30"
                        />
                      </label>
                    </div>

                    <div className="md:col-span-2 flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="text-xs text-white/55">
                        Stored by date. Never visualized as P&amp;L.
                      </div>

                      <button
                        type="button"
                        onClick={saveSnapshotForSelectedDay}
                        className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300"
                      >
                        Save snapshot & view guidance
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 grid gap-4 md:grid-cols-3">
                    <div className="md:col-span-2 rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-white/55">
                        Guidance
                      </div>

                      <div className="mt-2 text-sm font-semibold text-white">
                        {(guidance as any)?.summary ??
                          (guidance as any)?.paragraph ??
                          "—"}
                      </div>

                      {(guidance as any)?.bullets?.length ? (
                        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/80">
                          {(guidance as any).bullets.slice(0, 2).map((b: string, i: number) => (
                            <li key={`${b}-${i}`}>{b}</li>
                          ))}
                        </ul>
                      ) : null}

                      <div className="mt-3 text-xs text-white/55">
                        Constraint-aware guidance. No signals. No predictions.
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-white/55">
                          Account state
                        </div>
                        <div className="mt-2 text-sm font-semibold text-white">
                          {titleizeFirm(account.firmSlug)} · {titleCase(account.phase)}
                        </div>
                        <div className="mt-2 text-xs text-white/65">
                          Snapshot: <span className="font-semibold text-white">Entered</span>
                        </div>
                        <div className="mt-1 text-xs text-white/65">
                          Date:{" "}
                          <span className="font-mono font-semibold text-white/85">{selectedISO}</span>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                        <div className="text-xs font-semibold uppercase tracking-wide text-white/55">
                          Enforcement
                        </div>
                        <div className="mt-2 text-xs text-white/65">
                          The point is behavior under constraints, not discussion.
                        </div>
                        <button
                          type="button"
                          onClick={() => setTab("discord")}
                          className="mt-3 w-full rounded-xl bg-amber-400 px-3 py-2 text-xs font-semibold text-black hover:bg-amber-300"
                        >
                          Discord access →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Operating surface */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-sm font-semibold text-white">Operating surface</div>
                <div className="mt-2 text-sm text-white/65">
                  Intent → checklist → closeout. Keep it phase-correct.
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-white/55">
                      Phase objective
                    </div>
                    <div className="mt-2 text-sm font-semibold text-white">
                      {phaseObjective(account.phase)}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-white/55">
                      Primary risk
                    </div>
                    <div className="mt-2 text-sm font-semibold text-white">
                      {primaryRisk(account.phase)}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-white/55">
                      Operating posture
                    </div>
                    <div className="mt-2 text-sm font-semibold text-white">
                      {operatingPosture(account.phase)}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setTab("checklists")}
                    className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300"
                  >
                    Open checklist →
                  </button>
                  <Link

  href={`/firms/${account.firmSlug}/phases/playbooks/${account.phase}`}
  className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300"
>
  Open playbook →
</Link>


                </div>

                <div className="mt-4 text-xs text-white/55">
                  No signals. No trade calls. No guarantees.
                </div>
              </div>

              {/* Execution status */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">Execution status</div>
                    <div className="mt-1 text-sm text-white/65">
                      Selected day:{" "}
                      <span className="font-mono font-semibold text-white/85">{selectedISO}</span>
                    </div>
                  </div>

                  <div className="text-right text-xs text-white/55">
                    <div>Streak (this phase)</div>
                    <div className="mt-1 text-lg font-semibold text-white">{phaseStreak}</div>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-xs font-semibold text-white/55">Day status</div>
                    <div className="mt-1 text-sm font-semibold text-white">{selectedISO}</div>
                    <div className="mt-1 text-xs text-white/60">
                      {exec?.completed
                        ? "Closed out"
                        : exec?.intent
                        ? exec.intent === "trade"
                          ? "Trade day"
                          : "No-trade day"
                        : "Not started"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs font-semibold text-white/55">Set intent</div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={intentLocked}
                        onClick={async () => {
                          try {
                            const next = await setDayIntent({
                              accountId: account.id,
                              date: selectedISO,
                              phaseAtTime: account.phase,
                              intent: "trade",
                            });
                            setExec(next);
                            setExecNotes(next.notes ?? "");
                            await loadExecution(account.id, account.phase, selectedISO);
                            flashToast("Trade day set");
                          } catch (e: any) {
                            flashToast(e?.message || "Failed");
                          }
                        }}
                        className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                          intentLocked
                            ? "cursor-not-allowed bg-white/10 text-white/40"
                            : exec?.intent === "trade"
                            ? "bg-amber-400 text-black"
                            : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                        }`}
                        title={intentLocked ? "Day is closed. Intent is locked." : "Set trade intent"}
                      >
                        Trade day
                      </button>

                      <button
                        type="button"
                        disabled={intentLocked}
                        onClick={async () => {
                          try {
                            const next = await setDayIntent({
                              accountId: account.id,
                              date: selectedISO,
                              phaseAtTime: account.phase,
                              intent: "no_trade",
                            });
                            setExec(next);
                            setExecNotes(next.notes ?? "");
                            await loadExecution(account.id, account.phase, selectedISO);
                            flashToast("No-trade day set");
                          } catch (e: any) {
                            flashToast(e?.message || "Failed");
                          }
                        }}
                        className={`rounded-xl px-3 py-2 text-xs font-semibold ${
                          intentLocked
                            ? "cursor-not-allowed bg-white/10 text-white/40"
                            : exec?.intent === "no_trade"
                            ? "bg-amber-400 text-black"
                            : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
                        }`}
                        title={intentLocked ? "Day is closed. Intent is locked." : "Set no-trade intent"}
                      >
                        No-trade day
                      </button>
                    </div>
                    <div className="mt-2 text-xs text-white/55">
                      {intentLocked ? "Intent is locked after closeout." : "No-trade can be correct execution."}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="text-xs font-semibold text-white/55">Closeout</div>
                    <div className="mt-2 text-xs text-white/65">
                      Close out to complete the day and preserve streak logic.
                    </div>

                    {exec?.completed ? (
                      <div className="mt-3 inline-flex rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/25">
                        Closed
                      </div>
                    ) : (
                      <div className="mt-3 inline-flex rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-200 ring-1 ring-amber-400/25">
                        Open
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => setTab("checklists")}
                      className="mt-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
                    >
                      Open closeout →
                    </button>
                  </div>
                </div>

                {/* History */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-white/55">
                        Recent history
                      </div>
                      <div className="mt-1 text-sm font-semibold text-white">
                        Execution history (this account)
                      </div>
                    </div>
                    <div className="text-xs text-white/55">Missing closeout breaks streak.</div>
                  </div>

                  <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                    <div className="grid grid-cols-12 gap-2 bg-white/5 px-3 py-2 text-[11px] font-semibold text-white/60">
                      <div className="col-span-3">Date</div>
                      <div className="col-span-3">Intent</div>
                      <div className="col-span-4">Closeout</div>
                      <div className="col-span-2 text-right">Status</div>
                    </div>

                    <div className="divide-y divide-white/10">
                      {execHistory.length ? (
                        execHistory.slice(0, 7).map((d: ExecutionDay) => (
                          <div
                            key={`${d.accountId}-${d.date}`}
                            className={`grid grid-cols-12 gap-2 px-3 py-2 text-xs ${
                              d.date === selectedISO ? "bg-white/5" : "bg-transparent"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setSelectedISO(d.date)}
                              className="col-span-3 text-left font-semibold text-white hover:underline"
                              title="Select day"
                            >
                              {d.date}
                            </button>
                            <div className="col-span-3 text-white/70">{intentLabel(d.intent)}</div>
                            <div className="col-span-4 text-white/70">{classificationLabel(d.classification)}</div>
                            <div className="col-span-2 text-right">
                              {d.completed ? (
                                <span className="inline-flex rounded-full bg-emerald-400/15 px-2 py-1 text-[11px] font-semibold text-emerald-200 ring-1 ring-emerald-400/25">
                                  Closed
                                </span>
                              ) : (
                                <span className="inline-flex rounded-full bg-amber-400/15 px-2 py-1 text-[11px] font-semibold text-amber-200 ring-1 ring-amber-400/25">
                                  Open
                                </span>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-3 text-xs text-white/60">
                          No history yet. Close out a day to start the streak.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-white/55">
                    Execution only. No trades. No P&amp;L. No journaling.
                  </div>
                </div>
              </div>

              {/* Account context */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-sm font-semibold text-white">Account context</div>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-xs font-semibold text-white/55">Firm</div>
                    <div className="mt-1 text-sm font-semibold text-white">
                      {titleizeFirm(account.firmSlug)}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-xs font-semibold text-white/55">Phase</div>
                    <div className="mt-1 text-sm font-semibold text-white">
                      {titleCase(account.phase)}
                    </div>
                    <div className="mt-1 text-xs text-white/60">{phaseMeta.note}</div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {tab === "roadmap" ? (
            <div className="space-y-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">Roadmap (this week)</div>
                    <div className="mt-1 text-sm text-white/65">
                      Week of <span className="font-semibold text-white/85">{weekStart}</span> · scoped
                      to this account · no journaling
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={resetRoadmapToTemplate}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                    >
                      Load template
                    </button>
                    <button
                      type="button"
                      onClick={saveRoadmapWeek}
                      className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-white/55">
                  This week’s objective
                </div>
                <textarea
                  value={rmObjective}
                  onChange={(e) => setRmObjective(e.target.value)}
                  rows={2}
                  className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-amber-400/30"
                />
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-white/55">
                  Constraints
                </div>
                <div className="mt-2 text-sm text-white/65">
                  One per line. Behavioral constraints only.
                </div>
                <textarea
                  value={rmConstraints}
                  onChange={(e) => setRmConstraints(e.target.value)}
                  rows={5}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-amber-400/30"
                />
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-white/55">
                  Operating plan
                </div>
                <div className="mt-2 text-sm text-white/65">
                  One per line. No setups, no signals, no trade calls.
                </div>
                <textarea
                  value={rmOperatingPlan}
                  onChange={(e) => setRmOperatingPlan(e.target.value)}
                  rows={6}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-amber-400/30"
                />
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-white/55">
                  Completion criteria
                </div>
                <div className="mt-2 text-sm text-white/65">
                  One per line. Clear “done” conditions.
                </div>
                <textarea
                  value={rmCompletion}
                  onChange={(e) => setRmCompletion(e.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-amber-400/30"
                />
              </div>
            </div>
          ) : null}

          {tab === "playbooks" ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold text-white">Playbooks</div>
              <div className="mt-2 text-sm text-white/65">
                Real playbooks live in the firm + phase library. This tab is a route target (from the dashboard)
                but does not operate the playbook system itself.
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
  <Link
    href={`/firms/${account.firmSlug}/phases/playbooks/${account.phase}`}
    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
  >
    Open playbooks →
  </Link>

  <Link
    href={`/firms/${account.firmSlug}/phases`}
    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
  >
    View phases →
  </Link>
</div>

            </div>
          ) : null}

          {tab === "rules" ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold text-white">Rules</div>
              <div className="mt-2 text-sm text-white/65">
                Rule education and rule changes are handled in dedicated surfaces. This tab exists for continuity
                but does not alter rule logic.
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/rule-changes"
                  className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300"
                >
                  Rule changes →
                </Link>
                <Link
                  href={`/firms/${account.firmSlug}/rules`}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Firm rules →
                </Link>
              </div>
            </div>
          ) : null}

          {tab === "checklists" ? (
            <div className="space-y-4">
              <DayStrip
                todayISO={todayISO}
                selectedISO={selectedISO}
                setSelectedISO={setSelectedISO}
                byDate={execByDate}
              />

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">Checklists</div>
                    <div className="mt-1 text-sm text-white/65">
                      <span className="font-semibold text-white/85">{selectedISO}</span> · scoped to this
                      account · no journaling
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={resetChecklistToTemplate}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                    >
                      Load template
                    </button>
                    <button
                      type="button"
                      onClick={saveChecklistSelectedDay}
                      className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">Pre-session</div>
                    <div className="mt-1 text-sm text-white/65">
                      Done = allowed to trade. Not done = guessing.
                    </div>
                  </div>
                  {preDone ? (
                    <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/25">
                      Complete
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 grid gap-3">
                  {preItems.map((it) => (
                    <ChecklistRow
                      key={it.id}
                      item={it}
                      onToggle={() => toggle(preItems, setPreItems, it.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-white">Post-session</div>
                    <div className="mt-1 text-sm text-white/65">
                      No journaling. Confirm you stayed inside the rules.
                    </div>
                  </div>
                  {postDone ? (
                    <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/25">
                      Complete
                    </span>
                  ) : null}
                </div>

                <div className="mt-4 grid gap-3">
                  {postItems.map((it) => (
                    <ChecklistRow
                      key={it.id}
                      item={it}
                      onToggle={() => toggle(postItems, setPostItems, it.id)}
                    />
                  ))}
                </div>
              </div>

              {/* Close out day */}
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <div className="text-sm font-semibold text-white">Close out day</div>
                <div className="mt-1 text-sm text-white/65">
                  Selected day:{" "}
                  <span className="font-mono font-semibold text-white/85">{selectedISO}</span>
                </div>

                {exec?.completed ? (
                  <div className="mt-3 inline-flex rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/25">
                    Day closed out
                  </div>
                ) : (
                  <div className="mt-3 inline-flex rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-200 ring-1 ring-amber-400/25">
                    Day open
                  </div>
                )}

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  {(
                    [
                      ["good_execution", "Good execution day"],
                      ["rule_safe_no_trade", "Rule-safe no-trade day"],
                      ["increased_future_risk", "Increased future risk"],
                    ] as [DayClassification, string][]
                  ).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      disabled={!postDone || !!exec?.completed}
                      onClick={async () => {
                        try {
                          const next = await closeOutDay({
                            accountId: account.id,
                            date: selectedISO,
                            phaseAtTime: account.phase,
                            classification: key,
                            notes: execNotes,
                          });

                          setExec(next);
                          setExecNotes(next.notes ?? "");

                          await loadExecution(account.id, account.phase, selectedISO);

                          flashToast("Day closed out");
                          setTab("today");
                        } catch (e: any) {
                          flashToast(e?.message || "Closeout failed");
                        }
                      }}
                      className={`rounded-2xl border px-4 py-3 text-left text-sm font-semibold ${
                        postDone && !exec?.completed
                          ? "border-white/10 bg-white/5 text-white hover:bg-white/10"
                          : "border-white/10 bg-black/20 text-white/40"
                      }`}
                      title={
                        exec?.completed
                          ? "Day already closed"
                          : postDone
                          ? "Close out day"
                          : "Complete post-session first"
                      }
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="text-xs font-semibold text-white/70">Notes (optional)</div>
                  <textarea
                    value={execNotes}
                    onChange={(e) => setExecNotes(e.target.value)}
                    rows={3}
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:ring-2 focus:ring-amber-400/30"
                    placeholder="Short note for yourself (optional)."
                  />
                </div>

                <div className="mt-3 text-xs text-white/55">
                  Post-session must be complete before closeout buttons unlock. Intent locks after closeout.
                </div>
              </div>
            </div>
          ) : null}

          {tab === "discord" ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm font-semibold text-white">Discord access</div>
                  <div className="mt-1 text-sm text-white/65">
                    Request access to the firm + phase room for this account. v0 is manual review (auditable).
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2 sm:mt-0">
                  <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 ring-1 ring-white/10">
                    Firm: <span className="ml-1 text-white">{account.firmSlug}</span>
                  </span>
                  <span className="inline-flex items-center rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 ring-1 ring-white/10">
                    Phase: <span className="ml-1 text-white">{titleCase(account.phase)}</span>
                  </span>
                </div>
              </div>

              <div className="mt-5">
                <div className="text-xs font-semibold text-white/70">Status</div>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  {discordStatus === "approved" ? (
                    <span className="inline-flex rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200 ring-1 ring-emerald-400/25">
                      Approved
                    </span>
                  ) : discordStatus === "pending" ? (
                    <span className="inline-flex rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-200 ring-1 ring-amber-400/25">
                      Pending review
                    </span>
                  ) : discordStatus === "denied" ? (
                    <span className="inline-flex rounded-full bg-rose-400/15 px-3 py-1 text-xs font-semibold text-rose-200 ring-1 ring-rose-400/25">
                      Denied
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 ring-1 ring-white/10">
                      Not requested
                    </span>
                  )}
                </div>

                <div className="mt-3 text-sm text-white/65">
                  {discordStatus === "approved" ? (
                    <>
                      <div>
                        Access is granted by role. If you don’t see the room yet, wait a few minutes after approval.
                      </div>

                      <div className="mt-2">
                        Next: open the firm + phase room and post availability in{" "}
                        <span className="font-semibold text-white">#accountability-lfg</span>.
                      </div>
                    </>
                  ) : discordStatus === "pending" ? (
                    <>Your request is in the Admin Inbox for manual review.</>
                  ) : discordStatus === "denied" ? (
                    <>
                      This request was denied. If you believe this is incorrect, contact support/admin and include your handle.
                    </>
                  ) : (
                    <>Submit your Discord handle to request access. You’ll be granted a firm+phase role when approved.</>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="text-xs font-semibold text-white/70">Discord handle</label>
                <input
                  value={discordHandle}
                  onChange={(e) => setDiscordHandle(e.target.value)}
                  disabled={discordStatus !== "none" || discordSubmitting}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/35 focus:ring-2 focus:ring-amber-400/30 disabled:bg-white/5 disabled:text-white/50"
                  placeholder="@yourname"
                />
                <div className="mt-2 text-xs text-white/55">
                  Use the exact handle you want whitelisted for this firm+phase role.
                </div>
              </div>

              {discordError ? (
                <div className="mt-4 rounded-2xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
                  {discordError}
                </div>
              ) : null}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  disabled={discordStatus !== "none" || discordSubmitting || !discordHandle.trim()}
                  onClick={async () => {
                    try {
                      setDiscordError("");

                      const handle = discordHandle.trim();
                      if (!handle) {
                        setDiscordError("Please enter your Discord handle.");
                        return;
                      }

                      setDiscordSubmitting(true);

                      await requestDiscordAccess({
                        firmSlug: account.firmSlug,
                        phase: account.phase,
                        discordHandle: handle,
                        accountId: account.id,
                      });

                      await loadDiscordStatus(account.firmSlug, account.phase);
                      flashToast("Request submitted");
                    } catch (e: any) {
                      setDiscordError(e?.message || "Request failed");
                    } finally {
                      setDiscordSubmitting(false);
                    }
                  }}
                  className="inline-flex items-center justify-center rounded-2xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {discordSubmitting ? "Submitting..." : "Request access"}
                </button>

                <div className="text-xs text-white/55">
                  Manual lifecycle: request → admin review → role assigned → approved.
                </div>
              </div>
            </div>
          ) : null}

          {tab === "settings" ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold text-white">Settings</div>
              <div className="mt-2 text-sm text-white/65">
                Edit account metadata. No trades, no P&amp;L, no journaling.
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-xs font-semibold text-white/70">Account name</div>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-amber-400/30"
                  />
                </div>

                <div>
                  <div className="text-xs font-semibold text-white/70">Firm</div>
                  <input
                    value={firmSlug}
                    onChange={(e) => setFirmSlug(e.target.value.trim().toLowerCase())}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-amber-400/30"
                  />
                  <div className="mt-1 text-xs text-white/55">
                    Display: <span className="font-semibold text-white">{firmDisplayName}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-white/70">Account type (optional)</div>
                  <input
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-amber-400/30"
                  />
                </div>

                <div>
                  <div className="text-xs font-semibold text-white/70">Account number (optional)</div>
                  <input
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-amber-400/30"
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs font-semibold text-white/70">Phase</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PHASES.map((p) => (
                    <button
                      key={p.value}
                      type="button"
                      onClick={() => setPhase(p.value)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        phase === p.value
                          ? "border-amber-400 bg-amber-400 text-black"
                          : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs font-semibold text-white/70">Status</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(["active", "paused", "archived"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                        status === s
                          ? "border-amber-400 bg-amber-400 text-black"
                          : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={saveSettings}
                  className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-300"
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await deleteAccountDb(id);
                      router.push("/dashboard");
                    } catch (e: any) {
                      flashToast(e?.message || "Delete failed");
                    }
                  }}
                  className="rounded-xl border border-rose-400/25 bg-rose-400/10 px-5 py-3 text-sm font-semibold text-rose-200 hover:bg-rose-400/15"
                >
                  Delete account
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
