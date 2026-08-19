import type { TaxYear } from "@/lib/wizard/types";

export interface TaxSlab {
  /** Inclusive lower bound of this bracket, in PKR. */
  min: number;
  /** Inclusive upper bound, or null for the top-open bracket. */
  max: number | null;
  /** Marginal rate as a decimal, e.g. 0.11 for 11%. */
  rate: number;
}

export interface SlabTable {
  taxYear: TaxYear;
  effectiveFrom: string;
  effectiveTo: string;
  /** False for slab tables that are best-effort placeholders, not confirmed against the gazette. */
  verified: boolean;
  source: string;
  slabs: readonly TaxSlab[];
}

export interface SlabBreakdownRow {
  min: number;
  max: number | null;
  rate: number;
  amountInBracket: number;
  taxForBracket: number;
}

export interface SlabTaxResult {
  totalTax: number;
  breakdown: SlabBreakdownRow[];
}

export interface BankProfitSummary {
  amount: number;
  taxWithheld: number;
}

export interface EmploymentBreakdownRow {
  employerName?: string;
  monthsWorked: number;
  monthlySalary: number;
  periodIncome: number;
  taxDeducted: number;
}

export type NetPositionType = "refund" | "payable" | "settled";

export interface NetPosition {
  type: NetPositionType;
  amount: number;
}

export interface FilingSummary {
  taxYear: TaxYear;
  verified: boolean;
  slabSource: string;

  employmentBreakdown: EmploymentBreakdownRow[];
  salaryTaxableIncome: number;
  slabBreakdown: SlabBreakdownRow[];
  taxBeforeCredits: number;

  donationAmount: number;
  donationCredit: number;
  taxAfterCredits: number;

  salaryWithheld: number;
  netPosition: NetPosition;

  bankProfit?: BankProfitSummary;
}
