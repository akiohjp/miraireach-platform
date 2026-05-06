/** Canonical marketing site URL (override for previews / alternate domains). */
export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://miraireach.marketing";
}
