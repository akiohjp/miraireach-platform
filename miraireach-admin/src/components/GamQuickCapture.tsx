"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type DragEvent } from "react";
import { ChevronLeft, ImagePlus, Loader2 } from "lucide-react";
import { useGamLocale } from "@/components/LocaleProvider";
import { GAM_ROUTES } from "@/components/GamHqShell";
import { GOLD } from "@/components/gam-branding";
import { getBrowserSupabase } from "@/lib/supabase";
import { fetchGamOrganizationMeta, resolveGamOrganizationId } from "@/lib/gam-dashboard-data";
import { broadcastGamDashboardRefresh } from "@/lib/gam-broadcast";
import { GamReceiptOcrSection } from "@/components/GamReceiptOcrSection";
import { useRouter } from "next/navigation";
import type { GamCurrencyCode } from "@/i18n/gam-currency";
import type { GamMessages } from "@/i18n/gam-messages";

const FIELD_MISC = "field_misc" as const;
const SORT_MISC = 53;

function miscLabel(t: GamMessages): string {
  return t.mobileQuick.catMisc;
}

export function GamQuickCapture() {
  const { t } = useGamLocale();
  const router = useRouter();
  const [gate, setGate] = useState<"loading" | "no_session" | "no_org" | "boot_error" | "ready">("loading");
  const [bootErr, setBootErr] = useState<string | null>(null);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [functionalCurrency, setFunctionalCurrency] = useState("JPY");
  const [miscCategoryId, setMiscCategoryId] = useState<string | null>(null);
  const [incomingFile, setIncomingFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const boot = useCallback(async () => {
    setGate("loading");
    setBootErr(null);
    const supabase = getBrowserSupabase();
    const resolved = await resolveGamOrganizationId(supabase);
    if (!resolved.ok) {
      setGate(resolved.reason === "no_session" ? "no_session" : "no_org");
      setOrgId(null);
      return;
    }
    setOrgId(resolved.organizationId);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserId(user?.id ?? null);
    const meta = await fetchGamOrganizationMeta(supabase, resolved.organizationId);
    if (meta) {
      setFunctionalCurrency(meta.functionalCurrency);
    }

    const { data: row, error } = await supabase
      .from("cost_categories")
      .upsert(
        {
          organization_id: resolved.organizationId,
          slug: FIELD_MISC,
          label: miscLabel(t),
          sort_order: SORT_MISC,
        },
        { onConflict: "organization_id,slug" },
      )
      .select("id")
      .single();
    if (error) {
      console.error(error);
      setBootErr(error.message);
      setGate("boot_error");
      return;
    }
    setMiscCategoryId(row.id);
    setGate("ready");
  }, [t]);

  useEffect(() => {
    queueMicrotask(() => {
      void boot();
    });
  }, [boot]);

  const loginHref = `${GAM_ROUTES.login}?next=${encodeURIComponent("/m/quick")}`;

  const onShellDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }, []);

  const onShellDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    if (e.currentTarget === e.target) setDragActive(false);
  }, []);

  const onShellDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith("image/")) setIncomingFile(f);
  }, []);

  if (gate === "loading") {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-white px-6">
        <Loader2 className="h-8 w-8 animate-spin text-neutral-400" aria-hidden />
        <p className="mt-4 text-sm font-semibold text-neutral-600">{t.dashboard.loading}</p>
      </div>
    );
  }

  if (gate === "boot_error") {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-white px-6 pb-12">
        <p className="text-center text-sm font-bold text-neutral-800">{t.mobileQuick.error}</p>
        {bootErr ? (
          <p className="mt-2 max-w-sm text-center font-mono text-xs text-red-700" dir="ltr">
            {bootErr}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => void boot()}
          className="mt-8 w-full max-w-xs rounded-2xl bg-black py-3.5 text-sm font-black text-white"
          style={{ boxShadow: `inset 0 0 0 1px ${GOLD}` }}
        >
          {t.dashboard.retry}
        </button>
        <Link href={GAM_ROUTES.overview} className="mt-6 text-sm font-bold text-neutral-500 underline underline-offset-2">
          {t.mobileQuick.home}
        </Link>
      </div>
    );
  }

  if (gate === "no_session") {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-white px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-12">
        <p className="text-center text-lg font-black text-black">{t.mobileQuick.needLogin}</p>
        <Link
          href={loginHref}
          className="mx-auto mt-8 w-full max-w-sm rounded-2xl bg-black py-4 text-center text-sm font-black text-white"
          style={{ boxShadow: `inset 0 0 0 1px ${GOLD}` }}
        >
          {t.auth.signInCta}
        </Link>
      </div>
    );
  }

  if (gate === "no_org") {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-white px-6 text-center">
        <p className="font-bold text-black">{t.mobileQuick.noOrg}</p>
        <Link href={GAM_ROUTES.overview} className="mt-6 text-sm font-bold underline underline-offset-2">
          {t.mobileQuick.home}
        </Link>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-[100dvh] flex-col bg-white text-black"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <header
        className="sticky top-0 z-10 flex items-center justify-between border-b-2 border-black bg-white px-3 py-3 lg:px-8 lg:py-4"
        style={{ borderBottomColor: GOLD, paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <Link
          href={GAM_ROUTES.overview}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white text-black transition hover:border-neutral-400"
          aria-label={t.mobileQuick.home}
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
        </Link>
        <div className="min-w-0 flex-1 px-2 text-center">
          <h1 className="text-sm font-black tracking-tight lg:text-base">{t.quickCapture.title}</h1>
          <p className="text-[10px] font-bold text-neutral-500 lg:text-xs">{t.quickCapture.subtitle}</p>
        </div>
        <div className="w-11" aria-hidden />
      </header>

      <main className="mx-auto w-full max-w-lg flex-1 px-4 pt-4 pb-6 lg:max-w-3xl lg:px-8">
        <div
          role="region"
          aria-label={t.quickCapture.dropHint}
          onDragOver={onShellDragOver}
          onDragLeave={onShellDragLeave}
          onDrop={onShellDrop}
          className={`mb-6 flex min-h-[10rem] flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 transition-colors lg:min-h-[12rem] ${
            dragActive ? "border-black bg-amber-50/80" : "border-neutral-300 bg-neutral-50/50"
          }`}
        >
          <ImagePlus className="h-10 w-10 text-neutral-400" strokeWidth={1.5} aria-hidden />
          <p className="mt-3 text-center text-sm font-bold text-neutral-800">
            {dragActive ? t.quickCapture.dropActive : t.quickCapture.dropHint}
          </p>
        </div>

        {orgId && miscCategoryId ? (
          <GamReceiptOcrSection
            orgId={orgId}
            userId={userId ?? ""}
            functionalCurrency={functionalCurrency as GamCurrencyCode}
            costCategoryId={miscCategoryId}
            categoryLabel={miscLabel(t)}
            ledgerMemoPrefix={t.mobileQuick.ledgerMemoPrefix}
            captureMode
            incomingFile={incomingFile}
            onIncomingFileConsumed={() => setIncomingFile(null)}
            onPosted={() => {
              broadcastGamDashboardRefresh();
              router.refresh();
            }}
          />
        ) : null}
      </main>
    </div>
  );
}
