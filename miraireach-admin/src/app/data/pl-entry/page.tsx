"use client";

import { GamHqShell } from "@/components/GamHqShell";
import { GamPlEntryForm } from "@/components/GamPlEntryForm";
import { useGamLocale } from "@/components/LocaleProvider";

export default function PlEntryPage() {
  const { t } = useGamLocale();
  return (
    <GamHqShell activeNav="billing" headerTitle={t.dataEntry.plEntryTitle}>
      <GamPlEntryForm />
    </GamHqShell>
  );
}
