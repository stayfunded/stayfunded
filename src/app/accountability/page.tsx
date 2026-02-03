// src/app/accountability/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Accountability | StayFunded",
  description:
    "Two traders paired. One trades. One enforces the shared plan. Discord is the venue — the system is the plan + enforcement.",
};

function SectionTitle({
  eyebrow,
  title,
  sub,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <div className="text-xs font-semibold tracking-wide text-white/60">
          {eyebrow}
        </div>
      ) : null}
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h1>
      {sub ? <p className="mt-3 text-base text-white/70">{sub}</p> : null}
    </div>
  );
}

function Card({
  title,
  desc,
  bullets,
}: {
  title: string;
  desc?: string;
  bullets?: string[];
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="text-base font-semibold text-white">{title}</div>
      {desc ? <div className="mt-2 text-sm text-white/70">{desc}</div> : null}
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
              <span>Pairing (two traders)</span>
            </div>
            <div className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span>Shared plan (enforceable)</span>
            </div>
            <div className="flex gap-2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span>Enforcement (live intervention)</span>
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
              Make “Accountability” feel like enforcement, not community.
              This visual must communicate: partner oversight + shared plan + real-time stop.
              
              ABSOLUTE REQUIREMENTS:
              - Dark-mode SaaS vector or UI-illustration style (can look like product UI, not a real screenshot).
              - NO Discord logos, NO chat-room vibe, NO meme/community imagery.
              - NO charts/candlesticks/PNL.
              - Show “control system” / “guardrail” / “intervention” visually.
              
              COMPOSITION (WHAT IT MUST SHOW VISUALLY):
              A split-panel scene:
              LEFT: “Trader view” (a simple plan card with checklist + guardrails + stop conditions as abstract lines)
              RIGHT: “Enforcer view” (the same plan card mirrored with a highlight on a violated rule + a stop button shape)
              BETWEEN: a linking line/lock icon motif showing the plan is shared.
              
              Key visual element:
              A clear “STOP” action represented by a red/amber control button shape (NO text) that looks like an intervention.
              
              ICONOGRAPHY (NO TEXT):
              - Two person silhouettes (pairing)
              - Shield/lock (shared plan)
              - Alert/stop control (enforcement)
              
              STYLE:
              - Deep navy background
              - Subtle amber highlights
              - Use one restrained “alert” accent (muted red) ONLY for the stop control
              - Rounded corners, soft borders, lots of negative space
              
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

export default function AccountabilityPage() {
  return (
    <main className="min-h-screen bg-[#070A14] text-white">
      <div className="mx-auto max-w-[1280px] px-4 py-10 sm:px-6 sm:py-14">
        <SectionTitle
          eyebrow="Accountability"
          title="Two traders paired. One trades. One enforces."
          sub="Accountability in StayFunded is an enforcement system. A shared plan becomes real when someone else can stop you the moment you drift outside it."
        />

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Link
            href="/framework"
            className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            See the full framework
          </Link>
          <Link
            href="/playbooks"
            className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
          >
            Playbooks explainer
          </Link>
          <Link
            href="/today"
            className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90"
          >
            Today explainer
          </Link>
        </div>

        {/* Primary visual placeholder */}
        <section className="mt-10">
          <VisualPlaceholder
            title="What accountability looks like"
            subtitle="A partner + a shared plan + real-time intervention. This is the missing layer that prevents “one more trade” spirals and rule drift."
            prompt={`Create a premium dark-mode SaaS UI-illustration (not a real screenshot) showing two side-by-side views:
Left (Trader): a plan card with checklist + guardrails + stop conditions (abstract lines).
Right (Enforcer): the same plan card mirrored, with one rule highlighted and a prominent stop-control button shape (no text).
Connect the two panels with a subtle lock/link motif to show a shared plan.
No chat UI. No candlesticks/charts. Subtle amber accents and a restrained alert color for the stop control. Aspect ratio 16:8.`}
          />
        </section>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Card
            title="What it is"
            bullets={[
              "Two traders are paired.",
              "One trader trades.",
              "One partner holds the shared plan and enforces it live.",
              "Discord can be the venue — the product is the pairing + plan + enforcement.",
            ]}
          />
          <Card
            title="What it focuses on"
            bullets={[
              "Keeping the day inside rules and stop conditions.",
              "Preventing impulse trades and “one more trade” spirals.",
              "Catching drift in real time (before it becomes a rule violation).",
              "Turning intent into enforceable behavior.",
            ]}
          />
          <Card
            title="Why this works"
            bullets={[
              "Most failures are unforced errors under constraint.",
              "A partner changes behavior in the moment it matters.",
              "Consistency beats intensity inside prop firm structures.",
            ]}
          />
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-white/5 to-transparent p-6">
            <div className="text-base font-semibold text-white">
              The shared trade plan (required)
            </div>
            <p className="mt-2 text-sm text-white/70">
              Accountability only works if the partner can enforce something
              concrete. This is a bullet-proof plan: clear rules, clear stops,
              and clear no-trade conditions — built around firm + phase.
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Card
                title="Plan must include"
                bullets={[
                  "Go / no-go checklist",
                  "Risk rules (daily + per trade)",
                  "No-trade conditions (news, tilt, drawdown danger)",
                  "Stop conditions (when the day is over)",
                ]}
              />
              <Card
                title="Partner enforces"
                bullets={[
                  "Checks are done before trading starts",
                  "Calls out violations immediately",
                  "Stops the day when stop conditions hit",
                  "Prevents the “one more trade” spiral",
                ]}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="text-base font-semibold text-white">
              How to start (right now)
            </div>
            <p className="mt-2 text-sm text-white/70">
              You don’t need a perfect setup to begin. You need a plan that is
              enforceable — and a partner willing to enforce it.
            </p>

            <div className="mt-5 space-y-3">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="text-sm font-semibold text-white">
                  Do these three things
                </div>
                <ul className="mt-2 space-y-2 text-sm text-white/70">
                  <li className="flex gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    <span>
                      Run Strategy Analysis to pressure-test your behavior against
                      firm rules.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    <span>
                      Use Playbooks to define phase-correct behavior (evaluation
                      vs funded).
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                    <span>
                      Turn “how you trade” into enforceable day rules (go/no-go,
                      risk, stops, no-trade conditions).
                    </span>
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <Link
                  href="/strategy-analysis"
                  className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300"
                >
                  Run Strategy Analysis (Free)
                </Link>
                <Link
                  href="/playbooks"
                  className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Playbooks explainer
                </Link>
                <Link
                  href="/today"
                  className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                >
                  Today explainer
                </Link>
              </div>

              <p className="pt-2 text-xs text-white/50">
                No signals. No trade calls. No guarantees.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="text-base font-semibold text-white">
            How this fits into the StayFunded framework
          </div>
          <p className="mt-2 text-sm text-white/70">
            Accountability is the enforcement layer. Playbooks define correct
            behavior by firm + phase. Today is where you execute the day.
            Discovery and Strategy Analysis are entry points that feed into the
            same system.
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/framework"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Framework
            </Link>
            <Link
              href="/today"
              className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90"
            >
              Today
            </Link>
            <Link
              href="/playbooks"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
            >
              Playbooks
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300"
            >
              Pricing
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
