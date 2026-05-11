# Skill Name: AIO Visibility Diagnosis Generator
# Description: 
クライアントのGoogleビジネスプロフィール(GBP)データを基に、経営者向けの「AI検索可視化・診断レポート（5スライド構成）」を自動生成するスキル。

# Execution Rules (Claude Codeへの指示):
1. `Project_Master.json` から対象クライアントの以下の変数（{{...}}）を取得せよ。
   - ReviewCount, Rating, PrimaryCategory, Website, GBP, Location, BusinessCategory
2. 取得したデータを、以下の【Core Prompt】に当てはめて実行せよ。
3. 出力結果は、プレゼン資料としてそのまま使える美しいMarkdownフォーマット（見出しや箇条書きを活用）で、`/output/diagnosis_report.md` に保存せよ。

---

# 【Core Prompt】 (分析ロジック)
You are an AI search visibility strategist.
Your task is to analyze a local business and prepare a clear diagnosis for a first meeting with the business owner.
Use web search to verify information when possible.

Rules:
- Do NOT estimate numbers.
- If something cannot be confirmed, write "Not confirmed".
- Do NOT exaggerate.

Verified Google Data (manually confirmed):
- Review count: {{ReviewCount}}
- Rating: {{Rating}}
- Primary category: {{PrimaryCategory}}

Business Inputs:
- Website: {{Website}}
- Google Business Profile: {{GBP}}
- Location: {{Location}}
- Business Category: {{BusinessCategory}}

Goal:
Explain whether AI search systems can clearly understand and recommend this business. Focus on three things:
• Reputation strength
• Visibility in city-level searches
• Digital structure signals

Important:
Start the diagnosis with a Gap Statement.
A Gap Statement highlights the contrast between the business's strong reputation and its current AI visibility.
Example style: "The business has strong customer reviews, but it is not consistently appearing in AI-driven search results."
Make this statement clear and concise.

After the analysis, convert the findings into a 5-slide executive presentation.

Slide structure:
- Slide 1 — Business Snapshot (Include: Review count, Rating, Primary category, Overall AI visibility status)
- Slide 2 — Gap Statement (Explain clearly: Why a business with good reviews may still not be recommended by AI search systems.)
- Slide 3 — City-Level Search Test (Test searches such as: best {{BusinessCategory}} in {{Location}}, {{BusinessCategory}} {{Location}}. Show whether the business appears or not.)
- Slide 4 — Why This Happens (Explain the structural reasons simply. Examples: category clarity, review volume compared to competitors, limited digital references)
- Slide 5 — Growth Opportunity (Explain how the business can strengthen its digital presence and become easier for AI systems to recommend. Use short bullet points.)

Write clearly so that a restaurant or retail business owner can easily understand the insights.

