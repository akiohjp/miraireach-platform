import Parser from "rss-parser";
import { readFile } from "node:fs/promises";
import path from "node:path";

const parser = new Parser();

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

const FEEDS = [
  "https://techcrunch.com/category/artificial-intelligence/feed/",
  "https://www.wired.com/feed/tag/ai/latest/rss"
];

// Keywords for the "Gatekeeper Filter"
const BUSINESS_KEYWORDS = [
  "tool", "enterprise", "business", "efficiency", "dx", "automation", "roi", "startup", 
  "corporate", "revenue", "scale", "commerce", "market", "industry", "platform", "investment", "fund"
];

/**
 * MOCK: AI-Powered Rewrite Engine
 * In a real scenario, this would call OpenAI/Claude API.
 */
function processAndRewriteArticle(feedItem) {
  const title = feedItem.title || "";
  const snippet = feedItem.contentSnippet || feedItem.content || "";
  const combined = (title + " " + snippet).toLowerCase();

  // 1. Gatekeeper Filter
  const hasBusinessContext = BUSINESS_KEYWORDS.some(kw => combined.includes(kw));
  if (!hasBusinessContext) {
    console.log(`⏩ Skipping: "${title}" (No business/DX relevance found)`);
    return null;
  }

  console.log(`🎯 Processing: "${title}"...`);

  // 2. Value-Add Rewrite (Dubai/UAE Business Context)
  // We generate a specialized report based on the title.
  
  let category = "AI Tools & Tactics";
  if (combined.includes("corporate") || combined.includes("enterprise")) category = "AI x Corporate";
  if (combined.includes("real estate") || combined.includes("property")) category = "AI x Real Estate";
  if (combined.includes("food") || combined.includes("restaurant") || combined.includes("hospitality")) category = "AI x Hospitality";

  const rewrittenContent = `## Intelligence Brief: How "${title}" Reshapes the UAE Business Landscape\n\nWhile the global headlines focus on the technical novelty of ${title}, for business owners in Dubai and the wider UAE, the true value lies in its operational application. This report analyzes how this development can be integrated into the regional market to drive ROI and competitive advantage.\n\n### The Core Tactic: Strategic Integration\nThe primary takeaway from this development is the shift toward automated high-precision workflows. In the context of Dubai's D33 agenda, tools like this are no longer optional—they are the infrastructure of growth. For enterprises in the DIFC or DMCC, the ability to leverage this specific technology means a reduction in manual processing time by an estimated 35-50%.\n\n### Sector-Specific Applications in the UAE\n\n- **For Corporate Management**: This technology allows for the automation of complex compliance and reporting tasks. Instead of manual data entry, AI-driven systems can now provide real-time visibility into operational health, allowing GMs and CEOs to make data-backed decisions in minutes rather than days.\n\n- **For Real Estate & Hospitality**: The predictive capabilities mentioned in this news are particularly impactful for high-frequency markets like Dubai Marina and Downtown. By applying these AI models to guest data or property demand, businesses can optimize pricing and staffing with surgical precision.\n\n### Conclusion and Next Steps\nTo capitalize on this trend, UAE-based firms should move beyond the "testing" phase and begin integrating these tools into their core CRMs and ERPs. The first-mover advantage in the Middle East is significant; those who master this specific AI tactic today will define the market of 2027. We recommend a phased rollout, starting with high-friction administrative tasks to demonstrate immediate ROI to stakeholders.`;

  return {
    title: `Intelligence Report: ${title}`,
    category: category,
    excerpt: `Deep analysis of ${title} and its specific ROI potential for the Dubai business sector.`,
    content: rewrittenContent,
    original_url: feedItem.link,
    source_name: "mirAIreach Curator"
  };
}

async function main() {
  await loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) throw new Error("Missing config");

  console.log("🤖 STARTING SMART RSS CURATOR...");

  let totalCurated = 0;

  for (const feedUrl of FEEDS) {
    try {
      console.log(`📡 Fetching from ${feedUrl}...`);
      const feed = await parser.parseURL(feedUrl);
      
      // Process top 3 items from each feed to keep it focused
      const items = feed.items.slice(0, 3);
      
      for (const item of items) {
        const curated = processAndRewriteArticle(item);
        if (!curated) continue;

        // INSERT into Supabase
        const payload = {
          category: curated.category,
          title: curated.title,
          excerpt: curated.excerpt,
          content: curated.content,
          content_ar: `[Arabic Brief: ${curated.title}]`,
          source_name: curated.source_name,
          image_url: `https://picsum.photos/seed/curated-${totalCurated}-${Date.now()}/800/600`,
          original_url: curated.original_url,
          is_published: true,
          created_at: new Date().toISOString()
        };

        const res = await fetch(`${url}/rest/v1/articles`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json", 
            "apikey": key, 
            "Authorization": `Bearer ${key}` 
          },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          console.log(`✅ Successfully curated and saved: ${curated.title}`);
          totalCurated++;
        } else {
          console.error(`❌ Failed to save: ${await res.text()}`);
        }
      }
    } catch (err) {
      console.error(`❌ Error fetching ${feedUrl}:`, err.message);
    }
  }

  console.log(`\n✨ CURATION COMPLETE: Added ${totalCurated} high-value articles to the database.`);
}

main();
