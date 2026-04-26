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
    console.warn("No .env.local found, using process.env");
  }
}

const TEMPLATES = [
  {
    category: "Gourmet & Dining",
    sources: ["Michelin Guide", "Gault&Millau UAE", "Time Out Dubai", "What's On Dubai"],
    topics: [
      "The Evolution of {Location} Gastronomy: {Year} Predictions",
      "Why {Chef} is Redefining {Style} Cuisine in {District}",
      "Sustainable Luxury: The Rise of {Trend} in Dubai's Best Kitchens",
      "Hidden Gems of {District}: Where the Locals Eat in {Year}",
      "The Science of {Ingredient}: Why Dubai is the New Capital of {Flavor}"
    ],
    districts: ["DIFC", "Jumeirah", "Palm Jumeirah", "Dubai Marina", "Old Dubai"],
    trends: ["Zero-Waste", "Farm-to-Table", "Molecular Gastronomy", "Emirati Fusion"],
    content_en: (topic) => `## The Strategic Evolution of Gastronomy\n\nDubai's journey to becoming a global food capital has reached a new peak in 2026. This report explores how ${topic} is shaping the industry. Strategic investment in supply chain resilience and culinary talent has created a unique ecosystem where luxury and innovation coexist.\n\n### Key Market Drivers\n- **Hyper-Local Sourcing**: 80% of top-tier restaurants now use UAE-grown vertical farm produce.\n- **Tech-Enabled Service**: AI-driven guest preference tracking for hyper-personalized experiences.\n- **Sustainability Mandate**: The move toward circular economy practices in high-end dining.\n\n### AI Market Insight\nPredictive analytics is now allowing restaurateurs to forecast peak demand with 95% accuracy, significantly reducing labor costs and food waste.`,
    content_ar: (topic) => `## التطور الاستراتيجي لفنون الطهي\n\nوصلت رحلة دبي لتصبح عاصمة عالمية للغذاء إلى ذروة جديدة في عام 2026. يستكشف هذا التقرير كيف يشكل "${topic}" الصناعة. أدى الاستثمار الاستراتيجي في مرونة سلسلة التوريد والمواهب الطهوية إلى إنشاء نظام بيئي فريد يتعايش فيه الفخامة والابتكار.\n\n### محركات السوق الرئيسية\n- **المصادر المحلية للغاية**: 80٪ من المطاعم رفيعة المستوى تستخدم الآن محاصيل المزارع العمودية المزروعة في الإمارات.\n- **الخدمة المدعومة بالتكنولوجيا**: تتبع تفضيلات الضيوف المدفوع بالذكاء الاصطناعي لتجارب شخصية للغاية.\n- **تفويض الاستدامة**: التحول نحو ممارسات الاقتصاد الدائري في المطاعم الراقية.\n\n### رؤية سوق الذكاء الاصطناعي\nتسمح التحليلات التنبؤية الآن لأصحاب المطاعم بالتنبؤ بذروة الطلب بدقة 95٪، مما يقلل بشكل كبير من تكاليف العمالة وهدر الطعام.`
  },
  {
    category: "AI & Deep Tech",
    sources: ["TechCrunch ME", "Arabian Business", "Forbes Middle East", "Entrepreneur ME"],
    topics: [
      "Sovereign AI: Why the UAE is Building its Own {Tech} Stack",
      "The {Industry} Revolution: How AI is Transforming {Sector} in Dubai",
      "Quantum Leap: The Future of {Tech} in the GCC for {Year}",
      "Robotic {Workforce}: The Automation of Dubai's {Sector}",
      "Ethical AI: Navigating the Governance of {Tech} in the Middle East"
    ],
    sectors: ["Logistics", "Real Estate", "Healthcare", "Finance", "Energy"],
    techs: ["LLM", "Blockchain", "Quantum Computing", "Generative AI", "Edge Computing"],
    content_en: (topic) => `## The Technological Frontier of the GCC\n\nThe UAE has positioned itself as a global laboratory for deep tech. In 2026, ${topic} has moved from speculative research to enterprise-scale deployment. This transformation is backed by a robust regulatory framework and world-class digital infrastructure.\n\n### Strategic Pillars of Tech Growth\n- **Data Sovereignty**: Ensuring localized compute for sensitive enterprise workloads.\n- **Talent Migration**: Dubai is now a top-3 destination for global AI engineers.\n- **Public-Private Synergy**: Government-backed sandboxes for rapid tech iteration.\n\n### AI Market Insight\nThe convergence of AI and specialized regional data is creating a new class of 'Middle Eastern LLMs' that outperform global general-purpose models in local contexts.`,
    content_ar: (topic) => `## الحدود التكنولوجية لدول مجلس التعاون الخليجي\n\nوضعت الإمارات نفسها كمختبر عالمي للتكنولوجيا العميقة. في عام 2026، انتقل "${topic}" من البحث المضاربي إلى النشر على نطاق المؤسسات. هذا التحول مدعوم بإطار تنظيمي قوي وبنية تحتية رقمية عالمية المستوى.\n\n### الركائز الاستراتيجية لنمو التكنولوجيا\n- **سيادة البيانات**: ضمان الحوسبة المحلية لأحمال عمل المؤسسات الحساسة.\n- **هجرة المواهب**: تعد دبي الآن من بين أفضل 3 وجهات لمهندسي الذكاء الاصطناعي العالميين.\n- **التآزر بين القطاعين العام والخاص**: صناديق رمال مدعومة من الحكومة لتكرار التكنولوجيا السريع.\n\n### رؤية سوق الذكاء الاصطناعي\nيؤدي تقارب الذكاء الاصطناعي والبيانات الإقليمية المتخصصة إلى إنشاء فئة جديدة من "نماذج اللغات الكبيرة الشرق أوسطية" التي تتفوق على النماذج العالمية العامة في السياقات المحلية.`
  },
  {
    category: "Lifestyle & Travel",
    sources: ["Condé Nast Traveller ME", "Time Out Dubai", "What's On Dubai", "Lifestyle ME"],
    topics: [
      "The Future of {Style} Travel: Why {Location} is the New {Reference}",
      "Wellness 2.0: The Rise of {Trend} in Dubai's Luxury Spas",
      "Beyond the Skyscrapers: Exploring the Hidden {Feature} of {Location}",
      "The Art of the Staycation: Why {Hotel} is Redefining Luxury in {Year}",
      "Sustainable Adventure: How to Experience {Location} with Zero Footprint"
    ],
    locations: ["Hatta", "Al Ain", "Ras Al Khaimah", "Palm Jumeirah", "The Desert"],
    styles: ["Regenerative", "Ultra-Luxury", "Eco-Conscious", "Adventure", "Digital Detox"],
    content_en: (topic) => `## Reimagining Luxury Travel in the Middle East\n\nThe definition of luxury is shifting from material excess to meaningful experience. In 2026, ${topic} has become the primary driver for high-net-worth travelers visiting the UAE. This report examines the economic and cultural impact of this shift.\n\n### Strategic Travel Trends\n- **Regenerative Hospitality**: Resorts that leave the environment better than they found it.\n- **Cultural Immersion**: Moving beyond the beach to engage with Emirati heritage and desert ecology.\n- **Hyper-Personalization**: AI-driven travel concierges that predict and fulfill every guest need.\n\n### AI Market Insight\nPredictive travel algorithms are now being used to manage tourist flows in fragile eco-zones, ensuring that growth does not compromise sustainability.`,
    content_ar: (topic) => `## إعادة تصور السفر الفاخر في الشرق الأوسط\n\nيتغير تعريف الفخامة من الإفراط المادي إلى التجربة الهادفة. في عام 2026، أصبح "${topic}" هو المحرك الأساسي للمسافرين من ذوي الثروات العالية الذين يزورون الإمارات. يتناول هذا التقرير التأثير الاقتصادي والثقافي لهذا التحول.\n\n### توجهات السفر الاستراتيجية\n- **الضيافة التجديدية**: منتجعات تترك البيئة أفضل مما وجدتها.\n- **الانغماس الثقافي**: الانتقال إلى ما هو أبعد من الشاطئ للتفاعل مع التراث الإماراتي وبيئة الصحراء.\n- **التخصيص الفائق**: موظفو استقبال سفر مدفوعون بالذكاء الاصطناعي يتوقعون ويلبون كل احتياجات الضيوف.\n\n### رؤية سوق الذكاء الاصطناعي\nيتم استخدام خوارزميات السفر التنبؤية الآن لإدارة تدفقات السياح في المناطق البيئية الهشة، مما يضمن أن النمو لا يضر بالاستدامة.`
  }
];

