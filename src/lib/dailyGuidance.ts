// src/lib/dailyGuidance.ts
import type { FirmPhase } from "@/lib/accountsDb";
import type { AccountSnapshot } from "@/lib/snapshotsDb";

export type GuidanceBand = "safe" | "caution" | "danger";

export type DailyGuidance = {
  band: GuidanceBand;
  paragraph: string;
  bullets: string[];
};

function fmtMoney(n: number) {
  const abs = Math.abs(n);
  const s = abs >= 1000 ? abs.toLocaleString(undefined, { maximumFractionDigits: 0 }) : abs.toFixed(0);
  return `${n < 0 ? "-" : ""}$${s}`;
}

function remainingFromSnapshot(s: any): number {
  // Back-compat if remaining_drawdown still exists (or if caller injects remainingDrawdown).
  const rd = Number(s?.remainingDrawdown ?? s?.remaining_drawdown);
  if (Number.isFinite(rd)) return rd;

  // Canonical: balance - maxLossThreshold
  const balance = Number(s?.balance);
  const thr = Number(s?.maxLossThreshold ?? s?.max_loss_threshold);
  if (Number.isFinite(balance) && Number.isFinite(thr)) return balance - thr;

  return 0;
}

function ratioBand(remaining: number, balance: number): GuidanceBand {
  // Conservative proxy: remaining drawdown relative to current balance.
  const b = Math.max(1, balance);
  const r = remaining / b;

  if (r < 0.04) return "danger";   // <4% of balance left
  if (r < 0.08) return "caution";  // 4–8%
  return "safe";                   // >8%
}

function phaseTone(phase: FirmPhase) {
  if (phase === "evaluation") return "Passing is survival, not aggression.";
  if (phase === "stabilization") return "Post-pass is a variance trap.";
  if (phase === "payout") return "Eligibility traps matter as much as markets.";
  if (phase === "maintenance") return "Slow failure is the common failure.";
  return "Selection beats improvisation.";
}

export function computeDailyGuidance(input: {
  phase: FirmPhase;
  snapshot: AccountSnapshot;
  recentSnapshots?: AccountSnapshot[]; // most recent first
}): DailyGuidance {
  const { phase, snapshot } = input;
  const recent = input.recentSnapshots ?? [];

  const remaining = remainingFromSnapshot(snapshot as any);
  const band = ratioBand(remaining, snapshot.balance);

  const today = snapshot.date;
  const dangerCountRecent = recent
    .filter((s) => s.date !== today)
    .slice(0, 6)
    .filter((s) => ratioBand(remainingFromSnapshot(s as any), s.balance) === "danger").length;

  const bullets: string[] = [];
  bullets.push(`You are ~${fmtMoney(remaining)} from max loss`);
  if (snapshot.drawdownType) bullets.push(`${String(snapshot.drawdownType)} drawdown mechanics`);

  const lowDays = (snapshot.daysRemaining ?? null) !== null && (snapshot.daysRemaining as number) <= 2;

  let paragraph = "";

  if (band === "danger") {
    paragraph =
      `This account is close to its loss boundary. At this distance, small errors end evaluations even when trades are “reasonable.” ${phaseTone(
        phase
      )}`;
    if (dangerCountRecent >= 2) {
      paragraph =
        `This account is again operating near its loss boundary. Repeated proximity increases failure risk even without obvious rule violations. The margin for error is effectively gone. ${phaseTone(
          phase
        )}`;
      bullets.push(`This is another near-boundary day (recent count: ${dangerCountRecent + 1})`);
    }
  } else if (band === "caution") {
    paragraph =
      `This account is inside a caution zone. There is still room, but mistakes compound quickly when the boundary is nearby. ${phaseTone(
        phase
      )}`;
  } else {
    paragraph =
      `This account has workable room relative to its loss boundary. The job is to keep it that way and avoid drifting into a high-risk zone. ${phaseTone(
        phase
      )}`;
  }

  if (lowDays) {
    const dr = snapshot.daysRemaining as number;
    paragraph += ` With ${dr} trading day${dr === 1 ? "" : "s"} remaining, pressure compounds mistakes.`;
  }

  const trimmedBullets = bullets.slice(0, band === "danger" && dangerCountRecent >= 2 ? 3 : 2);
  return { band, paragraph, bullets: trimmedBullets };
}
