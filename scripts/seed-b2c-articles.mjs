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

const B2C_CATEGORIES = [
  "Gourmet & Dining",
  "Lifestyle & Travel",
  "Local Guide",
  "Trend Curation"
];

const B2C_IMAGE_POOLS = {
  "Gourmet & Dining": [
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80"
  ],
  "Lifestyle & Travel": [
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80"
  ],
  "Local Guide": [
    "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1489087358787-16c562069904?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=80"
  ],
  "Trend Curation": [
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1600&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80"
  ]
};

const B2C_TEMPLATES = [
  {
    category: "Gourmet & Dining",
    title: "Top 5 Secret Steakhouses in Dubai Every Meat Lover Must Visit",
    title_ar: "أفضل 5 مطاعم ستيك سرية في دبي يجب على كل محب للحوم زيارتها",
    excerpt: "From hidden gems in Al Quoz to rooftop luxury, here is your ultimate guide to the best cuts in the city.",
    excerpt_ar: "من الجواهر الخفية في القوز إلى الفخامة فوق الأسطح، إليك دليلك النهائي لأفضل شرائح اللحم في المدينة.",
    content: `## The Meat Lover's Map\n\nDubai is world-famous for its dining scene, but the real magic often happens away from the main malls. We've curated the top 5 spots that prioritize flavor over flashy decor.\n\n### 1. The Hidden Butcher (Al Quoz)\nLocated in an industrial warehouse, this spot offers aged Wagyu that rivals any Michelin-starred venue.\n\n### 2. Smoke & Fire (JLT)\nA rustic approach to charcoal grilling with a view that never fails.\n\n### 3. Prime Cut (DIFC)\nWhile not 'secret', their secret menu for residents only is a game-changer.\n\n### 4. Nomad Grill\nAuthentic nomadic cooking styles brought to the heart of the city.\n\n### 5. Urban Ember\nThe best affordable steakhouse for those who know where to look.`,
    content_ar: `## خريطة محبي اللحوم\n\nتشتهر دبي عالمياً بمشهد المطاعم، لكن السحر الحقيقي غالباً ما يحدث بعيداً عن مراكز التسوق الرئيسية. لقد اخترنا أفضل 5 أماكن تعطي الأولوية للنكهة على الديكور المبهر.\n\n### 1. الجزار الخفي (القوز)\nيقع في مستودع صناعي، ويقدم واغيو معتق ينافس أي مكان حائز على نجمة ميشلان.\n\n### 2. الدخان والنار (JLT)\nنهج ريفي للشواء على الفحم مع إطلالة لا تفشل أبداً.\n\n### 3. برايم كت (DIFC)\nرغم أنه ليس "سرياً"، إلا أن قائمتهم السرية للمقيمين فقط تغير قواعد اللعبة.\n\n### 4. شواية البدوي\nأساليب طهي بدوية أصيلة تم جلبها إلى قلب المدينة.\n\n### 5. جمرة الحضر\nأفضل مطعم ستيك بأسعار معقولة لأولئك الذين يعرفون أين يبحثون.`
  },
  {
    category: "Lifestyle & Travel",
    title: "The Ultimate Weekend Staycation Guide: Luxury Without Leaving Dubai",
    title_ar: "الدليل النهائي لإقامة نهاية الأسبوع: الفخامة دون مغادرة دبي",
    excerpt: "Need a break? These 3 hotels offer the best escapes for residents looking for a quick luxury reset.",
    excerpt_ar: "هل تحتاج إلى استراحة؟ تقدم هذه الفنادق الثلاثة أفضل الهروب للمقيمين الذين يبحثون عن إعادة ضبط فاخرة سريعة.",
    content: `## Why Travel Far?\n\nSometimes the best vacation is just a 20-minute drive away. This weekend, skip the airport and check into one of these local icons.\n\n### 1. The Desert Oasis\nExperience the dunes in absolute comfort with private pools and falconry sessions.\n\n### 2. Palm Serenity\nA beach-front reset that feels like the Maldives, right on your doorstep.\n\n### 3. Creek Chic\nHistoric views meet modern tech for a staycation that celebrates Dubai's roots.`,
    content_ar: `## لماذا تسافر بعيداً؟\n\nأحياناً تكون أفضل عطلة على بعد 20 دقيقة فقط بالسيارة. في نهاية هذا الأسبوع، تخطى المطار وسجل وصولك في أحد هذه المعالم المحلية.\n\n### 1. واحة الصحراء\nاستمتع بالكثبان الرملية براحة تامة مع مسابح خاصة وجلسات صيد بالصقور.\n\n### 2. صفاء النخلة\nإعادة ضبط على شاطئ البحر تشعرك وكأنك في جزر المالديف، مباشرة على عتبة دارك.\n\n### 3. خور شيك\nتلتقي الإطلالات التاريخية مع التكنولوجيا الحديثة لإقامة تحتفل بجذور دبي.`
  },
  {
    category: "Local Guide",
    title: "The Most Instagrammable Spots in Dubai You've Never Heard Of",
    title_ar: "أكثر الأماكن الجديرة بالنشر على إنستغرام في دبي والتي لم تسمع بها من قبل",
    excerpt: "Move over Burj Khalifa. These architecture gems and hidden alleys are the real aesthetic heroes of 2026.",
    excerpt_ar: "تنحى يا برج خليفة. هذه الجواهر المعمارية والأزقة الخفية هي الأبطال الجماليون الحقيقيون لعام 2026.",
    content: `## Focus on the Aesthetic\n\nDubai is built for the camera. While everyone flocks to the fountains, we found the spots that will make your feed stand out.\n\n### 1. The Library Courtyard\nMinimalist architecture meets academic quietness. Perfect for soft-lit portraits.\n\n### 2. Satwa Street Art\nA vibrant explosion of local culture and color that most tourists miss.\n\n### 3. The Mirror Pavillion\nA temporary installation in the desert that reflects the horizon in impossible ways.`,
    content_ar: `## التركيز على الجمالية\n\nدبي مبنية للكاميرا. بينما يتدفق الجميع إلى النوافير، وجدنا الأماكن التي ستجعل صفحتك تبرز.\n\n### 1. ساحة المكتبة\nتلتقي العمارة البسيطة مع الهدوء الأكاديمي. مثالية للصور ذات الإضاءة الناعمة.\n\n### 2. فنون شارع السطوة\nانفجار نابض بالحياة للثقافة المحلية والألوان التي يفوتها معظم السياح.\n\n### 3. جناح المرايا\nتركيب مؤقت في الصحراء يعكس الأفق بطرق مستحيلة.`
  },
  {
    category: "Trend Curation",
    title: "What Global Media is Saying About Dubai's New Tech Wave",
    title_ar: "ماذا يقول الإعلام العالمي عن موجة التكنولوجيا الجديدة في دبي",
    excerpt: "From AI infrastructure to flying taxis, here is a roundup of how the world perceives the city's ambition.",
    excerpt_ar: "من البنية التحتية للذكاء الاصطناعي إلى التاكسي الطائر، إليك ملخص لكيفية رؤية العالم لطموح المدينة.",
    content: `## The World's Eyes on Us\n\nEvery week, a major publication features Dubai. But what is the recurring theme? It's not just oil or gold anymore—it's intelligence.\n\n### TechCrunch: The Silicon Oasis Rebirth\nHow Dubai is stealing the thunder from traditional tech hubs.\n\n### Forbes: The Regulatory Playground\nWhy startups prefer Dubai's clear AI laws over the EU's complexity.\n\n### Wired: The Future is Here\nAn analysis of the world's first fully autonomous logistics network in Jebel Ali.`,
    content_ar: `## عيون العالم علينا\n\nكل أسبوع، تنشر مطبوعة كبرى موضوعاً عن دبي. ولكن ما هو الموضوع المتكرر؟ لم يعد الأمر يتعلق فقط بالنفط أو الذهب بعد الآن - إنه الذكاء.\n\n### تك كرانش: ولادة واحة السيليكون من جديد\nكيف تسرق دبي الأضواء من مراكز التكنولوجيا التقليدية.\n\n### فوربس: ملعب التنظيم\nلماذا تفضل الشركات الناشئة قوانين الذكاء الاصطناعي الواضحة في دبي على تعقيد الاتحاد الأوروبي.\n\n### وايرد: المستقبل هنا\nتحليل لأول شبكة لوجستية مستقلة بالكامل في العالم في جبل علي.`
  }
];

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

  console.log("Generating 15 catchy B2C and lifestyle articles...");
  const newArticles = [];
  const now = Date.now();
  const msInDay = 24 * 60 * 60 * 1000;

  for (let i = 0; i < 15; i++) {
    const template = B2C_TEMPLATES[i % B2C_TEMPLATES.length];
    const category = template.category;
    const images = B2C_IMAGE_POOLS[category];
    const imageUrl = images[i % images.length];

    newArticles.push({
      category: category,
      title: i > 3 ? `${template.title} #${i}` : template.title,
      title_ar: i > 3 ? `${template.title_ar} #${i}` : template.title_ar,
      excerpt: template.excerpt,
      excerpt_ar: template.excerpt_ar,
      content: template.content,
      content_ar: template.content_ar,
      source_name: "mirAIreach Curation",
      company_name: "Trend Hub Dubai",
      image_url: imageUrl,
      is_published: true,
      created_at: new Date(now - i * msInDay).toISOString(),
    });
  }

  console.log("Appending B2C articles to Supabase...");
  try {
    const inserted = await insertArticles(url, key, newArticles);
    console.log(`Successfully appended ${inserted.length} catchy B2C articles!`);
  } catch (err) {
    console.error("Insertion failed:", err.message);
    process.exit(1);
  }
}

main();
