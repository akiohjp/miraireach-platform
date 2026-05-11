"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useGamLocale } from "@/components/LocaleProvider";
import { GamHqShell, GAM_ROUTES } from "@/components/GamHqShell";
import { getBrowserSupabase } from "@/lib/supabase";
import { subscribeGamDashboardRefresh } from "@/lib/gam-broadcast";
import { fetchGamDashboardData, resolveGamOrganizationId, type GamDashboardPayload } from "@/lib/gam-dashboard-data";
import {
  mergePresentationOverlayIntoPayload,
  readPresentationOverlay,
  type PresentationOverlayLine,
} from "@/lib/gam-presentation-overlay";
import { functionalMinorToJpyReference } from "@/i18n/gam-currency";

const MATTE_BLACK = "#1A1A1A";
const GOLD_PREMIUM = "#C5A059";

function ExecHero({
  kicker,
  value,
  sub,
  loading,
  hasData,
}: {
  kicker: string;
  value: ReactNode;
  sub: string;
  loading: boolean;
  hasData: boolean;
}) {
  return (
    <section
      className="rounded-2xl border border-neutral-200 bg-white px-8 py-10 shadow-sm sm:px-12 sm:py-14"
      style={{ borderLeftWidth: 4, borderLeftColor: GOLD_PREMIUM }}
    >
      <p
        className="text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-400"
        style={{ color: `${MATTE_BLACK}99` }}
      >
        {kicker}
      </p>
      {loading ? (
        <div className="mt-6 h-16 w-48 max-w-full animate-pulse rounded-lg bg-neutral-100" aria-hidden />
      ) : (
        <p
          className="mt-6 text-4xl font-bold leading-none tracking-tight tabular-nums sm:text-5xl md:text-6xl"
          style={{ color: MATTE_BLACK }}
          dir="ltr"
        >
          {!hasData ? "—" : value}
        </p>
      )}
      <p className="mt-5 max-w-xl text-xs font-medium leading-relaxed text-neutral-400">{sub}</p>
    </section>
  );
}

function ExecTile({
  kicker,
  value,
  sub,
  loading,
  hasData,
  valueMuted,
}: {
  kicker: string;
  value: ReactNode;
  sub: string;
  loading: boolean;
  hasData: boolean;
  valueMuted?: boolean;
}) {
  return (
    <div
      className="flex min-h-[10rem] flex-col rounded-2xl border border-neutral-200 bg-white px-6 py-8 shadow-sm sm:px-8 sm:py-9"
      dir="ltr"
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">{kicker}</p>
      {loading ? (
        <div className="mt-5 h-12 w-36 animate-pulse rounded-md bg-neutral-100" aria-hidden />
      ) : (
        <p
          className={`mt-5 text-2xl font-bold leading-tight tracking-tight tabular-nums sm:text-3xl ${
            valueMuted ? "text-red-700" : ""
          }`}
          style={!valueMuted ? { color: MATTE_BLACK } : undefined}
        >
          {!hasData ? "—" : value}
        </p>
      )}
      <p className="mt-4 text-[11px] font-medium leading-relaxed text-neutral-400">{sub}</p>
    </div>
  );
}

