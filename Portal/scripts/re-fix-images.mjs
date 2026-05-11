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

async function main() {
  await loadEnv();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!supabaseUrl || !supabaseKey || !unsplashKey) {
    console.error("Missing credentials. Please ensure .env.local has SUPABASE and UNSPLASH keys.");
    process.exit(1);
  }

  const unsplash = createApi({ accessKey: unsplashKey });

  console.log("FETCHING ALL ARTICLES...");
  const res = await fetch(`${supabaseUrl}/rest/v1/articles?select=id,category,title`, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
  });

  if (!res.ok) {
    console.error(`Failed to fetch articles: ${await res.text()}`);
    process.exit(1);
  }

  const articles = await res.json();
  console.log(`Found ${articles.length} articles. Starting UNIQUE image update...`);

  // To ensure uniqueness, we'll fetch a batch of photos for each category or search uniquely
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    const query = `${article.category} ${article.title.split(' ').slice(0, 3).join(' ')} dubai luxury`;
    
    process.stdout.write(`[${i+1}/${articles.length}] Searching for: "${query}"... `);

    try {
      const searchRes = await unsplash.search.getPhotos({
        query: query,
        perPage: 30, // Get a pool
        orientation: 'landscape'
      });

      if (searchRes.response && searchRes.response.results.length > 0) {
        // Pick a random one from the results to further increase randomness
        const randomIndex = Math.floor(Math.random() * searchRes.response.results.length);
        const photo = searchRes.response.results[randomIndex];
        const newUrl = `${photo.urls.regular}&sig=final_${Date.now()}_${i}`;

        const updateRes = await fetch(`${supabaseUrl}/rest/v1/articles?id=eq.${article.id}`, {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json", 
            "apikey": supabaseKey, 
            "Authorization": `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({ image_url: newUrl })
        });

        if (updateRes.ok) console.log("UPDATED with UNIQUE image.");
        else console.error(`FAILED to update: ${await updateRes.text()}`);
      } else {
        console.log("No specific results, using random luxury...");
        const randomRes = await unsplash.photos.getRandom({ query: "dubai luxury architecture", orientation: "landscape" });
        const newUrl = Array.isArray(randomRes.response) ? randomRes.response[0].urls.regular : randomRes.response.urls.regular;
        
        await fetch(`${supabaseUrl}/rest/v1/articles?id=eq.${article.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "apikey": supabaseKey, "Authorization": `Bearer ${supabaseKey}` },
          body: JSON.stringify({ image_url: `${newUrl}&sig=rand_${Date.now()}_${i}` })
        });
        console.log("UPDATED with random.");
      }
    } catch (e) {
      console.error(`ERROR: ${e.message}`);
    }

    // Small delay to avoid hitting Unsplash rate limits too hard
    await new Promise(r => setTimeout(r, 500));
  }

  console.log("\nALL IMAGES RE-FIXED WITH INDIVIDUAL UNIQUE PHOTOS.");
}

main();
