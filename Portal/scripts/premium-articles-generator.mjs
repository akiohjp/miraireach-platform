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

const PREMIUM_ARTICLES = [
  // AI Starter Guide
  { title: "The 1-Minute Prompt: How Dubai's Local Retailers are Automating Customer Support with ChatGPT", category: "AI Starter Guide", keywords: ["Customer Support", "Prompt Engineering", "Automation"] },
  { title: "Claude for Legal: A Step-by-Step Guide for Small Business Owners to Review Rental Contracts", category: "AI Starter Guide", keywords: ["Legal Review", "Contract Analysis", "Small Business"] },
  { title: "Zero to Hero: Mastering Gemini to Build Your First 30-Day Marketing Plan from Scratch", category: "AI Starter Guide", keywords: ["Marketing Strategy", "Google Gemini", "Content Planning"] },
  { title: "Voice-First Business: Practicing High-Stakes Arabic Negotiations with ChatGPT's New Voice Mode", category: "AI Starter Guide", keywords: ["Negotiation Skills", "Arabic Language", "Voice AI"] },
  { title: "The Smart Inbox: Using AI to Filter and Draft Professional Email Responses While You Sleep", category: "AI Starter Guide", keywords: ["Email Management", "Productivity", "Writing Assistant"] },
  { title: "Prompt Engineering for Non-Techies: 5 Frameworks Every Dubai Entrepreneur Needs to Know", category: "AI Starter Guide", keywords: ["Education", "Entrepreneurship", "Frameworks"] },

  // UAE AI Strategy
  { title: "Dubai AI Campus: Why Global Founders are Flocking to the New Tech Hub in DIFC", category: "UAE AI Strategy", keywords: ["DIFC", "Startups", "Investment"] },
  { title: "Sovereign Intelligence: Analyzing the UAE’s Billion-Dollar Bet on Local LLMs and Infrastructure", category: "UAE AI Strategy", keywords: ["Infrastructure", "National Security", "Economy"] },
  { title: "The Digital Twin Revolution: How Dubai is Using AI to Predict Traffic Patterns Before They Happen", category: "UAE AI Strategy", keywords: ["Urban Planning", "Traffic Management", "Mobility"] },
  { title: "MBR Solar Park: The AI Algorithm That Manages the World's Largest Renewable Energy Site", category: "UAE AI Strategy", keywords: ["Sustainability", "Energy", "Green Tech"] },
  { title: "National Program for Coders: How the UAE is Building a 100,000-Strong AI Workforce by 2030", category: "UAE AI Strategy", keywords: ["Talent", "Education", "National Strategy"] },
  { title: "From Oil to Data: Understanding the Strategic Shift in Abu Dhabi's G42 and Mubadala Investments", category: "UAE AI Strategy", keywords: ["Abu Dhabi", "Capital", "Technology Transfer"] },

  // AI x Real Estate
  { title: "Virtual Property Tours 2.0: How Off-Plan Developers in Dubai are Using Sora to Pre-sell Luxury Villas", category: "AI x Real Estate", keywords: ["Off-plan", "Video Generation", "Luxury Sales"] },
  { title: "Predictive Pricing: How AI is Helping Investors Spot the Next 'Undervalued' District in Dubai South", category: "AI x Real Estate", keywords: ["Market Analysis", "Investment", "Data Science"] },
  { title: "Tokenized Assets: The AI-Powered Platforms Democratizing Ownership of Downtown Skyscrapers", category: "AI x Real Estate", keywords: ["Blockchain", "Liquidity", "Downtown Dubai"] },
  { title: "Smart Districts: Inside Dubai Silicon Oasis’ Living Lab for Autonomous Urban Living", category: "AI x Real Estate", keywords: ["Silicon Oasis", "Smart City", "Living Lab"] },
  { title: "The Green Skyscraper: How AI Managed Chillers are Slashing Carbon Footprints in Business Bay", category: "AI x Real Estate", keywords: ["ESG", "Facility Management", "Efficiency"] },
  { title: "PropTech Renaissance: Why Venture Capital is Pouring into Dubai's AI-Driven Real Estate Startups", category: "AI x Real Estate", keywords: ["Venture Capital", "PropTech", "SaaS"] },

  // AI x Hospitality
  { title: "The Psychic Hotel: How Atlantis The Royal Uses AI to Anticipate Guest Needs Before Check-in", category: "AI x Hospitality", keywords: ["Luxury Hotels", "Personalization", "Guest Experience"] },
  { title: "Zero-Waste Kitchens: How AI-Driven Inventory is Saving Dubai's Top Restaurants Millions", category: "AI x Hospitality", keywords: ["F&B", "Sustainability", "Cost Management"] },
  { title: "Personalized Tourism: Using AI to Create Bespoke 48-Hour Dubai Itineraries in Seconds", category: "AI x Hospitality", keywords: ["Concierge", "Tourism", "Customization"] },
  { title: "Cloud Kitchen 2.0: How Kitopi is Scaling 50+ Brands from a Single AI-Managed Site", category: "AI x Hospitality", keywords: ["Cloud Kitchen", "Logistics", "Scale"] },
  { title: "Smart Bar Management: Using IoT and AI to Eliminate Beverage Shrinkage in Marina Lounges", category: "AI x Hospitality", keywords: ["Nightlife", "IoT", "Inventory"] },
  { title: "Wellness 3.0: How AI-Driven Biofeedback is Transforming the Luxury Spa Experience in Dubai", category: "AI x Hospitality", keywords: ["Wellness", "Biometrics", "Relaxation"] },

  // AI x Corporate
  { title: "Recruitment Without Bias: How Dubai's HR Leaders are Using AI to Build Global Multi-National Teams", category: "AI x Corporate", keywords: ["HR Tech", "Diversity", "Talent Acquisition"] },
  { title: "Procurement DX: The AI Engines Slashing Supply Chain Costs for Free Zone Enterprises", category: "AI x Corporate", keywords: ["Supply Chain", "Procurement", "Efficiency"] },
  { title: "The Digital Twin Corporation: Modeling Your Entire Business Strategy Before Making a Single Move", category: "AI x Corporate", keywords: ["Strategy", "Simulation", "Decision Making"] },
  { title: "Crisis PR in the AI Era: Real-Time Sentiment Analysis for Protecting Your Brand in the Middle East", category: "AI x Corporate", keywords: ["Public Relations", "Crisis Management", "Monitoring"] },
  { title: "VAT Compliance 2.0: How AI Audits are Saving SMEs from Costly Legal Mistakes in the UAE", category: "AI x Corporate", keywords: ["VAT", "Compliance", "Legal Tech"] },
  { title: "The Autonomous Legal Clerk: How AI is Expediting Document Review in the Dubai International Courts", category: "AI x Corporate", keywords: ["DIFC Courts", "Legal Automation", "Efficiency"] }
];

