import { readFile } from "node:fs/promises";
import path from "node:path";

async function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
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
}

// 5 base categories and their respective image pools
const CATEGORIES = [
  "AI & Deep Tech",
  "F&B & Hospitality",
  "Real Estate & PropTech",
  "FinTech & Crypto",
  "Logistics & Supply Chain",
  "Retail & E-commerce",
  "Marketing Tech",
  "Smart City & GovTech",
  "Energy & Sustainability"
];

const COMPANIES = [
  "mirAIreach Solutions", "Dubai Digital Hub", "Emirates FinTech Group", 
  "Nexus PropTech", "Global Logistics AI", "Desert Retail Corp",
  "Burj Hospitality", "DIFC Innovations", "Palm Tech Ventures", "Zabeel Data Systems",
  "Masdar City Tech", "Jumeirah Tech Labs", "Al Maktoum Logistics", "Silicon Oasis AI"
];

const IMAGE_POOLS = {
  "AI & Deep Tech": [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80"
  ],
  "F&B & Hospitality": [
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80"
  ],
  "Real Estate & PropTech": [
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1600&q=80"
  ],
  "FinTech & Crypto": [
    "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1518186239751-2477cf41d49e?auto=format&fit=crop&w=1600&q=80"
  ],
  "Logistics & Supply Chain": [
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1521331015254-184518349272?auto=format&fit=crop&w=1600&q=80"
  ],
  "Retail & E-commerce": [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?auto=format&fit=crop&w=1600&q=80"
  ],
  "Marketing Tech": [
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80"
  ],
  "Smart City & GovTech": [
    "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1600&q=80"
  ],
  "Energy & Sustainability": [
    "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1466611653911-954ffea1127b?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=1600&q=80"
  ]
};

