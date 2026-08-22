import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getFiling } from "@/lib/supabase/filings";
import { isEncryptionConfigured, isSupabaseConfigured } from "@/lib/supabase/config";
import { ResultsSummary } from "@/components/results/ResultsSummary";

export const metadata: Metadata = {
  title: "Your saved filing — TaxWizard",
};

export default async function SavedFilingPage(props: PageProps<"/results/[id]">) {
  if (!isSupabaseConfigured() || !isEncryptionConfigured()) notFound();

  const { id } = await props.params;

  // getFiling is RLS-scoped: a missing row and a row owned by someone else
  // are indistinguishable here on purpose — both surface as a plain 404.
  const answers = await getFiling(id);
  if (!answers) notFound();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-12">
      <ResultsSummary answers={answers} filingId={id} />
    </div>
  );
}
