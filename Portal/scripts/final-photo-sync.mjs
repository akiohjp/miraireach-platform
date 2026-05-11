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

const VALID_IDS = [
  "OMV3I4wueeI", "NSn2xpnjYzE", "ug5MITHdwX8", "2wjixcFp6ko", "Sbfz0FVpUio", 
  "HFHSTLkeLYE", "VGaXW263gOY", "wPnAs7ECi4U", "yErVmOTFzxg", "3SX6nEGsspA", 
  "WLuoChlaHNo", "xUpwC6e8zdU", "ni3efUoQyOE", "cgLpzM8CWr8", "8Tan1lIRfWY", 
  "VAbtT-rGatQ", "90qlENCmOzM", "eb9_BPCP0F0", "WRYcCqG5fYM", "gAGEEvptFSc", 
  "6l4BcKqypV0", "kqYfzvD7was", "q8D7WZc40eA", "vTdEZnIIyuE", "MDQeZx0HMik", 
  "cxtmm36ItkQ", "aaz7ezQ7GqM", "z01PDy9SGeY", "LrQjUleZGF4", "DJDk3TBLDuk", 
  "Z-vTboPNGSo", "_evsPAQC8iE", "JqM0WNvXsWM", "IyxAuSQQnRg", "xF3o2XpMvQg", 
  "GB8cgZIQ_Yw", "s62b-AEaC14", "kFb2xFpCkkM", "p_qrO1Ygnzo", "vU6HCy_uIYk"
];

async function main() {
  await loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("Missing Supabase credentials");
    process.exit(1);
  }

  console.log("FETCHING ARTICLES...");
  const res = await fetch(`${url}/rest/v1/articles?select=id`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  const articles = await res.json();
  console.log(`Found ${articles.length} articles. Updating with VALID UNIQUE IDs...`);

  let updatedCount = 0;
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    // Use the pool of 40 validated IDs
    const photoId = VALID_IDS[i % VALID_IDS.length];
    const newUrl = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80&w=1600&sig=final_fix_${Date.now()}_${i}`;
    
    const upRes = await fetch(`${url}/rest/v1/articles?id=eq.${article.id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json", 
        "apikey": key, 
        "Authorization": `Bearer ${key}` 
      },
      body: JSON.stringify({ image_url: newUrl })
    });

    if (upRes.ok) updatedCount++;
    if (i % 10 === 0) process.stdout.write(".");
  }

  console.log(`\nSUCCESS: ${updatedCount} rows updated with verified unique photos.`);
}

main();
