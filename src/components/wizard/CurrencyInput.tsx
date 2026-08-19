"use client";

import { useId } from "react";
import { formatPkr } from "@/lib/wizard/format";

interface CurrencyInputProps {
  value: string;
  onChange: (rawDigits: string) => void;
  autoFocus?: boolean;
  "aria-describedby"?: string;
}

function formatWithCommas(digits: string): string {
  if (!digits) return "";
  return formatPkr(Number(digits));
}

export function CurrencyInput({
  value,
  onChange,
  autoFocus,
  "aria-describedby": describedBy,
}: CurrencyInputProps) {
  const id = useId();

  return (
    <div className="flex items-center rounded-md border border-paper-muted bg-white/60 px-4 py-3 focus-within:border-brass-strong">
      <label htmlFor={id} className="mr-2 font-data text-sm text-paper-ink-soft">
        PKR
      </label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        autoFocus={autoFocus}
        aria-describedby={describedBy}
        className="w-full bg-transparent font-data text-lg tabular-nums text-paper-ink outline-none"
        placeholder="0"
        value={formatWithCommas(value)}
        onChange={(e) => {
          const digitsOnly = e.target.value.replace(/[^0-9]/g, "");
          onChange(digitsOnly);
        }}
      />
    </div>
  );
}
