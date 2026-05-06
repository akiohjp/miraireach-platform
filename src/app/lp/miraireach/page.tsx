import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "mirAIreach | GAM solutions",
  description: "mirAIreach platform — product overview (in preparation).",
};

export default function MirAIreachLpPlaceholderPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f7f5f0] px-6 py-20 text-center text-[#1a1714]">
      <p className="mb-6 text-[10px] uppercase tracking-[0.35em] text-[#b8961c]">mirAIreach</p>
      <h1 className="mb-4 max-w-2xl font-serif text-3xl leading-tight md:text-5xl">
        Dedicated product page is in preparation.
      </h1>
      <p className="mb-10 max-w-md text-sm leading-relaxed text-gray-600">
        A full overview of the mirAIreach platform will be published here. Until then, explore LocalReach or get in touch.
      </p>
      <div className="flex flex-col gap-4 text-[11px] font-bold uppercase tracking-[0.2em] sm:flex-row">
        <Link
          href="/localreach"
          className="rounded-full bg-[#D4AF37] px-8 py-3 text-black transition-opacity hover:opacity-90"
        >
          LocalReach
        </Link>
        <Link href="/contact" className="rounded-full border border-black/15 px-8 py-3 transition-colors hover:border-black/30">
          Contact
        </Link>
      </div>
      <Link href="/" className="mt-12 text-xs text-gray-500 underline underline-offset-4 hover:text-gray-800">
        Back to home
      </Link>
    </div>
  );
}
