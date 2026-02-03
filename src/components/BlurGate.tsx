// src/components/BlurGate.tsx
import Link from "next/link";
import React from "react";

type BlurGateProps = {
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  children: React.ReactNode;
};

export default function BlurGate({
  title,
  description,
  ctaLabel,
  ctaHref,
  children,
}: BlurGateProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Blurred content */}
      <div className="pointer-events-none select-none blur-sm">{children}</div>

      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-white/75">
        <div className="mx-auto w-[92%] max-w-lg rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="text-sm font-semibold text-gray-900">{title}</div>

          <p className="mt-2 text-sm text-gray-700">{description}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link
              href={ctaHref}
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-black"
            >
              {ctaLabel}
            </Link>

            <span className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900">
              Sign-in required
            </span>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            Core explanations stay free. Examples are where definitions and enforcement
            change survivability.
          </div>
        </div>
      </div>
    </div>
  );
}
