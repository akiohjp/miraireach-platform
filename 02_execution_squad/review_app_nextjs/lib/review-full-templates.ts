/**
 * Human-style review text (zero API).
 * - Business name appears at least twice, verbatim.
 * - Every selected keyword appears verbatim at least once (Oxford-style list + optional weave).
 * - Template pools must not use product jargon (AIO, GEO, SEO, "maps optimization", etc.): reads as spam.
 * - No long dashes (Unicode U+2014 em dash or U+2013 en dash as sentence glue) in guest-facing sentences;
 *   use commas, periods, semicolons, or colons instead so copy reads less "AI".
 * - Length tuned toward ~100 English words.
 * - Large phrase pools: `review-phrase-pools.ts`; slot picks use forked RNG from `seed` so choices stay uncorrelated.
 */

import { forkRng } from "@/lib/review-rng";
import {
  PHRASE_BRIDGES_LONG_EXTRA,
  PHRASE_BRIDGES_SHORT_EXTRA,
  PHRASE_CLOSERS_LONG_EXTRA,
  PHRASE_CLOSERS_SHORT_EXTRA,
  PHRASE_CORE_EXTRA,
  PHRASE_FILLERS_EXTRA,
  PHRASE_OPENERS_LONG_EXTRA,
  PHRASE_OPENERS_SHORT_EXTRA,
} from "@/lib/review-phrase-pools";

export type TemplateCtx = {
  store: string;
  a: string;
  b: string;
  c: string;
  extrasTail: string;
};

function pick<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

export function wordCount(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

/** Oxford comma join (keeps each keyword phrase intact). */
export function oxfordJoinKeywordPhrases(phrases: string[]): string {
  const p = phrases.filter(Boolean);
  if (p.length === 0) return "";
  if (p.length === 1) return p[0]!;
  if (p.length === 2) return `${p[0]} and ${p[1]}`;
  return `${p.slice(0, -1).join(", ")}, and ${p[p.length - 1]}`;
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = a[i]!;
    a[i] = a[j]!;
    a[j] = tmp;
  }
  return a;
}

// --- Openers: must include {store}; long / short pools

type Opener = (store: string) => string;

const OPENERS_LONG: readonly Opener[] = [
  (s) =>
    `We ate at ${s} recently and I figured I'd jot down what stuck with us. Nothing fancy, just the parts that would matter if a friend asked.`,
  (s) =>
    `Had been meaning to try ${s} for a while; the night didn't feel overhyped on our end, and a few things are still clear in my head the next day.`,
  (s) =>
    `Spent an evening at ${s} with friends. A few details were genuinely strong, so I'm writing this while it's still fresh.`,
  (s) =>
    `First visit to ${s} went better than I expected. I'll keep this short: what worked, what I'd order again, and why I'd go back.`,
  (s) =>
    `Dinner at ${s} was the kind of meal where you walk out and actually want to say something online, so here are straight notes from our table.`,
  (s) =>
    `Not here to write an essay. ${s} surprised us in a few sharp, specific ways, which is why I'm leaving this here.`,
  (s) =>
    `Came into ${s} with normal expectations and left with a short list of positives I didn't think I'd still be thinking about the next morning.`,
  (s) =>
    `If someone asked me about ${s} over coffee, here's the honest version: a couple of moments were memorable, a couple were fine, the overall line is positive.`,
  (s) =>
    `We rolled up to ${s} on a busy night; I half-expected chaos, but execution was steadier than I'm used to in that situation.`,
  (s) =>
    `My table at ${s} agreed on more than we usually do after a meal, and that alone says something.`,
  (s) =>
    `${s} earned the write-up for small reasons that add up: pacing, flavor balance, and staff who read the room.`,
  (s) =>
    `Posting this because ${s} nailed a few food details I don't want to flatten into a star rating only.`,
  (s) =>
    `Straight talk: ${s} wasn't trying to reinvent anything, which I liked, and competence mattered more than spectacle.`,
  ...PHRASE_OPENERS_LONG_EXTRA,
];

