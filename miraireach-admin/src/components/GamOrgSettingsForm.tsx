"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Building2, Copy, Check, ArrowLeft } from "lucide-react";
import { useGamLocale } from "@/components/LocaleProvider";
import { GAM_ROUTES } from "@/components/GamHqShell";
import { GOLD } from "@/components/gam-branding";
import { getBrowserSupabase } from "@/lib/supabase";
import { resolveGamOrganizationId } from "@/lib/gam-dashboard-data";

type OrgRow = { id: string; name: string; slug: string; functional_currency: string };

export function GamOrgSettingsForm() {
  const { t } = useGamLocale();
  const [org, setOrg] = useState<OrgRow | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = getBrowserSupabase();
      const res = await resolveGamOrganizationId(supabase);
      if (!res.ok) return;
      const { data: row } = await supabase
        .from("organizations")
        .select("id,name,slug,functional_currency")
        .eq("id", res.organizationId)
        .maybeSingle();
      if (row) setOrg(row as OrgRow);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: mem } = await supabase
        .from("organization_members")
        .select("role")
        .eq("organization_id", res.organizationId)
        .eq("user_id", user.id)
        .maybeSingle();
      if (mem?.role) setRole(mem.role as string);
    })();
  }, []);

  async function copyId() {
    if (!org?.id || !navigator.clipboard) return;
    await navigator.clipboard.writeText(org.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const card =
    "rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6";
  const row = "flex flex-wrap items-baseline justify-between gap-2 border-b border-neutral-100 py-3 last:border-0";
  const dt = "text-[11px] font-bold uppercase tracking-wider text-neutral-500";
  const dd = "text-sm font-semibold text-black";

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <Link
        href={GAM_ROUTES.overview}
        className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-800 shadow-sm transition hover:border-black"
      >
        <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
        {t.dataEntry.backDashboard}
      </Link>
      <section className={card}>
        <div className="mb-4 flex items-start gap-3 border-b border-neutral-100 pb-4">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-white"
            style={{ boxShadow: `0 0 0 1px ${GOLD}` }}
          >
            <Building2 className="h-5 w-5 text-black" strokeWidth={2} />
          </span>
          <div>
            <h2 className="text-lg font-black tracking-tight text-black">{t.orgSettings.pageTitle}</h2>
            <p className="mt-1 text-sm font-medium text-neutral-600">{t.orgSettings.pageSub}</p>
          </div>
        </div>
        {org ? (
          <dl>
            <div className={row}>
              <dt className={dt}>{t.orgSettings.orgName}</dt>
              <dd className={dd}>{org.name}</dd>
            </div>
            <div className={row}>
              <dt className={dt}>{t.orgSettings.orgSlug}</dt>
              <dd className={dd} dir="ltr">
                {org.slug}
              </dd>
            </div>
            <div className={row}>
              <dt className={dt}>{t.orgSettings.functionalCurrency}</dt>
              <dd className={dd} dir="ltr">
                {org.functional_currency}
              </dd>
            </div>
            <div className={row}>
              <dt className={dt}>{t.orgSettings.yourRole}</dt>
              <dd className={dd}>{role ?? "—"}</dd>
            </div>
            <div className={row}>
              <dt className={dt}>{t.orgSettings.orgId}</dt>
              <dd className="flex items-center gap-2">
                <code className="max-w-[14rem] truncate rounded bg-neutral-100 px-2 py-1 text-xs font-mono" dir="ltr">
                  {org.id}
                </code>
                <button
                  type="button"
                  onClick={() => void copyId()}
                  className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2 py-1 text-[11px] font-bold text-neutral-800 hover:border-black"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? t.orgSettings.copied : t.orgSettings.copyId}
                </button>
              </dd>
            </div>
          </dl>
        ) : (
          <p className="text-sm text-neutral-500">{t.dashboard.loading}</p>
        )}
      </section>
    </div>
  );
}
