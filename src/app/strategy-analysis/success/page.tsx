// src/app/strategy-analysis/success/page.tsx
import Link from "next/link";

export const dynamic = "force-dynamic";

function VisualPlaceholder() {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6">
      <div className="flex items-start justify-between gap-6 flex-col lg:flex-row">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/70">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Visual placeholder
          </div>
          <div className="mt-3 text-lg font-semibold text-white">
            What happens next (visually)
          </div>
          <p className="mt-2 text-sm text-white/70 leading-relaxed">
            This should visually communicate: your submission → analysis lens →
            next actions inside the StayFunded system (Today + Playbooks + Accountability).
          </p>

          <div className="mt-4 grid gap-2 text-sm text-white/70">
            <div className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span>Submitted</span>
            </div>
            <div className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span>Diagnose rule friction + failure points</span>
            </div>
            <div className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span>Apply it daily (Today → Playbooks → Accountability)</span>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-[620px]">
          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="aspect-[16/8] w-full rounded-lg border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent" />
            <div className="mt-3 flex items-center justify-between text-xs text-white/55">
              <span>Diagram placeholder (generate later)</span>
              <span className="font-semibold text-amber-400">16:8</span>
            </div>
          </div>

          {/* IMAGE PROMPT — generate later
              PURPOSE:
              A success-state diagram that shows: submission received -> diagnostic lens -> next actions.

              ABSOLUTE REQUIREMENTS:
              - Dark-mode premium SaaS vector illustration.
              - NO text in the image.
              - NO charts/candlesticks/PNL.
              - Calm, structured, professional.

              COMPOSITION:
              A left-to-right flow of 3 stages:
              1) A "paper/submit" icon shape (received)
              2) A "magnifier/shield" icon shape (diagnostic lens / rule friction)
              3) Three small connected blocks representing:
                 Today / Playbooks / Accountability (no labels)
              Use subtle amber highlight on stage 2.

              OUTPUT:
              - High resolution, aspect ratio 16:8.
          */}
        </div>
      </div>
    </div>
  );
}

export default function StrategyAnalysisSuccessPage({
  searchParams,
}: {
  searchParams?: { firm?: string; phase?: string };
}) {
  const firm = searchParams?.firm ?? "your prop firm";
  const phase = searchParams?.phase ?? "this phase";

  return (
    <main className="min-h-screen bg-[#070A14] text-white">
      <div className="mx-auto max-w-[980px] px-6 py-14">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/75">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Submission received
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight text-white">
            Strategy Analysis submitted
          </h1>

          <p className="mt-4 text-base text-white/75">
            We’ve received your Strategy Analysis for your{" "}
            <span className="font-semibold text-white">{firm}</span> account in the{" "}
            <span className="font-semibold text-white">{phase}</span> phase.
          </p>

          <div className="mt-5 grid gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <div className="text-sm font-semibold text-white">
                What this analysis does (and doesn’t do)
              </div>
              <ul className="mt-3 space-y-2 text-sm text-white/70">
                <li className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  <span>
                    Looks at one thing only: how your trading behavior interacts
                    with firm rules and phase mechanics.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                  <span>
                    Identifies rule friction, failure points, and structural mismatch.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/30" />
                  <span>
                    Does <span className="font-semibold text-white">not</span> judge trade quality, predict outcomes, or suggest entries.
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5 text-sm text-white/70">
              <span className="font-semibold text-white">Queue status:</span>{" "}
              Your submission is in review. If you included screenshots, they’ll be used
              to ground the analysis.
            </div>
          </div>
        </div>

        {/* Optional visual placeholder */}
        <section className="mt-10">
          <VisualPlaceholder />
        </section>

        {/* Next actions */}
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-white">What most traders do next</h2>

          <p className="mt-3 text-sm text-white/70 max-w-3xl">
            Once you understand <em>how</em> an account fails, the next question is
            whether you want help applying that insight day-to-day.
          </p>

          <p className="mt-3 text-sm text-white/70 max-w-3xl">
            StayFunded is built to help you operate a real prop firm account with structure:
            daily execution (Today), firm + phase plans (Playbooks), and enforcement (Accountability).
            Outcome framing (no promises): designed to increase your chances of passing evaluations,
            keeping funded accounts, and getting paid by reducing rule violations and unforced errors.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-white/55">
                If you already have an account
              </div>
              <h3 className="mt-2 text-base font-semibold text-white">
                Apply this to a real account
              </h3>
              <p className="mt-2 text-sm text-white/70">
                Save your analysis, align to phase-correct behavior, and execute
                daily guardrails built for how prop firm accounts actually fail.
              </p>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300"
                >
                  Go to dashboard
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Pricing
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-white/55">
                If you don’t have an account yet
              </div>
              <h3 className="mt-2 text-base font-semibold text-white">
                Choose a better-fit account
              </h3>
              <p className="mt-2 text-sm text-white/70">
                Use Discovery to compare constraints before committing — then follow
                the matching playbooks and daily operating discipline.
              </p>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/discovery"
                  className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90"
                >
                  Use Discovery
                </Link>
                <Link
                  href="/framework"
                  className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Framework
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 text-xs text-white/55">
            No signals. No trade calls. No guarantees.
          </div>
        </section>
      </div>
    </main>
  );
}
