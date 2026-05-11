import { Building2, Hexagon } from "lucide-react";

export const GOLD = "#C9A227";

export function GamMark({ size = "md" }: { size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-8 w-8 rounded-lg" : "h-10 w-10 rounded-xl";
  const hex = size === "sm" ? "h-7 w-7" : "h-8 w-8";
  const inner = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <span
      className={`relative flex shrink-0 items-center justify-center border-2 border-black bg-white shadow-sm ${box}`}
    >
      <Hexagon className={`absolute ${hex}`} stroke={GOLD} strokeWidth={1.65} fill="none" aria-hidden />
      <Building2 className={`relative z-[1] text-black ${inner}`} strokeWidth={2} aria-hidden />
    </span>
  );
}

export function GamWordmark({ compact, subtitle }: { compact?: boolean; subtitle?: string }) {
  if (compact) {
    return (
      <span className="flex items-center gap-2">
        <GamMark size="sm" />
        <span className="flex flex-col leading-none">
          <span className="text-base font-black tracking-tight text-black">GAM</span>
          <span className="text-[8px] font-bold uppercase tracking-[0.22em]" style={{ color: GOLD }}>
            HQ
          </span>
        </span>
      </span>
    );
  }
  return (
    <span className="flex items-center gap-2.5">
      <GamMark />
      <span className="flex flex-col leading-tight">
        <span className="text-lg font-black tracking-tight text-black">GAM</span>
        <span className="text-[9px] font-bold uppercase tracking-[0.24em] text-neutral-800" style={{ color: GOLD }}>
          {subtitle}
        </span>
      </span>
    </span>
  );
}
