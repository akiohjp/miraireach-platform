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
  title: "GAM solutions L.L.C-FZ | AI & DX Solutions in Dubai",
  description: "Dubai's leading AI-powered business intelligence platform for DX and AIO.",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "GAM solutions L.L.C-FZ",
    title: "GAM solutions L.L.C-FZ | AI & DX Solutions in Dubai",
    description: "Dubai's leading AI-powered business intelligence platform for DX and AIO.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
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

