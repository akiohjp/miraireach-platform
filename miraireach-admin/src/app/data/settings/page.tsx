"use client";

import { GamHqShell } from "@/components/GamHqShell";
import { GamOrgSettingsForm } from "@/components/GamOrgSettingsForm";
import { GamOperationsHub } from "@/components/GamOperationsHub";
import { useGamLocale } from "@/components/LocaleProvider";

export default function OrgSettingsPage() {
  const { t } = useGamLocale();
  return (
    <GamHqShell activeNav="settings" headerTitle={t.orgSettings.pageTitle}>
      <GamOperationsHub />
      <GamOrgSettingsForm />
    </GamHqShell>
  );
}
