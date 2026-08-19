"use client";

import { useId } from "react";
import { CurrencyInput } from "./CurrencyInput";
import { getEmploymentFormLabels } from "@/lib/wizard/content";
import type { EmploymentPeriod } from "@/lib/wizard/types";

interface EmploymentPeriodsInputProps {
  value: EmploymentPeriod[];
  onChange: (periods: EmploymentPeriod[]) => void;
}

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

function createBlankPeriod(): EmploymentPeriod {
  return {
    id: crypto.randomUUID(),
    employerName: "",
    monthsWorked: 12,
    monthlySalary: 0,
    taxDeducted: 0,
  };
}

export function EmploymentPeriodsInput({ value, onChange }: EmploymentPeriodsInputProps) {
  const labels = getEmploymentFormLabels();
  const totalMonths = value.reduce((sum, p) => sum + p.monthsWorked, 0);

  function updatePeriod(id: string, patch: Partial<EmploymentPeriod>) {
    onChange(value.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }

  function removePeriod(id: string) {
    onChange(value.filter((p) => p.id !== id));
  }

  function addPeriod() {
    onChange([...value, createBlankPeriod()]);
  }

  return (
    <div className="flex flex-col gap-4">
      {value.map((period, index) => (
        <EmploymentPeriodRow
          key={period.id}
          period={period}
          index={index}
          canRemove={value.length > 1}
          labels={labels}
          onChange={(patch) => updatePeriod(period.id, patch)}
          onRemove={() => removePeriod(period.id)}
        />
      ))}

      <button
        type="button"
        onClick={addPeriod}
        className="self-start rounded-md border border-dashed border-paper-muted px-4 py-2 text-sm font-medium text-paper-ink-soft transition-colors hover:border-brass-strong hover:text-paper-ink"
      >
        {labels.addButton}
      </button>

      <p className={`text-xs ${totalMonths > 12 ? "font-medium text-owe" : "text-paper-ink-soft"}`}>
        {labels.monthsTotalLabel}: {totalMonths} / 12
        {totalMonths > 12 && ` — ${labels.monthsTotalExceeded}`}
      </p>
    </div>
  );
}

interface EmploymentPeriodRowProps {
  period: EmploymentPeriod;
  index: number;
  canRemove: boolean;
  labels: ReturnType<typeof getEmploymentFormLabels>;
  onChange: (patch: Partial<EmploymentPeriod>) => void;
  onRemove: () => void;
}

function EmploymentPeriodRow({
  period,
  index,
  canRemove,
  labels,
  onChange,
  onRemove,
}: EmploymentPeriodRowProps) {
  const employerId = useId();
  const monthsId = useId();

  return (
    <div className="rounded-md border border-paper-muted bg-white/40 p-4">
      <div className="flex items-center justify-between">
        <p className="font-data text-xs uppercase tracking-[0.12em] text-paper-ink-soft">
          Employer {index + 1}
        </p>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs font-medium text-owe hover:underline"
          >
            {labels.removeButton}
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-3">
        <div>
          <label htmlFor={employerId} className="mb-1 block text-xs text-paper-ink-soft">
            {labels.employerNameLabel}
          </label>
          <input
            id={employerId}
            type="text"
            value={period.employerName ?? ""}
            placeholder={labels.employerNamePlaceholder}
            onChange={(e) => onChange({ employerName: e.target.value })}
            className="w-full rounded-md border border-paper-muted bg-white/60 px-4 py-2.5 text-sm text-paper-ink outline-none focus-within:border-brass-strong"
          />
        </div>

        <div>
          <label htmlFor={monthsId} className="mb-1 block text-xs text-paper-ink-soft">
            {labels.monthsWorkedLabel}
          </label>
          <select
            id={monthsId}
            value={period.monthsWorked}
            onChange={(e) => onChange({ monthsWorked: Number(e.target.value) })}
            className="w-full rounded-md border border-paper-muted bg-white/60 px-4 py-2.5 text-sm text-paper-ink outline-none focus-within:border-brass-strong"
          >
            {MONTH_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m} {m === 1 ? "month" : "months"}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-xs text-paper-ink-soft">
            {labels.monthlySalaryLabel}
          </label>
          <CurrencyInput
            value={period.monthlySalary ? String(period.monthlySalary) : ""}
            onChange={(digits) => onChange({ monthlySalary: Number(digits || 0) })}
          />
        </div>

        <div>
          <label className="mb-1 block text-xs text-paper-ink-soft">
            {labels.taxDeductedLabel}
          </label>
          <CurrencyInput
            value={period.taxDeducted ? String(period.taxDeducted) : ""}
            onChange={(digits) => onChange({ taxDeducted: Number(digits || 0) })}
          />
        </div>
      </div>
    </div>
  );
}