const IMAGES = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
  "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b",
  "https://images.unsplash.com/photo-1677442136019-21780ecad995",
  "https://images.unsplash.com/photo-1582407947304-fd86f028f716",
  "https://images.unsplash.com/photo-1621761191319-c6fb62004040",
  "https://images.unsplash.com/photo-1559339352-11d035aa65de",
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d"
];

async function main() {
  await loadEnv();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) throw new Error("Missing config");

  console.log(`🚀 GENERATING 50 UNIQUE PREMIUM ARTICLES... (Append-only)`);

  let count = 0;
  for (let i = 0; i < 50; i++) {
    const template = TEMPLATES[i % TEMPLATES.length];
    const source = template.sources[Math.floor(Math.random() * template.sources.length)];
    let topic = template.topics[Math.floor(Math.random() * template.topics.length)];
    
    // Replace placeholders
    topic = topic.replace("{Location}", template.locations?.[Math.floor(Math.random() * template.locations?.length)] || "Dubai");
    topic = topic.replace("{District}", template.districts?.[Math.floor(Math.random() * template.districts?.length)] || "DIFC");
    topic = topic.replace("{Trend}", template.trends?.[Math.floor(Math.random() * template.trends?.length)] || "Sustainability");
    topic = topic.replace("{Sector}", template.sectors?.[Math.floor(Math.random() * template.sectors?.length)] || "Tech");
    topic = topic.replace("{Tech}", template.techs?.[Math.floor(Math.random() * template.techs?.length)] || "AI");
    topic = topic.replace("{Year}", "2026");
    topic = topic.replace("{Chef}", ["Chef Himanshu", "Chef Gregoire", "Chef Akmal"].sort(() => 0.5 - Math.random())[0]);

    const title = topic;
    const title_ar = `تقرير استراتيجي: ${topic}`; // Mock AR title translation for bulk

    const CATEGORY_KEYWORDS = {
      "Gourmet & Dining": "fine-dining,restaurant,food",
      "AI & Deep Tech": "artificial-intelligence,technology,robot",
      "Lifestyle & Travel": "luxury-travel,hotel,lifestyle",
      "Business & Technology": "business,corporate,technology",
      "FinTech & Crypto": "finance,cryptocurrency,bitcoin",
      "Real Estate & PropTech": "architecture,skyscraper,real-estate",
      "Logistics & Supply Chain": "logistics,shipping,cargo",
      "Food & Culture": "emirati-food,heritage,culture"
    };
    const keyword = CATEGORY_KEYWORDS[template.category] || "dubai,luxury";

    const payload = {
      category: template.category,
      source_name: source,
      title: title,
      title_ar: title_ar,
      excerpt: `Strategic deep dive into ${topic} and its impact on the UAE market.`,
      excerpt_ar: `نظرة استراتيجية عميقة في ${topic} وتأثيرها على سوق الإمارات العربية المتحدة.`,
      content: template.content_en(topic),
      content_ar: template.content_ar(topic),
      image_url: `https://images.unsplash.com/featured/?${encodeURIComponent(keyword)}&sig=${Date.now()}_${Math.random().toString(36).substring(7)}`,
      is_published: true,
      is_curated: true,
      created_at: new Date().toISOString()
    };

    const res = await fetch(`${supabaseUrl}/rest/v1/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": supabaseKey, "Authorization": `Bearer ${supabaseKey}` },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      process.stdout.write(".");
      count++;
    } else {
      process.stdout.write("x");
    }
    
    if ((i + 1) % 10 === 0) console.log(` [${i+1}/50]`);
  }

  console.log(`\n\n✨ BATCH UPDATE COMPLETE. ${count} ARTICLES ADDED.`);
}

main();
