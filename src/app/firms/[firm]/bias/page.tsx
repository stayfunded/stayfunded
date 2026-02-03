// src/app/firms/[firm]/bias/page.tsx

import Link from "next/link";

function toTitle(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function BiasPage({ params }: { params: { firm: string } }) {
  const firm = params.firm;
  const firmName = toTitle(firm);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-slate-950 px-6 py-6 text-white">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-medium tracking-wider text-slate-300">
              {firmName} · SESSION BIAS CONSOLE
            </div>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              Structured session framing
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              A way to define “what I’m allowed to do today” without market
              calls. You control the inputs.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/firms/${firm}`}
              className="rounded-xl bg-white/10 px-3 py-2 text-sm font-medium text-white ring-1 ring-white/15 hover:bg-white/15"
            >
              ← Back to Hub
            </Link>
            <Link
              href={`/firms/${firm}/checklists`}
              className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-100"
            >
              Daily Checklist
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="text-sm font-semibold text-slate-950">
          Console (placeholder)
        </div>
        <p className="mt-2 max-w-3xl text-sm text-slate-600">
          Next: add inputs (session, risk posture, “no-trade conditions”) and
          output (allowed playbook + max risk suggestion).
        </p>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            Session: NY / London / Asia
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            Risk posture: Normal / Reduced / Off
          </div>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            No-trade flags: News / Chop / Fatigue
          </div>
        </div>
      </div>
    </div>
  );
}
