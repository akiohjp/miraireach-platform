"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, FolderKanban, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useGamLocale } from "@/components/LocaleProvider";
import { GAM_ROUTES } from "@/components/GamHqShell";
import { GOLD } from "@/components/gam-branding";
import { getBrowserSupabase } from "@/lib/supabase";
import { fetchGamOrganizationMeta, resolveGamOrganizationId } from "@/lib/gam-dashboard-data";
import { broadcastGamDashboardRefresh } from "@/lib/gam-broadcast";
import { gamCurrencyCodes, type GamCurrencyCode } from "@/i18n/gam-currency";

type ClientRow = { id: string; display_name: string };

export function GamClientsProjectsForm() {
  const { t } = useGamLocale();
  const router = useRouter();
  const [orgId, setOrgId] = useState<string | null>(null);
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loadClients, setLoadClients] = useState(true);

  const [displayName, setDisplayName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [country, setCountry] = useState("");
  const [defaultCurrency, setDefaultCurrency] = useState<GamCurrencyCode>("JPY");
  const [clientStatus, setClientStatus] = useState<"idle" | "saving" | "ok" | "err">("idle");
  const [clientErr, setClientErr] = useState<string | null>(null);

  const [selectedClientId, setSelectedClientId] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [projectName, setProjectName] = useState("");
  const [billingCurrency, setBillingCurrency] = useState<GamCurrencyCode>("JPY");
  const [projectStatus, setProjectStatus] = useState<"draft" | "active" | "on_hold" | "closed">("active");
  const [projSave, setProjSave] = useState<"idle" | "saving" | "ok" | "err">("idle");
  const [projErr, setProjErr] = useState<string | null>(null);

  const refreshClients = useCallback(async () => {
    if (!orgId) return;
    const supabase = getBrowserSupabase();
    const { data, error } = await supabase
      .from("clients")
      .select("id,display_name")
      .eq("organization_id", orgId)
      .order("display_name", { ascending: true });
    if (!error && data) setClients(data as ClientRow[]);
    else if (error) console.error("[GamClientsProjectsForm] clients list", error);
  }, [orgId]);

  useEffect(() => {
    (async () => {
      const supabase = getBrowserSupabase();
      const res = await resolveGamOrganizationId(supabase);
      if (!res.ok) return;
      setOrgId(res.organizationId);
      const m = await fetchGamOrganizationMeta(supabase, res.organizationId);
      if (m) {
        setDefaultCurrency(m.functionalCurrency);
        setBillingCurrency(m.functionalCurrency);
      }
    })();
  }, []);

  useEffect(() => {
    if (!orgId || !loadClients) return;
    queueMicrotask(() => {
      void refreshClients().finally(() => setLoadClients(false));
    });
  }, [orgId, loadClients, refreshClients]);

  async function onCreateClient(e: React.FormEvent) {
    e.preventDefault();
    if (!orgId || !displayName.trim()) return;
    setClientErr(null);
    setClientStatus("saving");
    const supabase = getBrowserSupabase();
    const cc = country.trim().toUpperCase();
    const { error } = await supabase.from("clients").insert({
      organization_id: orgId,
      display_name: displayName.trim(),
      legal_name: legalName.trim() || null,
      country_code: cc.length === 2 ? cc : null,
      default_currency: defaultCurrency,
    });
    if (error) {
      setClientErr(error.message);
      setClientStatus("err");
      return;
    }
    setClientStatus("ok");
    setDisplayName("");
    setLegalName("");
    setCountry("");
    await refreshClients();
    broadcastGamDashboardRefresh();
    router.refresh();
    setTimeout(() => setClientStatus("idle"), 2400);
  }

  async function onCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!orgId || !selectedClientId || !projectCode.trim() || !projectName.trim()) return;
    setProjErr(null);
    setProjSave("saving");
    const supabase = getBrowserSupabase();
    const { error } = await supabase.from("projects").insert({
      organization_id: orgId,
      client_id: selectedClientId,
      code: projectCode.trim(),
      name: projectName.trim(),
      status: projectStatus,
      billing_currency: billingCurrency,
    });
    if (error) {
      setProjErr(error.message);
      setProjSave("err");
      return;
    }
    setProjSave("ok");
    setProjectCode("");
    setProjectName("");
    broadcastGamDashboardRefresh();
    router.refresh();
    setTimeout(() => setProjSave("idle"), 2400);
  }

  const card =
    "rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6";
  const label = "mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-neutral-500";
  const input =
    "w-full rounded-xl border border-neutral-200 bg-neutral-50/50 px-3 py-2.5 text-sm font-semibold text-black outline-none transition placeholder:text-neutral-400 focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10";

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={GAM_ROUTES.overview}
          className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-800 shadow-sm transition hover:border-black"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.5} />
          {t.dataEntry.backDashboard}
        </Link>
        {metaLine(orgId)}
      </div>

      <section className={card} aria-label={t.nav.clients}>
        <h2 className="mb-3 text-sm font-black tracking-tight text-black">{t.nav.clients}</h2>
        {loadClients ? (
          <p className="text-sm text-neutral-500">{t.dashboard.loading}</p>
        ) : clients.length === 0 ? (
          <p className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50/80 p-4 text-sm font-medium text-neutral-600">
            {t.dataEntry.noClientsYet}
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-100">
            <table className="w-full min-w-[16rem] text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/80 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                  <th className="px-3 py-2 font-bold">{t.dataEntry.displayName}</th>
                  <th className="px-3 py-2 font-mono text-[10px] font-bold" dir="ltr">
                    id
                  </th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.id} className="border-b border-neutral-50 last:border-0">
                    <td className="px-3 py-2.5 font-semibold text-neutral-900">{c.display_name}</td>
                    <td className="px-3 py-2.5 font-mono text-xs text-neutral-500" dir="ltr">
                      {c.id.slice(0, 8)}...
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className={card}>
        <div className="mb-5 flex items-start gap-3 border-b border-neutral-100 pb-4">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-white"
            style={{ boxShadow: `0 0 0 1px ${GOLD}` }}
          >
            <Building2 className="h-5 w-5 text-black" strokeWidth={2} />
          </span>
          <div>
            <h2 className="text-lg font-black tracking-tight text-black">{t.dataEntry.clientSection}</h2>
            <p className="mt-1 text-sm font-medium text-neutral-600">{t.dataEntry.clientSectionSub}</p>
          </div>
        </div>
        <form onSubmit={onCreateClient} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={label} htmlFor="gam-c-display">
              {t.dataEntry.displayName} · {t.dataEntry.required}
            </label>
            <input
              id="gam-c-display"
              className={input}
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              autoComplete="organization"
            />
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="gam-c-legal">
              {t.dataEntry.legalName}
            </label>
            <input id="gam-c-legal" className={input} value={legalName} onChange={(e) => setLegalName(e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="gam-c-cc">
              {t.dataEntry.countryCode}
            </label>
            <input
              id="gam-c-cc"
              className={input}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              maxLength={2}
              placeholder={t.dataEntry.countryPlaceholder}
            />
          </div>
          <div>
            <label className={label} htmlFor="gam-c-cur">
              {t.dataEntry.defaultCurrency}
            </label>
            <select
              id="gam-c-cur"
              className={input}
              value={defaultCurrency}
              onChange={(e) => setDefaultCurrency(e.target.value as GamCurrencyCode)}
            >
              {gamCurrencyCodes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={clientStatus === "saving"}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-60"
              style={{ boxShadow: `inset 0 0 0 1px ${GOLD}33` }}
            >
              {clientStatus === "saving" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : null}
              {clientStatus === "saving" ? t.dataEntry.saving : t.dataEntry.createClient}
            </button>
            {clientStatus === "ok" && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> {t.dataEntry.clientCreated}
              </span>
            )}
            {clientStatus === "err" && clientErr && (
              <span className="flex items-center gap-1 text-xs font-bold text-red-700">
                <AlertCircle className="h-4 w-4" /> {clientErr}
              </span>
            )}
          </div>
        </form>
      </section>

      <section className={card}>
        <div className="mb-5 flex items-start gap-3 border-b border-neutral-100 pb-4">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-white"
            style={{ boxShadow: `0 0 0 1px ${GOLD}` }}
          >
            <FolderKanban className="h-5 w-5 text-black" strokeWidth={2} />
          </span>
          <div>
            <h2 className="text-lg font-black tracking-tight text-black">{t.dataEntry.projectSection}</h2>
            <p className="mt-1 text-sm font-medium text-neutral-600">{t.dataEntry.projectSectionSub}</p>
          </div>
        </div>
        <form onSubmit={onCreateProject} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={label} htmlFor="gam-p-client">
              {t.dataEntry.selectClient} · {t.dataEntry.required}
            </label>
            <select
              id="gam-p-client"
              className={input}
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              required
            >
              <option value="">{clients.length ? "—" : t.dataEntry.noClientsYet}</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.display_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="gam-p-code">
              {t.dataEntry.projectCode} · {t.dataEntry.required}
            </label>
            <input
              id="gam-p-code"
              className={input}
              value={projectCode}
              onChange={(e) => setProjectCode(e.target.value)}
              required
              dir="ltr"
            />
          </div>
          <div>
            <label className={label} htmlFor="gam-p-name">
              {t.dataEntry.projectName} · {t.dataEntry.required}
            </label>
            <input
              id="gam-p-name"
              className={input}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={label} htmlFor="gam-p-bcur">
              {t.dataEntry.billingCurrency}
            </label>
            <select
              id="gam-p-bcur"
              className={input}
              value={billingCurrency}
              onChange={(e) => setBillingCurrency(e.target.value as GamCurrencyCode)}
            >
              {gamCurrencyCodes.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={label} htmlFor="gam-p-status">
              {t.dataEntry.status}
            </label>
            <select
              id="gam-p-status"
              className={input}
              value={projectStatus}
              onChange={(e) => setProjectStatus(e.target.value as typeof projectStatus)}
            >
              <option value="draft">{t.dataEntry.statusDraft}</option>
              <option value="active">{t.dataEntry.statusActive}</option>
              <option value="on_hold">{t.dataEntry.statusOnHold}</option>
              <option value="closed">{t.dataEntry.statusClosed}</option>
            </select>
          </div>
          <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={projSave === "saving" || !clients.length}
              className="inline-flex items-center gap-2 rounded-xl bg-black px-5 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-60"
            >
              {projSave === "saving" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : null}
              {projSave === "saving" ? t.dataEntry.saving : t.dataEntry.createProject}
            </button>
            {projSave === "ok" && (
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> {t.dataEntry.projectCreated}
              </span>
            )}
            {projSave === "err" && projErr && (
              <span className="flex items-center gap-1 text-xs font-bold text-red-700">
                <AlertCircle className="h-4 w-4" /> {projErr}
              </span>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}

function metaLine(orgId: string | null) {
  if (!orgId) return null;
  return (
    <p className="text-[10px] font-medium text-neutral-400 tabular-nums" dir="ltr">
      org · {orgId.slice(0, 8)}…
    </p>
  );
}
