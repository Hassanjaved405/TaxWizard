import type { WizardAnswers } from "@/lib/wizard/types";

export interface WealthSummaryRow {
  label: string;
  value: number;
}

export interface WealthSummary {
  rows: WealthSummaryRow[];
  totalAssets: number;
  totalLiabilities: number;
  netAssets: number;
}

/**
 * Presentation-only wealth statement summary — deliberately not part of
 * FilingSummary/computeFilingSummary, since these fields never affect tax
 * liability. Mirrors IRIS's own Total Assets (7019) / Total Liabilities
 * (7029) / Net Assets Current Year (703001), so the results screen can
 * tell the user what IRIS should independently compute as a cross-check.
 */
export function computeWealthSummary(answers: WizardAnswers): WealthSummary {
  const assetRows: WealthSummaryRow[] = [];

  if (answers.hasProperty && answers.propertyValue) {
    assetRows.push({ label: "Immovable property", value: answers.propertyValue });
  }
  if (answers.bankBalance) {
    assetRows.push({ label: "Bank balance", value: answers.bankBalance });
  }
  if (answers.hasInvestments && answers.investmentsValue) {
    assetRows.push({ label: "Investments / stocks / bonds", value: answers.investmentsValue });
  }
  if (answers.cashInHand) {
    assetRows.push({ label: "Cash in hand", value: answers.cashInHand });
  }
  if (answers.hasVehicle && answers.vehicleValue) {
    assetRows.push({ label: "Vehicle", value: answers.vehicleValue });
  }
  if (answers.hasOtherAssets && answers.otherAssetsValue) {
    assetRows.push({ label: "Other assets", value: answers.otherAssetsValue });
  }

  const totalAssets = assetRows.reduce((sum, row) => sum + row.value, 0);
  const totalLiabilities =
    answers.hasLiabilities && answers.liabilitiesAmount ? answers.liabilitiesAmount : 0;

  return {
    rows: assetRows,
    totalAssets,
    totalLiabilities,
    netAssets: totalAssets - totalLiabilities,
  };
}
