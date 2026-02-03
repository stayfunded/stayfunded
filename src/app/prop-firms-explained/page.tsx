// src/app/prop-firms-explained/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import StepHeader from "@/components/StepHeader";
import BlurGate from "@/components/BlurGate";
import ContextLink from "@/components/ContextLink";

type Step = {
  id: number;
  title: string;
  sections: Array<{
    heading: string;
    lead?: string;
    paragraphs?: string[];
    bullets?: string[];
    skimmable?: boolean;
    gated?: boolean;
  }>;
  links: Array<{ label: string; href: string; note: string; gated?: boolean }>;
};

function clampStep(n: number) {
  if (!Number.isFinite(n)) return 1;
  if (n < 1) return 1;
  if (n > 4) return 4;
  return n;
}

export default function PropFirmsExplainedPage() {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();

  const step = clampStep(Number(sp.get("step") ?? "1"));
  const [stepFlash, setStepFlash] = useState(false);

  useEffect(() => {
    // Lightweight SEO reinforcement for a client page.
    try {
      document.title =
        "Learn — How Prop Firms Grade Traders (and Why Plans Matter) | StayFunded";
    } catch {
      // ignore
    }
  }, []);

  const steps: Step[] = useMemo(
    () => [
      {
        id: 1,
        title: "What You’re Actually Buying",
        sections: [
          {
            heading: "The simple mental model",
            lead:
              "A prop firm account is a ruleset you pay to operate under — and the rules are what you’re graded on.",
            paragraphs: [
              "A prop firm is not paying you a salary, and it’s not “investing in you.” It’s selling access to a rules-based account with definitions, enforcement, and phase-specific grading mechanics.",
              "Your outcomes only count if they happen inside that box. That’s why generic strategies can fail: they often don’t survive the constraints you just bought.",
            ],
          },
          {
            heading: "What your fee actually buys",
            lead: "Not an edge. Not certainty. An attempt at a constrained ruleset.",
            paragraphs: [
              "Your fee buys an attempt (and often the option to reset or restart when you fail). It does not buy performance, and it does not convert the account into a normal brokerage account.",
              "The rational question is: “Do I have a coherent plan that fits the rules I’m about to trade?”",
            ],
            bullets: [
              "You’re paying for attempts, not certainty.",
              "You’re being graded under constraints, not on trading skill in the abstract.",
              "A strategy is irrelevant if it can’t survive the rulebook.",
            ],
          },
          {
            heading: "Why “I’m a good trader so I’ll pass” fails",
            lead:
              "Because prop firms grade your behavior under constraints — not your identity as a trader.",
            paragraphs: [
              "Most traders don’t fail because they can’t find trades. They fail because their approach becomes unstable under drawdown mechanics, time pressure, and enforcement definitions.",
              "Professional traders adapt structure first: risk sizing, daily behavior, rule buffers, and phase-appropriate expectations.",
            ],
            bullets: [
              "The plan must survive drawdown definitions.",
              "The plan must survive time forcing.",
              "The plan must survive enforcement reality (how rules are measured).",
            ],
          },
          {
            heading: "Gated examples (blurred)",
            gated: true,
            lead:
              "Examples show how definition differences flip outcomes — even when the trading is identical.",
            paragraphs: [
              "These examples demonstrate why two “similar” offers behave very differently once you account for drawdown definitions, enforcement, and phase mechanics.",
            ],
            bullets: [
              "Example: how a drawdown definition changes what normal variance can do to you.",
              "Example: how time pressure quietly converts patience into overtrading.",
            ],
          },
        ],
        links: [
          {
            label: "Discovery",
            href: "/discovery",
            note: "Choose a firm/account context you can operate under.",
          },
          {
            label: "Firm hubs",
            href: "/firms",
            note: "Firm-specific rules and definitions (what you’re actually trading).",
          },
          {
            label: "Rule Changes",
            href: "/rule-changes",
            note: "When the rulebook changes, the plan must change too.",
          },
        ],
      },

      {
        id: 2,
        title: "How Firms Make Money (and Why That Shapes Rules)",
        sections: [
          {
            heading: "The business model in one sentence",
            lead:
              "Most firms make money from attempts. Payouts exist, but they are a controlled cost.",
            paragraphs: [
              "Strip away the marketing: many traders pay to attempt a ruleset, most fail before payout eligibility is possible, and some succeed and get paid under conditions.",
              "If the median customer reached payouts quickly and repeatedly, the model breaks. So the offer is designed around the opposite: many attempts, strict enforcement, and delayed/conditional payouts.",
            ],
          },
          {
            heading: "Why this matters to your plan",
            lead:
              "The rules are not neutral. They are shaped by the firm’s incentives and enforcement model.",
            paragraphs: [
              "A firm can advertise the same headline account size and profit target as another firm and still create very different outcomes.",
              "The difference lives in definitions and enforcement: drawdown calculations, what counts as a violation, time pressure rules, payout unlock rules, and how strictly they’re applied.",
            ],
            bullets: [
              "Definitions change what “safe” behavior looks like.",
              "Enforcement changes what “allowed” really means.",
              "Your plan must be built for the firm you’re trading.",
            ],
          },
          {
            heading: "What the firm is effectively selecting for",
            lead:
              "They are selecting for behavior that remains eligible under constraints — not hero trading.",
            paragraphs: [
              "Violations are immediate. Payout eligibility is delayed and conditional. That asymmetry shapes trader behavior and accounts for many blowups.",
              "Professional plans are designed around eligibility and stability first, not speed.",
            ],
            bullets: [
              "Violations are immediate.",
              "Eligibility/payout rules are delayed and conditional.",
              "Resets convert frustration into another attempt.",
            ],
          },
          {
            heading: "Gated examples (blurred)",
            gated: true,
            lead: "Examples show how small term changes create big plan changes.",
            paragraphs: [
              "These examples show how two nearly-identical offers can behave very differently because of one or two term definitions.",
            ],
            bullets: [
              "Example: fee vs payout math and why small term changes shift incentives.",
              "Example: how drawdown definitions change survivability under identical trading.",
            ],
          },
        ],
        links: [
          {
            label: "Discovery",
            href: "/discovery",
            note: "Compare constraints and pick a context that supports a coherent plan.",
          },
          {
            label: "Rule Changes",
            href: "/rule-changes",
            note: "The model is stable; the rulebook moves.",
          },
          {
            label: "Firm hubs",
            href: "/firms",
            note: "See how each firm expresses the same incentives differently.",
          },
        ],
      },

      {
        id: 3,
        title: "Why Strategies Fail Under Prop Rules",
        sections: [
          {
            heading: "Most failures are plan mismatch",
            lead:
              "A strategy can be fine in a brokerage account and still fail in a prop account — because the constraints are different.",
            paragraphs: [
              "Prop firms compress mistake tolerance. They punish normal variance when it hits hard limits. And they create forcing behavior through time pressure and targets.",
              "The question isn’t “Can I trade?” It’s: “Can I trade in a way that remains eligible under this firm’s rulebook?”",
            ],
          },
          {
            heading: "The core trap: variance + tight limits",
            lead:
              "Even good strategies have losing streaks. Prop rules can make streaks lethal.",
            paragraphs: [
              "Every strategy experiences drawdowns. In prop accounts, allowed drawdown can be small relative to normal variance — especially early, before you’ve built any buffer.",
              "That creates predictable forcing errors: oversizing, revenge trading, chasing the target, or taking trades you would skip in a normal account because the rules make time feel scarce.",
            ],
            bullets: [
              "Low buffer early: normal variance can end the attempt.",
              "Time pressure converts patience into overtrading.",
              "Rule contact compounds: one mistake triggers another rule.",
            ],
          },
          {
            heading: "What professionals do differently",
            lead:
              "They don’t “try harder.” They trade a plan designed for the rulebook.",
            paragraphs: [
              "Professional prop traders converge on similar operating behaviors: sizing that respects drawdown mechanics, pacing that avoids forcing trades, and phase-specific behavior changes after you pass.",
              "StayFunded playbooks encode those behaviors so you’re not inventing your plan in the middle of an attempt.",
            ],
            bullets: [
              "Eligibility-first behavior (especially early).",
              "Phase-aware changes after evaluation.",
              "Risk and pacing designed for enforcement reality.",
            ],
          },
          {
            heading: "Gated patterns (blurred)",
            gated: true,
            lead:
              "Failure patterns change by phase. Evaluation and funded accounts break people in different ways.",
            paragraphs: [
              "This section shows common failure loops by phase and what usually triggers them — so your plan can anticipate them.",
            ],
            bullets: [
              "Evaluation failure loops: time pressure spirals and early rule contact.",
              "Funded failure loops: carrying evaluation urgency into a stricter reality.",
              "What changes across phases and how pros adjust.",
            ],
          },
        ],
        links: [
          {
            label: "Discovery",
            href: "/discovery",
            note: "Pick a context where your plan can actually survive.",
          },
          {
            label: "Firm hubs",
            href: "/firms",
            note: "Get precise on definitions before you trade them.",
          },
          {
            label: "Rule Changes",
            href: "/rule-changes",
            note: "A plan built on old definitions stops working.",
          },
        ],
      },

      {
        id: 4,
        title: "What Success Looks Like (Without Hype)",
        sections: [
          {
            heading: "Passing is not the finish line",
            lead:
              "The real goal is operating an account long enough to remain eligible and collect payouts repeatedly.",
            paragraphs: [
              "Passing is clearing a gate. “Funded” is permission to continue under a new set of constraints. Many traders pass and still never build repeat eligibility.",
              "The stable approach is boring on purpose: low drama, low rule contact, phase-aware behavior changes, and a plan that survives losing streaks.",
            ],
            bullets: [
              "Passing is a gate, not a guarantee of anything.",
              "Behavior must change by phase.",
              "Professional plans optimize for repeat eligibility.",
            ],
          },
          {
            heading: "Why playbooks matter",
            lead:
              "Because what works in evaluation often fails in funded if you keep trading the same way.",
            paragraphs: [
              "A common failure mode is trading evaluation like a time trial and carrying that urgency into funded. Funded phases punish rule contact over time.",
              "Playbooks give you a coherent plan per phase so you’re not making up a new operating system every week.",
            ],
            bullets: [
              "Evaluation: survive constraints and avoid forcing trades.",
              "Funded: consistency, stability, and eligibility over time.",
              "Payout: precision on rules that block withdrawals.",
            ],
          },
          {
            heading: "Skimmable: quick reality checks",
            skimmable: true,
            bullets: [
              "If one bad day can end the attempt, your plan is oversized for the rulebook.",
              "If you feel rushed, your plan is fighting the incentives.",
              "If you don’t know the drawdown definition, you don’t know the game you’re in.",
            ],
          },
          {
            heading: "Gated examples (blurred)",
            gated: true,
            lead: "Examples make “a real plan” concrete and measurable.",
            paragraphs: [
              "These examples show how payout gates, buffers, and drawdown definitions change what a professional plan looks like in practice.",
            ],
            bullets: [
              "Example: payout eligibility timing and why traders die right before withdrawal.",
              "Example: trailing vs end-of-day drawdown and how pros structure around it.",
            ],
          },
        ],
        links: [
          {
            label: "Discovery",
            href: "/discovery",
            note: "Choose your context, then follow the matching playbook.",
          },
          {
            label: "Firm hubs",
            href: "/firms",
            note: "Firm-specific rules, definitions, and enforcement.",
          },
          {
            label: "Rule Changes",
            href: "/rule-changes",
            note: "Keep your plan aligned to the current rulebook.",
          },
        ],
      },
    ],
    []
  );

  const active = steps.find((s) => s.id === step) ?? steps[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setStepFlash(true);
    const t = window.setTimeout(() => setStepFlash(false), 1100);
    return () => window.clearTimeout(t);
  }, [step]);

  return (
    <main className="bg-white overflow-x-hidden pb-24">
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 pt-10 pb-14 md:px-10">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="relative">
              {stepFlash ? (
                <div
                  className="pointer-events-none absolute -top-2 right-0 z-10"
                  aria-live="polite"
                >
                  <div className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-900 shadow-sm">
                    Step {step} of 4
                  </div>
                </div>
              ) : null}

              <StepHeader
                kicker="Learn"
                title="How prop firms grade traders"
                step={step}
                totalSteps={4}
                stepTitle={active.title}
              />
            </div>

            {/* Quick definitions strip */}
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  The product
                </div>
                <div className="mt-1 text-sm font-semibold text-gray-900">
                  Rules + definitions + enforcement
                </div>
                <p className="mt-2 text-sm text-gray-700">
                  Prop firms don’t grade “good trading.” They grade outcomes inside a specific
                  rulebook.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  The risk
                </div>
                <div className="mt-1 text-sm font-semibold text-gray-900">
                  Plan mismatch
                </div>
                <p className="mt-2 text-sm text-gray-700">
                  A strategy can be fine — and still fail because it can’t survive the constraints.
                </p>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  The fix
                </div>
                <div className="mt-1 text-sm font-semibold text-gray-900">
                  Firm + phase playbooks
                </div>
                <p className="mt-2 text-sm text-gray-700">
                  Professional traders trade structured plans tailored to the rulebook and phase.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-2">
                {steps.map((s) => {
                  const isActive = s.id === step;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        const usp = new URLSearchParams(sp.toString());
                        usp.set("step", String(clampStep(s.id)));
                        router.push(`${pathname}?${usp.toString()}`);
                      }}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        isActive
                          ? "bg-gray-900 text-white"
                          : "border border-gray-200 bg-white text-gray-800 hover:bg-gray-50"
                      }`}
                      aria-current={isActive ? "step" : undefined}
                    >
                      {s.id}. {s.title}
                    </button>
                  );
                })}
              </div>

              <div className="hidden gap-2 sm:flex">
                <button
                  type="button"
                  onClick={() => {
                    const usp = new URLSearchParams(sp.toString());
                    usp.set("step", String(clampStep(step - 1)));
                    router.push(`${pathname}?${usp.toString()}`);
                  }}
                  disabled={step === 1}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const usp = new URLSearchParams(sp.toString());
                    usp.set("step", String(clampStep(step + 1)));
                    router.push(`${pathname}?${usp.toString()}`);
                  }}
                  disabled={step === 4}
                  className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="grid gap-4">
                  {active.sections.map((sec) => {
                    const card = (
                      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between gap-3">
                          <div className="text-sm font-semibold text-gray-900">
                            {sec.heading}
                          </div>
                          {sec.skimmable ? (
                            <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-semibold text-gray-700">
                              Skimmable
                            </span>
                          ) : null}
                        </div>

                        {sec.lead ? (
                          <p className="mt-3 text-sm font-semibold text-gray-900">
                            {sec.lead}
                          </p>
                        ) : null}

                        {sec.paragraphs?.length ? (
                          <div className="mt-3 grid gap-2">
                            {sec.paragraphs.map((p, idx) => (
                              <p
                                key={`${sec.heading}-${idx}`}
                                className="text-sm text-gray-700"
                              >
                                {p}
                              </p>
                            ))}
                          </div>
                        ) : null}

                        {sec.bullets?.length ? (
                          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-gray-700">
                            {sec.bullets.map((b, idx) => (
                              <li key={`${sec.heading}-b-${idx}`}>{b}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    );

                    if (!sec.gated) return <div key={sec.heading}>{card}</div>;

                    return (
                      <div key={sec.heading}>
                        <BlurGate
                          title="Unlock examples"
                          description="Core explanations stay free. Examples show what a real plan looks like under specific definitions and enforcement."
                          ctaLabel="See pricing"
                          ctaHref="/pricing"
                        >
                          {card}
                        </BlurGate>
                      </div>
                    );
                  })}
                </div>
              </div>

              <aside className="lg:col-span-1">
                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="text-sm font-semibold text-gray-900">
                    The practical takeaway
                  </div>
                  <p className="mt-2 text-sm text-gray-700">
                    If you’re going to spend real money on attempts, don’t improvise.
                    Use Discovery to choose a context your plan can survive, then follow
                    the firm- and phase-specific playbook like a professional.
                  </p>

                  <div className="mt-4 grid gap-2">
                    <Link
                      href="/discovery"
                      className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black text-center"
                    >
                      Find my firm + plan
                    </Link>
                    <Link
                      href="/firms"
                      className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 text-center"
                    >
                      Open firm playbooks
                    </Link>
                    <div className="text-xs text-gray-500">
                      Playbooks are firm- and phase-specific.
                    </div>
                  </div>

                  <div className="mt-5 border-t border-gray-200 pt-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Use these next
                    </div>
                    <div className="mt-3 grid gap-2">
                      {active.links.map((l) => (
                        <ContextLink
                          key={l.href + l.label}
                          label={l.label}
                          href={l.href}
                          note={l.note}
                          gated={l.gated}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 border-t border-gray-200 pt-4">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Simple sequence
                    </div>
                    <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-gray-700">
                      <li>Understand how the firm grades accounts.</li>
                      <li>Run Discovery to choose a viable context.</li>
                      <li>Open the firm hub for exact definitions.</li>
                      <li>Follow the playbook for your current phase.</li>
                    </ol>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                  <div className="text-sm font-semibold text-gray-900">
                    What this is not
                  </div>
                  <p className="mt-2 text-sm text-gray-700">
                    No signals. No trade calls. No guarantees. This is about structured plans
                    aligned to rules and phases.
                  </p>
                </div>
              </aside>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Continue:</span>
              <Link href="/discovery" className="underline hover:text-gray-900">
                Discovery
              </Link>
              <span className="text-gray-300">·</span>
              <Link href="/firms" className="underline hover:text-gray-900">
                Firm hubs
              </Link>
              <span className="text-gray-300">·</span>
              <Link href="/rule-changes" className="underline hover:text-gray-900">
                Rule Changes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky bottom step controls */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-3 md:px-10">
          <div className="min-w-0">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Step {step} of 4
            </div>
            <div className="truncate text-sm font-semibold text-gray-900">
              {active.title}
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => {
                const prev = clampStep(step - 1);
                const usp = new URLSearchParams(sp.toString());
                usp.set("step", String(prev));
                router.push(`${pathname}?${usp.toString()}`);
              }}
              disabled={step === 1}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                const next = clampStep(step + 1);
                const usp = new URLSearchParams(sp.toString());
                usp.set("step", String(next));
                router.push(`${pathname}?${usp.toString()}`);
              }}
              disabled={step === 4}
              className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
