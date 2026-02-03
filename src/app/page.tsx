import Link from "next/link";

export const metadata = {
  title: "StayFunded - Framework Membership for Prop Firm Traders",
  description:
    "StayFunded is a framework membership for prop firm traders focused on execution structure, accountability, and phase-correct behavior under firm rules.",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#070A14] text-white">
      <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6 sm:py-16">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10">
          <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
            You don&rsquo;t need a new strategy.
            <br />
            You need a framework membership that keeps you executing the one you already have.
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-white/75">
            Most traders already have an edge. What they don&rsquo;t have is structure, a real trade plan, and anyone watching them execute it. StayFunded exists to make execution real &mdash; inside prop firm rules.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/framework"
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
            >
              See the Framework
            </Link>
            <Link
              href="/recovery"
              className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-300"
            >
              On your last leg? Try Recovery (30-day reset)
            </Link>
          </div>
          <p className="mt-4 text-xs text-white/60">
            Bring your own strategy. Keep your educator. No signals. No promises.
          </p>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-semibold tracking-tight">
            The hardest parts of trading aren&rsquo;t taught &mdash; they&rsquo;re exposed.
          </h2>
          <div className="mt-4 max-w-4xl space-y-4 text-white/75">
            <p>
              Every trader hears about discipline, fear, and greed. Very few actually train them.
            </p>
            <p>
              Because trading is solitary. No one sees you bend rules. No one stops &ldquo;just this once.&rdquo;
              <br />
              And prop firm rules punish small lapses fast.
            </p>
            <p>
              StayFunded is built to tackle the intangibles veterans talk about &mdash; by structure and visibility, inside a membership you operate within over time.
            </p>
          </div>
          <ul className="mt-6 grid gap-2 text-sm text-white/80 sm:grid-cols-2">
            {[
              "rule-bending rationalization",
              "discipline decay over time",
              "size creep after wins",
              "hesitation after losses",
              "revenge impulses near limits",
              "phase blindness (evaluation vs funded vs payout behavior)",
              "“just one more trade” spirals",
              "emotional carryover day-to-day",
              "trading alone with no enforcement",
            ].map((item) => (
              <li
                key={item}
                className="flex items-start gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
              >
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">
            If you need StayFunded, you&rsquo;re not broken. You&rsquo;re normal.
          </h2>
          <ul className="mt-5 space-y-2 text-white/80">
            {[
              "blown more than one prop firm account",
              "traded well in theory but failed live",
              "broken rules you knew you shouldn&rsquo;t",
              "drifted and felt embarrassed admitting it",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-3xl text-white/75">
            You&rsquo;re not alone. You&rsquo;re the majority.
            <br />
            StayFunded is the missing wedge between knowing what to do &mdash; and actually doing it.
          </p>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-semibold tracking-tight">
            The StayFunded Framework membership
          </h2>
          <p className="mt-3 max-w-3xl text-white/75">
            StayFunded doesn&rsquo;t replace your strategy or teacher. It gives them a place to actually work.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold text-white">Today</h3>
              <p className="mt-2 text-sm text-white/75">
                What matters right now for your specific prop firm account and phase. No noise.
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold text-white">Playbooks</h3>
              <p className="mt-2 text-sm text-white/75">
                How behavior must change across phases &mdash; and why traders fail even when profitable.
              </p>
            </article>
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold text-white">Accountability</h3>
              <p className="mt-2 text-sm text-white/75">
                Your trade plan is explicit and committed. You don&rsquo;t trade on an island anymore.
              </p>
            </article>
          </div>
          <div className="mt-6">
            <Link
              href="/framework"
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
            >
              Explore the Framework
            </Link>
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">
            Accountability changes behavior. Everyone knows this.
          </h2>
          <p className="mt-4 max-w-3xl text-white/75">
            You trade differently when someone can see the plan you committed to, the rules you agreed to follow, and the account you&rsquo;re operating.
          </p>
          <p className="mt-3 max-w-3xl text-white/75">
            StayFunded makes execution visible &mdash; without signals, policing, or gurus.
          </p>
        </section>

        <section className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold">
            Recovery: a 30-day reset when execution breaks
          </h2>
          <p className="mt-4 max-w-3xl text-white/75">
            Recovery is for traders who know their strategy works but keep breaking rules and are close to giving up.
          </p>
          <p className="mt-3 max-w-3xl text-white/75">
            It adds higher-touch accountability and structure &mdash; temporarily.
            <br />
            Recovery isn&rsquo;t permanent. It&rsquo;s a way back.
          </p>
          <div className="mt-5">
            <Link
              href="/recovery"
              className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-300"
            >
              Learn about Recovery
            </Link>
          </div>
        </section>

        <section className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <p className="max-w-3xl text-white/75">
            StayFunded exists because I needed it &mdash; and it didn&rsquo;t exist.
            <br />
            I had a strategy. I understood markets. I still lost everything by trading alone and breaking my own rules.
          </p>
          <div className="mt-5">
            <Link
              href="/why"
              className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Why StayFunded exists
            </Link>
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 sm:p-8">
          <h2 className="text-3xl font-semibold tracking-tight">Start with clarity.</h2>
          <p className="mt-4 max-w-3xl text-white/75">
            Run the free Strategy Analysis to see where your approach quietly breaks under prop firm rules.
            <br />
            If the strategy is viable but execution breaks, that&rsquo;s what the Framework membership is built to fix.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/strategy-analysis"
              className="inline-flex items-center justify-center rounded-lg bg-amber-400 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-300"
            >
              Start Strategy Analysis (Free)
            </Link>
            <Link
              href="/framework"
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
            >
              See the Framework
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
