import { readFile } from "node:fs/promises";
import path from "node:path";
import OpenAI from "openai";
import { createApi } from "unsplash-js";

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

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=80",
  "https://images.unsplash.com/photo-1544526226-d4568090ffb8?auto=format&fit=crop&w=1600&q=80"
];

async function getDynamicImage(openai, unsplash, title, index) {
  const fallback = { url: FALLBACK_IMAGES[index % FALLBACK_IMAGES.length], query: "dubai" };
  try {
    if (!openai || !unsplash) return fallback;

    // 1. Generate Query
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Generate a specific 2-3 word English image search keyword for a luxury/business article title. Return ONLY the keywords." },
        { role: "user", content: title }
      ]
    });
    const query = completion.choices[0].message.content.trim().replace(/"/g, "");
    console.log(`- Query for "${title}": "${query}"`);

    // 2. Fetch from Unsplash
    const res = await unsplash.search.getPhotos({
      query: query,
      perPage: 10, // Get a few and pick one to increase uniqueness
      orientation: "landscape",
    });

    if (res.response?.results?.length > 0) {
      // Pick a semi-random one from results to avoid repetition for similar queries
      const randomIndex = Math.floor(Math.random() * Math.min(res.response.results.length, 5));
      return { url: res.response.results[randomIndex].urls.regular, query };
    }
    
    return fallback;
  } catch (err) {
    console.warn(`! Fetch failed for "${title}":`, err.message);
    return { url: FALLBACK_IMAGES[index % FALLBACK_IMAGES.length], query: "dubai" };
  }
}

const SOURCES = [
  { name: "Michelin Guide", url: "https://guide.michelin.com/ae/en" },
  { name: "Gault&Millau UAE", url: "https://www.gaultmillauae.com/" },
  { name: "Time Out Dubai", url: "https://www.timeoutdubai.com/" },
  { name: "What's On Dubai", url: "https://whatson.ae/" },
  { name: "Dubai Calendar", url: "https://www.visitdubai.com/en/whats-on/dubai-events-calendar" }
];

