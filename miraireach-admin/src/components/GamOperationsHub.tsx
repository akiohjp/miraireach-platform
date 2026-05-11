"use client";

import Link from "next/link";
import { Camera, FolderKanban, Receipt, Settings2, Tags } from "lucide-react";
import { useGamLocale } from "@/components/LocaleProvider";
import { GAM_ROUTES } from "@/components/GamHqShell";
import { GOLD } from "@/components/gam-branding";

const cardClass =
  "group flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-black hover:shadow-md";

export function GamOperationsHub() {
  const { t } = useGamLocale();
  const items = [
    {
      href: GAM_ROUTES.clientsProjects,
      icon: FolderKanban,
      title: t.operationsHub.cardClients,
    },
    {
      href: GAM_ROUTES.costsBudgets,
      icon: Tags,
      title: t.operationsHub.cardCosts,
    },
    {
      href: GAM_ROUTES.plEntry,
      icon: Receipt,
      title: t.operationsHub.cardBilling,
    },
    {
      href: GAM_ROUTES.mobileQuick,
      icon: Camera,
      title: t.operationsHub.cardCapture,
    },
    {
      href: GAM_ROUTES.settings,
      icon: Settings2,
      title: t.operationsHub.cardOrg,
    },
  ];
  return (
    <section className="mb-8 rounded-2xl border border-neutral-200 bg-gradient-to-br from-white to-neutral-50/80 p-6 shadow-sm">
      <h2 className="text-lg font-black tracking-tight text-black">{t.operationsHub.title}</h2>
      <p className="mt-2 max-w-2xl text-sm font-medium leading-relaxed text-neutral-600">{t.operationsHub.sub}</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map(({ href, icon: Icon, title }) => (
          <li key={href}>
            <Link href={href} className={cardClass} prefetch={false}>
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-white text-black transition group-hover:shadow-sm"
                style={{ boxShadow: `0 0 0 1px ${GOLD}` }}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <span className="min-w-0 pt-1 text-sm font-black leading-snug text-black">{title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
