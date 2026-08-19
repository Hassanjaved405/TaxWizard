import type { WizardAnswers } from "@/lib/wizard/types";
import type { FilingSummary } from "./types";

interface MappingContext {
  summary: FilingSummary;
  answers: WizardAnswers;
}

interface IrisFieldMapEntry {
  label: string;
  form: "Income Tax Return" | "Wealth Statement";
  tab: string;
  field: string;
  getValue: (ctx: MappingContext) => number | undefined;
}

export interface IrisMappingRow {
  label: string;
  form: string;
  tab: string;
  field: string;
  value: number;
}

/**
 * IRIS 2.0 tab/field names, current as of this codebase's last check.
 * FBR changes the portal layout without notice — this is best-effort, not
 * guaranteed to match what's live. Always verify against iris.fbr.gov.pk
 * before entering figures.
 */
export const IRIS_FIELD_MAP_VERSION = "iris-2.0";

const ENTRIES: readonly IrisFieldMapEntry[] = [
  {
    label: "Salary income",
    form: "Income Tax Return",
    tab: "Employment",
    field: "Pay, Wages or Other Remuneration (including Arrears of Salary) u/s 12(2)",
    getValue: (ctx) => ctx.summary.salaryTaxableIncome,
  },
  {
    label: "Tax already deducted by employer",
    form: "Income Tax Return",
    tab: "Adjustable Tax",
    field: "Salary of Employees u/s 149 — Tax Collected/Deducted",
    getValue: (ctx) => ctx.summary.salaryWithheld,
  },
  {
    label: "Approved donations (Section 61 credit)",
    form: "Income Tax Return",
    tab: "Tax Reductions, Credits and Deductions",
    field: "Charitable Donations u/s 61",
    getValue: (ctx) => (ctx.summary.donationAmount > 0 ? ctx.summary.donationAmount : undefined),
  },
  {
    label: "Bank profit / interest earned",
    form: "Income Tax Return",
    tab: "Adjustable Tax",
    field: "Profit on Debt u/s 151",
    getValue: (ctx) => ctx.summary.bankProfit?.amount,
  },
  {
    label: "Tax withheld on bank profit",
    form: "Income Tax Return",
    tab: "Adjustable Tax",
    field: "Profit on Debt u/s 151 — Tax Collected/Deducted",
    getValue: (ctx) => ctx.summary.bankProfit?.taxWithheld,
  },
  {
    label: "Bank account balances",
    form: "Wealth Statement",
    tab: "Personal Assets / Liabilities — Inside Pakistan",
    field: "Bank Accounts",
    getValue: (ctx) => ctx.answers.bankBalance,
  },
  {
    label: "Vehicle value",
    form: "Wealth Statement",
    tab: "Personal Assets / Liabilities — Inside Pakistan",
    field: "Motor Vehicle",
    getValue: (ctx) => (ctx.answers.hasVehicle ? ctx.answers.vehicleValue : undefined),
  },
  {
    label: "Property value",
    form: "Wealth Statement",
    tab: "Personal Assets / Liabilities — Inside Pakistan",
    field: "Immovable Property (Land, Building etc.)",
    getValue: (ctx) => (ctx.answers.hasProperty ? ctx.answers.propertyValue : undefined),
  },
  {
    label: "Cash in hand",
    form: "Wealth Statement",
    tab: "Personal Assets / Liabilities — Inside Pakistan",
    field: "Cash",
    getValue: (ctx) => ctx.answers.cashInHand,
  },
  {
    label: "Outstanding loans / liabilities",
    form: "Wealth Statement",
    tab: "Personal Assets / Liabilities — Inside Pakistan",
    field: "Liabilities",
    getValue: (ctx) => (ctx.answers.hasLiabilities ? ctx.answers.liabilitiesAmount : undefined),
  },
];

export function resolveIrisFieldMap(
  summary: FilingSummary,
  answers: WizardAnswers,
): IrisMappingRow[] {
  const ctx: MappingContext = { summary, answers };
  const rows: IrisMappingRow[] = [];

  for (const entry of ENTRIES) {
    const value = entry.getValue(ctx);
    if (value === undefined || value <= 0) continue;
    rows.push({ label: entry.label, form: entry.form, tab: entry.tab, field: entry.field, value });
  }

  return rows;
}
