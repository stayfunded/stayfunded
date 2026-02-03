// src/components/ContextLink.tsx
import Link from "next/link";

export default function ContextLink({
  label,
  href,
  note,
  gated,
}: {
  label: string;
  href: string;
  note: string;
  gated?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-gray-200 bg-white px-3 py-2 hover:bg-gray-50"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-semibold text-gray-900">{label}</div>
        {gated ? (
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[11px] font-semibold text-gray-700">
            Examples locked
          </span>
        ) : null}
      </div>
      <div className="mt-1 text-xs text-gray-600">{note}</div>
      <div className="mt-2 text-xs font-semibold text-gray-500 group-hover:text-gray-700">
        Open →
      </div>
    </Link>
  );
}
