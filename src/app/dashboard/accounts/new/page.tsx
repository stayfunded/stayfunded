// src/app/dashboard/accounts/new/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { upsertAccount, titleizeFirm, type FirmPhase } from "@/lib/accounts";

const PHASES: { value: FirmPhase; label: string; note: string }[] = [
  { value: "discovery", label: "Discovery", note: "Choosing structure before you pay for resets." },
  { value: "evaluation", label: "Evaluation", note: "Passing rules without blowing the account." },
  { value: "stabilization", label: "Stabilization", note: "Early funded survival + consistency pressure." },
  { value: "payout", label: "Payout", note: "Protecting payout eligibility + avoiding silent DQs." },
  { value: "maintenance", label: "Maintenance", note: "Long-run survival across cycles." },
];

const FIRM_CHOICES = ["topstep", "apex", "earn2trade", "take-profit-trader"] as const;

export default function NewAccountPage() {
  const router = useRouter();

  const [friendlyName, setFriendlyName] = useState("");
  const [firmSlug, setFirmSlug] = useState("topstep");
  const [accountType, setAccountType] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [phase, setPhase] = useState<FirmPhase>("evaluation");
  const [linkedGroupId, setLinkedGroupId] = useState("");
  const [notes, setNotes] = useState("");

  const firmName = useMemo(() => titleizeFirm(firmSlug), [firmSlug]);

  const canSave = useMemo(() => {
    return (friendlyName || "").trim().length > 0 && (firmSlug || "").trim().length > 0;
  }, [friendlyName, firmSlug]);

  return (
    <main className="min-h-screen bg-[#070A14] text-white">
      <div className="mx-auto max-w-3xl px-6 py-12 md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-white/55">
              Dashboard
            </div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white">
              Add account
            </h1>
            <p className="mt-2 text-sm text-white/65">
              This creates the operating context StayFunded uses for Today, Playbooks, Rules, and Checklists.
              You can refine details later.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Back
          </Link>
        </div>

        <div className="mt-8 space-y-4">
          {/* Friendly name */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold text-white">Friendly name</div>
            <p className="mt-1 text-xs text-white/55">
              What you call it day-to-day (e.g. “Apex 20-pack #3”, “Topstep Eval 50K”).
            </p>
            <input
              value={friendlyName}
              onChange={(e) => setFriendlyName(e.target.value)}
              placeholder="e.g. Apex 20-pack #3"
              className="mt-3 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:ring-2 focus:ring-amber-400/30"
            />
          </div>

          {/* Firm */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold text-white">Firm</div>
            <p className="mt-1 text-xs text-white/55">
              This determines which playbooks and rule surfaces apply.
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {FIRM_CHOICES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setFirmSlug(s)}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    firmSlug === s
                      ? "border-amber-400 bg-amber-400 text-black"
                      : "border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }`}
                >
                  {titleizeFirm(s)}
                </button>
              ))}
            </div>

            <div className="mt-3 text-xs text-white/55">
              Selected: <span className="font-semibold text-white">{firmName}</span>
            </div>
          </div>

          {/* Account details */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold text-white">Account details</div>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <div className="text-xs font-semibold text-white/70">Account type (optional)</div>
                <input
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  placeholder='e.g. "50K Eval", "PA", "XFA"'
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:ring-2 focus:ring-amber-400/30"
                />
              </div>

              <div>
                <div className="text-xs font-semibold text-white/70">Account number (optional)</div>
                <input
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="e.g. 123456"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:ring-2 focus:ring-amber-400/30"
                />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs font-semibold text-white/70">Linked group (optional)</div>
              <p className="mt-1 text-xs text-white/55">
                If you copy-trade a batch (e.g. Apex 20), give them the same group id (e.g. “apex20-jan”).
              </p>
              <input
                value={linkedGroupId}
                onChange={(e) => setLinkedGroupId(e.target.value)}
                placeholder="e.g. apex20-jan"
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:ring-2 focus:ring-amber-400/30"
              />
            </div>
          </div>

          {/* Phase */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold text-white">Phase</div>
            <p className="mt-1 text-xs text-white/55">
              Set the phase this account is currently in. This drives phase-correct guidance.
            </p>

            <div className="mt-3 space-y-2">
              {PHASES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPhase(p.value)}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    phase === p.value
                      ? "border-amber-400 bg-amber-400 text-black"
                      : "border-white/10 bg-black/20 text-white hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="font-semibold">{p.label}</div>
                    {phase === p.value ? (
                      <span className="text-xs font-semibold text-black/70">Selected</span>
                    ) : null}
                  </div>
                  <div className={`mt-1 text-sm ${phase === p.value ? "text-black/75" : "text-white/60"}`}>
                    {p.note}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-3 text-xs text-white/55">
              You can move phases later as the account progresses.
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <div className="text-sm font-semibold text-white">Notes (optional)</div>
            <p className="mt-1 text-xs text-white/55">
              Anything you want tied to the account context.
            </p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything you want to remember about this account…"
              className="mt-3 min-h-[120px] w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:ring-2 focus:ring-amber-400/30"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!canSave}
              onClick={() => {
                // NOTE: upsertAccount expects Account fields (name), not "friendlyName".
                // It returns the Account record (not { account }).
                const account = upsertAccount({
                  name: friendlyName.trim(),
                  firmSlug: firmSlug.trim().toLowerCase(),
                  accountType: accountType.trim() || undefined,
                  accountNumber: accountNumber.trim() || undefined,
                  phase,
                  linkedGroupId: linkedGroupId.trim() || undefined,
                  notes: notes.trim() || undefined,
                } as any);

                router.push(`/dashboard/accounts/${(account as any).id}`);
              }}
              className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                canSave
                  ? "bg-amber-400 text-black hover:bg-amber-300"
                  : "cursor-not-allowed bg-white/10 text-white/40"
              }`}
            >
              Save account
            </button>

            <Link
              href="/dashboard"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Cancel
            </Link>
          </div>

          <div className="pt-2 text-xs text-white/55">
            No signals. No trade calls. No guarantees.
          </div>
        </div>
      </div>
    </main>
  );
}
