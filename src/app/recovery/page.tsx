import Link from "next/link";

export const metadata = {
  title: "Recovery | StayFunded",
  description:
    "Recovery is a paid, optional, time-boxed add-on for Framework members who need a 30-day execution reset.",
};

export default function RecoveryPage() {
  return (
    <main className="min-h-screen bg-[#070A14] text-white">
      <div className="mx-auto max-w-[1100px] px-4 py-12 sm:px-6 sm:py-16">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 sm:p-10">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Recovery: a 30-day reset for traders on their last leg
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-white/75">
            When execution keeps breaking, you don&rsquo;t need more information. You need structure, visibility, and time to reset.
          </p>
        </section>

        <section className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-white">Who it&rsquo;s for</h2>
          <ul className="mt-5 space-y-2 text-sm text-white/80">
            {[
              "You believe your strategy works.",
              "You keep breaking rules anyway.",
              "You&rsquo;re close to washing out or giving up.",
              "You want a reset that is structured and time-boxed.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-white">What it is</h2>
          <div className="mt-4 space-y-4 text-white/75">
            <p>
              Recovery is a temporary intervention layer added to the StayFunded Framework membership.
            </p>
            <p>
              It adds higher-touch structure and accountability for 30 days to stop drift, reduce violations, and rebuild correct execution.
            </p>
            <p>Recovery is not permanent. It&rsquo;s a way back.</p>
          </div>
        </section>

        <section className="mt-14 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-white">What it isn&rsquo;t</h2>
          <ul className="mt-5 space-y-2 text-sm text-white/80">
            {[
              "Not signals",
              "Not coaching",
              "Not strategy education",
              "Not therapy",
              "Not a permanent crutch",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 sm:p-8">
          <p className="text-white/85">
            $299 for month one, then $99/month starting month two. Cancel anytime. Requires active Framework membership.
          </p>
          <div className="mt-6">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
            >
              Start Recovery
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
