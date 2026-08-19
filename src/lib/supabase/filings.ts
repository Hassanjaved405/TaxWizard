import { createClient } from "@/lib/supabase/server";
import type { WizardAnswers } from "@/lib/wizard/types";

export async function saveFiling(answers: WizardAnswers): Promise<string> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Must be signed in to save a filing.");
  }

  const { data, error } = await supabase
    .from("filings")
    .insert({
      user_id: user.id,
      tax_year: answers.taxYear ?? "TY2026",
      answers,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data.id as string;
}

export async function getFiling(id: string): Promise<WizardAnswers | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("filings")
    .select("answers")
    .eq("id", id)
    .single();

  if (error) return null;
  return data.answers as WizardAnswers;
}