const OPENERS_SHORT: readonly Opener[] = [
  (s) =>
    `Quick take after ${s}: overall a good night, and a couple of specifics are worth mentioning.`,
  (s) =>
    `Stopped by ${s} not long ago; the highs were clear enough that I still remember them.`,
  (s) =>
    `${s} wasn't flawless for us, but the good bits below are real enough that I'd return.`,
  (s) =>
    `${s}? Yeah, we'd do that again.`,
  (s) =>
    `Short version: ${s} delivered where it counted for us.`,
  (s) =>
    `Posting while it's fresh. ${s} had a handful of standout moments.`,
  (s) =>
    `${s}: not loud marketing energy, just a solid night out.`,
  (s) =>
    `${s} was better than \"fine,\" the kind of OK that quietly wins you over.`,
  (s) =>
    `Honestly ${s} is on my revisit list already; that's unusual for first visits.`,
  ...PHRASE_OPENERS_SHORT_EXTRA,
];

// --- Keyword core: all phrases, verbatim; variants by density

type CoreBuild = (store: string, list: string) => string;

const CORE_LONG: readonly CoreBuild[] = [
  (s, list) =>
    `What landed best for me was ${list}. At ${s} that wasn't just wording, and you could tell someone cared about getting those right.`,
  (s, list) =>
    `If I had to describe the night in a handful of phrases, I'd pick ${list}. ${s} kept that thread from the first bite to the last.`,
  (_, list) =>
    `The things I'd repeat to a coworker or neighbor are ${list}: specific enough that I'm not reaching for generic praise.`,
  (s, list) =>
    `The backbone of what I liked ties back to ${list}. ${s} didn't phone that in.`,
  (_, list) =>
    `Walking through ${list}: each piece felt deliberate, which is harder than it sounds on a crowded night.`,
  (s, list) =>
    `If you strip it down, the meal was basically ${list} done with attention, and that's the story at ${s}.`,
];

const CORE_MID: readonly CoreBuild[] = [
  (s, list) =>
    `Standouts for us were ${list}; ${s} didn't treat those like afterthoughts.`,
  (_, list) =>
    `The through-line of the meal felt like ${list}; nothing in that set felt like a weak link.`,
  (s, list) =>
    `What I'd steer people toward is ${list}, and ${s} actually delivered on those.`,
  (_, list) =>
    `${list} is the honest shorthand for why I'd recommend without sugarcoating.`,
  (s, list) =>
    `We talked about ${list} on the ride home, and ${s} made that conversation easy.`,
  (s, list) =>
    `For our table ${list} was the \"remember this\" part; ${s} owned it.`,
];

/** Shorter rhythm, plain words; swaps long/MID cores for variety without sounding scripted. */
const CORE_CASUAL: readonly CoreBuild[] = [
  (_, list) =>
    `Honestly? ${list}. That was the gist.`,
  (s, list) =>
    `${list} hit the mark for me at ${s}.`,
  (_, list) =>
    `I'll just say ${list} and leave it there, and that's where the value showed up.`,
  (s, list) =>
    `${s} nailed ${list}; not much mystery beyond that.`,
  (_, list) =>
    `I'd order again around ${list}. That's the takeaway.`,
];

/** Direct, conversational; reads less \"template\". */
const CORE_DIRECT: readonly CoreBuild[] = [
  (_, list) =>
    `${list}: that's what's worth knowing.`,
  (s, list) =>
    `At ${s} we kept coming back to ${list}.`,
  (_, list) =>
    `You'll notice ${list} if you pay attention.`,
  (s, list) =>
    `${s} had ${list} under control.`,
  (_, list) =>
    `I'll name ${list} as the deciding factor.`,
];

/** Slightly narrative; still verbatim list in one gulp. */
const CORE_MICROSTORY: readonly CoreBuild[] = [
  (s, list) =>
    `Halfway through the meal we noted ${list}; by the end we'd stopped comparing it to elsewhere, and that's ${s}.`,
  (_, list) =>
    `Someone at our table said \"that's ${list} done right\"; hard to disagree.`,
  (s, list) =>
    `${list} sounded like hype on paper, but tastes don't lie, and ${s} made it coherent.`,
];

const CORE_COMPACT: readonly CoreBuild[] = [
  (_, list) =>
    `What worked: ${list}.`,
  (s, list) =>
    `${s} really showed up on ${list}.`,
  (_, list) =>
    `I'd call out ${list} as what made the visit memorable.`,
  (_, list) =>
    `Bright spots: ${list}.`,
  (s, list) =>
    `${s}: ${list}. Enough said.`,
];

