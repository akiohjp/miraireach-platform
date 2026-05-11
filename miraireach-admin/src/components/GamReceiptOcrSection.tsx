"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import {
  Camera,
  Check,
  ChevronsRight,
  Circle,
  ImagePlus,
  Loader2,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import { useGamLocale } from "@/components/LocaleProvider";
import { GOLD } from "@/components/gam-branding";
import { getBrowserSupabase } from "@/lib/supabase";
import {
  type GamCurrencyCode,
  gamCurrencyCodes,
  isGamCurrencyCode,
  ledgerExpenseAmountsFromTxMajor,
} from "@/i18n/gam-currency";
import Image from "next/image";
import type { ReceiptGeminiParse } from "@/lib/receipt-gemini-schema";
import { DEMO_RECEIPT_IMAGE_DATA_URL, getPresentationReceiptMock } from "@/lib/receipt-demo-mock";
import type { GamLocale } from "@/i18n/gam-messages";

type Props = {
  orgId: string;
  /** May be empty on first paint; section resolves via auth.getUser(). */
  userId: string;
  functionalCurrency: GamCurrencyCode;
  costCategoryId: string | null;
  categoryLabel: string | null;
  ledgerMemoPrefix: string;
  onPosted: () => void;
  onCopyToKeypad?: (digitsForKeypad: string) => void;
  /** After one-tap demo load: select a default category so OK is ready for slides. */
  onDemoSampleReady?: () => void;
  /** When set, ingest then clear via onIncomingFileConsumed (parent-controlled). */
  incomingFile?: File | null;
  onIncomingFileConsumed?: () => void;
  /** Simpler UI: hide steps/log/demo chrome; drag-drop on the section shell. */
  captureMode?: boolean;
};

