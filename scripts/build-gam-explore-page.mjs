import fs from "node:fs";
import path from "node:path";

const root = path.join(import.meta.dirname, "..");
const src = path.join(root, "src/components/GamImmersiveLp.tsx");
const out = path.join(root, "src/components/gam/GamExplorePage.tsx");

const lines = fs.readFileSync(src, "utf8").split(/\r?\n/);
let body = lines.slice(823, 1785).join("\n");
body = body.replaceAll("RevealMaskLine", "GamRevealMaskLine");
body = body.replace('href: "#miraireach-system"', 'href: "/#miraireach-system"');

const header = `"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  Megaphone,
  MousePointerClick,
  Rocket,
  Target,
} from "lucide-react";
import RevealStaggerGroup from "@/components/miraireach/RevealStaggerGroup";
import ScrollParallax from "@/components/miraireach/ScrollParallax";
import MagneticLink from "@/components/miraireach/MagneticLink";
import GamRevealMaskLine from "@/components/gam/GamRevealMaskLine";
import {
  ADS_EDITORIAL_MOBILE,
  ADS_EDITORIAL_SIDE,
  CREAM,
  EASE,
  G_ADS_PRIMARY,
  G_BRAND_BAR,
  GOLD,
  INK,
  MUTED,
} from "@/components/gam/gam-lp-tokens";
import { GAM_MISSION_AND_VISION_BLOCKS } from "@/content/gamAboutCopy";
import { GAM_FAQ_ITEMS } from "@/content/gamFaq";
import { GOOGLE_AI_ADS_WHY_CHOOSE } from "@/content/googleAiAdsCopy";
import { MIRAIREACH_SYSTEM_URL } from "@/lib/miraireach-links";

const EXPLORE_NAV = [
  { label: "Google AI Ads", href: "#google-ai-ads" },
  { label: "Mission", href: "#story" },
  { label: "What we offer", href: "#what-we-offer" },
  { label: "How it connects", href: "#how-it-connects" },
  { label: "FAQ", href: "#faq" },
] as const;

function ExplorePageHeader() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 border-b px-6 py-4 backdrop-blur-md md:px-10"
      style={{
        backgroundColor: scrolled ? "rgba(247, 245, 240, 0.94)" : "rgba(247, 245, 240, 0.88)",
        borderColor: "rgba(26, 23, 20, 0.08)",
        color: INK,
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="text-[10px] font-bold uppercase tracking-[0.28em] text-gray-600 hover:text-gray-900">
          ← Home
        </Link>
        <span className="font-serif text-base tracking-wide md:text-lg">
          GAM <span style={{ color: GOLD }}>solutions</span>
        </span>
        <Link
          href="/contact"
          className="rounded-full border border-[#1a1714]/25 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.22em] hover:border-[#1a1714]/45"
        >
          contact
        </Link>
      </div>
      <nav
        className="mx-auto mt-3 flex max-w-6xl flex-wrap gap-x-4 gap-y-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-600"
        aria-label="On this page"
      >
        {EXPLORE_NAV.map((item) => (
          <a key={item.href} href={item.href} className="transition-colors hover:text-gray-900">
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function ExplorePageIntro() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-8%" });
  return (
    <section
      ref={ref}
      className="border-b border-black/[0.06] px-6 py-14 md:px-12 md:py-20"
      style={{ backgroundColor: CREAM }}
    >
      <div className="mx-auto max-w-3xl">
        <motion.p
          className="text-[10px] font-bold uppercase tracking-[0.32em]"
          style={{ color: GOLD }}
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          Services &amp; company
        </motion.p>
        <motion.h1
          className="mt-3 font-serif text-3xl font-medium leading-[1.1] tracking-tight md:text-5xl"
          style={{ color: INK }}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.05, duration: 0.8, ease: EASE }}
        >
          Google AI Ads, mission, and how we{" "}
          <span style={{ color: GOLD }}>connect the stack</span>
        </motion.h1>
        <motion.p
          className="mt-5 text-base font-medium leading-relaxed text-gray-700 md:text-lg"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1, duration: 0.75, ease: EASE }}
        >
          Paid acquisition, capabilities, Dubai &amp; UAE positioning, and FAQs — everything beyond the product
          overview on the homepage.
        </motion.p>
      </div>
    </section>
  );
}

`;

const footer = `

export default function GamExplorePage() {
  useEffect(() => {
    const prev = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = prev;
    };
  }, []);

  return (
    <div className="relative w-full" style={{ backgroundColor: CREAM, color: INK }}>
      <ExplorePageHeader />
      <main>
        <ExplorePageIntro />
        <GoogleAiAdsSection />
        <ManifestoSection />
        <TimelineStrip />
        <CapabilitiesGrid />
        <PlatformStatement />
        <SeoDubaiUaeSection />
        <FaqSection />
        <ClosingCta />
      </main>
    </div>
  );
}
`;

fs.writeFileSync(out, header + body + footer, "utf8");
console.log("wrote", out, "lines", (header + body + footer).split("\n").length);
