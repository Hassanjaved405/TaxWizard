import { formatPkr } from "@/lib/wizard/format";
import { getPersonalExpensesFormLabels } from "@/lib/wizard/content";
import type { PersonalExpenseEntry } from "@/lib/wizard/types";

interface PersonalExpensesTableProps {
  entries: PersonalExpenseEntry[];
}

export function PersonalExpensesTable({ entries }: PersonalExpensesTableProps) {
  if (entries.length === 0) {
    return <p className="text-sm text-paper-ink-soft">No personal expenses entered.</p>;
  }

  const labels = getPersonalExpensesFormLabels();
  const total = entries.reduce((sum, entry) => sum + entry.amount, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <tbody className="font-data tabular-nums">
          {entries.map((entry) => (
            <tr key={entry.category} className="border-b border-paper-muted/60">
              <td className="py-2 pr-4 font-sans text-paper-ink">
                {labels.categories[entry.category]}
              </td>
              <td className="py-2 text-right text-paper-ink">{formatPkr(entry.amount)}</td>
            </tr>
          ))}
          <tr className="font-medium text-paper-ink">
            <td className="py-2 pr-4">Total</td>
            <td className="py-2 text-right">{formatPkr(total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