const baseTemplates = {
  "AI & Deep Tech": {
    title: "Sovereign AI Infrastructure: The Next Frontier for UAE Enterprises",
    title_ar: "البنية التحتية السيادية للذكاء الاصطناعي: الحدود التالية للمؤسسات الإماراتية",
    excerpt: "Strategic report on the transition from global cloud dependence to localized, high-security LLM clusters within Dubai.",
    excerpt_ar: "تقرير استراتيجي حول الانتقال من الاعتماد العالمي على السحابة إلى مجموعات نماذج لغوية كبيرة محلية عالية الأمان داخل دبي.",
    content: `## FOR IMMEDIATE RELEASE\n\n**DUBAI, UAE** — The move toward "Sovereign AI" is accelerating. Leading enterprises are now investing in private data clusters to ensure regulatory compliance and IP protection.\n\n### Strategic Pillars\n- **Data Localization**: Storing and processing sensitive B2B data within the UAE.\n- **Custom LLMs**: Training models on regional business contexts and specialized legal frameworks.\n- **Efficiency Gains**: Projected 45% reduction in administrative overhead by 2027.\n\n**Market Analysis**: This shift is driven by the 2026 Digital Economy Mandate, aiming to position Dubai as the most AI-ready city globally.`,
    content_ar: `## للنشر الفوري\n\n**دبي، الإمارات العربية المتحدة** — يتسارع التحول نحو "الذكاء الاصطناعي السيادي". تستثمر المؤسسات الرائدة الآن في مجموعات بيانات خاصة لضمان الامتثال التنظيمي وحماية الملكية الفكرية.\n\n### الركائز الاستراتيجية\n- **توطين البيانات**: تخزين ومعالجة البيانات الحساسة بين الشركات داخل الإمارات.\n- **نماذج اللغات الكبيرة المخصصة**: تدريب النماذج على سياقات الأعمال الإقليمية والأطر القانونية المتخصصة.\n- **مكاسب الكفاءة**: انخفاض متوقع بنسبة 45٪ في النفقات الإدارية بحلول عام 2027.\n\n**تحليل السوق**: هذا التحول مدفوع بتفويض الاقتصاد الرقمي لعام 2026، والذي يهدف إلى ترسيخ مكانة دبي كأكثر مدن العالم استعداداً للذكاء الاصطناعي.`
  },
  "F&B & Hospitality": {
    title: "The Zero-Waste Kitchen: AI-Powered Sustainability in Dubai's Luxury Dining",
    title_ar: "مطبخ بلا نفايات: الاستدامة المدعومة بالذكاء الاصطناعي في المطاعم الفاخرة بدبي",
    excerpt: "Official announcement regarding the integration of predictive supply chain AI across the Jumeirah hospitality portfolio.",
    excerpt_ar: "إعلان رسمي بخصوص تكامل الذكاء الاصطناعي التنبؤي لسلسلة التوريد عبر محفظة جميرا للضيافة.",
    content: `## Press Release\n\n**DUBAI, UAE** — Jumeirah's latest sustainability initiative leverages Edge AI to monitor kitchen waste in real-time, targeting a 50% reduction in carbon footprint by Q4 2026.\n\n### Key Metrics\n- **Waste Reduction**: 35% improvement in perishable inventory turnover.\n- **Cost Efficiency**: 12% increase in net margins through algorithmic procurement.\n- **Guest Impact**: Transparent sustainability metrics shared via QR on every menu.\n\n**Vision**: Leading the global hospitality sector toward a data-driven, circular economy.`,
    content_ar: `## بيان صحفي\n\n**دبي، الإمارات العربية المتحدة** — تستفيد أحدث مبادرات الاستدامة في جميرا من ذكاء الحافة الاصطناعي لمراقبة نفايات المطبخ في الوقت الفعلي، مستهدفة خفض البصمة الكربونية بنسبة 50٪ بحلول الربع الرابع من عام 2026.\n\n### المقاييس الرئيسية\n- **تقليل الهدر**: تحسن بنسبة 35٪ في دوران المخزون القابل للتلف.\n- **كفاءة التكلفة**: زيادة بنسبة 12٪ في صافي الهوامش من خلال المشتريات الخوارزمية.\n- **تأثير الضيوف**: مشاركة مقاييس الاستدامة الشفافة عبر رموز QR في كل قائمة طعام.\n\n**الرؤية**: قيادة قطاع الضيافة العالمي نحو اقتصاد دائري قائم على البيانات.`
  },
  "Marketing Tech": {
    title: "The AIO Era: Why Generative Search is Replacing Traditional SEO in the GCC",
    title_ar: "عصر AIO: لماذا يحل البحث التوليدي محل تحسين محركات البحث التقليدي في دول مجلس التعاون الخليجي",
    excerpt: "Technical brief on the rise of Answer Engine Optimization (AIO) and the decline of the traditional search results page.",
    excerpt_ar: "موجز تقني حول صعود تحسين محركات الإجابة (AIO) وتراجع صفحة نتائج البحث التقليدية.",
    content: `## Strategic Insight\n\n**DUBAI, UAE** — B2B marketing is undergoing a seismic shift. In 2026, 60% of product research begins with a chat-based AI assistant. Brands must now optimize for "Entity Recognition" rather than just "Keywords".\n\n### AIO Implementation Strategy\n1. **Structured Data**: Wrapping content in LLM-readable schemas.\n2. **Authority Building**: Securing citations in major AI knowledge graphs.\n3. **Conversational Nuance**: Creating content that answers "How" and "Why" instead of just "What".\n\n**Forward Outlook**: Brands failing to adapt to AIO risk complete invisibility in the next 18 months.`,
    content_ar: `## رؤية استراتيجية\n\n**دبي، الإمارات العربية المتحدة** — يشهد التسويق بين الشركات تحولاً زلزالياً. في عام 2026، سيبدأ 60٪ من أبحاث المنتجات بمساعد ذكاء اصطناعي قائم على الدردشة. يجب على العلامات التجارية الآن التحسين لـ "التعرف على الكيانات" بدلاً من مجرد "الكلمات الرئيسية".\n\n### استراتيجية تنفيذ AIO\n1. **البيانات المهيكلة**: تغليف المحتوى في مخططات قابلة للقراءة بواسطة نماذج اللغات الكبيرة.\n2. **بناء السلطة**: تأمين الاستشهادات في الرسوم البيانية الكبرى للمعرفة بالذكاء الاصطناعي.\n3. **الفروق الدقيقة في المحادثة**: إنشاء محتوى يجيب على "كيف" و"لماذا" بدلاً من مجرد "ماذا".\n\n**آفاق مستقبلية**: العلامات التجارية التي تفشل في التكيف مع AIO تخاطر بالاختفاء التام في الأشهر الـ 18 القادمة.`
  }
};

