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

const VERIFIED_URLS = [
  "https://images.unsplash.com/photo-1648447898970-ce7c6319eb68?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1682879654255-f25b5103f17e?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1705412082002-6d7200fa10ba?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1640184373805-c78e2be62e22?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1743819458014-f5cf74f175e3?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1691845164135-f7dc89ae38d7?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1739190940453-20900e9d18fb?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1583012802443-efc6e8b00f5f?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1572291941045-14025ac253ef?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1605789347875-f1ffb487365d?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1751698186759-5bac83376c9f?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1764603852093-6e4918c3197a?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1566454869316-b6cfb093a071?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1703866367063-71eae5acbf5d?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1602103088261-9e937c58e72e?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1743819455744-05417bf55cea?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1728458032011-23a66142fbf0?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1728458664236-72f5d6932d37?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1728458602333-c0fdc3ece8a5?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1636801686436-bcb8eae09a41?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1749849934727-bc57c0bd9dd2?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1728458664282-0d028d4941f5?auto=format&fit=crop&get=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1728458602463-294dd50623e2?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1728458664292-ac6d6034e78d?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1656789280583-c5bebda7ca1d?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1597278325036-5528866e80b5?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1696621461244-5060416e88d6?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1693657668139-29255ec6eb18?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1603259126022-accb4f78c03d?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1744234469026-a58e95384440?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1744234469007-fcd6514c70aa?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1489516408517-0c0a15662682?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1734437248274-9c2f7a365d97?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1601994725833-c65037b22a94?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1728458664355-ac336389e5f9?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1682879654288-3bc35430b79f?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1743819464838-ead29229489e?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1728458602333-c0fdc3ece8a5?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1691845254952-1ef8a890a0cd?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1696621461214-422c49f4fd09?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1704986304051-868895e3b7f3?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1592904083165-8c001f6e8d7e?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1728970381320-b40a223e46d5?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1604397852861-2c1555f08852?auto=format&fit=crop&q=80&w=1200",
  "https://images.unsplash.com/photo-1748373452031-ee1ae4eb624d?auto=format&fit=crop&q=80&w=1200"
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
  console.log(`Found ${articles.length} articles. Updating with VERIFIED URLs...`);

  let updatedCount = 0;
  for (let i = 0; i < articles.length; i++) {
    const article = articles[i];
    const verifiedUrl = VERIFIED_URLS[i % VERIFIED_URLS.length];
    
    const upRes = await fetch(`${url}/rest/v1/articles?id=eq.${article.id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json", 
        "apikey": key, 
        "Authorization": `Bearer ${key}` 
      },
      body: JSON.stringify({ image_url: verifiedUrl })
    });

    if (upRes.ok) updatedCount++;
    if (i % 10 === 0) process.stdout.write(".");
  }

  console.log(`\nSUCCESS: ${updatedCount} rows updated with verified working photos.`);
}

main();
