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

  if (!url || !key) throw new Error("Missing config");

  console.log("🛠️  NORMALIZING CATEGORY NAMES IN DATABASE...");

  const mapping = {
    "UAE AI Strategy & Vision": "UAE AI Strategy",
    "AI × Hospitality & F&B": "AI x Hospitality",
    "AI × Real Estate": "AI x Real Estate",
    "AI × Corporate Business": "AI x Corporate"
  };

  for (const [oldName, newName] of Object.entries(mapping)) {
    const res = await fetch(`${url}/rest/v1/articles?category=eq.${encodeURIComponent(oldName)}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json", 
        "apikey": key, 
        "Authorization": `Bearer ${key}`,
        "Prefer": "return=representation"
      },
      body: JSON.stringify({ category: newName })
    });

    if (res.ok) {
      const updated = await res.json();
      console.log(`✅ Updated ${updated.length} articles: "${oldName}" -> "${newName}"`);
    } else {
      console.error(`❌ Failed to update "${oldName}": ${await res.text()}`);
    }
  }

  console.log("✨ Category normalization complete.");
}

main();
