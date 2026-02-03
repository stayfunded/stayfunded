// src/app/page.tsx
import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "StayFunded — A daily operating system for prop firm accounts",
  description:
    "StayFunded helps traders operate prop firm accounts correctly inside the rules — increasing your chances of passing evaluations, keeping funded accounts, and getting paid (without promises).",
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
  cta,
}: {
  title: string;
  body?: string;
  bullets?: string[];
  cta?: { label: string; href: string; primary?: boolean };
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 flex flex-col">
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

      {cta ? (
        <div className="mt-auto pt-5">
          <Link
            href={cta.href}
            className={
              cta.primary
                ? "inline-flex w-full justify-center rounded-lg bg-amber-400 px-4 py-2.5 text-sm font-semibold text-black hover:bg-amber-300"
                : "inline-flex w-full justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            }
          >
            {cta.label}
          </Link>
        </div>
      ) : null}
    </div>
  );
}

function PrimaryHomepageVisualPlaceholder() {
  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6">
      <div className="flex items-start justify-between gap-6 flex-col lg:flex-row">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/70">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Primary visual placeholder
          </div>
          <div className="mt-3 text-lg font-semibold text-white">
            One framework. Every phase.
          </div>
          <p className="mt-2 text-sm text-white/70 leading-relaxed">
            The system that increases the odds of passing evaluations, keeping
            funded accounts, and getting paid is not “more strategy.” It’s the
            operating system: Today → Playbooks → Accountability, running under
            the full account lifecycle.
          </p>

          <div className="mt-4 grid gap-2 text-sm text-white/70">
            <div className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span>Shows the 3-step operating system</span>
            </div>
            <div className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span>Shows the phase lifecycle traders actually go through</span>
            </div>
            <div className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span>Makes the value obvious without promises</span>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/framework"
              className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90"
            >
              See the full framework
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Pricing
            </Link>
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
              Homepage "spine" diagram. Must feel like a control system, not decoration.

              ABSOLUTE REQUIREMENTS:
              - Dark-mode premium SaaS vector diagram.
              - NO text in the image (no labels, no numbers).
              - NO candlesticks, charts, PnL, crypto visuals.

              COMPOSITION:
              1) Top row: 5 connected rounded nodes (lifecycle) for:
                 Discovery → Evaluation → Stabilization → Payout → Maintenance
                 (Represent nodes only; do not label them.)
              2) Bottom row: 3 connected larger blocks (framework):
                 Today → Playbooks → Accountability
                 (Represent blocks only; do not label them.)
              3) Bracket/containment underline tying the bottom system to the top lifecycle.
              4) Subtle icon shapes inside the 3 blocks:
                 - checklist/clock motif (Today)
                 - book/shield motif (Playbooks)
                 - two-person/lock + stop-control motif (Accountability)

              STYLE:
              - Deep navy background, soft gray lines, restrained amber highlight.
              - Lots of negative space, rounded corners, soft glow.

              OUTPUT:
              - High resolution, aspect ratio 16:8.
          */}
        </div>
      </div>
    </div>
  );
}

