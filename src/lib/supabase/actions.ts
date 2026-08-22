"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { saveFiling } from "@/lib/supabase/filings";
import {
  isAdminConfigured,
  isEncryptionConfigured,
  isSupabaseConfigured,
} from "@/lib/supabase/config";
import type { WizardAnswers } from "@/lib/wizard/types";

const NOT_CONFIGURED_ERROR = "Supabase isn't configured yet — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.";
const ENCRYPTION_NOT_CONFIGURED_ERROR = "Saving isn't set up yet — FILINGS_ENCRYPTION_KEY is missing.";

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
  if (!isEncryptionConfigured()) {
    redirect(`/login?error=${encodeURIComponent(ENCRYPTION_NOT_CONFIGURED_ERROR)}&redirectTo=/wizard`);
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

export async function deleteAccountAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  if (!isAdminConfigured()) {
    redirect("/account?error=" + encodeURIComponent("Account deletion isn't set up yet — SUPABASE_SERVICE_ROLE_KEY is missing."));
  }

  const confirmEmail = String(formData.get("confirmEmail") ?? "");
  if (confirmEmail !== user.email) {
    redirect("/account?error=" + encodeURIComponent("Email didn't match — account not deleted."));
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) throw error;

  await supabase.auth.signOut();
  redirect("/?accountDeleted=1");
}
