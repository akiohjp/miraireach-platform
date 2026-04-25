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
  "Retail & E-commerce"
];

const COMPANIES = [
  "mirAIreach Solutions", "Dubai Digital Hub", "Emirates FinTech Group", 
  "Nexus PropTech", "Global Logistics AI", "Desert Retail Corp",
  "Burj Hospitality", "DIFC Innovations", "Palm Tech Ventures", "Zabeel Data Systems"
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
  ]
};

const baseTemplates = {
  "AI & Deep Tech": {
    title: "Enterprise LLM Adoption: Strategic Q3 Growth Report",
    title_ar: "تبني نماذج اللغات الكبيرة في المؤسسات: تقرير النمو الاستراتيجي للربع الثالث",
    excerpt: "Official report detailing the acceleration of Generative AI integration across Dubai's public sector and enterprise layers.",
    excerpt_ar: "تقرير رسمي يوضح تسارع تكامل الذكاء الاصطناعي التوليدي عبر القطاع العام ومؤسسات دبي.",
    content: `## FOR IMMEDIATE RELEASE\n\n**DUBAI, UAE** — As the Digital Economy continues its exponential rise, the latest market intelligence suggests a significant pivot toward sovereign LLM infrastructure.\n\n### Key Findings\n- **Investment**: Over $2.4B allocated for deep-tech research by Q4 2026.\n- **Adoption**: 45% of government entities have successfully integrated Gemini-based automation for public service optimization.\n- **Performance**: Efficiency gains of up to 40% recorded in data-heavy administrative workflows.\n\n### Strategic Pillars\n1. **Data Sovereignty**: Implementing localized training sets to ensure cultural and linguistic accuracy.\n2. **Scalability**: Moving from pilot programs to city-wide autonomous systems.\n3. **Ethics**: Adhering to the newly established Dubai AI Ethical Guidelines.\n\n**About the Report**: This analysis was conducted over a 6-month period, involving stakeholders from major tech hubs in the UAE.`,
    content_ar: `## للنشر الفوري\n\n**دبي، الإمارات العربية المتحدة** — مع استمرار الارتفاع الهائل للاقتصاد الرقمي، تشير أحدث استخبارات السوق إلى تحول كبير نحو البنية التحتية السيادية لنماذج اللغات الكبيرة.\n\n### النتائج الرئيسية\n- **الاستثمار**: تخصيص أكثر من 2.4 مليار دولار لأبحاث التكنولوجيا العميقة بحلول الربع الرابع من عام 2026.\n- **التبني**: نجحت 45٪ من الجهات الحكومية في دمج الأتمتة القائمة على Gemini لتحسين الخدمات العامة.\n- **الأداء**: تسجيل مكاسب كفاءة تصل إلى 40٪ في سير عمل الإدارية كثيفة البيانات.\n\n### الركائز الاستراتيجية\n1. **سيادة البيانات**: تنفيذ مجموعات تدريب محلية لضمان الدقة الثقافية واللغوية.\n2. **القابلية للتوسع**: الانتقال من البرامج التجريبية إلى الأنظمة المستقلة على مستوى المدينة.\n3. **الأخلاق**: الالتزام بالمبادئ التوجيهية الأخلاقية للذكاء الاصطناعي في دبي المنشأة حديثاً.\n\n**حول التقرير**: أُجري هذا التحليل على مدار 6 أشهر، بمشاركة أصحاب المصلحة من المراكز التكنولوجية الرئيسية في الإمارات.`
  },
  "F&B & Hospitality": {
    title: "Autonomous Kitchens: Revolutionizing the DIFC Fine-Dining Experience",
    title_ar: "المطابخ المستقلة: إحداث ثورة في تجربة تناول الطعام الفاخر في DIFC",
    excerpt: "Corporate announcement on the deployment of Edge AI vision systems to optimize back-of-house operations in premium hospitality groups.",
    excerpt_ar: "إعلان مؤسسي عن نشر أنظمة رؤية ذكاء الحافة الاصطناعي لتحسين العمليات الخلفية في مجموعات الضيافة المتميزة.",
    content: `## Press Release\n\n**DUBAI, UAE** — Leading hospitality groups today announced a major partnership to integrate autonomous kitchen technologies, targeting a 30% reduction in waste across fine-dining portfolios.\n\n### Operational Highlights\n- **Kitchen Vision**: Real-time monitoring of preparation flows via Edge AI.\n- **Waste Mitigation**: Predictive ordering systems reducing spoilage by 35%.\n- **Staff ROI**: Repurposing labor hours from repetitive tasks to guest engagement, increasing retention rates by 12%.\n\n### The Future of Dining\nThe integration of AI does not replace the chef; it empowers the culinary team with data-driven precision, ensuring that the "human touch" is preserved where it matters most—the plate.\n\n### Strategic Impact\nThis initiative sets a global benchmark for sustainable luxury, proving that high-end hospitality can be both hyper-efficient and environmentally responsible.`,
    content_ar: `## بيان صحفي\n\n**دبي، الإمارات العربية المتحدة** — أعلنت مجموعات الضيافة الرائدة اليوم عن شراكة كبرى لدمج تقنيات المطبخ المستقلة، مستهدفة خفض الهدر بنسبة 30٪ عبر محافظ المطاعم الفاخرة.\n\n### أبرز العمليات\n- **رؤية المطبخ**: مراقبة تدفقات التحضير في الوقت الفعلي عبر ذكاء الحافة الاصطناعي.\n- **تخفيف الهدر**: أنظمة الطلب التنبؤية التي تقلل التلف بنسبة 35٪.\n- **عائد استثمار الموظفين**: إعادة توظيف ساعات العمل من المهام المتكررة إلى مشاركة الضيوف، مما يزيد من معدلات الاحتفاظ بالموظفين بنسبة 12٪.\n\n### مستقبل تناول الطعام\nإن دمج الذكاء الاصطناعي لا يحل محل الطاهي؛ بل يمنح فريق الطهي دقة تعتمد على البيانات، مما يضمن الحفاظ على "اللمسة الإنسانية" حيثما كان ذلك مهماً — الطبق.\n\n### التأثير الاستراتيجي\nتضع هذه المبادرة معياراً عالمياً للفخامة المستدامة، مما يثبت أن الضيافة الراقية يمكن أن تكون عالية الكفاءة ومسؤولة بيئياً في آن واحد.`
  },
  "Real Estate & PropTech": {
    title: "Smart City Integration: The 2026 PropTech Valuations Report",
    title_ar: "تكامل المدن الذكية: تقرير تقييمات بروبتيك لعام 2026",
    excerpt: "Executive brief on the integration of blockchain and AI pricing models in the Dubai secondary property market.",
    excerpt_ar: "موجز تنفيذي حول تكامل البلوكتشين ونماذج تسعير الذكاء الاصطناعي في سوق العقارات الثانوية في دبي.",
    content: `## Market Insight Report\n\n**DUBAI, UAE** — The convergence of PropTech and Smart City infrastructure has triggered a 20% increase in transparency for cross-border real estate transactions.\n\n### Key Metrics\n- **Algorithmic Pricing**: 95% accuracy achieved in 24-hour valuation models.\n- **Blockchain Escrow**: Reducing transaction settlement times from 14 days to 48 hours.\n- **Yield Projections**: AI-driven predictive maintenance reducing long-term O&M costs by 18%.\n\n### Strategic Development\nAs Dubai expands toward the 2040 Urban Master Plan, the integration of real-time property data into city-wide logistics and energy grids is becoming the primary driver of capital appreciation.\n\n**Disclaimer**: This report is for institutional investors and provides data-backed projections based on current infrastructure growth trajectories.`,
    content_ar: `## تقرير رؤية السوق\n\n**دبي، الإمارات العربية المتحدة** — أدى تقارب بروبتيك والبنية التحتية للمدن الذكية إلى زيادة الشفافية بنسبة 20٪ في المعاملات العقارية عبر الحدود.\n\n### المقاييس الرئيسية\n- **التسعير الخوارزمي**: تحقيق دقة بنسبة 95٪ في نماذج التقييم على مدار 24 ساعة.\n- **الضمان عبر البلوكتشين**: تقليل أوقات تسوية المعاملات من 14 يوماً إلى 48 ساعة.\n- **توقعات العائد**: الصيانة التنبؤية القائمة على الذكاء الاصطناعي تقلل تكاليف التشغيل والصيانة طويلة الأجل بنسبة 18٪.\n\n### التطوير الاستراتيجي\nمع توسع دبي نحو المخطط الحضري لعام 2040، أصبح دمج بيانات العقارات في الوقت الفعلي في لوجستيات المدينة وشبكات الطاقة المحرك الرئيسي لزيادة رأس المال.\n\n**إخلاء مسؤولية**: هذا التقرير مخصص للمستثمرين المؤسسيين ويوفر توقعات مدعومة بالبيانات بناءً على مسارات نمو البنية التحتية الحالية.`
  },
  "FinTech & Crypto": {
    title: "The Digital Dirham: Enterprise Adoption and Crypto Regulation 2.0",
    title_ar: "الدرهم الرقمي: تبني المؤسسات وتنظيم العملات المشفرة 2.0",
    excerpt: "Official announcement regarding the next phase of digital asset integration in the GCC banking ecosystem.",
    excerpt_ar: "إعلان رسمي بشأن المرحلة التالية من تكامل الأصول الرقمية في منظومة الخدمات المصرفية في دول مجلس التعاون الخليجي.",
    content: `## Regulatory Briefing\n\n**DUBAI, UAE** — The central authority today released the updated framework for stablecoin integration, signaling a new era for regional trade settlement.\n\n### Key Pillars\n- **Interoperability**: Seamless bridging between the Digital Dirham and major global payment rails.\n- **Compliance**: Real-time AI-monitored AML/KYC protocols reducing compliance overhead by 50%.\n- **Institutional Inflow**: Institutional crypto holdings in the UAE increased by 200% year-over-year.\n\n### Market Impact\nThis regulatory clarity positions the UAE as the premier global jurisdiction for virtual asset service providers (VASPs), attracting over $5B in new venture capital for the sector.\n\n**Forward-Looking Statement**: The integration of smart-contract-based trade finance is expected to slash cross-border transaction fees by 60% by 2027.`,
    content_ar: `## إحاطة تنظيمية\n\n**دبي، الإمارات العربية المتحدة** — أصدرت السلطة المركزية اليوم الإطار المحدث لتكامل العملات المستقرة، مما يشير إلى عصر جديد لتسوية التجارة الإقليمية.\n\n### الركائز الرئيسية\n- **التوافق التشغيلي**: التجسير السلس بين الدرهم الرقمي ومسارات الدفع العالمية الكبرى.\n- **الامتثال**: بروتوكولات AML/KYC المراقبة بالذكاء الاصطناعي في الوقت الفعلي تقلل من نفقات الامتثال بنسبة 50٪.\n- **التدفق المؤسسي**: زادت حيازات المؤسسات من العملات المشفرة في الإمارات بنسبة 200٪ على أساس سنوي.\n\n### تأثير السوق\nيعزز هذا الوضوح التنظيمي مكانة الإمارات كأفضل ولاية قضائية عالمية لمزودي خدمات الأصول الافتراضية (VASPs)، مما يجذب أكثر من 5 مليارات دولار من رأس المال الاستثماري الجديد للقطاع.\n\n**بيان تطلعي**: من المتوقع أن يؤدي تكامل التمويل التجاري القائم على العقود الذكية إلى خفض رسوم المعاملات عبر الحدود بنسبة 60٪ بحلول عام 2027.`
  },
  "Logistics & Supply Chain": {
    title: "Autonomous Logistics: The Jebel Ali Smart Port Expansion",
    title_ar: "الخدمات اللوجستية المستقلة: توسعة ميناء جبل علي الذكي",
    excerpt: "Report on the full-scale deployment of autonomous trucking and drone delivery systems in Dubai's main logistics hubs.",
    excerpt_ar: "تقرير عن النشر واسع النطاق لأنظمة الشحن الذاتي وأنظمة توصيل الطائرات بدون طيار في المراكز اللوجستية الرئيسية في دبي.",
    content: `## Corporate Strategy Update\n\n**DUBAI, UAE** — The latest expansion of the smart logistics grid integrates AI-driven routing and warehouse robotics to eliminate last-mile delivery friction.\n\n### Performance Metrics\n- **Latency Reduction**: 25% faster turnaround times for container logistics.\n- **Automation Level**: 70% of warehouse movements now handled by autonomous mobile robots (AMRs).\n- **Energy Efficiency**: Electric autonomous fleets reducing carbon footprint by 40%.\n\n### Strategic Vision\nBy merging the port's digital twin with real-time global shipping data, operators can now predict and mitigate supply chain disruptions 48 hours before they occur.\n\n**About the Facility**: The Jebel Ali Smart Hub is the largest autonomous logistics facility in the region, serving over 150 countries.`,
    content_ar: `## تحديث الاستراتيجية المؤسسية\n\n**دبي، الإمارات العربية المتحدة** — تدمج أحدث توسعة لشبكة اللوجستيات الذكية التوجيه القائم على الذكاء الاصطناعي وروبوتات المستودعات للقضاء على احتكاك توصيل الميل الأخير.\n\n### مقاييس الأداء\n- **تقليل الكمون**: أوقات إنجاز أسرع بنسبة 25٪ للوجستيات الحاويات.\n- **مستوى الأتمتة**: يتم الآن التعامل مع 70٪ من تحركات المستودعات بواسطة الروبوتات المتنقلة المستقلة (AMRs).\n- **كفاءة الطاقة**: أساطيل النقل الكهربائية المستقلة تقلل من البصمة الكربونية بنسبة 40٪.\n\n### الرؤية الاستراتيجية\nمن خلال دمج التوأم الرقمي للميناء مع بيانات الشحن العالمية في الوقت الفعلي، يمكن للمشغلين الآن التنبؤ باضطرابات سلسلة التوريد وتخفيفها قبل 48 ساعة من وقوعها.\n\n**حول المنشأة**: يعد مركز جبل علي الذكي أكبر منشأة لوجستية مستقلة في المنطقة، ويخدم أكثر من 150 دولة.`
  },
  "Retail & E-commerce": {
    title: "Omnichannel Mastery: The Future of Cross-Border Luxury E-commerce",
    title_ar: "إتقان القنوات المتعددة: مستقبل التجارة الإلكترونية الفاخرة عبر الحدود",
    excerpt: "Strategic analysis of the GCC retail landscape and the rise of hyper-personalized AI shopping assistants.",
    excerpt_ar: "تحليل استراتيجي لمشهد التجزئة في دول مجلس التعاون الخليجي وصعود مساعدي التسوق القائمين على الذكاء الاصطناعي فائق التخصيص.",
    content: `## Strategic Report\n\n**DUBAI, UAE** — The retail sector is undergoing a fundamental transformation as luxury brands pivot toward "phygital" experiences powered by generative AI.\n\n### Key Trends\n- **AI Stylists**: 30% increase in Average Order Value (AOV) for retailers using AI-driven recommendation engines.\n- **Virtual Fitting**: Reducing return rates by 45% through high-fidelity 3D garment visualization.\n- **Omnichannel Data**: 360-degree customer views allowing for seamless VIP service across boutiques and apps.\n\n### Market Dynamics\nAs consumer habits evolve, the integration of social commerce and instant delivery is becoming the minimum viable standard for luxury retail in Dubai.\n\n**Future Outlook**: By 2027, "headless commerce" architectures will be the industry standard, allowing brands to deploy shopping experiences across any digital touchpoint instantaneously.`,
    content_ar: `## تقرير استراتيجي\n\n**دبي، الإمارات العربية المتحدة** — يشهد قطاع التجزئة تحولاً جوهرياً حيث تتحول العلامات التجارية الفاخرة نحو تجارب "فيجيتال" المدعومة بالذكاء الاصطناعي التوليدي.\n\n### الاتجاهات الرئيسية\n- **منسقو الأزياء بالذكاء الاصطناعي**: زيادة بنسبة 30٪ في متوسط قيمة الطلب (AOV) لتجار التجزئة الذين يستخدمون محركات التوصية القائمة على الذكاء الاصطناعي.\n- **القياس الافتراضي**: تقليل معدلات الإرجاع بنسبة 45٪ من خلال تصور الملابس ثلاثي الأبعاد عالي الدقة.\n- **بيانات القنوات المتعددة**: رؤى شاملة للعملاء تسمح بخدمة كبار الشخصيات بسلاسة عبر البوتيكات والتطبيقات.\n\n### ديناميكيات السوق\nمع تطور عادات المستهلكين، أصبح تكامل التجارة الاجتماعية والتوصيل الفوري هو الحد الأدنى للمعايير القابلة للتطبيق لتجارة التجزئة الفاخرة في دبي.\n\n**آفاق مستقبلية**: بحلول عام 2027، ستكون بنى "التجارة بدون رأس" هي معيار الصناعة، مما يسمح للعلامات التجارية بنشر تجارب التسوق عبر أي نقطة اتصال رقمية بشكل فوري.`
  }
};