export function GamHqDashboard() {
  const { t, formatMoney } = useGamLocale();
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [payload, setPayload] = useState<GamDashboardPayload | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [moneySnap, setMoneySnap] = useState(false);
  const [envOrgMismatch, setEnvOrgMismatch] = useState(false);
  const [weakAccess, setWeakAccess] = useState(false);
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [overlayLines, setOverlayLines] = useState<PresentationOverlayLine[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    const supabase = getBrowserSupabase();
    const resolved = await resolveGamOrganizationId(supabase);
    const envRaw = process.env.NEXT_PUBLIC_GAM_ORGANIZATION_ID?.trim();
    const envLooksUuid = !!envRaw && /^[0-9a-f-]{36}$/i.test(envRaw);
    const mismatch = resolved.ok && envLooksUuid && !resolved.envPinMatched;
    setEnvOrgMismatch(mismatch);
    setWeakAccess(resolved.ok ? !!resolved.weakAccess : false);
    setActiveOrgId(resolved.ok ? resolved.organizationId : null);

    if (!resolved.ok) {
      setPayload(null);
      setLoading(false);
      return;
    }

    const { data, error } = await fetchGamDashboardData(supabase, resolved.organizationId);
    if (error) {
      setLoadError(error);
      setPayload(null);
    } else {
      setPayload(data);
      setLoadError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load, refreshKey]);

  useEffect(() => {
    return subscribeGamDashboardRefresh(() => setRefreshKey((k) => k + 1));
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      setOverlayLines(readPresentationOverlay());
    });
    const fn = () => setOverlayLines(readPresentationOverlay());
    window.addEventListener("gam-presentation-overlay-changed", fn);
    return () => window.removeEventListener("gam-presentation-overlay-changed", fn);
  }, []);

  useEffect(() => {
    const fn = () => {
      setMoneySnap(true);
      window.setTimeout(() => setMoneySnap(false), 480);
    };
    window.addEventListener("gam-currency-flip", fn);
    return () => window.removeEventListener("gam-currency-flip", fn);
  }, []);

  const displayPayload = useMemo(
    () => mergePresentationOverlayIntoPayload(payload, overlayLines),
    [payload, overlayLines],
  );

  const jpyMtdRev = displayPayload
    ? functionalMinorToJpyReference(
        displayPayload.mtdRevenueMinor,
        displayPayload.functionalCurrency,
        displayPayload.functionalMinorUnits,
      )
    : 0;
  const jpyForecast = displayPayload
    ? functionalMinorToJpyReference(
        displayPayload.forecastMonthEndNetMinor,
        displayPayload.functionalCurrency,
        displayPayload.functionalMinorUnits,
      )
    : 0;

  const marginPct =
    displayPayload && displayPayload.mtdRevenueMinor > 0
      ? Math.round(
          ((displayPayload.mtdRevenueMinor - displayPayload.mtdExpenseMinor) / displayPayload.mtdRevenueMinor) * 100,
        )
      : null;

  const roiRatio = displayPayload?.marketing.revenueToSpendRatio ?? null;
  const hasLedger = !!displayPayload?.flags.hasLedgerRows;

  return (
    <GamHqShell activeNav="overview" headerTitle={t.headerTitle} headerSub={<p className="sr-only">{t.currencyHint}</p>}>
      {loadError && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-medium text-amber-950">
          <span>{t.dashboard.loadError}</span>
          <span className="text-xs opacity-80">{loadError}</span>
          <button
            type="button"
            className="rounded-lg border border-amber-300 bg-white px-3 py-1.5 text-xs font-bold text-amber-950"
            onClick={() => setRefreshKey((k) => k + 1)}
          >
            {t.dashboard.retry}
          </button>
        </div>
      )}

      {envOrgMismatch && (
        <div className="mb-6 rounded-2xl border border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50/80 p-6 text-sm shadow-sm">
          <p className="font-black text-amber-950">{t.dashboard.envOrgMismatchTitle}</p>
          <p className="mt-3 font-medium leading-relaxed text-amber-950/90">{t.dashboard.envOrgMismatchBody}</p>
          {activeOrgId ? (
            <p className="mt-3 text-xs font-mono font-medium text-amber-900/80" dir="ltr">
              Active org: {activeOrgId} · Env pin: {process.env.NEXT_PUBLIC_GAM_ORGANIZATION_ID?.trim()}
            </p>
          ) : null}
        </div>
      )}

      {weakAccess && (
        <div className="mb-6 rounded-2xl border border-sky-200 bg-sky-50/90 p-6 text-sm shadow-sm">
          <p className="font-black text-sky-950">{t.dashboard.weakAccessTitle}</p>
          <p className="mt-3 font-medium leading-relaxed text-sky-900/90">{t.dashboard.weakAccessBody}</p>
        </div>
      )}

      {loading && (
        <div className="mb-6 flex items-center gap-2 text-sm font-bold text-neutral-600">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          {t.dashboard.loading}
        </div>
      )}

      <div className={`mx-auto max-w-5xl space-y-8 sm:space-y-10 ${moneySnap ? "gam-currency-snap" : ""}`}>
        <ExecHero
          kicker={t.dashboard.execForecastTitle}
          value={formatMoney(jpyForecast)}
          sub={t.dashboard.execForecastSub}
          loading={loading}
          hasData={!!displayPayload && hasLedger}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          <ExecTile
            kicker={t.dashboard.execRevenueTitle}
            value={formatMoney(jpyMtdRev)}
            sub={t.dashboard.execRevenueSub}
            loading={loading}
            hasData={!!displayPayload && hasLedger}
          />
          <ExecTile
            kicker={t.dashboard.execMarketingRoiTitle}
            value={roiRatio != null ? `×${roiRatio.toFixed(1)}` : "—"}
            sub={t.dashboard.execMarketingRoiSub}
            loading={loading}
            hasData={!!displayPayload && hasLedger && roiRatio != null}
          />
          <ExecTile
            kicker={t.dashboard.execMarginTitle}
            value={marginPct != null ? `${marginPct}%` : "—"}
            sub={t.dashboard.execMarginSub}
            loading={loading}
            hasData={!!displayPayload && hasLedger && marginPct != null}
            valueMuted={marginPct != null && marginPct < 0}
          />
        </div>

        <p className="pt-4 text-center text-[11px] font-medium text-neutral-400">
          <Link href={GAM_ROUTES.plEntry} className="text-neutral-500 underline-offset-2 hover:text-black hover:underline">
            {t.dashboard.execFooterOps}
          </Link>
        </p>
      </div>
    </GamHqShell>
  );
}
