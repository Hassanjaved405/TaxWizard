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
  /** IRIS's own numeric field code, only set where directly confirmed. */
  code?: string;
  getValue: (ctx: MappingContext) => number | undefined;
}

export interface IrisMappingRow {
  label: string;
  form: string;
  tab: string;
  field: string;
  code?: string;
  value: number;
}

/**
 * IRIS 2.0 tab/field names. Entries with a `code` were directly verified
 * against a live IRIS 114(1) return (Employment > Salary, Employment > Tax
 * Deductions > Adjustable Tax, and 116 - Wealth Statement > Personal
 * Assets / Liabilities sections). Entries without a `code` are still
 * best-effort — FBR changes the portal without notice, so always verify
 * against iris.fbr.gov.pk before entering figures.
 *
 * Also confirmed live: IRIS's own "Computations" page (Tax Chargeable /
 * Payments > Computations) independently calculated Tax Chargeable and
 * Admitted Income Tax that matched TaxWizard's own numbers for a real
 * salary-only case to within a rounding difference — a real-world
 * cross-check of the calc engine, not just the field mapping.
 */
export const IRIS_FIELD_MAP_VERSION = "iris-2.0";

const ENTRIES: readonly IrisFieldMapEntry[] = [
  {
    label: "Salary income",
    form: "Income Tax Return",
    tab: "Employment → Salary",
    field: "Total Income from Salary",
    code: "1000",
    getValue: (ctx) => ctx.summary.salaryTaxableIncome,
  },
  {
    label: "Tax already deducted by employer",
    form: "Income Tax Return",
    tab: "Employment → Tax Deductions → Adjustable Tax",
    field: "Salary of Employees u/s 149",
    code: "64020004",
    getValue: (ctx) => ctx.summary.salaryWithheld,
  },
  {
    label: "Approved donations (Section 61 credit)",
    form: "Income Tax Return",
    tab: "Tax Chargeable / Payments → Allowances, Reductions and Credits → Tax Credits",
    field: "Charitable Donations u/s 61 (section confirmed via \"+ Credits\"; exact line item unconfirmed)",
    getValue: (ctx) => (ctx.summary.donationAmount > 0 ? ctx.summary.donationAmount : undefined),
  },
  {
    label: "Bank profit / interest earned",
    form: "Income Tax Return",
    tab: "Employment → Tax Deductions → Adjustable Tax",
    field: "Profit on Debt u/s 151",
    getValue: (ctx) => ctx.summary.bankProfit?.amount,
  },
  {
    label: "Tax withheld on bank profit",
    form: "Income Tax Return",
    tab: "Employment → Tax Deductions → Adjustable Tax",
    field: "Profit on Debt u/s 151 — Tax Collected/Deducted",
    getValue: (ctx) => ctx.summary.bankProfit?.taxWithheld,
  },
  {
    label: "Property value",
    form: "Wealth Statement",
    tab: "116 - Wealth Statement → Personal Assets / Liabilities → Immovable Properties (Non-Business)",
    field: "Immovable Properties (Non-Business)",
    getValue: (ctx) => (ctx.answers.hasProperty ? ctx.answers.propertyValue : undefined),
  },
  {
    label: "Bank account balances",
    form: "Wealth Statement",
    tab: "116 - Wealth Statement → Personal Assets / Liabilities → Financial Assets & Investments (Non-Business)",
    field: "Financial Assets & Investments (Non-Business)",
    getValue: (ctx) => ctx.answers.bankBalance,
  },
  {
    label: "Investments / stocks / bonds",
    form: "Wealth Statement",
    tab: "116 - Wealth Statement → Personal Assets / Liabilities → Financial Assets & Investments (Non-Business)",
    field: "Investments / Stocks / Bonds / etc.",
    code: "7006",
    getValue: (ctx) => (ctx.answers.hasInvestments ? ctx.answers.investmentsValue : undefined),
  },
  {
    label: "Cash in hand",
    form: "Wealth Statement",
    tab: "116 - Wealth Statement → Personal Assets / Liabilities → Financial Assets & Investments (Non-Business)",
    field: "Cash in hand",
    code: "7012",
    getValue: (ctx) => ctx.answers.cashInHand,
  },
  {
    label: "Vehicle value",
    form: "Wealth Statement",
    tab: "116 - Wealth Statement → Personal Assets / Liabilities → Moveable Assets (Non-Business)",
    field: "Motor Vehicle(s)",
    code: "7008",
    getValue: (ctx) => (ctx.answers.hasVehicle ? ctx.answers.vehicleValue : undefined),
  },
  {
    label: "Other assets",
    form: "Wealth Statement",
    tab: "116 - Wealth Statement → Personal Assets / Liabilities",
    field: "Any Other Asset(s)",
    code: "7013",
    getValue: (ctx) => (ctx.answers.hasOtherAssets ? ctx.answers.otherAssetsValue : undefined),
  },
  {
    label: "Outstanding loans / liabilities",
    form: "Wealth Statement",
    tab: "116 - Wealth Statement → Personal Assets / Liabilities",
    field: "Payables (Borrowing / Loan / Credits, etc.)",
    code: "7021",
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
    rows.push({
      label: entry.label,
      form: entry.form,
      tab: entry.tab,
      field: entry.field,
      code: entry.code,
      value,
    });
  }

  return rows;
}
