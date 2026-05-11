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

const BLUEPRINTS = [
  // AI Starter Guide
  { title: "Writing Professional Apology Emails with AI", category: "AI Starter Guide", keywords: ["Empathy", "Tone adjustment", "Business etiquette"] },
  { title: "Summarizing Multi-Language Market Research", category: "AI Starter Guide", keywords: ["Cross-border", "Sentiment analysis", "Executive brief"] },
  { title: "Generating Meeting Agendas from Rough Notes", category: "AI Starter Guide", keywords: ["Efficiency", "Structure", "Goal-setting"] },
  { title: "Crafting High-Converting Product Descriptions", category: "AI Starter Guide", keywords: ["Copywriting", "SEO", "Persuasion"] },
  { title: "Using AI to Explain Complex Tax Regulations", category: "AI Starter Guide", keywords: ["Simplification", "Compliance", "Learning"] },
  { title: "Generating Personalized Training Plans for Staff", category: "AI Starter Guide", keywords: ["Skill-gap", "Individualized", "Growth"] },
  { title: "AI for Better Personal Time Management", category: "AI Starter Guide", keywords: ["Prioritization", "Scheduling", "Focus"] },
  { title: "Drafting Policy Memos in Seconds", category: "AI Starter Guide", keywords: ["Governance", "Clarity", "Standard"] },
  { title: "Using AI for Creative Event Planning Ideas", category: "AI Starter Guide", keywords: ["Innovation", "Logistics", "Engagement"] },
  { title: "Creating Professional Bios for Your Website", category: "AI Starter Guide", keywords: ["Branding", "Narrative", "Credibility"] },
  { title: "AI-Powered Troubleshooting for Common Office Tech", category: "AI Starter Guide", keywords: ["Diagnostics", "Speed", "Problem-solving"] },
  { title: "Generating Quick Responses to Customer Reviews", category: "AI Starter Guide", keywords: ["Reputation", "Feedback", "Loyalty"] },
  { title: "Learning Basic Coding Phrases with AI Assistance", category: "AI Starter Guide", keywords: ["Automation", "Literacy", "Logic"] },

  // AI x Industry DX
  { title: "AI-Driven Inventory Optimization for Small Retailers", category: "AI x Corporate", keywords: ["Stock-outs", "Forecasting", "Capital flow"] },
  { title: "Smart Waste Management in Residential Towers", category: "AI x Real Estate", keywords: ["IoT", "Efficiency", "Sustainability"] },
  { title: "AI-Enhanced Security in Gated Communities", category: "AI x Real Estate", keywords: ["Recognition", "Safety", "Privacy"] },
  { title: "Personalized Wellness Plans in Luxury Gyms", category: "AI x Hospitality", keywords: ["Biometrics", "Coaching", "Nutrition"] },
  { title: "AI-Optimized Lighting in Large Commercial Offices", category: "AI x Corporate", keywords: ["Energy", "Atmosphere", "Automation"] },
  { title: "Predictive Maintenance for Dubai's Chiller Systems", category: "AI x Real Estate", keywords: ["Reliability", "Cost-saving", "HVAC"] },
  { title: "AI-Assisted Design for Sustainable Interior Fit-outs", category: "AI x Real Estate", keywords: ["Materials", "Generative", "Green"] },
  { title: "Real-Time Translation for Tourist Information Booths", category: "AI x Hospitality", keywords: ["Inclusivity", "Speed", "Accuracy"] },
  { title: "AI-Driven Queue Management in Government Centers", category: "AI x Corporate", keywords: ["Flow", "Satisfaction", "Service"] },
  { title: "Smart Parking Solutions for High-Density Business Hubs", category: "AI x Corporate", keywords: ["Navigation", "Space", "Revenue"] },
  { title: "AI-Powered Drone Delivery for Last-Mile Pharmacy", category: "AI x Corporate", keywords: ["Health", "Speed", "Regulation"] },
  { title: "Automated Energy Audits for Industrial Warehouses", category: "AI x Corporate", keywords: ["Carbon", "Efficiency", "Compliance"] },
  { title: "AI-Enhanced Food Safety Monitoring in Large Catering", category: "AI x Hospitality", keywords: ["Compliance", "Sensor", "Risk"] },
  { title: "Smart Irrigation Systems for Urban Parks in Dubai", category: "AI x Real Estate", keywords: ["Water", "Weather", "Automation"] },

  // UAE/Dubai AI Insights
  { title: "The Impact of UAE's AI Strategy on Local GDP Growth", category: "UAE AI Strategy", keywords: ["Economy", "Investment", "Roadmap"] },
  { title: "Building the 'Silicon Valley of the Middle East' in Dubai", category: "UAE AI Strategy", keywords: ["Hubs", "Startups", "Talent"] },
  { title: "The Role of AI in the Dubai 2040 Urban Master Plan", category: "UAE AI Strategy", keywords: ["Quality of life", "Sustainability", "Infrastructure"] },
  { title: "UAE's Global Positioning in the AI Arms Race", category: "UAE AI Strategy", keywords: ["Geopolitics", "R&D", "Strategy"] },
  { title: "The Future of AI in Islamic Finance and Banking", category: "UAE AI Strategy", keywords: ["Sharia-compliance", "FinTech", "Modernization"] },
  { title: "Dubai's Digital Transformation: A Decade in Review", category: "UAE AI Strategy", keywords: ["Evolution", "Leadership", "Vision"] },
  { title: "AI and the Growth of the UAE's Knowledge Economy", category: "UAE AI Strategy", keywords: ["Education", "Innovation", "R&D"] },
  { title: "The Integration of AI in Dubai's Smart Transportation", category: "UAE AI Strategy", keywords: ["Autonomous", "Mobility", "Efficiency"] },
  { title: "UAE's Strategy for Human-AI Collaboration", category: "UAE AI Strategy", keywords: ["Skills", "Ethics", "Policy"] },
  { title: "The Growth of the AI Sector in Abu Dhabi's ADGM", category: "UAE AI Strategy", keywords: ["FinTech", "Regulation", "Capital"] },
  { title: "AI and the Preservation of Arabic Cultural Heritage", category: "UAE AI Strategy", keywords: ["NLP", "History", "Innovation"] },
  { title: "The Economic Impact of AI on the UAE's SME Sector", category: "UAE AI Strategy", keywords: ["Resilience", "Growth", "Support"] },
  { title: "Dubai's Vision for an AI-Driven Government Service", category: "UAE AI Strategy", keywords: ["Efficiency", "Happiness", "Data"] }
];

