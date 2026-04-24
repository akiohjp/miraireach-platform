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
    title_ja: "クラウドキッチンによる多ブランド展開：精密アナリティクス",
    excerpt: "How cloud kitchens in Dubai can scale while preserving margin and quality through operational AI.",
    excerpt_ja: "ドバイのクラウドキッチンが、運用AIを通じて利益率と品質を維持しながら規模を拡大する方法。",
    content: "## The F&B Transformation\n\nDubai's F&B sector is shifting towards hyper-optimized delivery models. By analyzing vast amounts of consumer data, ghost kitchens can predict demand down to the hour.\n\n## Cost Optimization\nIntegrating supply chain AI reduces food waste by up to 35%, drastically improving unit economics in a highly competitive market.",
    content_ja: "## F&Bの変革\n\nドバイのF&Bセクターは、超最適化されたデリバリーモデルへと移行しています。膨大な消費者データを分析することで、ゴーストキッチンは時間単位で需要を予測できます。\n\n## コスト最適化\nサプライチェーンAIを統合することで、食品ロスを最大35%削減し、競争の激しい市場におけるユニットエコノミクスを劇的に改善します。"
  },
  "Retail": {
    title: "Omnichannel Personalization in UAE's Luxury Retail",
    title_ja: "UAEのラグジュアリー小売におけるオムニチャネル・パーソナライゼーション",
    excerpt: "Redefining the shopping experience by bridging offline boutiques and digital platforms.",
    excerpt_ja: "実店舗のブティックとデジタルプラットフォームの垣根を越え、ショッピング体験を再定義する。",
    content: "## The New Luxury Standard\n\nConsumers expect seamless transitions between Instagram discovery, WhatsApp concierge services, and VIP in-store experiences. \n\n## AI in Clienteling\nRetailers are deploying AI to track micro-preferences, allowing sales associates to act as hyper-informed personal shoppers, increasing AOV (Average Order Value) significantly.",
    content_ja: "## ラグジュアリーの新たな基準\n\n消費者は、Instagramでの発見、WhatsAppのコンシェルジュサービス、そしてVIP向けの実店舗体験がシームレスに繋がることを期待しています。\n\n## クライアンテリングにおけるAI\n小売業者はAIを導入して細かな好みを追跡しており、これにより販売員は非常に情報通のパーソナルショッパーとして機能し、AOV（平均注文額）を大幅に向上させています。"
  },
  "AI Marketing": {
    title: "Enterprise AI Marketing: From Search to Answer Engines",
    title_ja: "エンタープライズAIマーケティング：検索から回答エンジンへ",
    excerpt: "Optimizing for LLMs is the new frontier for B2B lead generation in the GCC.",
    excerpt_ja: "GCC諸国のB2Bリード獲得において、LLMへの最適化が新たなフロンティアとなっている。",
    content: "## The Shift to AIO\n\nTraditional SEO is losing ground to Answer Engine Optimization (AIO). B2B buyers now use AI tools to generate vendor shortlists.\n\n## Data Structuring\nCompanies must structure their content as entities that LLMs can easily ingest. This requires a fundamental shift from keyword stuffing to deep, authoritative knowledge graphs.",
    content_ja: "## AIOへのシフト\n\n従来のSEOは、回答エンジン最適化（AIO）にその座を奪われつつあります。現在、B2BバイヤーはAIツールを使ってベンダーのショートリストを作成しています。\n\n## データ構造化\n企業は、LLMが容易に取り込めるエンティティとしてコンテンツを構造化する必要があります。これには、キーワードの詰め込みから、深く権威あるナレッジグラフへの根本的な転換が求められます。"
  },
  "Real Estate": {
    title: "PropTech 2026: Predictive Pricing Models in Dubai",
    title_ja: "PropTech 2026：ドバイにおける予測価格モデリング",
    excerpt: "How machine learning is bringing unprecedented transparency to UAE property valuations.",
    excerpt_ja: "機械学習がUAEの不動産評価にいかに前例のない透明性をもたらしているか。",
    content: "## Data-Driven Real Estate\n\nOff-plan and secondary market pricing is increasingly dictated by algorithmic models that analyze global capital flows, local infrastructure developments, and historical yields.\n\n## Investor Confidence\nThis transparency attracts institutional investors who rely on quantified risk models, stabilizing a historically volatile asset class.",
    content_ja: "## データ駆動型不動産\n\nオフプランおよび流通市場の価格は、グローバルな資本フロー、地域のインフラ開発、歴史的な利回りを分析するアルゴリズムモデルによってますます決定されるようになっています。\n\n## 投資家の信頼\nこの透明性は、定量化されたリスクモデルに依存する機関投資家を引き付け、歴史的に変動の激しかったアセットクラスを安定させます。"
  },
  "Tech & Innovation": {
    title: "Automating the Enterprise: RPA and Generative AI Synergy",
    title_ja: "エンタープライズの自動化：RPAと生成AIのシナジー",
    excerpt: "Combining robotic process automation with LLMs to eliminate back-office friction.",
    excerpt_ja: "ロボティック・プロセス・オートメーションとLLMを組み合わせ、バックオフィスの摩擦を排除する。",
    content: "## Beyond Simple Scripts\n\nWhile RPA handles structured, repetitive tasks, generative AI brings cognitive capabilities to unstructured data processing like contracts and customer emails.\n\n## The Autonomous Enterprise\nThis synergy paves the way for the autonomous enterprise, reducing operational overhead in Dubai free zones by up to 40%.",
    content_ja: "## 単純なスクリプトを超えて\n\nRPAは構造化された反復的なタスクを処理しますが、生成AIは契約書や顧客からのメールなどの非構造化データ処理に認知機能をもたらします。\n\n## 自律型エンタープライズ\nこのシナジーは自律型エンタープライズへの道を切り開き、ドバイのフリーゾーンにおける運用オーバーヘッドを最大40%削減します。"
  }
};

