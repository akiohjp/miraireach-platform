export const APP_CONFIG = {
  storeName: "Dubai Marina Authentic Sushi",
  greetingText:
    "Thank you so much for dining with us today! We'd love to hear your thoughts.",
  keywords: [
    "authentic sushi",
    "premium wagyu",
    "omakase experience",
    "fresh fish",
    "excellent service",
    "stunning ambiance",
    "waterfront view",
    "worth every dirham",
    "Dubai Marina",
    "intimate setting",
    "attentive staff",
    "chef's recommendation",
    "must-visit restaurant",
    "Instagram-worthy",
    "great value",
    "romantic dinner",
    "sake selection",
    "teppanyaki",
    "unforgettable experience",
    "hidden gem",
  ] as const,
  gbpReviewUrl: "https://maps.google.com/?cid=MOCK_GBP_ID",
} as const;

export type Keyword = (typeof APP_CONFIG.keywords)[number];

export type Step =
  | "rating"
  | "keywords"
  | "generating"
  | "result"
  | "feedback"
  | "feedback_sent";
