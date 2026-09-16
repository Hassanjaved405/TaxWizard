import { formatPkr } from "@/lib/wizard/format";
import type { WealthSummary } from "@/lib/taxRules/wealthSummary";

interface WealthSummaryTableProps {
  summary: WealthSummary;
}

export function WealthSummaryTable({ summary }: WealthSummaryTableProps) {
  if (summary.rows.length === 0 && summary.totalLiabilities === 0) {
    return <p className="text-sm text-paper-ink-soft">No wealth statement details entered.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <tbody className="font-data tabular-nums">
          {summary.rows.map((row) => (
            <tr key={row.label} className="border-b border-paper-muted/60">
              <td className="py-2 pr-4 font-sans text-paper-ink">{row.label}</td>
              <td className="py-2 text-right text-paper-ink">{formatPkr(row.value)}</td>
            </tr>
          ))}
          <tr className="border-b border-paper-muted/60 font-medium">
            <td className="py-2 pr-4 font-sans text-paper-ink">Total assets</td>
            <td className="py-2 text-right text-paper-ink">{formatPkr(summary.totalAssets)}</td>
          </tr>
          {summary.totalLiabilities > 0 && (
            <tr className="border-b border-paper-muted/60">
              <td className="py-2 pr-4 font-sans text-paper-ink">Total liabilities</td>
              <td className="py-2 text-right text-owe">
                − {formatPkr(summary.totalLiabilities)}
              </td>
            </tr>
          )}
          <tr className="font-medium">
            <td className="py-2 pr-4 font-sans text-paper-ink">Net assets</td>
            <td className="py-2 text-right text-paper-ink">{formatPkr(summary.netAssets)}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-3 text-xs text-paper-ink-soft">
        IRIS should independently compute a similar Total Assets (code 7019), Total
        Liabilities (code 7029), and Net Assets Current Year (code 703001) — worth
        cross-checking when you get there.
      </p>
    </div>
  );
}
