import Link from "next/link";
import type { Metadata } from "next";
import { signInAction } from "@/lib/supabase/actions";

export const metadata: Metadata = {
  title: "Log in — TaxWizard",
};

export default async function LoginPage(props: PageProps<"/login">) {
  const searchParams = await props.searchParams;
  const error = typeof searchParams.error === "string" ? searchParams.error : undefined;
  const redirectTo =
    typeof searchParams.redirectTo === "string" ? searchParams.redirectTo : "/wizard";

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-12">
      <div className="rounded-lg bg-paper p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] sm:p-8">
        <h1 className="font-display text-2xl font-medium text-paper-ink">Log in</h1>
        <p className="mt-1 text-sm text-paper-ink-soft">
          Save your filing and come back to it later.
        </p>

        <form action={signInAction} className="mt-6 flex flex-col gap-4">
          <input type="hidden" name="redirectTo" value={redirectTo} />
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
              autoComplete="current-password"
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
            Log in
          </button>
        </form>

        <p className="mt-6 text-sm text-paper-ink-soft">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-paper-ink underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
