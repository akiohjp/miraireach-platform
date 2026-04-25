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
const CATEGORIES = ["F&B", "Retail", "AI Marketing", "Real Estate", "Tech & Innovation"];

const IMAGE_POOLS = {
  "F&B": [
    "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"
  ],
  "Retail": [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1581515323683-0bd9fdfd7cf0?auto=format&fit=crop&w=1600&q=80"
  ],
  "AI Marketing": [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1533750349088-cd071a92f430?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80"
  ],
  "Real Estate": [
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1577002620719-f027878d6b88?auto=format&fit=crop&w=1600&q=80"
  ],
  "Tech & Innovation": [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80"
  ]
};

const baseTemplates = {
  "F&B": {
    title: "Multi-Brand Cloud Kitchen Expansion: Precision Analytics",
    title_ar: "توسع المطابخ السحابية متعددة العلامات التجارية: التحليلات الدقيقة",
    excerpt: "How cloud kitchens in Dubai can scale while preserving margin and quality through operational AI.",
    excerpt_ar: "كيف يمكن للمطابخ السحابية في دبي التوسع مع الحفاظ على الهامش والجودة من خلال الذكاء الاصطناعي التشغيلي.",
    content: "## The F&B Transformation\n\nDubai's F&B sector is shifting towards hyper-optimized delivery models. By analyzing vast amounts of consumer data, ghost kitchens can predict demand down to the hour.\n\n## Cost Optimization\nIntegrating supply chain AI reduces food waste by up to 35%, drastically improving unit economics in a highly competitive market.",
    content_ar: "## تحول قطاع الأغذية والمشروبات\n\nيشهد قطاع الأغذية والمشروبات في دبي تحولاً نحو نماذج التوصيل فائقة التحسين. من خلال تحليل كميات هائلة من بيانات المستهلكين، يمكن للمطابخ السحابية التنبؤ بالطلب بدقة تصل إلى الساعة.\n\n## تحسين التكاليف\nيؤدي دمج الذكاء الاصطناعي في سلاسل التوريد إلى تقليل هدر الطعام بنسبة تصل إلى 35٪، مما يحسن اقتصاديات الوحدة بشكل كبير في سوق شديد التنافسية."
  },
  "Retail": {
    title: "Omnichannel Personalization in UAE's Luxury Retail",
    title_ar: "التخصيص متعدد القنوات في تجارة التجزئة الفاخرة في الإمارات",
    excerpt: "Redefining the shopping experience by bridging offline boutiques and digital platforms.",
    excerpt_ar: "إعادة تعريف تجربة التسوق من خلال الربط بين المتاجر التقليدية والمنصات الرقمية.",
    content: "## The New Luxury Standard\n\nConsumers expect seamless transitions between Instagram discovery, WhatsApp concierge services, and VIP in-store experiences. \n\n## AI in Clienteling\nRetailers are deploying AI to track micro-preferences, allowing sales associates to act as hyper-informed personal shoppers, increasing AOV (Average Order Value) significantly.",
    content_ar: "## المعيار الجديد للفخامة\n\nيتوقع المستهلكون انتقالات سلسة بين الاكتشاف عبر Instagram، وخدمات الكونسيرج عبر WhatsApp، وتجارب الشخصيات الهامة داخل المتجر.\n\n## الذكاء الاصطناعي في خدمة العملاء\nيقوم تجار التجزئة بنشر الذكاء الاصطناعي لتتبع التفضيلات الدقيقة، مما يسمح لموظفي المبيعات بالعمل كمتسوقين شخصيين مطلعين للغاية، مما يزيد من متوسط قيمة الطلب (AOV) بشكل كبير."
  },
  "AI Marketing": {
    title: "Enterprise AI Marketing: From Search to Answer Engines",
    title_ar: "تسويق الذكاء الاصطناعي للمؤسسات: من البحث إلى محركات الإجابة",
    excerpt: "Optimizing for LLMs is the new frontier for B2B lead generation in the GCC.",
    excerpt_ar: "يعد التحسين لنماذج اللغات الكبيرة (LLMs) هو الحدود الجديدة لجذب العملاء المحتملين في دول مجلس التعاون الخليجي.",
    content: "## The Shift to AIO\n\nTraditional SEO is losing ground to Answer Engine Optimization (AIO). B2B buyers now use AI tools to generate vendor shortlists.\n\n## Data Structuring\nCompanies must structure their content as entities that LLMs can easily ingest. This requires a fundamental shift from keyword stuffing to deep, authoritative knowledge graphs.",
    content_ar: "## التحول إلى AIO\n\nيفقد تحسين محركات البحث التقليدي (SEO) مكانته لصالح تحسين محركات الإجابة (AIO). يستخدم مشتري B2B الآن أدوات الذكاء الاصطناعي لإنشاء قوائم مختصرة للموردين.\n\n## هيكلة البيانات\nيجب على الشركات هيكلة محتواها ككيانات يمكن لنماذج اللغات الكبيرة استيعابها بسهولة. يتطلب ذلك تحولاً جوهرياً من حشو الكلمات الرئيسية إلى الرسوم البيانية للمعرفة العميقة والموثوقة."
  },
  "Real Estate": {
    title: "PropTech 2026: Predictive Pricing Models in Dubai",
    title_ar: "بروبتيك 2026: نماذج التسعير التنبؤية في دبي",
    excerpt: "How machine learning is bringing unprecedented transparency to UAE property valuations.",
    excerpt_ar: "كيف يجلب التعلم الآلي شفافية غير مسبوقة لتقييم العقارات في الإمارات.",
    content: "## Data-Driven Real Estate\n\nOff-plan and secondary market pricing is increasingly dictated by algorithmic models that analyze global capital flows, local infrastructure developments, and historical yields.\n\n## Investor Confidence\nThis transparency attracts institutional investors who rely on quantified risk models, stabilizing a historically volatile asset class.",
    content_ar: "## العقارات القائمة على البيانات\n\nيتم تحديد أسعار السوق على الخارطة والسوق الثانوية بشكل متزايد من خلال النماذج الخوارزمية التي تحلل تدفقات رأس المال العالمية، وتطورات البنية التحتية المحلية، والعوائد التاريخية.\n\n## ثقة المستثمر\nتجذب هذه الشفافية المستثمرين المؤسسيين الذين يعتمدون على نماذج المخاطر الكمية، مما يؤدي إلى استقرار فئة الأصول التي كانت متقلبة تاريخياً."
  },
  "Tech & Innovation": {
    title: "Automating the Enterprise: RPA and Generative AI Synergy",
    title_ar: "أتمتة المؤسسات: التآزر بين RPA والذكاء الاصطناعي التوليدي",
    excerpt: "Combining robotic process automation with LLMs to eliminate back-office friction.",
    excerpt_ar: "الجمع بين أتمتة العمليات الروبوتية ونماذج اللغات الكبيرة للقضاء على احتكاك المكاتب الخلفية.",
    content: "## Beyond Simple Scripts\n\nWhile RPA handles structured, repetitive tasks, generative AI brings cognitive capabilities to unstructured data processing like contracts and customer emails.\n\n## The Autonomous Enterprise\nThis synergy paves the way for the autonomous enterprise, reducing operational overhead in Dubai free zones by up to 40%.",
    content_ar: "## ما وراء النصوص البرمجية البسيطة\n\nبينما تتعامل أتمتة العمليات الروبوتية (RPA) مع المهام الهيكلية والمتكررة، يوفر الذكاء الاصطناعي التوليدي قدرات معرفية لمعالجة البيانات غير الهيكلية مثل العقود ورسائل البريد الإلكتروني للعملاء.\n\n## المؤسسة المستقلة\nيمهد هذا التآزر الطريق للمؤسسة المستقلة، مما يقلل من النفقات التشغيلية في المناطق الحرة في دبي بنسبة تصل إلى 40٪."
  }
};

