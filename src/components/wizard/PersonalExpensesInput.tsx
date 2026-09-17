"use client";

import { useId } from "react";
import { CurrencyInput } from "./CurrencyInput";
import { EXPENSE_CATEGORY_KEYS } from "@/lib/wizard/schema";
import { getPersonalExpensesFormLabels } from "@/lib/wizard/content";
import type { ExpenseCategoryKey, PersonalExpenseEntry } from "@/lib/wizard/types";

interface PersonalExpensesInputProps {
  value: PersonalExpenseEntry[];
  onChange: (entries: PersonalExpenseEntry[]) => void;
}

export function PersonalExpensesInput({ value, onChange }: PersonalExpensesInputProps) {
  const labels = getPersonalExpensesFormLabels();
  const total = value.reduce((sum, entry) => sum + entry.amount, 0);

  function isChecked(category: ExpenseCategoryKey) {
    return value.some((entry) => entry.category === category);
  }

  function amountFor(category: ExpenseCategoryKey) {
    return value.find((entry) => entry.category === category)?.amount ?? 0;
  }

  function toggle(category: ExpenseCategoryKey) {
    if (isChecked(category)) {
      onChange(value.filter((entry) => entry.category !== category));
    } else {
      onChange([...value, { category, amount: 0 }]);
    }
  }

  function setAmount(category: ExpenseCategoryKey, amount: number) {
    onChange(value.map((entry) => (entry.category === category ? { ...entry, amount } : entry)));
  }

  return (
    <div className="flex flex-col gap-3">
      {EXPENSE_CATEGORY_KEYS.map((category) => (
        <ExpenseCategoryRow
          key={category}
          label={labels.categories[category]}
          checked={isChecked(category)}
          amount={amountFor(category)}
          onToggle={() => toggle(category)}
          onAmountChange={(amount) => setAmount(category, amount)}
        />
      ))}

      <p className="text-xs font-medium text-paper-ink-soft">
        {labels.totalLabel}: PKR {total.toLocaleString("en-US")}
      </p>
    </div>
  );
}

interface ExpenseCategoryRowProps {
  label: string;
  checked: boolean;
  amount: number;
  onToggle: () => void;
  onAmountChange: (amount: number) => void;
}

function ExpenseCategoryRow({
  label,
  checked,
  amount,
  onToggle,
  onAmountChange,
}: ExpenseCategoryRowProps) {
  const id = useId();

  return (
    <div className="rounded-md border border-paper-muted bg-white/40 p-3">
      <label htmlFor={id} className="flex items-center gap-2 text-sm text-paper-ink">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="h-4 w-4 accent-brass-strong"
        />
        {label}
      </label>

      {checked && (
        <div className="mt-2">
          <CurrencyInput
            value={amount ? String(amount) : ""}
            onChange={(digits) => onAmountChange(Number(digits || 0))}
          />
        </div>
      )}
    </div>
  );
}
