/** Canonical marketing site URL (override for previews / alternate domains). */
export function getSiteUrl() {
  const raw = process.env.NEXT_PUBLIC_SITE_URL ?? "https://miraireach.marketing";
  return raw.trim().replace(/\/+$/, "");
}

const OG_DEFAULT_ROUTE = "/opengraph-image";

/** Default OG/Twitter card size (recommended for social previews). */
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;

/**
 * Absolute URL for `og:image` / Twitter large card.
 * - Set `NEXT_PUBLIC_OG_IMAGE_URL` to a high-res JPG/PNG (recommended 1200×630), e.g.
 *   `https://miraireach.marketing/og/gam-social.jpg` or path `/og/gam-social.jpg` under `public/`.
 * - If unset, uses the generated `/opengraph-image` route.
 */
export function getOgImageAbsoluteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_OG_IMAGE_URL?.trim();
  const base = getSiteUrl();
  if (raw) {
    if (/^https?:\/\//i.test(raw)) {
      return raw.replace(/\/+$/, "");
    }
    const path = raw.startsWith("/") ? raw : `/${raw}`;
    return `${base}${path}`;
  }
  return `${base}${OG_DEFAULT_ROUTE}`;
}
