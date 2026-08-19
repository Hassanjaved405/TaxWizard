import Link from "next/link";
import { SlabStaircase } from "@/components/SlabStaircase";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center px-6 py-20">
      <div className="w-full max-w-2xl">
        <p className="font-data text-xs uppercase tracking-[0.2em] text-brass">
          For salaried employees in Pakistan
        </p>

        <h1 className="mt-4 font-display text-4xl font-medium leading-tight text-on-ink sm:text-5xl">
          Know what you owe before you open IRIS.
        </h1>

        <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-on-ink-muted sm:text-lg">
          Answer a few plain questions about your salary — no tax jargon.
          We&apos;ll work out your tax, your refund or amount due, and
          exactly what to type into FBR&apos;s IRIS portal when you&apos;re
          ready to file.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href="/wizard"
            className="inline-flex items-center gap-2 rounded-md bg-brass px-5 py-3 font-medium text-paper-ink transition-colors hover:bg-brass-strong"
          >
            Start your return
            <span aria-hidden>→</span>
          </Link>
          <span className="text-xs text-on-ink-muted">
            Takes about 5 minutes. Nothing is filed automatically.
          </span>
        </div>

        <div className="mt-16">
          <SlabStaircase />
        </div>
      </div>
    </div>
  );
}