const modifiers = [
  { prefix: "Case Study: ", suffix: " in Practice" },
  { prefix: "Future Outlook: ", suffix: " Trends for 2026" },
  { prefix: "Executive Brief: ", suffix: " Strategies" },
  { prefix: "Deep Dive: ", suffix: " Dynamics" },
  { prefix: "Report: ", suffix: " Analysis" }
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
      title_ja: `【${modifier.prefix.trim()}】${template.title_ja}`,
      excerpt: template.excerpt,
      excerpt_ja: template.excerpt_ja,
      content: `# ${modifier.prefix}${template.title}\n\n${template.content}`,
      content_ja: `# ${template.title_ja}\n\n${template.content_ja}`,
      source_name: "mirAIreach Research",
      image_url: imageUrl,
      is_published: true,
      // Stagger creation dates so they show up nicely in the timeline
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

  console.log("Generating 25 diverse bilingual articles...");
  const newArticles = generateArticles(25);

  console.log("Attempting to insert into Supabase...");
  try {
    const inserted = await insertArticles(url, key, newArticles);
    console.log(`Successfully inserted ${inserted.length} articles!`);
  } catch (err) {
    console.error("\n========================================================");
    console.error("❌ DATABASE INSERTION FAILED");
    console.error("========================================================");
    if (err.message.includes("42703") || err.message.includes("PGRST204") || err.message.includes("column articles.title_ja does not exist") || err.message.includes("Could not find the 'title_ja' column") || err.message.includes("content_ja")) {
      console.error("\n[CRITICAL ERROR] The Japanese columns (title_ja, excerpt_ja, content_ja) DO NOT EXIST in your Supabase database.");
      console.error("Please run the following SQL command in your Supabase SQL Editor:");
      console.error(`
      ALTER TABLE articles 
      ADD COLUMN title_ja text,
      ADD COLUMN excerpt_ja text,
      ADD COLUMN content_ja text;
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
