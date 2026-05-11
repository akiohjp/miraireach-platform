import { readFile } from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";
import { createApi } from "unsplash-js";

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
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!url || !key || !openaiKey || !unsplashKey) {
    console.error("Missing required environment variables (SUPABASE, OPENAI, UNSPLASH)");
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey: openaiKey });
  const unsplash = createApi({ accessKey: unsplashKey });

  console.log("Fetching all articles...");
  const res = await fetch(`${url}/rest/v1/articles?select=id,title`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`
    }
  });

  if (!res.ok) {
    console.error("Failed to fetch articles:", await res.text());
    process.exit(1);
  }

  const articles = await res.json();
  console.log(`Found ${articles.length} articles to refresh.`);

  for (const article of articles) {
    console.log(`\nProcessing: "${article.title}" (ID: ${article.id})`);

    // 1. Generate search query using LLM
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: "Generate a specific 2-3 word English image search keyword for a business news article title. Focus on Dubai, luxury, tech, or dining context. Return ONLY the keywords." 
          },
          { role: "user", content: article.title }
        ]
      });

      const query = completion.choices[0].message.content.trim().replace(/"/g, "");
      console.log(`Generated Query: "${query}"`);

      // 2. Fetch image from Unsplash
      const photoRes = await unsplash.search.getPhotos({
        query: query,
        perPage: 1,
        orientation: "landscape",
      });

      if (photoRes.errors) {
        console.error("Unsplash Error:", photoRes.errors[0]);
        continue;
      }

      const imageUrl = photoRes.response.results[0]?.urls.regular || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80";
      console.log(`Fetched Image: ${imageUrl}`);

      // 3. Update database
      const updateRes = await fetch(`${url}/rest/v1/articles?id=eq.${article.id}`, {
        method: "PATCH",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({
          image_url: imageUrl,
          image_search_query: query
        })
      });

      if (!updateRes.ok) {
        console.error("Failed to update article:", await updateRes.text());
      } else {
        console.log("Successfully updated.");
      }

      // Small delay to respect rate limits
      await new Promise(r => setTimeout(r, 1000));

    } catch (err) {
      console.error("Error processing article:", err.message);
    }
  }

  console.log("\nRefresh complete!");
}

main();