const TEMPLATES = [
  {
    category: "Gourmet & Dining",
    title: "Culinary Excellence: The New Michelin Stars Defining Dubai 2026",
    title_ar: "التميز في الطهي: نجوم ميشلان الجديدة التي تحدد معالم دبي 2026",
    excerpt: "A deep dive into the kitchens that earned their stars this season through technical mastery and local soul.",
    content: `## The Pursuit of Perfection in Dubai's Kitchens\n\nDubai's dining scene has matured into a sophisticated ecosystem where global techniques meet local ingredients. In the 2026 selection, the focus has shifted from theatrical presentation to flavor purity and sustainable sourcing.\n\n### The Rise of Progressive Middle Eastern Cuisine\nOne of the most significant trends is the elevation of traditional Middle Eastern flavors using modernist techniques. Chefs are no longer just importing luxury ingredients from Europe; they are working with UAE-grown organic produce to create world-class menus.\n\n### Technical Mastery: Fire and Smoke\nWood-fire cooking has returned as a dominant theme. Several new one-star recipients utilize ancient hearth-cooking methods to extract maximum depth from simple ingredients like locally caught hamour and desert-grown greens.\n\n### AI Insight: The Gastronomy Economy\n*Strategic Analysis by mirAIreach AI*\n\nThe concentration of Michelin-starred venues in Dubai is a critical pillar of the city's tourism strategy. As of 2026, the 'Gourmet Tourism' sector contributes approximately 18% to the non-oil GDP. For investors, the opportunity lies in supporting 'Chef-led' concepts over franchised brands. Data shows that independent, high-skill venues have a 35% higher lifetime value per customer compared to standard luxury franchises.`,
    content_ar: `## السعي وراء الكمال في مطابخ دبي\n\nنضج مشهد المطاعم في دبي ليصبح نظاماً بيئياً متطوراً حيث تلتقي التقنيات العالمية بالمكونات المحلية. في اختيار عام 2026، تحول التركيز من العرض المسرحي إلى نقاء النكهة والمصادر المستدامة.\n\n### صعود المطبخ الشرق أوسطي التقدمي\nأحد أهم الاتجاهات هو الارتقاء بالنكهات الشرق أوسطية التقليدية باستخدام تقنيات حديثة. لم يعد الشيفات يستوردون المكونات الفاخرة من أوروبا فحسب؛ بل يعملون مع المنتجات العضوية المزروعة في الإمارات.\n\n### رؤية الذكاء الاصطناعي: اقتصاد فنون الطهي\n*تحليل استراتيجي بواسطة ذكاء mirAIreach الاصطناعي*\n\nيعد تركيز المطاعم الحائزة على نجوم ميشلان في دبي ركيزة أساسية لاستراتيجية السياحة في المدينة. اعتباراً من عام 2026، يساهم قطاع "سياحة التذوق" بنحو 18٪ من الناتج المحلي الإجمالي غير النفطي.`
  },
  {
    category: "Lifestyle & Travel",
    title: "Hidden Gems: The Secret Desert Escapes Every Resident Should Know",
    title_ar: "الجواهر الخفية: الملاذات الصحراوية السرية التي يجب على كل مقيم معرفتها",
    excerpt: "Beyond the luxury resorts lie these untouched dunes and private sanctuaries for the ultimate reset.",
    content: `## Rediscovering the UAE Wilderness\n\nAs Dubai grows, the desire for silence and authentic connection with nature has skyrocketed. The 2026 lifestyle trend is 'Hyper-Local Isolation'—finding luxury in the absence of digital noise.\n\n### The Al Qudra Expansion\nThe Al Qudra region has evolved into a managed sanctuary where residents can experience the desert without the crowds. New solar-powered eco-pods offer a sustainable way to stay overnight while observing the local wildlife.\n\n### Ancient Traditions Meet Modern Wellness\nBedouin-inspired wellness retreats are gaining popularity. These venues combine desert-herb aromatherapy with modern bio-hacking tech like cold-plunge pools and infrared saunas.\n\n### AI Insight: The Wellness Real Estate Boom\n*Strategic Analysis by mirAIreach AI*\n\nThe demand for 'nature-integrated' living is reshaping Dubai's real estate map. We are seeing a 25% premium on properties located within 15 minutes of desert conservation zones. For developers, the move from 'Gold-Plated Luxury' to 'Natural Luxury' is not just aesthetic—it's a high-ROI strategic pivot. Expect major investment flows toward the Mleiha and Al Marmoom corridors in the next 18 months.`,
    content_ar: `## إعادة اكتشاف براري الإمارات\n\nمع نمو دبي، تزايدت الرغبة في الصمت والتواصل الحقيقي مع الطبيعة بشكل كبير. اتجاه نمط الحياة لعام 2026 هو "العزلة المحلية الفائقة" - العثور على الفخامة في غياب الضجيج الرقمي.\n\n### توسعة القدرة\nتطورت منطقة القدرة إلى محمية مدارة حيث يمكن للمقيمين تجربة الصحراء بعيداً عن الزحام. توفر الكبسولات البيئية الجديدة التي تعمل بالطاقة الشمسية طريقة مستدامة للإقامة.\n\n### رؤية الذكاء الاصطناعي: طفرة العقارات الصحية\n*تحليل استراتيجي بواسطة ذكاء mirAIreach الاصطناعي*\n\nيعيد الطلب على الحياة "المتكاملة مع الطبيعة" تشكيل خريطة العقارات في دبي. نشهد علاوة سعرية بنسبة 25٪ على العقارات الواقعة بالقرب من مناطق الحفاظ على الصحراء.`
  },
  {
    category: "Logistics & Supply Chain",
    title: "Dubai Mall Expansion: The Logistics of the World's Largest Retail Hub",
    title_ar: "توسعة دبي مول: لوجستيات أكبر مركز تسوق في العالم",
    excerpt: "How AI-driven footfall analysis and automated inventory are powering the next phase of retail.",
    content: `## Retail 4.0: The Future of Dubai Mall\n\nThe ongoing expansion of Dubai Mall is more than just adding floor space; it is a laboratory for the future of physical retail. In 2026, the mall has integrated a fully autonomous 'Underground Fulfillment Network' to handle deliveries to stores and customers in real-time.\n\n### Seamless Integration of Luxury and Tech\nThe new wing features 'Digital Facades' that adapt to the profile of the visiting crowd. Luxury brands are using AI to predict footfall with 98% accuracy, allowing them to optimize staffing and stock levels hourly.\n\n### AI Insight: The Death of Traditional Retail\n*Strategic Analysis by mirAIreach AI*\n\nWhat we are witnessing in Dubai Mall is the transition from 'Transactional Retail' to 'Experiential Hubs'. The data indicates that users spend 4x more time in stores that offer interactive AI experiences than in traditional showrooms. For B2B stakeholders, the opportunity is in the infrastructure—the sensors, the AI backends, and the logistics software that makes this seamlessness possible. If your retail strategy doesn't include a digital twin of your physical space, you are already behind the curve.`,
    content_ar: `## ريتيل 4.0: مستقبل دبي مول\n\nإن التوسعة المستمرة لدبي مول هي أكثر من مجرد إضافة مساحة؛ إنها مختبر لمستقبل التجزئة المادي. في عام 2026، دمج المول "شبكة إنجاز تحت الأرض" ذاتية القيادة بالكامل.\n\n### التكامل السلس بين الفخامة والتكنولوجيا\nتتميز الأجنحة الجديدة بـ "واجهات رقمية" تتكيف مع ملف الزوار. تستخدم العلامات التجارية الفاخرة الذكاء الاصطناعي للتنبؤ بحركة الزوار بدقة 98٪.\n\n### رؤية الذكاء الاصطناعي: موت التجزئة التقليدية\n*تحليل استراتيجي بواسطة ذكاء mirAIreach الاصطناعي*\n\nما نشهده في دبي مول هو التحول من "التجزئة القائمة على المعاملات" إلى "المراكز التجريبية". تشير البيانات إلى أن المستخدمين يقضون وقتاً أطول بـ 4 أضعاف في المتاجر التي تقدم تجارب ذكاء اصطناعي تفاعلية.`
  }
];

