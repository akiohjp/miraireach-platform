import { readFile } from "node:fs/promises";
import path from "node:path";
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
    console.warn("No .env.local found");
  }
}

const CATEGORY_KEYWORDS = {
  "Gourmet & Dining": "fine-dining,restaurant,food",
  "AI & Deep Tech": "artificial-intelligence,technology,robot",
  "Lifestyle & Travel": "luxury-travel,hotel,lifestyle",
  "Business & Technology": "business,corporate,technology",
  "FinTech & Crypto": "finance,cryptocurrency,bitcoin",
  "Real Estate & PropTech": "architecture,skyscraper,real-estate",
  "Logistics & Supply Chain": "logistics,shipping,cargo",
  "Food & Culture": "emirati-food,heritage,culture",
  "Marketing Tech": "digital-marketing,social-media,technology",
  "Smart City & GovTech": "smart-city,government,urban",
  "Energy & Sustainability": "solar-energy,sustainability,green-tech"
};

async function main() {
  await loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!url || !key || !unsplashKey) throw new Error("Missing config (Supabase or Unsplash)");

  const unsplash = createApi({ accessKey: unsplashKey });

  console.log("🛠️  STARTING CONTEXTUAL IMAGE UPDATE...");
  
  const res = await fetch(`${url}/rest/v1/articles?select=id,category`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  
  if (!res.ok) throw new Error(`Fetch failed: ${await res.text()}`);
  const articles = await res.json();
  console.log(`Found ${articles.length} articles to update.`);

  let updatedCount = 0;
  for (const article of articles) {
    const keyword = CATEGORY_KEYWORDS[article.category] || "dubai,luxury";
    
    // Attempt to get a specific image from Unsplash API for higher quality/context
    let newImageUrl = "";
    try {
      const unsplashRes = await unsplash.photos.getRandom({
        query: `${keyword} dubai premium`,
        orientation: "landscape",
        count: 1
      });
      
      if (unsplashRes.response && Array.isArray(unsplashRes.response)) {
        newImageUrl = `${unsplashRes.response[0].urls.regular}&auto=format&fit=crop&w=1600&q=80&sig=ctx_${article.id}_${Math.random().toString(36).substring(7)}`;
      } else {
        // Fallback to keyword-based featured URL if API fails
        newImageUrl = `https://images.unsplash.com/featured/?${encodeURIComponent(keyword)}&sig=fallback_${article.id}`;
      }
    } catch (e) {
      newImageUrl = `https://images.unsplash.com/featured/?${encodeURIComponent(keyword)}&sig=fallback_${article.id}`;
    }

    const patchRes = await fetch(`${url}/rest/v1/articles?id=eq.${article.id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json", 
        "apikey": key, 
        "Authorization": `Bearer ${key}` 
      },
      body: JSON.stringify({ image_url: newImageUrl })
    });

    if (patchRes.ok) {
      updatedCount++;
      process.stdout.write(".");
      if (updatedCount % 20 === 0) console.log(` [${updatedCount}/${articles.length}]`);
    } else {
      console.error(`\nFailed to update ID ${article.id}: ${await patchRes.text()}`);
    }
    
    // Throttling to respect Unsplash API limits
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n\n✅ SUCCESS: Updated ${updatedCount} articles with context-matching images.`);
}

main();
