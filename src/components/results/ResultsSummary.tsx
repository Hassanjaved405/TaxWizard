import type { WizardAnswers } from "@/lib/wizard/types";
import { formatPkr } from "@/lib/wizard/format";
import { computeFilingSummary } from "@/lib/taxRules/calculate";
import { resolveIrisFieldMap } from "@/lib/taxRules/irisMapping";
import { saveFilingAction } from "@/lib/supabase/actions";
import { computeWealthSummary } from "@/lib/taxRules/wealthSummary";
import { computeReconciliation } from "@/lib/taxRules/reconciliation";
import { SlabBreakdownTable } from "./SlabBreakdownTable";
import { EmploymentBreakdownTable } from "./EmploymentBreakdownTable";
import { WealthSummaryTable } from "./WealthSummaryTable";
import { PersonalExpensesTable } from "./PersonalExpensesTable";

interface ResultsSummaryProps {
  answers: WizardAnswers;
  /** False when rendering an already-saved filing (e.g. /results/[id]). */
  canSave?: boolean;
  /** Set once a filing is saved — enables the PDF download link. */
  filingId?: string;
}

const DOCUMENT_CHECKLIST = [
  "Salary certificate / annual tax deduction certificate from your employer",
  "Bank account statements as of 30 June",
  "Annual profit/tax certificates from your bank, if you earned bank profit",
  "Proof of any approved donations (receipts), if claimed",
  "Registration documents for any vehicle or property you own",
];

const NET_POSITION_COPY: Record<
  ReturnType<typeof computeFilingSummary>["netPosition"]["type"],
  { label: string; colorClass: string }
> = {
  refund: { label: "Refund due to you", colorClass: "text-refund" },
  payable: { label: "Amount you owe", colorClass: "text-owe" },
  settled: { label: "You're settled — nothing owed or due", colorClass: "text-paper-ink" },
};