const modifiers = [
  { prefix: "Official Release: ", suffix: " — Corporate Update", prefix_ar: "إصدار رسمي: ", suffix_ar: " — تحديث مؤسسي" },
  { prefix: "Market Forecast: ", suffix: " (Strategic Brief)", prefix_ar: "توقعات السوق: ", suffix_ar: " (موجز استراتيجي)" },
  { prefix: "Executive Report: ", suffix: " 2026", prefix_ar: "تقرير تنفيذي: ", suffix_ar: " 2026" },
  { prefix: "Investor Insight: ", suffix: " Analysis", prefix_ar: "رؤية المستثمر: ", suffix_ar: " تحليل" },
  { prefix: "Global Benchmark: ", suffix: " Standards", prefix_ar: "معيار عالمي: ", suffix_ar: " معايير" }
];

function generateArticles(count = 35) {
  const articles = [];
  const msInDay = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const templateKeys = Object.keys(baseTemplates);

  for (let i = 0; i < count; i++) {
    const category = templateKeys[i % templateKeys.length];
    const template = baseTemplates[category];
    const modifier = modifiers[Math.floor(i / templateKeys.length) % modifiers.length];
    const company = COMPANIES[i % COMPANIES.length];
    
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
      source_name: "mirAIreach Press",
      company_name: company,
      image_url: imageUrl,
      is_published: true,
      created_at: new Date(now - i * 3 * msInDay).toISOString(),
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

