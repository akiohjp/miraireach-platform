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
    title_ja: "ドバイのエンタープライズAIマーケティングがもたらす超高精度時代",
    excerpt: "Regional decision-makers are reallocating media budgets toward data-centric programs that unify intent signals and multilingual personalization.",
    excerpt_ja: "中東の意思決定者たちは、検索意図のシグナルと多言語パーソナライゼーションを統合するデータ中心のプログラムへとメディア予算を再配分しています。",
    content: `# Enterprise AI Marketing in Dubai Enters a Precision Era

Dubai's marketing landscape is rapidly shifting. Regional decision-makers are reallocating media budgets toward data-centric programs that unify intent signals, multilingual personalization, and revenue attribution across complex stakeholder journeys.

## The Shift from Search to Discovery
Traditional search engine optimization is being supplemented, and in some cases replaced, by AI-driven discovery platforms. Large Language Models (LLMs) now serve as the primary research tool for enterprise procurement and luxury consumer behavior alike. Brands that optimize for "Answer Engine Optimization" (AEO) are capturing high-intent traffic before it ever reaches a traditional search results page.

## Multilingual Personalization at Scale
In a hyper-diverse market like the UAE, generic messaging no longer converts. AI systems enable real-time translation and cultural nuance adaptation, allowing luxury and hospitality brands to speak directly to GCC nationals, European expatriates, and Asian tourists simultaneously with localized relevance.

## Strategic Imperatives
- Integrate customer data platforms with AI orchestration layers.
- Develop entity-rich content that LLMs can easily parse and reference.
- Shift KPIs from impressions and clicks to qualified pipeline and revenue attribution.`,
    content_ja: `# ドバイのエンタープライズAIマーケティングがもたらす超高精度時代

ドバイのマーケティング環境は急速に変化しています。地域の意思決定者たちは、複雑なステークホルダーのカスタマージャーニー全体で検索意図のシグナル、多言語パーソナライゼーション、収益の帰属を統合する、データ中心のプログラムへとメディア予算を再配分しています。

## 検索から「発見」へのシフト
従来の検索エンジン最適化（SEO）は、AI主導の発見プラットフォームによって補完され、場合によっては置き換えられつつあります。大規模言語モデル（LLM）は現在、企業の調達やラグジュアリー消費者の行動において主要なリサーチツールとして機能しています。「回答エンジン最適化（AEO）」に最適化するブランドは、従来の検索結果ページに到達する前の、購買意欲の高いトラフィックを獲得しています。

## スケールする多言語パーソナライゼーション
UAEのような極めて多様な市場において、一般的なメッセージングではもはやコンバージョンは得られません。AIシステムはリアルタイムの翻訳と文化的なニュアンスへの適応を可能にし、ラグジュアリーブランドやホスピタリティブランドがGCC諸国民、ヨーロッパの駐在員、アジアの観光客に対し、同時にローカライズされた関連性を持って直接語りかけることを可能にします。

## 戦略的必須事項
- カスタマーデータプラットフォームとAIオーケストレーション層を統合する。
- LLMが容易に解析および参照できる、エンティティ豊富なコンテンツを開発する。
- KPIをインプレッションやクリックから、クオリファイされたパイプラインと収益の帰属へと移行する。`,
  },
  {
    title: "Multi-Brand Cloud Kitchen Expansion: Poke Bowls and Katsu Curry",
    title_ja: "クラウドキッチンによる多ブランド展開：ポキボウルとカツカレーのドバイスケーリング戦略",
    excerpt: "How cloud kitchens in Dubai can scale while preserving margin and quality.",
    excerpt_ja: "ドバイのクラウドキッチンが、品質、信頼性、利益率を維持しながら自動化を通じてブランドを拡大する方法。",
    content: `# Multi-Brand Cloud Kitchen Expansion: Poke Bowls and Katsu Curry

The F&B tech ecosystem in Dubai has evolved beyond simple aggregation. The new frontier is the highly optimized, multi-brand cloud kitchen capable of servicing diverse culinary demands from a single operational footprint.

## The Unit Economics of Delivery
With delivery aggregators commanding substantial commissions, margin preservation is the primary challenge for F&B operators. By layering multiple complementary brands—such as a healthy Poke Bowl concept alongside an indulgent Japanese Katsu Curry brand—operators can maximize kitchen utilization, cross-utilize ingredients, and optimize labor costs.

## AI in Kitchen Operations
Advanced operators are deploying predictive AI to manage inventory, forecast demand spikes based on local events or weather patterns, and dynamically adjust preparation times to ensure the food arrives in optimal condition. This reduces food waste by up to 30% and significantly improves customer satisfaction scores.`,
    content_ja: `# クラウドキッチンによる多ブランド展開：ポキボウルとカツカレーのドバイスケーリング戦略

ドバイのF&Bテック・エコシステムは、単なるフードデリバリーの集約を超えて進化しています。新たなフロンティアは、単一のオペレーション拠点から多様な料理の需要に応えることができる、高度に最適化された多ブランド展開のクラウドキッチンです。

## デリバリーのユニットエコノミクス
デリバリーアグリゲーターが多額の手数料を取る中、利益率の維持がF&B事業者にとっての最大の課題です。ヘルシーなポキボウルのコンセプトと、満足感のある日本のカツカレーブランドなど、複数の補完的なブランドを重ね合わせることで、事業者はキッチンの稼働率を最大化し、食材を相互利用し、人件費を最適化できます。

## キッチンオペレーションにおけるAI
先進的な事業者は、予測AIを導入して在庫を管理し、地域のイベントや天候パターンに基づいて需要の急増を予測し、調理時間を動的に調整して食事が最適な状態で届くようにしています。これにより、食品ロスが最大30%削減され、顧客満足度スコアが大幅に向上します。`,
  },
  {
    title: "Precision Lead Generation and Content Pipelines for B2B Growth",
    title_ja: "B2Bエンタープライズ成長のための高精度リード獲得とコンテンツ・パイプライン",
    excerpt: "A field-tested framework for enterprise-grade lead generation in Dubai.",
    excerpt_ja: "ドバイの複雑な意思決定プロセスを攻略するための、精密なターゲティングとコンテンツアーキテクチャの実践的フレームワーク。",
    content: `# Precision Lead Generation and Content Pipelines for B2B Growth

Generating qualified B2B leads in the GCC requires a nuanced approach that respects relationship-building while leveraging modern digital infrastructure.

## The Content-to-Pipeline Architecture
High-value enterprise sales cannot be generated through generic lead forms. We implement a tiered content strategy: gated industry reports, localized case studies, and highly technical whitepapers. These assets serve as the cornerstone of our lead generation pipelines, capturing intent signals across the entire buyer's journey.

## Account-Based Marketing (ABM) Execution
By identifying the top 100 target accounts in the region, marketing and sales teams can align their efforts. IP-based personalization ensures that when a stakeholder from a target enterprise visits your site, they see content specifically tailored to their industry vertical and organizational challenges.`,
    content_ja: `# B2Bエンタープライズ成長のための高精度リード獲得とコンテンツ・パイプライン

GCC（湾岸協力会議）諸国で適格なB2Bリードを獲得するには、人間関係の構築を重視しつつ、現代のデジタルインフラを活用するという、ニュアンスに富んだアプローチが必要です。

## コンテンツからパイプラインへのアーキテクチャ
価値の高いエンタープライズ営業は、一般的なリード獲得フォームからは生まれません。私たちは段階的なコンテンツ戦略を実施しています。ゲート付きの業界レポート、ローカライズされた導入事例、高度に専門的なホワイトペーパーなどです。これらの資産はリード獲得パイプラインの基礎として機能し、購買プロセス全体で検索意図のシグナルを捉えます。

## アカウントベースドマーケティング（ABM）の実行
地域内の上位100のターゲットアカウントを特定することで、マーケティングチームと営業チームは取り組みを連携させることができます。IPベースのパーソナライゼーションにより、ターゲット企業のステークホルダーがサイトを訪れた際、彼らの属する業界や組織の課題に特化したコンテンツが表示されるようになります。`,
  },
  {
    title: "Integrated AI Marketing Operating System for Consumer Enterprises",
    title_ja: "消費者向け企業のための統合AIマーケティング・オペレーティングシステム",
    excerpt: "Advanced operating model for luxury hospitality and retail groups.",
    excerpt_ja: "ラグジュアリー・ホスピタリティや小売グループ向けの高度な運用モデル。分断されたデータを統合し、AIマーケティングを実現。",
    content: `# Integrated AI Marketing Operating System for Consumer Enterprises

Siloed marketing tools are the enemy of growth. Today's consumer enterprises require an integrated operating system that connects customer touchpoints into a unified intelligence graph.

## Unifying the Customer View
For luxury retail and hospitality, understanding the customer across offline boutiques, online platforms, and in-app interactions is critical. A modern AI marketing OS aggregates these data points, creating dynamic customer profiles that update in real-time.

## Automated Next-Best-Action
Instead of static marketing campaigns, an AI OS determines the "next best action" for each individual customer. Whether it's an exclusive invitation to a private viewing in Dubai Mall or a personalized offer for a staycation at Palm Jumeirah, the system autonomously orchestrates the outreach across the most effective channel.`,
    content_ja: `# 消費者向け企業のための統合AIマーケティング・オペレーティングシステム

サイロ化されたマーケティングツールは成長の敵です。今日の消費者向け企業には、顧客のタッチポイントを統合されたインテリジェンス・グラフへと接続する統合オペレーティングシステムが必要です。

## 顧客ビューの統合
ラグジュアリー小売やホスピタリティにおいて、オフラインのブティック、オンラインプラットフォーム、アプリ内でのインタラクション全体で顧客を理解することは極めて重要です。最新のAIマーケティングOSはこれらのデータポイントを集約し、リアルタイムで更新される動的な顧客プロファイルを作成します。

## 自動化された「ネクスト・ベスト・アクション」
静的なマーケティングキャンペーンの代わりに、AI OSは個々の顧客に対する「ネクスト・ベスト・アクション（次にとるべき最善の行動）」を決定します。ドバイモールでのプライベートビューイングへの限定招待であれ、パームジュメイラでのステイケーションのパーソナライズされたオファーであれ、システムは最も効果的なチャネルを通じてアプローチを自律的にオーケストレーションします。`,
  },
  {
    title: "From Discovery to Revenue: A Cross-Functional AIO Playbook",
    title_ja: "発見から収益へ：ドバイにおけるクロスファンクショナルなAIOプレイブック",
    excerpt: "Strategic roadmap for cross-functional teams to turn discovery into revenue.",
    excerpt_ja: "AIによる「発見」を継続的な収益に変えるため、マーケティング、営業、プロダクトチームが連携するための戦略ロードマップ。",
    content: `# From Discovery to Revenue: A Cross-Functional AIO Playbook

Optimizing for AI Answer Engines (AIO) is not solely a marketing function. It requires deep collaboration across product, sales, and customer success to turn discovery into measurable revenue.

## Aligning Teams
When an AI engine recommends your SaaS platform or enterprise service, the subsequent user journey must deliver on that promise. Sales teams need to understand the exact context of the AI-driven referral, while product teams must ensure the features highlighted by the AI are easily accessible and robust.

## The Feedback Loop
The most critical component of this playbook is the data feedback loop. Closed-won deal data must be fed back into the marketing architecture to refine the targeting criteria and content strategy. In Dubai's highly competitive environment, this continuous improvement cycle is the differentiator between market leaders and laggards.`,
    content_ja: `# 発見から収益へ：ドバイにおけるクロスファンクショナルなAIOプレイブック

AI回答エンジン（AIO）への最適化は、単なるマーケティング機能にとどまりません。発見を測定可能な収益に変えるには、プロダクト、営業、カスタマーサクセスといった部門を横断した深いコラボレーションが必要です。

## チームの連携
AIエンジンがあなたのSaaSプラットフォームやエンタープライズサービスを推奨した際、その後のユーザージャーニーはその約束を果たすものでなければなりません。営業チームはAIによるリファラルの正確なコンテキストを理解する必要があり、プロダクトチームはAIによって強調された機能が容易にアクセスでき、堅牢であることを保証しなければなりません。

## フィードバックループ
このプレイブックの最も重要な要素は、データのフィードバックループです。成約に至った商談のデータをマーケティング・アーキテクチャにフィードバックし、ターゲティング基準やコンテンツ戦略を洗練させる必要があります。ドバイの競争の激しい環境において、この継続的な改善サイクルこそが、市場のリーダーと出遅れる企業を分ける要因となります。`,
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
