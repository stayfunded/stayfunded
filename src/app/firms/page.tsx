// src/app/firms/page.tsx
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prop Firm Playbooks — Firm-Specific Trading Plans by Phase | StayFunded",
  description:
    "Firm-specific prop trading playbooks by phase. See how professional prop traders structure trading under real firm rules. Structured plans, not signals or guarantees.",
  openGraph: {
    title: "Prop Firm Playbooks — Firm-Specific Trading Plans by Phase | StayFunded",
    description:
      "Firm-specific playbooks that reflect professional prop trading behavior under real firm rules. No signals. No guarantees.",
    type: "website",
  },
};

type FirmStatus = "Active" | "Changes frequently" | "Watchlist";

type Firm = {
  slug: string;
  name: string;
  note: string;
  status: FirmStatus;
  logoSrc: string; // /public path
};

const FIRMS: Firm[] = [
  {
    slug: "topstep",
    name: "Topstep",
    note:
      "Popular futures evaluation structure. Pros structure risk and pacing to fit drawdown mechanics and phase shifts.",
    status: "Active",
    logoSrc: "/visuals/firms/topstep.png",
  },
  {
    slug: "apex",
    name: "Apex Trader Funding",
    note:
      "Fast-moving promos and frequent updates. Plans must account for terms changing and enforcement reality.",
    status: "Changes frequently",
    logoSrc: "/visuals/firms/apex.png",
  },
  {
    slug: "earn2trade",
    name: "Earn2Trade",
    note:
      "Established futures programs with clearer structure. Still phase-dependent; pros adjust behavior by stage.",
    status: "Active",
    logoSrc: "/visuals/firms/earn2trade.png",
  },
  {
    slug: "take-profit-trader",
    name: "Take Profit Trader",
    note:
      "Firm-specific constraints that require deliberate sizing and phase-aware discipline. Verify fine print often.",
    status: "Active",
    logoSrc: "/visuals/firms/take-profit-trader.png",
  },
];

function StatusPill({ status }: { status: FirmStatus }) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1";

  if (status === "Active") {
    return (
      <span className={`${base} bg-emerald-50 text-emerald-800 ring-emerald-200`}>
        Active
      </span>
    );
  }
  if (status === "Changes frequently") {
    return (
      <span className={`${base} bg-amber-50 text-amber-900 ring-amber-200`}>
        Changes frequently
      </span>
    );
  }
  return (
    <span className={`${base} bg-gray-50 text-gray-800 ring-gray-200`}>
      Watchlist
    </span>
  );
}

function FirmLogo({
  src,
  alt,
  size = "card",
}: {
  src: string;
  alt: string;
  size?: "strip" | "card";
}) {
  const box =
    size === "strip"
      ? "h-10 w-[140px] md:h-11 md:w-[160px]"
      : "h-10 w-[120px] md:h-11 md:w-[140px]";

  return (
    <div className={`relative ${box}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={size === "strip" ? "160px" : "140px"}
        className="object-contain"
        priority={size === "strip"}
      />
    </div>
  );
}

export default function FirmsIndexPage() {
  return (
    <main className="bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-14">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">
            Playbooks
          </h1>
          <p className="max-w-3xl text-base text-gray-600">
            Firm-specific playbooks that show how professional prop traders structure
            their trading under real firm rules — and how that structure changes by phase.
          </p>
          <p className="max-w-3xl text-sm text-gray-600">
            This is not signals or “trade ideas.” It’s the operating plan: rules, definitions,
            enforcement, and phase mechanics translated into executable behavior.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/discovery"
              className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white hover:bg-black"
            >
              Find my plan (Discovery)
            </Link>
            <Link
              href="/prop-firms-explained"
              className="rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              How prop firms grade
            </Link>
            <Link
              href="/pricing"
              className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-black hover:bg-amber-300"
            >
              View pricing
            </Link>
          </div>
        </div>

        {/* Covered firms strip */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-semibold text-gray-900">
                Covered firms (starter set)
              </div>
              <div className="mt-1 text-sm text-gray-600">
                Playbooks, rules translation, and phase doctrine are firm-specific.
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Logos are trademarks of their respective owners.
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 md:justify-end">
              {FIRMS.map((f) => (
                <FirmLogo
                  key={f.slug}
                  src={f.logoSrc}
                  alt={`${f.name} logo`}
                  size="strip"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Firms list */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {FIRMS.map((f) => (
            <div
              key={f.slug}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <FirmLogo src={f.logoSrc} alt={`${f.name} logo`} size="card" />

                  <div className="min-w-0">
                    <div className="text-lg font-semibold text-gray-900">
                      {f.name}
                    </div>
                    <div className="mt-0.5 text-xs font-medium text-gray-500">
                      Playbooks by phase
                    </div>
                    <p className="mt-2 text-sm text-gray-600">{f.note}</p>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-gray-50 px-2 py-1 font-semibold text-gray-700 ring-1 ring-gray-200">
                        Includes:
                      </span>
                      <span className="text-gray-500">Playbooks</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">Rules</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">Fine print</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">Phase doctrine</span>
                    </div>
                  </div>
                </div>

                <StatusPill status={f.status} />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/firms/${f.slug}`}
                  className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  Open playbooks
                </Link>
                <Link
                  href={`/firms/${f.slug}/rules`}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Rules preview
                </Link>
                <Link
                  href={`/firms/${f.slug}/fine-print`}
                  className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                >
                  Fine print (preview)
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">
          <div className="text-sm font-semibold text-gray-900">
            Why this exists
          </div>
          <p className="mt-2 max-w-3xl text-sm text-gray-600">
            Most traders don’t fail because they can’t trade — they fail because their
            approach doesn’t survive the rulebook. Playbooks replace improvisation with
            structured plans designed for the firm and phase you’re trading.
          </p>
        </div>
      </div>
    </main>
  );
}
