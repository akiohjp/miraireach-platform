"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  FolderKanban,
  UsersRound,
  Tags,
  Receipt,
  Settings2,
  Bell,
  Loader2,
  Zap,
} from "lucide-react";
import { useGamLocale } from "@/components/LocaleProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { GamWordmark, GOLD } from "@/components/gam-branding";
import { getBrowserSupabase } from "@/lib/supabase";
import { resolveGamOrganizationId, type OrgResolution } from "@/lib/gam-dashboard-data";

export type GamNavId =
  | "overview"
  | "projects"
  | "clients"
  | "costs"
  | "billing"
  | "quick"
  | "settings";

export const GAM_ROUTES = {
  overview: "/",
  login: "/login",
  clientsProjects: "/data/clients-projects",
  costsBudgets: "/data/costs-budgets",
  plEntry: "/data/pl-entry",
  settings: "/data/settings",
  mobileQuick: "/m/quick",
} as const;

type ShellProject = { code: string; name: string; status: string };

function EmptyGate({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-neutral-200 bg-neutral-50/80 p-8 text-center">
      <p className="text-sm font-bold text-neutral-800">{title}</p>
      <div className="mt-2 text-xs font-medium leading-relaxed text-neutral-500">{children}</div>
    </div>
  );
}

type GamHqShellProps = {
  activeNav: GamNavId;
  headerTitle: string;
  /** Shown on ready state above page content (e.g. dashboard intro). */
  headerSub?: ReactNode;
  children: ReactNode;
};

