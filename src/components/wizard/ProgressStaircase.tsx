interface ProgressStaircaseProps {
  total: number;
  currentIndex: number;
}

/**
 * Functional counterpart to the landing page's slab staircase: each step of
 * the wizard is a stair the user climbs, same visual language as the tax
 * brackets it's collecting data for.
 */
export function ProgressStaircase({ total, currentIndex }: ProgressStaircaseProps) {
  return (
    <div className="w-full">
      <p className="mb-2 font-data text-xs tabular-nums text-on-ink-muted">
        Step {Math.min(currentIndex + 1, total)} of {total}
      </p>
      <div
        className="flex items-end gap-1"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={Math.min(currentIndex + 1, total)}
      >
        {Array.from({ length: total }, (_, i) => {
          const heightPct = 6 + (i / Math.max(total - 1, 1)) * 14;
          const state = i < currentIndex ? "done" : i === currentIndex ? "current" : "upcoming";
          return (
            <div
              key={i}
              className="flex-1 rounded-t-sm transition-colors"
              style={{
                height: `${heightPct}px`,
                background: state === "upcoming" ? "var(--ink-line)" : "var(--brass)",
                opacity: state === "upcoming" ? 0.5 : 1,
                boxShadow: state === "current" ? "0 0 12px var(--brass-soft)" : undefined,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
