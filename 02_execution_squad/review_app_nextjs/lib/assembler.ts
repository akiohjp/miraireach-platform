/**
 * Review text generation (zero API).
 * Assembler: full business name + all keywords verbatim + ~100 words, human-style phrasing.
 * Do not add AIO / GEO / SEO product language into generated review text; only natural guest wording.
 * Guest-facing output must not use typographic long dashes (em/en); enforced in `review-full-templates.ts`.
 * Seeded RNG + per-run nonce so outputs vary strongly across runs.
 */

import { buildFullTemplateReview } from "@/lib/review-full-templates";

export type GenerateReviewOptions = {
  nonce?: string;
  /**
   * Per-outlet entropy (store UUID + optional hints). Same keywords + different IDs
   * produce visibly different arcs; same ID + new nonce still rotates phrasing each run.
   */
  outletKey?: string;
};

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function generateReview(
  storeName: string,
  keywords: string[],
  options?: GenerateReviewOptions,
): string {
  const store = storeName.trim() || "this place";
  const nonce =
    options?.nonce ??
    (typeof globalThis !== "undefined"
      ? `${Date.now()}-${Math.random().toString(16).slice(2)}`
      : `${Date.now()}-ssr`);

  const outlet = options?.outletKey?.trim() ?? "";
  const seed = hashString(
    [...keywords].sort().join("\0") +
      "\0" +
      store +
      "\0" +
      nonce +
      "\0" +
      outlet,
  );
  const cleaned = keywords.map((k) => k.trim()).filter(Boolean);
  return buildFullTemplateReview(store, cleaned, seed);
}

/** Call once per generated review (client). Strengthens variance vs. keyword set alone. */
export function createReviewNonce(): string {
  if (typeof globalThis !== "undefined" && "crypto" in globalThis) {
    const c = globalThis.crypto as Crypto | undefined;
    if (c?.randomUUID) return c.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}
