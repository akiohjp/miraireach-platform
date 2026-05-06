import type { Metadata } from "next";
import { Urbanist, Geist_Mono, Noto_Sans_Arabic, Cormorant_Garamond } from "next/font/google";
import Footer from "@/components/Footer";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "GAM solutions L.L.C-FZ | Dubai & UAE AI Marketing, GEO & Digital Marketing",
    template: "%s | GAM solutions",
  },
  description:
    "GAM solutions: Dubai and UAE-focused AI marketing, digital marketing, GEO, and Dubai AIO — mirAIreach, LocalReach, and campaigns for operators across the Emirates.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "GAM solutions L.L.C-FZ",
    title: "GAM solutions L.L.C-FZ | Dubai & UAE AI Marketing & GEO",
    description:
      "Dubai and UAE AI marketing, digital marketing, GEO (generative engine optimization), and Dubai AIO visibility for businesses in the Emirates.",
    locale: "en_AE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-AE"
      dir="ltr"
      className={`${urbanist.variable} ${cormorant.variable} ${geistMono.variable} ${notoArabic.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <Footer />
      </body>
    </html>
  );
}

