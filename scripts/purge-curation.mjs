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
    console.error("Missing Supabase credentials");
    process.exit(1);
  }

  console.log("Purging all curation dummy data...");
  const purgeRes = await fetch(`${supabaseUrl}/rest/v1/articles?source_name=eq.mirAIreach%20Curation`, {
    method: "DELETE",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`
    }
  });

  if (purgeRes.ok) {
    console.log("Success: All dummy data has been removed.");
  } else {
    console.error("Error purging data:", await purgeRes.text());
  }
}

main();
