// src/components/StepHeader.tsx
export default function StepHeader({
  kicker,
  title,
  step,
  totalSteps,
  stepTitle,
}: {
  kicker: string;
  title: string;
  step: number;
  totalSteps: number;
  stepTitle: string;
}) {
  const pct = Math.round((step / totalSteps) * 100);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {kicker}
          </div>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-gray-900">
            {title}
          </h1>
          <div className="mt-2 text-sm text-gray-700">
            <span className="font-semibold text-gray-900">
              Step {step} of {totalSteps}:
            </span>{" "}
            {stepTitle}
          </div>
        </div>

        <div className="w-full max-w-sm">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
            <span>Progress</span>
            <span>{pct}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-gray-900 transition-all"
              style={{ width: `${pct}%` }}
              aria-hidden="true"
            />
          </div>
          <div className="mt-2 text-[11px] font-semibold text-gray-500">
            Preparation beats improvisation.
          </div>
        </div>
      </div>
    </div>
  );
}
