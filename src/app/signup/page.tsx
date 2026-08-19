import Link from "next/link";
import type { Metadata } from "next";
import { signUpAction } from "@/lib/supabase/actions";

export const metadata: Metadata = {
  title: "Sign up — TaxWizard",
};

export default async function SignupPage(props: PageProps<"/signup">) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : undefined;
  const checkEmail = searchParams.checkEmail === "1";

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-12">
      <div className="rounded-lg bg-paper p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] sm:p-8">
        <h1 className="font-display text-2xl font-medium text-paper-ink">Sign up</h1>
        <p className="mt-1 text-sm text-paper-ink-soft">
          Create an account to save your filing and come back to it later.
        </p>

        {checkEmail ? (
          <p className="mt-6 rounded-md border border-brass-strong/40 bg-brass/10 px-4 py-3 text-sm leading-relaxed text-paper-ink">
            Check your email for a confirmation link, then come back and log in.
          </p>
        ) : (
          <>
            <form action={signUpAction} className="mt-6 flex flex-col gap-4">
              <div>
                <label htmlFor="email" className="mb-1 block text-xs text-paper-ink-soft">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full rounded-md border border-paper-muted bg-white/60 px-4 py-2.5 text-sm text-paper-ink outline-none focus-within:border-brass-strong"
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-1 block text-xs text-paper-ink-soft">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
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
                className="mt-2 rounded-md bg-brass px-6 py-3 font-medium text-paper-ink transition-colors hover:bg-brass-strong"
              >
                Sign up
              </button>
            </form>

            <p className="mt-6 text-sm text-paper-ink-soft">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-paper-ink underline">
                Log in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
