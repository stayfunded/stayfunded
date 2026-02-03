import Link from "next/link";

export const metadata = {
  title: "Strategy Analysis | StayFunded",
  description:
    "Free strategy analysis to diagnose rule friction and execution breakdowns inside prop firm rules.",
};

export default function StrategyAnalysisPage() {
  return (
    <main className="min-h-screen bg-[#070A14] text-white">
      <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6 sm:py-16">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Strategy Analysis (Free)
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-white/75">
            Before you change strategies, understand how your current one actually fails inside prop firm rules.
          </p>
        </section>

        <section className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <p className="text-white/75">
            Most traders abandon strategies too early. The failure is often rule friction and execution breakdowns &mdash; not the edge itself.
          </p>

          <ul className="mt-6 space-y-2 text-sm text-white/80">
            {[
              "No rankings.",
              "No signals.",
              "No promises.",
              "No market analysis.",
              "Rule friction and execution clarity only.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-white/75">
            If the analysis shows the strategy is viable but execution breaks, that&rsquo;s what the StayFunded Framework membership is built for.
          </p>

          <div className="mt-7">
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
