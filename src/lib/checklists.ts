// src/lib/checklists.ts
import { supabase } from "@/lib/supabaseClient";
import type { FirmPhase } from "@/lib/accountsDb";

export type ChecklistItem = {
  id: string;
  label: string;
  done: boolean;
};

export type DailyChecklist = {
  accountId: string; // paths.id
  date: string; // YYYY-MM-DD
  pre: ChecklistItem[];
  post: ChecklistItem[];
  updatedAt: string; // ISO
};

function mapRowToDailyChecklist(row: any): DailyChecklist {
  return {
    accountId: row.path_id,
    date: row.date,
    pre: (row.pre ?? []) as ChecklistItem[],
    post: (row.post ?? []) as ChecklistItem[],
    updatedAt: row.updated_at,
  };
}

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  const userId = data?.user?.id;
  if (!userId) throw new Error("Not logged in.");
  return userId;
}

export function getTodayISO(d = new Date()) {
  // YYYY-MM-DD local time
  const date = new Date(d);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function item(id: string, label: string): ChecklistItem {
  return { id, label, done: false };
}

function shouldRequireBiasGate(phase: FirmPhase) {
  // Bias gate is a strategy-operating dependency, not an account-level concept.
  // It does NOT apply to Discovery.
  return phase !== "discovery";
}

function withBiasGate(phase: FirmPhase, pre: ChecklistItem[]) {
  if (!shouldRequireBiasGate(phase)) return pre;

  const biasGate = item(
    "pre_bias_gate",
    "I obtained bias from the approved bias system and will only operate in-direction."
  );

  // Insert right after "pre_mode" if present, else near top.
  const idx = pre.findIndex((x) => x.id === "pre_mode");
  if (idx >= 0) {
    const copy = [...pre];
    copy.splice(idx + 1, 0, biasGate);
    return copy;
  }

  return [biasGate, ...pre];
}

/**
 * Templates are behavior-focused, phase-aware, and explicitly non-journaling.
 * No trade logs. No metrics. No “what did you trade”.
 */
export function defaultChecklistTemplate(phase: FirmPhase): {
  pre: ChecklistItem[];
  post: ChecklistItem[];
} {
  const commonPreBase: ChecklistItem[] = [
    item("pre_rules", "I know the one rule that ends this account today."),
    item("pre_loss_cap", "I will stop when eligibility is threatened (not when I feel emotional)."),
    item("pre_mode", "My operating posture matches this phase (not my mood)."),
  ];

  const commonPre: ChecklistItem[] = withBiasGate(phase, commonPreBase);

  const commonPost: ChecklistItem[] = [
    item("post_eligible", "I stayed eligible (no rule breaches)."),
    item("post_escalation", "I did not escalate after losses."),
    item("post_next", "I know the single next action for tomorrow."),
  ];

  const perPhase: Record<FirmPhase, { pre: ChecklistItem[]; post: ChecklistItem[] }> = {
    discovery: {
      pre: [
        item("pre_candidates", "I am comparing only 2–3 structures (no endless browsing)."),
        item("pre_constraints", "I am prioritizing rules and fragility over marketing."),
        item("pre_stop", "I will make one decision and stop reopening it."),
      ],
      post: [
        item("post_choice", "I moved closer to a single firm/account decision."),
        item("post_reason", "I can explain why the chosen structure is survivable for me."),
        item("post_done", "I did not re-litigate the decision loop today."),
      ],
    },
    evaluation: {
      pre: [
        item("pre_defensive", "Today is defensive: eligibility first, not speed-to-pass."),
        item("pre_variance", "I am reducing variance exposure (fewer attempts, less aggression)."),
        item("pre_no_revenge", "If I take a hit, I will not chase."),
      ],
      post: [
        item("post_behavior", "My behavior stayed stable regardless of P&L emotions."),
        item("post_stop", "I stopped when the plan said stop (not when I wanted closure)."),
        item("post_survival", "I treated survival as the win condition."),
      ],
    },
    stabilization: {
      pre: [
        item("pre_compress", "Today I compress variance (small, repeatable behavior)."),
        item("pre_no_expand", "I will not expand size or frequency because I feel confident."),
        item("pre_buffer", "My goal is buffer-building, not proving anything."),
      ],
      post: [
        item("post_boring", "I kept it boring on purpose."),
        item("post_no_creep", "I did not creep risk upward."),
        item("post_buffer", "I protected eligibility while building breathing room."),
      ],
    },
    payout: {
      pre: [
        item("pre_mechanics", "I know the payout mechanics that matter right now."),
        item("pre_no_switch", "I will not change behavior near withdrawal triggers."),
        item("pre_compliance", "Compliance is the priority; payout is the byproduct."),
      ],
      post: [
        item("post_compliance", "I stayed compliant with payout-related rules."),
        item("post_no_push", "I did not push because money felt close."),
        item("post_repeatable", "My behavior stayed repeatable and controlled."),
      ],
    },
    maintenance: {
      pre: [
        item("pre_drift", "I am watching for discipline drift (small repeated mistakes)."),
        item("pre_simple", "I will not add complexity today."),
        item("pre_process", "My only goal is consistent process execution."),
      ],
      post: [
        item("post_drift", "I did not drift into new risk patterns."),
        item("post_simple", "I kept the plan simple and repeatable."),
        item("post_review", "I reviewed the dominant failure modes for this account."),
      ],
    },
  };

  const phaseBlock = perPhase[phase] ?? perPhase.evaluation;

  return {
    pre: [...commonPre, ...phaseBlock.pre],
    post: [...commonPost, ...phaseBlock.post],
  };
}

export async function getDailyChecklist(
  accountId: string,
  date: string
): Promise<DailyChecklist | null> {
  const { data, error } = await supabase
    .from("daily_checklists")
    .select("path_id, date, pre, post, updated_at")
    .eq("path_id", accountId)
    .eq("date", date)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapRowToDailyChecklist(data) : null;
}

export async function upsertDailyChecklist(
  input: Omit<DailyChecklist, "updatedAt">
): Promise<DailyChecklist> {
  const userId = await requireUserId();

  const payload: any = {
    user_id: userId,
    path_id: input.accountId,
    date: input.date,
    pre: input.pre ?? [],
    post: input.post ?? [],
  };

  const { data, error } = await supabase
    .from("daily_checklists")
    // unique (path_id, date)
    .upsert(payload, { onConflict: "path_id,date" })
    .select("path_id, date, pre, post, updated_at")
    .single();

  if (error) throw new Error(error.message);
  return mapRowToDailyChecklist(data);
}

/**
 * Needed for the 7-day Day Strip: lets us show checklist completion per day.
 * (No new tables; uses existing daily_checklists.)
 */
export async function listDailyChecklistsForAccount(
  accountId: string,
  opts?: { limit?: number }
): Promise<DailyChecklist[]> {
  const limit = opts?.limit ?? 120;

  const { data, error } = await supabase
    .from("daily_checklists")
    .select("path_id, date, pre, post, updated_at")
    .eq("path_id", accountId)
    .order("date", { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapRowToDailyChecklist);
}
