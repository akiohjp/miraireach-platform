/**
 * LocalReach /free strategy report lead quiz — shared by `/localreach` and `/contact` prefill.
 */
export const LOCALREACH_QUIZ_STORAGE_KEY = "localreach-quiz-v1";
/** First line of the quiz block; used to detect prefilled textarea vs server merge. */
export const LOCALREACH_QUIZ_BODY_MARKER = "=== LocalReach visibility quiz (answers on file) ===";
export const LOCALREACH_LEAD_QUIZ_QUESTIONS = [
  {
    question: "How many Google reviews does your business currently have?",
    options: ["Fewer than 20", "20 – 100", "100 – 300", "300+"],
  },
  {
    question: "How are you currently collecting customer reviews?",
    options: ["We're not", "Asking verbally", "Paper / QR cards", "An existing tool"],
  },
  {
    question: "What's your biggest growth priority right now?",
    options: ["More Google reviews", "Repeat customers", "Higher map ranking", "All of the above"],
  },
] as const;

/** Short labels for inbound email / CRM — easy to scan without re-reading full questions. */
const QUIZ_SUMMARY_LABELS = [
  "Google review count (self-reported)",
  "How they collect reviews today",
  "Top growth priority right now",
] as const;

export type FormatLocalReachQuizOptions = {
  /** Human-readable timestamp (e.g. client timezone); helps verify "when" later. */
  recordedAt?: string;
};

const QUIZ_ANSWER_MAX_LEN = 500;

/** Plain text block for email / textarea (server or client). */
export function formatLocalReachQuizFromAnswers(
  answers: readonly [string, string, string],
  opts?: FormatLocalReachQuizOptions,
): string {
  const summaryLines = QUIZ_SUMMARY_LABELS.map((label, i) => `• ${label}: ${answers[i]}`).join("\n");
  const detailLines = LOCALREACH_LEAD_QUIZ_QUESTIONS.map((item, i) => {
    return `${i + 1}. ${item.question}\n   Answer: ${answers[i]}`;
  }).join("\n\n");

  const header = [
    LOCALREACH_QUIZ_BODY_MARKER,
    "",
    "The lead completed the 3 questions on the LocalReach page before opening this form.",
    "Use the summary for a quick scan; detail matches the exact on-page wording.",
    opts?.recordedAt ? `Recorded (visitor device): ${opts.recordedAt}` : null,
    "",
    "--- QUICK SUMMARY (for our team) ---",
    summaryLines,
    "",
    "--- FULL QUESTIONS + ANSWERS ---",
    detailLines,
    "",
    "=== End quiz block ===",
    "",
    "---",
    "Anything else we should know (optional):",
    "",
  ]
    .filter((line): line is string => line != null)
    .join("\n");

  return header;
}

/** Read q0–q2 from the live URL + sessionStorage (browser only). Call at submit time so data is not lost if React state lags. */
export function readLocalReachQuizTripleFromBrowser(): [string, string, string] | null {
  if (typeof window === "undefined") return null;
  const sp = new URLSearchParams(window.location.search);
  const u0 = sp.get("q0")?.trim();
  const u1 = sp.get("q1")?.trim();
  const u2 = sp.get("q2")?.trim();
  if (u0 && u1 && u2) {
    return [u0, u1, u2].map((s) => s.slice(0, QUIZ_ANSWER_MAX_LEN)) as [string, string, string];
  }
  try {
    const raw = sessionStorage.getItem(LOCALREACH_QUIZ_STORAGE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as { q0?: string; q1?: string; q2?: string };
    const s0 = o.q0?.trim();
    const s1 = o.q1?.trim();
    const s2 = o.q2?.trim();
    if (!s0 || !s1 || !s2) return null;
    return [s0, s1, s2].map((s) => s.slice(0, QUIZ_ANSWER_MAX_LEN)) as [string, string, string];
  } catch {
    return null;
  }
}

/** Build prefilled message body when all `q0`–`q2` query params are present. */
export function formatLocalReachQuizForMessage(
  searchParams: URLSearchParams,
  opts?: FormatLocalReachQuizOptions,
): string | null {
  const q0 = searchParams.get("q0");
  const q1 = searchParams.get("q1");
  const q2 = searchParams.get("q2");
  if (!q0?.trim() || !q1?.trim() || !q2?.trim()) return null;
  return formatLocalReachQuizFromAnswers([q0, q1, q2], opts);
}
