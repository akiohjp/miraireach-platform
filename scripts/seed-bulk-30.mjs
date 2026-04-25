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
  { source: "Michelin Guide", topic: "The Art of Emirati Spices: A Deep Dive into 'Aseelah' at Radisson Blu", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "Why the Chef's Table at 'Moonrise' is Dubai's Most Exclusive Ticket", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "Best New Rooftop Bars in Dubai for 2026: From DIFC to the Palm", category: "Lifestyle & Travel" },
  { source: "Michelin Guide", topic: "Sustainability on a Plate: How 'Lowe' is Leading the Zero-Waste Movement", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "The Renaissance of Downtown Dining: Why 'Armani/Ristorante' Still Sets the Bar", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "Family-Friendly Fine Dining: The Best Luxury Spots That Welcome Kids", category: "Gourmet & Dining" },
  { source: "Michelin Guide", topic: "Street Food to Star-Studded: The Evolution of Dubai's Casual Dining Scene", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "Fermentation and Future: The Molecular Gastronomy Revolution in Jumeirah", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "The 24-Hour Guide to Eating in Dubai: From Sunrise Breakfast to Late-Night Bites", category: "Gourmet & Dining" },
  { source: "Michelin Guide", topic: "Hidden Gems: The Best Unassuming Michelin-Selected Spots in Deira", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "The Psychology of Service: How Dubai's Top Restaurants Train Their Elite Staff", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "Beach Club Dining: Why the Food at 'Twiggy' is as Good as the View", category: "Lifestyle & Travel" },
  { source: "Michelin Guide", topic: "The Pastry Kings: Exploring the Best Dessert Degustations in Dubai", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "Middle Eastern Fusion: How Young Chefs are Reimagining Levantine Classics", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "The Ultimate Brunch Guide 2026: The Best Parties and Platters in the City", category: "Lifestyle & Travel" },

  // Business & Tech (15)
  { source: "Arabian Business", topic: "Dubai's FDI Surge: Why Global Tech Giants are Relocating to the UAE", category: "AI & Deep Tech" },
  { source: "Gulf Business", topic: "The IPO Pipeline: Which UAE Startups are Heading for the Public Markets in 2027", category: "FinTech & Crypto" },
  { source: "Forbes Middle East", topic: "The New Philanthropy: How Dubai's Billionaires are Investing in Social Impact", category: "AI & Deep Tech" },
  { source: "TechCrunch ME", topic: "AI Port Logistics: How DP World is Using Generative AI to Optimize Global Trade", category: "AI & Deep Tech" },
  { source: "Arabian Business", topic: "The Property Boom 2.0: Predicting the Peak of Dubai's Real Estate Cycle", category: "Real Estate & PropTech" },
  { source: "Gulf Business", topic: "Green Finance: The Rise of ESG Bonds in the GCC Capital Markets", category: "FinTech & Crypto" },
  { source: "Forbes Middle East", topic: "Digital Nomads in Dubai: How the One-Year Remote Work Visa Changed the Economy", category: "AI & Deep Tech" },
  { source: "TechCrunch ME", topic: "EdTech in the Emirates: The AI Tutors Replacing Traditional Classrooms", category: "AI & Deep Tech" },
  { source: "Arabian Business", topic: "The D33 Milestone: Mid-Term Review of Dubai's Economic Agenda", category: "AI & Deep Tech" },
  { source: "Gulf Business", topic: "Sovereign Wealth Funds: How ADIA and Mubadala are Shaping Global Tech Trends", category: "FinTech & Crypto" },
  { source: "Forbes Middle East", topic: "The SME Revolution: How UAE's Regulatory Reforms are Empowering Small Businesses", category: "AI & Deep Tech" },
  { source: "TechCrunch ME", topic: "Crypto Oasis: Why Dubai is Still the Global Capital for Web3 Innovation", category: "FinTech & Crypto" },
  { source: "Arabian Business", topic: "The Future of Retail: How AI-Driven Personalization is Saving Physical Malls", category: "AI & Deep Tech" },
  { source: "Gulf Business", topic: "Hydrogen Energy: UAE's Strategic Pivot to Become a Global Leader in Clean Fuel", category: "AI & Deep Tech" },
  { source: "TechCrunch ME", topic: "Biotech in the Desert: The Rise of Healthcare R&D Hubs in Dubai Science Park", category: "AI & Deep Tech" }
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

  console.log(`BULK ADDING 30 ARTICLES (Append-only)...`);

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
