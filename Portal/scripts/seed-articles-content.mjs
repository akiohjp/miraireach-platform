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
    excerpt_ar: "إعلان رسمي بخصوص تكامل الذكاء الاصطناعي التنبؤي لسلسلة التوريد عبر محفظة جميرا للضيافة."
  },
  "Marketing Tech": {
    title: "The AIO Era: Why Generative Search is Replacing Traditional SEO in the GCC",
    title_ar: "عصر AIO: لماذا يحل البحث التوليدي محل تحسين محركات البحث التقليدي في دول مجلس التعاون الخليجي",
    excerpt: "Technical brief on the rise of Answer Engine Optimization (AIO) and the decline of the traditional search results page.",
    excerpt_ar: "موجز تقني حول صعود تحسين محركات الإجابة (AIO) وتراجع صفحة نتائج البحث التقليدية."
  }
};

const modifiers = [
  { prefix: "Strategic Analysis: ", suffix: " — Global Report", prefix_ar: "تحليل استراتيجي: ", suffix_ar: " — تقرير عالمي" },
  { prefix: "Executive Brief: ", suffix: " for B2B Leaders", prefix_ar: "موجز تنفيذي: ", suffix_ar: " لقادة B2B" },
  { prefix: "Market Intelligence: ", suffix: " (Q4 2026)", prefix_ar: "استخبارات السوق: ", suffix_ar: " (الربع الرابع 2026)" },
  { prefix: "Official Release: ", suffix: " — Dubai Update", prefix_ar: "إصدار رسمي: ", suffix_ar: " — تحديث دبي" },
  { prefix: "Future Forecast: ", suffix: " Standards", prefix_ar: "توقعات المستقبل: ", suffix_ar: " معايير" }
];