function buildArticleContent(title, keywords) {
  const kwList = keywords.join(", ");
  return `## ${title}\n\nIn the modern business landscape of Dubai and the wider UAE, the focus on **${kwList}** has become a critical success factor. This report analyzes how to leverage AI to master these domains and drive sustainable growth.\n\n### The Tactical Overview\nWhen we look at **${title}**, we must consider the operational context of the Middle East. High-speed growth requires high-precision tools. By integrating AI-driven workflows, businesses can move beyond traditional bottlenecks and achieve a level of agility that was previously impossible. This is not just about technology; it is about a mindset shift toward data-driven excellence.\n\n### Key Areas of Focus:\n- **${keywords[0]}**: How this specific element drives immediate ROI and operational clarity.\n- **${keywords[1]}**: Why this is the backbone of long-term strategic resilience in the regional market.\n- **${keywords[2]}**: The tactical steps required to implement this within your existing corporate structure.\n\n### Implementation in the UAE Market\nFor enterprises operating out of hubs like the DIFC or DMCC, the message is clear: adapt or be left behind. We recommend a phased approach that starts with high-impact administrative tasks before scaling to core business functions. This ensures a steady demonstration of value to stakeholders and a smoother transition for the workforce. The UAE government's vision for a digital-first economy provides the perfect regulatory and technical framework for this evolution.\n\n### Conclusion\nMastering **${title}** is the first step toward building a future-proof business in 2026. By focusing on the synergy between human expertise and AI efficiency, firms can unlock new levels of value and lead their sectors into the next decade of innovation. This report serves as your tactical blueprint for that journey. We will continue to track the evolution of **${kwList}** and provide actionable insights for our audience.`;
}

async function main() {
  await loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) throw new Error("Missing config");

  // 1. Pre-count
  const preRes = await fetch(`${url}/rest/v1/articles?select=count`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "count=exact" }
  });
  const preCount = parseInt(preRes.headers.get("content-range").split("/")[1]);
  console.log(`📊  PRE-UPDATE COUNT: ${preCount} articles.`);

  // 2. Duplicate Check
  const titlesRes = await fetch(`${url}/rest/v1/articles?select=title`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  const existingData = await titlesRes.json();
  const existingTitles = new Set(existingData.map(a => a.title));

  console.log(`🚀  DYNAMICALLY GENERATING AND INSERTING ${BLUEPRINTS.length} ARTICLES...`);

  let totalAdded = 0;
  for (let i = 0; i < BLUEPRINTS.length; i++) {
    const blueprint = BLUEPRINTS[i];
    if (existingTitles.has(blueprint.title)) {
      console.log(`⏩ Skipping duplicate: "${blueprint.title}"`);
      continue;
    }

    const content = buildArticleContent(blueprint.title, blueprint.keywords);
    const payload = {
      category: blueprint.category,
      title: blueprint.title,
      excerpt: `Detailed analysis and tactical guide on ${blueprint.title} for the UAE market.`,
      content: content,
      content_ar: `[Arabic: ${blueprint.title}]`,
      source_name: "mirAIreach Bulk",
      image_url: `https://picsum.photos/seed/miraibulk-${Date.now()}-${i}/800/600`,
      is_published: true,
      created_at: new Date().toISOString()
    };

    const insertRes = await fetch(`${url}/rest/v1/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: key, Authorization: `Bearer ${key}` },
      body: JSON.stringify(payload)
    });

    if (insertRes.ok) {
      process.stdout.write(".");
      totalAdded++;
    } else {
      console.error(`\n❌ Failed to insert: ${blueprint.title}`);
    }
  }

  // 3. Post-count
  const postRes = await fetch(`${url}/rest/v1/articles?select=count`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "count=exact" }
  });
  const postCount = parseInt(postRes.headers.get("content-range").split("/")[1]);
  
  console.log(`\n\n📊  POST-UPDATE COUNT: ${postCount} articles.`);
  console.log(`📈  NET INCREASE: ${postCount - preCount} articles.`);
  
  if (postCount - preCount === totalAdded) {
    console.log(`✨ SUCCESS: Correctly added ${totalAdded} unique articles using dynamic generation. TOTAL: ${postCount}`);
  } else {
    console.error("⚠️  ERROR: Count mismatch!");
  }
}

main();