function HomepageDemoVideoPlaceholder() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="flex items-start justify-between gap-6 flex-col lg:flex-row">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-white/70">
            <span className="h-2 w-2 rounded-full bg-amber-400" />
            Demo video placeholder
          </div>

          <div className="mt-3 text-lg font-semibold text-white">
            Watch the system in 90 seconds
          </div>

          <p className="mt-2 text-sm text-white/70 leading-relaxed">
            This should be a fast walkthrough that makes one thing obvious:
            StayFunded is built to increase the odds of passing evaluations,
            keeping funded accounts, and getting paid by reducing unforced errors
            and rule violations — without promising outcomes.
          </p>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/strategy-analysis"
              className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300"
            >
              Run Strategy Analysis (Free)
            </Link>
            <Link
              href="/framework"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              See the Framework
            </Link>
          </div>

          <div className="mt-3 text-xs text-white/55">
            (Video goes here later — this is a placeholder box.)
          </div>
        </div>

        <div className="w-full lg:w-[620px]">
          <div className="aspect-video w-full rounded-xl border border-white/10 bg-black/30" />

          {/* DEMO VIDEO SCRIPT PROMPT — use later to generate a perfect homepage demo
              Length: 75–90 seconds. Ruthlessly tight. Outcome-forward without promises.

              GOAL:
              Turn a skeptical prop trader into: "Oh, this is the missing structure."
              Then push them to: Strategy Analysis (free) as the first action.

              STRUCTURE (timeboxed):
              0–10s (Hook):
                - "Most traders fail prop firms for the same reason: unforced errors under rules."

              10–25s (Reality):
                - "Strategies can work. You still fail when rules + phase constraints punish behavior."
                - Mention: eval vs funded vs payout behaviors differ.

              25–55s (The system):
                - Today: go/no-go, guardrails, stop conditions (show UI)
                - Playbooks: firm+phase behaviors (prioritize/avoid/constraints/gotchas) (show UI)
                - Accountability: pairing + enforcement (show concept)

              55–75s (Outcomes framing, no promises):
                - "Built to increase your chances of passing evaluations, keeping funded accounts, and getting paid
                   by reducing violations and drift."

              75–90s (CTA):
                - "Run the free Strategy Analysis to see where your behavior quietly breaks under your firm’s rules."

              VISUAL GUIDANCE:
              - Use the existing hero screenshot briefly.
              - Then show a clean “Today plan” view (go/no-go + stop conditions).
              - Then show a Playbook view (prioritize/avoid + gotcha callout).
              - Then show Accountability concept (shared plan + enforcement).

              DO NOT:
              - Claim results, show PnL, show charts, or say “guaranteed.”
              - Use hype language (“easy”, “get rich”, etc.).
          */}
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#070A14] text-white">
      <div className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 sm:py-16">
        {/* HERO */}
        <section className="grid items-center gap-10 lg:grid-cols-2">
          <div className="max-w-xl">
            <div className="flex flex-wrap gap-2">
              <Pill>No signals</Pill>
              <Pill>No trade calls</Pill>
              <Pill>Rule-aware</Pill>
              <Pill>Phase-correct</Pill>
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Most traders don’t fail because of strategy.
              <br />
              They fail because they operate prop firm accounts incorrectly.
            </h1>

            <p className="mt-5 text-lg text-white/70">
              Prop firms are designed so most traders fail — even with working
              strategies. StayFunded gives you the structure to operate your prop
              firm account correctly inside the rules, adapt by phase, and avoid
              the unforced errors that quietly blow accounts.
            </p>

            <p className="mt-3 text-sm text-white/70">
              StayFunded is built to{" "}
              <span className="font-semibold text-white">
                increase your chances of passing evaluations, keeping funded
                accounts, and getting paid
              </span>{" "}
              by enforcing rule-aware, phase-correct behavior every day — without
              signals, trade calls, or false promises.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/framework"
                className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
              >
                See the Framework
              </Link>
              <Link
                href="/strategy-analysis"
                className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-300"
              >
                Run Strategy Analysis (Free)
              </Link>
            </div>

            <p className="mt-3 text-xs text-white/55">
              No signals. No trade calls. No guarantees.
            </p>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
              <div className="relative overflow-hidden rounded-xl">
                <Image
                  src="/visuals/home/hero-dashboard-final2.png"
                  alt="Example: passed evaluation and unlocked funded account rules"
                  width={1400}
                  height={900}
                  priority
                  className="h-auto w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* PRIMARY VISUAL (placeholder) */}
        <section className="mt-14">
          <PrimaryHomepageVisualPlaceholder />
        </section>

        {/* HOMEPAGE DEMO VIDEO (placeholder) */}
        <section className="mt-14">
          <HomepageDemoVideoPlaceholder />
        </section>

        {/* CONCRETE PROOF (qualitative, no stats) */}
        <section className="mt-14 grid gap-4 md:grid-cols-3">
          <Card
            title="Concrete proof: phase-correct behavior"
            body="Most traders use evaluation behavior in funded accounts and slowly bleed out. StayFunded forces phase-specific discipline."
            bullets={[
              "Different constraints, different failure modes",
              "Stop treating phases like the same game",
              "Operate for survival first, then payouts",
            ]}
          />
          <Card
            title="Concrete proof: rule friction (not strategy)"
            body="Most blowups are unforced errors caused by rules interacting with behavior."
            bullets={[
              "Trailing drawdown traps",
              "Size creep in buffer windows",
              "“One more trade” spirals near limits",
            ]}
          />
          <Card
            title="Concrete proof: enforcement"
            body="Plans fail when emotions show up. Accountability makes the plan real."
            bullets={[
              "A partner can stop drift live",
              "Consistency beats intensity",
              "Fewer violations = longer survival",
            ]}
          />
        </section>

        {/* REALITY CHECK */}
        <section className="mt-14 grid gap-4 md:grid-cols-2">
          <Card
            title="Why most prop firm traders fail"
            bullets={[
              "They violate rules without realizing it.",
              "They trade when they shouldn’t.",
              "They don’t trade the same way every day.",
              "They ignore phase differences (eval vs funded).",
              "They have no enforcement when emotions kick in.",
            ]}
          />
          <Card
            title="What StayFunded actually fixes"
            body="We don’t replace your strategy. We replace the operating discipline around it — the part that determines whether your strategy survives inside prop firm rules."
            bullets={[
              "Daily operating plans",
              "Firm + phase playbooks",
              "Rule-aware pressure testing",
              "Checklists that define a correct trading day",
              "Accountability with enforcement",
            ]}
          />
        </section>

        {/* FRAMEWORK OVERVIEW */}
        <section className="mt-16">
          <h2 className="text-2xl font-semibold">The StayFunded framework</h2>
          <p className="mt-2 max-w-2xl text-sm text-white/70">
            One system. Three parts. Each part has a job.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Card
              title="Today"
              body="Your daily operating surface."
              bullets={[
                "Go / no-go decisions",
                "Risk limits and stop conditions",
                "Phase-correct execution",
              ]}
              cta={{ label: "Explore Today", href: "/today" }}
            />
            <Card
              title="Playbooks"
              body="Firm + phase behavior plans."
              bullets={[
                "How rules actually punish behavior",
                "What matters right now",
                "What to avoid in this phase",
              ]}
              cta={{ label: "Explore Playbooks", href: "/playbooks" }}
            />
            <Card
              title="Accountability"
              body="Enforcement when it matters."
              bullets={[
                "One trades, one enforces",
                "Violations caught live",
                "Consistency beats intensity",
              ]}
              cta={{ label: "Explore Accountability", href: "/accountability" }}
            />
          </div>
        </section>

        {/* FREE ENTRY — ALIGNED */}
        <section className="mt-16 grid gap-4 md:grid-cols-2">
          <Card
            title="Discovery"
            body="Choose the right firm and account structure before you pay."
            bullets={[
              "Structural fragility",
              "Incentives vs punishments",
              "Links directly into playbooks",
            ]}
            cta={{ label: "Open Discovery", href: "/discovery" }}
          />
          <Card
            title="Strategy Analysis"
            body="Pressure-test how you trade against real firm rules."
            bullets={["No market analysis", "No edge grading", "Rule friction only"]}
            cta={{
              label: "Run Strategy Analysis",
              href: "/strategy-analysis",
              primary: true,
            }}
          />
        </section>

        {/* FINAL ANCHOR */}
        <section className="mt-20 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-lg font-semibold">StayFunded is not for everyone.</div>
          <p className="mt-2 max-w-3xl text-sm text-white/70">
            If you want signals, shortcuts, or someone to tell you what to trade,
            this isn’t it. If you want a disciplined operating system that
            increases your chances of passing evaluations, keeping funded accounts,
            and getting paid — this is what you’ve been missing.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/framework"
              className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90"
            >
              See the Framework
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Pricing
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