function buildPremiumContent(title, keywords) {
  const kwList = keywords.join(", ");
  return `## ${title}\n\nIn the ultra-competitive landscape of Dubai's business ecosystem, the integration of high-precision Artificial Intelligence is no longer just a trend—it is the baseline for excellence. This editorial explores how **${title}** is redefining the status quo and providing forward-thinking leaders with a decisive edge.\n\n### The Strategic Context\nDubai has always been a city of 'firsts' and 'fastest.' From the iconic skyline to the D33 economic agenda, the ambition of the UAE is matched only by its technical prowess. At the heart of this transformation is the strategic application of AI to solve real-world business challenges. Whether it is in the luxury boutiques of Dubai Mall or the high-frequency trading floors of the DIFC, the focus on **${kwList}** is driving a new era of productivity and ROI.\n\n### Key Editorial Insights:\n- **The Innovation Curve**: How this specific development leverages state-of-the-art models like Sora, GPT-4, or Claude 3.5 to deliver unprecedented value.\n- **Operational Excellence**: The specific tactical shifts required to integrate these tools into existing corporate cultures without disruption.\n- **The Future Outlook**: Why **${title}** is just the tip of the iceberg in a decade that will be defined by 'Intelligence-as-a-Service.'\n\n### Implementation Tactic for Business Leaders\nTo capitalize on this movement, we recommend a 'Pilot-First' approach. Instead of a massive, organization-wide overhaul, start with a high-impact, low-friction project that demonstrates immediate value. This builds trust with stakeholders and allows for rapid iteration based on local data. In the UAE market, speed of execution is your greatest asset. By focusing on **${kwList}**, you are not just adopting technology; you are building a resilient, future-proof foundation for your enterprise.\n\n### Conclusion\nAs we look toward 2030, the line between technology and business strategy will continue to blur. Reports like **${title}** serve as your essential briefing for navigating this complex but rewarding terrain. mirAIreach will continue to provide deep-dive analysis on the intersections of AI and regional business excellence, ensuring our audience remains at the forefront of the global digital economy.`;
}

async function main() {
  await loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) throw new Error("Missing config");

  // STEP 1: Delete formulaic garbage
  const formulaicKeywords = [
    "Fundamentals and Practical Applications",
    "How to Automate 50%",
    "Cost Reduction Strategies",
    "A Fail-Safe Implementation",
    "Latest Updates and Business Impact",
    "Advanced Marketing Tactics"
  ];

  console.log("🧹  CLEANING UP FORMULAIC CONTENT...");
  
  let totalDeleted = 0;
  for (const kw of formulaicKeywords) {
    const res = await fetch(`${url}/rest/v1/articles?title=like.*${encodeURIComponent(kw)}*`, {
      method: "DELETE",
      headers: { apikey: key, Authorization: `Bearer ${key}` }
    });
    if (res.ok) {
      console.log(`✅ Cleaned up articles containing: "${kw}"`);
      totalDeleted++;
    }
  }

  // STEP 2 & 3: Insert Premium Content
  console.log("💎  INJECTING 30 PREMIUM EDITORIAL ARTICLES...");

  let totalAdded = 0;
  for (let i = 0; i < PREMIUM_ARTICLES.length; i++) {
    const art = PREMIUM_ARTICLES[i];
    const content = buildPremiumContent(art.title, art.keywords);
    
    const payload = {
      category: art.category,
      title: art.title,
      excerpt: `An exclusive editorial on ${art.title} and its impact on the UAE's high-end business sector.`,
      content: content,
      content_ar: `[Premium Editorial (Arabic): ${art.title}]`,
      source_name: "mirAIreach Editorial",
      image_url: `https://picsum.photos/seed/premium-${Date.now()}-${i}/800/600`,
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
      totalAdded++;
    } else {
      console.error(`\n❌ Failed: ${art.title}`);
    }
  }

  console.log(`\n\n✨ Done! Removed old patterns and added ${totalAdded} premium editorials.`);
}

main();
