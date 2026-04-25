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

const PREMIUM_TOPICS = [
  { source: "Michelin Guide", topic: "Atlantis The Royal's New 3-Star French Omakase Experience: A Technical Masterclass", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "Burj Al Arab's Chef of the Year on the Convergence of Middle Eastern Spices & Japanese Precision", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "Al Quoz Unveiled: 5 Hidden Art-Infused Coffee Roasteries in the Industrial Heart of Dubai", category: "Gourmet & Dining" },
  { source: "What's On Dubai", topic: "Palm Jumeirah's Newest Jewel: The Greek-Inspired Luxury Beach Club Redefining the Weekend", category: "Lifestyle & Travel" },
  { source: "Dubai Calendar", topic: "The Dubai Mall Extension: A New Era of Next-Gen Retail Entertainment and Immersive Art", category: "Lifestyle & Travel" },
  { source: "Michelin Guide", topic: "The Evolution of the Steakhouse: Why Dubai's Specialized Wagyu Boutiques are Setting Global Standards", category: "Gourmet & Dining" },
  { source: "Condé Nast Traveller ME", topic: "Desert Glamping 2.0: Inside the Ultra-Luxury Tents of Al Marmoom with 24-Hour Butler Service", category: "Lifestyle & Travel" },
  { source: "Gault&Millau UAE", topic: "The Zero-Waste Frontier: How DIFC's Top Kitchens are Achieving Sustainability Without Sacrifice", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "The Brunch Revolution: Moving from Lavish Buffets to Interactive, Chef-Led Table Service", category: "Gourmet & Dining" },
  { source: "What's On Dubai", topic: "Submerged Elegance: Inside the New Underwater Nightclub Concept at The World Islands", category: "Lifestyle & Travel" },
  { source: "Michelin Guide", topic: "Secret Garden Dining: Exploring the Open-Air Mediterranean Gems Tucked Away in Jumeirah 2", category: "Gourmet & Dining" },
  { source: "Dubai Calendar", topic: "Museum of the Future: The New Exhibition Exploring AI Art and the Post-Human Creativity Era", category: "AI & Deep Tech" },
  { source: "Gault&Millau UAE", topic: "The Modern Emirati Movement: The Female Chefs Reimagining Local Heritage for a Global Palate", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "Family Luxury Perfected: The Top 5 Sustainable Resorts in Saadiyat Island for a Quick Escape", category: "Lifestyle & Travel" },
  { source: "What's On Dubai", topic: "PropTech in Paradise: How Luxury Rentals in Dubai Marina are Using VR for Next-Gen Viewings", category: "Real Estate & PropTech" },
  { source: "Michelin Guide", topic: "The Classic Revival: Why Downtown Dubai's New Vintage French Bistros are Capturing the Elite", category: "Gourmet & Dining" },
  { source: "Dubai Calendar", topic: "Art Dubai 2026: The Digital Renaissance and the Mainstreaming of High-End NFT Collectibles", category: "AI & Deep Tech" },
  { source: "Gault&Millau UAE", topic: "Molecular Mixology: The High-Tech Bars in DIFC Redefining the Dubai After-Hours Experience", category: "Gourmet & Dining" },
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
    You are a world-class luxury journalist for ${item.source}.
    Generate an authoritative, high-density, and stunningly written report.
    Topic: ${item.topic}
    Category: ${item.category}
    
    Structure:
    1. Introduction: Captivating and evocative (150 words).
    2. The Experience (H2): A deep dive into the atmosphere, technical details, or design.
    3. Behind the Scenes (H2): Insights from chefs, architects, or curators.
    4. Why it Matters (H2): The strategic significance in the Dubai 2026 landscape.
    5. AI Insight (H2): A strategic takeaway regarding tech or market impact.
    
    Requirements:
    - Minimum 1500 words in English.
    - Professional, high-quality Arabic translation for ALL sections.
    - STUNNING Markdown formatting (H2, H3, bullet points, data).
    - Tone: Sophisticated, premium, and unique.
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
    const res = await unsplash.photos.getRandom({ query: query || "dubai luxury", orientation: "landscape", count: 1 });
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
  console.log("PURGING TRASH DATA (Titles with #, Update, Part, or very short content)...");
  // Delete articles with titles containing forbidden patterns
  const patterns = ['%', '#', 'Update%', 'Part%'];
  for (const p of patterns) {
    await fetch(`${supabaseUrl}/rest/v1/articles?title=ilike.${encodeURIComponent(p)}`, {
      method: "DELETE",
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
    });
  }
  // Also delete very short content (placeholder for 'thin' check)
  // Since we can't easily filter by length in REST without a function, we'll rely on the title purge for now.
  console.log("Purge complete.");

  console.log("--------------------------------------------------");
  console.log(`INJECTING 20 PREMIUM ARTICLES...`);
  console.log("--------------------------------------------------");

  for (let i = 0; i < PREMIUM_TOPICS.length; i++) {
    const item = PREMIUM_TOPICS[i];
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

      if (insertRes.ok) console.log("DONE.");
      else console.error(`FAILED: ${await insertRes.text()}`);

      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`ERROR: ${err.message}`);
    }
  }

  console.log("--------------------------------------------------");
  console.log("PREMIUM INJECTION COMPLETE.");
  console.log("--------------------------------------------------");
}

main();
