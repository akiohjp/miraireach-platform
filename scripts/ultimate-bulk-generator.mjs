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
    console.warn("No .env.local found");
  }
}

const topics = ["ChatGPT", "Claude 3.5", "Gemini", "AI Overview (AIO)", "GEO", "動画生成AI", "予測分析AI", "音声AI"];
const actions = ["の基本と活用法", "で業務を50%自動化する手順", "を使ったコスト削減戦略", "導入で失敗しないためのガイド", "の最新アップデート解説", "を使ったマーケティング戦術"];
const targets = ["（ドバイ不動産向け）", "（中小企業オーナー向け）", "（飲食店・ホスピタリティ向け）", "（フリーゾーン法人向け）", "（初心者向け完全版）"];

function generateBody(topic, action, target) {
  return `## ${topic}${action}${target}\n\nドバイおよびUAEのビジネスシーンにおいて、**${topic}**の重要性は日々高まっています。本レポートでは、${target}の方々が${topic}を効果的に導入し、ビジネスの成長を加速させるための具体的なロードマップを提示します。\n\n### 1. 導入の背景と戦略的メリット\n現在、UAE政府が進めるD33アジェンダなどのデジタル経済戦略により、企業には高度なAI活用が求められています。${topic}を${action}に組み込むことで、競合他社に対する圧倒的な優位性を築くことが可能です。特に${target}においては、限られたリソースで最大の結果を出すための強力な武器となります。\n\n### 2. 具体的なステップとチェックリスト\n- **初期評価**: 現在の業務フローを分析し、${topic}が最も効果を発揮するポイントを特定します。\n- **プロンプトエンジニアリング**: ${target}特有のニーズに基づいた、精度の高い指示（プロンプト）を設計します。\n- **自動化の実装**: ${action}を通じて、手作業を削減し、人間がより創造的なタスクに集中できる環境を整えます。\n\n### 3. 今後の展望とROIの最大化\n2026年に向けて、AI技術はさらに進化を続けます。${topic}をいち早く導入した${target}は、コスト削減だけでなく、顧客体験の向上や新規事業の創出においても大きな成果を上げることができるでしょう。当メディアでは、引き続き最新の${topic}関連ニュースを追い、皆様のDX成功をサポートしてまいります。\n\n### まとめ\n${topic}${action}${target}という取り組みは、もはや実験のフェーズを過ぎ、実務における「標準」となりつつあります。今日から最初の一歩を踏み出し、AI時代の勝者を目指しましょう。`;
}

async function main() {
  await loadEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) throw new Error("Missing config");

  // 1. Fetch current titles to avoid duplication
  const titlesRes = await fetch(`${url}/rest/v1/articles?select=title`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` }
  });
  const existingData = await titlesRes.json();
  const existingTitles = new Set(existingData.map(a => a.title));

  console.log("🚀  STARTING ULTIMATE BULK GENERATOR (50 ARTICLES)...");

  let addedCount = 0;
  let attempts = 0;
  const maxAttempts = 500;

  while (addedCount < 50 && attempts < maxAttempts) {
    attempts++;
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const target = targets[Math.floor(Math.random() * targets.length)];
    
    const title = `${topic}${action}${target}`;
    
    if (existingTitles.has(title)) continue;
    
    existingTitles.add(title);
    
    // Categorize based on keywords
    let category = "AI Tools & Tactics";
    if (target.includes("不動産")) category = "AI x Real Estate";
    if (target.includes("飲食店") || target.includes("ホスピタリティ")) category = "AI x Hospitality";
    if (target.includes("法人") || target.includes("オーナー")) category = "AI x Corporate";
    if (target.includes("初心者")) category = "AI Starter Guide";

    const payload = {
      category: category,
      title: title,
      excerpt: `${topic}${action}${target}に関する詳細な実践ガイドと分析レポート。`,
      content: generateBody(topic, action, target),
      content_ar: `[Arabic: ${title}]`,
      source_name: "mirAIreach Generator",
      image_url: `https://picsum.photos/seed/algo-${Date.now()}-${addedCount}/800/600`,
      is_published: true,
      created_at: new Date().toISOString()
    };

    const res = await fetch(`${url}/rest/v1/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: key, Authorization: `Bearer ${key}` },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      process.stdout.write(".");
      addedCount++;
    } else {
      console.error(`\n❌ Failed: ${title}`);
    }
  }

  console.log(`\n\n✨ 自動生成により${addedCount}件の記事を追加しました。`);
}

main();
