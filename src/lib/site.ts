/** Canonical marketing site URL (override for previews / alternate domains). */
export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "https://miraireach.marketing";
  return raw.trim().replace(/\/+$/, "");
}
