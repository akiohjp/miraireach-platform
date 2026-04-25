import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createApi } from "unsplash-js";

// Security: CRON_SECRET check
export const dynamic = "force-dynamic";

const TOPICS = [
  "Dubai F&B Tech Trends 2026",
  "AI in Dubai Real Estate & PropTech",
  "The Future of FinTech in DIFC",
  "Luxury Hospitality & AI Guest Experience",
  "Sustainable Logistics in Jebel Ali Port",
  "Digital Marketing for Dubai Luxury Brands",
  "Cloud Kitchens and AI Delivery Optimization",
  "The Rise of Deep Tech Startups in UAE",
  "Blockchain and Property Ownership in Dubai",
  "AI-Driven Energy Management in UAE Smart Cities"
];

const CATEGORY_MAP: Record<string, string> = {
  "Dubai F&B Tech Trends 2026": "Gourmet & Dining",
  "AI in Dubai Real Estate & PropTech": "Real Estate & PropTech",
  "The Future of FinTech in DIFC": "FinTech & Crypto",
  "Luxury Hospitality & AI Guest Experience": "Gourmet & Dining",
  "Sustainable Logistics in Jebel Ali Port": "Logistics & Supply Chain",
  "Digital Marketing for Dubai Luxury Brands": "AI & Deep Tech",
  "Cloud Kitchens and AI Delivery Optimization": "Gourmet & Dining",
  "The Rise of Deep Tech Startups in UAE": "AI & Deep Tech",
  "Blockchain and Property Ownership in Dubai": "Real Estate & PropTech",
  "AI-Driven Energy Management in UAE Smart Cities": "AI & Deep Tech"
};

export async function GET(request: Request) {
  // 1. Verify Cron Secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const unsplash = createApi({
      accessKey: process.env.UNSPLASH_ACCESS_KEY || "",
    });

    const randomTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    const category = CATEGORY_MAP[randomTopic] || "General Business";

    console.log(`Generating article for topic: ${randomTopic}`);

    const systemPrompt = `
      You are an expert business journalist and AI strategist specializing in the Dubai and UAE markets.
      Generate a professional, high-density strategic report in a bilingual format (English and Arabic).
      
      The topic is: ${randomTopic}
      
      Requirements:
      1. Length: 1000+ words of English content, plus the Arabic translation.
      2. Format: Return ONLY a JSON object with these keys: 
         "title", "title_ar", "excerpt", "excerpt_ar", "content", "content_ar", "image_search_query"
      3. image_search_query: A specific 2-3 word English search keyword for Unsplash (e.g., "dubai skyscraper", "luxury dining table").
      4. Content Structure: 
         - Executive Summary
         - Market Context (Dubai/UAE specific)
         - Strategic Challenges
         - AI-Driven Solutions
         - ROI & Future Outlook
      5. Markdown: Use H2, H3, bolding, and bullet points for readability.
      6. Tone: Premium, B2B, authoritative.
      7. Specificity: Mention Dubai landmarks, laws (e.g., D33), or tech trends (AIO).
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Write a comprehensive report about ${randomTopic} for mirAIreach PRESS.` }
      ],
      response_format: { type: "json_object" }
    });

    const jsonResponse = JSON.parse(completion.choices[0].message.content || "{}");

    // 2. Fetch image from Unsplash
    let imageUrl = `https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80`;
    const searchQuery = jsonResponse.image_search_query || "dubai business";
    
    try {
      const photoRes = await unsplash.search.getPhotos({
        query: searchQuery,
        perPage: 1,
        orientation: "landscape",
      });
      if (photoRes.response?.results[0]) {
        imageUrl = photoRes.response.results[0].urls.regular;
      }
    } catch (unsplashError) {
      console.error("Unsplash error:", unsplashError);
    }

    // 3. Insert into Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase config missing");
    }

    const articleData = {
      category: category,
      title: jsonResponse.title,
      title_ar: jsonResponse.title_ar,
      excerpt: jsonResponse.excerpt,
      excerpt_ar: jsonResponse.excerpt_ar,
      content: jsonResponse.content,
      content_ar: jsonResponse.content_ar,
      image_search_query: searchQuery,
      source_name: "mirAIreach Autonomous AI",
      company_name: "AI Intelligence Unit",
      image_url: imageUrl,
      is_published: true,
      is_curated: false,
      created_at: new Date().toISOString()
    };

    const res = await fetch(`${supabaseUrl}/rest/v1/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": supabaseKey,
        "Authorization": `Bearer ${supabaseKey}`,
        "Prefer": "return=minimal"
      },
      body: JSON.stringify(articleData)
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Supabase error: ${errorText}`);
    }

    return NextResponse.json({ 
      success: true, 
      topic: randomTopic,
      title: jsonResponse.title 
    });

  } catch (error: any) {
    console.error("Auto-generate error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
