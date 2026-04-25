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
  "AI Marketing": {
    title: "The Strategic Blueprint for AIO: Navigating the Generative Search Era in the UAE",
    title_ar: "المخطط الاستراتيجي لتحسين محركات الإجابة (AIO): الملاحة في عصر البحث التوليدي في الإمارات",
    excerpt: "A comprehensive analysis of how Dubai-based enterprises must restructure their digital footprint to remain visible in a world dominated by LLMs and Answer Engines.",
    excerpt_ar: "تحليل شامل لكيفية قيام الشركات التي تتخذ من دبي مقراً لها بإعادة هيكلة بصمتها الرقمية لتبقى مرئية في عالم تهيمن عليه نماذج اللغات الكبيرة ومحركات الإجابة.",
    content: `## The Paradigm Shift: From Keywords to Entities\n\nTraditional SEO is no longer sufficient. In 2026, the UAE's digital landscape is defined by **Answer Engine Optimization (AIO)**. Major players in Dubai are shifting their budgets from broad search terms to structured entity data.\n\n### Key Market Dynamics\n1. **LLM Dominance**: Over 65% of B2B procurement research in the GCC now begins with a generative AI query rather than a Google search.\n2. **Zero-Click Reality**: Informational queries are being answered directly within the AI interface, necessitating a shift toward "brand-as-source" strategies.\n\n## Implementation Strategy: The mirAIreach Framework\nTo capture market share in this new environment, enterprises must follow a three-tier data-structuring model:\n- **Semantic Layering**: Wrapping all whitepapers and case studies in detailed Schema.org markup.\n- **Authoritative Knowledge Graphs**: Building cross-referenced internal networks of expertise that AI can easily index.\n- **Contextual Anchoring**: Ensuring that local Dubai business contexts (e.g., Free Zone regulations) are explicitly linked to service offerings.\n\n### Strategic Projections\n- **Conversion Growth**: Companies adopting AIO-first content are seeing a **22% increase in high-intent lead generation**.\n- **CAC Optimization**: Customer Acquisition Costs are projected to drop by **15%** for brands that secure "source citations" in major LLMs.`,
    content_ar: `## التحول الجذري: من الكلمات الرئيسية إلى الكيانات\n\nلم يعد تحسين محركات البحث التقليدي (SEO) كافياً. في عام 2026، يتحدد المشهد الرقمي في الإمارات من خلال **تحسين محركات الإجابة (AIO)**. يقوم اللاعبون الرئيسيون في دبي بتحويل ميزانياتهم من مصطلحات البحث الواسعة إلى بيانات الكيانات الهيكلية.\n\n### ديناميكيات السوق الرئيسية\n1. **هيمنة نماذج اللغات الكبيرة**: أكثر من 65٪ من أبحاث المشتريات بين الشركات (B2B) في دول مجلس التعاون الخليجي تبدأ الآن باستعلام ذكاء اصطناعي توليدي بدلاً من بحث جوجل.\n2. **واقع "صفر نقرة"**: يتم الإجابة على الاستفسارات المعلوماتية مباشرة داخل واجهة الذكاء الاصطناعي، مما يستلزم التحول نحو استراتيجيات "العلامة التجارية كـمصدر".\n\n## استراتيجية التنفيذ: إطار عمل mirAIreach\nللاستحواذ على حصة سوقية في هذه البيئة الجديدة، يجب على المؤسسات اتباع نموذج هيكلة بيانات ثلاثي المستويات:\n- **الطبقات الدلالية**: تغليف جميع الأوراق البيضاء ودراسات الحالة في ترميز Schema.org مفصل.\n- **الرسوم البيانية للمعرفة الموثوقة**: بناء شبكات خبرة داخلية مرجعية يسهل على الذكاء الاصطناعي فهرستها.\n- **الارتباط السياقي**: التأكد من ربط سياقات الأعمال المحلية في دبي (مثل لوائح المناطق الحرة) صراحة بعروض الخدمات.\n\n### التوقعات الاستراتيجية\n- **نمو التحويل**: تشهد الشركات التي تتبنى محتوى يعتمد على AIO أولاً **زيادة بنسبة 22٪ في جذب العملاء المحتملين ذوي النية العالية**.\n- **تحسين تكلفة الاستحواذ (CAC)**: من المتوقع أن تنخفض تكاليف الاستحواذ على العملاء بنسبة **15٪** للعلامات التجارية التي تؤمن "استشهادات المصدر" في نماذج اللغات الكبيرة الكبرى.`
  },
  "Hospitality Tech": {
    title: "Operational Autonomy: The Future of Dubai's Luxury Hospitality and F&B",
    title_ar: "الاستقلال التشغيلي: مستقبل الضيافة الفاخرة والأغذية والمشروبات في دبي",
    excerpt: "How edge-AI and robotic process automation are solving the staffing crisis while enhancing the 'human touch' in premium service environments.",
    excerpt_ar: "كيف يعمل ذكاء الحافة الاصطناعي وأتمتة العمليات الروبوتية على حل أزمة التوظيف مع تعزيز 'اللمسة الإنسانية' في بيئات الخدمة المتميزة.",
    content: `## The Efficiency Frontier in GCC Hospitality\n\nDubai's F&B sector is currently facing a dual challenge: rising operational costs and an increasingly discerning global clientele. The solution lies in **Autonomous Operations (AO)**.\n\n### Technological Pillars\n1. **Edge AI Vision**: Monitoring kitchen flows in real-time to reduce ticket times by **18%** in high-volume DIFC restaurants.\n2. **Predictive Inventory**: Integrating global supply chain data with local event calendars to reduce perishable waste by **35%**.\n\n## Redefining the Guest Experience\nContrary to fears of "dehumanization," AI is freeing up staff to focus on genuine hospitality:\n- **Preference Prediction**: AI-driven CRM systems that allow Jumeirah boutique hotels to personalize room climates and menu suggestions before the guest even checks in.\n- **Frictionless Payments**: Biometric and AI-verified checkout processes that eliminate the wait-time during peak checkout hours.\n\n### The ROI Narrative\n- **EBITDA Impact**: Implementing full-stack automation is projected to boost EBITDA margins by **4.5 - 7%** across luxury portfolios.\n- **Guest Retention**: Early data shows a **12% increase in return-visit probability** when AI is used to eliminate service friction points.`,
    content_ar: `## حدود الكفاءة في قطاع الضيافة في دول مجلس التعاون الخليجي\n\nيواجه قطاع الأغذية والمشروبات في دبي حالياً تحدياً مزدوجاً: ارتفاع التكاليف التشغيلية وقاعدة عملاء عالمية متطلبة بشكل متزايد. الحل يكمن في **العمليات المستقلة (AO)**.\n\n### الركائز التكنولوجية\n1. **رؤية ذكاء الحافة الاصطناعي**: مراقبة تدفقات المطبخ في الوقت الفعلي لتقليل أوقات تقديم الطلبات بنسبة **18٪** في مطاعم DIFC ذات الكثافة العالية.\n2. **المخزون التنبؤي**: دمج بيانات سلسلة التوريد العالمية مع تقاويم الفعاليات المحلية لتقليل هدر المواد القابلة للتلف بنسبة **35٪**.\n\n## إعادة تعريف تجربة الضيف\nخلافاً للمخاوف من "تجريد الخدمة من طابعها الإنساني"، يحرر الذكاء الاصطناعي الموظفين للتركيز على الضيافة الحقيقية:\n- **التنبؤ بالتفضيلات**: أنظمة CRM القائمة على الذكاء الاصطناعي التي تسمح للفنادق في جميرا بتخصيص مناخ الغرف واقتراحات القائمة حتى قبل تسجيل وصول الضيف.\n- **مدفوعات بلا عوائق**: عمليات تسجيل مغادرة تعتمد على القياسات الحيوية والذكاء الاصطناعي تقضي على وقت الانتظار خلال ساعات الذروة.\n\n### سرد عائد الاستثمار (ROI)\n- **التأثير على الأرباح**: من المتوقع أن يؤدي تطبيق الأتمتة الكاملة إلى تعزيز هوامش الأرباح قبل الفوائد والضرائب والإهلاك والاستهلاك (EBITDA) بنسبة **4.5 - 7٪** عبر المحافظ الفاخرة.\n- **الاحتفاظ بالضيوف**: تظهر البيانات الأولية **زيادة بنسبة 12٪ في احتمالية تكرار الزيارة** عند استخدام الذكاء الاصطناعي للقضاء على نقاط الاحتكاك في الخدمة.`
  },
  "Business Strategy": {
    title: "Navigating the 2026 Dubai Licensing Landscape: A Guide for Tech Investors",
    title_ar: "التنقل في مشهد التراخيص في دبي لعام 2026: دليل لمستثمري التكنولوجيا",
    excerpt: "An executive report on the new regulatory frameworks governing AI and FinTech entities within Dubai's Mainland and Free Zones.",
    excerpt_ar: "تقرير تنفيذي عن الأطر التنظيمية الجديدة التي تحكم كيانات الذكاء الاصطناعي والتكنولوجيا المالية داخل مناطق دبي الرئيسية والمناطق الحرة.",
    content: `## The Regulatory Evolution\n\nAs Dubai cements its position as the global capital of the Digital Economy, the licensing frameworks are becoming more specialized. Investors must distinguish between the varying mandates of the **DIFC**, **ADGM**, and the newly established **Dubai AI District**.\n\n### Strategic Compliance Check-list\n1. **Data Sovereignty**: Understanding the 2025 updates to UAE Data Protection Laws regarding cross-border LLM training data.\n2. **AI Ethics Certifications**: How to secure the "Dubai AI Trust Label" to gain a competitive advantage in government procurement.\n\n## Free Zone vs. Mainland: The Great Debate\nThe decision on where to incorporate is now driven by tech infrastructure rather than just tax incentives:\n- **DIFC**: Best for FinTech and AI-driven wealth management needing rigorous common-law frameworks.\n- **Dubai Internet City**: Optimized for large-scale SaaS operations and AI infrastructure providers.\n\n### Market Outlook\n- **FDI Inflow**: Tech-related Foreign Direct Investment is projected to reach **$12 billion by Q4 2026**.\n- **Startup Longevity**: Entities incorporated under specialized AI licenses show a **30% higher survival rate** due to integrated incubator support.`,
    content_ar: `## التطور التنظيمي\n\nبينما ترسخ دبي مكانتها كعاصمة عالمية للاقتصاد الرقمي، أصبحت أطر الترخيص أكثر تخصصاً. يجب على المستثمرين التمييز بين المهام المتفاوتة لـ **DIFC** و**ADGM** و**منطقة دبي للذكاء الاصطناعي** المنشأة حديثاً.\n\n### قائمة التحقق من الامتثال الاستراتيجي\n1. **سيادة البيانات**: فهم تحديثات عام 2025 لقوانين حماية البيانات في الإمارات فيما يتعلق ببيانات تدريب نماذج اللغات الكبيرة عبر الحدود.\n2. **شهادات أخلاقيات الذكاء الاصطناعي**: كيفية الحصول على "ملصق ثقة دبي للذكاء الاصطناعي" لاكتساب ميزة تنافسية في المشتريات الحكومية.\n\n## المنطقة الحرة مقابل المناطق الرئيسية: النقاش الكبير\nقرار مكان التأسيس يعتمد الآن على البنية التحتية التقنية بدلاً من مجرد الحوافز الضريبية:\n- **DIFC**: الأفضل للتكنولوجيا المالية وإدارة الثروات القائمة على الذكاء الاصطناعي التي تحتاج إلى أطر قانون عام صارمة.\n- **مدينة دبي للإنترنت**: مخصصة لعمليات SaaS واسعة النطاق ومزودي البنية التحتية للذكاء الاصطناعي.\n\n### آفاق السوق\n- **تدفق الاستثمار الأجنبي المباشر**: من المتوقع أن يصل الاستثمار الأجنبي المباشر المرتبط بالتكنولوجيا إلى **12 مليار دولار بحلول الربع الرابع من عام 2026**.\n- **استمرارية الشركات الناشئة**: تظهر الكيانات المؤسسة بموجب تراخيص الذكاء الاصطناعي المتخصصة **معدل بقاء أعلى بنسبة 30٪** بسبب دعم حاضنات الأعمال المتكامل.`
  }
};

