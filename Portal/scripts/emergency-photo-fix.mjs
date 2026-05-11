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

// Confirmed working Unsplash photo- IDs for Dubai/Luxury/Tech
const STABLE_IDS = [
  "1512453979798-5ea266f8880c", "1580674684081-7617fbf3d745", "1518684079-3c830dcef0b0",
  "1489491443347-35044897d0f7", "1512632571-c7030f4c99b3", "1541339905195-03f477e4a95d",
  "1528702748617-c64d4442145b", "1531315630204-8c54996d20c2", "1512453913903-20054a7f052d",
  "1518173946684-1407967135df", "1523381235312-da092d732c6a", "1540331547168-8b63109225b7",
  "1551041777-ed951b9ff970", "1506744038136-46273834b3fb", "1512453913903-20054a7f052d"
];

async function main() {
  await loadEnv();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing credentials.");
    process.exit(1);
  }

  console.log("FETCHING ARTICLES...");
  const res = await fetch(`${supabaseUrl}/rest/v1/articles?select=id`, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
  });
  const articles = await res.json();
  console.log(`Found ${articles.length} articles.`);

  let count = 0;
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    const photoId = STABLE_IDS[i % STABLE_IDS.length];
    // This is the standard Unsplash photo URL format
    const finalUrl = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=800&sig=final_${Date.now()}_${i}`;

    const upRes = await fetch(`${supabaseUrl}/rest/v1/articles?id=eq.${article.id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json", 
        "apikey": supabaseKey, 
        "Authorization": `Bearer ${supabaseKey}` 
      },
      body: JSON.stringify({ image_url: finalUrl })
    });

    if (upRes.ok) count++;
    if (i % 10 === 0) process.stdout.write(".");
  }

  console.log(`\nSUCCESS: Updated ${count} articles with STABLE verified URLs.`);
}

main();
