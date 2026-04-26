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

const NEW_PREMIUM_TOPICS = [
  // Gourmet & Dining (15)
  { source: "Michelin Guide", topic: "The 2026 Stars: How Dubai Secured its Place as a Global Gastronomy Capital", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "The Ethics of Caviar: A Strategic Look at Sustainable Luxury in Dubai", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "Beyond the Brunch: The Rise of Curated Tasting Menus in Jumeirah", category: "Gourmet & Dining" },
  { source: "What's On Dubai", topic: "Dubai Marina's Culinary Renaissance: Top 10 Openings to Watch", category: "Gourmet & Dining" },
  { source: "Michelin Guide", topic: "Mastering the Hearth: The Open Fire Cooking Trend Sweeping DIFC", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "The Wine Revolution: How Sommeliers are Navigating the New UAE Regulations", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "The Best Rooftop Destinations for 2026: A Sunset Guide", category: "Gourmet & Dining" },
  { source: "What's On Dubai", topic: "Hidden Gems of Satwa: The Authentic Street Food Trail", category: "Gourmet & Dining" },
  { source: "Michelin Guide", topic: "Zero-Waste Pioneers: The Chefs Reducing Footprint in Luxury Kitchens", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "The Psychology of the Table: How Design Impacts the Dining Experience", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "Dubai's Most Instagrammable Cafes: More Than Just a Pretty Latte", category: "Gourmet & Dining" },
  { source: "What's On Dubai", topic: "The Return of the Supper Club: Why Intimacy is the New Luxury", category: "Gourmet & Dining" },
  { source: "Michelin Guide", topic: "Liquid Gold: The Rise of Premium Olive Oil Degustations", category: "Gourmet & Dining" },
  { source: "Gault&Millau UAE", topic: "The Future of Service: Human Connection in an AI-Driven Industry", category: "Gourmet & Dining" },
  { source: "Time Out Dubai", topic: "Weekend Guide: The Best Beachside Lunches in Palm Jumeirah", category: "Gourmet & Dining" },

  // AI & Technology (15)
  { source: "TechCrunch ME", topic: "LLMs in Arabic: The Race for the Most Accurate Middle Eastern AI", category: "AI & Deep Tech" },
  { source: "Arabian Business", topic: "The AI Sovereign: How the UAE is Building its Own Computing Infrastructure", category: "AI & Deep Tech" },
  { source: "Forbes Middle East", topic: "AI-Powered Real Estate: Predicting the Next Big Property Boom", category: "AI & Deep Tech" },
  { source: "Entrepreneur ME", topic: "Automating the SME: A Guide to AI Integration for Dubai Startups", category: "AI & Deep Tech" },
  { source: "TechCrunch ME", topic: "The V-Tuber Era: How Virtual Influencers are Taking Over Dubai's Social Media", category: "AI & Deep Tech" },
  { source: "Arabian Business", topic: "Smart City 2026: How AI is Managing Dubai's Traffic and Energy Grid", category: "AI & Deep Tech" },
  { source: "Forbes Middle East", topic: "The Rise of Quantum FinTech: Securing the Future of Digital Banking", category: "AI & Deep Tech" },
  { source: "Entrepreneur ME", topic: "From Idea to Exit: Scaling an AI Biotech Startup in the UAE", category: "AI & Deep Tech" },
  { source: "TechCrunch ME", topic: "Robotic Delivery: The Last-Mile Revolution in Downtown Dubai", category: "AI & Deep Tech" },
  { source: "Arabian Business", topic: "AI Ethics: Navigating the Cultural Nuances of Algorithm Training", category: "AI & Deep Tech" },
  { source: "Forbes Middle East", topic: "The Metaverse Pivot: Why Dubai is Still Betting on Immersive Commerce", category: "AI & Deep Tech" },
  { source: "Entrepreneur ME", topic: "AI for Legal: How Law Firms in DIFC are Speeding Up Due Diligence", category: "AI & Deep Tech" },
  { source: "TechCrunch ME", topic: "Synthetic Data: The Key to Privacy-First AI Development in the GCC", category: "AI & Deep Tech" },
  { source: "Arabian Business", topic: "Digital Twins: Modeling Dubai's Future Skyscrapers Before Groundbreaking", category: "AI & Deep Tech" },
  { source: "Forbes Middle East", topic: "The AI Talent War: How Dubai is Attracting Global Developers", category: "AI & Deep Tech" },

  // Lifestyle & Travel (10)
  { source: "Condé Nast Traveller ME", topic: "The Desert Reimagined: Luxury Eco-Resorts Redefining Isolation", category: "Lifestyle & Travel" },
  { source: "Time Out Dubai", topic: "A Weekend in Hatta: The Ultimate Adventure Guide for 2026", category: "Lifestyle & Travel" },
  { source: "What's On Dubai", topic: "Wellness in the City: Top 5 Biohacking Centers in Dubai", category: "Lifestyle & Travel" },
  { source: "Condé Nast Traveller ME", topic: "The Art of the Staycation: Why Dubai Residents are Rediscovering Local Hotels", category: "Lifestyle & Travel" },
  { source: "Time Out Dubai", topic: "Museum of the Future: A Guide to the Latest Exhibits and Tech", category: "Lifestyle & Travel" },
  { source: "What's On Dubai", topic: "Dubai's Best Kept Secret Beaches: Where to Escape the Crowds", category: "Lifestyle & Travel" },
  { source: "Condé Nast Traveller ME", topic: "The New Silk Road: Luxury Train Travel Across the GCC", category: "Lifestyle & Travel" },
  { source: "Time Out Dubai", topic: "Nightlife 2026: The Tech-Infused Clubs Changing the Game", category: "Lifestyle & Travel" },
  { source: "What's On Dubai", topic: "Art Dubai 2026: Highlights from the World's Most Diverse Fair", category: "Lifestyle & Travel" },
  { source: "Condé Nast Traveller ME", topic: "Sustainable Souvenirs: Supporting Local Artisans in Old Dubai", category: "Lifestyle & Travel" },

  // Business & Finance (10)
  { source: "Arabian Business", topic: "D33 Milestones: How Dubai is Doubling its Economy by 2033", category: "Business & Technology" },
  { source: "Forbes Middle East", topic: "The Family Office Shift: Why Gen Z Heirs are Investing in Venture Capital", category: "FinTech & Crypto" },
  { source: "Entrepreneur ME", topic: "The E-Commerce Exit: What Dubai Founders Need to Know About M&A", category: "Business & Technology" },
  { source: "Gulf Business", topic: "Hydrogen Hub: The UAE's Strategic Move into Clean Energy Export", category: "Business & Technology" },
  { source: "Forbes Middle East", topic: "Crypto Regulation 2026: How VARA is Influencing Global Policy", category: "FinTech & Crypto" },
  { source: "Arabian Business", topic: "The Blue Economy: Leveraging Dubai's Coastline for Sustainable Growth", category: "Business & Technology" },
  { source: "Entrepreneur ME", topic: "Remote Work in Paradise: The Impact of the Digital Nomad Visa", category: "Business & Technology" },
  { source: "Gulf Business", topic: "Logistics 4.0: How DP World is Using AI to Predict Global Port Delays", category: "Logistics & Supply Chain" },
  { source: "Forbes Middle East", topic: "The Rise of Islamic FinTech: Ethical Banking for the Digital Age", category: "FinTech & Crypto" },
  { source: "Arabian Business", topic: "Dubai's Stock Market Boom: Why International Investors are Flocking to DFM", category: "FinTech & Crypto" }
];

