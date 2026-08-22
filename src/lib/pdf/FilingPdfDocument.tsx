import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { formatPkr } from "@/lib/wizard/format";
import type { FilingSummary } from "@/lib/taxRules/types";
import type { IrisMappingRow } from "@/lib/taxRules/irisMapping";

const styles = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: "Helvetica", color: "#1a1410" },
  title: { fontSize: 18, marginBottom: 2 },
  subtitle: { fontSize: 9, color: "#6b6055", marginBottom: 16 },
  banner: {
    backgroundColor: "#fbe9d9",
    padding: 8,
    marginBottom: 16,
    fontSize: 9,
    borderRadius: 4,
  },
  netAmount: { fontSize: 22, marginBottom: 2 },
  netLabel: { fontSize: 10, color: "#6b6055", marginBottom: 16 },
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 12, marginBottom: 6, fontFamily: "Helvetica-Bold" },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  label: { color: "#6b6055" },
  tableHeaderRow: {
    flexDirection: "row",
    borderBottom: "1 solid #d8cfc2",
    paddingBottom: 4,
    marginBottom: 4,
  },
  tableRow: { flexDirection: "row", paddingVertical: 3, borderBottom: "0.5 solid #ece5d8" },
  colWide: { flex: 3 },
  col: { flex: 1, textAlign: "right" },
  footer: { marginTop: 24, fontSize: 8, color: "#6b6055", lineHeight: 1.4 },
});

interface FilingPdfDocumentProps {
  summary: FilingSummary;
  irisRows: IrisMappingRow[];
}

export function FilingPdfDocument({ summary, irisRows }: FilingPdfDocumentProps) {
  return (
    <Document title="TaxWizard filing summary">
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>TaxWizard — filing summary</Text>
        <Text style={styles.subtitle}>{summary.taxYear} · salaried income</Text>

        {!summary.verified && (
          <View style={styles.banner}>
            <Text>
              Unverified tax year figures: {summary.slabSource}. Do not rely on these numbers
              for filing until confirmed.
            </Text>
          </View>
        )}

        <Text style={styles.netAmount}>PKR {formatPkr(summary.netPosition.amount)}</Text>
        <Text style={styles.netLabel}>
          {summary.netPosition.type === "refund"
            ? "Refund due to you"
            : summary.netPosition.type === "payable"
              ? "Amount you owe"
              : "You're settled — nothing owed or due"}
        </Text>

        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Taxable salary income</Text>
            <Text>PKR {formatPkr(summary.salaryTaxableIncome)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tax before credits</Text>
            <Text>PKR {formatPkr(summary.taxBeforeCredits)}</Text>
          </View>
          {summary.donationCredit > 0 && (
            <View style={styles.row}>
              <Text style={styles.label}>Donation credit (Section 61)</Text>
              <Text>- PKR {formatPkr(summary.donationCredit)}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Tax after credits</Text>
            <Text>PKR {formatPkr(summary.taxAfterCredits)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Already deducted by employer(s)</Text>
            <Text>PKR {formatPkr(summary.salaryWithheld)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your employers this year</Text>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.colWide}>Employer</Text>
            <Text style={styles.col}>Months</Text>
            <Text style={styles.col}>Income</Text>
            <Text style={styles.col}>Tax withheld</Text>
          </View>
          {summary.employmentBreakdown.map((row, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colWide}>{row.employerName?.trim() || `Employer ${i + 1}`}</Text>
              <Text style={styles.col}>{row.monthsWorked}</Text>
              <Text style={styles.col}>{formatPkr(row.periodIncome)}</Text>
              <Text style={styles.col}>{formatPkr(row.taxDeducted)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Which slab your income falls into</Text>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.colWide}>Bracket (PKR)</Text>
            <Text style={styles.col}>Rate</Text>
            <Text style={styles.col}>Amount</Text>
            <Text style={styles.col}>Tax</Text>
          </View>
          {summary.slabBreakdown.map((row, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colWide}>
                {formatPkr(row.min)} – {row.max === null ? "and above" : formatPkr(row.max)}
              </Text>
              <Text style={styles.col}>{Math.round(row.rate * 100)}%</Text>
              <Text style={styles.col}>{formatPkr(row.amountInBracket)}</Text>
              <Text style={styles.col}>{formatPkr(row.taxForBracket)}</Text>
            </View>
          ))}
        </View>

        {summary.bankProfit && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Bank profit (final tax regime)</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Bank profit earned</Text>
              <Text>PKR {formatPkr(summary.bankProfit.amount)}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Tax withheld by bank</Text>
              <Text>PKR {formatPkr(summary.bankProfit.taxWithheld)}</Text>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Where to enter this in IRIS</Text>
          <View style={styles.tableHeaderRow}>
            <Text style={styles.colWide}>Form / Tab / Field</Text>
            <Text style={styles.col}>Enter</Text>
          </View>
          {irisRows.map((row, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.colWide}>
                {row.label} — {row.form} → {row.tab} → {row.field}
              </Text>
              <Text style={styles.col}>PKR {formatPkr(row.value)}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          TaxWizard is a calculation aid, not tax advice, and is not affiliated with or
          endorsed by FBR. Verify all figures before filing, especially if your situation
          goes beyond straightforward salaried income — consider consulting a tax
          professional. Field names for IRIS are best-effort and may not match the live
          portal exactly; confirm before entering figures.
        </Text>
      </Page>
    </Document>
  );
}
