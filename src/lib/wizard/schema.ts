import { z } from "zod";
import type { WizardStep } from "./types";

/** Sanity ceiling so a stray extra digit doesn't silently pass validation. */
const MAX_REASONABLE_PKR = 999_999_999_999;

function currencySchema(options: { allowZero?: boolean } = {}) {
  const min = options.allowZero === false ? 1 : 0;
  return z.coerce
    .number()
    .finite("Enter a valid amount.")
    .min(min, min === 0 ? "Amount can't be negative." : "This can't be zero.")
    .max(MAX_REASONABLE_PKR, "That amount looks too large — please check it.");
}

const booleanSchema = z.boolean();

const employmentPeriodSchema = z.object({
  id: z.string(),
  employerName: z.string().trim().max(200).optional(),
  monthsWorked: z.coerce
    .number()
    .int("Whole months only.")
    .min(1, "Must be at least 1 month.")
    .max(12, "Can't exceed 12 months."),
  monthlySalary: currencySchema({ allowZero: false }),
  taxDeducted: currencySchema(),
});

const employmentPeriodsSchema = z
  .array(employmentPeriodSchema)
  .min(1, "Add at least one employer.")
  .refine(
    (periods) => periods.reduce((sum, p) => sum + p.monthsWorked, 0) <= 12,
    { message: "Total months across employers can't exceed 12." },
  );

export const WIZARD_STEPS: readonly WizardStep[] = [
  // --- Filing info ---
  {
    id: "taxYear",
    category: "filing-info",
    contentKey: "taxYear",
    inputType: "select",
    schema: z.enum(["TY2026", "TY2027"]),
    optionValues: ["TY2026", "TY2027"],
  },
  {
    id: "filingStatus",
    category: "filing-info",
    contentKey: "filingStatus",
    inputType: "select",
    schema: z.enum(["first-time", "returning"]),
    optionValues: ["first-time", "returning"],
  },

  // --- Salary ---
  {
    id: "employmentPeriods",
    category: "salary",
    contentKey: "employmentPeriods",
    inputType: "employment-list",
    schema: employmentPeriodsSchema,
  },
  {
    id: "annualBonus",
    category: "salary",
    contentKey: "annualBonus",
    inputType: "currency",
    schema: currencySchema(),
  },

  // --- Other income: bank profit ---
  {
    id: "hasBankProfit",
    category: "other-income",
    contentKey: "hasBankProfit",
    inputType: "boolean",
    schema: booleanSchema,
  },
  {
    id: "bankProfitAmount",
    category: "other-income",
    contentKey: "bankProfitAmount",
    inputType: "currency",
    schema: currencySchema({ allowZero: false }),
    showIf: (a) => a.hasBankProfit === true,
  },
  {
    id: "bankProfitTaxWithheld",
    category: "other-income",
    contentKey: "bankProfitTaxWithheld",
    inputType: "currency",
    schema: currencySchema(),
    showIf: (a) => a.hasBankProfit === true,
  },

  // --- Deductions: donations ---
  {
    id: "hasDonations",
    category: "deductions",
    contentKey: "hasDonations",
    inputType: "boolean",
    schema: booleanSchema,
  },
  {
    id: "donationAmount",
    category: "deductions",
    contentKey: "donationAmount",
    inputType: "currency",
    schema: currencySchema({ allowZero: false }),
    showIf: (a) => a.hasDonations === true,
  },

  // --- Wealth statement (ordered to match IRIS's real Personal
  // Assets/Liabilities grouping: Immovable Properties -> Financial Assets
  // & Investments -> Moveable Assets -> Any Other Assets -> Payables) ---
  {
    id: "hasProperty",
    category: "wealth",
    contentKey: "hasProperty",
    inputType: "boolean",
    schema: booleanSchema,
  },
  {
    id: "propertyValue",
    category: "wealth",
    contentKey: "propertyValue",
    inputType: "currency",
    schema: currencySchema({ allowZero: false }),
    showIf: (a) => a.hasProperty === true,
  },
  {
    id: "bankBalance",
    category: "wealth",
    contentKey: "bankBalance",
    inputType: "currency",
    schema: currencySchema(),
  },
  {
    id: "hasInvestments",
    category: "wealth",
    contentKey: "hasInvestments",
    inputType: "boolean",
    schema: booleanSchema,
  },
  {
    id: "investmentsValue",
    category: "wealth",
    contentKey: "investmentsValue",
    inputType: "currency",
    schema: currencySchema({ allowZero: false }),
    showIf: (a) => a.hasInvestments === true,
  },
  {
    id: "cashInHand",
    category: "wealth",
    contentKey: "cashInHand",
    inputType: "currency",
    schema: currencySchema(),
  },
  {
    id: "hasVehicle",
    category: "wealth",
    contentKey: "hasVehicle",
    inputType: "boolean",
    schema: booleanSchema,
  },
  {
    id: "vehicleValue",
    category: "wealth",
    contentKey: "vehicleValue",
    inputType: "currency",
    schema: currencySchema({ allowZero: false }),
    showIf: (a) => a.hasVehicle === true,
  },
  {
    id: "hasOtherAssets",
    category: "wealth",
    contentKey: "hasOtherAssets",
    inputType: "boolean",
    schema: booleanSchema,
  },
  {
    id: "otherAssetsValue",
    category: "wealth",
    contentKey: "otherAssetsValue",
    inputType: "currency",
    schema: currencySchema({ allowZero: false }),
    showIf: (a) => a.hasOtherAssets === true,
  },
  {
    id: "hasLiabilities",
    category: "wealth",
    contentKey: "hasLiabilities",
    inputType: "boolean",
    schema: booleanSchema,
  },
  {
    id: "liabilitiesAmount",
    category: "wealth",
    contentKey: "liabilitiesAmount",
    inputType: "currency",
    schema: currencySchema({ allowZero: false }),
    showIf: (a) => a.hasLiabilities === true,
  },
] as const;