const CORE_POOL_NON_COMPACT: readonly CoreBuild[] = [
  ...CORE_LONG,
  ...CORE_MID,
  ...CORE_CASUAL,
  ...CORE_DIRECT,
  ...CORE_MICROSTORY,
  ...PHRASE_CORE_EXTRA,
];

type DualKw = (store: string, a: string, b: string) => string;

const DUAL_KEYWORD_BLOCKS: readonly DualKw[] = [
  (s, x, y) =>
    `One thread through our visit was ${x}; separately, ${y} also landed at ${s} without feeling bolted on.`,
  (s, x, y) =>
    `${x} showed up first for us; later ${y} rounded it out, and both felt deliberate at ${s}.`,
  (s, x, y) =>
    `I'll split it: ${x} framed the opener, ${y} finished the impression, and it felt cohesive at ${s}.`,
  (s, x, y) =>
    `Kitchen and room energy aside, what's concrete is ${x} alongside ${y} at ${s}.`,
];

// --- Bridge (optional length tuning); may include store

const BRIDGES_LONG: readonly ((store: string) => string)[] = [
  (s) =>
    `Service at ${s} matched the food: friendly when we needed something, not hovering the rest of the time.`,
  (s) =>
    `Room was comfortable: noise level and pacing felt right for a proper dinner, not a rushed turnover.`,
  (s) =>
    `Bill felt fair relative to portions; nobody at our table had that \"were we gouged\" moment.`,
  (s) =>
    `They handled a couple of substitutions without friction. That's the kind of small thing guests remember.`,
  (s) =>
    `${s} read the vibe of our table correctly: upbeat when celebrating, quieter when wrapping up.`,
  ...PHRASE_BRIDGES_LONG_EXTRA,
];

const BRIDGES_SHORT: readonly ((store: string) => string)[] = [
  (s) =>
    `Front of house at ${s} was in step with the kitchen.`,
  (s) =>
    `Nothing felt slapdash. ${s} had its act together night-of.`,
  (s) =>
    `${s} kept timing tight without making us clock-watch.`,
  (s) =>
    `Space was easy to settle into; no awkward seating shuffle.`,
  ...PHRASE_BRIDGES_SHORT_EXTRA,
];

// --- Closers: must include {store}

const CLOSERS_LONG: readonly Opener[] = [
  (s) =>
    `I'd go back to ${s} without overthinking it; the stuff above is what I'd tell someone choosing a spot this week.`,
  (s) =>
    `Happy to recommend ${s}: fair for what we got, and the evening felt easy from walk-in to goodbye.`,
  (s) =>
    `Bottom line for us: ${s} did the important parts well; if our experience is typical, it's a solid pick.`,
  (s) =>
    `I'll put ${s} in the rotation; not every place earns that slot after one visit.`,
  (s) =>
    `${s} is the kind of place I'd bring people who complain that \"reviews all sound fake,\" and our night felt grounded.`,
  ...PHRASE_CLOSERS_LONG_EXTRA,
];

const CLOSERS_SHORT: readonly Opener[] = [
  (s) =>
    `${s} gets a yes from me; I'll be back when I'm in the mood for the same kind of night.`,
  (s) =>
    `I'd send people to ${s}; it was worth the time we spent there.`,
  (s) =>
    `No drama: ${s} was simply good.`,
  (s) =>
    `Skip the overthinking and try ${s}.`,
  ...PHRASE_CLOSERS_SHORT_EXTRA,
];

/** Rough cost of list+glue words for budget tuning (not counting store). */
function keywordBudgetSignals(kws: string[]): { many: boolean; longPhrases: boolean } {
  const many = kws.length > 8;
  const longPhrases =
    kws.reduce((n, k) => n + k.length, 0) > 140 || kws.some((k) => k.split(/\s+/).length > 5);
  return { many, longPhrases };
}

