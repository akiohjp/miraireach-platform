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

const NEW_TOPICS = [
  // BUSINESS & TECH (10)
  { source: "Gulf News Business", topic: "Dubai Maritime City: The Next Hub for Global Shipping & AI-Driven Logistics", category: "Logistics & Supply Chain" },
  { source: "TradeArabia", topic: "Sharjah's Sustainable City: A Blueprint for Zero-Waste Living in the Desert", category: "Real Estate & PropTech" },
  { source: "WAM", topic: "UAE and India Sign Landmark Agreement on Digital Currency Interoperability", category: "FinTech & Crypto" },
  { source: "Property Finder Insights", topic: "The Shift to Secondary Markets: Why JVC and Arjan are Leading in Transaction Volume", category: "Real Estate & PropTech" },
  { source: "TechCrunch ME", topic: "Inside the Metaverse: How Dubai Retailers are Merging Physical and Digital Shopping", category: "AI & Deep Tech" },
  { source: "Gulf News Business", topic: "The UAE Corporate Tax One Year On: How Businesses Have Adapted and Thrived", category: "FinTech & Crypto" },
  { source: "TradeArabia", topic: "NEOM and the UAE: Strengthening Economic Ties Through Massive Infrastructure Projects", category: "Real Estate & PropTech" },
  { source: "Property Finder Insights", topic: "Ultra-Luxury Villas in Palm Jebel Ali: A New High for Dubai Real Estate Prices", category: "Real Estate & PropTech" },
  { source: "WAM", topic: "UAE’s AI Minister Announces New Ethics Framework for Generative AI Models", category: "AI & Deep Tech" },
  { source: "TechCrunch ME", topic: "The Rise of EdTech in Dubai: How AI Tutors are Personalizing Learning for K-12", category: "AI & Deep Tech" },

  // F&B & LIFESTYLE (10)
  { source: "Michelin Guide", topic: "The Rise of Nordic Flavors in Dubai: How 'Svea' is Redefining Jumeirah's Culinary Scene", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "The Psychology of Fine Dining: Why Dubai's Newest Restaurants are Focusing on Sensory Design", category: "Gourmet & Dining" },
  { source: "Caterer Middle East", topic: "Robotic Kitchens in DIFC: The Efficiency vs. Artistry Debate in 2026", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "The Hatta Adventure Hub: A Guide to the New Mountain Biking and Glamping District", category: "Lifestyle & Travel" },
  { source: "What's On Dubai", topic: "Rooftop Revivals: The Best New Sky-High Venues Opening Across Business Bay", category: "Lifestyle & Travel" },
  { source: "Michelin Guide", topic: "Under the Stars: The Best Open-Air Michelin-Recommended Dining in Dubai Marina", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "Fermentation and Foraging: The Ancient Techniques Trending in Dubai's Modern Kitchens", category: "Gourmet & Dining" },
  { source: "Caterer Middle East", topic: "The Growth of Specialty Tea Houses: A New Alternative to Dubai's Coffee Culture", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "Exploring Old Dubai: A Deep Dive into the Hidden Gems of Al Bastakiya in 2026", category: "Lifestyle & Travel" },
  { source: "What's On Dubai", topic: "The Wellness Revolution: Inside the New Cryotherapy and Biohacking Centers in DIFC", category: "Lifestyle & Travel" }
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
      * 'content' field MUST contain ONLY English. No Arabic allowed.
      * 'content_ar' field MUST contain ONLY Arabic. No English allowed.
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
    // Use a more specific query for uniqueness
    const refinedQuery = `${query} dubai architecture luxury interior detail`.split(' ').slice(0, 5).join(' ');
    const res = await unsplash.photos.getRandom({ query: refinedQuery, orientation: "landscape", count: 1 });
    if (res.response && Array.isArray(res.response)) return res.response[0].urls.regular;
    if (res.response) return res.response.urls?.regular || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
    return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  } catch (err) {
    return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  }
}

async function checkExists(supabaseUrl, supabaseKey, title) {
  const res = await fetch(`${supabaseUrl}/rest/v1/articles?title=eq.${encodeURIComponent(title)}&select=id`, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
  });
  if (!res.ok) return false;
  const data = await res.json();
  return data.length > 0;
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
  console.log(`ACCUMULATING: INJECTING 20 NEW PREMIUM ARTICLES WITHOUT DELETION...`);
  console.log("--------------------------------------------------");

  let addedCount = 0;
  for (let i = 0; i < NEW_TOPICS.length; i++) {
    const item = NEW_TOPICS[i];
    
    // Check for existence to avoid double-posting the same seed
    const exists = await checkExists(supabaseUrl, supabaseKey, item.topic);
    if (exists) {
      console.log(`[${i + 1}/20] SKIPPING: "${item.topic}" already exists in the database.`);
      continue;
    }

    process.stdout.write(`[${i + 1}/20] Generating for ${item.source}: "${item.topic}"... `);
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

      if (insertRes.ok) {
        console.log("DONE.");
        addedCount++;
      } else {
        console.error(`FAILED: ${await insertRes.text()}`);
      }

      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`ERROR: ${err.message}`);
    }
  }

  console.log("--------------------------------------------------");
  console.log(`ACCUMULATION COMPLETE. ${addedCount} NEW ARTICLES ADDED.`);
  console.log("--------------------------------------------------");
}

main();
