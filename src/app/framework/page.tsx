// src/app/framework/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Framework | StayFunded",
  description:
    "StayFunded is a daily operating system for trading prop firm accounts correctly — Today → Playbooks → Accountability — without signals or trade calls.",
};

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/75">
      {children}
    </span>
  );
}

function Card({
  title,
  body,
  bullets,
}: {
  title: string;
  body?: string;
  bullets?: string[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-base font-semibold text-white">{title}</div>
      {body ? <p className="mt-2 text-sm text-white/70">{body}</p> : null}
      {bullets?.length ? (
        <ul className="mt-4 space-y-2 text-sm text-white/70">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function StepCard({
  step,
  title,
  body,
  bullets,
  href,
  cta,
}: {
  step: string;
  title: string;
  body: string;
  bullets: string[];
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 h-full">
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/70">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          Step {step}
        </div>
        <Link
          href={href}
          className="text-sm font-semibold text-amber-400 hover:text-amber-300"
        >
          {cta} →
        </Link>
      </div>

      <div className="mt-4 text-xl font-semibold text-white">{title}</div>
      <p className="mt-2 text-sm text-white/70 leading-relaxed">{body}</p>

      <ul className="mt-4 space-y-2 text-sm text-white/70">
        {bullets.map((b) => (
          <li key={b} className="flex gap-2">
            <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Section({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="max-w-3xl">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        {sub ? <p className="mt-2 text-sm text-white/70">{sub}</p> : null}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function PrimaryVisualPlaceholder({
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
            Primary visual
          </div>
          <div className="mt-3 text-lg font-semibold text-white">{title}</div>
          <p className="mt-2 text-sm text-white/70 leading-relaxed">{subtitle}</p>

          <div className="mt-4 grid gap-2 text-sm text-white/70">
            <div className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span>
                Shows the <span className="text-white font-semibold">3-step system</span>{" "}
                (Today → Playbooks → Accountability)
              </span>
            </div>
            <div className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span>
                Shows the <span className="text-white font-semibold">account lifecycle</span>{" "}
                (Discovery → Evaluation → Stabilization → Payout → Maintenance)
              </span>
            </div>
            <div className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span>
                One message:{" "}
                <span className="text-white font-semibold">
                  same framework, different constraints by phase
                </span>
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/strategy-analysis"
              className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300"
            >
              Run Strategy Analysis (Free)
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90"
            >
              Pricing
            </Link>
            <Link
              href="/today"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Today explainer
            </Link>
          </div>
        </div>

        <div className="w-full lg:w-[620px]">
          <div className="rounded-xl border border-white/10 bg-black/30 p-4">
            <div className="aspect-[16/8] w-full rounded-lg border border-white/10 bg-gradient-to-b from-white/[0.06] to-transparent" />
            <div className="mt-3 flex items-center justify-between text-xs text-white/55">
              <span>Diagram placeholder (generate image later)</span>
              <span className="font-semibold text-amber-400">16:8</span>
            </div>
          </div>

          {/* IMAGE PROMPT — generate later (copy/paste to image generation)
              PURPOSE:
              Primary framework diagram. Must carry the page and feel inevitable.

              ABSOLUTE REQUIREMENTS:
              - Dark-mode SaaS style, minimal vector illustration.
              - NO TEXT in the image. No words, no labels, no numbers.
              - NO candlesticks, charts, PnL curves, crypto aesthetics.
              - Use structure/flow/enforcement metaphors.

              COMPOSITION:
              1) Top row: 5 connected rounded nodes (lifecycle).
              2) Bottom row: 3 connected larger blocks (Today/Playbooks/Accountability).
              3) Bracket/containment shape showing the framework runs under all phases.
              4) Subtle icons inside the 3 blocks:
                 checklist/clock (Today), book/shield (Playbooks), two-person/lock (Accountability).

              STYLE:
              - Deep navy background, soft gray lines, restrained amber glow.
              - Lots of negative space, rounded corners, soft shadow.

              OUTPUT:
              - Vector-style illustration, high resolution, aspect ratio 16:8.

              PROMPT:
              {prompt}
          */}
        </div>
      </div>
    </div>
  );
}

export default function FrameworkPage() {
  return (
    <main className="min-h-screen bg-[#070A14] text-white">
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-14">
        {/* Hero */}
        <div className="max-w-4xl">
          <div className="flex flex-wrap gap-2">
            <Pill>No signals</Pill>
            <Pill>No trade calls</Pill>
            <Pill>Rule-aware</Pill>
            <Pill>Phase-correct</Pill>
          </div>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            The StayFunded Framework is a daily operating system for prop firm
            accounts.
          </h1>

          <p className="mt-4 text-base text-white/70">
            Most traders fail because they treat prop firms like normal accounts.
            Prop firms change what “good trading” means — and that meaning changes
            again as your account moves from evaluation to payouts.
          </p>

          <p className="mt-3 text-base text-white/70">
            StayFunded doesn’t replace your strategy. It replaces the missing
            structure around it — the operating discipline that keeps you inside
            rules, phase-by-phase, day-by-day.
          </p>

          <p className="mt-3 text-sm text-white/70">
            Outcome framing (no promises): built to{" "}
            <span className="font-semibold text-white">
              increase your chances of passing evaluations, keeping funded
              accounts, and getting paid
            </span>{" "}
            by reducing unforced errors, rule violations, and phase mismatch.
          </p>
        </div>

        {/* PRIMARY VISUAL */}
        <Section
          title="The system, visualized"
          sub="This diagram is the point: the same framework runs across every phase — but constraints change."
        >
          <PrimaryVisualPlaceholder
            title="One framework. Every phase."
            subtitle="Most traders don’t need a new strategy. They need a system that keeps behavior consistent under changing constraints."
            prompt={`Create a minimal, premium vector-style dark-mode diagram that combines:
(1) a 5-node lifecycle track across the top and
(2) a 3-block framework track below,
connected by a bracket/containment shape to communicate “the framework runs under the lifecycle”.
No text. No numbers. No charts. No candlesticks. Use restrained amber accents and soft gray lines.`}
          />
        </Section>

        {/* Problem */}
        <Section
          title="Why most prop firm traders fail"
          sub="This is usually not a strategy problem. It’s an operating problem."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Card
              title="What breaks traders"
              bullets={[
                "They violate rules without realizing it.",
                "They trade when they shouldn’t.",
                "They don’t execute the same way every day.",
                "They don’t change behavior by phase (eval vs funded).",
                "They have no external enforcement when tempted to break the plan.",
              ]}
            />
            <Card
              title="What StayFunded changes"
              body="We replace the missing structure around your strategy — the part that determines whether it survives inside prop firm rules."
              bullets={[
                "Daily operating discipline (Today)",
                "Firm + phase behavior plans (Playbooks)",
                "Checklists that define a correct trading day",
                "Rule-aware pressure tests for your approach",
                "Accountability pairing built for enforcement",
              ]}
            />
          </div>
        </Section>

        {/* Steps */}
        <Section
          title="The framework, step by step"
          sub="Three steps. One system. Each step has a job."
        >
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6">
            <div className="grid gap-4 lg:grid-cols-3">
              <StepCard
                step="1"
                title="Today"
                body="The daily operating surface. It turns the framework into a repeatable session routine."
                bullets={[
                  "Go / no-go decision",
                  "Guardrails and stop conditions",
                  "Phase-correct execution",
                ]}
                href="/today"
                cta="Explore Today"
              />

              <StepCard
                step="2"
                title="Playbooks"
                body="Firm + phase behavior plans. Rules become enforceable behaviors."
                bullets={[
                  "How rules actually punish behavior",
                  "What matters in this phase",
                  "What to avoid right now",
                ]}
                href="/playbooks"
                cta="Explore Playbooks"
              />

              <StepCard
                step="3"
                title="Accountability"
                body="Enforcement so the plan stays real when it matters."
                bullets={[
                  "One trades, one enforces",
                  "Violations caught live",
                  "Consistency beats intensity",
                ]}
                href="/accountability"
                cta="Explore Accountability"
              />
            </div>
          </div>
        </Section>

        {/* Phases */}
        <Section
          title="Phases change what “good trading” means"
          sub="Same strategy. Different constraints. Different failure modes."
        >
          <div className="grid gap-4 lg:grid-cols-5">
            <Card
              title="Discovery"
              body="Choose the right structure before you pay."
              bullets={[
                "Structural fragility",
                "What this firm punishes",
                "What this firm favors",
              ]}
            />
            <Card
              title="Evaluation"
              body="Pass without self-sabotage."
              bullets={["Survival > profit", "Rule stacking", "Tilt control"]}
            />
            <Card
              title="Stabilization"
              body="Build buffer. Don’t give it back."
              bullets={[
                "Trailing drawdown reality",
                "Size creep",
                "Overconfidence risk",
              ]}
            />
            <Card
              title="Payout"
              body="Get paid without getting clipped."
              bullets={[
                "Payout rules & timing",
                "Risk compression",
                "Near-money mistakes",
              ]}
            />
            <Card
              title="Maintenance"
              body="Keep funded accounts alive."
              bullets={[
                "Consistency under comfort",
                "Avoid slow bleed",
                "Protect your buffer",
              ]}
            />
          </div>
        </Section>

        {/* Bottom CTA */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-base font-semibold text-white">
            If you only take one idea:
          </div>
          <p className="mt-2 text-sm text-white/70">
            A “working strategy” is not enough in prop firms. You need a daily
            operating system that keeps you inside the rules, adapts as phases
            change, and gets enforced when you’re tempted to break it.
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/strategy-analysis"
              className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300"
            >
              Run Strategy Analysis
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90"
            >
              Pricing
            </Link>
            <Link
              href="/today"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Today explainer
            </Link>
          </div>

          <p className="mt-3 text-xs text-white/55">
            No signals. No trade calls. No guarantees.
          </p>
        </div>
      </div>
    </main>
  );
}