function buildKeywordDualBlock(
  store: string,
  kws: string[],
  rng: () => number,
): string | null {
  if (kws.length < 6) return null;
  if (rng() > 0.38) return null;
  const minFirst = 2;
  const maxFirst = kws.length - 2;
  if (maxFirst < minFirst) return null;
  const pivot = minFirst + Math.floor(rng() * (maxFirst - minFirst + 1));
  const a = oxfordJoinKeywordPhrases(kws.slice(0, pivot));
  const b = oxfordJoinKeywordPhrases(kws.slice(pivot));
  return pick(DUAL_KEYWORD_BLOCKS, rng)(store, a, b);
}

function buildKeywordParagraph(
  store: string,
  kws: string[],
  rngCompact: () => number,
  rngPhrase: () => number,
  compact: boolean,
  seed: number,
): string {
  const rDual = forkRng(seed, 0x33);
  if (!compact) {
    const dual = buildKeywordDualBlock(store, kws, rDual);
    if (dual) return dual;
  }
  const list = oxfordJoinKeywordPhrases(kws);
  if (compact) {
    return pick(CORE_COMPACT, rngCompact)(store, list);
  }
  return pick(CORE_POOL_NON_COMPACT, rngPhrase)(store, list);
}

function buildReviewInner(
  store: string,
  kws: string[],
  compact: boolean,
  seed: number,
): string {
  const rOpener = forkRng(seed, 0x101);
  const rCompact = forkRng(seed, 0x103);
  const rPhrase = forkRng(seed, 0x102);
  const rBridge = forkRng(seed, 0x104);
  const rCloser = forkRng(seed, 0x105);
  const rOrder = forkRng(seed, 0x106);

  const openerPool = compact ? OPENERS_SHORT : OPENERS_LONG;
  const bridgePool = compact ? BRIDGES_SHORT : BRIDGES_LONG;
  const closerPool = compact ? CLOSERS_SHORT : CLOSERS_LONG;

  const opener = pick(openerPool, rOpener)(store);
  const core = buildKeywordParagraph(store, kws, rCompact, rPhrase, compact, seed);
  const bridge = pick(bridgePool, rBridge)(store);
  const closer = pick(closerPool, rCloser)(store);

  const bridgeFirst = !compact && rOrder() < 0.34;
  const body = bridgeFirst
    ? `${opener} ${bridge} ${core} ${closer}`
    : `${opener} ${core} ${bridge} ${closer}`;
  return body.replace(/\s+/g, " ").trim();
}

function tuneWordCount(
  text: string,
  store: string,
  seed: number,
  tuneSalt: number,
): string {
  const rng = forkRng(seed, tuneSalt);
  const TARGET = 100;
  let t = text;
  let wc = wordCount(t);

  const trimNonListTail = (s: string): string => {
    const idx = s.lastIndexOf(".");
    if (idx <= 0) return s;
    const prev = s.lastIndexOf(".", idx - 1);
    if (prev <= 0) return s;
    return s.slice(0, idx + 1).trim();
  };

  let guard = 0;
  while (wc > 115 && guard < 4) {
    t = trimNonListTail(t);
    wc = wordCount(t);
    guard++;
  }

  guard = 0;
  const fillers: readonly ((s: string) => string)[] = [
    (s) =>
      `That steady quality is a big part of why I'd pick ${s} again over rolling the dice somewhere new.`,
    (s) =>
      `Walking out of ${s}, we already knew what we'd order next time, and that's usually a good sign.`,
    (s) =>
      `It's rare that I leave ${s} without a single nitpick; this time the nits were small.`,
    (s) =>
      `${s} felt like a place that wants repeat locals, not one-and-done tourists.`,
    (s) =>
      `I'd rather under-promise on ${s} and have a friend be pleasantly surprised; our night fit that pattern.`,
    ...PHRASE_FILLERS_EXTRA,
  ];

  while (wc < 92 && guard < 6) {
    t = `${t} ${pick(fillers, rng)(store)}`.replace(/\s+/g, " ").trim();
    wc = wordCount(t);
    guard++;
  }

  if (wc < TARGET - 5) {
    t = `${t} ${pick(fillers, rng)(store)}`.replace(/\s+/g, " ").trim();
  }
  if (wordCount(t) > TARGET + 8) {
    t = trimNonListTail(t);
  }

  return t.replace(/\s+/g, " ").trim();
}

