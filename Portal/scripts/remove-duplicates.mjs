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

  console.log("🧹  REMOVING DUPLICATE ARTICLES BY TITLE...");

  // 1. Fetch all articles (id and title)
  const res = await fetch(`${url}/rest/v1/articles?select=id,title&order=created_at.asc`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  
  if (!res.ok) throw new Error(`Fetch failed: ${await res.text()}`);
  const articles = await res.json();
  console.log(`Analyzing ${articles.length} articles for duplicates.`);

  const titlesSeen = new Set();
  const idsToDelete = [];

  for (const article of articles) {
    if (titlesSeen.has(article.title)) {
      idsToDelete.push(article.id);
    } else {
      titlesSeen.add(article.title);
    }
  }

  if (idsToDelete.length === 0) {
    console.log("✅ No duplicate titles found.");
    return;
  }

  console.log(`Found ${idsToDelete.length} duplicate articles. Deleting...`);

  // Delete in batches of 50 to avoid URL length issues or timeouts
  for (let i = 0; i < idsToDelete.length; i += 50) {
    const batch = idsToDelete.slice(i, i + 50);
    const deleteRes = await fetch(`${url}/rest/v1/articles?id=in.(${batch.join(",")})`, {
      method: "DELETE",
      headers: { apikey: key, Authorization: `Bearer ${key}` }
    });

    if (deleteRes.ok) {
      process.stdout.write(".");
    } else {
      console.error(`\n❌ Failed to delete batch: ${await deleteRes.text()}`);
    }
  }

  console.log(`\n✅ SUCCESS: Removed ${idsToDelete.length} duplicate articles.`);
  
  // Final count
  const countRes = await fetch(`${url}/rest/v1/articles?select=count`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "count=exact" }
  });
  const totalCountStr = countRes.headers.get("content-range").split("/")[1];
  console.log(`Final unique article count: ${totalCountStr}`);
}

main();
