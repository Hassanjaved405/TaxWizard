import type { z } from "zod";

export type TaxYear = "TY2026" | "TY2027";
export type FilingStatus = "first-time" | "returning";

export interface EmploymentPeriod {
  /** Stable client-side id for list add/remove — not a server record id. */
  id: string;
  employerName?: string;
  /** 1–12; lets a job switch mid-year be entered as two shorter periods. */
  monthsWorked: number;
  monthlySalary: number;
  /** Tax this employer withheld, from that employer's own salary certificate. */
  taxDeducted: number;
}

export interface WizardAnswers {
  taxYear?: TaxYear;
  filingStatus?: FilingStatus;

  employmentPeriods?: EmploymentPeriod[];
  annualBonus?: number;

  hasBankProfit?: boolean;
  bankProfitAmount?: number;
  bankProfitTaxWithheld?: number;

  hasDonations?: boolean;
  donationAmount?: number;

  bankBalance?: number;
  hasVehicle?: boolean;
  vehicleValue?: number;
  hasProperty?: boolean;
  propertyValue?: number;
  cashInHand?: number;
  hasLiabilities?: boolean;
  liabilitiesAmount?: number;
}

export type WizardFieldKey = keyof WizardAnswers;

export type CurrencyFieldKey =
  | "annualBonus"
  | "bankProfitAmount"
  | "bankProfitTaxWithheld"
  | "donationAmount"
  | "bankBalance"
  | "vehicleValue"
  | "propertyValue"
  | "cashInHand"
  | "liabilitiesAmount";

export type BooleanFieldKey =
  | "hasBankProfit"
  | "hasDonations"
  | "hasVehicle"
  | "hasProperty"
  | "hasLiabilities";

export type SelectFieldKey = "taxYear" | "filingStatus";

export type StepCategory =
  | "filing-info"
  | "salary"
  | "other-income"
  | "deductions"
  | "wealth";

interface WizardStepBase {
  category: StepCategory;
  /** Key into src/content/i18n/en.json for question copy + help text. */
  contentKey: string;
  /** Only shown when this returns true for the answers collected so far. */
  showIf?: (answers: WizardAnswers) => boolean;
}

export interface CurrencyStep extends WizardStepBase {
  id: CurrencyFieldKey;
  inputType: "currency";
  schema: z.ZodType<number>;
}

export interface BooleanStep extends WizardStepBase {
  id: BooleanFieldKey;
  inputType: "boolean";
  schema: z.ZodType<boolean>;
}

export interface SelectStep extends WizardStepBase {
  id: SelectFieldKey;
  inputType: "select";
  schema: z.ZodType<string>;
  /** Values only — display labels live in the i18n content file, keyed by contentKey. */
  optionValues: readonly string[];
}

export interface EmploymentListStep extends WizardStepBase {
  id: "employmentPeriods";
  inputType: "employment-list";
  schema: z.ZodType<EmploymentPeriod[]>;
}

export type WizardStep = CurrencyStep | BooleanStep | SelectStep | EmploymentListStep;
