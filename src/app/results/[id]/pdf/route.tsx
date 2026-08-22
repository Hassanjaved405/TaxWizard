import { renderToBuffer } from "@react-pdf/renderer";
import { getFiling } from "@/lib/supabase/filings";
import { isEncryptionConfigured, isSupabaseConfigured } from "@/lib/supabase/config";
import { computeFilingSummary } from "@/lib/taxRules/calculate";
import { resolveIrisFieldMap } from "@/lib/taxRules/irisMapping";
import { FilingPdfDocument } from "@/lib/pdf/FilingPdfDocument";

export async function GET(_request: Request, { params }: RouteContext<"/results/[id]/pdf">) {
  if (!isSupabaseConfigured() || !isEncryptionConfigured()) {
    return new Response("Not found", { status: 404 });
  }

  const { id } = await params;

  const answers = await getFiling(id);
  if (!answers) {
    return new Response("Not found", { status: 404 });
  }

  const summary = computeFilingSummary(answers);
  const irisRows = resolveIrisFieldMap(summary, answers);
  const buffer = await renderToBuffer(
    <FilingPdfDocument summary={summary} irisRows={irisRows} />,
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="taxwizard-filing.pdf"',
    },
  });
}
