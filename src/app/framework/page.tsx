import Link from "next/link";

export const metadata = {
  title: "Framework | StayFunded",
  description:
    "The StayFunded Framework is a membership system for executing your trade plan inside prop firm constraints with phase-aware structure and accountability visibility.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <div className="mt-4 space-y-4 text-white/75">{children}</div>
    </section>
  );
}

export default function FrameworkPage() {
  return (
    <main className="min-h-screen bg-[#070A14] text-white">
      <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6 sm:py-16">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            The StayFunded Framework
          </h1>

          <p className="mt-5 max-w-3xl text-lg text-white/75">
            A membership system for executing your trade plan inside prop firm
            constraints &mdash; without trading alone.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/80">
              <span className="font-semibold text-white">This is:</span> execution
              structure, phase-aware operating system, accountability visibility.
            </div>
            <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/80">
              <span className="font-semibold text-white">This isn&rsquo;t:</span>{" "}
              signals, coaching, strategy education, community, leaderboards.
            </div>
          </div>

          <p className="mt-6 max-w-3xl text-base text-white/80">
            StayFunded does not tell you what to trade. It helps you execute what
            you already believe &mdash; consistently.
          </p>
        </section>

        <Section title="Today">
          <p>
            What matters right now for your specific prop firm account and phase.
            No noise.
          </p>
          <p>Today is designed to prevent unforced errors before they happen:</p>
          <ul className="space-y-2 text-sm text-white/80">
            {[
              "go / no-go decisions",
              "explicit risk limits",
              "stop conditions",
              "phase-correct behavior",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Playbooks">
          <p>
            How behavior must change across phases &mdash; and why traders fail
            even when profitable.
          </p>
          <p>Playbooks exist because:</p>
          <ul className="space-y-2 text-sm text-white/80">
            {[
              "evaluation behavior is not funded behavior",
              "payout behavior is not maintenance behavior",
              "rules punish the wrong behavior fast",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p>Playbooks emphasize:</p>
          <ul className="space-y-2 text-sm text-white/80">
            {[
              "what to prioritize right now",
              "what to avoid in this phase",
              "the common \u201cgotchas\u201d that quietly blow accounts",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Accountability">
          <p>Accountability isn&rsquo;t motivation. It&rsquo;s visibility.</p>
          <p>
            Each account has a committed trade plan. You can opt into pairing at
            the account level when you need it.
          </p>
          <p>
            StayFunded does not police you. It makes execution visible so drift is
            harder.
          </p>
          <ul className="space-y-2 text-sm text-white/80">
            {[
              "Pairing is account-level.",
              "Only one account (or copy-trading group) can be paired at a time.",
              "A detailed trade plan is required for any account marked accountability.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <section className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 sm:p-8">
          <p className="text-xl font-semibold text-white">
            Strategy answers what. StayFunded governs how. Together, they work.
          </p>
          <div className="mt-6">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
            >
              See Pricing
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
