import { formatPkr } from "@/lib/wizard/format";
import type { SlabBreakdownRow } from "@/lib/taxRules/types";

interface SlabBreakdownTableProps {
  rows: SlabBreakdownRow[];
}

function bracketLabel(row: SlabBreakdownRow): string {
  const min = formatPkr(row.min);
  return row.max === null ? `Above ${min}` : `${min} – ${formatPkr(row.max)}`;
}

export function SlabBreakdownTable({ rows }: SlabBreakdownTableProps) {
  if (rows.length === 0) {
    return <p className="text-sm text-paper-ink-soft">No tax due at this income level.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-paper-muted text-left text-paper-ink-soft">
            <th className="py-2 pr-4 font-medium">Bracket (PKR)</th>
            <th className="py-2 pr-4 font-medium">Rate</th>
            <th className="py-2 pr-4 font-medium">Amount in bracket</th>
            <th className="py-2 text-right font-medium">Tax</th>
          </tr>
        </thead>
        <tbody className="font-data tabular-nums">
          {rows.map((row) => (
            <tr key={row.min} className="border-b border-paper-muted/60">
              <td className="py-2 pr-4 text-paper-ink">{bracketLabel(row)}</td>
              <td className="py-2 pr-4 text-paper-ink">{Math.round(row.rate * 100)}%</td>
              <td className="py-2 pr-4 text-paper-ink">{formatPkr(row.amountInBracket)}</td>
              <td className="py-2 text-right text-paper-ink">{formatPkr(row.taxForBracket)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
