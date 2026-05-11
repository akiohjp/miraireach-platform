"use client";

import { GamHqShell } from "@/components/GamHqShell";
import { GamCostsBudgetsForm } from "@/components/GamCostsBudgetsForm";
import { useGamLocale } from "@/components/LocaleProvider";

export default function CostsBudgetsPage() {
  const { t } = useGamLocale();
  return (
    <GamHqShell activeNav="costs" headerTitle={t.costsBudgets.pageTitle}>
      <GamCostsBudgetsForm />
    </GamHqShell>
  );
}
