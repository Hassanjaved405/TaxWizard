import { formatPkr } from "@/lib/wizard/format";
import type { EmploymentBreakdownRow } from "@/lib/taxRules/types";

interface EmploymentBreakdownTableProps {
  rows: EmploymentBreakdownRow[];
}

export function EmploymentBreakdownTable({ rows }: EmploymentBreakdownTableProps) {
  if (rows.length === 0) {
    return <p className="text-sm text-paper-ink-soft">No employment income entered.</p>;
  }

  const totalIncome = rows.reduce((sum, r) => sum + r.periodIncome, 0);
  const totalWithheld = rows.reduce((sum, r) => sum + r.taxDeducted, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-paper-muted text-left text-paper-ink-soft">
            <th className="py-2 pr-4 font-medium">Employer</th>
            <th className="py-2 pr-4 font-medium">Months</th>
            <th className="py-2 pr-4 font-medium">Monthly salary</th>
            <th className="py-2 pr-4 font-medium">Income for period</th>
            <th className="py-2 text-right font-medium">Tax withheld</th>
          </tr>
        </thead>
        <tbody className="font-data tabular-nums">
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-paper-muted/60">
              <td className="py-2 pr-4 font-sans text-paper-ink">
                {row.employerName?.trim() || `Employer ${i + 1}`}
              </td>
              <td className="py-2 pr-4 text-paper-ink">{row.monthsWorked}</td>
              <td className="py-2 pr-4 text-paper-ink">{formatPkr(row.monthlySalary)}</td>
              <td className="py-2 pr-4 text-paper-ink">{formatPkr(row.periodIncome)}</td>
              <td className="py-2 text-right text-paper-ink">{formatPkr(row.taxDeducted)}</td>
            </tr>
          ))}
          <tr className="font-medium text-paper-ink">
            <td className="py-2 pr-4" colSpan={3}>
              Total
            </td>
            <td className="py-2 pr-4">{formatPkr(totalIncome)}</td>
            <td className="py-2 text-right">{formatPkr(totalWithheld)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
