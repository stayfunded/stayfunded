// src/app/playbooks/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Playbooks",
  description:
    "StayFunded Playbooks explain firm + phase behavior plans: how to trade prop firm accounts correctly under real rules—without signals or guarantees.",
};

function VisualPlaceholder({
  title,
  subtitle,
  prompt,
}: {
  title: string;
  subtitle: string;
  prompt: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6">
      <div className="flex items-start justify-between gap-6 flex-col lg:flex-row">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/70">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Visual placeholder
          </div>
          <div className="mt-3 text-lg font-semibold text-white">{title}</div>
          <p className="mt-2 text-sm text-white/70 leading-relaxed">{subtitle}</p>

          <div className="mt-4 grid gap-2 text-sm text-white/70">
            <div className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span>What to do (and what to avoid) in this phase</span>
            </div>
            <div className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span>Where rules punish behavior even when strategy “works”</span>
            </div>
            <div className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span>How to trade for payouts without getting clipped</span>
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

          {/* IMAGE PROMPT — generate later (copy/paste to image generation)
              PURPOSE:
              Make “Playbooks” feel like a real, enforceable operating plan, not a blog post.
              This visual should communicate: firm+phase specificity, behavior constraints, and rule-enforcement mechanics.
              
              ABSOLUTE REQUIREMENTS:
              - Dark-mode SaaS vector or UI-illustration style (can look like a product UI, but not a real screenshot).
              - NO candlesticks, charts, PnL curves, crypto visuals, or hype.
              - NO logos or firm names.
              - The image should read quickly: “this is a structured plan.”
              
              COMPOSITION (WHAT IT MUST SHOW VISUALLY):
              A “Playbook” panel layout with:
              - A header area with two tag shapes (no text) representing Firm + Phase.
              - A section titled (no text) for “Prioritize” with 3 bullet lines (abstract lines).
              - A section for “Avoid” with 3 bullet lines (abstract lines).
              - A section for “Risk / Constraints” with 2–3 abstract lines.
              - A small callout box representing a “Gotcha / Enforcement mechanic” (abstract lines + warning icon shape).
              - Optional: a small “Checklist” strip at bottom that implies enforceability.
              
              STYLE:
              - Background deep navy/near-black.
              - Cards translucent dark gray with soft borders.
              - Subtle amber highlight on the “Avoid / gotcha” callout.
              - Rounded corners, soft shadow, lots of negative space.
              
              OUTPUT:
              - High resolution, aspect ratio 16:8.
              
              PROMPT:
              {prompt}
          */}
        </div>
      </div>
    </div>
  );
}

