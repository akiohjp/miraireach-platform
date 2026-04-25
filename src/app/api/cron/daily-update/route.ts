import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createApi } from "unsplash-js";

export const dynamic = "force-dynamic";

const SOURCES = {
  lifestyle: ["Michelin Guide", "Gault&Millau UAE", "Time Out Dubai", "What's On Dubai", "Condé Nast Traveller ME"],
  business: ["Arabian Business", "Entrepreneur Middle East", "Forbes Middle East", "The National (Business)", "Gulf Business"]
};

const CATEGORIES = ["Gourmet & Dining", "Lifestyle & Travel", "AI & Deep Tech", "Real Estate & PropTech", "FinTech & Crypto"];

export async function GET(request: Request) {
  // 1. Security Check
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!supabaseUrl || !supabaseKey || !openaiKey) {
    return NextResponse.json({ error: "Missing configuration" }, { status: 500 });
  }

  const openai = new OpenAI({ apiKey: openaiKey });
  const unsplash = createApi({ accessKey: unsplashKey || "" });

  try {
    // 2. Fetch recent titles to avoid duplicates
    const recentRes = await fetch(`${supabaseUrl}/rest/v1/articles?select=title&order=created_at.desc&limit=20`, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
    });
    const recentArticles = await recentRes.json();
    const existingTitles = Array.isArray(recentArticles) ? recentArticles.map(a => a.title) : [];

    // 3. Generate 3-5 unique topics
    const topicPrompt = `
      You are a chief editor for a premium Dubai media platform. 
      Suggest 4 unique, highly specific news topics for today's curation.
      Sources to use: ${[...SOURCES.lifestyle, ...SOURCES.business].join(", ")}.
      Categories: ${CATEGORIES.join(", ")}.
      
      Existing recent titles (DO NOT REPEAT):
      ${existingTitles.join("\n")}
      
      Requirements:
      - Each topic must be a specific, real-world-style headline.
      - Diversity: 2 from lifestyle, 2 from business.
      - Return a JSON array of objects: { "source": "Media Name", "topic": "Headline", "category": "Category Name" }
    `;

    const topicCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "system", content: topicPrompt }],
      response_format: { type: "json_object" }
    });

    const { topics } = JSON.parse(topicCompletion.choices[0].message.content || '{"topics": []}');
    const results = [];

    // 4. Generate content for each topic
    for (const item of topics) {
      console.log(`Processing: ${item.topic}`);

      const systemPrompt = `
        You are an elite journalist for ${item.source}. Write a stunning, authoritative report.
        Topic: ${item.topic}
        Category: ${item.category}
        
        Requirements:
        - LANGUAGE SEPARATION: "content" (English only), "content_ar" (Arabic only).
        - Minimum 1200 words in English.
        - High-quality Arabic translation.
        - Strategic AI Market Insight section included.
        - Return JSON: title, title_ar, excerpt, excerpt_ar, content, content_ar, image_query
      `;

      const contentCompletion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "system", content: systemPrompt }, { role: "user", content: `Write the report for ${item.topic}` }],
        response_format: { type: "json_object" }
      });

      const curation = JSON.parse(contentCompletion.choices[0].message.content || "{}");

      // Check if this newly generated title exists (double check)
      const checkRes = await fetch(`${supabaseUrl}/rest/v1/articles?title=eq.${encodeURIComponent(curation.title)}&select=id`, {
        headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` }
      });
      const checkData = await checkRes.json();
      if (checkData && checkData.length > 0) {
        console.log(`Skipping duplicate: ${curation.title}`);
        continue;
      }

      // Fetch Image
      let imageUrl = "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80";
      try {
        const photoRes = await unsplash.search.getPhotos({
          query: `${curation.image_query || item.topic} dubai luxury`,
          perPage: 1,
          orientation: "landscape"
        });
        if (photoRes.response?.results[0]) {
          imageUrl = photoRes.response.results[0].urls.regular;
        }
      } catch (err) {
        console.warn("Unsplash error, using fallback");
      }

      const payload = {
        category: item.category,
        title: curation.title,
        title_ar: curation.title_ar,
        excerpt: curation.excerpt,
        excerpt_ar: curation.excerpt_ar,
        content: curation.content,
        content_ar: curation.content_ar,
        image_url: imageUrl,
        image_search_query: curation.image_query || item.topic,
        source_name: item.source,
        is_published: true,
        is_curated: true,
        created_at: new Date().toISOString()
      };

      const insertRes = await fetch(`${supabaseUrl}/rest/v1/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`
        },
        body: JSON.stringify(payload)
      });

      if (insertRes.ok) {
        results.push({ title: curation.title, status: "success" });
      } else {
        console.error(`Insert failed for ${curation.title}:`, await insertRes.text());
      }
    }

    return NextResponse.json({ success: true, count: results.length, articles: results });

  } catch (error: any) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
