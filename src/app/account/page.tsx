import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { deleteAccountAction } from "@/lib/supabase/actions";

export const metadata: Metadata = {
  title: "Your account — TaxWizard",
};

export default async function AccountPage(props: PageProps<"/account">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?redirectTo=/account");

  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : undefined;

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-12">
      <div className="rounded-lg bg-paper p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] sm:p-8">
        <h1 className="font-display text-2xl font-medium text-paper-ink">Your account</h1>
        <p className="mt-1 text-sm text-paper-ink-soft">Signed in as {user.email}</p>

        <div className="mt-8 border-t border-owe/40 pt-6">
          <h2 className="font-display text-lg font-medium text-owe">Delete account</h2>
          <p className="mt-2 text-sm leading-relaxed text-paper-ink-soft">
            This permanently deletes your account and every filing you&apos;ve saved. This
            can&apos;t be undone.
          </p>

          <form action={deleteAccountAction} className="mt-4 flex flex-col gap-3">
            <div>
              <label htmlFor="confirmEmail" className="mb-1 block text-xs text-paper-ink-soft">
                Type your email ({user.email}) to confirm
              </label>
              <input
                id="confirmEmail"
                name="confirmEmail"
                type="email"
                required
                className="w-full rounded-md border border-paper-muted bg-white/60 px-4 py-2.5 text-sm text-paper-ink outline-none focus-within:border-brass-strong"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm font-medium text-owe">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="rounded-md border border-owe px-5 py-2.5 text-sm font-medium text-owe transition-colors hover:bg-owe/10"
            >
              Permanently delete my account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