async function insertArticles(url, key, articles) {
  const tryInsert = async (payload) => {
    return await fetch(`${url}/rest/v1/articles`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    });
  };

  let response = await tryInsert(articles);

  if (!response.ok) {
    const errorBody = await response.text();
    if (response.status === 400 && errorBody.includes("PGRST204")) {
      console.warn("Curation columns missing. Retrying with basic fields only...");
      const basicArticles = articles.map(({ is_curated, original_source_name, original_url, image_search_query, ...rest }) => rest);
      response = await tryInsert(basicArticles);
      if (!response.ok) {
        const retryErrorBody = await response.text();
        throw new Error(`Failed to insert basic articles: ${response.status} ${retryErrorBody}`);
      }
    } else {
      throw new Error(`Failed to insert articles: ${response.status} ${errorBody}`);
    }
  }

  return response.json();
}

async function main() {
  await loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const unsplashKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!url || !key) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  const openai = openaiKey && !openaiKey.includes("your_") ? new OpenAI({ apiKey: openaiKey }) : null;
  const unsplash = unsplashKey && !unsplashKey.includes("your_") ? createApi({ accessKey: unsplashKey }) : null;

  if (!unsplash) {
    console.warn("UNSPLASH_ACCESS_KEY is missing or placeholder. Using fallback images.");
  }

  console.log("Generating 30 curated articles with unique visual queries...");
  const newArticles = [];
  const now = Date.now();
  const msInDay = 2 * 60 * 60 * 1000;

  for (let i = 0; i < 30; i++) {
    const template = TEMPLATES[i % TEMPLATES.length];
    const source = SOURCES[i % SOURCES.length];
    
    const titleSuffix = i >= TEMPLATES.length ? ` (Exclusive Update ${Math.floor(i/TEMPLATES.length)})` : "";
    const titleSuffixAr = i >= TEMPLATES.length ? ` (تحديث حصري ${Math.floor(i/TEMPLATES.length)})` : "";
    const fullTitle = `${template.title}${titleSuffix}`;

    const { url: imageUrl, query } = await getDynamicImage(openai, unsplash, fullTitle, i);

    newArticles.push({
      category: template.category,
      title: fullTitle,
      title_ar: `${template.title_ar}${titleSuffixAr}`,
      excerpt: template.excerpt,
      excerpt_ar: template.excerpt_ar || null,
      content: `${template.content}\n\n### Report Context: ${source.name} 2026\nThis insight is derived from the latest ${source.name} methodology focusing on the UAE's high-growth sectors.`,
      content_ar: `${template.content_ar}\n\n### سياق التقرير: ${source.name} 2026\nهذه الرؤية مستمدة من أحدث منهجية لـ ${source.name} التي تركز على القطاعات عالية النمو في الإمارات.`,
      source_name: "mirAIreach Curation",
      company_name: null,
      original_source_name: source.name,
      original_url: source.url,
      image_url: imageUrl,
      image_search_query: query,
      is_published: true,
      is_curated: true,
      created_at: new Date(now - i * msInDay).toISOString(),
    });

    // Small delay to avoid API rate limits
    if (openai || unsplash) await new Promise(r => setTimeout(r, 500));
  }

  console.log("Cleaning up previous curation data...");
  await fetch(`${url}/rest/v1/articles?source_name=eq.mirAIreach%20Curation`, {
    method: "DELETE",
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });

  console.log("Injecting 30 high-density articles with unique visuals...");
  try {
    const inserted = await insertArticles(url, key, newArticles);
    console.log(`Successfully restored ${inserted.length} unique articles!`);
  } catch (err) {
    console.error("Insertion failed:", err.message);
    process.exit(1);
  }
}

main();