const modifiers = [
  { prefix: "Strategic Analysis: ", suffix: " — Global Report", prefix_ar: "تحليل استراتيجي: ", suffix_ar: " — تقرير عالمي" },
  { prefix: "Executive Brief: ", suffix: " for B2B Leaders", prefix_ar: "موجز تنفيذي: ", suffix_ar: " لقادة B2B" },
  { prefix: "Market Intelligence: ", suffix: " (Q4 2026)", prefix_ar: "استخبارات السوق: ", suffix_ar: " (الربع الرابع 2026)" },
  { prefix: "Official Release: ", suffix: " — Dubai Update", prefix_ar: "إصدار رسمي: ", suffix_ar: " — تحديث دبي" },
  { prefix: "Future Forecast: ", suffix: " Standards", prefix_ar: "توقعات المستقبل: ", suffix_ar: " معايير" }
];

function generateArticles(count = 50) {
  const articles = [];
  const msInDay = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const templateKeys = Object.keys(baseTemplates);

  for (let i = 0; i < count; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const template = baseTemplates[category] || baseTemplates["AI & Deep Tech"]; // Fallback
    const modifier = modifiers[Math.floor(i / CATEGORIES.length) % modifiers.length];
    const company = COMPANIES[i % COMPANIES.length];
    
    // Pick random image
    const images = IMAGE_POOLS[category] || IMAGE_POOLS["AI & Deep Tech"];
    const imageUrl = images[i % images.length];

    articles.push({
      category: category,
      title: `${modifier.prefix}${template.title}${modifier.suffix}`,
      title_ar: `${modifier.prefix_ar}${template.title_ar}${modifier.suffix_ar}`,
      excerpt: template.excerpt,
      excerpt_ar: template.excerpt_ar,
      content: `# ${modifier.prefix}${template.title}\n\n${template.content}`,
      content_ar: `# ${modifier.prefix_ar}${template.title_ar}\n\n${template.content_ar}`,
      source_name: "mirAIreach Press",
      company_name: company,
      image_url: imageUrl,
      is_published: true,
      created_at: new Date(now - i * 2 * msInDay).toISOString(),
    });
  }
  return articles;
}





async function insertArticles(url, key, articles) {
  const response = await fetch(`${url}/rest/v1/articles`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(articles),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to insert articles: ${response.status} ${body}`);
  }

  return response.json();
}

async function deleteAllArticles(url, key) {
  console.log("Cleaning up existing articles...");
  // Use a filter that matches all rows to satisfy PostgREST's requirement for a WHERE clause
  const response = await fetch(`${url}/rest/v1/articles?id=neq.-1`, {
    method: "DELETE",

    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
    },
  });

  if (!response.ok && response.status !== 404) {
    const body = await response.text();
    console.warn(`Cleanup warning: ${response.status} ${body}`);
  }
}

async function main() {
  await loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
  }

  // 1. Cleanup
  await deleteAllArticles(url, key);

  // 2. Generate
  console.log("Generating 50 diverse bilingual (EN/AR) premium articles...");
  const newArticles = generateArticles(50);

  // 3. Insert
  console.log("Attempting to insert into Supabase...");
  try {
    const inserted = await insertArticles(url, key, newArticles);
    console.log(`Successfully inserted ${inserted.length} articles!`);
  } catch (err) {
    console.error("\n========================================================");
    console.error("❌ DATABASE INSERTION FAILED");
    console.error("========================================================");
    if (err.message.includes("42703") || err.message.includes("column articles.title_ar does not exist")) {
      console.error("\n[CRITICAL ERROR] Database schema mismatch.");
      console.error("Please run the SQL cleanup provided in implementation_plan.md.");
    } else {
      console.error(err.message);
    }
    console.error("========================================================\n");
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