const modifiers = [
  { prefix: "Case Study: ", suffix: " in Practice", prefix_ar: "دراسة حالة: ", suffix_ar: " في الممارسة العملية" },
  { prefix: "Future Outlook: ", suffix: " Trends for 2026", prefix_ar: "آفاق مستقبلية: ", suffix_ar: " اتجاهات عام 2026" },
  { prefix: "Executive Brief: ", suffix: " Strategies", prefix_ar: "موجز تنفيذي: ", suffix_ar: " استراتيجيات" },
  { prefix: "Deep Dive: ", suffix: " Dynamics", prefix_ar: "تحليل عميق: ", suffix_ar: " ديناميكيات" },
  { prefix: "Report: ", suffix: " Analysis", prefix_ar: "تقرير: ", suffix_ar: " تحليل" }
];

function generateArticles(count = 25) {
  const articles = [];
  const msInDay = 24 * 60 * 60 * 1000;
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const template = baseTemplates[category];
    const modifier = modifiers[Math.floor(i / CATEGORIES.length) % modifiers.length];
    
    // Pick random image
    const images = IMAGE_POOLS[category];
    const imageUrl = images[i % images.length];

    articles.push({
      category: category,
      title: `${modifier.prefix}${template.title}${modifier.suffix}`,
      title_ar: `${modifier.prefix_ar}${template.title_ar}${modifier.suffix_ar}`,
      excerpt: template.excerpt,
      excerpt_ar: template.excerpt_ar,
      content: `# ${modifier.prefix}${template.title}\n\n${template.content}`,
      content_ar: `# ${modifier.prefix_ar}${template.title_ar}\n\n${template.content_ar}`,
      source_name: "mirAIreach Research",
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

async function main() {
  await loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
  }

  console.log("Generating 25 diverse bilingual (EN/AR) articles...");
  const newArticles = generateArticles(25);

  console.log("Attempting to insert into Supabase...");
  try {
    const inserted = await insertArticles(url, key, newArticles);
    console.log(`Successfully inserted ${inserted.length} articles!`);
  } catch (err) {
    console.error("\n========================================================");
    console.error("❌ DATABASE INSERTION FAILED");
    console.error("========================================================");
    if (err.message.includes("42703") || err.message.includes("column articles.title_ar does not exist")) {
      console.error("\n[CRITICAL ERROR] The Arabic columns (title_ar, excerpt_ar, content_ar) DO NOT EXIST in your Supabase database.");
      console.error("Please run the following SQL command in your Supabase SQL Editor:");
      console.error(`
      ALTER TABLE articles 
      ADD COLUMN title_ar text,
      ADD COLUMN excerpt_ar text,
      ADD COLUMN content_ar text;
      `);
      console.error("\nAfter running the SQL, run this script again.");
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
