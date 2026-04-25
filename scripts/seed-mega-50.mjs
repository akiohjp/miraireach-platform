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

const MEGA_TOPICS = [
  // Gourmet & Dining (15)
  { source: "Michelin Guide", topic: "The Rise of Zero-Waste Fine Dining in Dubai", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "Meet the Chef Behind the Most Controversial Menu in DIFC", category: "Gourmet & Dining" },
  { source: "What's On Dubai", topic: "Dubai's Best Secret Suppercubs to Visit in 2026", category: "Gourmet & Dining" },
  { source: "Caterer Middle East", topic: "The Future of Cloud Kitchens: How AI is Optimizing Delivery in Dubai", category: "Gourmet & Dining" },
  { source: "Michelin Guide", topic: "Modern Middle Eastern: How the Michelin Guide is Celebrating Levantine Innovation", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "The Art of the Omakase: Why Dubai's Japanese Scene is World-Class", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "The Best Rooftop Brunches with a View of the Museum of the Future", category: "Gourmet & Dining" },
  { source: "Michelin Guide", topic: "Sustainability at the Heart: The Restaurants Leading the Green Star Revolution", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "The Psychology of Luxury Service: Training the Elite Waitstaff of Dubai", category: "Gourmet & Dining" },
  { source: "What's On Dubai", topic: "The Ultimate Guide to Dubai's Best Specialty Coffee Roasters", category: "Gourmet & Dining" },
  { source: "Michelin Guide", topic: "Pastry Masters: The Dessert Degustations Changing Dubai's Sweet Scene", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "Molecular Gastronomy: The Science of Taste in Jumeirah", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "Best Al Fresco Dining Spots in the Desert for 2026", category: "Gourmet & Dining" },
  { source: "What's On Dubai", topic: "The Best New Restaurant Openings in Atlantis The Royal", category: "Gourmet & Dining" },
  { source: "Caterer Middle East", topic: "Hospitality Hiring Trends: How AI is Reshaping Recruitment in UAE", category: "Gourmet & Dining" },

  // AI & Tech (15)
  { source: "TechCrunch ME", topic: "Dubai's AI Supercluster: Why Silicon Valley is Looking East", category: "AI & Deep Tech" },
  { source: "Arabian Business", topic: "The Billion-Dollar AI Bet: UAE's Sovereign Wealth Funds Pivot to Tech", category: "AI & Deep Tech" },
  { source: "Entrepreneur ME", topic: "Starting an AI Agency in Dubai: The Regulatory Landscape in 2026", category: "AI & Deep Tech" },
  { source: "Forbes Middle East", topic: "Top 10 AI Startups Disrupting the GCC Logistics Sector", category: "AI & Deep Tech" },
  { source: "TechCrunch ME", topic: "Autonomous Aerial Taxis: The Reality of Flight in Dubai Marina", category: "AI & Deep Tech" },
  { source: "Arabian Business", topic: "AI in Real Estate: How Predictive Analytics is Stabilizing the Dubai Market", category: "AI & Deep Tech" },
  { source: "Entrepreneur ME", topic: "The No-Code Revolution: How UAE SMEs are Building AI Tools Without Developers", category: "AI & Deep Tech" },
  { source: "Forbes Middle East", topic: "The Future of Generative Search: How Brands Can Win in the AI Answer Era", category: "AI & Deep Tech" },
  { source: "TechCrunch ME", topic: "Blockchain and AI: The Convergence Powering Dubai's Web3 Vision", category: "AI & Deep Tech" },
  { source: "Arabian Business", topic: "The Quantum Leap: Why the UAE is Investing in Quantum Computing R&D", category: "AI & Deep Tech" },
  { source: "Entrepreneur ME", topic: "Scaling Your SaaS from Dubai to the World: A Founder's Guide", category: "AI & Deep Tech" },
  { source: "Forbes Middle East", topic: "AI Ethics in the Emirates: Navigating the New Governance Framework", category: "AI & Deep Tech" },
  { source: "TechCrunch ME", topic: "The Robotic Workforce: Automation in Dubai's Smart Factories", category: "AI & Deep Tech" },
  { source: "Arabian Business", topic: "5G-Advanced and Beyond: The Infrastructure of the AI-First City", category: "AI & Deep Tech" },
  { source: "Forbes Middle East", topic: "Cybersecurity in the Age of AI: Protecting UAE's Digital Borders", category: "AI & Deep Tech" },

  // Business & Real Estate (10)
  { source: "Arabian Business", topic: "The D33 Agenda: Mid-Term Progress Report on Dubai's Economic Strategy", category: "Real Estate & PropTech" },
  { source: "Forbes Middle East", topic: "The Real Estate IPO Wave: Why Developers are Going Public in 2026", category: "Real Estate & PropTech" },
  { source: "Entrepreneur ME", topic: "The Rise of Social Entrepreneurship in the UAE", category: "FinTech & Crypto" },
  { source: "Arabian Business", topic: "Family Offices: The Great Wealth Transfer and the Shift to Impact Investing", category: "FinTech & Crypto" },
  { source: "Gulf Business", topic: "The Blue Economy: How the UAE is Protecting its Marine Life and Economy", category: "Logistics & Supply Chain" },
  { source: "Forbes Middle East", topic: "The New Dubai Skyline: Upcoming Megaprojects Redefining Luxury", category: "Real Estate & PropTech" },
  { source: "Entrepreneur ME", topic: "Venture Capital Trends: Where the Money is Flowing in the MENA Region", category: "FinTech & Crypto" },
  { source: "Gulf Business", topic: "The Green Transition: UAE's Post-COP28 Sustainable Finance Boom", category: "FinTech & Crypto" },
  { source: "Arabian Business", topic: "Logistics Hub: How DP World is Using AI to Combat Global Supply Chain Delays", category: "Logistics & Supply Chain" },
  { source: "Forbes Middle East", topic: "The Middle Class Boom: How Retailers are Adapting to Dubai's Changing Demographics", category: "FinTech & Crypto" },

  // Lifestyle & Travel (10)
  { source: "Condé Nast Traveller ME", topic: "Beyond the Skyscrapers: Exploring the Natural Wonders of Hatta", category: "Lifestyle & Travel" },
  { source: "Time Out Dubai", topic: "The Best Wellness Retreats in the UAE for 2026", category: "Lifestyle & Travel" },
  { source: "What's On Dubai", topic: "A Local's Guide to the Best Art Galleries in Alserkal Avenue", category: "Lifestyle & Travel" },
  { source: "Condé Nast Traveller ME", topic: "The Future of Luxury Travel: Private Jets to Sustainable Resorts", category: "Lifestyle & Travel" },
  { source: "Time Out Dubai", topic: "Hidden Gems of the Northern Emirates: A Road Trip Guide", category: "Lifestyle & Travel" },
  { source: "What's On Dubai", topic: "The Best Beach Clubs for a Weekend in Dubai", category: "Lifestyle & Travel" },
  { source: "Condé Nast Traveller ME", topic: "Culinary Tourism: Why Foodies are Flocking to Dubai", category: "Lifestyle & Travel" },
  { source: "Time Out Dubai", topic: "The Evolution of Al Fahidi: From Heritage Site to Creative Hub", category: "Lifestyle & Travel" },
  { source: "What's On Dubai", topic: "Top Music Festivals Coming to the UAE in late 2026", category: "Lifestyle & Travel" },
  { source: "Condé Nast Traveller ME", topic: "The Best Desert Escapes for Stargazing and Silence", category: "Lifestyle & Travel" }
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
    if (!unsplash) return `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80&sig=${Date.now()}_${i}`;
    const res = await unsplash.photos.getRandom({ query: `${query} dubai luxury`, orientation: "landscape", count: 1 });
    if (res.response && Array.isArray(res.response)) {
      return `${res.response[0].urls.regular}&sig=${Date.now()}_${i}`;
    }
    return `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80&sig=${Date.now()}_${i}`;
  } catch (e) {
    return `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80&sig=${Date.now()}_${i}`;
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

  console.log(`MEGA BULK ADDING 50 ARTICLES (Append-only)...`);

  for (let i = 0; i < MEGA_TOPICS.length; i++) {
    const item = MEGA_TOPICS[i];
    
    // Deduplication check
    const exists = await checkExists(supabaseUrl, supabaseKey, item.topic);
    if (exists) {
      console.log(`[${i+1}/50] Skipping: "${item.topic}" (Already exists)`);
      continue;
    }

    process.stdout.write(`[${i+1}/50] Generating for ${item.source}... `);
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
