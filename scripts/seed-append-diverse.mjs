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

const APPEND_TOPICS = [
  // BUSINESS & TECH (10)
  { source: "Arabian Business", topic: "Dubai Real Estate 2027: Predicting the Next Multi-Billion Dollar Development Corridor", category: "Real Estate & PropTech" },
  { source: "Entrepreneur Middle East", topic: "The Solo-Founder Boom: How UAE's New Visa Categories are Fueling a Startup Revolution", category: "AI & Deep Tech" },
  { source: "Forbes Middle East", topic: "Leading the Charge: 5 Emirati Women Transforming the Middle East's Energy Landscape", category: "AI & Deep Tech" },
  { source: "The National (Business)", topic: "The Ripple Effect: How Global Interest Rate Hikes are Impacting UAE Consumer Spending", category: "FinTech & Crypto" },
  { source: "Gulf Business", topic: "From Oil to Silicon: The Strategy Behind Abu Dhabi's $100bn Semiconductor Ambitions", category: "AI & Deep Tech" },
  { source: "Arabian Business", topic: "Cloud Sovereignty: Why UAE Enterprises are Moving Data to Local Hyperscalers", category: "AI & Deep Tech" },
  { source: "Entrepreneur Middle East", topic: "Scaling Beyond Borders: A Guide for UAE Fintechs Expanding into Africa and SE Asia", category: "FinTech & Crypto" },
  { source: "Forbes Middle East", topic: "Net Zero by 2050: Tracking the Progress of UAE's Top 50 Listed Companies", category: "AI & Deep Tech" },
  { source: "The National (Business)", topic: "The Future of Aviation: How Emirates is Integrating Sustainable Aviation Fuel (SAF)", category: "AI & Deep Tech" },
  { source: "Gulf Business", topic: "The Metaverse in Real Estate: Buying Property in Dubai's Digital Twin", category: "Real Estate & PropTech" },

  // GOURMET & LIFESTYLE (10)
  { source: "Michelin Guide", topic: "The Evolution of Desert Dining: How 'Nara' is Blending Traditional Bedouin Hospitality with Haute Cuisine", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "The Chef's Table Revolution: Why Intimate, Counter-Side Dining is the New Status Symbol in Dubai", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "Hidden Jumeirah: 10 Boutique Cafes and Concept Stores You Haven't Discovered Yet", category: "Gourmet & Dining" },
  { source: "What's On Dubai", topic: "Nightlife 2.0: The Immersive, Tech-Forward Clubs Redefining Dubai’s After-Dark Scene", category: "Lifestyle & Travel" },
  { source: "Condé Nast Traveller ME", topic: "Oman’s Green Mountains: Why Jabal Akhdar is the Ultimate 2026 Weekend Escape for UAE Residents", category: "Lifestyle & Travel" },
  { source: "Michelin Guide", topic: "Seafood Sustainability: How Dubai's Top Chefs are Sourcing Locally from the Arabian Gulf", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "The Rise of Non-Alcoholic Mixology: Dubai's High-End Bars are Getting Serious About Mocktails", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "The Art of Al Quoz: A 2026 Guide to the Galleries and Creative Hubs of Warehouse District", category: "Lifestyle & Travel" },
  { source: "What's On Dubai", topic: "The Beach Club Wars: How Palm West Beach is Competing for the Title of Dubai's Hottest Shoreline", category: "Lifestyle & Travel" },
  { source: "Condé Nast Traveller ME", topic: "Luxury Glamping: From Mleiha to Al Badayer, the Desert Resorts Redefining Camping", category: "Lifestyle & Travel" }
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
    // Use highly specific query for uniqueness
    const refinedQuery = `${query} luxury uae modern cinematic`.split(' ').slice(0, 5).join(' ');
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
  console.log(`APPEND-ONLY: INJECTING 20 MORE PREMIUM ARTICLES FROM SPECIFIC SOURCES...`);
  console.log("--------------------------------------------------");

  let addedCount = 0;
  for (let i = 0; i < APPEND_TOPICS.length; i++) {
    const item = APPEND_TOPICS[i];
    
    // Check for existence
    const exists = await checkExists(supabaseUrl, supabaseKey, item.topic);
    if (exists) {
      console.log(`[${i + 1}/20] SKIPPING: "${item.topic}" already exists.`);
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
  console.log(`APPEND-ONLY SEED COMPLETE. ${addedCount} ARTICLES ADDED TO ARCHIVE.`);
  console.log("--------------------------------------------------");
}

main();
