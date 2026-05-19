/**
 * Bump `NEXT_PUBLIC_HERO_ASSET_VERSION` (or this fallback) when hero media changes
 * so mobile browsers fetch fresh files instead of a cached MP4.
 */
export const HERO_ASSET_VERSION =
  process.env.NEXT_PUBLIC_HERO_ASSET_VERSION?.trim() || "20260520-5";

export function heroAssetUrl(path: string): string {
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}v=${encodeURIComponent(HERO_ASSET_VERSION)}`;
}