async function generatePremiumContent(openai, item) {
  const systemPrompt = `
    You are an elite analyst for ${item.source}. 
    Write a definitive 1500+ word strategic report.
    Topic: ${item.topic}
    Requirements:
    - Language: English ("content") and Arabic ("content_ar").
    - Detailed Markdown formatting with headings, lists, and bold text.
    - Professional, authoritative B2B tone.
    - AI Market Insight section included at the end.
    - Return JSON object with: title, title_ar, excerpt, excerpt_ar, content, content_ar, image_query
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
    const res = await unsplash.photos.getRandom({ query: `${query} dubai premium`, orientation: "landscape", count: 1 });
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

  if (!supabaseUrl || !supabaseKey || !openaiKey) throw new Error("Missing configuration in .env.local");

  const openai = new OpenAI({ apiKey: openaiKey });
  const unsplash = createApi({ accessKey: unsplashKey || "" });

  console.log(`🚀 APPENDING ${NEW_PREMIUM_TOPICS.length} PREMIUM ARTICLES... (Append-only)`);

  for (let i = 0; i < NEW_PREMIUM_TOPICS.length; i++) {
    const item = NEW_PREMIUM_TOPICS[i];
    
    const exists = await checkExists(supabaseUrl, supabaseKey, item.topic);
    if (exists) {
      console.log(`[${i+1}/${NEW_PREMIUM_TOPICS.length}] Skipping: "${item.topic}" (Already exists)`);
      continue;
    }

    process.stdout.write(`[${i+1}/${NEW_PREMIUM_TOPICS.length}] Generating: ${item.topic} for ${item.source}... `);
    try {
      const data = await generatePremiumContent(openai, item);
      const imageUrl = await getRandomUnsplashImage(unsplash, data.image_query || item.topic, i);

      const payload = {
        category: item.category,
        title: data.title,
        title_ar: data.title_ar,
        excerpt: data.excerpt,
        excerpt_ar: data.excerpt_ar,
        content: data.content,
        content_ar: data.content_ar,
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

      if (res.ok) {
        console.log("✅ DONE.");
      } else {
        const errorText = await res.text();
        console.error(`❌ FAILED: ${errorText}`);
      }

      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      console.error(`❌ ERROR: ${e.message}`);
    }
  }
  console.log("\n✨ BATCH UPDATE COMPLETE.");
}

main();