export function ResultsSummary({ answers, canSave = false, filingId }: ResultsSummaryProps) {
  const summary = computeFilingSummary(answers);
  const irisRows = resolveIrisFieldMap(summary, answers);
  const wealthSummary = computeWealthSummary(answers);
  const reconciliation = computeReconciliation(answers, summary, wealthSummary);
  const netCopy = NET_POSITION_COPY[summary.netPosition.type];
  const boundSaveFiling = saveFilingAction.bind(null, answers);

  return (
    <div className="flex flex-col gap-6">
      {!summary.verified && (
        <div className="rounded-md border border-owe/50 bg-owe/10 px-5 py-4 text-sm leading-relaxed text-paper-ink">
          <p className="font-medium text-owe">Unverified tax year figures</p>
          <p className="mt-1">
            {summary.slabSource}. The numbers below use placeholder {summary.taxYear} slab
            rates and should not be relied on for filing until confirmed.
          </p>
        </div>
      )}

      <div className="rounded-lg bg-paper p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] sm:p-8">
        <p className="font-data text-xs uppercase tracking-[0.18em] text-paper-ink-soft">
          {summary.taxYear} · salaried income
        </p>
        <p className={`mt-1 font-display text-4xl font-medium sm:text-5xl ${netCopy.colorClass}`}>
          PKR {formatPkr(summary.netPosition.amount)}
        </p>
        <p className="mt-1 text-sm text-paper-ink-soft">{netCopy.label}</p>

        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-paper-muted pt-6 text-sm">
          <dt className="text-paper-ink-soft">Taxable salary income</dt>
          <dd className="text-right font-data tabular-nums text-paper-ink">
            PKR {formatPkr(summary.salaryTaxableIncome)}
          </dd>
          <dt className="text-paper-ink-soft">Tax before credits</dt>
          <dd className="text-right font-data tabular-nums text-paper-ink">
            PKR {formatPkr(summary.taxBeforeCredits)}
          </dd>
          {summary.donationCredit > 0 && (
            <>
              <dt className="text-paper-ink-soft">Donation credit (Section 61)</dt>
              <dd className="text-right font-data tabular-nums text-refund">
                − PKR {formatPkr(summary.donationCredit)}
              </dd>
            </>
          )}
          <dt className="text-paper-ink-soft">Tax after credits</dt>
          <dd className="text-right font-data tabular-nums text-paper-ink">
            PKR {formatPkr(summary.taxAfterCredits)}
          </dd>
          <dt className="text-paper-ink-soft">Already deducted by employer</dt>
          <dd className="text-right font-data tabular-nums text-paper-ink">
            PKR {formatPkr(summary.salaryWithheld)}
          </dd>
        </dl>

        {canSave && (
          <form action={boundSaveFiling} className="mt-6 border-t border-paper-muted pt-6">
            <button
              type="submit"
              className="rounded-md bg-brass px-5 py-2.5 text-sm font-medium text-paper-ink transition-colors hover:bg-brass-strong"
            >
              Save this filing
            </button>
            <p className="mt-2 text-xs text-paper-ink-soft">
              You&apos;ll be asked to log in or sign up first if you haven&apos;t already.
            </p>
          </form>
        )}

        {filingId && (
          <div className="mt-6 border-t border-paper-muted pt-6">
            <a
              href={`/results/${filingId}/pdf`}
              className="inline-block rounded-md bg-brass px-5 py-2.5 text-sm font-medium text-paper-ink transition-colors hover:bg-brass-strong"
            >
              Download PDF
            </a>
          </div>
        )}
      </div>

      <div className="rounded-lg bg-paper p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] sm:p-8">
        <h3 className="font-display text-xl font-medium text-paper-ink">
          Your employer{summary.employmentBreakdown.length > 1 ? "s" : ""} this year
        </h3>
        <div className="mt-4">
          <EmploymentBreakdownTable rows={summary.employmentBreakdown} />
        </div>
      </div>

      <div className="rounded-lg bg-paper p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] sm:p-8">
        <h3 className="font-display text-xl font-medium text-paper-ink">
          Which slab your income falls into
        </h3>
        <div className="mt-4">
          <SlabBreakdownTable rows={summary.slabBreakdown} />
        </div>
      </div>

      {summary.bankProfit && (
        <div className="rounded-lg bg-paper p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] sm:p-8">
          <h3 className="font-display text-xl font-medium text-paper-ink">Bank profit</h3>
          <p className="mt-2 text-sm leading-relaxed text-paper-ink-soft">
            Bank profit is taxed separately under Pakistan&apos;s final tax regime — the tax
            your bank already withheld is treated as settled and isn&apos;t combined with your
            salary slab calculation above. If your bank profit is unusually large, this may
            need different treatment — check with a tax professional.
          </p>
          <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <dt className="text-paper-ink-soft">Bank profit earned</dt>
            <dd className="text-right font-data tabular-nums text-paper-ink">
              PKR {formatPkr(summary.bankProfit.amount)}
            </dd>
            <dt className="text-paper-ink-soft">Tax withheld by bank</dt>
            <dd className="text-right font-data tabular-nums text-paper-ink">
              PKR {formatPkr(summary.bankProfit.taxWithheld)}
            </dd>
          </dl>
        </div>
      )}

      <div className="rounded-lg bg-paper p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] sm:p-8">
        <h3 className="font-display text-xl font-medium text-paper-ink">Your wealth statement</h3>
        <div className="mt-4">
          <WealthSummaryTable summary={wealthSummary} />
        </div>
      </div>

      <div className="rounded-lg bg-paper p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] sm:p-8">
        <h3 className="font-display text-xl font-medium text-paper-ink">Your personal expenses</h3>
        <p className="mt-2 text-xs leading-relaxed text-paper-ink-soft">
          Same categories IRIS asks for under Personal Expenses — these numbers can go
          straight into IRIS&apos;s &quot;+ Expenses&quot; picker there.
        </p>
        <div className="mt-4">
          <PersonalExpensesTable entries={answers.personalExpenseEntries ?? []} />
        </div>
      </div>

      <div className="rounded-lg bg-paper p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] sm:p-8">
        <h3 className="font-display text-xl font-medium text-paper-ink">Reconciliation check</h3>
        <p className="mt-2 text-xs leading-relaxed text-paper-ink-soft">
          TaxWizard&apos;s own simplified estimate of whether your income minus expenses and
          tax explains how your net worth changed this year — not a guaranteed match to
          IRIS&apos;s own Reconciliation of Net Assets calculation, which uses more detail
          than this wizard collects.
        </p>

        {reconciliation.flag !== "reconciled" && (
          <div className="mt-4 rounded-md border border-owe/50 bg-owe/10 px-4 py-3 text-sm leading-relaxed text-paper-ink">
            <p className="font-medium text-owe">
              {reconciliation.flag === "underdeclared"
                ? "Your assets grew by more than your declared income, expenses, and tax explain."
                : "Your declared income implies more asset growth than you actually have."}
            </p>
            <p className="mt-1 text-xs">
              {reconciliation.flag === "underdeclared"
                ? "This usually means some income or an asset isn't fully declared yet — double-check before filing."
                : "This usually means your personal expenses estimate is too low, or an asset is missing — double-check before filing."}
              {" "}If it doesn&apos;t resolve after reviewing your answers, this is worth a
              tax professional&apos;s eyes rather than guessing.
            </p>
          </div>
        )}
        {reconciliation.flag === "reconciled" && (
          <p className="mt-4 text-sm text-refund">
            Looks consistent — your declared income, expenses, and tax roughly explain your
            net worth change this year.
          </p>
        )}

        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <dt className="text-paper-ink-soft">Net assets, start of year</dt>
          <dd className="text-right font-data tabular-nums text-paper-ink">
            PKR {formatPkr(reconciliation.netAssetsPreviousYear)}
          </dd>
          <dt className="text-paper-ink-soft">Total income this year</dt>
          <dd className="text-right font-data tabular-nums text-paper-ink">
            PKR {formatPkr(reconciliation.totalIncome)}
          </dd>
          <dt className="text-paper-ink-soft">Personal expenses</dt>
          <dd className="text-right font-data tabular-nums text-paper-ink">
            − PKR {formatPkr(reconciliation.personalExpenses)}
          </dd>
          <dt className="text-paper-ink-soft">Tax paid</dt>
          <dd className="text-right font-data tabular-nums text-paper-ink">
            − PKR {formatPkr(reconciliation.taxPaid)}
          </dd>
          <dt className="font-medium text-paper-ink">Expected net assets now</dt>
          <dd className="text-right font-data tabular-nums font-medium text-paper-ink">
            PKR {formatPkr(reconciliation.expectedNetAssetsCurrentYear)}
          </dd>
          <dt className="font-medium text-paper-ink">Actual net assets now</dt>
          <dd className="text-right font-data tabular-nums font-medium text-paper-ink">
            PKR {formatPkr(reconciliation.actualNetAssetsCurrentYear)}
          </dd>
        </dl>
      </div>

      <div className="rounded-lg bg-paper p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] sm:p-8">
        <h3 className="font-display text-xl font-medium text-paper-ink">Documents to have ready</h3>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-paper-ink-soft">
          {DOCUMENT_CHECKLIST.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg bg-paper p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] sm:p-8">
        <h3 className="font-display text-xl font-medium text-paper-ink">
          Where to enter this in IRIS
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-paper-ink-soft">
          Field names below are best-effort for IRIS 2.0 — FBR changes the portal without
          notice, so confirm the tab and field still match what you see at iris.fbr.gov.pk
          before entering figures.
          {summary.employmentBreakdown.length > 1 &&
            " If you had multiple employers, IRIS lets you add a separate row per employer under the Employment tab — they should sum to the salary income total shown here."}
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-paper-muted text-left text-paper-ink-soft">
                <th className="py-2 pr-4 font-medium">Form → Tab → Field</th>
                <th className="py-2 text-right font-medium">Enter</th>
              </tr>
            </thead>
            <tbody>
              {irisRows.map((row) => (
                <tr key={row.label} className="border-b border-paper-muted/60 align-top">
                  <td className="py-2 pr-4 text-paper-ink">
                    <span className="font-medium">{row.label}</span>
                    {row.code && (
                      <span className="ml-2 font-data text-xs text-brass-strong">
                        code {row.code}
                      </span>
                    )}
                    <br />
                    <span className="text-xs text-paper-ink-soft">
                      {row.form} → {row.tab} → {row.field}
                    </span>
                  </td>
                  <td className="py-2 text-right font-data tabular-nums text-paper-ink">
                    PKR {formatPkr(row.value)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs leading-relaxed text-on-ink-muted">
        TaxWizard is a calculation aid, not tax advice, and is not affiliated with or endorsed
        by FBR. Verify all figures before filing, especially if your situation goes beyond
        straightforward salaried income — consider consulting a tax professional.
      </p>
    </div>
  );
}
