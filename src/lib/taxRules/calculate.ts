import type { WizardAnswers } from "@/lib/wizard/types";
import { SLAB_TABLES } from "./slabs";
import type {
  EmploymentBreakdownRow,
  FilingSummary,
  NetPosition,
  SlabBreakdownRow,
  SlabTable,
  SlabTaxResult,
} from "./types";

/** FBR Section 61: donations above 30% of taxable income don't earn further credit. */
const DONATION_CREDIT_CAP_RATIO = 0.3;

export function calculateSlabTax(taxableIncome: number, table: SlabTable): SlabTaxResult {
  const breakdown: SlabBreakdownRow[] = [];
  let totalTax = 0;

  for (const slab of table.slabs) {
    const upper = slab.max === null ? taxableIncome : Math.min(taxableIncome, slab.max);
    const amountInBracket = Math.max(upper - slab.min, 0);
    if (amountInBracket <= 0) continue;

    const taxForBracket = amountInBracket * slab.rate;
    totalTax += taxForBracket;
    breakdown.push({
      min: slab.min,
      max: slab.max,
      rate: slab.rate,
      amountInBracket,
      taxForBracket,
    });
  }

  return { totalTax, breakdown };
}

/**
 * FBR Section 61 approved-donations tax credit: credit = (eligible donation /
 * taxable income) × tax on taxable income, where the eligible donation is
 * capped at 30% of taxable income.
 */
export function calculateDonationCredit(
  donationAmount: number,
  taxableIncome: number,
  taxOnTaxableIncome: number,
): number {
  if (donationAmount <= 0 || taxableIncome <= 0 || taxOnTaxableIncome <= 0) {
    return 0;
  }
  const eligibleDonation = Math.min(donationAmount, taxableIncome * DONATION_CREDIT_CAP_RATIO);
  return (eligibleDonation / taxableIncome) * taxOnTaxableIncome;
}

function summarizeEmploymentPeriods(answers: WizardAnswers): {
  breakdown: EmploymentBreakdownRow[];
  totalIncome: number;
  totalWithheld: number;
} {
  const periods = answers.employmentPeriods ?? [];
  const breakdown: EmploymentBreakdownRow[] = periods.map((p) => ({
    employerName: p.employerName,
    monthsWorked: p.monthsWorked,
    monthlySalary: p.monthlySalary,
    periodIncome: p.monthlySalary * p.monthsWorked,
    taxDeducted: p.taxDeducted,
  }));

  return {
    breakdown,
    totalIncome: breakdown.reduce((sum, row) => sum + row.periodIncome, 0),
    totalWithheld: breakdown.reduce((sum, row) => sum + row.taxDeducted, 0),
  };
}

export function computeFilingSummary(answers: WizardAnswers): FilingSummary {
  const taxYear = answers.taxYear ?? "TY2026";
  const table = SLAB_TABLES[taxYear];

  const annualBonus = answers.annualBonus ?? 0;
  const donationAmount = answers.hasDonations ? (answers.donationAmount ?? 0) : 0;

  const { breakdown: employmentBreakdown, totalIncome: employmentIncome, totalWithheld: salaryWithheld } =
    summarizeEmploymentPeriods(answers);

  const salaryTaxableIncome = employmentIncome + annualBonus;
  const { totalTax: taxBeforeCredits, breakdown: slabBreakdown } = calculateSlabTax(
    salaryTaxableIncome,
    table,
  );

  const donationCredit = calculateDonationCredit(
    donationAmount,
    salaryTaxableIncome,
    taxBeforeCredits,
  );
  const taxAfterCredits = Math.max(taxBeforeCredits - donationCredit, 0);

  // Salaried income only — bank profit is settled separately under the final tax regime.
  const netAmount = salaryWithheld - taxAfterCredits;
  const netPosition: NetPosition =
    Math.abs(netAmount) < 1
      ? { type: "settled", amount: 0 }
      : netAmount > 0
        ? { type: "refund", amount: netAmount }
        : { type: "payable", amount: -netAmount };

  const bankProfit = answers.hasBankProfit
    ? {
        amount: answers.bankProfitAmount ?? 0,
        taxWithheld: answers.bankProfitTaxWithheld ?? 0,
      }
    : undefined;

  return {
    taxYear,
    verified: table.verified,
    slabSource: table.source,
    employmentBreakdown,
    salaryTaxableIncome,
    slabBreakdown,
    taxBeforeCredits,
    donationAmount,
    donationCredit,
    taxAfterCredits,
    salaryWithheld,
    netPosition,
    bankProfit,
  };
}