export function GamHqShell({ activeNav, headerTitle, headerSub, children }: GamHqShellProps) {
  const { t } = useGamLocale();
  const pathname = usePathname();
  const loginHref =
    pathname && pathname !== GAM_ROUTES.overview && pathname !== GAM_ROUTES.login
      ? `${GAM_ROUTES.login}?next=${encodeURIComponent(pathname)}`
      : GAM_ROUTES.login;
  const [gate, setGate] = useState<"loading" | "ready" | "blocked">("loading");
  const [orgRes, setOrgRes] = useState<OrgResolution | null>(null);
  const [projects, setProjects] = useState<ShellProject[]>([]);
  const [sidebarLoading, setSidebarLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [bootDone, setBootDone] = useState(false);
  /** Bumps on unmount so Strict Mode's first (discarded) effect cannot race getSession / setState with the second. */
  const shellBootSerial = useRef(0);

  useEffect(() => {
    const serial = ++shellBootSerial.current;
    let cancelled = false;

    void (async () => {
      try {
        const supabase = getBrowserSupabase();
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (cancelled || serial !== shellBootSerial.current) return;
        if (sessionError) {
          console.warn("[GamHqShell] getSession:", sessionError.message);
        }

        const session = sessionData.session;
        setUserEmail(session?.user?.email ?? null);

        const resolved = await resolveGamOrganizationId(supabase, session ?? null);
        if (cancelled || serial !== shellBootSerial.current) return;

        setOrgRes(resolved);
        if (!resolved.ok) {
          setGate("blocked");
          setSidebarLoading(false);
          setBootDone(true);
          return;
        }
        const { data: plist, error: pErr } = await supabase
          .from("projects")
          .select("code,name,status")
          .eq("organization_id", resolved.organizationId)
          .order("created_at", { ascending: false })
          .limit(12);
        if (cancelled || serial !== shellBootSerial.current) return;
        if (pErr) console.warn("[GamHqShell] projects:", pErr.message);
        setProjects(((plist ?? []) as ShellProject[]) ?? []);
        setGate("ready");
        setSidebarLoading(false);
        setBootDone(true);
      } catch (e) {
        if (!cancelled && serial === shellBootSerial.current) {
          console.warn("[GamHqShell] boot error:", e);
        }
      }
    })();

    return () => {
      cancelled = true;
      shellBootSerial.current += 1;
    };
  }, []);

  async function signOut() {
    const supabase = getBrowserSupabase();
    await supabase.auth.signOut();
    setUserEmail(null);
    setGate("blocked");
    setOrgRes({ ok: false, reason: "no_session" });
    setProjects([]);
    setSidebarLoading(false);
    setBootDone(true);
  }

  const executiveNav: { id: GamNavId; label: string; icon: LucideIcon; href: string }[] = [
    { id: "overview", label: t.nav.overview, icon: LayoutDashboard, href: GAM_ROUTES.overview },
  ];

  const operationsNav: { id: GamNavId; label: string; icon: LucideIcon; href: string }[] = [
    { id: "projects", label: t.nav.projects, icon: FolderKanban, href: GAM_ROUTES.clientsProjects },
    { id: "clients", label: t.nav.clients, icon: UsersRound, href: GAM_ROUTES.clientsProjects },
    { id: "costs", label: t.nav.costs, icon: Tags, href: GAM_ROUTES.costsBudgets },
    { id: "billing", label: t.nav.billing, icon: Receipt, href: GAM_ROUTES.plEntry },
    { id: "quick", label: t.nav.quickCapture, icon: Zap, href: GAM_ROUTES.mobileQuick },
    { id: "settings", label: t.nav.settings, icon: Settings2, href: GAM_ROUTES.settings },
  ];

  const invalidEnv = orgRes?.ok === false && orgRes.reason === "invalid_env";
  const blockedMsg =
    orgRes?.ok === false
      ? orgRes.reason === "no_session"
        ? t.dashboard.signInRequired
        : orgRes.reason === "invalid_env"
          ? "Invalid NEXT_PUBLIC_GAM_ORGANIZATION_ID"
          : t.dashboard.noOrganization
      : "";

  const projectsNavActive = activeNav === "projects" || activeNav === "clients";

  return (
    <div className="flex min-h-screen bg-neutral-100 text-neutral-900">
      <aside className="hidden w-64 shrink-0 flex-col border-e border-neutral-200 bg-white shadow-sm md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-neutral-100 px-4">
          <Link
            href={GAM_ROUTES.overview}
            className="flex min-w-0 flex-1 items-center gap-1 outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-black"
          >
            <GamWordmark subtitle={t.wordmarkSubtitle} />
          </Link>
          <span className="shrink-0 rounded border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-neutral-600">
            {t.opsBadge}
          </span>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-3" aria-label={t.navLabel}>
          <p className="mb-1 px-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">
            {t.nav.sectionExecutive}
          </p>
          {executiveNav.map((item) => {
            const NavIcon = item.icon;
            const active = item.id === activeNav;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "border border-neutral-200 bg-neutral-50 text-black shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-black"
                }`}
              >
                <NavIcon
                  className={`h-4 w-4 shrink-0 ${active ? "text-[#C9A227]" : "text-neutral-600"}`}
                  strokeWidth={2}
                />
                <span className="text-start leading-snug">{item.label}</span>
              </Link>
            );
          })}
          <p className="mb-1 mt-3 px-3 text-[10px] font-black uppercase tracking-wider text-neutral-400">
            {t.nav.sectionOperations}
          </p>
          {operationsNav.map((item) => {
            const NavIcon = item.icon;
            const active =
              item.id === activeNav ||
              (item.id === "projects" && projectsNavActive) ||
              (item.id === "clients" && projectsNavActive);
            return (
              <Link
                key={`${item.id}-${item.href}`}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                  active
                    ? "border border-neutral-200 bg-neutral-50 text-black shadow-sm"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-black"
                }`}
              >
                <NavIcon
                  className={`h-4 w-4 shrink-0 ${active ? "text-[#C9A227]" : "text-neutral-600"}`}
                  strokeWidth={2}
                />
                <span className="text-start leading-snug">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-neutral-100 p-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            {t.dashboard.projectsSidebar}
          </p>
          {sidebarLoading ? (
            <p className="text-xs text-neutral-500">{t.dashboard.loading}</p>
          ) : projects.length ? (
            <ul className="max-h-36 space-y-2 overflow-y-auto text-xs">
              {projects.map((p) => (
                <li key={`${p.code}-${p.name}`} className="truncate font-medium text-neutral-800">
                  <span className="font-bold text-black">{p.code}</span> · {p.name}
                  <span className="ms-1 text-[10px] uppercase text-neutral-500">({p.status})</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs font-medium text-neutral-500">{t.dashboard.projectsEmpty}</p>
          )}
        </div>
        <div className="border-t border-neutral-100 p-4">
          {bootDone && !userEmail ? (
            <Link
              href={loginHref}
              className="flex w-full items-center justify-center rounded-xl bg-black py-3 text-xs font-black text-white shadow-sm transition hover:bg-neutral-800"
              style={{ boxShadow: `inset 0 0 0 1px ${GOLD}44` }}
            >
              {t.auth.signInCta}
            </Link>
          ) : (
          <div className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-neutral-50/80 p-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-black bg-white text-[10px] font-black text-black"
              style={{ boxShadow: `0 0 0 1px ${GOLD}` }}
            >
              GA
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-neutral-900">{t.userRole}</p>
              <p className="truncate text-[10px] font-medium text-neutral-500" dir="ltr">
                {userEmail ?? t.dashboard.userFallback}
              </p>
            </div>
          </div>
          )}
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-auto min-h-14 flex-wrap items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 py-2 shadow-sm sm:px-6 md:h-16 md:flex-nowrap md:py-0">
          <div className="flex min-w-0 items-center md:hidden">
            <Link href={GAM_ROUTES.overview} className="outline-none">
              <GamWordmark compact />
            </Link>
          </div>
          <h1 className="hidden max-w-[55%] truncate text-lg font-black tracking-tight text-black md:block">
            {headerTitle}
          </h1>
          <div className="ms-auto flex flex-wrap items-center gap-2 sm:gap-3 md:ms-0">
            {bootDone && !userEmail && (
              <Link
                href={loginHref}
                className="rounded-full bg-black px-4 py-2 text-xs font-black text-white shadow-sm transition hover:bg-neutral-800"
                style={{ boxShadow: `inset 0 0 0 1px ${GOLD}44` }}
              >
                {t.auth.signInCta}
              </Link>
            )}
            {bootDone && userEmail && (
              <button
                type="button"
                onClick={() => void signOut()}
                className="rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-[11px] font-bold text-neutral-700 transition hover:border-black hover:text-black"
              >
                {t.auth.signOut}
              </button>
            )}
            <CurrencySwitcher />
            <LanguageSwitcher />
            <span className="hidden text-xs font-bold text-neutral-500 lg:inline">{t.kpiLive}</span>
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition hover:border-neutral-300"
              aria-label={t.notificationsAria}
            >
              <Bell className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </header>

        <nav
          className="flex gap-1.5 overflow-x-auto border-b border-neutral-100 bg-white px-3 py-2 md:hidden"
          aria-label={t.navLabel}
        >
          {bootDone && !userEmail && (
            <Link
              href={loginHref}
              className="flex shrink-0 items-center rounded-lg bg-black px-2.5 py-1.5 text-[11px] font-black text-white"
            >
              {t.auth.signInCta}
            </Link>
          )}
          {[...executiveNav, ...operationsNav].map((item) => {
              const NavIcon = item.icon;
              const active =
                item.id === activeNav ||
                (item.id === "projects" && projectsNavActive) ||
                (item.id === "clients" && projectsNavActive);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-bold ${
                    active ? "bg-neutral-100 text-black ring-1 ring-neutral-200" : "text-neutral-600"
                  }`}
                >
                  <NavIcon className={`h-3.5 w-3.5 ${active ? "text-[#C9A227]" : ""}`} strokeWidth={2} />
                  <span className="max-w-[5.5rem] truncate">{item.label}</span>
                </Link>
              );
          })}
        </nav>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {invalidEnv && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-900">
              NEXT_PUBLIC_GAM_ORGANIZATION_ID is not a valid UUID. Remove it or fix the value.
            </div>
          )}
          {gate === "loading" && (
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-neutral-600">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              {t.dashboard.loading}
            </div>
          )}
          {gate === "blocked" && (
            <EmptyGate title={blockedMsg}>
              {orgRes?.ok === false && orgRes.reason === "no_session" ? (
                <>
                  <p>{t.dashboard.signInHint}</p>
                  <Link
                    href={loginHref}
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-black px-6 py-3 text-sm font-black text-white shadow-sm transition hover:bg-neutral-800"
                    style={{ boxShadow: `inset 0 0 0 1px ${GOLD}44` }}
                  >
                    {t.auth.signInCta}
                  </Link>
                </>
              ) : orgRes?.ok === false && orgRes.reason === "no_membership" ? (
                <p>{t.dashboard.noOrganizationHint}</p>
              ) : null}
            </EmptyGate>
          )}
          {gate === "ready" && (
            <>
              {headerSub}
              {children}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
