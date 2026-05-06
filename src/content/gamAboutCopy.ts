/**
 * Single source for About + immersive LP — keep mission & vision wording identical.
 */

export const GAM_ABOUT_TAGLINE =
  "Creating a market where being chosen by AI is the new standard.";

export const GAM_MISSION_PARAGRAPHS = [
  "At GAM solutions L.L.C-FZ, our mission is to establish a robust business environment in the Middle East fully adapted to the AI era. We are driven by a singular philosophy: to create a market where no high-quality local business is left behind due to the complexities of digital evolution.",
  "We aim to build a lasting foundation where companies are continuously and fairly evaluated by the market. By shifting away from heavily manual, individual-dependent marketing, we empower great stores to receive the visibility and customer connection they truly deserve.",
] as const;

export const GAM_VISION_2026 =
  "Our vision is to firmly establish a market structure in the Middle East where being highly evaluated by AI is the absolute standard for business success. We don't just provide short-term customer attraction; we are shaping a future where sustainable, system-driven marketing ensures the long-term prosperity of every local business we partner with.";

/** Mission paragraphs + vision — same order as About page */
export const GAM_MISSION_AND_VISION_BLOCKS = [
  ...GAM_MISSION_PARAGRAPHS,
  GAM_VISION_2026,
] as const;
