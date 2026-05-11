"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import { useGamLocale } from "@/components/LocaleProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { GamWordmark, GOLD } from "@/components/gam-branding";
import { GAM_ROUTES } from "@/components/GamHqShell";
import { getBrowserSupabase } from "@/lib/supabase";

export function GamLoginForm() {
  const { t } = useGamLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextRaw = searchParams.get("next");
  const nextPath =
    nextRaw && nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : GAM_ROUTES.overview;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const input =
    "w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2.5 text-sm font-semibold text-black outline-none transition focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10";
  const label = "mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-500";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const supabase = getBrowserSupabase();
    const { error: signErr } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (signErr) {
      setError(signErr.message || t.auth.errorGeneric);
      return;
    }
    router.push(nextPath);
    router.refresh();
  }

  return (
    <div className="relative min-h-screen bg-neutral-100 text-neutral-900">
      <div className="absolute end-4 top-4 flex gap-2">
        <LanguageSwitcher />
      </div>
      <div className="flex min-h-screen flex-col items-center justify-center p-6">
        <Link
          href={GAM_ROUTES.overview}
          className="mb-8 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-black"
        >
          <GamWordmark subtitle={t.wordmarkSubtitle} />
        </Link>
        <div
          className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
          style={{ boxShadow: `0 12px 40px -12px rgba(0,0,0,0.08), inset 0 0 0 1px ${GOLD}18` }}
        >
          <h1 className="text-xl font-black tracking-tight text-black">{t.auth.pageTitle}</h1>
          <p className="mt-2 text-sm font-medium leading-relaxed text-neutral-600">{t.auth.pageSubtitle}</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className={label} htmlFor="gam-login-email">
                {t.auth.email}
              </label>
              <input
                id="gam-login-email"
                name="email"
                type="email"
                autoComplete="email"
                className={input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={label} htmlFor="gam-login-pass">
                {t.auth.password}
              </label>
              <input
                id="gam-login-pass"
                name="password"
                type="password"
                autoComplete="current-password"
                className={input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-900">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-black text-white transition hover:bg-neutral-800 disabled:opacity-60"
              style={{ boxShadow: `inset 0 0 0 1px ${GOLD}33` }}
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              {busy ? t.auth.submitting : t.auth.submit}
            </button>
          </form>

          <Link
            href={GAM_ROUTES.overview}
            className="mt-6 block text-center text-xs font-bold text-neutral-600 underline-offset-2 hover:text-black hover:underline"
          >
            {t.auth.backHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
