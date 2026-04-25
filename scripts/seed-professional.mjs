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

const REBORN_TOPICS = [
  { source: "Michelin Guide", topic: "The Art of Emirati Fusion: A New Era for Dubai's Fine Dining", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "The Best Secret Speakeasies and Hidden Bars in DIFC for 2026", category: "Gourmet & Dining" },
  { source: "What's On Dubai", topic: "Experience the Ultimate Luxury Staycation at Atlantis The Royal", category: "Lifestyle & Travel" },
  { source: "Michelin Guide", topic: "Sustainability as a Standard: Dubai's Green Star Revolution", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "The 10 Best New Restaurant Openings You Can't Miss This Season", category: "Gourmet & Dining" },
  { source: "Arabian Business", topic: "Dubai's Billion-Dollar AI Strategy: Transforming the City's GDP by 2030", category: "AI & Deep Tech" },
  { source: "Gulf Business", topic: "The Rise of FinTech Unicorns in the UAE: A Regulatory Success Story", category: "FinTech & Crypto" },
  { source: "Forbes Middle East", topic: "Top 5 AI Innovations Reshaping Dubai's Real Estate Market", category: "Real Estate & PropTech" },
  { source: "TechCrunch", topic: "Autonomous Logisitics: How DP World is Using AI to Optimize Global Trade", category: "Logistics & Supply Chain" },
  { source: "Arabian Business", topic: "The D33 Agenda: A Progress Report on Dubai's Economic Future", category: "AI & Deep Tech" },
  { source: "Gulf Business", topic: "Green Finance: Why the UAE is Leading the GCC in ESG Investments", category: "FinTech & Crypto" },
  { source: "Forbes Middle East", topic: "The Next Decade of Tech: Why Global Founders are Relocating to Dubai", category: "AI & Deep Tech" },
  { source: "TechCrunch", topic: "Web3 and Beyond: Dubai's Vision for the Future of the Decentralized Internet", category: "FinTech & Crypto" },
  { source: "What's On Dubai", topic: "The Cultural Renaissance: How Alserkal Avenue is Redefining Middle Eastern Art", category: "Lifestyle & Travel" },
  { source: "Michelin Guide", topic: "The Master of Spices: An Insider's Look at Dubai's Most Exclusive Kitchens", category: "Gourmet & Dining" }
];

async function generatePremiumContent(openai, item) {
  const systemPrompt = `
    You are an elite journalist for ${item.source}. 
    Write a definitive 1500+ word strategic report.
    Topic: ${item.topic}
    Requirements:
    - STRICT LANGUAGE SEPARATION: "content" (English only), "content_ar" (Arabic only).
    - Detailed Markdown formatting with rich structure.
    - AI Market Insight section included.
    - JSON return: title, title_ar, excerpt, excerpt_ar, content, content_ar, image_query
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "system", content: systemPrompt }, { role: "user", content: `Generate report for: ${item.topic}` }],
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);
}

async function getRandomUnsplashImage(unsplash, query, i) {
  try {
    if (!unsplash) return `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80&sig=${Date.now()}_${i}`;
    const res = await unsplash.photos.getRandom({ query: `${query} dubai architecture luxury`, orientation: "landscape", count: 1 });
    if (res.response && Array.isArray(res.response)) {
      return `${res.response[0].urls.regular}&sig=${Date.now()}_${i}`;
    }
    return `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80&sig=${Date.now()}_${i}`;
  } catch (e) {
    return `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80&sig=${Date.now()}_${i}`;
  }
}

async function main() {
  await loadEnv();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!supabaseUrl || !supabaseKey || !openaiKey) throw new Error("Missing config");

  const openai = new OpenAI({ apiKey: openaiKey });
  const unsplash = createApi({ accessKey: unsplashKey || "" });

  console.log("PURGING ALL EXISTING ARTICLES...");
  await fetch(`${supabaseUrl}/rest/v1/articles`, {
    method: "DELETE",
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
  });
  console.log("Purge complete.");

  console.log(`GENERATING 15 REBORN PREMIUM ARTICLES...`);

  for (let i = 0; i < REBORN_TOPICS.length; i++) {
    const item = REBORN_TOPICS[i];
    process.stdout.write(`[${i+1}/15] Generating for ${item.source}... `);
    
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
        source_name: item.source,
        is_published: true,
        is_curated: true,
        created_at: new Date().toISOString()
      };

      const res = await fetch(`${supabaseUrl}/rest/v1/articles`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": supabaseKey, "Authorization": `Bearer ${supabaseKey}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) console.log("DONE.");
      else console.error(`FAILED: ${await res.text()}`);

      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      console.error(`ERROR: ${e.message}`);
    }
  }
}

main();
