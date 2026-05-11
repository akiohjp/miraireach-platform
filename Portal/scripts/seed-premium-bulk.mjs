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

const STATIC_IMAGE_POOLS = {
  "Gourmet & Dining": [
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9",
    "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
    "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327",
    "https://images.unsplash.com/photo-1493770348161-369560ae357d",
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    "https://images.unsplash.com/photo-1551024506-0bccd828d307",
    "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9",
    "https://images.unsplash.com/photo-1482049016688-2d3e1b311543",
    "https://images.unsplash.com/photo-1484723088339-fe28233e561e",
    "https://images.unsplash.com/photo-1490645935967-10de6ba17051",
    "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
    "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0",
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
    "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38"
  ],
  "AI & Deep Tech": [
    "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
    "https://images.unsplash.com/photo-1518770660439-4636190af475",
    "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
    "https://images.unsplash.com/photo-1525338078858-8ed653b17675",
    "https://images.unsplash.com/photo-1504384308090-c89e12075d19",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
    "https://images.unsplash.com/photo-1516116216624-53e697fedbea",
    "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb",
    "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
    "https://images.unsplash.com/photo-1558494949-ef0109123b06",
    "https://images.unsplash.com/photo-1504164996022-09080787b6b3",
    "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0",
    "https://images.unsplash.com/photo-1507146426996-ef05306b995a",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
    "https://images.unsplash.com/photo-1518433278981-67dfef56079b",
    "https://images.unsplash.com/photo-1581092160562-40aa08e78837"
  ],
  "Real Estate & PropTech": [
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716",
    "https://images.unsplash.com/photo-1503387762-592dee58c460",
    "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    "https://images.unsplash.com/photo-1460317442991-0ec209397118",
    "https://images.unsplash.com/photo-1513584684374-8bdb7483ef8f",
    "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff",
    "https://images.unsplash.com/photo-1493397212122-2b85dda8106b",
    "https://images.unsplash.com/photo-1501183007986-d0d080b147f9",
    "https://images.unsplash.com/photo-1515263487990-61b07816b324",
    "https://images.unsplash.com/photo-1475855581690-80af145cd335",
    "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6",
    "https://images.unsplash.com/photo-1523217582562-09d0def993a6",
    "https://images.unsplash.com/photo-1512915922686-57c11ff9b6b0",
    "https://images.unsplash.com/photo-1505691938895-1758d7eaa511",
    "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8"
  ],
  "Business & Technology": [
    "https://images.unsplash.com/photo-1497366216548-37526070297c",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72",
    "https://images.unsplash.com/photo-1557804506-669a67965ba0",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
    "https://images.unsplash.com/photo-1454165833267-033f235ff27d",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
    "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0",
    "https://images.unsplash.com/photo-1542744094-3a31f08e78ec",
    "https://images.unsplash.com/photo-1551434678-e076c223a692",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
    "https://images.unsplash.com/photo-1504384308090-c89e12075d19",
    "https://images.unsplash.com/photo-1491975474562-1f4e30bc9468",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
    "https://images.unsplash.com/photo-1553877522-43269d4ea984",
    "https://images.unsplash.com/photo-1552664730-d307ca884978",
    "https://images.unsplash.com/photo-1434626881859-194d67b2b86f",
    "https://images.unsplash.com/photo-1552581234-26160f608093",
    "https://images.unsplash.com/photo-1521791136064-7986c2920216"
  ],
  "Lifestyle & Travel": [
    "https://images.unsplash.com/photo-1518186239751-2477cf41d49e",
    "https://images.unsplash.com/photo-1445019980597-93fa8acb246c",
    "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecee",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    "https://images.unsplash.com/photo-1502784444187-359ac186c5bb",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1",
    "https://images.unsplash.com/photo-1530789253508-20299e9000a6",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
    "https://images.unsplash.com/photo-1473625247510-8ceb1760943f",
    "https://images.unsplash.com/photo-1533105079780-92b9be482077",
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    "https://images.unsplash.com/photo-1493246507139-91e8bef99c02",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
    "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
    "https://images.unsplash.com/photo-1500673922987-e212871fec22",
    "https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6",
    "https://images.unsplash.com/photo-1502120924758-c02da0471947",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e"
  ],
  "Logistics & Supply Chain": [
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d",
    "https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b",
    "https://images.unsplash.com/photo-1521331015254-184518349272",
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec",
    "https://images.unsplash.com/photo-1519003722824-194d4455a60c",
    "https://images.unsplash.com/photo-1524514587686-8200f623b90f",
    "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3",
    "https://images.unsplash.com/photo-1506784923340-39401777264a",
    "https://images.unsplash.com/photo-1513151239018-d457d5724a12",
    "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a",
    "https://images.unsplash.com/photo-1515516089376-88db1e26e9c0",
    "https://images.unsplash.com/photo-1522071823991-b99c223a656e",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
    "https://images.unsplash.com/photo-1518135746617-646069796e6a",
    "https://images.unsplash.com/photo-148336675901f-15775a109721",
    "https://images.unsplash.com/photo-1542744173-8e7e53415bb0",
    "https://images.unsplash.com/photo-1553028826-f4804a6dba3b",
    "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122",
    "https://images.unsplash.com/photo-1516321497487-e288fb19713f",
    "https://images.unsplash.com/photo-1497366216548-37526070297c"
  ],
  "FinTech & Crypto": [
    "https://images.unsplash.com/photo-1621761191319-c6fb62004040",
    "https://images.unsplash.com/photo-1518186239751-2477cf41d49e",
    "https://images.unsplash.com/photo-1605792657660-596af903962a",
    "https://images.unsplash.com/photo-1624555130581-1d9cca783bc0",
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0",
    "https://images.unsplash.com/photo-1633156191779-2a43217d848e",
    "https://images.unsplash.com/photo-1621416848446-9fba84a0f44d",
    "https://images.unsplash.com/photo-1638913660106-73b4bac0da09",
    "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d",
    "https://images.unsplash.com/photo-1642104704074-907c0698cbd9",
    "https://images.unsplash.com/photo-1622633054716-6811ba2847c1",
    "https://images.unsplash.com/photo-1634704784915-aacf363b021f",
    "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d",
    "https://images.unsplash.com/photo-1639151240321-0a6e3c0d4538",
    "https://images.unsplash.com/photo-1631603090989-93f9ef6f9d80",
    "https://images.unsplash.com/photo-1644335492336-d4e5f039433a",
    "https://images.unsplash.com/photo-1639322537228-f710d846310a",
    "https://images.unsplash.com/photo-1622790698141-94e30457ef12",
    "https://images.unsplash.com/photo-1633156191779-2a43217d848e",
    "https://images.unsplash.com/photo-1625806319395-96081223df05"
  ],
  "Food & Culture": [
    "https://images.unsplash.com/photo-1559339352-11d035aa65de",
    "https://images.unsplash.com/photo-1590089052664-8fbf74677a3b",
    "https://images.unsplash.com/photo-1589113331629-113b1d58d973",
    "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91",
    "https://images.unsplash.com/photo-1599481238505-b8b0537a3f77",
    "https://images.unsplash.com/photo-1567160563686-24024bc652c4",
    "https://images.unsplash.com/photo-1541544741938-0af808871cc0",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    "https://images.unsplash.com/photo-1498654077810-12c21d4d6dc3",
    "https://images.unsplash.com/photo-1473093295043-cdd812d0e601",
    "https://images.unsplash.com/photo-1525755662778-989d0524087e",
    "https://images.unsplash.com/photo-1490818387583-1baba5e638af",
    "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94",
    "https://images.unsplash.com/photo-149485981460c-38af4c370741",
    "https://images.unsplash.com/photo-1481931098730-1181134857b7",
    "https://images.unsplash.com/photo-1504387854560-3f77bb9c5126",
    "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2",
    "https://images.unsplash.com/photo-1506354666786-959d6d497f1a",
    "https://images.unsplash.com/photo-1512101177083-c7d79427071e",
    "https://images.unsplash.com/photo-1464306311795-997483974834"
  ]
};

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

    // Shuffling and Sequential Logic for images
    if (!global.poolIndices) global.poolIndices = {};
    if (!global.shuffledPools) global.shuffledPools = {};

    const poolKey = template.category;
    const pool = STATIC_IMAGE_POOLS[poolKey] || STATIC_IMAGE_POOLS["Business & Technology"];
    
    if (!global.shuffledPools[poolKey] || global.poolIndices[poolKey] >= global.shuffledPools[poolKey].length) {
      function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }
      global.shuffledPools[poolKey] = shuffle([...pool]);
      global.poolIndices[poolKey] = 0;
    }

    const baseImage = global.shuffledPools[poolKey][global.poolIndices[poolKey]];
    global.poolIndices[poolKey]++;

    const payload = {
      category: template.category,
      source_name: source,
      title: title,
      title_ar: title_ar,
      excerpt: `Strategic deep dive into ${topic} and its impact on the UAE market.`,
      excerpt_ar: `نظرة استراتيجية عميقة في ${topic} وتأثيرها على سوق الإمارات العربية المتحدة.`,
      content: template.content_en(topic),
      content_ar: template.content_ar(topic),
      image_url: `${baseImage}?auto=format&fit=crop&w=1600&q=80&sig=${Date.now()}_${Math.random().toString(36).substring(7)}`,
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
