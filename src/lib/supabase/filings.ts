import { createClient } from "@/lib/supabase/server";
import { requireEncryptionKey } from "@/lib/supabase/config";
import type { WizardAnswers } from "@/lib/wizard/types";

export async function saveFiling(answers: WizardAnswers): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Must be signed in to save a filing.");
  }

  const { data, error } = await supabase.rpc("insert_filing", {
    p_tax_year: answers.taxYear ?? "TY2026",
    p_answers: JSON.stringify(answers),
    p_key: requireEncryptionKey(),
  });

  if (error) throw error;
  return data as string;
}

export async function getFiling(id: string): Promise<WizardAnswers | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_filing_answers", {
    p_id: id,
    p_key: requireEncryptionKey(),
  });

  if (error || !data) return null;
  return JSON.parse(data as string) as WizardAnswers;
}
