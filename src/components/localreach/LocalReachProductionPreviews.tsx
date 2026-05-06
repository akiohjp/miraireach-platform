"use client";

import Image from "next/image";
import {
  Download,
  Droplet,
  Eye,
  FileText,
  Globe,
  LogOut,
  Plus,
  QrCode,
  ShieldCheck,
  Tag,
  UploadCloud,
} from "lucide-react";

const GOLD = "#D4AF37";
const GOLD_DARK = "#B8961C";

const UAE_STORES = [
  { name: "Desert Bean Roasters", city: "Abu Dhabi, UAE", icon: "☕", bg: "#6d4c41", active: false, customers: "756" },
  { name: "Harbor Slice", city: "JLT, Dubai, UAE", icon: "🍕", bg: "#1e3a5f", active: true, customers: "2,034" },
];

function Toggle({ on }: { on: boolean }) {
  return (
    <div
      className="relative h-6 w-11 shrink-0 rounded-full transition-colors"
      style={{ backgroundColor: on ? GOLD : "#d1d5db" }}
      aria-hidden
    >
      <div
        className="absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all"
        style={{ left: on ? "calc(100% - 1.25rem)" : "0.25rem" }}
      />
    </div>
  );
}

/** Master admin — store table (UAE) */
function StoreControlPreview({ dense }: { dense?: boolean }) {
  return (
    <div
      className={`rounded-2xl border border-black/[0.08] bg-[#f4f4f5] shadow-lg ${dense ? "p-4" : "p-5 md:p-6"}`}
    >
      <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 md:text-[10px]">
        LocalReach · Master admin
      </p>
      <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className={`font-bold text-gray-900 ${dense ? "text-base" : "text-lg"}`}>Store Control</h3>
          <p className="mt-1 max-w-md text-[11px] leading-relaxed text-gray-600 md:text-xs">
            Manage all stores in the LocalReach platform. Toggle <span className="font-semibold">is_active</span> to
            activate or deactivate a store.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-gray-800"
          >
            <FileText className="h-3.5 w-3.5" strokeWidth={2} />
            GBP Report
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg bg-gray-900 px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-white"
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
            Add Store
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full min-w-[520px] text-left text-[11px] md:text-xs">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              <th className="px-4 py-3">Store</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Customers</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {UAE_STORES.map((row) => (
              <tr key={row.name} className="border-b border-gray-50 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base"
                      style={{ backgroundColor: row.bg }}
                    >
                      <span className="leading-none">{row.icon}</span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{row.name}</p>
                      <p className="text-[10px] text-gray-500">{row.city}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Toggle on={row.active} />
                    <span className={`font-semibold ${row.active ? "text-gray-900" : "text-gray-400"}`}>
                      {row.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-bold tabular-nums" style={{ color: GOLD_DARK }}>
                    {row.customers}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-gray-700"
                  >
                    <Download className="h-3 w-3" strokeWidth={2} />
                    CSV
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[10px] text-gray-400">Illustrative UI — not connected to live data.</p>
    </div>
  );
}

function ReviewFlowPreview({ dense }: { dense?: boolean }) {
  return (
    <div className={`rounded-2xl border border-black/[0.06] bg-[#faf9f6] shadow-lg ${dense ? "p-4" : "p-5 md:p-6"}`}>
      <p className="text-center text-[10px] font-bold uppercase tracking-[0.35em] text-gray-900">LocalReach</p>
      <div
        className={`mx-auto mt-4 max-w-sm rounded-2xl border border-gray-100 bg-white shadow-md ${dense ? "px-4 py-5" : "px-5 py-6"}`}
        style={{ borderTopWidth: 4, borderTopColor: GOLD }}
      >
        <div className="flex flex-col items-center text-center">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full text-2xl"
            style={{ backgroundColor: `${GOLD}22` }}
            aria-hidden
          >
            🏪
          </div>
          <h4 className="mt-4 font-serif text-xl font-semibold text-gray-800 md:text-2xl">Leave a review</h4>
          <p className="mt-2 text-[12px] leading-relaxed text-gray-500 md:text-sm">
            Share your experience to help others and support our local business. <span aria-hidden>❤️</span>
          </p>
        </div>
        <div className="relative my-6">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gray-200" aria-hidden />
          <div className="relative mx-auto flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white text-xs font-bold text-gray-600">
            1
          </div>
        </div>
        <p className="text-center text-[11px] font-bold uppercase tracking-wide" style={{ color: GOLD }}>
          Step 1 — Rate your visit
        </p>
        <p className="mt-2 text-center text-[11px] text-gray-500">Tap a star to let us know what you think.</p>
        <div className="mt-5 flex justify-center gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <span key={i} className="text-2xl text-gray-200 md:text-3xl" style={{ textShadow: "0 0 0 #e5e7eb" }}>
              ★
            </span>
          ))}
        </div>
        <div
          className="mt-6 flex items-start gap-3 rounded-xl px-3 py-3"
          style={{ backgroundColor: `${GOLD}14` }}
        >
          <ShieldCheck className="h-5 w-5 shrink-0" style={{ color: GOLD }} strokeWidth={2} />
          <p className="text-left text-[11px] leading-relaxed text-gray-700">
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
      className={`rounded-2xl border border-black/[0.08] bg-white shadow-lg ${dense ? "p-4" : "p-5 md:p-6"}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500 md:text-[10px]">
          LocalReach · Dashboard
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-gray-700"
          >
            <Eye className="h-3 w-3" strokeWidth={2} />
            Preview
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-gray-700"
          >
            <LogOut className="h-3 w-3" strokeWidth={2} />
            Sign out
          </button>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl"
          style={{ backgroundColor: "#fce4ec" }}
          aria-hidden
        >
          🌸
        </div>
        <div>
          <h3 className={`font-bold text-gray-900 ${dense ? "text-base" : "text-lg"}`}>Sakura Sushi Dubai</h3>
          <p className="text-[11px] text-gray-500">Store dashboard and content settings</p>
        </div>
      </div>

      <div className={`mt-5 space-y-3 ${dense ? "" : ""}`}>
        <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <UploadCloud className="mt-0.5 h-5 w-5 text-gray-400" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-bold text-gray-900">Store Logo</p>
              <p className="text-[11px] text-gray-500">Upload your store logo</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white px-6 py-4 text-center">
            <UploadCloud className="mx-auto h-6 w-6 text-gray-300" />
            <p className="mt-2 text-[10px] font-medium text-gray-500">Click to upload · PNG or JPG, max 2MB</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Droplet className="mt-0.5 h-5 w-5 text-gray-400" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-bold text-gray-900">Brand Color</p>
              <p className="text-[11px] text-gray-500">Primary brand color</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
            <span className="h-6 w-6 rounded border border-gray-200" style={{ backgroundColor: "#FF6B9D" }} />
            <span className="font-mono text-xs text-gray-700">#FF6B9D</span>
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 text-white">
          <div className="flex items-start gap-3">
            <Tag className="mt-0.5 h-5 w-5 text-gray-400" strokeWidth={1.5} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">Keywords</p>
              <p className="text-[11px] text-gray-400">Add keywords to help customers find your store</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["sushi", "Japanese food", "sashimi", "ramen", "Dubai Marina"].map((k) => (
                  <span
                    key={k}
                    className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold"
                  >
                    {k}
                    <span className="opacity-50">×</span>
                  </span>
                ))}
                <button type="button" className="text-[10px] font-bold uppercase tracking-wide" style={{ color: GOLD }}>
                  + Add
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
          <div className="flex items-start gap-3">
            <Globe className="mt-0.5 h-5 w-5 text-gray-400" strokeWidth={1.5} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-gray-900">Multilingual Content</p>
              <p className="text-[11px] text-gray-500">Manage your store content in multiple languages</p>
              <div className="mt-3 flex gap-1">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    className={`rounded-md px-3 py-1.5 text-[10px] font-bold ${
                      tab === "EN" ? "bg-gray-900 text-white" : "bg-white text-gray-600 border border-gray-200"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <label className="mt-4 block">
                <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Store Name</span>
                <input
                  type="text"
                  readOnly
                  className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900"
                  value="Sakura Sushi Dubai"
                />
              </label>
              <label className="mt-3 block">
                <span className="text-[10px] font-bold uppercase tracking-wide text-gray-500">Store Description</span>
                <textarea
                  readOnly
                  rows={2}
                  className="mt-1 w-full resize-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                  value="Authentic Japanese cuisine made with fresh ingredients in the UAE."
                />
              </label>
              <p className="mt-3 flex items-center gap-1.5 text-[10px] text-gray-500">
                <span className="text-green-600">✓</span> All changes are saved automatically
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-gray-100 bg-gray-50/80 p-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3 sm:flex-1">
            <QrCode className="mt-0.5 h-5 w-5 text-gray-400" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-bold text-gray-900">QR Code</p>
              <p className="text-[11px] text-gray-500">Scan to view your store page</p>
              <button
                type="button"
                className="mt-3 inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-[10px] font-bold text-gray-800"
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
              width={120}
              height={120}
              className="rounded-lg border border-gray-200 bg-white p-1"
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type LocalReachProductionPreviewsProps = {
  /** Tighter spacing and type for embedded LP column */
  embedded?: boolean;
  className?: string;
};

/**
 * Static, representative UI previews of the LocalReach admin & customer flows (UAE context).
 */
export default function LocalReachProductionPreviews({ embedded = false, className = "" }: LocalReachProductionPreviewsProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center lg:text-left">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: GOLD }}>
          Production previews
        </p>
        <p className="mt-1 text-sm font-semibold text-gray-700">
          Representative dashboards &amp; review flow — built for Dubai &amp; UAE operators.
        </p>
      </div>
      <div className={`grid gap-6 ${embedded ? "" : "lg:gap-8"} lg:grid-cols-1 xl:grid-cols-1`}>
        <StoreControlPreview dense={embedded} />
        <div className={`grid gap-6 ${embedded ? "grid-cols-1" : "lg:grid-cols-2"}`}>
          <ReviewFlowPreview dense={embedded} />
          <StoreDashboardPreview dense={embedded} />
        </div>
      </div>
    </div>
  );
}
