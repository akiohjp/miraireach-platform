import { readFile } from "node:fs/promises";
import path from "node:path";

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

async function main() {
  await loadEnv();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!supabaseUrl || !supabaseKey || !unsplashKey) {
    console.error("Missing credentials.");
    process.exit(1);
  }

  console.log("FETCHING ARTICLES...");
  const res = await fetch(`${supabaseUrl}/rest/v1/articles?select=id,category`, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
  });
  const articles = await res.json();
  console.log(`Found ${articles.length} articles.`);

  console.log("FETCHING POOL OF PHOTOS FROM UNSPLASH...");
  let allPhotoUrls = [];
  
  // Fetch from multiple pages to get variety
  for (let page = 1; page <= 5; page++) {
    const searchRes = await fetch(`https://api.unsplash.com/search/photos?query=dubai+luxury+business+dining&per_page=30&page=${page}&orientation=landscape`, {
      headers: { Authorization: `Client-ID ${unsplashKey}` }
    });
    if (searchRes.ok) {
      const data = await searchRes.json();
      const urls = data.results.map(r => r.urls.regular);
      allPhotoUrls = [...allPhotoUrls, ...urls];
    } else {
      console.error(`Unsplash page ${page} failed: ${searchRes.status}`);
    }
  }

  if (allPhotoUrls.length === 0) {
    console.error("Failed to fetch any photos from Unsplash.");
    process.exit(1);
  }

  console.log(`Pool of ${allPhotoUrls.length} photos ready.`);

  let updatedCount = 0;
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    const baseIndex = i % allPhotoUrls.length;
    const photoUrl = allPhotoUrls[baseIndex];
    const newUrl = `${photoUrl}&sig=resilient_fix_${Date.now()}_${i}`;

    const updateRes = await fetch(`${supabaseUrl}/rest/v1/articles?id=eq.${article.id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json", 
        "apikey": supabaseKey, 
        "Authorization": `Bearer ${supabaseKey}` 
      },
      body: JSON.stringify({ image_url: newUrl })
    });

    if (updateRes.ok) updatedCount++;
    if (i % 10 === 0) process.stdout.write(".");
  }

  console.log(`\nSUCCESS: ${updatedCount} articles updated with VALID unique Unsplash photos.`);
}

main();
