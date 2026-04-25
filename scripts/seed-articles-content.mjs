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
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80"
  ],
  "Retail": [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1600&q=80"
  ],
  "AI Marketing": [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1531746790731-6c087fecd05a?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80"
  ],
  "Real Estate": [
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"
  ],
  "Tech & Innovation": [
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80"
  ]
};

const baseTemplates = {
  "F&B": {
    title: "AI-Driven Operational Excellence in Dubai's F&B Sector",
    title_ar: "التميز التشغيلي القائم على الذكاء الاصطناعي في قطاع الأغذية والمشروبات في دبي",
    excerpt: "Exploring how deep-learning algorithms are revolutionizing inventory management and customer sentiment analysis for top-tier restaurants.",
    excerpt_ar: "استكشاف كيف تحدث خوارزميات التعلم العميق ثورة في إدارة المخزون وتحليل مشاعر العملاء للمطاعم رفيعة المستوى.",
    content: "## The Intelligence Era\n\nDubai's competitive dining landscape now requires more than just great food. AI is being used to predict table turnover and optimize staffing levels in real-time.\n\n## Waste Reduction\nSophisticated systems are now reducing back-of-house waste by 40% through predictive ordering, ensuring sustainability meets profitability.",
    content_ar: "## عصر الذكاء\n\nتتطلب بيئة المطاعم التنافسية في دبي الآن أكثر من مجرد طعام رائع. يتم استخدام الذكاء الاصطناعي للتنبؤ بدوران الطاولات وتحسين مستويات التوظيف في الوقت الفعلي.\n\n## تقليل النفايات\nتعمل الأنظمة المتطورة الآن على تقليل نفايات المطبخ بنسبة 40٪ من خلال الطلب التنبؤي، مما يضمن تلاقي الاستدامة مع الربحية."
  },
  "Retail": {
    title: "The Future of Phygital Retail in the GCC",
    title_ar: "مستقبل تجارة التجزئة 'فيجيتال' في دول مجلس التعاون الخليجي",
    excerpt: "Merging physical boutiques with digital precision to create the ultimate luxury shopping journey.",
    excerpt_ar: "دمج البوتيكات المادية مع الدقة الرقمية لخلق رحلة تسوق فاخرة مثالية.",
    content: "## Seamless Integration\n\nThe boundary between online and offline is blurring. Smart mirrors and AI stylists in Dubai Mall are redefining personal shopping.\n\n## Hyper-Personalization\nBy leveraging localized data, retailers can now offer bespoke experiences that cater to the unique preferences of the UAE's diverse demographic.",
    content_ar: "## التكامل السلس\n\nتتلاشى الحدود بين الإنترنت والواقع. المرايا الذكية ومنسقو الأزياء المعتمدون على الذكاء الاصطناعي في دبي مول يعيدون تعريف التسوق الشخصي.\n\n## التخصيص الفائق\nمن خلال الاستفادة من البيانات المحلية، يمكن لتجار التجزئة الآن تقديم تجارب مخصصة تلبي التفضيلات الفريدة للديموغرافية المتنوعة في دولة الإمارات العربية المتحدة."
  },
  "AI Marketing": {
    title: "B2B Marketing Automation: The AIO Revolution",
    title_ar: "أتمتة التسويق بين الشركات (B2B): ثورة تحسين محركات الإجابة (AIO)",
    excerpt: "Beyond SEO: How UAE enterprises are structuring data for the age of generative search.",
    excerpt_ar: "ما وراء تحسين محركات البحث: كيف تقوم الشركات في الإمارات بهيكلة البيانات لعصر البحث التوليدي.",
    content: "## From Keywords to Entities\n\nGenerative AI changes how buyers find information. Content must now be structured for LLM ingestion rather than simple search algorithms.\n\n## Authority Building\nEstablishing domain authority through deep-dive technical content is now the primary driver for high-quality lead generation in the Dubai tech ecosystem.",
    content_ar: "## من الكلمات الرئيسية إلى الكيانات\n\nيغير الذكاء الاصطناعي التوليدي كيفية عثور المشترين على المعلومات. يجب الآن هيكلة المحتوى لاستيعاب نماذج اللغات الكبيرة بدلاً من خوارزميات البحث البسيطة.\n\n## بناء السلطة\nيعد بناء سلطة المجال من خلال المحتوى التقني المتعمق الآن المحرك الرئيسي لجذب العملاء المحتملين عاليي الجودة في منظومة التكنولوجيا في دبي."
  },
  "Real Estate": {
    title: "PropTech 3.0: Algorithmic Valuations in Dubai Real Estate",
    title_ar: "بروبتيك 3.0: التقييمات الخوارزمية في عقارات دبي",
    excerpt: "How predictive modeling is stabilizing the secondary market and boosting institutional investor confidence.",
    excerpt_ar: "كيف يعمل النمذجة التنبؤية على استقرار السوق الثانوية وتعزيز ثقة المستثمرين المؤسسيين.",
    content: "## Data-Driven Decisions\n\nReal-time market analytics are replacing traditional appraisals, offering unprecedented transparency to global investors entering the Dubai market.\n\n## The New Standard\nBlockchain-enabled smart contracts combined with AI pricing models are setting a new global standard for real estate transactions in the UAE.",
    content_ar: "## القرارات القائمة على البيانات\n\nتحل تحليلات السوق في الوقت الفعلي محل التقييمات التقليدية، مما يوفر شفافية غير مسبوقة للمستثمرين العالميين الذين يدخلون سوق دبي.\n\n## المعيار الجديد\nتضع العقود الذكية الممكنة بالبلوكتشين، مقترنة بنماذج تسعير الذكاء الاصطناعي، معياراً عالمياً جديداً للمعاملات العقارية في دولة الإمارات العربية المتحدة."
  },
  "Tech & Innovation": {
    title: "Autonomous Enterprise: The Synergy of RPA and LLMs",
    title_ar: "المؤسسة المستقلة: التآزر بين RPA ونماذج اللغات الكبيرة",
    excerpt: "Eliminating back-office friction through cognitive automation in Dubai's leading free zones.",
    excerpt_ar: "القضاء على احتكاك المكاتب الخلفية من خلال الأتمتة المعرفية في المناطق الحرة الرائدة في دبي.",
    content: "## Beyond Scripted Automation\n\nCognitive agents are now handling complex unstructured data, from legal contract reviews to multi-lingual customer support.\n\n## Efficiency Gains\nFree zone enterprises are reporting up to 50% reduction in operational costs by deploying autonomous workflows that scale without increasing headcount.",
    content_ar: "## ما وراء الأتمتة المبرمجة\n\nتتعامل العوامل المعرفية الآن مع البيانات المعقدة غير الهيكلية، من مراجعة العقود القانونية إلى دعم العملاء متعدد اللغات.\n\n## مكاسب الكفاءة\nتسجل شركات المناطق الحرة انخفاضاً يصل إلى 50٪ في التكاليف التشغيلية من خلال نشر سير عمل مستقل يتوسع دون زيادة في عدد الموظفين."
  }
};

const modifiers = [
  { prefix: "Case Study: ", suffix: " in Practice", prefix_ar: "دراسة حالة: ", suffix_ar: " في الممارسة العملية" },
  { prefix: "Strategic Analysis: ", suffix: " 2026", prefix_ar: "تحليل استراتيجي: ", suffix_ar: " 2026" },
  { prefix: "Executive Brief: ", suffix: " Frameworks", prefix_ar: "موجز تنفيذي: ", suffix_ar: " أطر عمل" },
  { prefix: "Deep Dive: ", suffix: " Architectures", prefix_ar: "تحليل عميق: ", suffix_ar: " بنية هندسية" },
  { prefix: "Market Intelligence: ", suffix: " Trends", prefix_ar: "استخبارات السوق: ", suffix_ar: " اتجاهات" }
];

function generateArticles(count = 20) {
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
      created_at: new Date(now - i * 3 * msInDay).toISOString(), // Spread out over 2 months
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
  console.log("Generating 20 diverse bilingual (EN/AR) premium articles...");
  const newArticles = generateArticles(20);

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

