"use client";

import type { GamCurrencyCode } from "@/i18n/gam-currency";
import { currencySelectLabel, gamCurrencyCodes } from "@/i18n/gam-currency";
import { useGamLocale } from "@/components/LocaleProvider";

export function CurrencySwitcher() {
  const { currency, setCurrency, locale, t } = useGamLocale();

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor="gam-currency"
        className="hidden text-[10px] font-bold uppercase tracking-wider text-neutral-400 sm:block"
      >
        {t.currencyLabel}
      </label>
      <select
        id="gam-currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value as GamCurrencyCode)}
        className="max-w-[11rem] rounded-lg border border-neutral-200 bg-white py-2 ps-3 pe-8 text-xs font-bold text-black shadow-sm outline-none transition hover:border-neutral-300 focus-visible:ring-2 focus-visible:ring-black md:max-w-[13.5rem]"
        style={{ direction: "ltr" }}
        aria-label={t.currencyLabel}
      >
        {gamCurrencyCodes.map((code) => (
          <option key={code} value={code} dir="ltr">
            {currencySelectLabel(code, locale)}
          </option>
        ))}
      </select>
    </div>
  );
}
