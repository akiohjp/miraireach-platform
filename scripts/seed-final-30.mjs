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

const BULK_TOPICS = [
  // Gourmet & Lifestyle (15)
  { source: "Michelin Guide", topic: "The Alchemy of Saffron: How Dubai's Top Persian Chefs Source the Red Gold", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "The Table of 12: Private Dining Experiences That Define Dubai Luxury", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "Best Hidden Patios for Winter Dining in Jumeirah and Al Wasl", category: "Lifestyle & Travel" },
  { source: "Michelin Guide", topic: "From Sea to Plate: The Rise of Locally Sourced Sustainable Seafood in the UAE", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "The Sommelier's Journal: Rare Vintages and Pairings in Dubai's DIFC", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "Luxury Staycations: The Most Over-The-Top Suites for 2026", category: "Lifestyle & Travel" },
  { source: "Michelin Guide", topic: "Modern Emirati: The Young Chefs Breaking Tradition in the Kitchen", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "The Architecture of Taste: How Restaurant Design Influences the Dining Experience", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "The Ultimate Guide to Dubai's Best Specialty Coffee Roasters", category: "Gourmet & Dining" },
  { source: "Michelin Guide", topic: "Michelin Bib Gourmand: High Quality at a Great Value in Old Dubai", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "Culinary Diplomacy: How Dubai Became the World's Gastronomic Hub", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "Night Golf and Dining: The Best Courses for an Evening Round and a Meal", category: "Lifestyle & Travel" },
  { source: "Michelin Guide", topic: "The Dessert Masters: 5 Pastry Chefs Pushing the Boundaries of Sweets", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "Zero-Waste Cocktails: The Best Sustainable Bars in the City", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "The Art of the Afternoon Tea: 5 Spots That Reinvent the Classic", category: "Gourmet & Dining" },

  // Business & Tech (15)
  { source: "Arabian Business", topic: "The 5G Revolution: How Telecommunications are Transforming UAE Smart Cities", category: "AI & Deep Tech" },
  { source: "Gulf Business", topic: "Venture Capital Surge: Why the GCC is the New Frontier for Startup Funding", category: "FinTech & Crypto" },
  { source: "Forbes Middle East", topic: "The Rise of Female Tech Founders in the Arab World", category: "AI & Deep Tech" },
  { source: "TechCrunch ME", topic: "Autonomous Skyways: The Future of Drone Delivery in Dubai Silicon Oasis", category: "AI & Deep Tech" },
  { source: "Arabian Business", topic: "Banking 3.0: How Neobanks are Disrupting Traditional UAE Finance", category: "FinTech & Crypto" },
  { source: "Gulf Business", topic: "The Energy Transition: ADNOC's Path to Net Zero by 2045", category: "AI & Deep Tech" },
  { source: "Forbes Middle East", topic: "Family Offices: How the Next Generation is Shifting to Tech Investments", category: "FinTech & Crypto" },
  { source: "TechCrunch ME", topic: "Web3 Gaming: Why Dubai is the Hub for the Next Play-to-Earn Wave", category: "FinTech & Crypto" },
  { source: "Arabian Business", topic: "Tourism 2.0: Integrating AI into the Dubai Visitor Experience", category: "AI & Deep Tech" },
  { source: "Gulf Business", topic: "Space Economy: UAE's Strategic Moves in the Global Space Industry", category: "AI & Deep Tech" },
  { source: "Forbes Middle East", topic: "The Retail Tech Boom: How E-commerce Giants are Winning the Last Mile", category: "AI & Deep Tech" },
  { source: "TechCrunch ME", topic: "Quantum Computing: The UAE's Vision for the Next Tech Frontier", category: "AI & Deep Tech" },
  { source: "Arabian Business", topic: "Blue Economy: Protecting the Arabian Gulf while Growing the Maritime Sector", category: "AI & Deep Tech" },
  { source: "Gulf Business", topic: "The Logistics Hub: How Jebel Ali Port is Navigating Global Supply Chain Shifts", category: "Logistics & Supply Chain" },
  { source: "TechCrunch ME", topic: "PropTech Innovations: How AI is Changing the Way We Buy and Sell Dubai Real Estate", category: "Real Estate & PropTech" }
];

async function generatePremiumContent(openai, item) {
  const systemPrompt = `
    You are an elite analyst for ${item.source}. 
    Write a definitive 1500+ word strategic report.
    Topic: ${item.topic}
    Requirements:
    - STRICT LANGUAGE SEPARATION: "content" (English only), "content_ar" (Arabic only).
    - Detailed Markdown formatting.
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
    if (!unsplash) return "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80";
    const res = await unsplash.photos.getRandom({ query: `${query} dubai`, orientation: "landscape", count: 1 });
    if (res.response && Array.isArray(res.response)) return res.response[0].urls.regular;
    return "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80";
  } catch (e) {
    return "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80";
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

  if (!supabaseUrl || !supabaseKey || !openaiKey) throw new Error("Missing config");

  const openai = new OpenAI({ apiKey: openaiKey });
  const unsplash = createApi({ accessKey: unsplashKey || "" });

  console.log(`FINAL BULK ADDING 30 ARTICLES (Append-only)...`);

  for (let i = 0; i < BULK_TOPICS.length; i++) {
    const item = BULK_TOPICS[i];
    
    // Deduplication check
    const exists = await checkExists(supabaseUrl, supabaseKey, item.topic);
    if (exists) {
      console.log(`[${i+1}/30] Skipping: "${item.topic}" (Already exists)`);
      continue;
    }

    process.stdout.write(`[${i+1}/30] Generating for ${item.source}... `);
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
