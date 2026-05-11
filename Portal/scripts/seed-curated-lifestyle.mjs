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
  { name: "The National", url: "https://www.thenationalnews.com/arc/outboundfeeds/rss/?outputType=xml" },
  { name: "Arab News", url: "https://www.arabnews.com/rss.xml" },
  { name: "MENAbytes", url: "https://www.menabytes.com/feed/" },
];

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=80"
];

async function generateCuration(openai, sourceItem) {
  const systemPrompt = `
    You are a senior strategic analyst at mirAIreach PRESS.
    You will be provided with a real news title and snippet from a UAE media source.
    Your task is to generate a high-density, professional curation report in both English and Arabic.
    
    Structure:
    1. Introduction: Summarize the news and why it matters now (150-200 words).
    2. Strategic Analysis (H2): A deep dive into the underlying market forces.
    3. Industry Impact (H2): How this affects F&B, Real Estate, or Tech sectors in Dubai.
    4. Future Outlook (H2): 3-5 year projections based on this news.
    5. AI Insight (H2): A unique strategic takeaway for B2B stakeholders.
    
    Requirements:
    - Minimum 1000 words in English.
    - Professional, high-quality Arabic translation for ALL sections.
    - Use Markdown for structure (H2, bullet points).
    - Include specific financial/business context.
    - Return a JSON object with: title, title_ar, excerpt, excerpt_ar, content, content_ar, image_query
  `;

  const userPrompt = `
    Source: ${sourceItem.sourceName}
    Title: ${sourceItem.title}
    Snippet: ${sourceItem.contentSnippet || sourceItem.content || "UAE News Update"}
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
    if (!unsplash) return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
    const res = await unsplash.photos.getRandom({
      query: query || "dubai",
      orientation: "landscape",
      count: 1,
    });
    if (res.response && Array.isArray(res.response)) return res.response[0].urls.regular;
    if (res.response) return res.response.urls?.regular || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
    return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  } catch (err) {
    return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
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

  if (!supabaseUrl || !supabaseKey) throw new Error("Missing Supabase credentials");
  if (!openaiKey) {
    console.error("ERROR: OPENAI_API_KEY is missing. Please set it in .env.local.");
    process.exit(1);
  }

  const openai = new OpenAI({ apiKey: openaiKey });
  const unsplash = unsplashKey && !unsplashKey.includes("your_") ? createApi({ accessKey: unsplashKey }) : null;
  const parser = new Parser();

  console.log("--------------------------------------------------");
  console.log("PURGING PREVIOUS CURATION DATA...");
  const purgeRes = await fetch(`${supabaseUrl}/rest/v1/articles?source_name=eq.mirAIreach%20Curation`, {
    method: "DELETE",
    headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
  });
  if (purgeRes.ok) console.log("Purge successful.");

  console.log("--------------------------------------------------");
  console.log("FETCHING RSS FEEDS...");
  const allItems = [];
  for (const feed of FEEDS) {
    try {
      console.log(`- Fetching ${feed.name}...`);
      const feedData = await parser.parseURL(feed.url);
      feedData.items.slice(0, 10).forEach(item => {
        allItems.push({ ...item, sourceName: feed.name });
      });
    } catch (err) {
      console.warn(`! Failed to fetch ${feed.name}: ${err.message}`);
    }
  }

  console.log(`Processing up to 15 news items...`);
  let count = 0;
  for (const item of allItems) {
    if (count >= 15) break;

    const exists = await checkExists(supabaseUrl, supabaseKey, item.link);
    if (exists) {
      console.log(`- [SKIP] Already exists: ${item.title}`);
      continue;
    }

    process.stdout.write(`[${count + 1}/15] Curating: "${item.title}"... `);
    try {
      const curation = await generateCuration(openai, item);
      const imageUrl = await getRandomUnsplashImage(unsplash, curation.image_query, count);

      const payload = {
        category: "News Curation",
        title: curation.title,
        title_ar: curation.title_ar,
        excerpt: curation.excerpt,
        excerpt_ar: curation.excerpt_ar,
        content: curation.content,
        content_ar: curation.content_ar,
        image_url: imageUrl,
        image_search_query: curation.image_query,
        source_name: "mirAIreach Curation",
        original_source_name: item.sourceName,
        original_url: item.link,
        is_published: true,
        is_curated: true,
        created_at: new Date().toISOString(),
      };

      const insertRes = await fetch(`${supabaseUrl}/rest/v1/articles`, {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json"
        },
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
  console.log(`RSS CURATION COMPLETE. ${count} ARTICLES INJECTED.`);
  console.log("--------------------------------------------------");
}

main();