export default function PlaybooksExplainerPage() {
  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#0B1022] text-white">
      {/* Hero */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 py-14 sm:py-18">
          <div className="max-w-[900px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              Firm + phase behavior plans
            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight">
              Playbooks are how you survive{" "}
              <span className="text-amber-400">real prop firm rules</span>.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-white/75 leading-relaxed">
              Most strategies “work.” Traders still fail because prop firms are
              not neutral environments. Rules, trailing drawdown mechanics, and
              phase constraints punish otherwise reasonable behavior.
            </p>

            <p className="mt-3 text-base sm:text-lg text-white/75 leading-relaxed">
              A Playbook is a firm + phase operating plan: what to prioritize,
              what to avoid, and what “correct” behavior looks like inside that
              specific account lifecycle.
            </p>

            <p className="mt-3 text-sm text-white/70">
              Outcome framing (no promises): Playbooks are built to{" "}
              <span className="font-semibold text-white">
                increase your chances of passing evaluations, keeping funded
                accounts, and getting paid
              </span>{" "}
              by translating rules into enforceable behavior.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-300"
              >
                View pricing
              </Link>

              <Link
                href="/strategy-analysis"
                className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Run Strategy Analysis (Free)
              </Link>
            </div>

            <div className="mt-5 text-xs text-white/55">
              No signals. No trade calls. No guarantees.
            </div>
          </div>
        </div>
      </section>

      {/* Primary visual (placeholder) */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <VisualPlaceholder
            title="What a Playbook looks like"
            subtitle="A firm + phase plan with enforceable behaviors: what to prioritize, what to avoid, and where rules quietly trap traders."
            prompt={`Create a premium dark-mode SaaS UI-illustration (not a real screenshot) depicting a "Playbook" panel with:
- firm + phase tag shapes (no text),
- a "prioritize" section (3 bullet lines),
- an "avoid" section (3 bullet lines),
- a "risk/constraints" section (2–3 lines),
- a highlighted "gotcha/enforcement mechanic" callout (warning icon shape, no text).
No candlesticks/charts. No logos. Subtle amber highlight. Aspect ratio 16:8.`}
          />
        </div>
      </section>

      {/* What a playbook is */}
      <section className="pb-14 sm:pb-16">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold text-white">
                Behavior, not strategy
              </div>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                Playbooks don’t tell you what to buy or sell. They define the
                behavioral constraints that keep accounts alive: sizing, risk
                boundaries, and phase-safe execution.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold text-white">
                Firm-specific enforcement
              </div>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                Prop firm rules aren’t just numbers—they’re enforcement mechanics.
                Playbooks focus on where traders get trapped by trailing logic,
                payout restrictions, and “gotcha” constraints.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold text-white">
                Phase-correct plans
              </div>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                Evaluation, stabilization, payout, maintenance—each phase rewards
                different behavior. Playbooks prevent “evaluation trading” from
                destroying funded accounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why they're paid */}
      <section className="pb-14 sm:pb-16">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight">
              Why Playbooks are paid
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/70 leading-relaxed max-w-[800px]">
              A Playbook is not generic advice. It’s a firm + phase operating plan
              that’s specific enough to enforce. That means staying current with
              how rules are interpreted, how phases behave, and the failure modes
              traders repeatedly hit inside each firm’s structure.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs font-semibold text-amber-400">
                  Coverage
                </div>
                <div className="mt-2 text-sm font-semibold text-white">
                  Firm + phase specificity
                </div>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">
                  One “prop trading guide” can’t cover trailing drawdown quirks,
                  payout constraints, and rule interactions across firms.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs font-semibold text-amber-400">
                  Clarity
                </div>
                <div className="mt-2 text-sm font-semibold text-white">
                  Enforceable behaviors
                </div>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">
                  Playbooks translate rules into actions a trader (and an
                  accountability partner) can actually enforce day-to-day.
                </p>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs font-semibold text-amber-400">
                  Maintenance
                </div>
                <div className="mt-2 text-sm font-semibold text-white">
                  Staying aligned over time
                </div>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">
                  When rules or enforcement patterns change, the plan must remain
                  coherent. The product stays stable even as details move.
                </p>
              </div>
            </div>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                href="/today"
                className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                See Today (how it runs daily)
              </Link>

              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
              >
                Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it connects */}
      <section className="border-t border-white/10 py-12">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs font-semibold text-white/60">
                Framework
              </div>
              <div className="mt-2 text-base font-semibold text-white">
                The system map
              </div>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                Today + Playbooks + Accountability is the framework.
              </p>
              <Link
                href="/framework"
                className="mt-4 inline-flex text-sm font-semibold text-amber-400 hover:text-amber-300"
              >
                View Framework →
              </Link>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs font-semibold text-white/60">Today</div>
              <div className="mt-2 text-base font-semibold text-white">
                Daily execution
              </div>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                The operating surface that turns the plan into a daily routine.
              </p>
              <Link
                href="/today"
                className="mt-4 inline-flex text-sm font-semibold text-amber-400 hover:text-amber-300"
              >
                View Today →
              </Link>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-xs font-semibold text-white/60">
                Accountability
              </div>
              <div className="mt-2 text-base font-semibold text-white">
                Enforcement
              </div>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                Pairing that prevents drift and unforced rule violations.
              </p>
              <Link
                href="/accountability"
                className="mt-4 inline-flex text-sm font-semibold text-amber-400 hover:text-amber-300"
              >
                View Accountability →
              </Link>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-base font-semibold">
                Not sure if your behavior survives your firm’s rules?
              </div>
              <div className="mt-1 text-sm text-white/65">
                Run the free Strategy Analysis to pressure-test your approach
                against rule friction.
              </div>
            </div>

            <div className="flex gap-3">
              <Link
                href="/strategy-analysis"
                className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-300"
              >
                Run Strategy Analysis (Free)
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
