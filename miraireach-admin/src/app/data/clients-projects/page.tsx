"use client";

import { GamHqShell } from "@/components/GamHqShell";
import { GamClientsProjectsForm } from "@/components/GamClientsProjectsForm";
import { useGamLocale } from "@/components/LocaleProvider";

export default function ClientsProjectsPage() {
  const { t } = useGamLocale();
  return (
    <GamHqShell activeNav="clients" headerTitle={t.dataEntry.clientsProjectsTitle}>
      <GamClientsProjectsForm />
    </GamHqShell>
  );
}
