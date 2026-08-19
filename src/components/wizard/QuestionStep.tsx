"use client";

import { useId, useState } from "react";
import { CurrencyInput } from "./CurrencyInput";
import { EmploymentPeriodsInput } from "./EmploymentPeriodsInput";
import type { EmploymentPeriod, WizardStep } from "@/lib/wizard/types";
import { getCategoryLabel, getNotice, getStepContent } from "@/lib/wizard/content";

function blankEmploymentPeriod(): EmploymentPeriod {
  return { id: crypto.randomUUID(), employerName: "", monthsWorked: 12, monthlySalary: 0, taxDeducted: 0 };
}

interface QuestionStepProps {
  step: WizardStep;
  currentValue: unknown;
  error?: string;
  onSubmit: (rawValue: unknown) => void;
  onBack: () => void;
  canGoBack: boolean;
  isLastStep: boolean;
}

export function QuestionStep({
  step,
  currentValue,
  error,
  onSubmit,
  onBack,
  canGoBack,
  isLastStep,
}: QuestionStepProps) {
  const content = getStepContent(step.contentKey);
  const helpId = useId();
  const errorId = useId();

  const [draft, setDraft] = useState<unknown>(() => {
    if (currentValue !== undefined) return currentValue;
    if (step.inputType === "currency") return "";
    if (step.inputType === "employment-list") return [blankEmploymentPeriod()];
    return undefined;
  });

  function submit(value: unknown) {
    onSubmit(value);
  }

  return (
    <div className="rounded-lg bg-paper p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] sm:p-8">
      <p className="font-data text-xs uppercase tracking-[0.18em] text-paper-ink-soft">
        {getCategoryLabel(step.category)}
      </p>
      <h2 className="mt-1 font-display text-2xl font-medium text-paper-ink sm:text-3xl">
        {content.question}
      </h2>
      {content.helpText && (
        <p id={helpId} className="mt-3 text-sm leading-relaxed text-paper-ink-soft">
          {content.helpText}
        </p>
      )}

      <div className="mt-6" aria-describedby={content.helpText ? helpId : undefined}>
        {step.inputType === "currency" && (
          <CurrencyInput
            value={typeof draft === "string" ? draft : ""}
            onChange={setDraft}
            autoFocus
            aria-describedby={error ? errorId : undefined}
          />
        )}

        {step.inputType === "boolean" && (
          <div className="flex gap-3" role="group" aria-label={content.question}>
            {[
              { value: true, label: "Yes" },
              { value: false, label: "No" },
            ].map((opt) => (
              <button
                key={String(opt.value)}
                type="button"
                onClick={() => setDraft(opt.value)}
                aria-pressed={draft === opt.value}
                className={`flex-1 rounded-md border px-5 py-3 font-medium transition-colors ${
                  draft === opt.value
                    ? "border-brass-strong bg-brass text-paper-ink"
                    : "border-paper-muted bg-white/40 text-paper-ink hover:border-brass-strong"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {step.inputType === "employment-list" && (
          <EmploymentPeriodsInput
            value={Array.isArray(draft) ? (draft as EmploymentPeriod[]) : []}
            onChange={setDraft}
          />
        )}

        {step.inputType === "select" && (
          <div className="flex flex-col gap-2" role="radiogroup" aria-label={content.question}>
            {step.optionValues.map((optionValue) => (
              <button
                key={optionValue}
                type="button"
                onClick={() => setDraft(optionValue)}
                role="radio"
                aria-checked={draft === optionValue}
                className={`rounded-md border px-5 py-3 text-left transition-colors ${
                  draft === optionValue
                    ? "border-brass-strong bg-brass text-paper-ink"
                    : "border-paper-muted bg-white/40 text-paper-ink hover:border-brass-strong"
                }`}
              >
                {content.options?.[optionValue] ?? optionValue}
              </button>
            ))}
          </div>
        )}
      </div>

      {step.id === "taxYear" && draft === "TY2026" && (
        <p className="mt-4 rounded-md border border-owe/40 bg-owe/10 px-4 py-3 text-xs leading-relaxed text-paper-ink">
          {getNotice("ty2026Unverified")}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="mt-4 text-sm font-medium text-owe">
          {error}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={!canGoBack}
          className="rounded-md px-4 py-2 text-sm font-medium text-paper-ink-soft transition-colors hover:text-paper-ink disabled:opacity-0"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={() => submit(draft)}
          className="rounded-md bg-brass px-6 py-3 font-medium text-paper-ink transition-colors hover:bg-brass-strong"
        >
          {isLastStep ? "Finish" : "Continue"} →
        </button>
      </div>
    </div>
  );
}
