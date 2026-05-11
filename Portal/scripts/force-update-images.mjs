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
    console.warn("No .env.local found, using process.env");
  }
}

async function main() {
  await loadEnv();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
  }

  console.log("FETCHING ALL ARTICLES...");
  const res = await fetch(`${supabaseUrl}/rest/v1/articles?select=id,category`, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
  });

  if (!res.ok) {
    console.error(`Failed to fetch articles: ${await res.text()}`);
    process.exit(1);
  }

  const articles = await res.json();
  console.log(`Found ${articles.length} articles. Starting update...`);

  let updatedCount = 0;
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    const category = article.category || "dubai";
    const newUrl = `https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80&sig=force_${Date.now()}_${i}`;
    // In a real scenario we'd use Unsplash API but for "forced update" speed I'll use the base luxury image with unique seeds
    
    const updateRes = await fetch(`${supabaseUrl}/rest/v1/articles?id=eq.${article.id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json", 
        "apikey": supabaseKey, 
        "Authorization": `Bearer ${supabaseKey}`,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify({ image_url: newUrl })
    });

    if (updateRes.ok) {
      updatedCount++;
    } else {
      console.error(`Failed to update article ${article.id}: ${await updateRes.text()}`);
    }
    
    if (i % 5 === 0) process.stdout.write(".");
  }

  console.log(`\nSUCCESS: ${updatedCount} 件の画像を更新しました。`);
}

main();