type Phase = "idle" | "uploading" | "parsing" | "preview" | "saving";

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatClock(locale: GamLocale, d = new Date()): string {
  const loc = locale === "ja" ? "ja-JP" : locale === "ar" ? "ar-AE" : "en-US";
  return d.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

/** Sample + callout: show by default; set NEXT_PUBLIC_GAM_RECEIPT_DEMO=false to hide. */
const RECEIPT_DEMO_FLAG = process.env.NEXT_PUBLIC_GAM_RECEIPT_DEMO !== "false";

export function GamReceiptOcrSection({
  orgId,
  userId,
  functionalCurrency,
  costCategoryId,
  categoryLabel,
  ledgerMemoPrefix,
  onPosted,
  onCopyToKeypad,
  onDemoSampleReady,
  incomingFile,
  onIncomingFileConsumed,
  captureMode = false,
}: Props) {
  const { t, locale } = useGamLocale();
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const logId = useRef(0);

  const [effectiveUserId, setEffectiveUserId] = useState(userId);

  useEffect(() => {
    setEffectiveUserId(userId);
  }, [userId]);

  useEffect(() => {
    if (effectiveUserId) return;
    const supabase = getBrowserSupabase();
    void supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.id) setEffectiveUserId(user.id);
    });
  }, [orgId, effectiveUserId]);

  const [phase, setPhase] = useState<Phase>("idle");
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [storagePath, setStoragePath] = useState<string | null>(null);

  const [dateVal, setDateVal] = useState(todayISODate());
  const [vendorVal, setVendorVal] = useState("");
  const [totalVal, setTotalVal] = useState("");
  const [currencyVal, setCurrencyVal] = useState<GamCurrencyCode>("AED");
  const [taxVal, setTaxVal] = useState("");

  const [activityLog, setActivityLog] = useState<{ id: number; msg: string; at: string }[]>([]);
  const [successSnapshot, setSuccessSnapshot] = useState<{
    ledgerId: string;
    storagePath: string | null;
    amountLine: string;
  } | null>(null);
  const [isDemoSample, setIsDemoSample] = useState(false);
  const [parseOk, setParseOk] = useState(false);

  const pushLog = useCallback(
    (msg: string) => {
      logId.current += 1;
      const id = logId.current;
      const at = formatClock(locale);
      setActivityLog((prev) => [...prev.slice(-12), { id, msg, at }]);
    },
    [locale],
  );

  const resetPreview = useCallback(() => {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setStoragePath(null);
    setPhase("idle");
    setErrMsg(null);
    setDateVal(todayISODate());
    setVendorVal("");
    setTotalVal("");
    setTaxVal("");
    setActivityLog([]);
    setSuccessSnapshot(null);
    setIsDemoSample(false);
    setParseOk(false);
  }, [previewUrl]);

  const applyParsed = useCallback((p: ReceiptGeminiParse | null | undefined) => {
    if (p?.transactionDate) setDateVal(p.transactionDate);
    if (p?.vendorName) setVendorVal(p.vendorName);
    if (p?.totalAmount != null) setTotalVal(String(p.totalAmount));
    if (p?.currencyCode && isGamCurrencyCode(p.currencyCode)) setCurrencyVal(p.currencyCode);
    if (p?.taxAmount != null) setTaxVal(String(p.taxAmount));
  }, []);

  const loadPresentationDemo = useCallback(() => {
    setErrMsg(null);
    setSuccessSnapshot(null);
    setParseOk(true);
    setIsDemoSample(true);
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(DEMO_RECEIPT_IMAGE_DATA_URL);
    setStoragePath(null);
    const mock = getPresentationReceiptMock(todayISODate());
    applyParsed(mock);
    setPhase("preview");
    pushLog(t.receiptOcr.loadDemoSample);
    pushLog(t.receiptOcr.logAwaitingConfirm);
    queueMicrotask(() => onDemoSampleReady?.());
  }, [applyParsed, previewUrl, pushLog, t.receiptOcr.loadDemoSample, t.receiptOcr.logAwaitingConfirm, onDemoSampleReady]);

  const runUploadAndParse = useCallback(
    async (file: File) => {
      setErrMsg(null);
      setSuccessSnapshot(null);
      setIsDemoSample(false);
      setParseOk(false);

      let uid = effectiveUserId;
      if (!uid) {
        const {
          data: { user },
        } = await getBrowserSupabase().auth.getUser();
        uid = user?.id ?? "";
        if (uid) setEffectiveUserId(uid);
      }
      if (!uid) {
        setErrMsg(t.dashboard.signInRequired);
        return;
      }

      const localUrl = URL.createObjectURL(file);
      setPreviewUrl((prev) => {
        if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
        return localUrl;
      });

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 80) || "receipt";
      const path = `${orgId}/${uid}/${Date.now()}-${safeName}`;

      const supabase = getBrowserSupabase();
      setPhase("uploading");
      const { error: upErr } = await supabase.storage.from("receipts").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "image/jpeg",
      });
      if (upErr) {
        setPhase("idle");
        setErrMsg(upErr.message);
        return;
      }
      setStoragePath(path);
      pushLog(`${t.receiptOcr.logUploaded} · ${path}`);

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.access_token) {
        setPhase("idle");
        setErrMsg(t.receiptOcr.parseError);
        return;
      }

      setPhase("parsing");
      const res = await fetch("/api/receipts/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ storagePath: path, mimeType: file.type || "image/jpeg" }),
      });

      const raw = (await res.json().catch(() => ({}))) as {
        parsed?: ReceiptGeminiParse;
        error?: string;
        detail?: string;
      };

      if (!res.ok) {
        setPhase("preview");
        setParseOk(false);
        setErrMsg(
          raw.error === "Server OCR not configured"
            ? t.receiptOcr.serverNotConfigured
            : raw.detail || raw.error || t.receiptOcr.parseError,
        );
        pushLog(t.receiptOcr.parseError);
        return;
      }

      const p = raw.parsed;
      applyParsed(p);
      setParseOk(true);
      setPhase("preview");
      pushLog(t.receiptOcr.logParsed);
      pushLog(t.receiptOcr.logAwaitingConfirm);
      if (!p?.totalAmount) {
        setErrMsg(t.receiptOcr.parseError);
        setParseOk(false);
      }
    },
    [
      orgId,
      effectiveUserId,
      t.dashboard.signInRequired,
      t.receiptOcr.parseError,
      t.receiptOcr.serverNotConfigured,
      t.receiptOcr.logUploaded,
      t.receiptOcr.logParsed,
      t.receiptOcr.logAwaitingConfirm,
      applyParsed,
      pushLog,
    ],
  );

  const lastIncomingRef = useRef<File | null>(null);
  useEffect(() => {
    if (!incomingFile) return;
    if (lastIncomingRef.current === incomingFile) return;
    lastIncomingRef.current = incomingFile;
    void runUploadAndParse(incomingFile).finally(() => {
      onIncomingFileConsumed?.();
      lastIncomingRef.current = null;
    });
  }, [incomingFile, onIncomingFileConsumed, runUploadAndParse]);

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const onDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const f = e.dataTransfer.files?.[0];
      if (f && f.type.startsWith("image/")) void runUploadAndParse(f);
      else if (f) setErrMsg(t.receiptOcr.parseError);
    },
    [runUploadAndParse, t.receiptOcr.parseError],
  );

  const onPickFile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      e.target.value = "";
      if (f && f.type.startsWith("image/")) void runUploadAndParse(f);
      else if (f) setErrMsg(t.receiptOcr.parseError);
    },
    [runUploadAndParse, t.receiptOcr.parseError],
  );

  async function confirmLedger() {
    if (!costCategoryId) {
      setErrMsg(t.receiptOcr.needCategory);
      return;
    }
    const major = Number.parseFloat(totalVal.replace(/,/g, ""));
    if (!Number.isFinite(major) || major <= 0) {
      setErrMsg(t.receiptOcr.parseError);
      return;
    }

    const supabase = getBrowserSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { amountMinor, amountFunctionalMinor } = ledgerExpenseAmountsFromTxMajor(
      major,
      currencyVal,
      functionalCurrency,
    );

    const memoParts = [
      `${ledgerMemoPrefix} · ${isDemoSample ? "DEMO" : "OCR"}`,
      categoryLabel,
      vendorVal.trim() || null,
    ].filter(Boolean);
    const memo = memoParts.join(" · ");
    const taxNum = taxVal.trim() ? Number.parseFloat(taxVal.replace(/,/g, "")) : null;

    setPhase("saving");
    setErrMsg(null);

    const { data: row, error } = await supabase
      .from("ledger_entries")
      .insert({
        organization_id: orgId,
        project_id: null,
        cost_category_id: costCategoryId,
        entry_type: "expense",
        transaction_date: dateVal || todayISODate(),
        amount_minor: amountMinor,
        currency_code: currencyVal,
        amount_functional_minor: amountFunctionalMinor,
        memo,
        source_system: isDemoSample ? "receipt_ocr_demo" : "receipt_ocr",
        metadata: {
          receipt_storage_path: storagePath,
          presentation_demo: isDemoSample,
          ocr: {
            tax_amount_entry_currency:
              taxNum != null && Number.isFinite(taxNum) ? taxNum : null,
          },
        },
        created_by: user?.id ?? null,
      })
      .select("id")
      .single();

    if (error || !row?.id) {
      setPhase("preview");
      setErrMsg(error?.message ?? t.receiptOcr.parseError);
      return;
    }

    const amountLine = `${currencyVal} ${major} → ${functionalCurrency} (functional minor: ${amountFunctionalMinor})`;
    setSuccessSnapshot({
      ledgerId: row.id,
      storagePath,
      amountLine,
    });
    pushLog(`${t.receiptOcr.logPosted} · id:${row.id.slice(0, 8)}…`);
    pushLog(t.receiptOcr.successRefreshing);

    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setStoragePath(null);
    setVendorVal("");
    setTotalVal("");
    setTaxVal("");
    setDateVal(todayISODate());
    setPhase("idle");
    setIsDemoSample(false);
    setParseOk(false);
    onPosted();
  }

  function handleCopyKeypad() {
    if (!onCopyToKeypad) return;
    const mu = currencyVal === "JPY" ? 0 : 2;
    const major = Number.parseFloat(totalVal.replace(/,/g, ""));
    if (!Number.isFinite(major) || major <= 0) return;
    if (mu === 0) {
      onCopyToKeypad(String(Math.round(major)));
      return;
    }
    const s = major.toFixed(2).replace(/\.?0+$/, "");
    onCopyToKeypad(s);
  }

  const busy = phase === "uploading" || phase === "parsing" || phase === "saving";
  const showPreviewForm = phase === "preview" || phase === "saving";
  const showPickButtons = phase === "idle" || phase === "uploading" || phase === "parsing";
  const showDemoSampleButton = RECEIPT_DEMO_FLAG && !busy && !captureMode;

  const flowCompleted = Boolean(successSnapshot);

  const receiveDone = Boolean(storagePath) || isDemoSample;
  const aiDone = parseOk && receiveDone;
  const reviewActive = showPreviewForm;
  const postedDone = flowCompleted;

  const steps: { label: string; done: boolean; active: boolean }[] = flowCompleted
    ? [
        { label: t.receiptOcr.stepReceive, done: true, active: false },
        { label: t.receiptOcr.stepAi, done: true, active: false },
        { label: t.receiptOcr.stepReview, done: true, active: false },
        { label: t.receiptOcr.stepDone, done: true, active: false },
      ]
    : [
        {
          label: t.receiptOcr.stepReceive,
          done: receiveDone,
          active: phase === "uploading" || (phase === "idle" && !receiveDone && !postedDone),
        },
        {
          label: t.receiptOcr.stepAi,
          done: aiDone,
          active: phase === "parsing",
        },
        {
          label: t.receiptOcr.stepReview,
          done: reviewActive && phase !== "saving" && parseOk,
          active: reviewActive && phase !== "saving",
        },
        {
          label: phase === "saving" ? t.receiptOcr.stepPost : t.receiptOcr.stepDone,
          done: postedDone,
          active: phase === "saving" || postedDone,
        },
      ];

  return (
    <section
      className={`mb-8 rounded-2xl border-2 border-neutral-200 bg-gradient-to-b from-amber-50/40 to-white p-4 shadow-sm lg:p-5 ${
        captureMode ? "ring-offset-2" : ""
      }`}
      style={{ boxShadow: `inset 0 0 0 1px ${GOLD}33` }}
      onDragOver={captureMode ? onDragOver : undefined}
      onDrop={captureMode ? onDrop : undefined}
    >
      {!captureMode && RECEIPT_DEMO_FLAG ? (
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-100/90 px-3 py-2.5 text-center">
          <p className="text-[11px] font-bold leading-snug text-amber-950">{t.receiptOcr.presentationCallout}</p>
        </div>
      ) : null}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-black tracking-tight text-black">
            <Sparkles className="h-4 w-4 shrink-0" style={{ color: GOLD }} strokeWidth={2.5} />
            {t.receiptOcr.sectionTitle}
          </h2>
          <p className="mt-1 max-w-xl text-[11px] font-medium leading-relaxed text-neutral-600">
            {t.receiptOcr.sectionSub}
          </p>
        </div>
        {!captureMode && RECEIPT_DEMO_FLAG ? (
          <span
            className="inline-flex max-w-[14rem] items-center gap-1 rounded-full border border-amber-300 bg-amber-100/90 px-2.5 py-1 text-[9px] font-black uppercase leading-tight text-amber-950"
            title={t.receiptOcr.demoSampleHint}
          >
            <Wand2 className="h-3 w-3 shrink-0" strokeWidth={2.5} />
            {t.receiptOcr.demoModeBadge}
          </span>
        ) : null}
      </div>

      {!captureMode ? (
      <div className="mt-4 rounded-xl border border-neutral-200 bg-white/80 px-3 py-3">
        <p className="text-[10px] font-black uppercase tracking-wider text-neutral-500">{t.receiptOcr.stepsTitle}</p>
        <div className="mt-2 flex flex-wrap items-center gap-1 sm:gap-0">
          {steps.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <div
                className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] font-bold sm:px-2.5 ${
                  s.done
                    ? "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200"
                    : s.active
                      ? "bg-black text-white"
                      : "bg-neutral-100 text-neutral-500"
                }`}
                style={s.active && !s.done ? { boxShadow: `inset 0 0 0 1px ${GOLD}` } : undefined}
              >
                {s.done ? (
                  <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={3} />
                ) : s.active && phase === "saving" ? (
                  <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" />
                ) : (
                  <Circle className="h-3.5 w-3.5 shrink-0 opacity-60" strokeWidth={2} />
                )}
                <span className="whitespace-nowrap">{s.label}</span>
              </div>
              {i < steps.length - 1 ? (
                <ChevronsRight className="mx-0.5 h-4 w-4 shrink-0 text-neutral-400 hidden sm:block" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
      ) : null}

      {!captureMode && activityLog.length > 0 ? (
        <div className="mt-3 rounded-xl border border-dashed border-neutral-300 bg-neutral-50/80 px-3 py-2.5">
          <p className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
            {t.receiptOcr.liveLogTitle}
          </p>
          <ul className="mt-1.5 max-h-32 space-y-1 overflow-y-auto text-[10px] font-medium text-neutral-800">
            {activityLog.map((line) => (
              <li key={line.id} className="flex gap-2 border-b border-neutral-100/80 pb-1 last:border-0">
                <span className="shrink-0 font-mono text-neutral-500">{line.at}</span>
                <span className="min-w-0 break-words" dir="auto">
                  {line.msg}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {successSnapshot ? (
        <div
          className="relative mt-4 overflow-hidden rounded-xl border-2 border-emerald-400 bg-gradient-to-br from-emerald-50 to-white px-4 py-4 shadow-md"
          role="status"
        >
          <div
            className="absolute end-0 top-0 h-20 w-20 translate-x-6 -translate-y-6 rounded-full bg-emerald-400/20"
            aria-hidden
          />
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white shadow">
                <Check className="h-6 w-6" strokeWidth={3} />
              </div>
              <div>
                <p className="text-sm font-black text-emerald-950">{t.receiptOcr.successTitle}</p>
                <p className="text-[10px] font-medium text-emerald-800">{t.receiptOcr.saved}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSuccessSnapshot(null)}
              className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-[10px] font-bold text-emerald-900 hover:bg-emerald-50"
            >
              {t.receiptOcr.successDismiss}
            </button>
          </div>
          <dl className="mt-3 space-y-2 text-[11px]">
            <div className="flex flex-wrap gap-2">
              <dt className="font-black text-neutral-600">{t.receiptOcr.successLedgerId}</dt>
              <dd className="font-mono font-bold text-black" dir="ltr">
                {successSnapshot.ledgerId}
              </dd>
            </div>
            <div className="flex flex-wrap gap-2">
              <dt className="font-black text-neutral-600">{t.receiptOcr.successStoragePath}</dt>
              <dd className="min-w-0 break-all font-mono text-neutral-800" dir="ltr">
                {successSnapshot.storagePath
                  ? `receipts / ${successSnapshot.storagePath}`
                  : t.receiptOcr.successNoStorage}
              </dd>
            </div>
            <div className="flex flex-wrap gap-2">
              <dt className="font-black text-neutral-600">{t.receiptOcr.successAmount}</dt>
              <dd className="font-mono text-neutral-900" dir="ltr">
                {successSnapshot.amountLine}
              </dd>
            </div>
          </dl>
        </div>
      ) : null}

      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onPickFile}
      />
      <input ref={galleryRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />

      {showDemoSampleButton ? (
        <div className="mt-4">
          <button
            type="button"
            onClick={loadPresentationDemo}
            className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-amber-400 bg-amber-50/50 py-3 text-xs font-black text-amber-950 transition hover:bg-amber-100/80"
          >
            <Wand2 className="h-4 w-4 shrink-0" strokeWidth={2.5} />
            {t.receiptOcr.loadDemoSample}
          </button>
          <p className="mt-1.5 text-center text-[10px] font-medium leading-snug text-neutral-500">
            {t.receiptOcr.demoSampleHint}
          </p>
        </div>
      ) : null}

      {showPickButtons ? (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => cameraRef.current?.click()}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-black bg-white px-4 text-xs font-black text-black transition hover:bg-neutral-50 disabled:opacity-45 sm:flex-initial"
            style={{ boxShadow: `inset 0 0 0 1px ${GOLD}` }}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" strokeWidth={2.5} />}
            {phase === "uploading"
              ? t.receiptOcr.uploading
              : phase === "parsing"
                ? t.receiptOcr.analyzing
                : t.receiptOcr.camera}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => galleryRef.current?.click()}
            className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 text-xs font-bold text-neutral-800 transition hover:border-black disabled:opacity-45 sm:flex-initial"
          >
            <ImagePlus className="h-4 w-4" strokeWidth={2} />
            {t.receiptOcr.gallery}
          </button>
        </div>
      ) : null}

      {previewUrl ? (
        <div className="mt-4">
          <Image
            src={previewUrl}
            alt=""
            width={2048}
            height={2048}
            unoptimized
            sizes="100vw"
            className="max-h-52 w-auto max-w-full rounded-xl border border-neutral-200 object-contain shadow-sm"
          />
          {isDemoSample ? (
            <p className="mt-1 text-center text-[10px] font-bold text-amber-800">{t.receiptOcr.demoModeBadge}</p>
          ) : null}
        </div>
      ) : null}

      {showPreviewForm ? (
        <div className="mt-4 space-y-3 rounded-xl border border-neutral-200 bg-white/90 p-4">
          <p className="text-[11px] font-black uppercase tracking-wider text-neutral-500">{t.receiptOcr.previewTitle}</p>

          {categoryLabel ? (
            <p className="text-xs font-bold text-neutral-700">
              {categoryLabel}
              {!costCategoryId ? ` — ${t.receiptOcr.needCategory}` : null}
            </p>
          ) : (
            <p className="text-xs font-bold text-amber-800">{t.receiptOcr.needCategory}</p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              {t.receiptOcr.fieldDate}
              <input
                type="date"
                value={dateVal}
                onChange={(e) => setDateVal(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 px-2 py-2 text-sm font-semibold"
              />
            </label>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              {t.receiptOcr.fieldCurrency}
              <select
                value={currencyVal}
                onChange={(e) => {
                  const v = e.target.value;
                  if (isGamCurrencyCode(v)) setCurrencyVal(v);
                }}
                className="mt-1 w-full rounded-lg border border-neutral-200 px-2 py-2 text-sm font-semibold"
              >
                {gamCurrencyCodes.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 sm:col-span-2">
              {t.receiptOcr.fieldVendor}
              <input
                type="text"
                value={vendorVal}
                onChange={(e) => setVendorVal(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 px-2 py-2 text-sm font-semibold"
                dir="auto"
              />
            </label>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              {t.receiptOcr.fieldTotal}
              <input
                type="text"
                inputMode="decimal"
                value={totalVal}
                onChange={(e) => setTotalVal(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 px-2 py-2 font-mono text-sm font-bold"
                dir="ltr"
              />
            </label>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
              {t.receiptOcr.fieldTax}
              <input
                type="text"
                inputMode="decimal"
                value={taxVal}
                onChange={(e) => setTaxVal(e.target.value)}
                className="mt-1 w-full rounded-lg border border-neutral-200 px-2 py-2 font-mono text-sm"
                dir="ltr"
                placeholder={t.receiptOcr.taxHint}
              />
            </label>
          </div>

          {errMsg ? (
            <p className="text-xs font-bold text-red-700" dir="auto">
              {errMsg}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-1">
            <button
              type="button"
              disabled={phase === "saving" || !costCategoryId}
              onClick={() => void confirmLedger()}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-black text-white transition hover:bg-neutral-900 disabled:cursor-not-allowed disabled:opacity-45 sm:flex-initial sm:min-w-[12rem]"
              style={{ boxShadow: `inset 0 0 0 2px ${GOLD}` }}
            >
              {phase === "saving" ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
              {phase === "saving" ? t.receiptOcr.saving : t.receiptOcr.confirmSave}
            </button>
            {onCopyToKeypad ? (
            <button
              type="button"
              onClick={handleCopyKeypad}
              disabled={!totalVal.trim() || !onCopyToKeypad}
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-bold text-neutral-800 transition hover:border-black disabled:opacity-45"
            >
              {t.receiptOcr.copyToKeypad}
            </button>
            ) : null}
            <button
              type="button"
              onClick={resetPreview}
              disabled={phase === "saving"}
              className="inline-flex items-center justify-center gap-1 rounded-xl border border-neutral-200 px-4 py-3 text-xs font-bold text-neutral-600 hover:bg-neutral-50"
            >
              <X className="h-4 w-4" />
              {t.receiptOcr.discard}
            </button>
          </div>
        </div>
      ) : errMsg && !busy ? (
        <p className="mt-3 text-xs font-bold text-red-700">{errMsg}</p>
      ) : null}
    </section>
  );
}
