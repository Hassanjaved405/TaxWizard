import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — bypasses Row Level Security entirely. Only ever
 * import this from src/lib/supabase/actions.ts (a "use server" file), and
 * only to call auth.admin.* on the signed-in user's own account. Never
 * import it from a page, component, or anything a client bundle could pull
 * in — SUPABASE_SERVICE_ROLE_KEY must never reach the browser.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
}
