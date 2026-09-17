import type { WizardAnswers } from "@/lib/wizard/types";
import type { FilingSummary } from "./types";
import type { WealthSummary } from "./wealthSummary";

export type ReconciliationFlag = "reconciled" | "underdeclared" | "overdeclared";

export interface ReconciliationResult {
  netAssetsPreviousYear: number;
  totalIncome: number;
  personalExpenses: number;
  taxPaid: number;
  expectedNetAssetsCurrentYear: number;
  actualNetAssetsCurrentYear: number;
  unreconciledAmount: number;
  flag: ReconciliationFlag;
}

/** Minimum gap treated as meaningful, so small rounding/estimation noise doesn't trip the warning. */
const MIN_TOLERANCE = 50_000;
const TOLERANCE_RATIO = 0.05;

/**
 * TaxWizard's own simplified reconciliation model — the standard personal
 * cash-flow identity (what you own now = what you owned before + what you
 * earned − what you spent − what you paid in tax). This is not a guaranteed
 * match to IRIS's own internal Reconciliation of Net Assets algorithm; we
 * only directly observed IRIS's *outcome* live, not its full formula.
 */
export function computeReconciliation(
  answers: WizardAnswers,
  filingSummary: FilingSummary,
  wealthSummary: WealthSummary,
): ReconciliationResult {
  const netAssetsPreviousYear = answers.netAssetsPreviousYear ?? 0;
  const totalIncome = filingSummary.salaryTaxableIncome + (filingSummary.bankProfit?.amount ?? 0);
  const personalExpenses = (answers.personalExpenseEntries ?? []).reduce(
    (sum, entry) => sum + entry.amount,
    0,
  );
  const taxPaid = filingSummary.salaryWithheld + (filingSummary.bankProfit?.taxWithheld ?? 0);

  const expectedNetAssetsCurrentYear =
    netAssetsPreviousYear + totalIncome - personalExpenses - taxPaid;
  const actualNetAssetsCurrentYear = wealthSummary.netAssets;
  const unreconciledAmount = actualNetAssetsCurrentYear - expectedNetAssetsCurrentYear;

  const tolerance = Math.max(MIN_TOLERANCE, totalIncome * TOLERANCE_RATIO);
  const flag: ReconciliationFlag =
    unreconciledAmount > tolerance
      ? "underdeclared"
      : unreconciledAmount < -tolerance
        ? "overdeclared"
        : "reconciled";

  return {
    netAssetsPreviousYear,
    totalIncome,
    personalExpenses,
    taxPaid,
    expectedNetAssetsCurrentYear,
    actualNetAssetsCurrentYear,
    unreconciledAmount,
    flag,
  };
}
