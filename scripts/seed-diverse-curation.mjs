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

const DIVERSE_TOPICS = [
  // BUSINESS & TECH (10)
  { source: "Gulf News Business", topic: "Dubai's D33 Agenda: How the City Plans to Double its Economy by 2033", category: "AI & Deep Tech" },
  { source: "TradeArabia", topic: "The Rise of Neo-Banks in the UAE: Disrupting Traditional Lending for SMEs", category: "FinTech & Crypto" },
  { source: "WAM", topic: "UAE President Announces New National Investment Fund Targeting Green Energy", category: "AI & Deep Tech" },
  { source: "Property Finder Insights", topic: "Data Analysis: Why Dubai South is the New Epicenter of Affordable Luxury", category: "Real Estate & PropTech" },
  { source: "TechCrunch ME", topic: "Dubai-Based AI Startup Secures $50M Series B to Revolutionize Port Logistics", category: "AI & Deep Tech" },
  { source: "Gulf News Business", topic: "The Future of Work: Why 100% Remote Companies are Flourishing in Dubai", category: "AI & Deep Tech" },
  { source: "TradeArabia", topic: "Abu Dhabi Global Market (ADGM) Expands Jurisdiction to Reem Island", category: "FinTech & Crypto" },
  { source: "Property Finder Insights", topic: "The Rise of Branded Residences: Why Global Fashion Houses are Entering Dubai Real Estate", category: "Real Estate & PropTech" },
  { source: "WAM", topic: "UAE Space Agency Reveals Next Phase of Lunar Exploration Mission", category: "AI & Deep Tech" },
  { source: "TechCrunch ME", topic: "FinTech 2026: How Open Banking is Changing the Way Expats Send Remittances", category: "FinTech & Crypto" },

  // F&B & LIFESTYLE (15)
  { source: "Michelin Guide", topic: "Atlantis The Royal's New 3-Star French Omakase Experience: A Technical Masterclass", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "Burj Al Arab's Chef of the Year on the Convergence of Middle Eastern Spices & Japanese Precision", category: "Gourmet & Dining" },
  { source: "Caterer Middle East", topic: "The Labor Crisis in F&B: How Dubai's Top Restaurants are Retaining Talent in 2026", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "Al Quoz Unveiled: 5 Hidden Art-Infused Coffee Roasteries in the Industrial Heart of Dubai", category: "Gourmet & Dining" },
  { source: "What's On Dubai", topic: "Palm Jumeirah's Newest Jewel: The Greek-Inspired Luxury Beach Club Redefining the Weekend", category: "Lifestyle & Travel" },
  { source: "Michelin Guide", topic: "Sustainable Fine Dining: Why DIFC's New Zero-Waste Concept is the Most Talked-About Opening", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "The Rise of Molecular Majlis: Emirati Heritage Reimagined for the 2026 Palate", category: "Gourmet & Dining" },
  { source: "Caterer Middle East", topic: "Ghost Kitchens vs. Experience Dining: The Strategic Pivot of Dubai's Food Delivery Giants", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "Beyond the Burj: The Secret Desert Hideaways Offering Ultra-Private Dining Experiences", category: "Lifestyle & Travel" },
  { source: "What's On Dubai", topic: "The 2026 Fitness Boom: Inside Dubai's Newest High-Tech Wellness Social Clubs", category: "Lifestyle & Travel" },
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
    - LANGUAGE SEPARATION (MANDATORY):
      * The "content" field MUST contain ONLY English. Do not include any Arabic text.
      * The "content_ar" field MUST contain ONLY Arabic. Do not include any English text.
      * The same strict rule applies to title/title_ar and excerpt/excerpt_ar.
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
    const res = await unsplash.photos.getRandom({ query: query || "dubai business", orientation: "landscape", count: 1 });
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

  if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase credentials");
  if (!openaiKey) {
    console.error("ERROR: OPENAI_API_KEY is missing. Script cannot proceed.");
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey: openaiKey });
  const unsplash = unsplashKey && !unsplashKey.includes("your_") ? createApi({ accessKey: unsplashKey }) : null;

  console.log("--------------------------------------------------");
  console.log("APPEND-ONLY MODE ENABLED (Skipping Purge)...");

  console.log("--------------------------------------------------");
  console.log(`INJECTING 25 DIVERSE PREMIUM ARTICLES...`);
  console.log("--------------------------------------------------");

  for (let i = 0; i < DIVERSE_TOPICS.length; i++) {
    const item = DIVERSE_TOPICS[i];
    process.stdout.write(`[${i + 1}/25] Generating for ${item.source}: "${item.topic}"... `);
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
  console.log("DIVERSE CURATION INJECTION COMPLETE.");
  console.log("--------------------------------------------------");
}

main();
