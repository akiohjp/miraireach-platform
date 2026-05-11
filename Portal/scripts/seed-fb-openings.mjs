import { readFile } from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";
import { createApi } from "unsplash-js";
import Parser from "rss-parser";

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

const FEEDS = [
  { name: "What's On Dubai", url: "https://www.whatson.ae/feed" },
  { name: "Khaleej Times Lifestyle", url: "https://www.khaleejtimes.com/rss/lifestyle" }
];

const FB_KEYWORDS = [
  "opening", "launch", "new restaurant", "new menu", "concept", "Michelin", "chef", "dining", "mall", "hospitality", "hotel", "cafe", "omakase", "steakhouse", "beach club"
];

async function generateFBArticle(openai, sourceItem) {
  const systemPrompt = `
    You are a premium F&B and hospitality critic in Dubai.
    You will be provided with a news snippet about a new opening or concept.
    Generate a stunning, high-density review/report.
    
    Structure:
    1. Introduction: Captivating and evocative, highlighting why this opening matters (200 words).
    2. The Concept (H2): A deep dive into the design, atmosphere, and USP.
    3. Culinary/Service Highlights (H2): Detailed analysis of the menu or hospitality offering.
    4. Strategic Market Impact (H2): How this affects the Dubai F&B/Hospitality landscape.
    5. AI Insight (H2): A strategic takeaway regarding the business model or tech integration.
    
    Requirements:
    - Minimum 1500 words in English.
    - Professional, high-quality Arabic translation for ALL sections.
    - Use Markdown for structure (H2, bullet points, bolding).
    - Tone: Sophisticated, authoritative, "insider".
    - Return a JSON object with: title, title_ar, excerpt, excerpt_ar, content, content_ar, image_query
  `;

  const userPrompt = `
    Source News: "${sourceItem.title}"
    Snippet: "${sourceItem.contentSnippet || sourceItem.content || ""}"
    Link: ${sourceItem.link}
  `;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ],
    response_format: { type: "json_object" }
  });

  return JSON.parse(completion.choices[0].message.content);
}

async function getRandomUnsplashImage(unsplash, query, index) {
  try {
    if (!unsplash) return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80";
    const res = await unsplash.photos.getRandom({
      query: query || "dubai fine dining",
      orientation: "landscape",
      count: 1,
    });
    if (res.response && Array.isArray(res.response)) return res.response[0].urls.regular;
    if (res.response) return res.response.urls?.regular || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80";
    return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80";
  } catch (err) {
    return "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80";
  }
}

async function checkExists(supabaseUrl, supabaseKey, originalUrl) {
  const res = await fetch(`${supabaseUrl}/rest/v1/articles?original_url=eq.${encodeURIComponent(originalUrl)}&select=id`, {
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
  });
  if (!res.ok) return false;
  const data = await res.json();
  return data.length > 0;
}

async function main() {
  await loadEnv();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!supabaseUrl || !supabaseKey || !openaiKey) {
    throw new Error("Missing required credentials (SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY)");
  }

  const openai = new OpenAI({ apiKey: openaiKey });
  const unsplash = unsplashKey && !unsplashKey.includes("your_") ? createApi({ accessKey: unsplashKey }) : null;
  const parser = new Parser();

  console.log("--------------------------------------------------");
  console.log("FETCHING F&B & OPENING NEWS FROM RSS...");
  const allItems = [];
  for (const feed of FEEDS) {
    try {
      console.log(`- Fetching ${feed.name}...`);
      const feedData = await parser.parseURL(feed.url);
      feedData.items.forEach(item => {
        const text = (item.title + " " + (item.contentSnippet || "")).toLowerCase();
        const matches = FB_KEYWORDS.some(kw => text.includes(kw));
        if (matches) {
          allItems.push({ ...item, sourceName: feed.name });
        }
      });
    } catch (err) {
      console.warn(`! Failed to fetch ${feed.name}: ${err.message}`);
    }
  }

  console.log(`Found ${allItems.length} relevant F&B/Opening items.`);
  let count = 0;
  for (const item of allItems) {
    if (count >= 10) break;

    const exists = await checkExists(supabaseUrl, supabaseKey, item.link);
    if (exists) {
      console.log(`- [SKIP] Already exists: ${item.title}`);
      continue;
    }

    process.stdout.write(`[${count + 1}/10] Generating Premium Review: "${item.title}"... `);
    try {
      const curation = await generateFBArticle(openai, item);
      const imageUrl = await getRandomUnsplashImage(unsplash, curation.image_query, count);

      const payload = {
        category: "Gourmet & Dining",
        title: curation.title,
        title_ar: curation.title_ar,
        excerpt: curation.excerpt,
        excerpt_ar: curation.excerpt_ar,
        content: curation.content,
        content_ar: curation.content_ar,
        image_url: imageUrl,
        image_search_query: curation.image_query,
        source_name: "mirAIreach Openings",
        original_source_name: item.sourceName,
        original_url: item.link,
        is_published: true,
        is_curated: true,
        created_at: new Date().toISOString(),
      };

      const insertRes = await fetch(`${supabaseUrl}/rest/v1/articles`, {
        method: "POST",
        headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (insertRes.ok) {
        console.log("DONE.");
        count++;
      } else {
        console.error(`FAILED: ${await insertRes.text()}`);
      }

      await new Promise(r => setTimeout(r, 1000));
    } catch (err) {
      console.error(`ERROR: ${err.message}`);
    }
  }

  console.log("--------------------------------------------------");
  console.log(`F&B OPENINGS INJECTION COMPLETE. ${count} ARTICLES INJECTED.`);
  console.log("--------------------------------------------------");
}

main();