function reviewWithNoKeywords(store: string, seed: number): string {
  const rO = forkRng(seed, 0x201);
  const rC = forkRng(seed, 0x202);
  const opener = pick(OPENERS_SHORT, rO)(store);
  const closer = pick(CLOSERS_SHORT, rC)(store);
  const mid =
    "The night ran smoothly for us; I'd still name " +
    store +
    " as a place I'd go back to for hospitality and pacing alone.";
  const t = `${opener} ${mid} ${closer}`.replace(/\s+/g, " ").trim();
  return tuneWordCount(t, store, seed, 0x203);
}

export const REVIEW_TARGET_WORDS = 100;

/** @deprecated use REVIEW_TARGET_WORDS */
export const GEO_REVIEW_TARGET_WORDS = REVIEW_TARGET_WORDS;

/** @deprecated */
export const FULL_TEMPLATE_COUNTS = {
  one: 0,
  two: 0,
  three: 0,
  total: 0,
} as const;

function appendMissingKeyword(
  text: string,
  kw: string,
  seed: number,
  salt: number,
): string {
  const rng = forkRng(seed, salt);
  const tails: readonly ((k: string) => string)[] = [
    (k) => `${k} was a highlight for us.`,
    (k) => `They came through on ${k}.`,
    (k) => `No complaints on ${k}.`,
    (k) => `${k} felt genuine, not bolted on at the end.`,
    (k) => `I'd point to ${k} if someone asked what to expect.`,
    (k) => `${k} didn't get lost in the shuffle.`,
    (k) => `Easy to recommend on ${k} alone.`,
  ];
  return `${text} ${pick(tails, rng)(kw)}`.replace(/\s+/g, " ").trim();
}

/**
 * Catches accidental reintroduction of old "SEO / AIO" template copy (dev-only console warning).
 * User-supplied keywords may still contain these substrings; warning is informational.
 */
const BANNED_TEMPLATE_LEAK_PHRASES = [
  "aio-style",
  "aio style",
  "for transparency to future guests",
  "decision-quality",
  "maps-driven",
  "using google to compare",
  "optimization for relevance",
  "how people search and choose locally",
  "search and maps",
  "geo optimization",
  "local seo",
  "ai-style summaries",
  "summaries that prize clarity",
] as const;

/** Typographic sentence dashes (U+2014/U+2013) read "AI"; normalize any leak from keywords or copy-paste. */
function normalizeGuestFacingDashes(text: string): string {
  return text
    .replace(/\u2014/g, ", ")
    .replace(/\u2013/g, "-")
    .replace(/\s*,\s*/g, ", ")
    .replace(/\s+/g, " ")
    .trim();
}

function warnIfMarketingJargonLeak(text: string): void {
  if (typeof process === "undefined" || process.env.NODE_ENV === "production") return;
  const lower = text.toLowerCase();
  for (const phrase of BANNED_TEMPLATE_LEAK_PHRASES) {
    if (lower.includes(phrase)) {
      console.warn(
        `[review-full-templates] Output contains "${phrase}": remove from templates; guests should not see product/SEO wording.`,
      );
    }
  }
}

export function buildFullTemplateReview(
  store: string,
  kws: string[],
  seed: number,
): string {
  const name = store.trim() || "this establishment";
  const keywords = kws.map((k) => k.trim()).filter(Boolean);

  if (keywords.length === 0) {
    const out = normalizeGuestFacingDashes(reviewWithNoKeywords(name, seed));
    warnIfMarketingJargonLeak(out);
    return out;
  }

  const shuffled = shuffle(keywords, forkRng(seed, 0xb8b26351));

  const { many, longPhrases } = keywordBudgetSignals(shuffled);
  const compact = many || longPhrases;

  let text = buildReviewInner(name, shuffled, compact, seed);
  text = tuneWordCount(text, name, seed, 0x301);

  if (!text.includes(name)) {
    text = `${text} (${name})`.replace(/\s+/g, " ").trim();
  }

  let salt = 0xd00;
  for (const kw of shuffled) {
    if (kw.length > 0 && !text.includes(kw)) {
      text = appendMissingKeyword(text, kw, seed, salt++);
    }
  }

  text = tuneWordCount(text, name, seed, 0x302);
  warnIfMarketingJargonLeak(text);
  return normalizeGuestFacingDashes(text);
}
