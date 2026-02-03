// src/app/today/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Today",
  description:
    "StayFunded Today explains the daily operating discipline that keeps prop firm accounts alive: what to do before, during, and after a trading session—without signals or guarantees.",
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
              This visual should make “Today” feel like a real daily operating system,
              not a blog post. It should show a simple daily plan with guardrails.
              
              ABSOLUTE REQUIREMENTS:
              - Dark-mode SaaS vector or UI-illustration style (can look like a product UI, but not a real screenshot).
              - NO text that mentions specific firms or brands.
              - NO candlesticks, charts, PnL curves, crypto visuals, or hype.
              - Show structure: checklist, guardrails, stop conditions, phase badge.
              - The image must feel calm, disciplined, and “operational.”
              
              COMPOSITION (WHAT IT MUST SHOW VISUALLY):
              A single main panel titled (do NOT include text in image) representing a “Today Plan” layout:
              - A checklist column (3–5 items) with some checked.
              - A “Go / No-Go” decision indicator (green vs gray) as a simple toggle/badge (no words).
              - A small “Phase” badge (just a tag shape, no text).
              - A “Guardrails” box (2–3 bullet lines as abstract lines).
              - A “Stop conditions” box (2–3 abstract lines).
              - Optional: tiny “Status” strip at bottom showing the day is complete (no text).
              
              STYLE:
              - Background deep navy/near-black.
              - Cards in translucent dark gray with soft borders.
              - Subtle amber highlight on the most important element (e.g., guardrails or go/no-go).
              - Generous negative space.
              - Rounded corners, soft shadow.
              
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

export default function TodayExplainerPage() {
  return (
    <main className="min-h-[calc(100vh-56px)] bg-[#0B1022] text-white">
      {/* Hero */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 py-14 sm:py-18">
          <div className="max-w-[860px]">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/80">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              The daily operating surface
            </div>

            <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight">
              Today is how you operate your prop firm account{" "}
              <span className="text-amber-400">correctly</span>—every day.
            </h1>

            <p className="mt-4 text-base sm:text-lg text-white/75 leading-relaxed">
              Most traders don’t fail because their strategy “doesn’t work.” They
              fail because they operate their account like a normal trading
              account—while prop firms punish small, repeated mistakes.
            </p>

            <p className="mt-3 text-base sm:text-lg text-white/75 leading-relaxed">
              “Today” turns the framework into a daily routine: what to check,
              what to avoid, and what a correct trading day looks like for your
              firm and your current phase.
            </p>

            <p className="mt-3 text-sm text-white/70">
              Outcome framing (no promises): this is built to{" "}
              <span className="font-semibold text-white">
                increase your chances of passing evaluations, keeping funded
                accounts, and getting paid
              </span>{" "}
              by enforcing rule-aware, phase-correct behavior daily.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                href="/playbooks"
                className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-300"
              >
                See how Playbooks work
              </Link>

              <Link
                href="/pricing"
                className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                View pricing
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
            title="What “Today” looks like in practice"
            subtitle="A daily plan with guardrails: go/no-go, phase context, risk boundaries, and stop conditions. This is the part that prevents unforced errors."
            prompt={`Create a premium dark-mode SaaS UI-illustration (not a real screenshot) depicting a "Today plan" panel with:
- checklist items (some checked),
- a go/no-go status badge/toggle (no text),
- a phase tag shape (no text),
- a guardrails box,
- a stop conditions box.
No candlesticks. No charts. No numbers. No brand names. Subtle amber highlight. Aspect ratio 16:8.`}
          />
        </div>
      </section>

      {/* What Today is */}
      <section className="pb-14 sm:pb-16">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold text-white">
                A daily operating plan
              </div>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                Not a course. Not motivation. A repeatable set of actions that
                reduces the ways traders accidentally violate rules or drift into
                unsafe behavior.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold text-white">
                Phase-correct behavior
              </div>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                The “right” day in evaluation is not the “right” day in payout.
                Today aligns your behavior to the current phase constraints.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="text-sm font-semibold text-white">
                Rule-aware discipline
              </div>
              <p className="mt-2 text-sm text-white/70 leading-relaxed">
                You don’t need more indicators. You need fewer unforced errors:
                loss limits, trailing rules, sizing, and daily guardrails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The daily loop */}
      <section className="pb-14 sm:pb-16">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6 sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight">
              The daily loop
            </h2>
            <p className="mt-2 text-sm sm:text-base text-white/70 leading-relaxed max-w-[760px]">
              “Today” is a simple loop you run every session. It’s designed to
              keep you inside rules and inside phase-appropriate behavior—without
              turning the product into a trading journal or a signal service.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs font-semibold text-amber-400">
                  1) Before you trade
                </div>
                <div className="mt-2 text-sm font-semibold text-white">
                  Set guardrails
                </div>
                <ul className="mt-2 space-y-2 text-sm text-white/70">
                  <li>Check your phase constraints</li>
                  <li>Confirm the day’s “do not trade” conditions</li>
                  <li>Align to the plan you’re enforcing</li>
                </ul>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs font-semibold text-amber-400">
                  2) While you trade
                </div>
                <div className="mt-2 text-sm font-semibold text-white">
                  Stay inside the plan
                </div>
                <ul className="mt-2 space-y-2 text-sm text-white/70">
                  <li>Trade only what the plan allows today</li>
                  <li>Avoid behaviors that trigger rule friction</li>
                  <li>Stop when the day is “done”</li>
                </ul>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                <div className="text-xs font-semibold text-amber-400">
                  3) After you trade
                </div>
                <div className="mt-2 text-sm font-semibold text-white">
                  Close the loop
                </div>
                <ul className="mt-2 space-y-2 text-sm text-white/70">
                  <li>Confirm you stayed inside the checklist</li>
                  <li>Identify any rule-risk drift</li>
                  <li>Set tomorrow’s operating intent</li>
                </ul>
              </div>
            </div>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <Link
                href="/framework"
                className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                See the full framework
              </Link>

              <Link
                href="/strategy-analysis"
                className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
              >
                Run Strategy Analysis (Free)
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t border-white/10 py-12">
        <div className="mx-auto max-w-[1100px] px-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-base font-semibold">
              Ready to operate with structure?
            </div>
            <div className="mt-1 text-sm text-white/65">
              Playbooks define phase-correct behavior. Today turns it into a daily
              routine.
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/playbooks"
              className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-300"
            >
              Playbooks explainer
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Pricing
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
