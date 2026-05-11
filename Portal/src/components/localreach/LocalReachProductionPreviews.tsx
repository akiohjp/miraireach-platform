"use client";

import Image from "next/image";
import {
  Download,
  Droplet,
  Eye,
  Globe,
  LogOut,
  QrCode,
  ShieldCheck,
  Tag,
  UploadCloud,
} from "lucide-react";

const GOLD = "#D4AF37";

function ReviewFlowPreview({ dense }: { dense?: boolean }) {
  return (
    <div className={`rounded-2xl border border-black/[0.06] bg-[#faf9f6] shadow-lg ${dense ? "p-3.5" : "p-5 md:p-6"}`}>
      <p className="text-center text-[10px] font-bold uppercase tracking-[0.35em] text-gray-900">LocalReach</p>
      <div
        className={`mx-auto mt-3 max-w-sm rounded-2xl border border-gray-100 bg-white shadow-md ${dense ? "px-3.5 py-4" : "px-5 py-6"}`}
        style={{ borderTopWidth: 4, borderTopColor: GOLD }}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full text-xl md:h-14 md:w-14 md:text-2xl"
            style={{ backgroundColor: `${GOLD}22` }}
            aria-hidden
          >
            🏪
          </div>
          <h4 className="mt-3 font-serif text-lg font-semibold text-gray-800 md:mt-4 md:text-xl lg:text-2xl">
            Leave a review
          </h4>
          <p className="mt-1.5 text-[11px] leading-relaxed text-gray-500 md:mt-2 md:text-sm">
            Share your experience to help others and support our local business. <span aria-hidden>❤️</span>
          </p>
        </div>
        <div className="relative my-4 md:my-6">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gray-200" aria-hidden />
          <div className="relative mx-auto flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-[11px] font-bold text-gray-600 md:h-7 md:w-7 md:text-xs">
            1
          </div>
        </div>
        <p className="text-center text-[10px] font-bold uppercase tracking-wide md:text-[11px]" style={{ color: GOLD }}>
          Step 1 — Rate your visit
        </p>
        <p className="mt-1.5 text-center text-[10px] text-gray-500 md:mt-2 md:text-[11px]">
          Tap a star to let us know what you think.
        </p>
        <div className="mt-4 flex justify-center gap-0.5 md:mt-5 md:gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="text-xl text-gray-200 md:text-2xl lg:text-3xl">
              ★
            </span>
          ))}
        </div>
        <div
          className="mt-4 flex items-start gap-2.5 rounded-xl px-2.5 py-2.5 md:mt-6 md:gap-3 md:px-3 md:py-3"
          style={{ backgroundColor: `${GOLD}14` }}
        >
          <ShieldCheck className="h-4 w-4 shrink-0 md:h-5 md:w-5" style={{ color: GOLD }} strokeWidth={2} />
          <p className="text-left text-[10px] leading-relaxed text-gray-700 md:text-[11px]">
            Quick, easy, and makes a difference. Your feedback helps us improve.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Store operator dashboard */
