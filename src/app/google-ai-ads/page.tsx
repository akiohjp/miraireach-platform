import type { Metadata } from "next";
import GamExplorePage from "@/components/gam/GamExplorePage";
import { GAM_FAQ_ITEMS } from "@/content/gamFaq";
import { getOgImageAbsoluteUrl, getSiteUrl, OG_IMAGE_HEIGHT, OG_IMAGE_WIDTH } from "@/lib/site";

const siteUrl = getSiteUrl();
const ogImageUrl = getOgImageAbsoluteUrl();

export const metadata: Metadata = {
  title: "Google AI Ads & Services | Dubai & UAE AI Marketing",
  description:
    "AI-managed Google Ads, GAM solutions mission and capabilities, Dubai & UAE GEO positioning, and FAQs — paid acquisition and company story.",
  alternates: {
    canonical: "/google-ai-ads",
  },
  openGraph: {
    type: "website",
    url: "/google-ai-ads",
    siteName: "GAM solutions L.L.C-FZ",
    title: "Google AI Ads & Services | GAM solutions",
    description:
      "AI-managed Google Ads, capabilities, and FAQs for Dubai and UAE operators.",
    locale: "en_AE",
    images: [
      {
        url: ogImageUrl,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: "GAM solutions — Google AI Ads & services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Google AI Ads & Services | GAM solutions",
    description: "AI-managed Google Ads and full service overview for Dubai & UAE.",
    images: [{ url: ogImageUrl, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: "GAM solutions" }],
  },
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

export default function GoogleAiAdsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <GamExplorePage />
    </>
  );
}
