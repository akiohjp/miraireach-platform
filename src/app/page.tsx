import type { Metadata } from "next";
import GamImmersiveLp from "@/components/GamImmersiveLp";
import { GAM_FAQ_ITEMS } from "@/content/gamFaq";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Dubai & UAE AI Marketing | GEO, AIO & Digital Marketing | GAM solutions",
  description:
    "Dubai and UAE AI marketing and digital marketing for ambitious operators: GEO (generative engine optimization), Dubai AIO visibility, AI search, maps, reviews, and performance campaigns across the Emirates.",
  keywords: [
    "AI marketing",
    "AI",
    "Dubai AIO",
    "AIO",
    "AI search",
    "AI Overviews",
    "GEO",
    "generative engine optimization",
    "UAE",
    "United Arab Emirates",
    "Dubai",
    "Dubai marketing",
    "digital marketing",
    "Emirates",
    "mirAIreach",
    "LocalReach",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "GAM solutions L.L.C-FZ",
    title: "Dubai & UAE AI Marketing | GEO, AIO & Digital Marketing | GAM solutions",
    description:
      "AI marketing, GEO, and Dubai AIO for businesses in Dubai and the UAE — built for AI discovery, maps, and performance.",
    locale: "en_AE",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "GAM solutions — Dubai & UAE AI marketing" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dubai & UAE AI Marketing | GEO & AIO | GAM solutions",
    description:
      "AI marketing, digital marketing, GEO, and Dubai AIO for Dubai and the UAE.",
    images: [{ url: "/twitter-image", width: 1200, height: 630, alt: "GAM solutions — Dubai & UAE AI marketing" }],
  },
};

const professionalServiceJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "GAM solutions L.L.C-FZ",
  url: siteUrl,
  description:
    "AI marketing and digital marketing in Dubai and the UAE: GEO (generative engine optimization), Dubai AIO programs, reputation, maps, and campaign infrastructure for operators across the Emirates.",
  areaServed: [
    { "@type": "City", name: "Dubai" },
    { "@type": "AdministrativeArea", name: "Dubai" },
    { "@type": "Country", name: "United Arab Emirates" },
  ],
  knowsAbout: [
    "AI marketing",
    "AI",
    "Digital marketing",
    "Dubai marketing",
    "GEO",
    "Generative engine optimization",
    "Dubai AIO",
    "AIO",
    "UAE digital strategy",
    "Emirates",
  ],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: GAM_FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <GamImmersiveLp />
    </>
  );
}
