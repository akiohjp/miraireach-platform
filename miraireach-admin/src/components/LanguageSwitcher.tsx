"use client";

import { gamLocales, type GamLocale } from "@/i18n/gam-messages";
import { useGamLocale } from "@/components/LocaleProvider";

const localeMeta: Record<GamLocale, { short: string; aria: string }> = {
  en: { short: "EN", aria: "English" },
  ja: { short: "JA", aria: "日本語" },
  ar: { short: "ع", aria: "العربية" },
};

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useGamLocale();

  return (
    <div
      className="flex flex-col gap-1"
      role="group"
      aria-label={t.language.label}
    >
      <span className="hidden text-[10px] font-bold uppercase tracking-wider text-neutral-400 sm:block">
        {t.language.label}
      </span>
      <div className="flex rounded-lg border border-neutral-200 bg-neutral-50 p-0.5">
        {gamLocales.map((code) => {
          const active = locale === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => setLocale(code)}
              aria-pressed={active}
              aria-label={localeMeta[code].aria}
              title={localeMeta[code].aria}
              className={`min-w-[2.25rem] rounded-md px-2 py-1.5 text-[11px] font-bold transition-colors ${
                active
                  ? "bg-white text-black shadow-sm ring-1 ring-neutral-200/80"
                  : "text-neutral-500 hover:bg-white/80 hover:text-black"
              }`}
            >
              <span className="tabular-nums">{localeMeta[code].short}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
