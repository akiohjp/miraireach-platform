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
    console.warn("No .env.local found, using process.env");
  }
}

async function getRandomUnsplashImage(unsplash, category, i) {
  try {
    if (!unsplash) return `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80&sig=fix_${Date.now()}_${i}`;
    const res = await unsplash.photos.getRandom({ query: `${category} dubai architecture luxury`, orientation: "landscape", count: 1 });
    if (res.response && Array.isArray(res.response)) {
      return `${res.response[0].urls.regular}&sig=fix_${Date.now()}_${i}`;
    }
    return `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80&sig=fix_${Date.now()}_${i}`;
  } catch (e) {
    return `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80&sig=fix_${Date.now()}_${i}`;
  }
}

async function main() {
  await loadEnv();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!supabaseUrl || !supabaseKey) throw new Error("Missing config");

  const unsplash = createApi({ accessKey: unsplashKey || "" });

  console.log("FETCHING ALL ARTICLES...");
  const res = await fetch(`${supabaseUrl}/rest/v1/articles?select=id,image_url,category`, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
  });
  
  if (!res.ok) throw new Error(`Failed to fetch articles: ${await res.text()}`);
  const articles = await res.json();
  console.log(`Found ${articles.length} articles.`);

  const urlCounts = {};
  articles.forEach(a => {
    if (a.image_url) {
      urlCounts[a.image_url] = (urlCounts[a.image_url] || 0) + 1;
    }
  });

  const duplicates = articles.filter(a => urlCounts[a.image_url] > 1);
  console.log(`Found ${duplicates.length} articles with duplicate images.`);

  for (let i = 0; i < duplicates.length; i++) {
    const article = duplicates[i];
    process.stdout.write(`[${i+1}/${duplicates.length}] Fixing image for article ${article.id}... `);
    
    const newImageUrl = await getRandomUnsplashImage(unsplash, article.category, i);
    
    const updateRes = await fetch(`${supabaseUrl}/rest/v1/articles?id=eq.${article.id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json", 
        "apikey": supabaseKey, 
        "Authorization": `Bearer ${supabaseKey}`,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({ image_url: newImageUrl })
    });

    if (updateRes.ok) console.log("FIXED.");
    else console.error(`FAILED: ${await updateRes.text()}`);
    
    await new Promise(r => setTimeout(r, 500));
  }

  console.log("IMAGE FIX COMPLETE.");
}

main();
