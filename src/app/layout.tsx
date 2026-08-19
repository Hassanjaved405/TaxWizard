import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "TaxWizard — plain-language FBR filing prep",
  description:
    "Answer a few plain questions about your salary and see your tax, your refund, and exactly what to enter in FBR's IRIS portal.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plexSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-on-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-brass focus:px-3 focus:py-2 focus:text-paper-ink"
        >
          Skip to content
        </a>

        <header className="border-b border-ink-line bg-ink-raised">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-3">
            <Link href="/" className="flex items-center gap-2 font-display text-lg font-medium text-on-ink">
              <span aria-hidden className="text-brass">✎</span>
              TaxWizard
            </Link>
            <p className="text-xs text-on-ink-muted">
              Independent calculation aid — not affiliated with, endorsed by, or
              connected to FBR or IRIS. You file your own return.
            </p>
          </div>
        </header>

        <main id="main" className="flex flex-1 flex-col">
          {children}
        </main>

        <footer className="border-t border-ink-line">
          <div className="mx-auto max-w-5xl px-6 py-6 text-xs leading-relaxed text-on-ink-muted">
            <p>
              TaxWizard estimates your income tax and prepares a filing guide.
              It does not submit anything to FBR/IRIS on your behalf, store
              your IRIS login, or provide legal or professional tax advice.
              Verify all figures before filing, especially if your situation
              goes beyond simple salaried income.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
