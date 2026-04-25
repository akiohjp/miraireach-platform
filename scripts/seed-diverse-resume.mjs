import { readFile } from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";
import { createApi } from "unsplash-js";

async function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  try {
    const raw = await readFile(envPath, "utf-8");
    for (const line of raw.split(/\r?\n/)) {
      if (!line || line.trim().startsWith("#")) continue;
      const idx = line.indexOf("=");
      if (idx === -1) continue;
      const key = line.slice(0, idx).trim();
      const value = line.slice(idx + 1).trim();
      if (key && value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch (err) {
    console.warn("No .env.local found, using process.env");
  }
}

const RESUME_TOPICS = [
  { source: "Michelin Guide", topic: "Molecular Mixology: The High-Tech Bars in Downtown Dubai Redefining the After-Hours Scene", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "The Female Chefs Leading Dubai's Modern Emirati Cuisine Movement", category: "Gourmet & Dining" },
  { source: "Caterer Middle East", topic: "Vertical Farming to Table: The Rise of Desert-Grown Michelin Concepts", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "Hatta Highlands: Exploring the Ultra-Luxury Eco-Villas and the Future of Mountain Tourism", category: "Lifestyle & Travel" },
  { source: "What's On Dubai", topic: "The 5-Star Pet Trend: Why Dubai's Top Luxury Hotels are Now Catering to Furry Companions", category: "Lifestyle & Travel" }
];

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=80"
];

async function generatePremiumContent(openai, item) {
  const systemPrompt = `
    You are a world-class investigative journalist and strategic analyst for ${item.source}.
    Generate an authoritative, high-density, and stunningly written strategic report.
    Topic: ${item.topic}
    Category: ${item.category}
    
    Structure:
    1. Executive Summary/Introduction: Captivating and data-driven (200 words).
    2. Deep Dive Analysis (H2): Exploring the technical, economic, or cultural forces at play.
    3. Market Impact & Strategic Value (H2): How this affects stakeholders in the UAE.
    4. 2026 Projections (H2): What the future holds for this specific trend.
    5. AI Insight (H2): A unique strategic takeaway regarding tech integration or market disruption.
    
    Requirements:
    - Minimum 1500 words in English.
    - Professional, high-quality Arabic translation for ALL sections.
    - STUNNING Markdown formatting (H2, H3, bolding, bullet points, data).
    - Tone: Sophisticated, authoritative, premium.
    - Return a JSON object with: title, title_ar, excerpt, excerpt_ar, content, content_ar, image_query
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "system", content: systemPrompt }, { role: "user", content: `Write the definitive report on "${item.topic}".` }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);
}

async function getRandomUnsplashImage(unsplash, query, index) {
  try {
    if (!unsplash) return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
    const res = await unsplash.photos.getRandom({ query: query || "dubai lifestyle", orientation: "landscape", count: 1 });
    if (res.response && Array.isArray(res.response)) return res.response[0].urls.regular;
    if (res.response) return res.response.urls?.regular || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
    return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  } catch (err) {
    return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  }
}

async function main() {
  await loadEnv();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!supabaseUrl || !supabaseKey || !openaiKey) throw new Error("Missing credentials");

  const openai = new OpenAI({ apiKey: openaiKey });
  const unsplash = unsplashKey && !unsplashKey.includes("your_") ? createApi({ accessKey: unsplashKey }) : null;

  console.log("--------------------------------------------------");
  console.log(`RESUMING: INJECTING REMAINING 5 PREMIUM ARTICLES...`);
  console.log("--------------------------------------------------");

  for (let i = 0; i < RESUME_TOPICS.length; i++) {
    const item = RESUME_TOPICS[i];
    process.stdout.write(`[${i + 1}/5] Generating for ${item.source}: "${item.topic}"... `);
    try {
      const curation = await generatePremiumContent(openai, item);
      const imageUrl = await getRandomUnsplashImage(unsplash, curation.image_query, i);

      const payload = {
        category: item.category,
        title: curation.title,
        title_ar: curation.title_ar,
        excerpt: curation.excerpt,
        excerpt_ar: curation.excerpt_ar,
        content: curation.content,
        content_ar: curation.content_ar,
        image_url: imageUrl,
        image_search_query: curation.image_query,
        source_name: item.source,
        is_published: true,
        is_curated: true,
        created_at: new Date().toISOString(),
      };

      const insertRes = await fetch(`${supabaseUrl}/rest/v1/articles`, {
        method: "POST",
        headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (insertRes.ok) console.log("DONE.");
      else console.error(`FAILED: ${await insertRes.text()}`);

      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`ERROR: ${err.message}`);
    }
  }

  console.log("--------------------------------------------------");
  console.log("RESUME COMPLETE. TOTAL 25 ARTICLES SHOULD NOW BE PRESENT.");
  console.log("--------------------------------------------------");
}

main();
