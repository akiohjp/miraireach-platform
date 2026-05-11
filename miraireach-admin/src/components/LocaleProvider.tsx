"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { gamLocales, gamMessages, type GamLocale, isRtlLocale } from "@/i18n/gam-messages";
import {
  formatGamCurrency,
  type GamCurrencyCode,
  gamCurrencyCodes,
  getStoredCurrency,
  storeCurrency,
} from "@/i18n/gam-currency";

const LOCALE_STORAGE_KEY = "gam-locale";

type LocaleContextValue = {
  locale: GamLocale;
  setLocale: (l: GamLocale) => void;
  currency: GamCurrencyCode;
  setCurrency: (c: GamCurrencyCode) => void;
  t: (typeof gamMessages)[GamLocale];
  /** Amounts are stored as reference JPY in the dashboard mock. */
  formatMoney: (amountJpy: number) => string;
  formatMoneyCompact: (amountJpy: number) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<GamLocale>("en");
  const [currency, setCurrencyState] = useState<GamCurrencyCode>("JPY");

  useEffect(() => {
    queueMicrotask(() => {
      try {
        const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
        if (raw && gamLocales.includes(raw as GamLocale)) {
          setLocaleState(raw as GamLocale);
        }
      } catch {
        /* ignore */
      }
      const cur = getStoredCurrency();
      if (cur) setCurrencyState(cur);
    });
  }, []);

  const setLocale = useCallback((l: GamLocale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const setCurrency = useCallback((c: GamCurrencyCode) => {
    setCurrencyState(c);
    storeCurrency(c);
    if (typeof window !== "undefined") {
      queueMicrotask(() => window.dispatchEvent(new CustomEvent("gam-currency-flip")));
    }
  }, []);

  useEffect(() => {
    const lang = locale === "ja" ? "ja" : locale === "ar" ? "ar" : "en";
    document.documentElement.lang = lang;
    document.documentElement.dir = isRtlLocale(locale) ? "rtl" : "ltr";
  }, [locale]);

  const value = useMemo(() => {
    const t = gamMessages[locale];
    const formatMoney = (amountJpy: number) =>
      formatGamCurrency(amountJpy, currency, locale, { compact: false });
    const formatMoneyCompact = (amountJpy: number) =>
      formatGamCurrency(amountJpy, currency, locale, { compact: true });
    return { locale, setLocale, currency, setCurrency, t, formatMoney, formatMoneyCompact };
  }, [locale, setLocale, currency, setCurrency]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useGamLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useGamLocale must be used within LocaleProvider");
  }
  return ctx;
}

export { gamCurrencyCodes };
