import fs from "node:fs";
import path from "node:path";

const file = path.join(import.meta.dirname, "..", "src/components/GamImmersiveLp.tsx");
const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);

const head = lines.slice(0, 822);
const tail = lines.slice(1786); // FilmGrain onward

const teaser = `
function HomeExploreTeaser() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });

  const links = [
    {
      title: "Google AI Ads",
      desc: "AI-managed campaigns, ROI dashboards, and strategic pillars for UAE audiences.",
      href: "/google-ai-ads#google-ai-ads",
    },
    {
      title: "Mission & capabilities",
      desc: "What we offer, how the stack connects, and Dubai / UAE positioning.",
      href: "/google-ai-ads#what-we-offer",
    },
    {
      title: "FAQ",
      desc: "Straight answers on mirAIreach, GEO, and operating in the Emirates.",
      href: "/google-ai-ads#faq",
    },
  ] as const;

  return (
    <section
      ref={ref}
      id="explore-more"
      className="scroll-mt-28 border-t border-black/[0.06] px-6 py-16 md:px-12 md:py-24"
      style={{ backgroundColor: CREAM }}
    >
      <div className="mx-auto max-w-6xl">
        <motion.p
          className="text-[10px] font-bold uppercase tracking-[0.32em]"
          style={{ color: GOLD }}
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: EASE }}
        >
          Go deeper
        </motion.p>
        <motion.h2
          className="mt-3 max-w-2xl font-serif text-3xl font-medium leading-[1.12] tracking-tight md:text-4xl"
          style={{ color: INK }}
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.05, duration: 0.8, ease: EASE }}
        >
          Google AI Ads, company story, and{" "}
          <span style={{ color: GOLD }}>full capabilities</span>
        </motion.h2>
        <motion.p
          className="mt-4 max-w-xl text-base font-medium leading-relaxed text-gray-700"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1, duration: 0.75, ease: EASE }}
        >
          The homepage focuses on products. Everything else — paid media, mission, FAQs — lives on a dedicated page so
          you can scan faster.
        </motion.p>

        <div className="mt-10 grid gap-4 sm:grid-cols-3 md:gap-5">
          {links.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.12 + i * 0.06, duration: 0.75, ease: EASE }}
            >
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-2xl border border-black/[0.08] bg-white/60 p-6 transition-[border-color,box-shadow] hover:border-[#D4AF37]/35 hover:shadow-[0_20px_50px_-28px_rgba(26,23,20,0.18)] md:p-7"
              >
                <h3 className="font-serif text-xl font-medium" style={{ color: INK }}>
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{item.desc}</p>
                <span
                  className="mt-5 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-800 group-hover:text-[#1a1714]"
                >
                  View <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.35, duration: 0.8, ease: EASE }}
        >
          <MagneticLink
            href="/google-ai-ads"
            className="inline-flex items-center gap-2 rounded-sm bg-[#D4AF37] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1a1714]"
          >
            Full services page <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
          </MagneticLink>
          <MagneticLink
            href="/contact"
            className="inline-flex items-center gap-2 border-b border-[#1a1714]/25 pb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1a1714]"
          >
            Book a consultation <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
          </MagneticLink>
        </motion.div>
      </div>
    </section>
  );
}

function HomeClosingCta() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <section ref={ref} className="border-t border-black/[0.06] px-6 py-20 md:px-12 md:py-28" style={{ backgroundColor: "#f0ebe3" }}>
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-3xl leading-[1.1] md:text-5xl" style={{ color: INK }}>
          Ready to be found <span style={{ color: GOLD }}>everywhere?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed" style={{ color: MUTED }}>
          Tell us your Dubai and UAE markets — we&apos;ll map GEO, reputation, and the right product lane.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <MagneticLink
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#D4AF37] px-10 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-black"
          >
            Get started <ArrowUpRight size={16} />
          </MagneticLink>
          <Link href="/google-ai-ads" className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-700 hover:text-gray-900">
            Explore services →
          </Link>
        </div>
      </div>
    </section>
  );
}
`;

let content = [...head, teaser, ...tail].join("\n");

// Update NAV
content = content.replace(
  `const NAV = [
  { label: "mirAIreach system", href: "#miraireach-system" },
  { label: "what we offer", href: "#what-we-offer" },
  { label: "how it connects", href: "#how-it-connects" },
  { label: "LocalReach", href: "/localreach" },
  { label: "about", href: "/about" },
];`,
  `const NAV = [
  { label: "mirAIreach system", href: "#miraireach-system" },
  { label: "LocalReach", href: "#localreach" },
  { label: "services", href: "/google-ai-ads" },
  { label: "about", href: "/about" },
];`,
);

// Update main sections
content = content.replace(
  `        <LocalReachProductSection />
        <GoogleAiAdsSection />
        <ManifestoSection />
        <TimelineStrip />
        <CapabilitiesGrid />
        <PlatformStatement />
        <SeoDubaiUaeSection />
        <FaqSection />
        <ClosingCta />`,
  `        <LocalReachProductSection />
        <HomeExploreTeaser />
        <HomeClosingCta />`,
);

// Hero "What we offer" link
content = content.replace(`href="#what-we-offer"`, `href="/google-ai-ads#what-we-offer"`);

// Remove unused imports
content = content.replace(
  `import { ArrowRight, ArrowUpRight, BarChart3, CheckCircle, ChevronDown, Globe, MapPin, Megaphone, MousePointerClick, Rocket, Star, Target, X } from "lucide-react";`,
  `import { ArrowRight, ArrowUpRight, CheckCircle, Globe, MapPin, Star, X } from "lucide-react";`,
);
content = content.replace(`import { GAM_MISSION_AND_VISION_BLOCKS } from "@/content/gamAboutCopy";\n`, "");
content = content.replace(`import { GAM_FAQ_ITEMS } from "@/content/gamFaq";\n`, "");
content = content.replace(`import { GOOGLE_AI_ADS_WHY_CHOOSE } from "@/content/googleAiAdsCopy";\n`, "");
content = content.replace(`import RevealStaggerGroup from "@/components/miraireach/RevealStaggerGroup";\n`, "");

fs.writeFileSync(file, content, "utf8");
console.log("trimmed", file, "lines", content.split("\n").length);
