import Link from "next/link";

export const metadata = {
  title: "Why | StayFunded",
  description:
    "Why StayFunded exists: a grounded founder-origin scaffold with placeholders.",
};

export default function WhyPage() {
  return (
    <main className="min-h-screen bg-[#070A14] text-white">
      <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6 sm:py-16">
        <section className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Why StayFunded Exists
            </h1>
            <p className="mt-5 max-w-3xl text-lg text-white/75">
              I didn&rsquo;t fail because I didn&rsquo;t know how to trade. I failed because I traded alone &mdash; and no one could stop me.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
            <div className="aspect-[4/5] w-full rounded-xl border border-dashed border-white/20 bg-white/5" />
            <p className="mt-3 text-xs text-white/60">Photo slot placeholder</p>
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-white">Section 1 — Background</h2>
          <p className="mt-4 text-white/75">
            Placeholder paragraph: high-tech background + autonomy pull.
          </p>
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-white">Section 2 — Strategy competence</h2>
          <p className="mt-4 text-white/75">
            Placeholder paragraph: strategies/backtesting.
          </p>
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-white">Section 3 — The failure mode</h2>
          <p className="mt-4 text-white/75">
            Placeholder paragraph: isolation + rule-breaking + &ldquo;get it all back&rdquo; spiral.
          </p>
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-white">Section 4 — The insight</h2>
          <p className="mt-4 text-white/75">
            Placeholder paragraph: plans work; execution breaks.
          </p>
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-white">Section 5 — The backstop</h2>
          <p className="mt-4 text-white/75">
            Placeholder paragraph: StayFunded as the backstop.
          </p>
        </section>

        <section className="mt-14 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 sm:p-8">
          <Link
            href="/framework"
            className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
          >
            See the Framework
          </Link>
        </section>
      </div>
    </main>
  );
}
