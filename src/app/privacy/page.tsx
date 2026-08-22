import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy notice — TaxWizard",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 py-12">
      <div className="rounded-lg bg-paper p-6 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] sm:p-8">
        <h1 className="font-display text-2xl font-medium text-paper-ink">Privacy notice</h1>

        <div className="mt-6 flex flex-col gap-6 text-sm leading-relaxed text-paper-ink-soft">
          <section>
            <h2 className="font-display text-base font-medium text-paper-ink">
              What we collect
            </h2>
            <p className="mt-2">
              If you create an account, we store your email address. If you save a filing, we
              store the answers you gave the wizard — income figures, employer names, bank
              profit, donations, and wealth statement fields.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-medium text-paper-ink">Why</h2>
            <p className="mt-2">
              Solely to compute your tax summary and let you come back to a saved filing later,
              or download it as a PDF. We don&apos;t use it for anything else.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-medium text-paper-ink">
              Where it&apos;s stored
            </h2>
            <p className="mt-2">
              In a Supabase-managed Postgres database. Saved filing answers are encrypted at the
              column level and are only ever readable by your own account — Row Level Security
              policies restrict every read and write to the signed-in user who owns the row.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-medium text-paper-ink">
              What we don&apos;t do
            </h2>
            <p className="mt-2">
              We never submit anything to FBR or IRIS on your behalf, store your IRIS login, sell
              or share your data with third parties, or run ads or trackers on this site.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-medium text-paper-ink">
              Retention and deletion
            </h2>
            <p className="mt-2">
              Your data is kept until you delete it. You can permanently delete your account and
              every saved filing at any time from{" "}
              <Link href="/account" className="font-medium text-paper-ink underline">
                your account page
              </Link>
              . Deletion is immediate and cannot be undone.
            </p>
          </section>

          <section>
            <h2 className="font-display text-base font-medium text-paper-ink">Contact</h2>
            <p className="mt-2">
              Questions about your data or this notice: hassanjaved405@gmail.com
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
