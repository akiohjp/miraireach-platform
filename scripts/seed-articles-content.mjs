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

const longFormContents = [
  {
    title: "Enterprise AI Marketing in Dubai Enters a Precision Era",
    title_ja: "ドバイのプレミアム・ダイニング市場におけるAIO（AI検索最適化）戦略",
    excerpt: "Regional decision-makers are reallocating media budgets toward data-centric programs.",
    excerpt_ja: "検索エンジンから回答エンジンへ。ドバイの高級日本食レストランがAI時代の発見性を勝ち取り、高単価なゲストを獲得するための実践的なAIOプレイブック。",
    content: `# Enterprise AI Marketing in Dubai Enters a Precision Era

Regional decision-makers are reallocating media budgets toward data-centric programs that unify intent signals, multilingual personalization, and revenue attribution across complex stakeholder journeys.`,
    content_ja: `# ドバイのプレミアム・ダイニング市場におけるAIO（AI検索最適化）戦略

ドバイの高級ダイニング市場は、従来のキーワードベースの検索から、**「回答エンジン」による発見性**へとシフトしています。`,
  },
  {
    title: "Multi-Brand Cloud Kitchen Expansion: Poke Bowls and Katsu Curry",
    title_ja: "クラウドキッチンによる多ブランド展開：ドバイでのスケーリング戦略",
    excerpt: "How cloud kitchens in Dubai can scale while preserving margin and quality.",
    excerpt_ja: "ドバイのデリバリー需要を全方位でキャッチする。品質、信頼性、利益率を維持しながら、自動化を通じてブランドを拡大する方法。",
    content: `# Multi-Brand Cloud Kitchen Expansion...`,
    content_ja: `# クラウドキッチンによる多ブランド展開：ドバイでのスケーリング戦略...`,
  },
  {
    title: "Precision Lead Generation and Content Pipelines for B2B Growth",
    title_ja: "B2Bエンタープライズ成長のための高精度リード獲得とコンテンツ・パイプライン",
    excerpt: "A field-tested framework for enterprise-grade lead generation in Dubai.",
    excerpt_ja: "ドバイの複雑な意思決定プロセスを攻略する。精密なターゲティング、コンテンツ・アーキテクチャ、およびパイプラインを組み合わせた実戦的フレームワーク。",
    content: `# Precision Lead Generation...`,
    content_ja: `# B2Bエンタープライズ成長のための高精度リード獲得とコンテンツ・パイプライン...`,
  },
  {
    title: "Integrated AI Marketing Operating System for Consumer Enterprises",
    title_ja: "ドバイの消費者向け企業のための統合AIマーケティング・オペレーティングシステム",
    excerpt: "Advanced operating model for luxury hospitality and retail groups.",
    excerpt_ja: "ラグジュアリー・ホスピタリティや小売グループ向けの高度な運用モデル。統合されたAIマーケティングを実現。",
    content: `# Integrated AI Marketing...`,
    content_ja: `# ドバイの消費者向け企業のための統合AIマーケティング・オペレーティングシステム...`,
  },
  {
    title: "From Discovery to Revenue: A Cross-Functional AIO Playbook",
    title_ja: "発見から収益へ：ドバイにおけるクロスファンクショナルなAIOプレイブック",
    excerpt: "Strategic roadmap for cross-functional teams to turn discovery into revenue.",
    excerpt_ja: "F&Bおよび小売セクターのチームが、AIによる発見を継続的な収益に変えるための戦略ロードマップ。",
    content: `# From Discovery to Revenue...`,
    content_ja: `# 発見から収益へ：ドバイにおけるクロスファンクショナルなAIOプレイブック...`,
  },
];

async function getLatestFiveArticles(url, key) {
  const response = await fetch(
    `${url}/rest/v1/articles?select=id,title&is_published=eq.true&order=created_at.desc,id.desc&limit=5`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to fetch articles: ${response.status} ${body}`);
  }

  return response.json();
}

async function updateArticle(url, key, id, payload) {
  const response = await fetch(`${url}/rest/v1/articles?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Failed to update article ${id}: ${response.status} ${body}`);
  }

  return response.json();
}

async function main() {
  await loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.",
    );
  }

  const articles = await getLatestFiveArticles(url, key);
  if (!Array.isArray(articles) || articles.length === 0) {
    throw new Error("No published articles found to update.");
  }

  const targets = articles.slice(0, 5);
  for (let i = 0; i < targets.length; i += 1) {
    const article = targets[i];
    const contentPack = longFormContents[i % longFormContents.length];
    const updated = await updateArticle(url, key, article.id, {
      title: contentPack.title,
      title_ja: contentPack.title_ja,
      excerpt: contentPack.excerpt,
      excerpt_ja: contentPack.excerpt_ja,
      content: contentPack.content,
      content_ja: contentPack.content_ja,
    });

    const row = updated[0];
    console.log(
      `Updated article ${row.id}: ${row.title.slice(0, 70)}... (bilingual contents set)`,
    );
  }

  console.log("Completed bilingual content updates for latest five articles.");
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
