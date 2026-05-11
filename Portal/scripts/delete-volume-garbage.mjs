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

  console.log("🧨  ERADICATING 'VOLUME' GARBAGE DATA...");

  // 1. Delete articles containing 'Volume' in the title
  // Using ilike.*Volume* to catch any case and any position
  const deleteRes = await fetch(`${url}/rest/v1/articles?title=ilike.*Volume*`, {
    method: "DELETE",
    headers: { 
      apikey: key, 
      Authorization: `Bearer ${key}`,
      Prefer: "return=representation" // This ensures we get the deleted rows back to count them
    }
  });

  if (deleteRes.ok) {
    const deletedRows = await deleteRes.json();
    console.log(`✅ SUCCESS: Deleted ${deletedRows.length} 'Volume' garbage articles.`);
  } else {
    const errorText = await deleteRes.text();
    console.error(`❌ ERROR: Failed to delete garbage data. Status: ${deleteRes.status}`);
    console.error(`Reason: ${errorText}`);
  }

  // 2. Verification - Check if any remain
  const checkRes = await fetch(`${url}/rest/v1/articles?title=ilike.*Volume*&select=count`, {
    headers: { 
      apikey: key, 
      Authorization: `Bearer ${key}`,
      Prefer: "count=exact"
    }
  });
  
  const contentRange = checkRes.headers.get("content-range");
  const count = contentRange ? contentRange.split("/")[1] : "0";
  
  if (count === "0") {
    console.log("✨ VERIFICATION COMPLETE: 0 'Volume' articles remaining in the database.");
  } else {
    console.error(`⚠️  WARNING: ${count} 'Volume' articles still remain! Manual intervention may be needed.`);
  }
}

main();
