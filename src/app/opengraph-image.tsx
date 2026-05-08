import { ImageResponse } from "next/og";
import { OgBrandMarkup } from "@/lib/og-brand-markup";

export const alt = "GAM solutions — Dubai & UAE AI marketing";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(<OgBrandMarkup />, { ...size });
}
