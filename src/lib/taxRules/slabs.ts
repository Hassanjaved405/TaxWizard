import type { SlabTable } from "./types";

/**
 * Salaried-individual slabs, Tax Year 2027 (1 Jul 2026 – 30 Jun 2027).
 * Verified against Finance Act 2026 figures provided directly by the user.
 */
const TY2027_SLABS: SlabTable = {
  taxYear: "TY2027",
  effectiveFrom: "2026-07-01",
  effectiveTo: "2027-06-30",
  verified: true,
  source: "Finance Act 2026",
  slabs: [
    { min: 0, max: 600_000, rate: 0 },
    { min: 600_000, max: 1_200_000, rate: 0.01 },
    { min: 1_200_000, max: 2_200_000, rate: 0.11 },
    { min: 2_200_000, max: 3_200_000, rate: 0.2 },
    { min: 3_200_000, max: 4_100_000, rate: 0.25 },
    { min: 4_100_000, max: 5_600_000, rate: 0.29 },
    { min: 5_600_000, max: 7_000_000, rate: 0.32 },
    { min: 7_000_000, max: null, rate: 0.35 },
  ],
};

/**
 * Salaried-individual slabs, Tax Year 2026 (1 Jul 2025 – 30 Jun 2026) — the
 * year currently due for filing. UNVERIFIED: mirrors the TY2027 figures as a
 * best-effort placeholder pending confirmation against the official Finance
 * Act 2025 gazette. Do not treat as authoritative.
 *
 * Partial real-world cross-check: for one real TY2026 return (salary-only,
 * taxable income ~1.64M, landing in the 1,200,001–2,200,000 bracket), IRIS's
 * own live "Computations" page calculated Tax Chargeable = 53,915 against
 * TaxWizard's 53,914.57 from these same placeholder slabs — a near-exact
 * match. That's one data point in one bracket, not full verification across
 * the table (especially the higher brackets), so `verified` stays false.
 */
const TY2026_SLABS: SlabTable = {
  taxYear: "TY2026",
  effectiveFrom: "2025-07-01",
  effectiveTo: "2026-06-30",
  verified: false,
  source:
    "UNVERIFIED — placeholder pending confirmation against the Finance Act 2025 gazette (one real-world data point in the 1.2M–2.2M bracket matched exactly, 2026-09)",
  slabs: TY2027_SLABS.slabs,
};

export const SLAB_TABLES: Record<"TY2026" | "TY2027", SlabTable> = {
  TY2026: TY2026_SLABS,
  TY2027: TY2027_SLABS,
};
