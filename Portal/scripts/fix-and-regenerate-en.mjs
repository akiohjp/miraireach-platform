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

const topics = ["ChatGPT", "Claude 3.5 Sonnet", "Gemini Advanced", "AI Overview (AIO)", "Global Entity Optimization (GEO)", "Generative Video AI", "Predictive Analytics", "Conversational AI"];
const actions = ["Fundamentals and Practical Applications", "How to Automate 50% of Operations", "Cost Reduction Strategies", "A Fail-Safe Implementation Guide", "Latest Updates and Business Impact", "Advanced Marketing Tactics"];
const targets = ["for Dubai Real Estate", "for SME Owners", "for the Hospitality Sector", "for Free Zone Entities", "- A Beginner's Guide"];

function generateEnglishBody(topic, action, target) {
  return `## ${topic}: ${action} ${target}\n\nIn the competitive business environment of Dubai and the wider UAE, **${topic}** has emerged as a transformative force. This report provides a strategic framework for how organizations ${target} can leverage this technology to drive operational excellence.\n\n### Strategic Overview and ROI\nAs part of the Dubai Economic Agenda (D33), the integration of AI is no longer optional. By applying ${topic} to ${action}, firms are seeing a significant reduction in overhead and a massive increase in service speed. This transition is not just about adopting new tools; it is about building a 'Digital Twin' of your operations that can scale infinitely.\n\n### Tactical Implementation Steps:\n- **Assessment**: Identify high-friction areas within your ${target} workflows where ${topic} can be applied immediately.\n- **Automation**: Execute a phased rollout of ${action} to demonstrate ROI to stakeholders within the first 90 days.\n- **Scaling**: Leverage the UAE's world-class cloud infrastructure to scale your AI solutions across the entire enterprise.\n\n### Conclusion\nThe future belongs to those who master the synergy between human expertise and AI precision. Whether you are focused on ${action} or building a new product line, ${topic} is your most valuable asset in 2026. mirAIreach will continue to track these developments and provide actionable insights for the regional market.\n\n### Key Takeaways\n- Focus on high-impact administrative tasks first.\n- Ensure data security and compliance with UAE regulations.\n- Build a culture of continuous learning to keep pace with AI evolution.`;
}

async function main() {
  await loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) throw new Error("Missing config");

  // STEP 1: Surgical Strike on Japanese Articles
  console.log("🧹  FETCHING ARTICLES TO IDENTIFY JAPANESE CONTENT...");
  const fetchRes = await fetch(`${url}/rest/v1/articles?select=id,title`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  const allArticles = await fetchRes.json();
  
  // Regex to detect Japanese characters (Hiragana, Katakana, Kanji)
  const jpRegex = /[々〇〻\u3040-\u309F\u30A0-\u30FF\uFF00-\uFFEF\u4E00-\u9FAF]/;
  const toDelete = allArticles.filter(a => jpRegex.test(a.title));

  console.log(`🗑️  Deleting ${toDelete.length} Japanese articles...`);
  
  let deletedCount = 0;
  for (const art of toDelete) {
    const delRes = await fetch(`${url}/rest/v1/articles?id=eq.${art.id}`, {
      method: "DELETE",
      headers: { apikey: key, Authorization: `Bearer ${key}` }
    });
    if (delRes.ok) deletedCount++;
  }

  // STEP 2 & 3: Regenerate English Content
  console.log("🚀  REGENERATING 30 PROFESSIONAL ENGLISH ARTICLES...");
  
  const existingTitles = new Set(allArticles.filter(a => !jpRegex.test(a.title)).map(a => a.title));
  let addedCount = 0;
  let attempts = 0;

  while (addedCount < 30 && attempts < 500) {
    attempts++;
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const target = targets[Math.floor(Math.random() * targets.length)];
    
    const title = `${topic}: ${action} ${target}`;
    if (existingTitles.has(title)) continue;
    
    existingTitles.add(title);
    
    // Categorization
    let category = "AI Tools & Tactics";
    if (target.includes("Real Estate")) category = "AI x Real Estate";
    if (target.includes("Hospitality")) category = "AI x Hospitality";
    if (target.includes("SME") || target.includes("Free Zone")) category = "AI x Corporate";
    if (target.includes("Beginner")) category = "AI Starter Guide";

    const payload = {
      category: category,
      title: title,
      excerpt: `A professional analysis of ${topic} and its impact on ${target} in the UAE market.`,
      content: generateEnglishBody(topic, action, target),
      content_ar: `[Arabic: ${title}]`,
      source_name: "mirAIreach Pro",
      image_url: `https://picsum.photos/seed/en-algo-${Date.now()}-${addedCount}/800/600`,
      is_published: true,
      created_at: new Date().toISOString()
    };

    const res = await fetch(`${url}/rest/v1/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: key, Authorization: `Bearer ${key}` },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      process.stdout.write(".");
      addedCount++;
    }
  }

  console.log(`\n\n✅ ${deletedCount}件の日本語記事を削除し、${addedCount}件の英語記事を追加しました。`);
}

main();