function StoreDashboardPreview({ dense }: { dense?: boolean }) {
  const tabs = ["EN", "JA", "AR"] as const;
  return (
    <div
      className={`rounded-2xl border border-black/[0.08] bg-white shadow-lg ${dense ? "p-3.5" : "p-5 md:p-6"}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 md:text-[10px]">
          LocalReach · Dashboard
        </p>
        <div className="flex gap-1.5 md:gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-[9px] font-bold text-gray-700 md:px-2.5 md:py-1.5 md:text-[10px]"
          >
            <Eye className="h-3 w-3" strokeWidth={2} />
            Preview
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2 py-1 text-[9px] font-bold text-gray-700 md:px-2.5 md:py-1.5 md:text-[10px]"
          >
            <LogOut className="h-3 w-3" strokeWidth={2} />
            Sign out
          </button>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2.5 md:mt-4 md:gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg md:h-12 md:w-12 md:text-xl"
          style={{ backgroundColor: "#fce4ec" }}
          aria-hidden
        >
          🌸
        </div>
        <div>
          <h3 className={`font-bold text-gray-900 ${dense ? "text-sm md:text-base" : "text-lg"}`}>Sakura Sushi Dubai</h3>
          <p className="text-[10px] text-gray-500 md:text-[11px]">Store dashboard and content settings</p>
        </div>
      </div>

      <div className="mt-3 space-y-2.5 md:mt-5 md:space-y-3">
        <div className="flex flex-col gap-2.5 rounded-xl border border-gray-100 bg-gray-50/80 p-3 sm:flex-row sm:items-center sm:justify-between md:gap-3 md:p-4">
          <div className="flex items-start gap-2.5 md:gap-3">
            <UploadCloud className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 md:h-5 md:w-5" strokeWidth={1.5} />
            <div>
              <p className="text-xs font-bold text-gray-900 md:text-sm">Store Logo</p>
              <p className="text-[10px] text-gray-500 md:text-[11px]">Upload your store logo</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-4 py-3 text-center md:px-6 md:py-4">
            <UploadCloud className="mx-auto h-5 w-5 text-gray-300 md:h-6 md:w-6" />
            <p className="mt-1.5 text-[9px] font-medium text-gray-500 md:mt-2 md:text-[10px]">
              Click to upload · PNG or JPG, max 2MB
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 rounded-xl border border-gray-100 bg-gray-50/80 p-3 sm:flex-row sm:items-center sm:justify-between md:gap-3 md:p-4">
          <div className="flex items-start gap-2.5 md:gap-3">
            <Droplet className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 md:h-5 md:w-5" strokeWidth={1.5} />
            <div>
              <p className="text-xs font-bold text-gray-900 md:text-sm">Brand Color</p>
              <p className="text-[10px] text-gray-500 md:text-[11px]">Primary brand color</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 md:px-3 md:py-2">
            <span className="h-5 w-5 rounded border border-gray-200 md:h-6 md:w-6" style={{ backgroundColor: "#FF6B9D" }} />
            <span className="font-mono text-[10px] text-gray-700 md:text-xs">#FF6B9D</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-3 text-white md:p-4">
          <div className="flex items-start gap-2.5 md:gap-3">
            <Tag className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 md:h-5 md:w-5" strokeWidth={1.5} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold md:text-sm">Keywords</p>
              <p className="text-[10px] text-gray-400 md:text-[11px]">Add keywords to help customers find your store</p>
              <div className="mt-2 flex flex-wrap gap-1.5 md:mt-3 md:gap-2">
                {["sushi", "Japanese food", "sashimi", "ramen", "Dubai Marina"].map((k) => (
                  <span
                    key={k}
                    className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold md:px-2.5 md:py-1 md:text-[10px]"
                  >
                    {k}
                    <span className="opacity-50">×</span>
                  </span>
                ))}
                <button type="button" className="text-[9px] font-bold uppercase tracking-wide md:text-[10px]" style={{ color: GOLD }}>
                  + Add
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-3 md:p-4">
          <div className="flex items-start gap-2.5 md:gap-3">
            <Globe className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 md:h-5 md:w-5" strokeWidth={1.5} />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-gray-900 md:text-sm">Multilingual Content</p>
              <p className="text-[10px] text-gray-500 md:text-[11px]">Manage your store content in multiple languages</p>
              <div className="mt-2 flex gap-1 md:mt-3">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`rounded-md px-2.5 py-1 text-[9px] font-bold md:px-3 md:py-1.5 md:text-[10px] ${
                      tab === "EN" ? "bg-gray-900 text-white" : "border border-gray-200 bg-white text-gray-600"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <label className="mt-3 block md:mt-4">
                <span className="text-[9px] font-bold uppercase tracking-wide text-gray-500 md:text-[10px]">Store Name</span>
                <input
                  type="text"
                  readOnly
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-900 md:px-3 md:py-2 md:text-sm"
                  value="Sakura Sushi Dubai"
                />
              </label>
              <label className="mt-2 block md:mt-3">
                <span className="text-[9px] font-bold uppercase tracking-wide text-gray-500 md:text-[10px]">Store Description</span>
                <textarea
                  readOnly
                  rows={2}
                  className="mt-1 w-full resize-none rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs text-gray-700 md:px-3 md:py-2 md:text-sm"
                  value="Authentic Japanese cuisine made with fresh ingredients in the UAE."
                />
              </label>
              <p className="mt-2 flex items-center gap-1.5 text-[9px] text-gray-500 md:mt-3 md:text-[10px]">
                <span className="text-green-600">✓</span> All changes are saved automatically
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-3 sm:flex-row sm:items-center md:gap-4 md:p-4">
          <div className="flex items-start gap-2.5 sm:flex-1 md:gap-3">
            <QrCode className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 md:h-5 md:w-5" strokeWidth={1.5} />
            <div>
              <p className="text-xs font-bold text-gray-900 md:text-sm">QR Code</p>
              <p className="text-[10px] text-gray-500 md:text-[11px]">Scan to view your store page</p>
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-[9px] font-bold text-gray-800 md:mt-3 md:px-3 md:py-2 md:text-[10px]"
              >
                <Download className="h-3 w-3" />
                Download PNG
              </button>
            </div>
          </div>
          <div className="flex justify-center sm:mx-0">
            <Image
              src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https%3A%2F%2Fmiraireach.marketing%2Flocalreach"
              alt=""
              width={112}
              height={112}
              className="rounded-lg border border-gray-200 bg-white p-1 md:h-[120px] md:w-[120px]"
              unoptimized
            />
          </div>
        </div>
      </div>
      <p className="mt-2.5 text-[9px] text-gray-400 md:mt-3 md:text-[10px]">Illustrative UI — not connected to live data.</p>
    </div>
  );
}

type LocalReachProductionPreviewsProps = {
  /** Tighter spacing and type for embedded LP column */
  embedded?: boolean;
  className?: string;
};

/**
 * Static previews: review capture flow + store dashboard (UAE context).
 */
export default function LocalReachProductionPreviews({ embedded = false, className = "" }: LocalReachProductionPreviewsProps) {
  const gap = embedded ? "gap-4" : "gap-5 md:gap-6";
  return (
    <div className={`space-y-3 md:space-y-4 ${className}`}>
      <div className="text-center lg:text-left">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: GOLD }}>
          Production previews
        </p>
        <p className="mt-0.5 text-xs font-semibold text-gray-700 md:text-sm">
          Store dashboard &amp; customer review flow — Dubai &amp; UAE operators.
        </p>
      </div>
      <div
        className={`grid ${gap} items-start ${embedded ? "grid-cols-1" : "sm:grid-cols-2"}`}
      >
        <ReviewFlowPreview dense={embedded} />
        <StoreDashboardPreview dense={embedded} />
      </div>
    </div>
  );
}