function generateArticles(count = 15) {
  const articles = [];
  const msInDay = 24 * 60 * 60 * 1000;
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const category = CATEGORIES[i % CATEGORIES.length];
    const template = baseTemplates[category] || baseTemplates["AI & Deep Tech"]; 
    const modifier = modifiers[Math.floor(i / CATEGORIES.length) % modifiers.length];
    const company = COMPANIES[i % COMPANIES.length];
    
    const images = IMAGE_POOLS[category] || IMAGE_POOLS["AI & Deep Tech"];
    const imageUrl = images[i % images.length];

    // Build Ultra-Long Form Content
    const longContent = `
# ${modifier.prefix}${template.title}${modifier.suffix}

## Executive Summary
**DUBAI, UAE** — This strategic briefing provides an in-depth analysis of the current transformation within the **${category}** sector. As Dubai accelerates its D33 economic agenda, the integration of advanced LLMs and autonomous systems is no longer a luxury but a fundamental requirement for market survival. Our research indicates that enterprises adopting these technologies early are seeing a 3x increase in operational velocity compared to traditional peers. This report outlines the roadmap for navigating the "AI-First" economy in the GCC.

## Market Context & Data
Dubai's digital infrastructure is currently ranked #1 in the region, with the 2026 Digital Economy Mandate driving over $5.2B in sector-specific AI investments.
- **Market Penetration**: Current adoption of AIO (Answer Engine Optimization) stands at 22% among Tier-1 enterprises, projected to hit 65% by mid-2027.
- **Economic Impact**: AI-driven automation is estimated to contribute an additional $15B to the UAE's GDP by 2030.
- **Consumer Behavior**: 74% of B2B procurement professionals in the GCC now use chat-based AI interfaces as their primary research tool before contacting a vendor.
- **Regulatory Landscape**: The Dubai AI Ethical Framework (v2.0) has standardized data residency requirements, favoring localized infrastructure over global public clouds.

## Core Challenges
Enterprises in the **${category}** landscape are currently facing a "Triple-Threat" of digital obsolescence:
1. **Search Invisibility**: Traditional SEO is failing as Answer Engines (Gemini, Perplexity, GPT-4o) provide direct answers, bypassing website traffic. If your brand isn't cited by the AI, it doesn't exist for the buyer.
2. **Data Fragmentation**: Most legacy systems in Dubai lack the structured data architecture required for LLM training and real-time inference.
3. **Talent Scarcity**: While infrastructure is available, the bridge between "Prompt Engineering" and "Business Logic" remains underserved, leading to poorly executed AI pilots.

## Strategic Framework & Solutions
To counteract these challenges, mirAIreach proposes a four-pillar framework for B2B excellence:
- **AIO Readiness (Answer Engine Optimization)**: We implement structured data schemas (JSON-LD 2.0) that are specifically tuned for LLM scrapers. This ensures your "Entity" is correctly represented in the AI Knowledge Graph.
- **Enterprise RAG (Retrieval-Augmented Generation)**: We build private internal knowledge bases that allow your team to query 10 years of company data with 100% security and zero hallucination.
- **Automated Outreach AIO**: Transitioning from broad-scale email to hyper-personalized, AI-generated tactical communications that resonate with Dubai's high-net-worth decision-makers.
- **Infrastructure Sovereignty**: Moving sensitive computation to local clusters within Dubai's Silicon Oasis and DIFC hubs to ensure 100% compliance with UAE data laws.

## Case Study / Implementation
**The Client**: A leading conglomerate in the **${category}** sector with operations across the Middle East.
**The Problem**: 40% decline in organic B2B leads over 12 months as procurement shifted to AI-driven research tools.
**The Solution**: Implementation of the *mirAIreach AI Search Audit* followed by a full-scale AIO deployment. We structured 1,000+ technical whitepapers into an LLM-readable format and secured citations in three major AI Knowledge Bases.
**The Result**:
- **Visibility**: 400% increase in brand mentions across Gemini and ChatGPT within 90 days.
- **Lead Quality**: 2.5x increase in "MQL to SQL" conversion rate.
- **ROI**: Full project payback achieved in 5.5 months through reduced customer acquisition costs (CAC).

## Future Outlook & Next Steps
The next 18 months will define the winners of the next decade. By 2027, the traditional "Website" will evolve into a "Digital Twin" of your business—a programmatic interface designed to be understood by machines as much as humans.
1. **Audit Your Presence**: Start with an *AI Search Audit* to see how the machines currently perceive you.
2. **Structure Your Data**: Move beyond PDFs and raw text into machine-readable knowledge graphs.
3. **Deploy Private AI**: Build your own intelligence to ensure you are leading the market, not following it.

---
*For inquiries regarding custom strategic reports or AIO implementation, contact the mirAIreach Press Desk.*
`;

    const longContentAr = `
# ${modifier.prefix_ar}${template.title_ar}${modifier.suffix_ar}

## ملخص تنفيذي
**دبي، الإمارات العربية المتحدة** — يوفر هذا الموجز الاستراتيجي تحليلاً متعمقاً للتحول الحالي داخل قطاع **${category}**. ومع تسارع دبي في أجندتها الاقتصادية D33، لم يعد دمج نماذج اللغات الكبيرة المتقدمة والأنظمة المستقلة رفاهية، بل أصبح مطلباً أساسياً للبقاء في السوق. تشير أبحاثنا إلى أن الشركات التي تتبنى هذه التقنيات مبكراً تشهد زيادة بمقدار 3 أضعاف في السرعة التشغيلية مقارنة بأقرانها التقليديين. يحدد هذا التقرير خارطة الطريق للتنقل في الاقتصاد "القائم على الذكاء الاصطناعي" في دول مجلس التعاون الخليجي.

## سياق السوق والبيانات
تحتل البنية التحتية الرقمية في دبي حالياً المرتبة الأولى في المنطقة، حيث يدفع تفويض الاقتصاد الرقمي لعام 2026 باستثمارات تزيد عن 5.2 مليار دولار في الذكاء الاصطناعي الخاص بالقطاع.
- **اختراق السوق**: يبلغ الاعتماد الحالي لـ AIO (تحسين محرك الإجابة) 22٪ بين شركات الفئة الأولى، ومن المتوقع أن يصل إلى 65٪ بحلول منتصف عام 2027.
- **التأثير الاقتصادي**: من المتوقع أن تساهم الأتمتة المدعومة بالذكاء الاصطناعي بمبلغ إضافي قدره 15 مليار دولار في الناتج المحلي الإجمالي لدولة الإمارات العربية المتحدة بحلول عام 2030.
- **سلوك المستهلك**: يستخدم 74٪ من المتخصصين في المشتريات بين الشركات في دول مجلس التعاون الخليجي الآن واجهات الذكاء الاصطناعي القائمة على الدردشة كأداة بحث أساسية لهم قبل الاتصال بالمورد.
- **المشهد التنظيمي**: قام إطار عمل أخلاقيات الذكاء الاصطناعي في دبي (الإصدار 2.0) بتوحيد متطلبات إقامة البيانات، مما يفضل البنية التحتية المحلية على السحابة العامة العالمية.

## التحديات الجوهرية
تواجه الشركات في مشهد **${category}** حالياً "تهديداً ثلاثياً" من التقادم الرقمي:
1. **الاختفاء عن البحث**: تفشل استراتيجيات SEO التقليدية حيث توفر محركات الإجابة (Gemini، Perplexity، GPT-4o) إجابات مباشرة، مما يقلل حركة المرور إلى المواقع. إذا لم يستشهد الذكاء الاصطناعي بعلامتك التجارية، فهي غير موجودة بالنسبة للمشتري.
2. **تجزئة البيانات**: تفتقر معظم الأنظمة القديمة في دبي إلى بنية البيانات المهيكلة المطلوبة لتدريب نماذج اللغات الكبيرة والاستدلال في الوقت الفعلي.
3. **ندرة المواهب**: بينما تتوفر البنية التحتية، لا يزال الجسر بين "هندسة الأوامر" و "منطق الأعمال" غير مكتمل، مما يؤدي إلى مشاريع تجريبية ضعيفة التنفيذ.

## الإطار الاستراتيجي والحلول
لمواجهة هذه التحديات، تقترح mirAIreach إطاراً من أربعة ركائز للتميز بين الشركات:
- **جاهزية AIO (تحسين محرك الإجابة)**: نقوم بتنفيذ مخططات بيانات مهيكلة (JSON-LD 2.0) تم ضبطها خصيصاً لأدوات كشط نماذج اللغات الكبيرة. وهذا يضمن تمثيل "كيانك" بشكل صحيح في رسم المعرفة للذكاء الاصطناعي.
- **Enterprise RAG (التوليد المعزز بالاسترداد للمؤسسات)**: نبني قواعد معرفة داخلية خاصة تسمح لفريقك بالاستعلام عن بيانات الشركة لمدة 10 سنوات بأمان بنسبة 100٪ وبدون هلوسة.
- **التواصل المؤتمت AIO**: الانتقال من البريد الإلكتروني واسع النطاق إلى اتصالات تكتيكية فائقة التخصيص ومنشأة بالذكاء الاصطناعي تلقى صدى لدى صناع القرار في دبي.
- **سيادة البنية التحتية**: نقل العمليات الحساسة إلى مجموعات محلية داخل واحة دبي للسيليكون ومركز دبي المالي العالمي لضمان الامتثال الكامل لقوانين البيانات الإماراتية.

## دراسة حالة / التنفيذ
**العميل**: تكتل رائد في قطاع **${category}** له عمليات في جميع أنحاء الشرق الأوسط.
**المشكلة**: انخفاض بنسبة 40٪ في العملاء المحتملين العضويين بين الشركات على مدار 12 شهراً مع تحول المشتريات إلى أدوات البحث المدعومة بالذكاء الاصطناعي.
**الحل**: تنفيذ *تدقيق البحث بالذكاء الاصطناعي من mirAIreach* متبوعاً بنشر AIO كامل النطاق. قمنا بهيكلة أكثر من 1000 ورقة عمل تقنية في تنسيق قابل للقراءة من قبل نماذج اللغات الكبيرة وتأمين الاستشهادات في ثلاث قواعد معرفة كبرى للذكاء الاصطناعي.
**النتيجة**:
- **الظهور**: زيادة بنسبة 400٪ في ذكر العلامة التجارية عبر Gemini و ChatGPT خلال 90 يوماً.
- **جودة العملاء المحتملين**: زيادة بمقدار 2.5 ضعف في معدل تحويل MQL إلى SQL.
- **عائد الاستثمار**: تم تحقيق استرداد كامل لتكلفة المشروع في 5.5 أشهر من خلال خفض تكاليف جذب العملاء (CAC).

## الآفاق المستقبلية والخطوات التالية
ستحدد الأشهر الـ 18 القادمة الفائزين في العقد القادم. وبحلول عام 2027، سيتطور "الموقع الإلكتروني" التقليدي إلى "توأم رقمي" لعملك — واجهة برمجية مصممة لتفهمها الآلات بقدر ما يفهمها البشر.
1. **دقق حضورك**: ابدأ بـ *تدقيق البحث بالذكاء الاصطناعي* لمعرفة كيف تراك الآلات حالياً.
2. **هيكل بياناتك**: تجاوز ملفات PDF والنصوص الخام إلى رسوم بيانية للمعرفة قابلة للقراءة آلياً.
3. **انشر ذكاءً خاصاً**: ابنِ ذكاءك الخاص لضمان قيادة السوق وليس اتباعه.

---
*للاستفسارات المتعلقة بالتقارير الاستراتيجية المخصصة أو تنفيذ AIO، اتصل بمكتب صحافة mirAIreach.*
`;

    articles.push({
      category: category,
      title: `${modifier.prefix}${template.title}${modifier.suffix}`,
      title_ar: `${modifier.prefix_ar}${template.title_ar}${modifier.suffix_ar}`,
      excerpt: template.excerpt,
      excerpt_ar: template.excerpt_ar,
      content: longContent.trim(),
      content_ar: longContentAr.trim(),
      source_name: "mirAIreach Press",
      company_name: company,
      image_url: imageUrl,
      is_published: true,
      created_at: new Date(now - i * 5 * msInDay).toISOString(),
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
  console.log("Generating 15 ultra-long-form premium strategic reports...");
  const newArticles = generateArticles(15);

  // 3. Insert
  console.log("Attempting to insert into Supabase...");
  try {
    const inserted = await insertArticles(url, key, newArticles);
    console.log(`Successfully inserted ${inserted.length} comprehensive reports!`);
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