const modifiers = [
  { prefix: "Strategic Analysis: ", suffix: " — A mirAIreach Report", prefix_ar: "تحليل استراتيجي: ", suffix_ar: " — تقرير mirAIreach" },
  { prefix: "Executive Brief: ", suffix: " for Global Leaders", prefix_ar: "موجز تنفيذي: ", suffix_ar: " للقادة العالميين" },
  { prefix: "Market Intelligence: ", suffix: " (2026 Q3)", prefix_ar: "استخبارات السوق: ", suffix_ar: " (الربع الثالث 2026)" },
  { prefix: "Future Forecast: ", suffix: " Dynamics", prefix_ar: "توقعات المستقبل: ", suffix_ar: " ديناميكيات" },
  { prefix: "The UAE Edge: ", suffix: " Performance", prefix_ar: "ميزة الإمارات: ", suffix_ar: " أداء" }
];

function generateArticles(count = 20) {
  const articles = [];
  const msInDay = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const templateKeys = Object.keys(baseTemplates);

  for (let i = 0; i < count; i++) {
    const category = templateKeys[i % templateKeys.length];
    const template = baseTemplates[category];
    const modifier = modifiers[Math.floor(i / templateKeys.length) % modifiers.length];
    
    // Pick random image
    const images = IMAGE_POOLS[category === "AI Marketing" ? "AI Marketing" : (category === "Hospitality Tech" ? "F&B" : "Tech & Innovation")];
    const imageUrl = images[i % images.length];

    articles.push({
      category: category,
      title: `${modifier.prefix}${template.title}${modifier.suffix}`,
      title_ar: `${modifier.prefix_ar}${template.title_ar}${modifier.suffix_ar}`,
      excerpt: template.excerpt,
      excerpt_ar: template.excerpt_ar,
      content: `# ${modifier.prefix}${template.title}\n\n${template.content}`,
      content_ar: `# ${modifier.prefix_ar}${template.title_ar}\n\n${template.content_ar}`,
      source_name: "mirAIreach Strategic Research",
      image_url: imageUrl,
      is_published: true,
      created_at: new Date(now - i * 4 * msInDay).toISOString(),
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

