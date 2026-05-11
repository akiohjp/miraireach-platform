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

const IMAGE_POOL = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b",
  "https://images.unsplash.com/photo-1677442136019-21780ecad995",
  "https://images.unsplash.com/photo-1582407947304-fd86f028f716",
  "https://images.unsplash.com/photo-1621761191319-c6fb62004040",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de",
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d",
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
  "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
  "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e",
  "https://images.unsplash.com/photo-1509391366360-2e959784a276"
];

async function main() {
  await loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) throw new Error("Missing config");

  console.log("🛠️  STARTING FORCE UNIQUE IMAGE UPDATE...");
  
  // 1. Fetch all articles
  const res = await fetch(`${url}/rest/v1/articles?select=id,category`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  
  if (!res.ok) throw new Error(`Fetch failed: ${await res.text()}`);
  const articles = await res.json();
  console.log(`Found ${articles.length} articles to update.`);

  let updatedCount = 0;
  for (const article of articles) {
    const baseImage = IMAGE_POOL[article.id % IMAGE_POOL.length];
    const newImageUrl = `${baseImage}?auto=format&fit=crop&w=1600&q=80&sig=article_${article.id}_${Math.random().toString(36).substring(7)}`;

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
      if (updatedCount % 20 === 0) console.log(`Progress: ${updatedCount}/${articles.length} updated...`);
    } else {
      console.error(`Failed to update ID ${article.id}: ${await patchRes.text()}`);
    }
  }

  console.log(`\n✅ SUCCESS: Updated ${updatedCount} articles with unique signature-based URLs.`);
}

main();
