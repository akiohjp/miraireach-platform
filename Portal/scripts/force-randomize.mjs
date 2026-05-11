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
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("Missing Supabase credentials");
    process.exit(1);
  }

  // Fetch all articles
  const res = await fetch(`${url}/rest/v1/articles?select=id`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  
  const articles = await res.json();
  let count = 0;

  for (const article of articles) {
    // Generate the URL logic the user requested
    const newUrl = `https://images.unsplash.com/photo-${article.id}?auto=format&fit=crop&q=80&w=800&sig=${Math.random()}`;
    
    const upRes = await fetch(`${url}/rest/v1/articles?id=eq.${article.id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json", 
        "apikey": key, 
        "Authorization": `Bearer ${key}` 
      },
      body: JSON.stringify({ image_url: newUrl })
    });

    if (upRes.ok) count++;
  }

  console.log(`Updated ${count} rows.`);
}

main();
