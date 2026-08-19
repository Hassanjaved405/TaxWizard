"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { saveFiling } from "@/lib/supabase/filings";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { WizardAnswers } from "@/lib/wizard/types";

const NOT_CONFIGURED_ERROR = "Supabase isn't configured yet — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.";

export async function signUpAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect(`/signup?error=${encodeURIComponent(NOT_CONFIGURED_ERROR)}`);
  }
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/signup?checkEmail=1");
}

export async function signInAction(formData: FormData) {
  const redirectTo = String(formData.get("redirectTo") || "/wizard");
  if (!isSupabaseConfigured()) {
    redirect(
      `/login?error=${encodeURIComponent(NOT_CONFIGURED_ERROR)}&redirectTo=${encodeURIComponent(redirectTo)}`,
    );
  }
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(
      `/login?error=${encodeURIComponent(error.message)}&redirectTo=${encodeURIComponent(redirectTo)}`,
    );
  }
  redirect(redirectTo);
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function saveFilingAction(answers: WizardAnswers) {
  if (!isSupabaseConfigured()) {
    redirect(`/login?error=${encodeURIComponent(NOT_CONFIGURED_ERROR)}&redirectTo=/wizard`);
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/wizard");
  }

  const id = await saveFiling(answers);
  redirect(`/results/${id}`);
}
