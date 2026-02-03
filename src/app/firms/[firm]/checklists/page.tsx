// src/app/firms/[firm]/checklists/page.tsx
import Link from "next/link";

function toTitle(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function ChecklistsPage({
  params,
}: {
  params: { firm: string };
}) {
  const firm = params.firm;
  const firmName = toTitle(firm);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-slate-950 px-6 py-6 text-white">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-medium tracking-wider text-slate-300">
              {firmName} · DAILY CHECKLISTS
            </div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              The plan execution checklist
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Short pre-session and end-of-day checks that keep your trading aligned to the
              rulebook and the phase plan.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/firms/${firm}`}
              className="rounded-xl bg-white/10 px-3 py-2 text-sm font-medium text-white ring-1 ring-white/15 hover:bg-white/15"
            >
              ← Back to Playbooks
            </Link>
            <Link
              href={`/firms/${firm}/calculators`}
              className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-100"
            >
              Open Calculators
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="text-sm font-semibold text-slate-950">
            Pre-session (5 minutes)
          </div>
          <div className="mt-2 text-sm text-slate-600">
            Goal: start the day inside a risk budget your plan can survive.
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>• I know today’s true max loss and my buffer (not the headline limit).</li>
            <li>• I know the “no-trade” conditions (news windows, volatility spikes).</li>
            <li>• I have a max contracts/shares number for my normal stop size.</li>
            <li>• I’m not trading to “catch up” from yesterday.</li>
            <li>• I know the one behavior I must avoid today (my most common failure loop).</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="text-sm font-semibold text-slate-950">
            End-of-day (2 minutes)
          </div>
          <div className="mt-2 text-sm text-slate-600">
            Goal: protect eligibility by making tomorrow easier than today.
          </div>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li>• I stopped when my plan said stop (not when I “felt better”).</li>
            <li>• I did not touch the hard limits or drift into rule contact.</li>
            <li>• I captured one failure mode + one improvement for tomorrow.</li>
            <li>• If I’m emotionally charged, tomorrow starts in reduced risk.</li>
            <li>• If I’m near any limit, tomorrow is “defense mode” by default.</li>
          </ul>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
        <div className="text-sm font-semibold text-slate-950">Use this correctly</div>
        <p className="mt-2 max-w-3xl text-sm text-slate-700">
          These checklists don’t replace a strategy. They keep execution aligned to the firm’s
          constraints so a coherent plan can play out. If you skip them, you tend to discover the
          rules by paying for them.
        </p>
      </div>
    </div>
  );
}
