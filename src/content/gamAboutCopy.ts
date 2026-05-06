/**
 * Single source for About + immersive LP — keep mission & vision wording identical.
 */

export const GAM_ABOUT_TAGLINE =
  "Creating a market in Dubai and the UAE where being chosen by AI is the new standard for digital marketing.";

export const GAM_MISSION_PARAGRAPHS = [
  "At GAM solutions L.L.C-FZ, our mission is to establish a robust business environment in the Middle East—starting with Dubai and the United Arab Emirates (UAE)—fully adapted to the AI era. We create a market where no high-quality local operator is left behind by AI search, GEO, or automated discovery.",
  "We move teams away from purely manual, hero-dependent Dubai marketing toward system-driven AI marketing and digital marketing: fair visibility, structured data for AI Overviews and answer engines, and durable customer connection across the Emirates.",
] as const;

export const GAM_VISION_2026 =
  "Our vision is a UAE-wide market structure—anchored in Dubai—where strong AI evaluation is the standard of business success. We combine GEO, Dubai AIO programs, reputation, and performance channels so sustainable, AI-aware marketing replaces one-off campaigns for every partner we serve in the Emirates.";

/** Mission paragraphs + vision — same order as About page */
export const GAM_MISSION_AND_VISION_BLOCKS = [
  ...GAM_MISSION_PARAGRAPHS,
  GAM_VISION_2026,
] as const;
