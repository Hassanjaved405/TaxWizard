import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/lib/supabase/actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function AuthNav() {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Link href="/login" className="text-xs font-medium text-on-ink-muted hover:text-on-ink">
        Log in
      </Link>
    );
  }

  return (
    <form action={signOutAction} className="flex items-center gap-3">
      <span className="text-xs text-on-ink-muted">{user.email}</span>
      <button type="submit" className="text-xs font-medium text-on-ink-muted hover:text-on-ink">
        Sign out
      </button>
    </form>
  );
}
