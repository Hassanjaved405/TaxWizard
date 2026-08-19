type Slab = {
  rate: number;
  label: string;
};

const TY2027_SLABS: Slab[] = [
  { rate: 0, label: "Up to 600k" },
  { rate: 1, label: "600k–1.2M" },
  { rate: 11, label: "1.2M–2.2M" },
  { rate: 20, label: "2.2M–3.2M" },
  { rate: 25, label: "3.2M–4.1M" },
  { rate: 29, label: "4.1M–5.6M" },
  { rate: 32, label: "5.6M–7M" },
  { rate: 35, label: "Above 7M" },
];

/**
 * Decorative hero graphic: Pakistan's progressive salary-tax slabs, drawn as
 * an ascending staircase — each step's height is the slab's rate, so the
 * shape itself is the thing it's explaining, not a decoration next to it.
 */
export function SlabStaircase() {
  const maxRate = TY2027_SLABS[TY2027_SLABS.length - 1].rate;

  return (
    <figure className="w-full">
      <div className="flex items-end gap-1.5 sm:gap-2" role="img" aria-label="Bar chart showing Pakistan's salaried income tax rates stepping up from 0% to 35% across income bands for tax year 2027">
        {TY2027_SLABS.map((slab, i) => {
          const heightPct = 12 + (slab.rate / maxRate) * 88;
          const isLast = i === TY2027_SLABS.length - 1;
          return (
            <div key={slab.label} className="flex flex-1 flex-col items-center gap-2">
              <span className="font-data text-[11px] tabular-nums text-on-ink-muted">
                {slab.rate}%
              </span>
              <div
                className="w-full rounded-t-sm transition-[height]"
                style={{
                  height: `${heightPct}px`,
                  background: isLast
                    ? "var(--brass)"
                    : "linear-gradient(180deg, var(--ink-line), var(--ink-raised))",
                  boxShadow: isLast ? "0 0 24px var(--brass-soft)" : undefined,
                }}
              />
            </div>
          );
        })}
      </div>
      <figcaption className="mt-4 text-xs text-on-ink-muted">
        How salaried income tax steps up in Pakistan, tax year 2027 (Finance
        Act 2026). Every bracket only taxes the slice of income inside it —
        TaxWizard works this out for you automatically.
      </figcaption>
    </figure>
  );
}
